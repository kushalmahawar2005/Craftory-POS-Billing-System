import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'summary'; // summary, sales_chart, inventory

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        if (type === 'summary') {
            const [
                todaySales,
                monthSales,
                lowStockCount,
                totalCustomers,
                totalProducts
            ] = await Promise.all([
                db.sale.aggregate({
                    where: { shopId: session.shopId, createdAt: { gte: today } },
                    _sum: { total: true },
                    _count: true
                }),
                db.sale.aggregate({
                    where: { shopId: session.shopId, createdAt: { gte: firstDayOfMonth } },
                    _sum: { total: true }
                }),
                db.product.count({
                    where: { shopId: session.shopId, stockQuantity: { lte: 10 } }
                }),
                db.customer.count({ where: { shopId: session.shopId } }),
                db.product.count({ where: { shopId: session.shopId } })
            ]);

            return NextResponse.json({
                todayRevenue: todaySales._sum.total || 0,
                todayOrders: todaySales._count || 0,
                monthRevenue: monthSales._sum.total || 0,
                lowStockItems: lowStockCount,
                activeCustomers: totalCustomers,
                totalSkus: totalProducts
            });
        }

        if (type === 'sales_chart') {
            // Last 7 days sales
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                d.setHours(0, 0, 0, 0);

                const nextD = new Date(d);
                nextD.setDate(nextD.getDate() + 1);

                const daySales = await db.sale.aggregate({
                    where: {
                        shopId: session.shopId,
                        createdAt: { gte: d, lt: nextD }
                    },
                    _sum: { total: true }
                });

                last7Days.push({
                    date: d.toLocaleDateString('en-IN', { weekday: 'short' }),
                    revenue: daySales._sum.total || 0
                });
            }
            return NextResponse.json(last7Days);
        }

        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    } catch (error) {
        console.error('Reports Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
