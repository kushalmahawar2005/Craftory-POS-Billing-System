import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    try {
        const where: any = { shopId: session.shopId };
        
        if (startDateStr && endDateStr) {
            where.createdAt = {
                gte: new Date(startDateStr),
                lte: new Date(endDateStr)
            };
        }

        const categories = await db.category.findMany({
            where: { shopId: session.shopId },
            include: {
                products: {
                    include: {
                        saleItems: {
                            where: {
                                sale: where
                            },
                            select: { total: true, quantity: true }
                        }
                    }
                }
            }
        });

        const report = categories.map(cat => {
            let totalSales = 0;
            let totalQuantity = 0;
            
            cat.products.forEach(prod => {
                prod.saleItems.forEach(item => {
                    totalSales += item.total;
                    totalQuantity += item.quantity;
                });
            });

            return {
                name: cat.name,
                sales: totalSales,
                quantity: totalQuantity
            };
        }).filter(c => c.sales > 0 || c.quantity > 0)
        .sort((a, b) => b.sales - a.sales);

        return NextResponse.json(report);
    } catch (error) {
        console.error('Category Wise Report Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
