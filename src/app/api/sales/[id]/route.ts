import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

// GET: Fetch single sale (Invoice) details
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;

    try {
        const sale = await db.sale.findUnique({
            where: { id, shopId: session.shopId },
            include: {
                customer: true,
                staff: { select: { name: true } },
                items: {
                    include: { product: { select: { name: true, barcode: true } } }
                }
            }
        });

        if (!sale) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

        return NextResponse.json(sale);
    } catch (error) {
        console.error('Fetch Sale Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
