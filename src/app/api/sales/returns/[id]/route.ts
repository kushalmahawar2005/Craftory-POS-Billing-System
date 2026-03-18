import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const saleReturn = await db.saleReturn.findUnique({
            where: { 
                id: id,
                shopId: session.shopId
            },
            include: {
                sale: {
                    include: {
                        customer: true
                    }
                },
                staff: {
                    select: { name: true }
                },
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!saleReturn) {
            return NextResponse.json({ error: 'Return not found' }, { status: 404 });
        }

        return NextResponse.json(saleReturn);
    } catch (error) {
        console.error('Fetch Single Return Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
