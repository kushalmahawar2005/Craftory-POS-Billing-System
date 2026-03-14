import { NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/mailer';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
        }

        const user = await db.user.findUnique({ where: { email } });

        // Security: always return success even if user not found
        if (!user) {
            return NextResponse.json({ success: true, message: 'If this email exists, a reset link has been sent.' });
        }

        // Clean up old reset tokens and generate new one
        await db.verificationToken.deleteMany({ where: { email, type: 'RESET_PASSWORD' } });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

        await db.verificationToken.create({
            data: { email, token: resetToken, type: 'RESET_PASSWORD', expiresAt }
        });

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

        try {
            await sendPasswordResetEmail(email, resetLink);
        } catch (emailError) {
            console.error('SMTP Error:', emailError);
            // Don't crash — log it but still respond
            console.log(`[EMAIL FALLBACK] Reset link for ${email}: ${resetLink}`);
        }

        return NextResponse.json({ success: true, message: 'If this email exists, a reset link has been sent.' });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
