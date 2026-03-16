const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@craftory.com';
  const password = 'password123';
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    let shop = await prisma.shop.findFirst();
    if (!shop) {
      shop = await prisma.shop.create({
        data: {
          shopName: 'Craftory POS Store',
          ownerName: 'Admin',
          email: 'admin@craftory.com',
          phone: '1234567890',
        }
      });
    }

    let store = await prisma.store.findFirst({ where: { shopId: shop.id } });
    if (!store) {
      store = await prisma.store.create({
        data: {
          name: 'Main Branch',
          shopId: shop.id,
        }
      });
    }

    const user = await prisma.user.upsert({
      where: { email: email },
      update: {
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
      },
      create: {
        name: 'Admin User',
        email: email,
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
        shopId: shop.id,
        storeId: store.id,
      },
    });

    console.log('--- ADMIN LOGIN DETAILS ---');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('---------------------------');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
