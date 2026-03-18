import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const shop = await db.shop.findUnique({
            where: { id: session.shopId },
            include: { 
                stores: true,
                preferences: true
            }
        });
        return NextResponse.json(shop);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const data = await req.json();
        const { name, businessType, address, city, state, pincode, phone, email } = data;

        const updated = await db.shop.update({
            where: { id: session.shopId },
            data: { 
                shopName: name || undefined, 
                businessType: businessType || undefined,
                phone: phone || undefined,
                email: email || undefined
            }
        });

        // Also update the primary store's address if it exists
        if (session.storeId) {
            await db.store.update({
                where: { id: session.storeId },
                data: {
                    address: address || undefined,
                    city: city || undefined,
                    state: state || undefined,
                    pincode: pincode || undefined
                }
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
