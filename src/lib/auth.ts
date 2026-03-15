import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'craftory-pos-jwt-secret-key-2024-secure');

export async function getAuthSession() {
    try {
        const token = (await cookies()).get('craftory_pos_token')?.value;

        if (!token) return null;

        const { payload } = await jwtVerify(token, SECRET);

        return {
            userId: payload.userId as string,
            shopId: payload.shopId as string,
            storeId: payload.storeId as string,
            email: payload.email as string,
            name: payload.name as string,
            role: payload.role as string,
        };
    } catch (error) {
        return null;
    }
}
