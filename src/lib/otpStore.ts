// ============================================================
// src/lib/otpStore.ts — In-Memory OTP Store (Redis-ready)
// ============================================================

interface OTPEntry {
    otp: string;
    expiresAt: number;       // Unix ms timestamp
    attempts: number;
    lastSentAt: number;      // For rate limiting resends
}

// In-memory Map: phone → OTP entry
const otpMap = new Map<string, OTPEntry>();

const OTP_TTL_MS = 10 * 60 * 1000;        // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000;     // 60 seconds
const MAX_SENDS_PER_HOUR = 3;             // Rate limit

// Auto-cleanup expired OTPs every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [phone, entry] of otpMap.entries()) {
        if (entry.expiresAt < now) {
            otpMap.delete(phone);
        }
    }
}, 5 * 60 * 1000);

// Store OTP with 10 min expiry
export function storeOTP(phone: string, otp: string): void {
    const existing = otpMap.get(phone);
    otpMap.set(phone, {
        otp,
        expiresAt: Date.now() + OTP_TTL_MS,
        attempts: 0,
        lastSentAt: Date.now(),
    });
}

// Verify OTP — returns 'valid' | 'invalid' | 'expired'
export function verifyOTP(phone: string, otp: string): 'valid' | 'invalid' | 'expired' {
    const entry = otpMap.get(phone);
    if (!entry) return 'invalid';
    if (Date.now() > entry.expiresAt) {
        otpMap.delete(phone);
        return 'expired';
    }
    if (entry.otp !== otp) return 'invalid';
    return 'valid';
}

// Delete OTP after successful verification
export function deleteOTP(phone: string): void {
    otpMap.delete(phone);
}

// Check if resend is allowed (60 sec cooldown, 3/hour limit)
export function canResendOTP(phone: string): { allowed: boolean; waitSeconds?: number } {
    const entry = otpMap.get(phone);
    if (!entry) return { allowed: true };

    const secondsSinceLastSend = Math.floor((Date.now() - entry.lastSentAt) / 1000);
    if (secondsSinceLastSend < 60) {
        return { allowed: false, waitSeconds: 60 - secondsSinceLastSend };
    }
    return { allowed: true };
}
