import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: customerId } = await params;
    const body = await req.json();
    const { amount, notes, paymentMethod } = body;

    if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    try {
        const result = await db.$transaction(async (tx: any) => {
            const customer = await tx.customer.findUnique({
                where: { id: customerId, shopId: session.shopId }
            });

            if (!customer) throw new Error('Customer not found');

            const balanceBefore = customer.currentBalance;
            const balanceAfter = balanceBefore - amount;

            const transaction = await tx.creditTransaction.create({
                data: {
                    customerId,
                    shopId: session.shopId,
                    type: 'PAYMENT_RECEIVED',
                    amount,
                    balanceBefore,
                    balanceAfter,
                    notes: notes || `Payment received: ${paymentMethod}`,
                    processedBy: session.userId,
                }
            });

            const updatedCustomer = await tx.customer.update({
                where: { id: customerId },
                data: {
                    currentBalance: balanceAfter,
                    totalCreditRepaid: { increment: amount }
                }
            });

            return { transaction, updatedCustomer };
        });

        return NextResponse.json({ success: true, balance: result.updatedCustomer.currentBalance });

    } catch (error: any) {
        console.error('Credit Payment Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
