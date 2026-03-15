import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

// GET: Fetch all products with search, filter, and pagination
export async function GET(req: Request) {
    const session = await getAuthSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    try {
        const where: any = {
            shopId: session.shopId,
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { barcode: { contains: search, mode: 'insensitive' } },
            ],
        };

        if (categoryId && categoryId !== 'all') {
            where.categoryId = categoryId;
        }

        const [products, total] = await Promise.all([
            db.product.findMany({
                where,
                include: { category: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            db.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            },
        });
    } catch (error) {
        console.error('Fetch Products Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Create a new product
export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await req.json();
        const { name, price, costPrice, stockQuantity, categoryId, barcode, imageUrl, supplierId } = data;

        if (!name || price === undefined) {
            return NextResponse.json({ error: 'Name and Price are required' }, { status: 400 });
        }

        const product = await db.product.create({
            data: {
                name,
                price: parseFloat(price),
                costPrice: costPrice ? parseFloat(costPrice) : null,
                stockQuantity: parseInt(stockQuantity || '0'),
                barcode,
                imageUrl,
                categoryId,
                supplierId,
                shopId: session.shopId,
            },
            include: { category: true },
        });

        // Log initial inventory
        if (parseInt(stockQuantity || '0') > 0) {
            await db.inventoryLog.create({
                data: {
                    productId: product.id,
                    changeType: 'ADD',
                    quantity: parseInt(stockQuantity),
                    reason: 'Initial stock on creation',
                }
            });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Create Product Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
