import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const data = await req.json();
        const {
            items, // array of { productId, quantity, price }
            customerId,
            paymentMethod,
            subtotal,
            tax,
            discount,
            total,
            customerPhone, // fallback if customerId not provided
            customerName
        } = data;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in sale' }, { status: 400 });
        }

        // Generate a unique invoice number
        const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const result = await db.$transaction(async (tx: any) => {
            // 1. Handle Customer (Create if doesn't exist)
            let finalCustomerId = customerId;
            if (!finalCustomerId && customerPhone) {
                const customer = await tx.customer.upsert({
                    where: { shopId_phone: { shopId: session.shopId, phone: customerPhone } },
                    update: { totalSpent: { increment: total } },
                    create: { name: customerName || 'Walk-in Customer', phone: customerPhone, shopId: session.shopId, totalSpent: total }
                });
                finalCustomerId = customer.id;
            } else if (finalCustomerId) {
                await tx.customer.update({
                    where: { id: finalCustomerId },
                    data: { totalSpent: { increment: total } }
                });
            }

            // 2. Create the Sale
            const sale = await tx.sale.create({
                data: {
                    invoiceNumber,
                    subtotal,
                    tax: tax || 0,
                    discount: discount || 0,
                    total,
                    paymentMethod,
                    shopId: session.shopId,
                    storeId: session.storeId,
                    staffId: session.userId,
                    customerId: finalCustomerId,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                            total: item.quantity * item.price,
                        }))
                    }
                },
                include: { items: true }
            });

            // 3. Process each item (Stock Update + Logs)
            for (const item of items) {
                // Update product stock
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stockQuantity: { decrement: item.quantity } }
                });

                // Add Inventory Log
                await tx.inventoryLog.create({
                    data: {
                        productId: item.productId,
                        changeType: 'REMOVE',
                        quantity: item.quantity,
                        reason: `Sale Invoice #${invoiceNumber}`,
                    }
                });
            }

            // 4. Update Staff Performance
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            await tx.staffPerformance.upsert({
                where: { staffId_date: { staffId: session.userId, date: today } },
                update: {
                    salesCount: { increment: 1 },
                    totalRevenue: { increment: total }
                },
                create: {
                    staffId: session.userId,
                    date: today,
                    salesCount: 1,
                    totalRevenue: total
                }
            });

            return sale;
        });

        return NextResponse.json({ success: true, sale: result });
    } catch (error) {
        console.error('POS Sale Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET: Fetch sales history
export async function GET(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    try {
        const [sales, total] = await Promise.all([
            db.sale.findMany({
                where: { shopId: session.shopId },
                include: { customer: true, items: { include: { product: true } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            db.sale.count({ where: { shopId: session.shopId } })
        ]);

        return NextResponse.json({ sales, total, pages: Math.ceil(total / limit) });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
