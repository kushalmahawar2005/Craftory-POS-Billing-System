import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const adjustments = await db.inventoryAdjustment.findMany({
            where: { shopId: session.shopId },
            include: {
                staff: { select: { name: true } },
                items: {
                    include: {
                        product: { select: { name: true } }
                    }
                }
            },
            orderBy: { adjustmentDate: 'desc' },
        });
        return NextResponse.json(adjustments);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { reason, note, items } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'At least one item is required' }, { status: 400 });
        }

        const result = await db.$transaction(async (tx) => {
            // 1. Create the adjustment record
            const adjustment = await tx.inventoryAdjustment.create({
                data: {
                    reason,
                    note,
                    shopId: session.shopId,
                    staffId: session.userId,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            quantityChange: item.quantityChange,
                        })),
                    },
                },
            });

            // 2. Update stock for each product
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQuantity: {
                            increment: item.quantityChange,
                        },
                    },
                });

                // 3. Optional: Add to inventory logs
                await tx.inventoryLog.create({
                    data: {
                        productId: item.productId,
                        changeType: item.quantityChange > 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT',
                        quantity: Math.abs(item.quantityChange),
                        reason: `Adjustment: ${reason} (Ref: ${adjustment.id})`,
                    }
                });
            }

            return adjustment;
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Adjustment error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
