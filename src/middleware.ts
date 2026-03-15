import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'craftory-pos-jwt-secret-key-2024-secure');

// Define exactly which routes this middleware applies to
export const config = {
    matcher: ['/app/:path*'],
};

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('craftory_pos_token')?.value;

    // Protect /app routes
    if (req.nextUrl.pathname.startsWith('/app')) {
        if (!token) {
            // No token -> Redirect to login
            const url = req.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        try {
            // Explicitly verify the token signature
            await jwtVerify(token, SECRET);
            return NextResponse.next();
        } catch (error) {
            // Invalid token -> Redirect to login
            console.warn('Invalid or expired token. Redirecting to login.');
            const url = req.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}
