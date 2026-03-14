import { NextResponse } from 'next/server';
import { generateOTP, sendOTP } from '@/lib/twilio';
import { storeOTP, deleteOTP, canResendOTP } from '@/lib/otpStore';

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
        }

        // Check 60-second cooldown
        const { allowed, waitSeconds } = canResendOTP(phone);
        if (!allowed) {
            return NextResponse.json({
                success: false,
                error: `Please wait ${waitSeconds} seconds before requesting a new OTP.`,
                waitSeconds,
            }, { status: 429 });
        }

        // Delete old OTP and generate a fresh one
        deleteOTP(phone);
        const otp = generateOTP();
        storeOTP(phone, otp);

        try {
            await sendOTP(phone, otp);
        } catch (twilioError) {
            console.error('Twilio Resend Error:', twilioError);
            console.log(`[SMS FALLBACK] Resend OTP for ${phone}: ${otp}`);
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json({ success: false, error: 'SMS service unavailable.' }, { status: 503 });
            }
        }

        return NextResponse.json({ success: true, message: 'New OTP sent successfully' });
    } catch (error) {
        console.error('Resend OTP Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
