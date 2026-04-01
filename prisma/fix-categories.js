require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
console.log('Connecting to:', connectionString ? connectionString.substring(0, 40) + '...' : 'NOT SET');

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

const JEWELRY_CATEGORIES = [
  'Gold Jewelry', 'Silver Jewelry', 'Artificial Jewelry', 
  'Watches', 'Bags & Wallets', 'Sunglasses'
];

async function main() {
  // Test connection
  const { rows: testRows } = await pool.query('SELECT NOW()');
  console.log('Connected at:', testRows[0].now);

  const { rows: btRows } = await pool.query(
    `SELECT id FROM business_types WHERE name = 'Jewelry & Accessories'`
  );
  if (btRows.length === 0) { console.error('Jewelry type not found!'); process.exit(1); }
  const jewelryTypeId = btRows[0].id;
  console.log(`Jewelry business type ID: ${jewelryTypeId}`);

  const { rows: allShops } = await pool.query(`SELECT id, "shopName", "businessTypeId" FROM shops`);
  
  for (const shop of allShops) {
    const btId = shop.businessTypeId || jewelryTypeId;
    console.log(`\nShop: ${shop.shopName} (businessTypeId: ${shop.businessTypeId || 'NULL -> setting to ' + btId})`);
    
    // If shop has no businessTypeId, set it
    if (!shop.businessTypeId) {
      await pool.query(
        `UPDATE shops SET "businessTypeId" = $1 WHERE id = $2`,
        [btId, shop.id]
      );
      console.log(`  Set shop businessTypeId to ${btId}`);
    }
    
    // Update all existing categories to have businessTypeId
    const { rowCount } = await pool.query(
      `UPDATE categories SET "businessTypeId" = $1 WHERE "shopId" = $2 AND "businessTypeId" IS NULL`,
      [btId, shop.id]
    );
    console.log(`  Updated ${rowCount} categories with businessTypeId`);
    
    // If jewelry shop, seed jewelry categories
    if (btId === jewelryTypeId) {
      const { rows: existing } = await pool.query(
        `SELECT name FROM categories WHERE "shopId" = $1`, [shop.id]
      );
      const names = new Set(existing.map(c => c.name));
      
      for (const catName of JEWELRY_CATEGORIES) {
        if (!names.has(catName)) {
          await pool.query(
            `INSERT INTO categories (id, name, "shopId", "businessTypeId", icon, color, status, level, "createdAt", "updatedAt") 
             VALUES (gen_random_uuid()::text, $1, $2, $3, 'Package', '#7C3AED', 'ACTIVE', 0, NOW(), NOW())`,
            [catName, shop.id, btId]
          );
          console.log(`  + Created: ${catName}`);
        } else {
          console.log(`  = Already exists: ${catName}`);
        }
      }
    }
  }
  
  // Show final state
  const { rows: finalCats } = await pool.query(`SELECT c.name, c."businessTypeId", bt.name as bt_name FROM categories c LEFT JOIN business_types bt ON c."businessTypeId" = bt.id ORDER BY c.name`);
  console.log('\nFinal categories:');
  finalCats.forEach(c => console.log(`  ${c.name} -> ${c.bt_name || 'NO TYPE'}`));
  
  console.log('\nDone!');
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
