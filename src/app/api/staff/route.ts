import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q') || '';
        const role = searchParams.get('role') || 'All Roles';

        const staff = await db.user.findMany({
            where: {
                shopId: session.shopId,
                role: { not: 'ADMIN' }, // Don't list owner as staff usually? Or list everyone?
                AND: [
                    {
                        OR: [
                            { name: { contains: q, mode: 'insensitive' } },
                            { email: { contains: q, mode: 'insensitive' } },
                        ]
                    },
                    role !== 'All Roles' ? { role: role as any } : {}
                ]
            },
            orderBy: { createdAt: 'desc' },
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
        console.error('Staff GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Only admins can manage staff' }, { status: 403 });
    }

    try {
        const { name, email, phone, role, status, password } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        const existing = await db.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
        }

        // Default password if not provided
        const passToHash = password || 'Staff@123';
        const passwordHash = await bcrypt.hash(passToHash, 12);

        const staff = await db.user.create({
            data: {
                name,
                email,
                phone,
                role: role as any,
                status: status || 'Active',
                passwordHash,
                shopId: session.shopId,
                isVerified: true,
            },
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
        console.error('Staff POST error:', error);
        return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
    }
}
