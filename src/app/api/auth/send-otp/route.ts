import { NextResponse } from 'next/server';
import { generateOTP, sendOTP } from '@/lib/twilio';
import { storeOTP, canResendOTP } from '@/lib/otpStore';

function validateIndianPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]/.test(cleaned);
}

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
        }

        if (!validateIndianPhone(phone)) {
            return NextResponse.json({ success: false, error: 'Invalid Indian phone number. Must be 10 digits starting with 6-9.' }, { status: 400 });
        }

        const otp = generateOTP();
        storeOTP(phone, otp);

        try {
            await sendOTP(phone, otp);
        } catch (twilioError) {
            console.error('Twilio Error:', twilioError);
            // Fallback: log OTP in development
            console.log(`[SMS FALLBACK] OTP for ${phone}: ${otp}`);
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json({ success: false, error: 'SMS service is temporarily unavailable. Please try again.' }, { status: 503 });
            }
        }

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Send OTP Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
