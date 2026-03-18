import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: customerId } = await params;
    const body = await req.json();
    const { amount, type, notes } = body; // type: CREDIT_GIVEN or ADJUSTMENT

    if (!amount || amount === 0) {
        return NextResponse.json({ error: 'Amount cannot be zero' }, { status: 400 });
    }

    try {
        const result = await db.$transaction(async (tx: any) => {
            const customer = await tx.customer.findUnique({
                where: { id: customerId, shopId: session.shopId }
            });

            if (!customer) throw new Error('Customer not found');

            const balanceBefore = customer.currentBalance;
            const balanceAfter = balanceBefore + amount;

            const transaction = await tx.creditTransaction.create({
                data: {
                    customerId,
                    shopId: session.shopId,
                    type,
                    amount: Math.abs(amount),
                    balanceBefore,
                    balanceAfter,
                    notes,
                    processedBy: session.userId,
                }
            });

            const updateData: any = {
                currentBalance: balanceAfter
            };

            if (amount > 0) {
                updateData.totalCreditGiven = { increment: amount };
            } else {
                updateData.totalCreditRepaid = { increment: Math.abs(amount) };
            }

            const updatedCustomer = await tx.customer.update({
                where: { id: customerId },
                data: updateData
            });

            return { transaction, updatedCustomer };
        });

        return NextResponse.json({ success: true, balance: result.updatedCustomer.currentBalance });

    } catch (error: any) {
        console.error('Credit Adjustment Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
