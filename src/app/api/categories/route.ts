import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const flat = searchParams.get('flat') === 'true';
    const seed = searchParams.get('seed') === 'true';
    const type = searchParams.get('type'); // New: return recommended cats for a type

    try {
        const seedDataPath = path.join(process.cwd(), 'src/lib/data/categories.json');
        const fileData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
        const businessTypes = fileData.businessTypes || [];

        // Support for returning recommendation only
        if (type) {
            let matched = businessTypes.find((bt: any) => bt.type.toLowerCase() === type.toLowerCase());
            if (!matched) matched = businessTypes.find((bt: any) => bt.type === "General Store");
            return NextResponse.json(matched || { type: 'None', categories: [] });
        }

        if (seed) {
            const shop = await db.shop.findUnique({
                where: { id: session.shopId },
                select: { businessType: true }
            });

            const businessType = shop?.businessType || 'General Store';
            
            // Find matched type or fallback to General Store
            let matched = businessTypes.find((bt: any) => bt.type.toLowerCase() === businessType.toLowerCase());
            if (!matched) {
                matched = businessTypes.find((bt: any) => bt.type === "General Store");
            }

            if (matched && matched.categories) {
                // Get existing categories to avoid duplicates
                const existing = await db.category.findMany({
                    where: { shopId: session.shopId },
                    select: { name: true }
                });
                const existingNames = new Set(existing.map((e: { name: string }) => e.name));

                for (const catName of matched.categories) {
                    if (!existingNames.has(catName)) {
                        await db.category.create({
                            data: {
                                name: catName,
                                icon: 'Package',
                                color: '#7C3AED',
                                status: 'ACTIVE',
                                level: 0,
                                shop: { connect: { id: session.shopId } }
                            }
                        });
                    }
                }
            }
        }

        const allCategories = await db.category.findMany({
            where: { shopId: session.shopId },
            include: { 
                _count: { select: { products: true } }
            },
            orderBy: { name: 'asc' },
        });

        if (flat) {
            const categoryMap = new Map(allCategories.map((cat: any) => [cat.id, cat]));
            
            const getPath = (cat: any): string => {
                const parts = [cat.name];
                let current = cat;
                while (current.parentId && categoryMap.has(current.parentId)) {
                    current = categoryMap.get(current.parentId) as any;
                    parts.unshift(current.name);
                }
                return parts.join(' > ');
            };

            const flatWithPaths = allCategories.map((cat: any) => ({
                ...cat,
                fullPath: getPath(cat)
            }));
            
            flatWithPaths.sort((a: any, b: any) => a.fullPath.localeCompare(b.fullPath));
            
            return NextResponse.json(flatWithPaths);
        }

        // Build hierarchical tree in memory
        const buildTree = (parentId: string | null = null): any[] => {
            return allCategories
                .filter((cat: any) => cat.parentId === parentId)
                .map((cat: any) => ({
                    ...cat,
                    children: buildTree(cat.id)
                }));
        };

        const hierarchy = buildTree(null);
        return NextResponse.json(hierarchy);

    } catch (error: any) {
        console.error('[CATEGORIES_GET_ERROR]', error);
        return NextResponse.json({ 
            error: 'Internal server error', 
            details: error.message
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json().catch(() => ({}));
        const { name, businessType: overrideType, reset = false } = body;

        // NEW: Handle Manual Creation
        if (name) {
            const category = await db.category.create({
                data: {
                    name,
                    shopId: session.shopId,
                    status: 'ACTIVE',
                    level: 0
                }
            });
            return NextResponse.json(category);
        }

        // EXISTING: Seed logic (if no name provided)
        if (reset) {
            await db.category.deleteMany({ where: { shopId: session.shopId } });
        }

        const shop = await db.shop.findUnique({
            where: { id: session.shopId },
            select: { businessType: true }
        });

        const businessType = overrideType || shop?.businessType || 'General Store';
        const seedDataPath = path.join(process.cwd(), 'src/lib/data/categories.json');
        const fileData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
        const businessTypes = fileData.businessTypes || [];
        
        // Find matched type or fallback to General Store
        let matched = businessTypes.find((bt: any) => bt.type.toLowerCase() === businessType.toLowerCase());
        if (!matched) {
            matched = businessTypes.find((bt: any) => bt.type === "General Store");
        }

        if (matched && matched.categories) {
            const existing = await db.category.findMany({
                where: { shopId: session.shopId },
                select: { name: true }
            });
            const existingNames = new Set(existing.map((e: { name: string }) => e.name));

            for (const catName of matched.categories) {
                if (!existingNames.has(catName)) {
                    await db.category.create({
                        data: {
                            name: catName,
                            icon: 'Package',
                            color: '#7C3AED',
                            status: 'ACTIVE',
                            level: 0,
                            shop: { connect: { id: session.shopId } }
                        }
                    });
                }
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Processed categories for ${matched?.type || 'General Store'}.` 
        });

    } catch (error: any) {
        console.error('[POST_SEED_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await db.category.deleteMany({
            where: { shopId: session.shopId }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
