import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { supplierId, items, status } = await req.json(); // status: PENDING or COMPLETED

        const result = await db.$transaction(async (tx: any) => {
            // 1. Create Purchase Order
            const totalAmount = items.reduce((acc: number, item: any) => acc + (item.costPrice * item.quantity), 0);

            const po = await tx.purchaseOrder.create({
                data: {
                    supplierId,
                    shopId: session.shopId,
                    totalAmount,
                    status: status || 'PENDING',
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            costPrice: item.costPrice
                        }))
                    }
                },
                include: { items: true }
            });

            // 2. If COMPLETED, update stock immediately
            if (status === 'COMPLETED') {
                for (const item of items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stockQuantity: { increment: item.quantity },
                            costPrice: item.costPrice // Auto-update cost price with latest purchase
                        }
                    });

                    await tx.inventoryLog.create({
                        data: {
                            productId: item.productId,
                            changeType: 'ADD',
                            quantity: item.quantity,
                            reason: `Purchase Order #${po.id}`,
                        }
                    });
                }
            }

            return po;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Purchase Order Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const orders = await db.purchaseOrder.findMany({
            where: { shopId: session.shopId },
            include: { supplier: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
