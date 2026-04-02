import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import path from 'path';
import fs from 'fs';

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

        // Step 1: Business Profile
        if (step === 1) {
            const { businessName, businessType, ownerName, phone, email } = data;
            await db.shop.update({
                where: { id: session.shopId },
                data: {
                    shopName: businessName || undefined,
                    businessType: businessType || undefined,
                    ownerName: ownerName || undefined,
                    phone: phone || undefined,
                    email: email || undefined,
                },
            });
            return NextResponse.json({ success: true, message: 'Business profile saved' });
        }

        // Step 2: GST Details
        if (step === 2) {
            const { gstRegistered, gstin, defaultGSTRate } = data;
            await db.shop.update({
                where: { id: session.shopId },
                data: {
                    gstRegistered: gstRegistered === 'Yes' || gstRegistered === true,
                    gstin: gstin || null,
                    defaultGSTRate: defaultGSTRate ? parseFloat(defaultGSTRate) : 18,
                },
            });
            return NextResponse.json({ success: true, message: 'GST details saved' });
        }

        // Step 3: Store Address
        if (step === 3) {
            const { address, city, state, pincode } = data;
            if (session.storeId) {
                await db.store.update({
                    where: { id: session.storeId },
                    data: {
                        address: address || undefined,
                        city: city || undefined,
                        state: state || undefined,
                        pincode: pincode || undefined,
                        location: [city, state].filter(Boolean).join(', ') || undefined,
                    },
                });
            }
            return NextResponse.json({ success: true, message: 'Store address saved' });
        }

        // Step 4: Preferences
        if (step === 4) {
            const { currency, timezone, language, fiscalYearStart } = data;
            await db.shop.update({
                where: { id: session.shopId },
                data: {
                    currency: currency || 'INR',
                    timezone: timezone || 'Asia/Kolkata',
                    language: language || 'English',
                    fiscalYearStart: fiscalYearStart || 'APRIL',
                },
            });
            return NextResponse.json({ success: true, message: 'Preferences saved' });
        }

        // Step 5: POS Settings
        if (step === 5) {
            const { receiptTemplate, paperSize, defaultPaymentMethod } = data;
            if (session.storeId) {
                await db.store.update({
                    where: { id: session.storeId },
                    data: {
                        receiptTemplate: receiptTemplate || undefined,
                        paperSize: paperSize || '80mm',
                        defaultPaymentMethod: defaultPaymentMethod || 'CASH',
                    },
                });
            }
            return NextResponse.json({ success: true, message: 'POS settings saved' });
        }

        // Step 6: Complete Onboarding & Auto-Seed Categories
        if (step === 6) {
            await db.shop.update({
                where: { id: session.shopId },
                data: { onboardingCompleted: true },
            });

            // Auto-seed categories if none exist
            const categoryCount = await db.category.count({ where: { shopId: session.shopId } });
            if (categoryCount === 0) {
                const shop = await db.shop.findUnique({
                    where: { id: session.shopId },
                    select: { businessType: true }
                });

                const businessType = shop?.businessType || 'General Store';
                const seedDataPath = path.join(process.cwd(), 'src/lib/data/categories.json');
                
                try {
                    const fileContent = fs.readFileSync(seedDataPath, 'utf8');
                    const allSeedData = JSON.parse(fileContent);
                    
                    // Match businessType from JSON (case-insensitive)
                    let matchedType = allSeedData.businessTypes.find(
                        (bt: any) => bt.type.toLowerCase() === businessType.toLowerCase()
                    );
                    
                    // Fallback to General Store if no match
                    if (!matchedType) {
                        matchedType = allSeedData.businessTypes.find((bt: any) => bt.type === 'General Store');
                    }

                    if (matchedType && matchedType.categories) {
                        for (const catName of matchedType.categories) {
                            await db.category.create({
                                data: {
                                    name: catName,
                                    icon: 'Package',
                                    color: '#7C3AED',
                                    shopId: session.shopId,
                                    level: 0,
                                    status: 'ACTIVE'
                                }
                            });
                        }
                    }
                } catch (err) {
                    console.error('Seeding Error:', err);
                }
            }

            return NextResponse.json({ success: true, message: 'Onboarding completed successfully!' });
        }

        return NextResponse.json({ error: 'Invalid step' }, { status: 400 });

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
                ownerName: shop.ownerName,
                phone: shop.phone || '',
                email: shop.email,
            },
            step2: {
                gstRegistered: shop.gstRegistered ? 'Yes' : 'No',
                gstin: shop.gstin || '',
                defaultGSTRate: shop.defaultGSTRate || 18,
            },
            step3: {
                address: store?.address || '',
                city: store?.city || '',
                state: store?.state || '',
                pincode: store?.pincode || '',
            },
            step4: {
                currency: shop.currency || 'INR',
                timezone: shop.timezone || 'Asia/Kolkata',
                language: shop.language || 'English',
                fiscalYearStart: shop.fiscalYearStart || 'APRIL',
            },
            step5: {
                receiptTemplate: store?.receiptTemplate || '',
                paperSize: store?.paperSize || '80mm',
                defaultPaymentMethod: store?.defaultPaymentMethod || 'CASH',
            },
        });
    } catch (error) {
        console.error('Onboarding Fetch Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
