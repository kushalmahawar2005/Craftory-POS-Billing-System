import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

// GET: Fetch single product
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;

    try {
        const product = await db.product.findUnique({
            where: { id, shopId: session.shopId },
            include: { category: true, supplier: true },
        });

        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT: Update product
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;

    try {
        const data = await req.json();
        const { name, price, costPrice, stockQuantity, categoryId, barcode, imageUrl, imagePublicId, supplierId } = data;

        // Check ownership
        const existing = await db.product.findUnique({
            where: { id, shopId: session.shopId }
        });
        if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        const updatedProduct = await db.product.update({
            where: { id },
            data: {
                name,
                price: price !== undefined ? parseFloat(price) : undefined,
                costPrice: costPrice !== undefined ? parseFloat(costPrice) : undefined,
                stockQuantity: stockQuantity !== undefined ? parseInt(stockQuantity) : undefined,
                barcode,
                imageUrl,
                imagePublicId,
                categoryId,
                supplierId,
            }
        });

        // If stock changed manually, log it
        if (stockQuantity !== undefined && parseInt(stockQuantity) !== existing.stockQuantity) {
            await db.inventoryLog.create({
                data: {
                    productId: id,
                    changeType: 'ADJUST',
                    quantity: parseInt(stockQuantity) - existing.stockQuantity,
                    reason: 'Manual adjustment via update',
                }
            });
        }

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Update Product Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE: Remove product
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;

    try {
        const product = await db.product.findUnique({
            where: { id, shopId: session.shopId }
        });

        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        // Delete image from Cloudinary if exists
        if (product.imagePublicId) {
            try {
                const { deleteImage } = await import('@/lib/cloudinary');
                await deleteImage(product.imagePublicId);
            } catch (imgError) {
                console.error('Failed to delete image from Cloudinary:', imgError);
                // Continue with product deletion even if image deletion fails
            }
        }

        await db.product.delete({
            where: { id }
        });
        return NextResponse.json({ message: 'Product deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
