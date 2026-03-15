import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';

    try {
        const customers = await db.customer.findMany({
            where: {
                shopId: session.shopId,
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } },
                ],
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        return NextResponse.json(customers);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name, phone, email } = await req.json();
        if (!name || !phone) return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });

        const customer = await db.customer.upsert({
            where: {
                shopId_phone: {
                    shopId: session.shopId,
                    phone: phone
                }
            },
            update: { name, email },
            create: { name, phone, email, shopId: session.shopId }
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error('Customer Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
