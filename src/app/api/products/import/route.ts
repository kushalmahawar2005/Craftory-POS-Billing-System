import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { csvData } = await req.json();
        if (!csvData) return NextResponse.json({ error: 'No data provided' }, { status: 400 });

        // Basic CSV Parsing
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map((h: string) => h.trim().toLowerCase());
        
        const productsCreated = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',').map((v: string) => v.trim());
            const data: any = {};
            
            headers.forEach((header: string, index: number) => {
                data[header] = values[index];
            });

            // Minimum required: name, price
            if (!data.name || !data.price) continue;

            const newProduct = await db.product.create({
                data: {
                    name: data.name,
                    sku: data.sku || `SKU-${Date.now()}-${i}`,
                    price: parseFloat(data.price),
                    costPrice: data.costprice ? parseFloat(data.costprice) : null,
                    stockQuantity: data.stock ? parseInt(data.stock) : 0,
                    shopId: session.shopId,
                    itemType: data.type || 'Goods'
                }
            });
            productsCreated.push(newProduct);
        }

        return NextResponse.json({ success: true, count: productsCreated.length });
    } catch (error) {
        console.error('Import Error:', error);
        return NextResponse.json({ error: 'Failed to import products' }, { status: 500 });
    }
}
