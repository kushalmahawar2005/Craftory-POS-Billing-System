import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { generateOTP, sendOTP } from '@/lib/twilio';
import { storeOTP } from '@/lib/otpStore';

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, location } = await req.json();

    // Validation
    if (!name || !email || !password || !phone || !location) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    // Indian phone validation
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10 || !/^[6-9]/.test(cleanedPhone)) {
      return NextResponse.json({ success: false, error: 'Invalid Indian phone number. Must be 10 digits starting with 6-9.' }, { status: 400 });
    }

    // Check if user already exists by email or phone
    const [existingEmail, existingPhone] = await Promise.all([
      db.user.findUnique({ where: { email } }),
      db.shop.findFirst({ where: { phone: cleanedPhone } })
    ]);

    if (existingEmail) {
      return NextResponse.json({ success: false, error: 'This email is already registered.' }, { status: 409 });
    }
    if (existingPhone) {
      return NextResponse.json({ success: false, error: 'This phone number is already registered.' }, { status: 409 });
    }

    // Hash password with bcrypt (rounds: 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // Create Shop + Store + User in a single DB transaction
    await db.$transaction(async (tx: any) => {
      const shop = await tx.shop.create({
        data: {
          shopName: `${name}'s Shop`,
          ownerName: name,
          email,
          phone: cleanedPhone,
        }
      });

      const store = await tx.store.create({
        data: {
          name: 'Main Branch',
          location,
          shopId: shop.id,
        }
      });

      await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'ADMIN',
          isVerified: true, // BYPASS: Verified by default for now
          shopId: shop.id,
          storeId: store.id,
        }
      });
    });

    // Generate and send OTP via Twilio
    const otp = generateOTP();
    storeOTP(cleanedPhone, otp);

    try {
      await sendOTP(cleanedPhone, otp);
    } catch (twilioError) {
      console.error('Twilio Error:', twilioError);
      // Dev fallback — log OTP to console
      console.log(`\n[SMS FALLBACK] OTP for ${cleanedPhone}: ${otp}\n`);
    }

    return NextResponse.json({
      success: true,
      nextStep: 'verify-otp',
      phone: cleanedPhone,
      message: 'Account created. OTP sent to your phone.',
    });
  } catch (error: any) {
    console.error('Signup Error - FULL LOG:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        meta: error.meta
    });
    return NextResponse.json({ success: false, error: `Internal server error: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}
