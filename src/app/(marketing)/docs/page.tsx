'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ShoppingCart, Package, Barcode, FileText, Calculator, ChevronRight, Search, ArrowRight } from 'lucide-react';

const guides = [
  {
    id: 'getting-started', icon: BookOpen, title: 'Getting Started',
    articles: [
      { title: 'Create your Craftory POS account', content: 'Sign up at craftorypos.com with your email and business details. Verify your email and complete the onboarding steps to set up your store profile, including business name, type, logo, and language preferences.' },
      { title: 'Set up your store profile', content: 'Navigate to Settings → Store Profile. Add your business name, address, GSTIN, logo, and contact details. This information appears on your invoices and receipts.' },
      { title: 'Configure tax settings', content: 'Go to Settings → Tax Configuration. Enter your GSTIN (15 digits), select your registration type, and configure GST rates for different product categories. Craftory POS supports CGST, SGST, and IGST calculations.' },
      { title: 'Invite team members', content: 'Go to Settings → Users. Click "Add User" to invite cashiers and managers with role-based permissions. Each user gets their own login credentials.' },
    ],
  },
  {
    id: 'products', icon: Package, title: 'Add Products',
    articles: [
      { title: 'Add products manually', content: 'Go to Products → Add New. Fill in the product name, category, HSN code, purchase price, selling price, GST rate, and opening stock quantity. You can also add product images and variants.' },
      { title: 'Import products from CSV', content: 'Go to Products → Import. Download the sample CSV template, fill in your product data, and upload the file. Craftory POS supports .csv, .tsv, and .xlsx file formats for bulk import.' },
      { title: 'Manage categories', content: 'Organize your products into categories and subcategories for easier navigation during billing. Go to Products → Categories to create, edit, or reorder your product categories.' },
      { title: 'Set up product variants', content: 'For products with size, color, or weight variations, use the Variants feature. Each variant can have its own SKU, price, and stock level.' },
    ],
  },
  {
    id: 'billing', icon: ShoppingCart, title: 'Start Billing',
    articles: [
      { title: 'Create a new sale', content: 'Go to POS → New Sale. Scan barcodes or search products to add them to the cart. Adjust quantities, apply discounts, and select the payment method to complete the sale.' },
      { title: 'Apply discounts', content: 'Apply item-level or cart-level discounts during billing. You can set percentage or flat discounts. For recurring discounts, configure them in Settings → Pricing Rules.' },
      { title: 'Process returns', content: 'Go to Sales → Returns. Search for the original invoice number, select the items to return, and process the refund. The stock is automatically updated.' },
      { title: 'Print receipts', content: 'After completing a sale, click Print to send the receipt to your connected thermal printer. You can customize the receipt layout in Settings → Receipt Template.' },
    ],
  },
  {
    id: 'barcode', icon: Barcode, title: 'Barcode Scanner',
    articles: [
      { title: 'Connect your barcode scanner', content: 'Plug your USB barcode scanner into your computer. Craftory POS auto-detects the scanner. For wireless scanners, pair via Bluetooth and select the device in Settings → Hardware.' },
      { title: 'Generate barcode labels', content: 'Go to Products → Barcode Labels. Select the products you want to print labels for, choose the label size (1x1, 2x1, or custom), and print them on your label printer.' },
      { title: 'Scan to bill', content: 'In the POS billing screen, simply scan a product barcode. The product is automatically added to the cart. Scan again to increase quantity.' },
    ],
  },
  {
    id: 'gst', icon: Calculator, title: 'GST Invoices',
    articles: [
      { title: 'Configure GST rates', content: 'Go to Settings → Tax Rates. Add GST rates (0%, 5%, 12%, 18%, 28%) and assign HSN codes to your products. CGST and SGST are auto-calculated based on the buyer location.' },
      { title: 'Generate GST invoices', content: 'Every sale automatically generates a GST-compliant invoice with your GSTIN, HSN codes, and tax breakup. Invoices follow the official GST invoice format.' },
      { title: 'Export GST reports', content: 'Go to Reports → GST Reports. Generate GSTR-1, GSTR-3B summary reports. Export data in CSV format for filing or import directly into Tally.' },
    ],
  },
  {
    id: 'tally', icon: FileText, title: 'Tally Export',
    articles: [
      { title: 'Connect to Tally', content: 'Go to Settings → Integrations → Tally. Enter your Tally company name and configure the ledger mappings. Craftory POS maps your sales, purchases, and GST data automatically.' },
      { title: 'Export sales data', content: 'Go to Reports → Export → Tally Format. Select the date range and click Export. The file is generated in Tally XML format ready for import.' },
      { title: 'Auto-sync with Tally', content: 'Enable auto-sync to automatically send daily sales data to your Tally software. Go to Settings → Integrations → Tally → Enable Auto Sync.' },
    ],
  },
];

export default function DocsPage() {
  const [activeGuide, setActiveGuide] = useState('getting-started');
  const current = guides.find(g => g.id === activeGuide)!;

  return (
    <>
      <section className="pt-32 pb-8 bg-gradient-to-b from-primary-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              <BookOpen className="w-3.5 h-3.5" /> Documentation
            </div>
            <h1 className="text-4xl font-extrabold text-text-primary">
              How to use <span className="text-primary">Craftory POS</span>
            </h1>
            <p className="mt-3 text-text-muted max-w-xl mx-auto">
              Step-by-step guides to help you get the most out of your POS system.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 shrink-0">
              <nav className="space-y-1 lg:sticky lg:top-24">
                {guides.map((guide) => {
                  const Icon = guide.icon;
                  return (
                    <button
                      key={guide.id}
                      onClick={() => setActiveGuide(guide.id)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeGuide === guide.id
                          ? 'bg-primary-light text-primary'
                          : 'text-text-muted hover:bg-gray-50 hover:text-text-primary'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {guide.title}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <motion.div
                key={activeGuide}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-extrabold text-text-primary mb-6 flex items-center gap-3">
                  <current.icon className="w-6 h-6 text-primary" />
                  {current.title}
                </h2>
                <div className="space-y-4">
                  {current.articles.map((article, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-page-bg rounded-xl p-5 border border-border/50"
                    >
                      <h3 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center text-xs font-bold text-primary">{i + 1}</span>
                        {article.title}
                      </h3>
                      <p className="text-sm text-text-muted leading-relaxed pl-8">{article.content}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
