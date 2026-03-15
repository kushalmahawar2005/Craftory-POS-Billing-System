// ============================================================
// src/lib/twilio.ts — Twilio SMS OTP Service
// ============================================================
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;

// Generate a random 6-digit OTP
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Format phone number to E.164 Indian format
function formatIndianPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, ''); // Remove non-digits
    if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
    if (cleaned.length === 10) return `+91${cleaned}`;
    return `+${cleaned}`;
}

// Send OTP via Twilio SMS
export async function sendOTP(phone: string, otp: string): Promise<void> {
    const client = twilio(accountSid, authToken);
    const formattedPhone = formatIndianPhone(phone);

    await client.messages.create({
        body: `Your Craftory POS verification code is: ${otp}. Valid for 10 minutes. Do not share with anyone.`,
        from: twilioPhone,
        to: formattedPhone,
    });
}
