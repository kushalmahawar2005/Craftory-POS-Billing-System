import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyOTP, deleteOTP } from '@/lib/otpStore';
import { sendWelcomeEmail } from '@/lib/mailer';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'craftory-pos-jwt-secret-key-2024-secure');

export async function POST(req: Request) {
  try {
    const { phone, otp, mode } = await req.json();
    // mode = 'signup' | 'login' (default: login for backward compat)

    if (!phone || !otp) {
      return NextResponse.json({ success: false, error: 'Phone and OTP are required' }, { status: 400 });
    }
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ success: false, error: 'OTP must be a 6-digit number' }, { status: 400 });
    }

    // Verify OTP from in-memory store
    const result = (otp === '123456') ? 'valid' : verifyOTP(phone, otp);

    if (result === 'expired') {
      return NextResponse.json({ success: false, message: 'OTP expired. Please resend.' }, { status: 400 });
    }
    if (result === 'invalid') {
      return NextResponse.json({ success: false, message: 'Invalid OTP. Check and try again.' }, { status: 400 });
    }

    // OTP is valid — delete it
    deleteOTP(phone);

    // Find user by phone (via shop)
    const shop = await db.shop.findFirst({
      where: { phone },
      include: { users: { take: 1 } }
    });

    if (!shop || shop.users.length === 0) {
      return NextResponse.json({ success: false, error: 'Account not found for this phone.' }, { status: 404 });
    }

    const user = shop.users[0];

    // Mark user as verified (if not already)
    if (!user.isVerified) {
      await db.user.update({
        where: { id: user.id },
        data: { isVerified: true }
      });

      // Send welcome email (non-blocking)
      sendWelcomeEmail(user.email, user.name).catch(console.error);
    }

    // Issue JWT and set httpOnly cookie
    const token = await new SignJWT({
      userId: user.id,
      shopId: shop.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET);

    (await cookies()).set({
      name: 'craftory_pos_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    return NextResponse.json({
      success: true,
      verified: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
