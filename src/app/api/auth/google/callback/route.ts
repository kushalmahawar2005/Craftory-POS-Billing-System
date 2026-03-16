import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'craftory-pos-jwt-secret-key-2024-secure');

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=Google login failed`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

    try {
        // 1. Exchange authorization code for token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId!,
                client_secret: clientSecret!,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const tokenData = await tokenResponse.json();
        if (!tokenResponse.ok) throw new Error(tokenData.error_description || 'Failed to fetch tokens');

        // 2. Get user profile info
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const userData = await userResponse.json();
        if (!userResponse.ok) throw new Error('Failed to fetch user info');

        const { email, name } = userData;
        if (!email) throw new Error('No email found in Google profile');

        // 3. Find or create user in DB
        let user: any = await db.user.findUnique({
            where: { email },
            include: { shop: true, store: true }
        });

        if (!user) {
            // New user registration - Generate a secure random password hash for OAuth users
            const dummyPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
            const passwordHash = await bcrypt.hash(dummyPassword, 12);

            // Transaction: Create Shop + Store + User
            user = await db.$transaction(async (tx: any) => {
                const shop = await tx.shop.create({
                    data: {
                        shopName: `${name.split(' ')[0]}'s Shop`,
                        ownerName: name,
                        email,
                        // No phone initially
                    }
                });

                const store = await tx.store.create({
                    data: {
                        name: 'Main Branch',
                        shopId: shop.id,
                    }
                });

                const newUser = await tx.user.create({
                    data: {
                        name,
                        email,
                        passwordHash,
                        role: 'ADMIN',
                        isVerified: true, // Google sign-in verifies the email implicitly
                        shopId: shop.id,
                        storeId: store.id,
                    },
                    include: { shop: true, store: true }
                });

                return newUser;
            });
        }

        // 4. Create JWT Token
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
            .setExpirationTime('7d')
            .sign(SECRET);

        // 5. Set httpOnly Cookie
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'craftory_pos_token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60,
            sameSite: 'lax',
        });

        // 6. Redirect based on onboarding status
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        if (user.shop && !user.shop.onboardingCompleted) {
            return NextResponse.redirect(`${appUrl}/app/onboarding`);
        } else {
            return NextResponse.redirect(`${appUrl}/app/dashboard`);
        }

    } catch (err: any) {
        console.error('Google OAuth Callback Error:', err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent(err.message || 'Google authentication failed')}`);
    }
}
