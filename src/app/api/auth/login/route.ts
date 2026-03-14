import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'craftory-pos-jwt-secret-key-2024-secure');

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Find user from DB along with their Shop info
    const user = await db.user.findUnique({
      where: { email },
      include: { shop: true, store: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 2. Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 3. Block unverified accounts
    if (!user.isVerified) {
      return NextResponse.json({
        error: 'Phone number not verified. Please complete OTP verification.',
        requiresVerification: true,
        phone: user.shop?.phone,
      }, { status: 403 });
    }

    // 3. Create JWT token
    const token = await new SignJWT({
      userId: user.id,
      shopId: user.shopId,
      storeId: user.storeId,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // Access token expiration
      .sign(SECRET);

    // 4. Set httpOnly Cookies
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'craftory_pos_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      sameSite: 'lax',
    });

    // We can also create a long-lived 'refresh_token' cookie if requested
    // but a 7-day token effectively acts as 'remember me' for the POS.

    // We do NOT return the token in JSON because the cookie automatically 
    // secures it. The frontend will rely on cookies being sent automatically.

    return NextResponse.json({
      message: 'Logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.shop.phone,
        role: user.role,
        shopName: user.shop.shopName,
        storeName: user.store?.name,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
