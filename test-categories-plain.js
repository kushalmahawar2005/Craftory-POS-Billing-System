
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

async function verifySeeding() {
  console.log('--- Hands-on Testing (Independent Client) Started ---');

  // 1. Get a shop to test with
  const shop = await prisma.shop.findFirst();
  if (!shop) {
    console.error('No shop found in database. Cannot test.');
    return;
  }
  const shopId = shop.id;
  console.log(`Testing with Shop: ${shop.shopName} (${shopId})`);

  // 2. Test Function: Seed for a specific business type
  async function testType(type, expectedCategories) {
    console.log(`\nTesting Business Type: ${type}`);
    
    // Set Shop Type
    await prisma.shop.update({ where: { id: shopId }, data: { businessType: type } });

    // Clear existing categories for this shop
    await prisma.category.deleteMany({ where: { shopId } });

    // Seeding Logic (Replicated from route.ts)
    const seedDataPath = path.join(process.cwd(), 'src/lib/data/categories.json');
    const allSeedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
    const seedData = allSeedData[type] || allSeedData['Other'] || [];

    const seedRecursive = async (items, parentId = null, level = 0) => {
      for (const item of items) {
        const created = await prisma.category.create({
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
    const created = await prisma.category.findMany({ where: { shopId } });
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
  .finally(() => prisma.$disconnect());
