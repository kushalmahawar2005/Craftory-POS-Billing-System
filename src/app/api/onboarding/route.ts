import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

// PUT: Save onboarding step data
export async function PUT(req: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const data = await req.json();
        const { step } = data;

        if (!step) {
            return NextResponse.json({ error: 'Step number is required' }, { status: 400 });
        }

        // Step 1: Store Profile
        if (step === 1) {
            const { businessName, businessType, address, city, state, pincode, language } = data;

            // Update Shop name & business type
            await db.shop.update({
                where: { id: session.shopId },
                data: {
                    shopName: businessName || undefined,
                    businessType: businessType || undefined,
                    language: language || 'English',
                },
            });

            // Update Store address details
            if (session.storeId) {
                await db.store.update({
                    where: { id: session.storeId },
                    data: {
                        name: businessName || undefined,
                        address: address || undefined,
                        city: city || undefined,
                        state: state || undefined,
                        pincode: pincode || undefined,
                        location: [city, state].filter(Boolean).join(', ') || undefined,
                    },
                });
            }

            return NextResponse.json({ success: true, message: 'Store profile saved' });
        }

        // Step 2: Tax / GST Settings
        if (step === 2) {
            const { gstRegistered, gstin, registrationType, legalName, tradeName, registeredOn } = data;

            await db.shop.update({
                where: { id: session.shopId },
                data: {
                    gstRegistered: gstRegistered === 'Yes',
                    gstin: gstin || null,
                    gstRegistrationType: registrationType || null,
                    gstLegalName: legalName || null,
                    gstTradeName: tradeName || null,
                    gstRegisteredOn: registeredOn ? new Date(registeredOn) : null,
                },
            });

            return NextResponse.json({ success: true, message: 'Tax settings saved' });
        }

        // Step 5: Preferences
        if (step === 5) {
            const { enableDiscounts, additionalCharges, soundNotifications, emailNotifications, invoicePdf } = data;

            await db.shopPreferences.upsert({
                where: { shopId: session.shopId },
                update: {
                    enableDiscounts: enableDiscounts ?? true,
                    additionalCharges: additionalCharges ?? true,
                    soundNotifications: soundNotifications ?? true,
                    emailNotifications: emailNotifications ?? false,
                    invoicePdf: invoicePdf ?? false,
                },
                create: {
                    shopId: session.shopId,
                    enableDiscounts: enableDiscounts ?? true,
                    additionalCharges: additionalCharges ?? true,
                    soundNotifications: soundNotifications ?? true,
                    emailNotifications: emailNotifications ?? false,
                    invoicePdf: invoicePdf ?? false,
                },
            });

            return NextResponse.json({ success: true, message: 'Preferences saved' });
        }

        // Step 6: Complete Onboarding
        if (step === 6) {
            await db.shop.update({
                where: { id: session.shopId },
                data: { onboardingCompleted: true },
            });

            return NextResponse.json({ success: true, message: 'Onboarding completed!' });
        }

        // Steps 3 & 4 are navigation-only (redirect to Products/Purchase pages)
        return NextResponse.json({ success: true, message: 'Step acknowledged' });

    } catch (error) {
        console.error('Onboarding Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET: Fetch current onboarding state
export async function GET() {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const shop = await db.shop.findUnique({
            where: { id: session.shopId },
            include: {
                stores: {
                    where: { id: session.storeId },
                    take: 1,
                },
                preferences: true,
            },
        });

        if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 });

        const store = shop.stores[0];

        return NextResponse.json({
            onboardingCompleted: shop.onboardingCompleted,
            step1: {
                businessName: shop.shopName,
                businessType: shop.businessType || '',
                address: store?.address || '',
                city: store?.city || '',
                state: store?.state || '',
                pincode: store?.pincode || '',
                language: shop.language || 'English',
            },
            step2: {
                gstRegistered: shop.gstRegistered ? 'Yes' : 'No',
                gstin: shop.gstin || '',
                registrationType: shop.gstRegistrationType || '',
                legalName: shop.gstLegalName || '',
                tradeName: shop.gstTradeName || '',
                registeredOn: shop.gstRegisteredOn ? shop.gstRegisteredOn.toISOString().split('T')[0] : '',
            },
            step5: {
                enableDiscounts: shop.preferences?.enableDiscounts ?? true,
                additionalCharges: shop.preferences?.additionalCharges ?? true,
                soundNotifications: shop.preferences?.soundNotifications ?? true,
                emailNotifications: shop.preferences?.emailNotifications ?? false,
                invoicePdf: shop.preferences?.invoicePdf ?? false,
            },
        });
    } catch (error) {
        console.error('Onboarding Fetch Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
