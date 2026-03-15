import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface InvoiceData {
    invoiceNumber: string;
    createdAt: string;
    paymentMethod: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    shop: {
        shopName: string;
        ownerName: string;
        email: string;
        phone?: string | null;
        gstin?: string | null;
        gstLegalName?: string | null;
        address?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    };
    customer?: {
        name: string;
        phone?: string | null;
        email?: string | null;
    } | null;
    items: {
        product?: { name: string; barcode?: string | null; taxRate?: number | null } | null;
        quantity: number;
        price: number;
        total: number;
    }[];
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const colors = {
    primary: '#7C3AED',
    primaryLight: '#EDE9FE',
    dark: '#1a1a2e',
    muted: '#6B7280',
    border: '#E5E7EB',
    green: '#10b981',
    white: '#FFFFFF',
    pageBg: '#F9FAFB',
};

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 9,
        color: colors.dark,
        backgroundColor: colors.white,
        padding: 40,
    },
    // ── Header ──
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 28,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        borderBottomStyle: 'solid',
    },
    brandBlock: { flexDirection: 'column', gap: 3 },
    brandName: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: colors.primary, letterSpacing: 0.5 },
    brandTagline: { fontSize: 8, color: colors.muted, letterSpacing: 0.3 },
    shopInfo: { fontSize: 8, color: colors.muted, marginTop: 2, lineHeight: 1.5 },
    invoiceBadge: {
        backgroundColor: colors.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'flex-end',
    },
    invoiceLabel: { fontSize: 8, color: colors.primary, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5, textTransform: 'uppercase' },
    invoiceNumber: { fontSize: 13, color: colors.primary, fontFamily: 'Helvetica-Bold', marginTop: 3 },
    invoiceDate: { fontSize: 8, color: colors.muted, marginTop: 4 },
    // ── Info Row ──
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 16,
    },
    infoBox: {
        flex: 1,
        backgroundColor: colors.pageBg,
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'solid',
    },
    infoBoxTitle: { fontSize: 7, color: colors.muted, fontFamily: 'Helvetica-Bold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 },
    infoName: { fontSize: 10, color: colors.dark, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
    infoText: { fontSize: 8, color: colors.muted, lineHeight: 1.5 },
    // ── Table ──
    table: { marginBottom: 20 },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 4,
    },
    tableHeaderCell: { fontSize: 8, color: colors.white, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        borderBottomStyle: 'solid',
    },
    tableRowAlt: { backgroundColor: colors.pageBg },
    col_num: { width: '5%' },
    col_desc: { flex: 1 },
    col_hsn: { width: '12%', textAlign: 'center' },
    col_qty: { width: '8%', textAlign: 'center' },
    col_rate: { width: '13%', textAlign: 'right' },
    col_gst: { width: '8%', textAlign: 'center' },
    col_total: { width: '13%', textAlign: 'right' },
    cellText: { fontSize: 8, color: colors.dark },
    cellMuted: { fontSize: 7, color: colors.muted, marginTop: 1.5 },
    // ── Totals ──
    totalsSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 28,
    },
    totalsBox: { width: 220 },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        borderBottomStyle: 'solid',
    },
    totalLabel: { fontSize: 8, color: colors.muted },
    totalValue: { fontSize: 8, color: colors.dark, fontFamily: 'Helvetica-Bold' },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 8,
        marginTop: 6,
    },
    grandLabel: { fontSize: 10, color: colors.white, fontFamily: 'Helvetica-Bold' },
    grandValue: { fontSize: 12, color: colors.white, fontFamily: 'Helvetica-Bold' },
    // ── Payment ──
    paymentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 28,
    },
    paymentLabel: { fontSize: 8, color: colors.muted },
    paymentValue: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        fontSize: 8,
        color: colors.green,
        fontFamily: 'Helvetica-Bold',
    },
    // ── Footer ──
    footer: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderTopStyle: 'solid',
        paddingTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerNote: { fontSize: 7.5, color: colors.muted },
    footerBrand: { fontSize: 7.5, color: colors.primary, fontFamily: 'Helvetica-Bold' },
    // ── GST Summary ──
    gstTable: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'solid',
        borderRadius: 6,
        overflow: 'hidden',
    },
    gstHeader: {
        flexDirection: 'row',
        backgroundColor: colors.pageBg,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        borderBottomStyle: 'solid',
    },
    gstRow: {
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    gstTitle: { fontSize: 8, color: colors.dark, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
    gstCell: { fontSize: 8, color: colors.muted },
    gstCellBold: { fontSize: 8, color: colors.dark, fontFamily: 'Helvetica-Bold' },
    amountInWords: {
        fontSize: 8,
        color: colors.muted,
        fontStyle: 'italic',
        marginBottom: 16,
    },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtCurrency(n: number) {
    return '₹' + n.toFixed(2);
}

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function numToWords(n: number): string {
    const int = Math.floor(n);
    if (int === 0) return 'Zero';
    if (int < 20) return ones[int];
    if (int < 100) return tens[Math.floor(int / 10)] + (int % 10 ? ' ' + ones[int % 10] : '');
    if (int < 1000) return ones[Math.floor(int / 100)] + ' Hundred' + (int % 100 ? ' ' + numToWords(int % 100) : '');
    if (int < 100000) return numToWords(Math.floor(int / 1000)) + ' Thousand' + (int % 1000 ? ' ' + numToWords(int % 1000) : '');
    if (int < 10000000) return numToWords(Math.floor(int / 100000)) + ' Lakh' + (int % 100000 ? ' ' + numToWords(int % 100000) : '');
    return numToWords(Math.floor(int / 10000000)) + ' Crore' + (int % 10000000 ? ' ' + numToWords(int % 10000000) : '');
}

function totalInWords(total: number): string {
    const int = Math.floor(total);
    const paise = Math.round((total - int) * 100);
    let words = numToWords(int) + ' Rupees';
    if (paise > 0) words += ' and ' + numToWords(paise) + ' Paise';
    return words + ' Only';
}

// ─── Component ───────────────────────────────────────────────────────────────

export function InvoicePDF({ data }: { data: InvoiceData }) {
    const shopAddress = [
        data.shop.address,
        data.shop.city,
        data.shop.state,
        data.shop.pincode,
    ].filter(Boolean).join(', ');

    const dateStr = new Date(data.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric',
    });
    const timeStr = new Date(data.createdAt).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit',
    });

    // GST summary (group by tax rate)
    const gstBreakdown: Record<number, { taxable: number; cgst: number; sgst: number }> = {};
    for (const item of data.items) {
        const rate = item.product?.taxRate ?? 0;
        const taxable = item.total / (1 + rate / 100);
        const gstAmt = item.total - taxable;
        if (!gstBreakdown[rate]) gstBreakdown[rate] = { taxable: 0, cgst: 0, sgst: 0 };
        gstBreakdown[rate].taxable += taxable;
        gstBreakdown[rate].cgst += gstAmt / 2;
        gstBreakdown[rate].sgst += gstAmt / 2;
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* ── Header ── */}
                <View style={styles.header}>
                    <View style={styles.brandBlock}>
                        <Text style={styles.brandName}>
                            {data.shop.shopName || 'Craftory POS'}
                        </Text>
                        <Text style={styles.brandTagline}>
                            {data.shop.gstLegalName || data.shop.shopName}
                        </Text>
                        {data.shop.gstin && (
                            <Text style={styles.shopInfo}>GSTIN: {data.shop.gstin}</Text>
                        )}
                        {shopAddress && (
                            <Text style={[styles.shopInfo, { maxWidth: 220 }]}>{shopAddress}</Text>
                        )}
                        {data.shop.phone && (
                            <Text style={styles.shopInfo}>Ph: {data.shop.phone}</Text>
                        )}
                        {data.shop.email && (
                            <Text style={styles.shopInfo}>Email: {data.shop.email}</Text>
                        )}
                    </View>
                    <View style={styles.invoiceBadge}>
                        <Text style={styles.invoiceLabel}>Tax Invoice</Text>
                        <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>
                        <Text style={styles.invoiceDate}>{dateStr} · {timeStr}</Text>
                    </View>
                </View>

                {/* ── Billed To / Payment ── */}
                <View style={styles.infoRow}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoBoxTitle}>Billed To</Text>
                        <Text style={styles.infoName}>
                            {data.customer?.name || 'Walk-in Customer'}
                        </Text>
                        {data.customer?.phone && (
                            <Text style={styles.infoText}>Ph: {data.customer.phone}</Text>
                        )}
                        {data.customer?.email && (
                            <Text style={styles.infoText}>{data.customer.email}</Text>
                        )}
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoBoxTitle}>Payment Details</Text>
                        <Text style={styles.infoName}>{data.paymentMethod}</Text>
                        <Text style={styles.infoText}>Status: Paid ✓</Text>
                        <Text style={styles.infoText}>Date: {dateStr}</Text>
                    </View>
                </View>

                {/* ── Items Table ── */}
                <View style={styles.table}>
                    {/* Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, styles.col_num]}>#</Text>
                        <Text style={[styles.tableHeaderCell, styles.col_desc]}>Item Description</Text>
                        <Text style={[styles.tableHeaderCell, styles.col_qty]}>Qty</Text>
                        <Text style={[styles.tableHeaderCell, styles.col_rate]}>Unit Price</Text>
                        <Text style={[styles.tableHeaderCell, styles.col_gst]}>GST%</Text>
                        <Text style={[styles.tableHeaderCell, styles.col_total]}>Amount</Text>
                    </View>
                    {/* Rows */}
                    {data.items.map((item, i) => (
                        <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                            <Text style={[styles.cellText, styles.col_num, { color: '#9CA3AF' }]}>{i + 1}</Text>
                            <View style={styles.col_desc}>
                                <Text style={styles.cellText}>{item.product?.name || 'Product'}</Text>
                                {item.product?.barcode && (
                                    <Text style={styles.cellMuted}>Code: {item.product.barcode}</Text>
                                )}
                            </View>
                            <Text style={[styles.cellText, styles.col_qty, { textAlign: 'center' }]}>
                                {item.quantity}
                            </Text>
                            <Text style={[styles.cellText, styles.col_rate, { textAlign: 'right' }]}>
                                {fmtCurrency(item.price)}
                            </Text>
                            <Text style={[styles.cellText, styles.col_gst, { textAlign: 'center' }]}>
                                {item.product?.taxRate ?? 0}%
                            </Text>
                            <Text style={[styles.cellText, styles.col_total, { textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>
                                {fmtCurrency(item.total)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* ── Amount in Words ── */}
                <Text style={styles.amountInWords}>
                    Amount in Words: {totalInWords(data.total)}
                </Text>

                {/* ── GST Summary ── */}
                {Object.keys(gstBreakdown).length > 0 && data.tax > 0 && (
                    <View style={styles.gstTable}>
                        <View style={styles.gstHeader}>
                            <Text style={[styles.gstTitle, { flex: 1 }]}>GST Rate</Text>
                            <Text style={[styles.gstTitle, { width: '25%', textAlign: 'right' }]}>Taxable Amt</Text>
                            <Text style={[styles.gstTitle, { width: '20%', textAlign: 'right' }]}>CGST</Text>
                            <Text style={[styles.gstTitle, { width: '20%', textAlign: 'right' }]}>SGST</Text>
                            <Text style={[styles.gstTitle, { width: '20%', textAlign: 'right' }]}>Total GST</Text>
                        </View>
                        {Object.entries(gstBreakdown).map(([rate, val]) => (
                            <View key={rate} style={styles.gstRow}>
                                <Text style={[styles.gstCell, { flex: 1 }]}>{rate}%</Text>
                                <Text style={[styles.gstCell, { width: '25%', textAlign: 'right' }]}>{fmtCurrency(val.taxable)}</Text>
                                <Text style={[styles.gstCell, { width: '20%', textAlign: 'right' }]}>{fmtCurrency(val.cgst)}</Text>
                                <Text style={[styles.gstCell, { width: '20%', textAlign: 'right' }]}>{fmtCurrency(val.sgst)}</Text>
                                <Text style={[styles.gstCellBold, { width: '20%', textAlign: 'right' }]}>{fmtCurrency(val.cgst + val.sgst)}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ── Totals ── */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalsBox}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>{fmtCurrency(data.subtotal)}</Text>
                        </View>
                        {data.tax > 0 && (
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>GST / Tax</Text>
                                <Text style={styles.totalValue}>{fmtCurrency(data.tax)}</Text>
                            </View>
                        )}
                        {data.discount > 0 && (
                            <View style={styles.totalRow}>
                                <Text style={[styles.totalLabel, { color: '#10b981' }]}>Discount</Text>
                                <Text style={[styles.totalValue, { color: '#10b981' }]}>- {fmtCurrency(data.discount)}</Text>
                            </View>
                        )}
                        <View style={styles.grandTotalRow}>
                            <Text style={styles.grandLabel}>GRAND TOTAL</Text>
                            <Text style={styles.grandValue}>{fmtCurrency(data.total)}</Text>
                        </View>
                    </View>
                </View>

                {/* ── Payment Badge ── */}
                <View style={styles.paymentBadge}>
                    <Text style={styles.paymentLabel}>Payment Mode:</Text>
                    <Text style={styles.paymentValue}>{data.paymentMethod} — PAID</Text>
                </View>

                {/* ── Footer ── */}
                <View style={styles.footer}>
                    <View>
                        <Text style={styles.footerNote}>Thank you for your business!</Text>
                        <Text style={[styles.footerNote, { marginTop: 2 }]}>
                            For queries: {data.shop.email}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.footerNote, { marginBottom: 20 }]}>For {data.shop.shopName}</Text>
                        <Text style={styles.footerNote}>Authorized Signatory</Text>
                    </View>
                </View>

                {/* ── Generated By ── */}
                <Text style={[styles.footerNote, { textAlign: 'center', marginTop: 20 }]}>
                    Generated by <Text style={styles.footerBrand}>CraftoryPOS</Text> · {new Date().toLocaleDateString('en-IN')}
                </Text>
            </Page>
        </Document>
    );
}

// Builder for use with renderToBuffer (returns a Document-typed element)
export function buildInvoiceDocument(data: InvoiceData) {
    const pdf = InvoicePDF({ data });
    return pdf; // InvoicePDF returns <Document>...</Document> which is a valid ReactElement<DocumentProps>
}
