require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = {
  'Food & Beverage': [
    'Beverages', 'Snacks', 'Packaged Food', 'Dairy Products', 'Bakery',
    'Chocolates & Candies', 'Frozen Food', 'Ice Creams', 'Instant Noodles',
    'Juices & Syrups', 'Tea & Coffee', 'Condiments & Sauces', 'Spices',
    'Ready to Eat', 'Health Drinks', 'Organic Foods'
  ],
  'Kirana Store': [
    'Rice & Grains', 'Dals & Pulses', 'Cooking Oil & Ghee', 'Atta & Flours',
    'Salt, Sugar & Jaggery', 'Spices & Masalas', 'Dry Fruits & Nuts',
    'Tea, Coffee & Beverages', 'Snacks & Biscuits', 'Noodles & Pasta',
    'Soaps & Body Wash', 'Hair Care', 'Detergents & Dishwash', 'Oral Care',
    'Cleaning Essentials', 'Pooja Needs', 'Baby Care', 'Dairy & Eggs'
  ],
  'General Store': [
    'Groceries', 'Household Items', 'Stationery', 'Snacks & Beverages',
    'Personal Care', 'Cleaning Supplies', 'Health & OTC', 'Pooja Needs',
    'Pet Supplies', 'Toys & Games', 'Home Decor', 'Hardware Basics',
    'Plasticware', 'Footwear', 'Gifts & Accessories'
  ],
  'Supermarket': [
    'Fresh Produce', 'Dairy & Bakery', 'Staples & Grains', 'Snacks & Branded Foods',
    'Beverages', 'Personal Care & Grooming', 'Household & Cleaning', 'Meat & Seafood',
    'Frozen Foods', 'Baby Care', 'Pet Care', 'Home & Kitchen Appliances',
    'Apparel & Footwear', 'Toys & Games', 'Luggage & Bags', 'Stationery & Office',
    'Health & Wellness', 'Festive & Seasonal'
  ],
  'Pharmacy': [
    'Prescription Medicines', 'OTC Medicines', 'Vitamins & Supplements',
    'First Aid & Bandages', 'Pain Relief', 'Cold & Cough', 'Digestive Health',
    'Baby & Mother Care', 'Personal Hygiene', 'Skin Care & Derma',
    'Oral Care', 'Medical Devices & Equipments', 'Ayurvedic & Herbal',
    'Health Drinks & Nutrition', 'Sexual Wellness'
  ],
  'Restaurant / Cafe': [
    'Appetizers / Starters', 'Main Course', 'Breads & Rotis', 'Rice & Biryani',
    'Soups & Salads', 'Fast Food & Burgers', 'Pizzas & Pastas', 'Desserts & Sweets',
    'Hot Beverages', 'Cold Beverages & Shakes', 'Mocktails', 'Combos & Thalis',
    'Snacks & Sides', 'Ice Creams', 'Kids Menu'
  ],
  'Clothing & Apparel': [
    'Men\'s T-Shirts & Polos', 'Men\'s Shirts', 'Men\'s Trousers & Jeans',
    'Men\'s Ethnic Wear', 'Women\'s Tops & Tees', 'Women\'s Dresses',
    'Women\'s Ethnic Wear', 'Women\'s Bottoms', 'Kids Clothing',
    'Winter Wear', 'Activewear & Gym', 'Innerwear & Sleepwear',
    'Footwear', 'Accessories & Belts', 'Bags & Wallets', 'Jewellery'
  ],
  'Electronics': [
    'Smartphones', 'Laptops & Computers', 'Televisions', 'Audio & Headphones',
    'Cameras & Photography', 'Smartwatches & Wearables', 'Tablets',
    'Home Appliances', 'Kitchen Appliances', 'Gaming Consoles & Accessories',
    'Printers & Scanners', 'Computer Accessories', 'Cables & Chargers',
    'Storage Devices', 'Personal Care Appliances', 'Smart Home Devices'
  ],
  'Hardware': [
    'Power Tools', 'Hand Tools', 'Plumbing Supplies', 'Electrical Supplies',
    'Paints & Accessories', 'Screws, Nuts & Bolts', 'Building Materials',
    'Locks & Security', 'Gardening Tools', 'Safety Equipment',
    'Adhesives & Tapes', 'Lighting & Bulbs', 'Wires & Cables',
    'Bathroom Fittings', 'Wood & Carpentry Basics'
  ],
  'Stationery': [
    'Notebooks & Diaries', 'Pens & Pencils', 'Markers & Highlighters',
    'Art & Craft Supplies', 'Files & Folders', 'Desk Accessories',
    'Calculators', 'Paper & Envelopes', 'Geomtery & Math Tools',
    'Adhesives & Tapes', 'Gift Wrapping & Bags', 'Paints & Brushes',
    'Office Equipment', 'School Bags & Bottles', 'Exam Boards'
  ],
  'Cosmetics & Beauty': [
    'Makeup - Face', 'Makeup - Eyes', 'Makeup - Lips', 'Skincare - Face',
    'Skincare - Body', 'Hair Care & Styling', 'Fragrances & Perfumes',
    'Men\'s Grooming', 'Bath & Body', 'Nail Care & Polish',
    'Beauty Tools & Accessories', 'Herbal & Natural Beauty',
    'Sun Care', 'Masks & Peels', 'Gift Sets & Kits'
  ],
  'Mobile & Accessories': [
    'Smartphones - Android', 'Smartphones - iOS', 'Feature Phones',
    'Phone Cases & Covers', 'Screen Protectors & Glass', 'Chargers & Adapters',
    'Data Cables', 'Power Banks', 'Wired Earphones', 'TWS & Bluetooth Buds',
    'Headphones', 'Memory Cards', 'Mobile Stands & Holders',
    'Selfie Sticks & Tripods', 'Smartwatches', 'Repair Parts'
  ],
  'Jewelry & Accessories': [
    'Gold Rings', 'Gold Chains & Necklaces', 'Silver Jewelry', 'Diamond Jewelry',
    'Earrings', 'Bangles & Bracelets', 'Mangalsutras', 'Pendants',
    'Watches (Men)', 'Watches (Women)', 'Artificial / Imitation Jewelry',
    'Bridal Sets', 'Anklets', 'Nose Pins', 'Gemstones & Coins'
  ],
  'Other': [
    'General Category 1', 'General Category 2', 'General Category 3', 'Miscellaneous'
  ]
};

async function syncBusinessTypes() {
  console.log('Synchronizing Business Types Master List...');
  const keys = Object.keys(DEFAULT_CATEGORIES);
  const btMap = new Map();
  for (const k of keys) {
    const bt = await prisma.businessType.upsert({
      where: { name: k },
      update: {},
      create: { name: k }
    });
    btMap.set(k.toLowerCase(), bt.id);
  }
  return btMap;
}

async function main() {
  console.log('Starting Universal Category Seeding process...');
  
  const btMap = await syncBusinessTypes();

  // 1. Fetch all shops
  const shops = await prisma.shop.findMany({ select: { id: true, shopName: true, businessType: true, businessTypeId: true } });
  console.log(`Found ${shops.length} total shops to check...`);

  for (const shop of shops) {
    const bTypeStr = shop.businessType || 'Other';
    console.log(`\nProcessing Store: ${shop.shopName} [Type: ${bTypeStr}]`);
    
    // Find matching business type dictionary key
    let matchingKey = Object.keys(DEFAULT_CATEGORIES).find(k => k.toLowerCase() === bTypeStr.toLowerCase()) 
      || Object.keys(DEFAULT_CATEGORIES).find(k => bTypeStr.toLowerCase().includes(k.toLowerCase()))
      || Object.keys(DEFAULT_CATEGORIES).find(k => k.toLowerCase().includes(bTypeStr.toLowerCase()))
      || 'Other';
    
    const targetCategories = DEFAULT_CATEGORIES[matchingKey];
    console.log(` > Matched with Dictionary: "${matchingKey}" (${targetCategories.length} categories)`);

    // Ensure shop has the exact businessTypeId set correctly from the dictionary
    const correctBtId = btMap.get(matchingKey.toLowerCase());
    if (correctBtId && shop.businessTypeId !== correctBtId) {
      await prisma.shop.update({
        where: { id: shop.id },
        data: { businessTypeId: correctBtId }
      });
      console.log(`   * Synced Shop's businessTypeId to ${correctBtId} (${matchingKey})`);
    }

    // Retrieve their existing categories
    const existingCats = await prisma.category.findMany({
      where: { shopId: shop.id },
      select: { name: true }
    });
    const existingNames = new Set(existingCats.map(c => c.name.toLowerCase().trim()));

    // Seed missing categories
    let inserted = 0;
    for (const catName of targetCategories) {
      if (!existingNames.has(catName.toLowerCase().trim())) {
        await prisma.category.create({
          data: {
            name: catName,
            shopId: shop.id,
            businessTypeId: correctBtId || null,
            icon: 'Package',
            color: '#3B82F6', // Standard blue
            status: 'ACTIVE',
            level: 0
          }
        });
        inserted++;
      }
    }
    
    if (inserted > 0) {
      console.log(` > SUCCESS: Inserted ${inserted} new categories.`);
    } else {
      console.log(` > OK: Categories already fully seeded (Found ${existingCats.length}).`);
    }
  }

  console.log('\nAll categories universally seeded across all tenants successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
