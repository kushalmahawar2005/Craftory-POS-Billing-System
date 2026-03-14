// ============================================================
// src/lib/mailer.ts — Nodemailer Email Service
// ============================================================
import nodemailer from 'nodemailer';

// Primary branding colors
const PRIMARY = '#0369E2';
const CTA_RED = '#E2001A';

// Reusable transporter singleton
function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASS!,
        },
    });
}

// Shared email HTML wrapper
function emailWrapper(content: string): string {
    return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:${PRIMARY};padding:30px 40px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                    🛒 Craftory<span style="color:#93c5fd;">POS</span>
                  </h1>
                  <p style="color:#bfdbfe;margin:6px 0 0;font-size:13px;">Smart Billing for Modern Retail</p>
                </td>
              </tr>
              <!-- Body -->
              <tr><td style="padding:40px;">${content}</td></tr>
              <!-- Footer -->
              <tr>
                <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                  <p style="color:#94a3b8;font-size:12px;margin:0;">© 2026 Craftory POS. All rights reserved.</p>
                  <p style="color:#94a3b8;font-size:11px;margin:6px 0 0;">If you didn't request this email, please ignore it.</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
    </html>
  `;
}

// Reusable CTA button
function ctaButton(text: string, url: string, color = PRIMARY): string {
    return `
    <div style="text-align:center;margin:32px 0;">
      <a href="${url}" style="background:${color};color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;display:inline-block;">
        ${text}
      </a>
    </div>
  `;
}

// ─── WELCOME EMAIL ──────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
    const content = `
    <h2 style="color:#1e293b;font-size:22px;margin:0 0 16px;">Welcome, ${name}! 🎉</h2>
    <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Your <strong>Craftory POS</strong> account is ready. Start managing your shop with smart billing, real-time inventory tracking, and powerful analytics.
    </p>
    <div style="background:#f0f9ff;border-left:4px solid ${PRIMARY};padding:16px;border-radius:0 8px 8px 0;margin:24px 0;">
      <p style="color:#0c4a6e;margin:0;font-size:14px;">
        ✅ Your account is <strong>verified & active</strong><br/>
        🏪 Set up your first store<br/>
        📦 Add products & start billing
      </p>
    </div>
    ${ctaButton('Go to Dashboard →', `${process.env.NEXT_PUBLIC_APP_URL}/app/dashboard`)}
    <p style="color:#94a3b8;font-size:13px;text-align:center;">Excited to have you on board!</p>
  `;

    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"Craftory POS" <${process.env.SMTP_USER}>`,
        to,
        subject: `Welcome to Craftory POS, ${name}! 🎉`,
        html: emailWrapper(content),
    });
}

// ─── PASSWORD RESET EMAIL ────────────────────────────────────
export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    const content = `
    <h2 style="color:#1e293b;font-size:22px;margin:0 0 16px;">Reset Your Password 🔐</h2>
    <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 16px;">
      We received a request to reset your Craftory POS password. Click the button below to set a new password.
    </p>
    <div style="background:#fefce8;border-left:4px solid #eab308;padding:16px;border-radius:0 8px 8px 0;margin:24px 0;">
      <p style="color:#713f12;margin:0;font-size:13px;">⏰ This link expires in <strong>30 minutes</strong>.</p>
    </div>
    ${ctaButton('Reset Password', resetLink, CTA_RED)}
    <p style="color:#64748b;font-size:13px;text-align:center;">
      Or copy this link: <a href="${resetLink}" style="color:${PRIMARY};word-break:break-all;">${resetLink}</a>
    </p>
  `;

    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"Craftory POS" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Reset Your Password - Craftory POS',
        html: emailWrapper(content),
    });
}

// ─── INVOICE EMAIL ────────────────────────────────────────────
export async function sendInvoiceEmail(
    to: string,
    invoiceData: {
        invoiceNumber: string;
        shopName: string;
        customerName: string;
        items: { name: string; quantity: number; price: number }[];
        subtotal: number;
        tax: number;
        discount: number;
        total: number;
        paymentMethod: string;
        createdAt: string;
    }
): Promise<void> {
    const itemRows = invoiceData.items
        .map(
            (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#334155;">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#64748b;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#64748b;text-align:right;">₹${item.price.toFixed(2)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#1e293b;font-weight:600;text-align:right;">₹${(item.quantity * item.price).toFixed(2)}</td>
      </tr>`
        )
        .join('');

    const content = `
    <h2 style="color:#1e293b;font-size:22px;margin:0 0 4px;">Invoice #${invoiceData.invoiceNumber}</h2>
    <p style="color:#64748b;font-size:13px;margin:0 0 24px;">${invoiceData.shopName} · ${invoiceData.createdAt}</p>
    <p style="color:#475569;font-size:15px;margin:0 0 24px;">Hi <strong>${invoiceData.customerName}</strong>, thank you for your purchase!</p>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <thead>
        <tr style="background:#f8fafc;">
          <th style="padding:12px;text-align:left;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Item</th>
          <th style="padding:12px;text-align:center;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Qty</th>
          <th style="padding:12px;text-align:right;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Price</th>
          <th style="padding:12px;text-align:right;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="color:#64748b;padding:4px 0;">Subtotal</td><td style="text-align:right;color:#475569;">₹${invoiceData.subtotal.toFixed(2)}</td></tr>
      <tr><td style="color:#64748b;padding:4px 0;">Tax</td><td style="text-align:right;color:#475569;">₹${invoiceData.tax.toFixed(2)}</td></tr>
      <tr><td style="color:#64748b;padding:4px 0;">Discount</td><td style="text-align:right;color:#22c55e;">-₹${invoiceData.discount.toFixed(2)}</td></tr>
      <tr style="border-top:2px solid #1e293b;">
        <td style="color:#1e293b;font-weight:700;font-size:16px;padding-top:10px;">Total</td>
        <td style="text-align:right;color:${PRIMARY};font-weight:700;font-size:16px;padding-top:10px;">₹${invoiceData.total.toFixed(2)}</td>
      </tr>
    </table>
    <p style="color:#64748b;font-size:13px;">Payment: <strong>${invoiceData.paymentMethod}</strong></p>
  `;

    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"${invoiceData.shopName}" <${process.env.SMTP_USER}>`,
        to,
        subject: `Invoice #${invoiceData.invoiceNumber} from ${invoiceData.shopName}`,
        html: emailWrapper(content),
    });
}

// ─── LOW STOCK ALERT ─────────────────────────────────────────
export async function sendLowStockAlert(
    to: string,
    items: { name: string; stock: number; minStock?: number }[]
): Promise<void> {
    const itemRows = items
        .map(
            (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#334155;">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:center;">
          <span style="background:#fef2f2;color:#dc2626;padding:3px 10px;border-radius:20px;font-weight:600;font-size:13px;">${item.stock} left</span>
        </td>
      </tr>`
        )
        .join('');

    const content = `
    <h2 style="color:#dc2626;font-size:22px;margin:0 0 8px;">⚠️ Low Stock Alert</h2>
    <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 24px;">
      The following products are running low on stock. Please reorder soon to avoid stockouts.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #fee2e2;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <thead>
        <tr style="background:#fef2f2;">
          <th style="padding:12px;text-align:left;color:#dc2626;font-size:12px;font-weight:600;">Product</th>
          <th style="padding:12px;text-align:center;color:#dc2626;font-size:12px;font-weight:600;">Stock</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    ${ctaButton('Manage Inventory →', `${process.env.NEXT_PUBLIC_APP_URL}/app/inventory`, CTA_RED)}
  `;

    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"Craftory POS Alerts" <${process.env.SMTP_USER}>`,
        to,
        subject: `⚠️ Low Stock Alert — ${items.length} product(s) need attention`,
        html: emailWrapper(content),
    });
}
