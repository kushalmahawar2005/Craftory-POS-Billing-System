import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

    if (!clientId || clientId === 'your-google-client-id') {
        console.warn('Google Client ID not configured in .env');
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=Google OAuth is not configured. Please set GOOGLE_CLIENT_ID in .env`);
    }

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'email profile');
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');

    return NextResponse.redirect(authUrl.toString());
}
