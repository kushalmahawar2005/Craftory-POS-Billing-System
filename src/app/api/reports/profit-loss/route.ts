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

        const [sales, purchases] = await Promise.all([
            db.sale.aggregate({
                where,
                _sum: { total: true }
            }),
            db.purchaseOrder.aggregate({
                where: { ...where, status: 'COMPLETED' },
                _sum: { totalAmount: true }
            })
        ]);

        const revenue = sales._sum.total || 0;
        const expenses = purchases._sum.totalAmount || 0;
        const netProfit = revenue - expenses;

        return NextResponse.json({
            revenue,
            expenses,
            netProfit,
            margin: revenue > 0 ? (netProfit / revenue) * 100 : 0
        });
    } catch (error) {
        console.error('P&L Report Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
