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
                totalProducts,
                purchaseValue,
                creditSummary,
                todayReturns,
                monthReturns
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
                db.product.count({ where: { shopId: session.shopId } }),
                db.purchaseOrder.aggregate({
                    where: { shopId: session.shopId, status: 'COMPLETED', createdAt: { gte: firstDayOfMonth } },
                    _sum: { totalAmount: true }
                }),
                db.customer.aggregate({
                    where: { shopId: session.shopId },
                    _sum: { currentBalance: true }
                }),
                db.saleReturn.aggregate({
                    where: { shopId: session.shopId, createdAt: { gte: today } },
                    _sum: { refundAmount: true }
                }),
                db.saleReturn.aggregate({
                    where: { shopId: session.shopId, createdAt: { gte: firstDayOfMonth } },
                    _sum: { refundAmount: true }
                })
            ]);

            return NextResponse.json({
                todayRevenue: todaySales._sum.total || 0,
                todayOrders: todaySales._count || 0,
                monthRevenue: monthSales._sum.total || 0,
                monthPurchases: purchaseValue._sum.totalAmount || 0,
                lowStockItems: lowStockCount,
                activeCustomers: totalCustomers,
                totalSkus: totalProducts,
                outstandingCredit: creditSummary._sum.currentBalance || 0,
                returnsToday: todayReturns._sum.refundAmount || 0,
                returnsMonth: monthReturns._sum.refundAmount || 0
            });
        }

        if (type === 'sales_chart') {
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                d.setHours(0, 0, 0, 0);
                const nextD = new Date(d);
                nextD.setDate(nextD.getDate() + 1);

                const daySales = await db.sale.aggregate({
                    where: { shopId: session.shopId, createdAt: { gte: d, lt: nextD } },
                    _sum: { total: true }
                });

                last7Days.push({
                    date: d.toLocaleDateString('en-IN', { weekday: 'short' }),
                    revenue: daySales._sum.total || 0
                });
            }
            return NextResponse.json(last7Days);
        }

        if (type === 'top_products') {
            const last30Days = new Date();
            last30Days.setDate(last30Days.getDate() - 30);

            const items = await db.saleItem.groupBy({
                by: ['productId'],
                where: { 
                    sale: { 
                        shopId: session.shopId,
                        createdAt: { gte: last30Days }
                    } 
                },
                _sum: { quantity: true, total: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 10
            });

            const enriched = await Promise.all(items.map(async (item: typeof items[number]) => {
                const product = await db.product.findUnique({
                    where: { id: item.productId },
                    select: { 
                        name: true, 
                        stockQuantity: true,
                        category: { select: { name: true } }
                    }
                });
                return {
                    name: product?.name || 'Unknown',
                    category: product?.category?.name || 'General',
                    sold: item._sum.quantity || 0,
                    revenue: item._sum.total || 0,
                    stock: product?.stockQuantity || 0
                };
            }));

            return NextResponse.json(enriched);
        }

        if (type === 'recent_sales') {
            const sales = await db.sale.findMany({
                where: { shopId: session.shopId },
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: {
                    customer: { select: { name: true } },
                    _count: { select: { items: true } }
                }
            });

            const formatted = sales.map((sale: typeof sales[number]) => ({
                id: sale.id,
                invoiceNumber: sale.invoiceNumber,
                customerName: sale.customer?.name || 'Walk-in Customer',
                total: sale.total,
                paymentMethod: sale.paymentMethod,
                createdAt: sale.createdAt,
                itemsCount: sale._count.items
            }));

            return NextResponse.json(formatted);
        }

        if (type === 'best_sellers') {
            const items = await db.saleItem.groupBy({
                by: ['productId'],
                where: { sale: { shopId: session.shopId } },
                _sum: { quantity: true, total: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5
            });

            const enriched = await Promise.all(items.map(async (item: typeof items[number]) => {
                const product = await db.product.findUnique({
                    where: { id: item.productId },
                    select: { name: true }
                });
                return {
                    name: product?.name || 'Unknown',
                    sold: item._sum.quantity || 0,
                    revenue: item._sum.total || 0
                };
            }));

            return NextResponse.json(enriched);
        }

        if (type === 'categories') {
            const categories = await db.category.findMany({
                where: { shopId: session.shopId },
                include: {
                    products: {
                        include: {
                            saleItems: {
                                select: { total: true }
                            }
                        }
                    }
                }
            });

            const data = categories.map((cat: typeof categories[number]) => ({
                name: cat.name,
                value: cat.products.reduce((acc: number, prod: typeof cat.products[number]) => 
                    acc + prod.saleItems.reduce((accI: number, si: { total: number }) => accI + si.total, 0), 0)
            })).filter((c: { name: string; value: number }) => c.value > 0);

            return NextResponse.json(data);
        }

        if (type === 'low_stock') {
            const products = await db.product.findMany({
                where: { shopId: session.shopId, stockQuantity: { lte: 10 } },
                orderBy: { stockQuantity: 'asc' },
                take: 5,
                select: { id: true, name: true, stockQuantity: true }
            });
            return NextResponse.json(products);
        }

        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    } catch (error) {
        console.error('Reports Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
