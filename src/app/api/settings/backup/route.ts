import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json';

    try {
        if (format === 'json') {
            const data = await db.shop.findUnique({
                where: { id: session.shopId },
                include: {
                    stores: true,
                    products: { include: { category: true } },
                    customers: true,
                    sales: { include: { items: true } },
                    users: { select: { name: true, email: true, role: true, status: true } }
                }
            });
            return NextResponse.json(data);
        }

        if (format === 'csv') {
            const products = await db.product.findMany({
                where: { shopId: session.shopId },
                include: { category: true }
            });

            const headers = ['Name', 'Barcode', 'Category', 'Price', 'Cost Price', 'Stock', 'Tax Rate'];
            const rows = products.map((p: typeof products[number]) => [
                p.name,
                p.barcode || '',
                p.category?.name || 'General',
                p.price,
                p.costPrice || 0,
                p.stockQuantity,
                p.taxRate || 0
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map((r: (string | number)[]) => r.join(','))
            ].join('\n');

            return new NextResponse(csvContent, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="products_export.csv"`
                }
            });
        }

        return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    } catch (error) {
        console.error('Backup Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
