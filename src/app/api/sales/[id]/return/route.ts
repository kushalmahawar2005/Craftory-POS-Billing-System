import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: saleId } = await params;
    
    try {
        const body = await req.json();
        const { items, reason, notes, refundMethod, refundAmount } = body;

        // 1. Fetch sale and verify ownership
        const sale = await db.sale.findUnique({
            where: { id: saleId, shopId: session.shopId },
            include: { items: true }
        });

        if (!sale) return NextResponse.json({ error: 'Sale not found' }, { status: 404 });

        // 2. Check date (must be within 30 days)
        const daysSinceSale = (Date.now() - new Date(sale.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceSale > 30) {
            return NextResponse.json({ error: 'Sale is too old for return (max 30 days)' }, { status: 400 });
        }

        // 3. Generate Return Number
        const returnCount = await db.saleReturn.count({ where: { shopId: session.shopId } });
        const returnNumber = `RTN-${(returnCount + 1).toString().padStart(3, '0')}`;

        // 4. Start Transaction
        const result = await db.$transaction(async (tx: any) => {
            // Create the SaleReturn record
            const saleReturn = await tx.saleReturn.create({
                data: {
                    returnNumber,
                    saleId,
                    shopId: session.shopId,
                    storeId: session.storeId || sale.storeId,
                    processedBy: session.userId,
                    reason,
                    refundMethod,
                    refundAmount,
                    notes,
                    status: 'COMPLETED',
                }
            });

            const returnItemsData = [];
            
            for (const item of items) {
                const originalItem = sale.items.find((i: any) => i.productId === item.productId);
                if (!originalItem) throw new Error(`Product ${item.productId} was not part of original sale`);

                // Check previously returned items for this sale
                const previouslyReturned = await tx.saleReturnItem.aggregate({
                    where: { 
                        productId: item.productId,
                        return: { saleId, status: 'COMPLETED' }
                    },
                    _sum: { quantity: true }
                });
                const returnedQty = previouslyReturned._sum.quantity || 0;

                if (item.quantity + returnedQty > originalItem.quantity) {
                    throw new Error(`Total returned quantity exceeds original quantity for product ${originalItem.productId}`);
                }

                // Create SaleReturnItem
                const returnItem = await tx.saleReturnItem.create({
                    data: {
                        returnId: saleReturn.id,
                        saleItemId: originalItem.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: originalItem.price,
                        totalAmount: item.quantity * originalItem.price,
                        restockItem: item.restockItem !== false,
                    }
                });

                returnItemsData.push(returnItem);

                // Restock inventory if requested
                if (item.restockItem !== false) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stockQuantity: { increment: item.quantity } }
                    });

                    await tx.inventoryLog.create({
                        data: {
                            productId: item.productId,
                            changeType: 'ADD',
                            quantity: item.quantity,
                            reason: `Sale Return #${returnNumber}`,
                        }
                    });
                }
            }

            // Update Sale Status
            const allReturns = await tx.saleReturnItem.aggregate({
                where: { 
                    return: { saleId, status: 'COMPLETED' }
                },
                _sum: { quantity: true }
            });
            const totalUnitsReturned = (allReturns._sum.quantity || 0) + items.reduce((acc: number, cur: any) => acc + cur.quantity, 0);
            const totalUnitsOriginal = sale.items.reduce((acc: number, cur: any) => acc + cur.quantity, 0);

            let newStatus = 'PARTIAL_RETURN';
            if (totalUnitsReturned >= totalUnitsOriginal) {
                newStatus = 'RETURNED';
            }

            await tx.sale.update({
                where: { id: saleId },
                data: { status: newStatus }
            });

            return { saleReturn, items: returnItemsData, newStatus };
        });

        return NextResponse.json({ success: true, return: result.saleReturn });

    } catch (error: any) {
        console.error('Sale Return Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
