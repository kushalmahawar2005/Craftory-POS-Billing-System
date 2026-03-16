import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function PUT(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { gstin, regType, defaultGstRate, legalName, tradeName } = await req.json();

        const updated = await db.shop.update({
            where: { id: session.shopId },
            data: {
                gstin,
                gstRegistrationType: regType,
                defaultGSTRate: parseFloat(defaultGstRate || '18'),
                gstLegalName: legalName,
                gstTradeName: tradeName,
                gstRegistered: !!gstin
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('GST Settings Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
