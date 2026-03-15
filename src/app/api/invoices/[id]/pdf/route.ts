import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import { renderToBuffer } from '@react-pdf/renderer';
import { buildInvoiceDocument, InvoiceData } from '@/lib/invoice-pdf';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    try {
        // Fetch full sale with nested data
        const sale = await db.sale.findUnique({
            where: { id, shopId: session.shopId },
            include: {
                customer: true,
                items: {
                    include: {
                        product: {
                            select: { name: true, barcode: true, taxRate: true }
                        }
                    }
                }
            }
        });

        if (!sale) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Fetch shop + store details for the invoice header
        const shop = await db.shop.findUnique({
            where: { id: session.shopId },
            include: {
                stores: {
                    where: { id: session.storeId },
                    take: 1,
                }
            }
        });

        if (!shop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        const store = shop.stores[0];

        // Build the InvoiceData shape
        const invoiceData: InvoiceData = {
            invoiceNumber: sale.invoiceNumber,
            createdAt: sale.createdAt.toISOString(),
            paymentMethod: sale.paymentMethod,
            subtotal: sale.subtotal,
            tax: sale.tax,
            discount: sale.discount,
            total: sale.total,
            shop: {
                shopName: shop.shopName,
                ownerName: shop.ownerName,
                email: shop.email,
                phone: shop.phone,
                gstin: shop.gstin,
                gstLegalName: shop.gstLegalName,
                address: store?.address,
                city: store?.city,
                state: store?.state,
                pincode: store?.pincode,
            },
            customer: sale.customer ? {
                name: sale.customer.name,
                phone: sale.customer.phone,
                email: sale.customer.email,
            } : null,
            items: sale.items.map((item: any) => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
            })),
        };

        // Render PDF to buffer
        const pdfBuffer = await renderToBuffer(buildInvoiceDocument(invoiceData));

        // Convert Node.js Buffer → Uint8Array (guaranteed ArrayBuffer, not SharedArrayBuffer)
        const uint8Array = new Uint8Array(pdfBuffer);

        const fileName = `${sale.invoiceNumber}.pdf`;

        // Stream the PDF back
        return new NextResponse(uint8Array, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Content-Length': pdfBuffer.byteLength.toString(),
                'Cache-Control': 'no-store',
            },
        });

    } catch (error: any) {
        console.error('PDF Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate invoice PDF', details: error.message }, { status: 500 });
    }
}
