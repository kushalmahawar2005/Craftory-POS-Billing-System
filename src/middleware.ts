import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'craftory-pos-jwt-secret-key-2024-secure');

// Routes restricted by role
// CASHIER: can only access POS + Invoices + their own dashboard
const CASHIER_BLOCKED = [
    '/app/settings',
    '/app/reports',
    '/app/products',
    '/app/customers',
    '/app/suppliers',
    '/app/purchase-orders',
];

// MANAGER: can access everything except Settings
const MANAGER_BLOCKED = [
    '/app/settings',
];

export const config = {
    matcher: ['/app/:path*'],
};

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('craftory_pos_token')?.value;
    const pathname = req.nextUrl.pathname;

    // Protect /app routes
    if (pathname.startsWith('/app')) {
        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        try {
            const { payload } = await jwtVerify(token, SECRET);
            const role = (payload as any).role as string;

            // ── Role-Based Access Control ──
            if (role === 'CASHIER') {
                const blocked = CASHIER_BLOCKED.some(p => pathname.startsWith(p));
                if (blocked) {
                    const url = req.nextUrl.clone();
                    url.pathname = '/app/pos';
                    url.searchParams.set('error', 'access_denied');
                    return NextResponse.redirect(url);
                }
            }

            if (role === 'MANAGER') {
                const blocked = MANAGER_BLOCKED.some(p => pathname.startsWith(p));
                if (blocked) {
                    const url = req.nextUrl.clone();
                    url.pathname = '/app/dashboard';
                    url.searchParams.set('error', 'access_denied');
                    return NextResponse.redirect(url);
                }
            }

            // Pass role in request header for client usage
            const requestHeaders = new Headers(req.headers);
            requestHeaders.set('x-user-role', role);
            requestHeaders.set('x-user-id', (payload as any).userId);
            requestHeaders.set('x-shop-id', (payload as any).shopId);

            return NextResponse.next({ request: { headers: requestHeaders } });
        } catch (error) {
            console.warn('Invalid or expired token. Redirecting to login.');
            const url = req.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}
