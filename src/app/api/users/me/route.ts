import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const user = await db.user.findUnique({
            where: { id: session.userId },
            select: { 
                id: true, 
                name: true, 
                email: true, 
                phone: true, 
                role: true, 
                status: true,
                createdAt: true, 
                shop: { select: { shopName: true, subscriptionPlan: true } } 
            }
        });
        
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name, phone } = await req.json();
        
        if (!name || name.trim() === '') {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const updatedUser = await db.user.update({
            where: { id: session.userId },
            data: { 
                name: name.trim(), 
                phone: phone ? phone.trim() : null 
            },
            select: { id: true, name: true, email: true, phone: true, role: true }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
    }
}
