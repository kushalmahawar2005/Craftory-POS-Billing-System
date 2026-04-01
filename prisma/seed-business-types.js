require('dotenv').config();
const { Pool } = require('pg');

const BUSINESS_TYPES = [
  'Grocery & Food Staples',
  'Beverages',
  'Snacks & Packaged Foods',
  'Dairy Products',
  'Fruits & Vegetables',
  'Personal Care & Beauty',
  'Household & Cleaning',
  'Baby Care',
  'Pharmacy & Healthcare',
  'Electronics & Gadgets',
  'Computer & IT Accessories',
  'Clothing & Apparel',
  'Jewelry & Accessories',
  'Furniture & Home Decor',
  'Hardware & Tools',
  'Electrical Supplies',
  'Stationery & Office Supplies',
  'Books & Educational Items',
  'Sports & Fitness',
  'Automotive & Spare Parts',
  'Agriculture & Farming',
  'Pet Supplies',
  'Restaurant & Food Service',
  'Wholesale Bulk Goods',
  'Packaging & Logistics',
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  console.log('Seeding business types...');
  
  for (const name of BUSINESS_TYPES) {
    try {
      await pool.query(
        `INSERT INTO business_types (name, "createdAt", "updatedAt") VALUES ($1, NOW(), NOW()) ON CONFLICT (name) DO NOTHING`,
        [name]
      );
      console.log(`  OK: ${name}`);
    } catch (e) {
      console.error(`  FAIL: ${name}`, e.message);
    }
  }

  const { rows } = await pool.query('SELECT COUNT(*) FROM business_types');
  console.log(`\nTotal business types in DB: ${rows[0].count}`);
  
  await pool.end();
}

main().catch(e => {
  console.error('Seed error:', e);
  process.exit(1);
});
