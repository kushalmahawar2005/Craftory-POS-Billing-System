import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { token, email, newPassword } = await req.json();

        if (!token || !email || !newPassword) {
            return NextResponse.json({ success: false, error: 'Token, email and new password are required' }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        // Verify token exists and is not expired
        const storedToken = await db.verificationToken.findFirst({
            where: { email, token, type: 'RESET_PASSWORD' }
        });

        if (!storedToken) {
            return NextResponse.json({ success: false, error: 'Invalid or expired reset link.' }, { status: 400 });
        }

        if (new Date() > storedToken.expiresAt) {
            await db.verificationToken.delete({ where: { id: storedToken.id } });
            return NextResponse.json({ success: false, error: 'Reset link has expired. Please request a new one.' }, { status: 400 });
        }

        // Hash new password and update user
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await db.user.update({
            where: { email },
            data: { passwordHash }
        });

        // Delete the used token
        await db.verificationToken.delete({ where: { id: storedToken.id } });

        return NextResponse.json({ success: true, message: 'Password reset successfully. You can now log in.' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
