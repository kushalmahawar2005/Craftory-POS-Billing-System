import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

const CATEGORIES_MAP: Record<string, string[]> = {
    'Grocery & Food Staples': ['Rice & Grains', 'Flour & Atta', 'Pulses & Dals', 'Cooking Oil & Ghee', 'Spices & Masala', 'Salt & Sugar', 'Dry Fruits & Nuts'],
    'Beverages': ['Tea & Coffee', 'Cold Drinks & Sodas', 'Juices', 'Energy Drinks', 'Water & Soda', 'Health Drinks'],
    'Snacks & Packaged Foods': ['Chips & Namkeen', 'Biscuits & Cookies', 'Chocolates & Candies', 'Instant Noodles', 'Ready to Eat', 'Breakfast Cereals'],
    'Dairy Products': ['Milk', 'Curd & Yogurt', 'Cheese & Paneer', 'Butter & Cream', 'Ice Cream', 'Milk Powder'],
    'Fruits & Vegetables': ['Fresh Fruits', 'Fresh Vegetables', 'Exotic Fruits', 'Herbs & Greens', 'Frozen Vegetables'],
    'Personal Care & Beauty': ['Skin Care', 'Hair Care', 'Oral Care', 'Fragrances', 'Cosmetics', "Men's Grooming"],
    'Household & Cleaning': ['Detergents & Laundry', 'Cleaning Supplies', 'Kitchen Essentials', 'Air Fresheners', 'Trash Bags & Wraps'],
    'Baby Care': ['Diapers & Wipes', 'Baby Food', 'Baby Skin Care', 'Baby Clothing', 'Toys & Accessories'],
    'Pharmacy & Healthcare': ['Medicines', 'Medical Devices', 'Health Supplements', 'First Aid', 'Personal Hygiene', 'Ayurvedic Products'],
    'Electronics & Gadgets': ['Mobile Phones', 'Tablets', 'Wearable Tech', 'Audio & Headphones', 'Chargers & Cables', 'Smart Home'],
    'Computer & IT Accessories': ['Laptops & Desktops', 'Keyboards & Mice', 'Storage Devices', 'Networking', 'Printers & Scanners', 'Software'],
    'Clothing & Apparel': ["Men's Wear", "Women's Wear", "Kids' Wear", 'Footwear', 'Ethnic Wear', 'Sportswear'],
    'Jewelry & Accessories': ['Gold Jewelry', 'Silver Jewelry', 'Artificial Jewelry', 'Watches', 'Bags & Wallets', 'Sunglasses'],
    'Furniture & Home Decor': ['Living Room', 'Bedroom', 'Office Furniture', 'Lighting', 'Home Decor', 'Curtains & Blinds'],
    'Hardware & Tools': ['Hand Tools', 'Power Tools', 'Fasteners', 'Paints & Coatings', 'Plumbing', 'Safety Equipment'],
    'Electrical Supplies': ['Wires & Cables', 'Switches & Sockets', 'Lighting & Fans', 'MCBs & Panels', 'Industrial Electricals'],
    'Stationery & Office Supplies': ['Writing Instruments', 'Paper & Notebooks', 'Office Supplies', 'Art Supplies', 'Desk Accessories'],
    'Books & Educational Items': ['Textbooks', 'Novels & Fiction', "Children's Books", 'Competitive Exam', 'Educational Kits'],
    'Sports & Fitness': ['Cricket', 'Football', 'Gym Equipment', 'Fitness Accessories', 'Sports Apparel', 'Supplements'],
    'Automotive & Spare Parts': ['Engine Parts', 'Tyres & Tubes', 'Oils & Lubricants', 'Car Accessories', 'Bike Accessories', 'Batteries'],
    'Agriculture & Farming': ['Seeds', 'Fertilizers', 'Pesticides', 'Farming Tools', 'Irrigation Equipment', 'Animal Feed'],
    'Pet Supplies': ['Pet Food', 'Pet Toys', 'Pet Grooming', 'Pet Healthcare', 'Cages & Aquariums'],
    'Restaurant & Food Service': ['Kitchen Equipment', 'Tableware', 'Packaging Materials', 'Raw Ingredients', 'Beverages', 'Cleaning Supplies'],
    'Wholesale Bulk Goods': ['FMCG Products', 'Industrial Supplies', 'Raw Materials', 'Packaging', 'Bulk Food Items'],
    'Packaging & Logistics': ['Boxes & Cartons', 'Tapes & Labels', 'Bubble Wrap & Foam', 'Shipping Supplies', 'Pallets & Crates'],
};

// GET: trigger migration (easy to call from browser)
// Usage: /api/migrate-categories?type=Jewelry%20%26%20Accessories
export async function GET(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get('type') || 'Jewelry & Accessories';

    try {
        // Find the business type
        const businessType = await db.businessType.findFirst({
            where: { name: { contains: typeParam, mode: 'insensitive' } }
        });

        if (!businessType) {
            return NextResponse.json({ error: `Business type "${typeParam}" not found` }, { status: 404 });
        }

        // Force-set the shop's businessTypeId
        await db.shop.update({
            where: { id: session.shopId },
            data: { 
                businessTypeId: businessType.id,
                businessType: businessType.name
            }
        });

        const categories = CATEGORIES_MAP[businessType.name];
        if (!categories) {
            return NextResponse.json({ error: `No categories mapped for: ${businessType.name}` }, { status: 400 });
        }

        // Delete old categories with no products
        const oldCats = await db.category.findMany({
            where: { shopId: session.shopId },
            include: { _count: { select: { products: true } } }
        });

        let deleted = 0;
        for (const cat of oldCats) {
            if (cat._count.products === 0) {
                await db.category.delete({ where: { id: cat.id } });
                deleted++;
            }
        }

        // Create the correct categories
        let created = 0;
        for (const catName of categories) {
            await db.category.create({
                data: {
                    name: catName,
                    shopId: session.shopId,
                    businessTypeId: businessType.id,
                    icon: 'Package',
                    color: '#7C3AED',
                    status: 'ACTIVE',
                    level: 0,
                }
            });
            created++;
        }

        return NextResponse.json({
            success: true,
            businessType: businessType.name,
            businessTypeId: businessType.id,
            deletedOldCategories: deleted,
            createdNewCategories: created,
            categories,
        });
    } catch (error: any) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    return GET(req);
}
