import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'craftory-pos-jwt-secret-key-2024-secure');

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, location } = await req.json();

    if (!name || !email || !password || !phone || !location) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // In production: check if user exists, hash password, save to DB
    // For demo, we simulate success and send OTP
    const userId = `user_${Date.now()}`;

    return NextResponse.json({
      message: 'OTP sent to your phone number',
      userId,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
