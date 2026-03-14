'use client';

import { motion } from 'framer-motion';
import {
  Receipt, Package, ShoppingCart, BarChart3, Users, Store, MessageSquare,
  FileText, Barcode, Printer, CreditCard, Globe, Shield, Smartphone,
  TrendingUp, Bell, Tag, Calculator, ArrowRight, Check, Zap
} from 'lucide-react';
import Link from 'next/link';

const allFeatures = [
  {
    category: 'Billing & Payments',
    features: [
      { icon: Receipt, title: 'Smart Billing', desc: 'Create invoices in seconds with intuitive POS interface. Support for barcode scanning, quick product search, and auto-calculation of taxes.', highlights: ['Barcode scanning', 'Quick search', 'Auto GST calculation'] },
      { icon: Calculator, title: 'GST Compliance', desc: 'Auto-calculate CGST, SGST, and IGST. Generate GST-compliant invoices and export GSTR-ready reports for seamless filing.', highlights: ['CGST/SGST/IGST', 'GSTR reports', 'HSN code support'] },
      { icon: CreditCard, title: 'Multiple Payment Modes', desc: 'Accept cash, UPI, cards, net banking, and credit payments. Split payments and maintain digital transaction records.', highlights: ['UPI payment', 'Card support', 'Split payments'] },
      { icon: Printer, title: 'Thermal Printing', desc: 'Connect to thermal receipt printers for fast, professional-looking bills. Customize receipt layout with your logo and details.', highlights: ['Custom layout', 'Logo support', 'Fast printing'] },
    ]
  },
  {
    category: 'Inventory & Products',
    features: [
      { icon: Package, title: 'Inventory Management', desc: 'Real-time stock tracking across all locations. Set reorder points, get low-stock alerts, and automate purchase orders.', highlights: ['Real-time tracking', 'Low-stock alerts', 'Auto reorder'] },
      { icon: ShoppingCart, title: 'Product Management', desc: 'Organize products with categories, subcategories, variants (size/color), pricing tiers, and batch tracking.', highlights: ['Categories & variants', 'Batch tracking', 'Pricing tiers'] },
      { icon: Barcode, title: 'Barcode System', desc: 'Generate barcodes for products, print barcode labels, and scan for instant billing. Support for 1D and 2D barcodes.', highlights: ['Generate barcodes', 'Label printing', 'Quick scan billing'] },
      { icon: Tag, title: 'Pricing & Discounts', desc: 'Set product-level or category-level discounts, manage promotional pricing, and create coupon codes for marketing campaigns.', highlights: ['Flexible discounts', 'Promo pricing', 'Coupon codes'] },
    ]
  },
  {
    category: 'Analytics & Reports',
    features: [
      { icon: BarChart3, title: 'Sales Reports', desc: 'View daily, weekly, monthly, and yearly sales data with interactive charts. Track revenue trends and identify top products.', highlights: ['Interactive charts', 'Revenue trends', 'Top products'] },
      { icon: TrendingUp, title: 'Business Analytics', desc: 'Deep insights into profit margins, customer acquisition, seasonal trends, and inventory turnover metrics.', highlights: ['Profit analysis', 'Customer insights', 'Trend detection'] },
      { icon: FileText, title: 'Tally Export', desc: 'Export your financial data directly to Tally ERP format. Seamless integration for GST filing and accounting.', highlights: ['Tally integration', 'One-click export', 'Auto mapping'] },
      { icon: Bell, title: 'Smart Alerts', desc: 'Get notified about low stock, payment dues, daily sales summaries, and important business events via email or SMS.', highlights: ['Push alerts', 'Email/SMS', 'Daily summaries'] },
    ]
  },
  {
    category: 'Customer & Multi-Store',
    features: [
      { icon: Users, title: 'Customer Management', desc: 'Build customer profiles with purchase history, loyalty points, and credit tracking. Send personalized offers.', highlights: ['Purchase history', 'Loyalty points', 'Credit tracking'] },
      { icon: MessageSquare, title: 'WhatsApp Invoices', desc: 'Send digital invoices, payment reminders, and promotional messages directly to customers via WhatsApp.', highlights: ['Instant sharing', 'Reminders', 'Marketing messages'] },
      { icon: Store, title: 'Multi-Store', desc: 'Manage multiple store locations from a single dashboard. Track sales and inventory per-store or consolidated.', highlights: ['Centralized control', 'Per-store analytics', 'Stock transfer'] },
      { icon: Globe, title: 'Cloud Access', desc: 'Access your business data from anywhere on any device. All data synced in real-time with secure cloud backups.', highlights: ['Any device', 'Real-time sync', 'Auto backups'] },
    ]
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary-light to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              <Zap className="w-3.5 h-3.5" /> Features
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary">
              Powerful features for <br />
              <span className="text-primary">modern retail</span>
            </h1>
            <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
              Everything you need to manage billing, inventory, customers, and analytics — all in one platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Categories */}
      {allFeatures.map((category, catIdx) => (
        <section
          key={category.category}
          className={`py-20 ${catIdx % 2 === 0 ? 'bg-white' : 'bg-page-bg'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-10"
            >
              {category.category}
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-6">
              {category.features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="bg-card-bg rounded-xl p-6 border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary mb-2">{feature.title}</h3>
                        <p className="text-sm text-text-muted leading-relaxed mb-4">{feature.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {feature.highlights.map((h, j) => (
                            <span key={j} className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary-light px-2.5 py-1 rounded-full">
                              <Check className="w-3 h-3" /> {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to get started?</h2>
          <p className="text-white/80 mb-8">Start your free 14-day trial and experience all features.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
