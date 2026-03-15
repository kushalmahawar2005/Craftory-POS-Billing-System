import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const limit = parseInt(searchParams.get('limit') || '50');

    try {
        const where: any = { product: { shopId: session.shopId } };
        if (productId) where.productId = productId;

        const logs = await db.inventoryLog.findMany({
            where,
            include: { product: { select: { name: true, barcode: true } } },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Manual adjustment
export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { productId, quantity, changeType, reason } = await req.json();

        const product = await db.product.findUnique({
            where: { id: productId, shopId: session.shopId }
        });
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        const updated = await db.$transaction(async (tx: any) => {
            const p = await tx.product.update({
                where: { id: productId },
                data: {
                    stockQuantity: changeType === 'ADD'
                        ? { increment: quantity }
                        : { decrement: quantity }
                }
            });

            await tx.inventoryLog.create({
                data: {
                    productId,
                    changeType,
                    quantity,
                    reason,
                }
            });

            return p;
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
