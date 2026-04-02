import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEFAULT_CATEGORIES } from '@/lib/defaultCategories';

export async function POST() {
  console.log('Starting Universal Category Seeding process via API...');

  try {
    // 1. Sync Business Types Dictionary
    console.log('Synchronizing Business Types Master List...');
    const keys = Object.keys(DEFAULT_CATEGORIES);
    const btMap = new Map();
    for (const k of keys) {
      const bt = await db.businessType.upsert({
        where: { name: k },
        update: {},
        create: { name: k }
      });
      btMap.set(k.toLowerCase(), bt.id);
    }

    // Purge legacy fallback categories (only 'General Category 1' etc)
    console.log('--- Purging Legacy Fallback Categories ---');
    await db.category.deleteMany({
      where: {
        name: { in: ['General Category 1', 'General Category 2', 'General Category 3', 'Miscellaneous'] }
      }
    });

    // 2. Fetch all shops
    const shops = await db.shop.findMany({ 
      select: { id: true, shopName: true, businessType: true } 
    });
    console.log(`Found ${shops.length} total shops to check...`);

    let totalInserted = 0;
    const results = [];

    for (const shop of shops) {
      const bTypeStr = shop.businessType || 'Other';
      console.log(`\nProcessing Store: ${shop.shopName} [Type: ${bTypeStr}]`);
      
      // Find matching business type dictionary key
      let matchingKey = Object.keys(DEFAULT_CATEGORIES).find(k => k.toLowerCase() === bTypeStr.toLowerCase()) 
        || Object.keys(DEFAULT_CATEGORIES).find(k => bTypeStr.toLowerCase().includes(k.toLowerCase()))
        || Object.keys(DEFAULT_CATEGORIES).find(k => k.toLowerCase().includes(bTypeStr.toLowerCase()))
        || 'Other';
      
      const targetCategories = DEFAULT_CATEGORIES[matchingKey] || {};
      const categoryNames = Object.keys(targetCategories);
      console.log(` > Matched with Dictionary: "${matchingKey}" (${categoryNames.length} categories)`);

      if (shop.businessType !== matchingKey) {
        await db.shop.update({
          where: { id: shop.id },
          data: { businessType: matchingKey }
        });
        console.log(`   * Synced Shop's businessType to ${matchingKey}`);
      }

      // Retrieve their existing categories
      const existingCats = await db.category.findMany({
        where: { shopId: shop.id },
        select: { id: true, name: true }
      });
      const existingCatsMap = new Map(existingCats.map(c => [c.name.toLowerCase().trim(), c.id]));

      // Clean existing subcategories mapping to prevent duplicates on repeat seeding
      const existingSubcats = await db.category.findMany({
        where: { parentId: { in: Array.from(existingCatsMap.values()) } },
        select: { id: true, name: true, parentId: true }
      });
      const existingSubcatsMap = new Map();
      existingSubcats.forEach(sub => {
        if (sub.parentId) {
          existingSubcatsMap.set(`${sub.parentId}_${sub.name.toLowerCase().trim()}`, sub.id);
        }
      });

      // Seed missing categories and subcategories
      let insertedCats = 0;
      let insertedSubcats = 0;

      for (const catName of categoryNames) {
        let catId = existingCatsMap.get(catName.toLowerCase().trim());

        if (!catId) {
          const newCat = await db.category.create({
            data: {
              name: catName,
              shopId: shop.id,
              icon: 'Package',
              color: '#3B82F6', // Standard blue
              status: 'ACTIVE',
              level: 0
            }
          });
          catId = newCat.id;
          insertedCats++;
          totalInserted++;
        }

        // Now process subcategories for this category
        const subcatNames = targetCategories[catName] || [];
        for (const subName of subcatNames) {
          const subKey = `${catId}_${subName.toLowerCase().trim()}`;
          if (!existingSubcatsMap.has(subKey)) {
            await db.category.create({
              data: {
                name: subName,
                shopId: shop.id,
                parentId: catId,
                icon: 'Package',
                color: '#3B82F6',
                status: 'ACTIVE',
                level: 1
              }
            });
            insertedSubcats++;
          }
        }
      }
      
      results.push({
        shop: shop.shopName,
        type: matchingKey,
        insertedCats: insertedCats,
        insertedSubcats: insertedSubcats,
        existing: existingCats.length,
      });

      if (insertedCats > 0 || insertedSubcats > 0) {
        console.log(` > SUCCESS: Inserted ${insertedCats} new categories and ${insertedSubcats} subcategories.`);
      } else {
        console.log(` > OK: Categories/Subcategories already fully seeded.`);
      }
    }

    console.log('\nAll categories universally seeded across all tenants successfully!');
    return NextResponse.json({ success: true, totalInserted, details: results });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
