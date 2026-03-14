import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'craftory-pos-jwt-secret-key-2024-secure');

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone and OTP are required' }, { status: 400 });
    }

    // In production: verify OTP from service like Twilio/MSG91
    // For demo, accept any 6-digit OTP
    if (otp.length !== 6) {
      return NextResponse.json({ error: 'Invalid OTP format' }, { status: 400 });
    }

    const userId = `user_${Date.now()}`;

    const token = await new SignJWT({
      userId,
      phone,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET);

    return NextResponse.json({
      token,
      user: {
        id: userId,
        phone,
        onboardingComplete: false,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
