import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    const status = searchParams.get('status');
    const refundMethod = searchParams.get('refundMethod');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const q = searchParams.get('q');

    try {
        const where: any = {
            shopId: session.shopId,
        };

        if (status) where.status = status;
        if (refundMethod) where.refundMethod = refundMethod;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }
        if (q) {
            where.OR = [
                { returnNumber: { contains: q, mode: 'insensitive' } },
                { sale: { invoiceNumber: { contains: q, mode: 'insensitive' } } }
            ];
        }

        const [returns, total] = await Promise.all([
            db.saleReturn.findMany({
                where,
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
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            db.saleReturn.count({ where })
        ]);

        return NextResponse.json({ 
            returns, 
            total, 
            pages: Math.ceil(total / limit) 
        });
    } catch (error) {
        console.error('Fetch Returns Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
