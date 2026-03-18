import dotenv from 'dotenv';
dotenv.config();

import { db } from './src/lib/db';
import fs from 'fs';
import path from 'path';

async function verifySeeding() {
  console.log('--- Hands-on Testing Started ---');

  // 1. Get a shop to test with
  const shop = await db.shop.findFirst();
  if (!shop) {
    console.error('No shop found in database. Cannot test.');
    return;
  }
  const shopId = shop.id;
  console.log(`Testing with Shop: ${shop.shopName} (${shopId})`);

  // 2. Test Function: Seed for a specific business type
  async function testType(type: string, expectedCategories: string[]) {
    console.log(`\nTesting Business Type: ${type}`);
    
    // Set Shop Type
    await db.shop.update({ where: { id: shopId }, data: { businessType: type } });

    // Clear existing categories for this shop
    await db.category.deleteMany({ where: { shopId } });

    // Seeding Logic (Replicated from route.ts)
    const seedDataPath = path.join(process.cwd(), 'src/lib/data/categories.json');
    const allSeedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
    const seedData = allSeedData[type] || allSeedData['Other'] || [];

    const seedRecursive = async (items: any[], parentId: string | null = null, level: number = 0) => {
      for (const item of items) {
        const created = await db.category.create({
          data: {
            name: item.name,
            icon: item.icon || 'Grid3X3',
            color: item.color || '#94a3b8',
            shopId: shopId,
            parentId: parentId,
            level: level,
            status: 'ACTIVE'
          }
        });
        if (item.children && Array.isArray(item.children)) {
          await seedRecursive(item.children, created.id, level + 1);
        }
      }
    };
    await seedRecursive(seedData);

    // Verify
    const created = await db.category.findMany({ where: { shopId } });
    const createdNames = created.map(c => c.name);
    console.log('Created Categories:', createdNames.join(', '));

    const allPresent = expectedCategories.every(exp => createdNames.includes(exp));
    if (allPresent) {
      console.log(`✅ SUCCESS: All ${type} categories present.`);
    } else {
      console.error(`❌ FAILURE: Some ${type} categories missing.`);
    }
  }

  // Run Tests
  try {
    await testType('Restaurant', ['Beverages', 'Pizza', 'Meals', 'Snacks']);
    await testType('Pharmacy', ['Medicines', 'Personal Care']);
  } catch (err) {
    console.error('Test Error:', err);
  }

  console.log('\n--- Hands-on Testing Finished ---');
}

verifySeeding()
  .catch(e => console.error(e))
  .finally(() => process.exit(0));
