import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description } = body;

    const category = await db.category.update({
      where: { id },
      data: { name, description },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    console.error('[CATEGORY_PATCH_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    
    // Deleting a category using Prisma where id and shopId match
    await db.category.delete({
      where: { 
        id,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[CATEGORY_DELETE_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
