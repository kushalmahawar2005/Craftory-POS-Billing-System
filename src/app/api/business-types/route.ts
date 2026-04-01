import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

// GET: Fetch all business types (for registration/onboarding)
export async function GET() {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const businessTypes = await db.businessType.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(businessTypes);
    } catch (error) {
        console.error('Fetch Business Types Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
