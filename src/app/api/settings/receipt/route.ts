import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function PUT(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { receiptHeader, receiptFooter, paperSize, showLogo, showGst } = await req.json();

        const updated = await db.shopPreferences.upsert({
            where: { shopId: session.shopId },
            update: {
                receiptHeader,
                receiptFooter,
                paperSize,
                showLogo,
                showGST: showGst
            },
            create: {
                shopId: session.shopId,
                receiptHeader,
                receiptFooter,
                paperSize,
                showLogo,
                showGST: showGst
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Receipt Settings Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
