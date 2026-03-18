import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function PUT(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { requirePINForRefunds, sessionTimeout, twoFactorEnabled } = await req.json();

        const updated = await db.shopPreferences.upsert({
            where: { shopId: session.shopId },
            update: {
                requirePINForRefunds,
                sessionTimeout: parseInt(sessionTimeout || '30'),
                twoFactorEnabled
            },
            create: {
                shopId: session.shopId,
                requirePINForRefunds,
                sessionTimeout: parseInt(sessionTimeout || '30'),
                twoFactorEnabled
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Security Settings Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
