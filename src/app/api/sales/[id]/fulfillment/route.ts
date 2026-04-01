import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;

    try {
        const { orderStatus, deliveryPartner, trackingId } = await req.json();

        // Validate status
        const validStatuses = ['PENDING', 'CONFIRMED', 'PACKING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (orderStatus && !validStatuses.includes(orderStatus)) {
            return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
        }

        const sale = await db.sale.update({
            where: { 
                id,
                shopId: session.shopId // Security check
            },
            data: {
                ...(orderStatus && { orderStatus }),
                ...(deliveryPartner !== undefined && { deliveryPartner }),
                ...(trackingId !== undefined && { trackingId }),
            }
        });

        return NextResponse.json({ success: true, sale });
    } catch (error) {
        console.error('Fulfillment Update Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
