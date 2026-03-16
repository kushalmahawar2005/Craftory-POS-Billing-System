import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Only admins can manage staff' }, { status: 403 });
    }

    try {
        const { id } = await params;
        const { name, email, phone, role, status, password } = await req.json();

        const updateData: any = {
            name,
            email,
            phone,
            role: role as any,
            status,
        };

        if (password) {
            updateData.passwordHash = await bcrypt.hash(password, 12);
        }

        const staff = await db.user.update({
            where: { id, shopId: session.shopId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
            }
        });

        return NextResponse.json(staff);
    } catch (error) {
        console.error('Staff PUT error:', error);
        return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Only admins can manage staff' }, { status: 403 });
    }

    try {
        const { id } = await params;

        await db.user.delete({
            where: { id, shopId: session.shopId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Staff DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 });
    }
}
