// ============================================
// DATABASE CONNECTION TEST API
// ============================================
// Hit this endpoint to verify Prisma + PostgreSQL connection
// URL: GET /api/health
// Expected: { status: "ok", database: "connected", tables: {...} }

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Test the database connection
        const userCount = await db.user.count();
        const shopCount = await db.shop.count();
        const productCount = await db.product.count();
        const customerCount = await db.customer.count();
        const saleCount = await db.sale.count();
        const categoryCount = await db.category.count();

        return NextResponse.json({
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString(),
            tables: {
                users: userCount,
                shops: shopCount,
                products: productCount,
                customers: customerCount,
                sales: saleCount,
                categories: categoryCount,
            },
        });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json(
            {
                status: 'error',
                database: 'disconnected',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
