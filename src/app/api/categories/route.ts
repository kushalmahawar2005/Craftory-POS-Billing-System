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

    try {
        if (seed) {
            const existingCount = await db.category.count({ where: { shopId: session.shopId } });
            if (existingCount === 0) {
                const seedDataPath = path.join(process.cwd(), 'src/lib/data/categories.json');
                const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
                
                const seedRecursive = async (items: any[], parentId: string | null = null, level: number = 0) => {
                    for (const item of items) {
                        const created = await db.category.create({
                            data: {
                                name: item.name,
                                icon: item.icon || 'Category',
                                color: item.color || '#94a3b8',
                                shopId: session.shopId,
                                parentId: parentId,
                                level: level,
                                status: 'ACTIVE'
                            }
                        });

                        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
                            await seedRecursive(item.children, created.id, level + 1);
                        }
                    }
                };
                await seedRecursive(seedData);
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

    } catch (error) {
        console.error('[CATEGORIES_GET_ERROR]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // Force Reset & Seed logic for POST
        // 1. Clear existing
        await db.category.deleteMany({
            where: { shopId: session.shopId }
        });

        // 2. Read JSON
        const seedDataPath = path.join(process.cwd(), 'src/lib/data/categories.json');
        const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

        // 3. Recursive Seed Function
        const seedRecursive = async (items: any[], parentId: string | null = null, level: number = 0) => {
            const results: any[] = [];
            for (const item of items) {
                const created = await db.category.create({
                    data: {
                        name: item.name,
                        icon: item.icon || 'Category',
                        color: item.color || '#94a3b8',
                        shopId: session.shopId,
                        parentId: parentId,
                        level: level,
                        status: 'ACTIVE'
                    }
                });
                results.push(created);

                if (item.children && Array.isArray(item.children) && item.children.length > 0) {
                    const children = await seedRecursive(item.children, created.id, level + 1);
                    results.push(...children);
                }
            }
            return results;
        };

        const seeded = await seedRecursive(seedData);
        return NextResponse.json({ 
            success: true, 
            count: seeded.length,
            message: `Successfully seeded ${seeded.length} categories across ${Math.max(...seeded.map(s => s.level)) + 1} levels.` 
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
