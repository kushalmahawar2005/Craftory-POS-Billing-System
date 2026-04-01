import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

// Default categories per business type
const CATEGORIES_MAP: Record<string, string[]> = {
  'Grocery & Food Staples': ['Rice & Grains', 'Flour & Atta', 'Pulses & Dals', 'Cooking Oil & Ghee', 'Spices & Masala', 'Salt & Sugar', 'Dry Fruits & Nuts'],
  'Beverages': ['Tea & Coffee', 'Cold Drinks & Sodas', 'Juices', 'Energy Drinks', 'Water & Soda', 'Health Drinks'],
  'Snacks & Packaged Foods': ['Chips & Namkeen', 'Biscuits & Cookies', 'Chocolates & Candies', 'Instant Noodles', 'Ready to Eat', 'Breakfast Cereals'],
  'Dairy Products': ['Milk', 'Curd & Yogurt', 'Cheese & Paneer', 'Butter & Cream', 'Ice Cream', 'Milk Powder'],
  'Fruits & Vegetables': ['Fresh Fruits', 'Fresh Vegetables', 'Exotic Fruits', 'Herbs & Greens', 'Frozen Vegetables'],
  'Personal Care & Beauty': ['Skin Care', 'Hair Care', 'Oral Care', 'Fragrances', 'Cosmetics', 'Men\'s Grooming'],
  'Household & Cleaning': ['Detergents & Laundry', 'Cleaning Supplies', 'Kitchen Essentials', 'Air Fresheners', 'Trash Bags & Wraps'],
  'Baby Care': ['Diapers & Wipes', 'Baby Food', 'Baby Skin Care', 'Baby Clothing', 'Toys & Accessories'],
  'Pharmacy & Healthcare': ['Medicines', 'Medical Devices', 'Health Supplements', 'First Aid', 'Personal Hygiene', 'Ayurvedic Products'],
  'Electronics & Gadgets': ['Mobile Phones', 'Tablets', 'Wearable Tech', 'Audio & Headphones', 'Chargers & Cables', 'Smart Home'],
  'Computer & IT Accessories': ['Laptops & Desktops', 'Keyboards & Mice', 'Storage Devices', 'Networking', 'Printers & Scanners', 'Software'],
  'Clothing & Apparel': ['Men\'s Wear', 'Women\'s Wear', 'Kids\' Wear', 'Footwear', 'Ethnic Wear', 'Sportswear'],
  'Jewelry & Accessories': ['Gold Jewelry', 'Silver Jewelry', 'Artificial Jewelry', 'Watches', 'Bags & Wallets', 'Sunglasses'],
  'Furniture & Home Decor': ['Living Room', 'Bedroom', 'Office Furniture', 'Lighting', 'Home Decor', 'Curtains & Blinds'],
  'Hardware & Tools': ['Hand Tools', 'Power Tools', 'Fasteners', 'Paints & Coatings', 'Plumbing', 'Safety Equipment'],
  'Electrical Supplies': ['Wires & Cables', 'Switches & Sockets', 'Lighting & Fans', 'MCBs & Panels', 'Industrial Electricals'],
  'Stationery & Office Supplies': ['Writing Instruments', 'Paper & Notebooks', 'Office Supplies', 'Art Supplies', 'Desk Accessories'],
  'Books & Educational Items': ['Textbooks', 'Novels & Fiction', 'Children\'s Books', 'Competitive Exam', 'Educational Kits'],
  'Sports & Fitness': ['Cricket', 'Football', 'Gym Equipment', 'Fitness Accessories', 'Sports Apparel', 'Supplements'],
  'Automotive & Spare Parts': ['Engine Parts', 'Tyres & Tubes', 'Oils & Lubricants', 'Car Accessories', 'Bike Accessories', 'Batteries'],
  'Agriculture & Farming': ['Seeds', 'Fertilizers', 'Pesticides', 'Farming Tools', 'Irrigation Equipment', 'Animal Feed'],
  'Pet Supplies': ['Pet Food', 'Pet Toys', 'Pet Grooming', 'Pet Healthcare', 'Cages & Aquariums'],
  'Restaurant & Food Service': ['Kitchen Equipment', 'Tableware', 'Packaging Materials', 'Raw Ingredients', 'Beverages', 'Cleaning Supplies'],
  'Wholesale Bulk Goods': ['FMCG Products', 'Industrial Supplies', 'Raw Materials', 'Packaging', 'Bulk Food Items'],
  'Packaging & Logistics': ['Boxes & Cartons', 'Tapes & Labels', 'Bubble Wrap & Foam', 'Shipping Supplies', 'Pallets & Crates'],
};

async function main() {
  console.log('🌱 Seeding business types...');

  for (const name of BUSINESS_TYPES) {
    const bt = await prisma.businessType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    console.log(`  ✅ ${bt.name} (id: ${bt.id})`);
  }

  console.log(`\n✅ Seeded ${BUSINESS_TYPES.length} business types successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
