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

        const sales = await db.sale.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                customer: { select: { name: true } }
            }
        });

        const gstReport = sales.map((sale: typeof sales[number]) => {
            // Calculate GST breakdown if not directly stored
            // Assuming tax is stored as totalGst or we can calculate from items
            // For now, let's use a simplified calculation or existing fields
            const taxableAmount = sale.subtotal;
            const cgst = sale.tax / 2;
            const sgst = sale.tax / 2;
            const igst = 0; // Simplified
            
            return {
                id: sale.id,
                invoiceNumber: sale.invoiceNumber,
                date: sale.createdAt,
                customerName: sale.customer?.name || 'Walk-in',
                customerGstin: '', // Removed from schema
                taxableAmount,
                cgst,
                sgst,
                igst,
                totalGst: sale.tax,
                totalAmount: sale.total
            };
        });

        return NextResponse.json(gstReport);
    } catch (error) {
        console.error('GST Report Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
