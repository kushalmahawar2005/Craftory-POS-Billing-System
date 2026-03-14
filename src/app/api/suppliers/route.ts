import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const suppliers = await db.supplier.findMany({
            where: { shopId: session.shopId },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(suppliers);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name, phone, email, address } = await req.json();
        if (!name) return NextResponse.json({ error: 'Supplier name is required' }, { status: 400 });

        const supplier = await db.supplier.create({
            data: { name, phone, email, address, shopId: session.shopId }
        });
        return NextResponse.json(supplier);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
