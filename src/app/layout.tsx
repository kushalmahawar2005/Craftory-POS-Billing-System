import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Craftory POS - Smart Retail Billing & Inventory Management",
  description: "Cloud-based POS billing software for retail shops, kirana stores, wholesalers, pharmacies & more. GST billing, inventory management, sales reports & WhatsApp invoices.",
  keywords: "POS, billing software, inventory management, GST billing, retail billing, point of sale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

