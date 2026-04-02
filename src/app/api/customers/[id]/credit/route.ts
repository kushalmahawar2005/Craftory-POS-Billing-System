import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: customerId } = await params;

    try {
        const customer = await db.customer.findUnique({
            where: { id: customerId, shopId: session.shopId },
            include: {
                creditTransactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                    include: {
                        staff: { select: { name: true } },
                        sale: { select: { invoiceNumber: true } }
                    }
                }
            }
        });

        if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

        return NextResponse.json({
            currentBalance: customer.currentBalance,
            creditLimit: customer.creditLimit,
            totalCreditGiven: customer.totalCreditGiven,
            totalCreditRepaid: customer.totalCreditRepaid,
            transactions: customer.creditTransactions
        });

    } catch (error) {
        console.error('Fetch Credit Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
