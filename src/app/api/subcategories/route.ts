import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

// GET: Fetch subcategories for a category
export async function GET(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('category_id');

    if (!categoryId) {
        return NextResponse.json({ error: 'category_id is required' }, { status: 400 });
    }

    try {
        // Validate the category belongs to the user's business type
        const shop = await db.shop.findUnique({
            where: { id: session.shopId },
            select: { businessTypeId: true },
        });

        if (shop?.businessTypeId) {
            const category = await db.category.findFirst({
                where: {
                    id: categoryId,
                    OR: [
                        { businessTypeId: shop.businessTypeId },
                        { shopId: session.shopId },
                    ],
                },
            });

            if (!category) {
                return NextResponse.json({ error: 'Category not found or access denied' }, { status: 403 });
            }
        }

        const subcategories = await db.subcategory.findMany({
            where: { categoryId },
            orderBy: { subcategoryName: 'asc' },
        });

        return NextResponse.json(subcategories);
    } catch (error) {
        console.error('Fetch Subcategories Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Create a new subcategory
export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { subcategoryName, categoryId } = await req.json();

        if (!subcategoryName || !categoryId) {
            return NextResponse.json({ error: 'subcategoryName and categoryId are required' }, { status: 400 });
        }

        // Verify category access
        const category = await db.category.findFirst({
            where: {
                id: categoryId,
                shopId: session.shopId,
            },
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found or access denied' }, { status: 403 });
        }

        const subcategory = await db.subcategory.create({
            data: {
                subcategoryName,
                categoryId,
            },
        });

        return NextResponse.json(subcategory);
    } catch (error) {
        console.error('Create Subcategory Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
