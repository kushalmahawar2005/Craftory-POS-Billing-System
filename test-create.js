const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();
const prisma = new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL })) });

async function createTarget() {
    const shop = await prisma.shop.create({
        data: { shopName: "Craftory Studio", ownerName: "Craftory", email: "craftorystudio046@gmail.com" }
    });

    await prisma.user.create({
        data: {
            name: "Craftory Admin",
            email: "craftorystudio046@gmail.com",
            passwordHash: "dummyhashedpass",
            role: "ADMIN",
            shopId: shop.id
        }
    });
    console.log("Created test user: craftorystudio046@gmail.com");
}

createTarget().finally(() => prisma.$disconnect());
