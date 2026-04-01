process.env.DATABASE_URL = "postgresql://craftory_admin:Craftory%40POS2026@localhost:5433/craftory_pos?schema=public";
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const categoriesDataPath = path.join(__dirname, 'src', 'lib', 'defaultCategoriesData.json');
const defaultCategories = JSON.parse(fs.readFileSync(categoriesDataPath, 'utf8'));

async function run() {
    console.log('--- PURGE AND MIGRATE PROCESS ---');
    try {
        const prodCount = await prisma.product.count();
        if (prodCount > 0) {
            console.log(`WARNING: Found ${prodCount} products. Just nullifying their category and subcategory links to prevent deletion errors.`);
            await prisma.product.updateMany({
                where: { categoryId: { not: null } },
                data: { categoryId: null, subcategoryId: null }
            });
        }

        console.log('1. Deleting all existing subcategories...');
        await prisma.subcategory.deleteMany({});
        
        console.log('2. Deleting all existing categories...');
        await prisma.category.deleteMany({});
        
        console.log('3. Triggering migration API logic directly...');
        // We replicate API logic here to seed the DB easily without hitting a localhost REST endpoint which might be down
        const keys = Object.keys(defaultCategories);
        const btMap = new Map();
        for (const k of keys) {
            const bt = await prisma.businessType.upsert({
                where: { name: k },
                update: {},
                create: { name: k }
            });
            btMap.set(k.toLowerCase(), bt.id);
        }

        const shops = await prisma.shop.findMany({ 
            select: { id: true, shopName: true, businessType: true, businessTypeId: true } 
        });
        
        for (const shop of shops) {
            const bTypeStr = shop.businessType || 'Other';
            let matchingKey = Object.keys(defaultCategories).find(k => k.toLowerCase() === bTypeStr.toLowerCase()) 
                || Object.keys(defaultCategories).find(k => bTypeStr.toLowerCase().includes(k.toLowerCase()))
                || Object.keys(defaultCategories).find(k => k.toLowerCase().includes(bTypeStr.toLowerCase()))
                || 'Other';

            const correctBtId = btMap.get(matchingKey.toLowerCase());
            if (correctBtId && shop.businessTypeId !== correctBtId) {
                await prisma.shop.update({
                    where: { id: shop.id },
                    data: { businessTypeId: correctBtId }
                });
            }

            const targetCategories = defaultCategories[matchingKey] || {};
            const categoryNames = Object.keys(targetCategories);
            
            let insertedCats = 0;
            let insertedSubcats = 0;

            for (const catName of categoryNames) {
                const newCat = await prisma.category.create({
                    data: {
                        name: catName,
                        shopId: shop.id,
                        businessTypeId: correctBtId || null,
                        icon: 'Package',
                        color: '#3B82F6',
                        status: 'ACTIVE',
                        level: 0
                    }
                });
                insertedCats++;

                const subcatNames = targetCategories[catName] || [];
                for (const subName of subcatNames) {
                    await prisma.subcategory.create({
                        data: {
                            subcategoryName: subName,
                            categoryId: newCat.id
                        }
                    });
                    insertedSubcats++;
                }
            }
            console.log(`Migrated Shop: ${shop.shopName} - Inserted: ${insertedCats} cats, ${insertedSubcats} subcats`);
        }
        console.log('--- PURGE AND MIGRATE SUCCESSFUL ---');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
