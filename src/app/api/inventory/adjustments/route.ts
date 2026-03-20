import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const adjustments = await db.inventoryAdjustment.findMany({
      where: {
        shopId: session.shopId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
                stockQuantity: true,
              }
            }
          }
        },
        staff: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        adjustmentDate: 'desc',
      },
    });

    return NextResponse.json(adjustments);
  } catch (error) {
    console.error('Fetch Adjustments Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { reason, note, adjustmentDate, items, storeId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Use a transaction to ensure atomic updates
    const result = await db.$transaction(async (tx) => {
      // 1. Create the Adjustment Record
      const adjustment = await tx.inventoryAdjustment.create({
        data: {
          reason,
          note,
          adjustmentDate: new Date(adjustmentDate),
          shopId: session.shopId,
          staffId: session.userId,
          storeId: storeId || session.storeId,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantityChange: item.quantityChange,
            })),
          },
        },
        include: {
          items: true,
        }
      });

      // 2. Update Product Stock Quantities and Log them
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              increment: item.quantityChange,
            },
          },
        });

        // Also create a simple InventoryLog for each product change
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            changeType: item.quantityChange >= 0 ? 'ADJUST_ADD' : 'ADJUST_REMOVE',
            quantity: Math.abs(item.quantityChange),
            reason: `Adjustment: ${reason}${note ? ' - ' + note : ''}`,
          }
        });
      }

      return adjustment;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Create Adjustment Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
