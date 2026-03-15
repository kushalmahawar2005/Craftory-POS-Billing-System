// Use commonjs syntax for quick test script execution
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Database connection established.");

    // Clean up if the test user exists (from previous runs)
    await prisma.user.deleteMany({ where: { email: 'admin@craftory.test' } });

    // 1. Insert Data (Write Test)
    console.log("Creating a test user...");
    const user = await prisma.user.create({
        data: {
            name: 'System Admin',
            email: 'admin@craftory.test',
            password: 'hashedpassword_placeholder',
            phone: '+919876543210'
        }
    });
    console.log("✅ User created successfully! ID:", user.id);

    // 2. Fetch Data (Read Test)
    const count = await prisma.user.count();
    console.log("✅ Total users in database:", count);
}

main()
    .catch((e) => {
        console.error("❌ Test Failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("Test finished.");
    });
