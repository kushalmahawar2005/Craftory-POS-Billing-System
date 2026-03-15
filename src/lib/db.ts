// ============================================
// DATABASE CONNECTION - Singleton Pattern
// ============================================
// This file creates a SINGLE database connection using pg and PrismaPg adapter 
// config (Prisma 7 requirement). Without this, Next.js hot reload 
// would create a new connection every time you save a file.
//
// Usage: import { db } from '@/lib/db';
//        const users = await db.user.findMany();

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Pass connection string mapped from the .env file
const connectionString = process.env.DATABASE_URL;

// Initialize Postgres Pool and Prisma Adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);

// Global declaration for TypeScript
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Reuse existing connection in development, create new in production
export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });

// In development, save the client to global so it survives hot reloads
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db;
}
