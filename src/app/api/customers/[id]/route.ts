import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

// GET: Individual customer + purchase history
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;

    try {
        const customer = await db.customer.findUnique({
            where: { id, shopId: session.shopId },
            include: {
                sales: {
                    orderBy: { createdAt: 'desc' },
                    take: 50,
                    include: { items: true }
                }
            }
        });

        if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT: Update customer info
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;

    try {
        const { name, phone, email } = await req.json();

        const updated = await db.customer.update({
            where: { id, shopId: session.shopId },
            data: { name, phone, email }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE: Remove customer
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;

    try {
        await db.customer.delete({
            where: { id, shopId: session.shopId }
        });
        return NextResponse.json({ message: 'Customer deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
