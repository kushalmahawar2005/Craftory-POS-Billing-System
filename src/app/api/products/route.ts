import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

// GET: Fetch products with filters
export async function GET(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
                { sku: { contains: search, mode: 'insensitive' } },
            ],
        };

        if (categoryId && categoryId !== 'all') where.categoryId = categoryId;

        const [products, total] = await Promise.all([
            db.product.findMany({
                where,
                include: { 
                    category: true,
                    brand: true,
                    unit: true,
                    gallery: true
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            db.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            pagination: { total, pages: Math.ceil(total / limit), page, limit },
        });
    } catch (error) {
        console.error('Fetch Products Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Advanced Product Creation
export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const data = await req.json();
        const { 
            name, price, costPrice, stockQuantity, categoryId, 
            sku, barcode, itemType, hasVariants, reorderLevel,
            frontImageUrl, frontImagePublicId, 
            rearImageUrl, rearImagePublicId,
            gallery, variants,
            brandId, manufacturerId, unitId, supplierId, taxRate
        } = data;

        if (!name || price === undefined) {
            return NextResponse.json({ error: 'Name and Price are required' }, { status: 400 });
        }

        const product = await db.product.create({
            data: {
                name,
                price: parseFloat(price),
                costPrice: costPrice ? parseFloat(costPrice) : null,
                stockQuantity: parseInt(stockQuantity || '0'),
                reorderLevel: parseInt(reorderLevel || '0'),
                sku,
                barcode,
                itemType: itemType || 'Goods',
                hasVariants: !!hasVariants,
                taxRate: taxRate ? parseFloat(taxRate) : 0,
                
                // Advanced Images
                frontImageUrl,
                frontImagePublicId,
                rearImageUrl,
                rearImagePublicId,
                
                // Relations
                shopId: session.shopId,
                categoryId,
                brandId,
                manufacturerId,
                unitId,
                supplierId,
                
                // Handle Gallery Images
                gallery: gallery && gallery.length > 0 ? {
                    create: gallery.map((img: any) => ({
                        url: img.url,
                        publicId: img.publicId
                    }))
                } : undefined,

                // Handle Variants
                variants: hasVariants && variants && variants.length > 0 ? {
                    create: variants.map((v: any) => ({
                        sku: v.sku,
                        price: parseFloat(v.price),
                        stockQuantity: parseInt(v.stock || v.stockQuantity),
                        attributes: v.attributes
                    }))
                } : undefined
            },
            include: { category: true, brand: true, gallery: true, variants: true },
        });

        // Log initial inventory
        const qty = parseInt(stockQuantity || '0');
        if (qty > 0) {
            await db.inventoryLog.create({
                data: {
                    productId: product.id,
                    changeType: 'ADD',
                    quantity: qty,
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
