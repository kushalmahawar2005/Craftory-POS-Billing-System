'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import FloatingPOSVisual from '@/components/marketing/FloatingPOSVisual';
import StickyScrollFeatures from '@/components/marketing/StickyScrollFeatures';
import FeatureLaptopSlider from '@/components/marketing/FeatureLaptopSlider';
import {
  ShoppingCart, BarChart3, Package, Users, Store, Receipt, MessageSquare,
  FileText, ArrowRight, Check, Star, Zap, Shield, Globe, TrendingUp,
  CreditCard, Smartphone, ArrowUpRight, Play
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

const features = [
  { icon: Receipt,        title: 'Smart Billing',         desc: 'Create invoices in seconds with barcode scanning, GST calculations, and thermal printing.' },
  { icon: Package,        title: 'Inventory Management',  desc: 'Real-time stock tracking with low-stock alerts and automated reorder points.' },
  { icon: ShoppingCart,   title: 'Product Management',    desc: 'Organize products with categories, variants, pricing tiers, and batch tracking.' },
  { icon: BarChart3,      title: 'Sales Reports',         desc: 'Comprehensive analytics with daily, weekly, and monthly sales insights.' },
  { icon: Users,          title: 'Customer Management',   desc: 'Build customer profiles with purchase history, loyalty points, and credit tracking.' },
  { icon: Store,          title: 'Multi-Store Support',   desc: 'Manage multiple store locations from a single unified dashboard.' },
  { icon: FileText,       title: 'GST Billing',           desc: 'Auto-calculate GST with CGST, SGST, IGST support and generate GST-compliant invoices.' },
  { icon: MessageSquare,  title: 'WhatsApp Invoices',     desc: 'Send digital invoices directly to customers via WhatsApp integration.' },
];

const stats = [
  { value: '15,000+', label: 'Active Businesses' },
  { value: '₹500Cr+', label: 'Transactions Processed' },
  { value: '99.9%',   label: 'Uptime Guarantee' },
  { value: '4.8/5',   label: 'Customer Rating' },
];

const testimonials = [
  { name: 'Rajesh Kumar', role: 'Owner, Kumar Electronics', text: 'Craftory POS transformed how we manage our electronics store. The barcode scanning and inventory tracking saved us hours every day.', rating: 5 },
  { name: 'Priya Sharma', role: 'Manager, Sharma Pharmacy',  text: 'GST billing was a nightmare before Craftory POS. Now it\'s automatic and our compliance is always up to date.', rating: 5 },
  { name: 'Amit Patel',   role: 'Owner, Patel Wholesale',    text: 'Managing 3 warehouse locations used to be chaos. The multi-store feature brought everything under one dashboard.', rating: 5 },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a simple loading skeleton to prevent hydration mismatch
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-white to-blue-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                <Zap className="w-3.5 h-3.5" />
                #1 POS Solution for Indian Retail
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] tracking-tight">
                Start Smart Retail
                <br />
                Billing with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                  Craftory POS
                </span>
              </h1>
              <p className="mt-6 text-lg text-text-muted leading-relaxed max-w-lg">
                Cloud-based billing software built for Indian retail businesses. Manage inventory, generate GST invoices, track sales, and grow your business — all from one powerful platform.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all text-sm"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-text-primary font-semibold rounded-xl border border-border hover:border-primary/30 hover:bg-primary-light shadow-sm transition-all text-sm"
                >
                  <Play className="w-4 h-4 text-primary" />
                  Watch Demo
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-text-muted">
                <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-secondary-green" /> Free 14-day trial</div>
                <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-secondary-green" /> No credit card</div>
                <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-secondary-green" /> Cancel anytime</div>
              </div>
            </motion.div>

            {/* Right - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Dashboard Card */}
                <div className="bg-white rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
                  <div className="bg-sidebar-dark p-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 mx-8">
                      <div className="bg-white/10 rounded-md px-3 py-1 text-xs text-sidebar-text text-center">
                        app.craftorypos.com/dashboard
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-page-bg">
                    {/* Mini Dashboard */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: "Today's Sales", value: '₹24,580', change: '+12%', color: 'text-secondary-green' },
                        { label: 'Orders', value: '47', change: '+8%', color: 'text-primary' },
                        { label: 'Customers', value: '23', change: '+5%', color: 'text-analytics-purple' },
                      ].map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + i * 0.15 }}
                          className="bg-white rounded-xl p-3 border border-border/50"
                        >
                          <p className="text-[10px] text-text-muted">{stat.label}</p>
                          <p className="text-lg font-bold text-text-primary mt-0.5">{stat.value}</p>
                          <p className={`text-[10px] font-medium ${stat.color}`}>{stat.change}</p>
                        </motion.div>
                      ))}
                    </div>
                    {/* Chart Placeholder */}
                    <div className="bg-white rounded-xl p-4 border border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-text-primary">Revenue Overview</span>
                        <span className="text-[10px] text-text-muted">Last 7 days</span>
                      </div>
                      <div className="flex items-end gap-1.5 h-20">
                        {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 1 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                            className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-md"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-xl p-3 shadow-xl border border-border/50 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-secondary-green/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-secondary-green" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Monthly Revenue</p>
                    <p className="text-sm font-bold text-text-primary">₹7,42,000</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-xl border border-border/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Receipt className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">New Invoice</p>
                      <p className="text-xs font-bold text-secondary-green">₹2,450 ✓</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Zoho Inspired Floating POS Visual */}
      <FloatingPOSVisual />
      
      {/* Sticky Scrolling Features */}
      <StickyScrollFeatures />

      {/* Stats */}
      <section className="py-16 bg-white border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-text-primary">{stat.value}</div>
                <div className="text-sm text-text-muted mt-1 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 bg-page-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              <Zap className="w-3.5 h-3.5" /> Powerful Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
              Everything you need to run your business
            </h2>
            <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
              From billing to inventory, customer management to analytics — Craftory POS gives you all the tools in one place.
            </p>
          </motion.div>

          <div className="-mx-4 sm:-mx-6 lg:-mx-8">
            <FeatureLaptopSlider />
          </div>

          <motion.div {...fadeInUp} className="text-center mt-6">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
            >
              Explore all features <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-green/10 text-secondary-green text-sm font-medium rounded-full mb-4">
                <Shield className="w-3.5 h-3.5" /> Why Craftory POS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
                Built for Indian retail businesses
              </h2>
              <p className="mt-4 text-text-muted leading-relaxed">
                We understand the unique needs of Indian retail — from GST compliance to multi-language support, barcode billing to WhatsApp invoicing.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: Globe, text: 'Multi-language support — Hindi, English, Tamil, and more' },
                  { icon: CreditCard, text: 'UPI, card, cash — accept all payment methods' },
                  { icon: Smartphone, text: 'Works on desktop, tablet, and mobile devices' },
                  { icon: Shield, text: 'Bank-grade security with encrypted cloud backups' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center mt-0.5 shrink-0">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm text-text-primary leading-relaxed pt-1.5">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/5 to-primary-light rounded-2xl p-8"
            >
              {/* POS Interface Preview */}
              <div className="bg-white rounded-xl shadow-lg border border-border/50 overflow-hidden">
                <div className="bg-sidebar-dark px-4 py-2 flex items-center">
                  <span className="text-xs text-sidebar-text font-medium">Point of Sale</span>
                </div>
                <div className="p-4 grid grid-cols-3 gap-2">
                  {[
                    { name: 'Rice 5kg', price: '₹250' },
                    { name: 'Dal 1kg', price: '₹120' },
                    { name: 'Oil 1L', price: '₹150' },
                    { name: 'Sugar 2kg', price: '₹85' },
                    { name: 'Tea 250g', price: '₹200' },
                    { name: 'Soap', price: '₹55' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="bg-page-bg rounded-lg p-3 text-center cursor-pointer hover:bg-primary-light hover:border-primary/20 border border-transparent transition-all"
                    >
                      <div className="text-xs font-medium text-text-primary">{item.name}</div>
                      <div className="text-[10px] text-text-muted mt-0.5">{item.price}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="border-t border-border/50 p-3 bg-page-bg">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-medium">₹1,240</span>
                  </div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-text-muted">GST (18%)</span>
                    <span className="font-medium">₹223.20</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹1,463.20</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-page-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
              Trusted by thousands of businesses
            </h2>
            <p className="mt-4 text-lg text-text-muted">
              See what our customers have to say about Craftory POS.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-xl p-6 border border-border/50 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent-amber text-accent-amber" />
                  ))}
                </div>
                <p className="text-sm text-text-primary leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to transform your business?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join 15,000+ businesses already using Craftory POS. Start your free trial today — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 shadow-xl transition-all text-sm"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-sm"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
