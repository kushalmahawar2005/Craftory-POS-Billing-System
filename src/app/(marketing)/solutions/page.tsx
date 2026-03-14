'use client';

import { motion } from 'framer-motion';
import { Store, ShoppingBag, Pill, Shirt, Cpu, Package, ArrowRight, Check, Building2 } from 'lucide-react';
import Link from 'next/link';

const solutions = [
  {
    icon: Store, title: 'Retail Shops', color: 'from-blue-500 to-blue-600',
    desc: 'Streamline billing, manage diverse inventory, and track daily sales with ease.',
    benefits: ['Quick billing with barcode scan', 'Multi-category product management', 'Daily/monthly sales analytics', 'Customer loyalty programs'],
  },
  {
    icon: ShoppingBag, title: 'Kirana Stores', color: 'from-green-500 to-green-600',
    desc: 'Manage FMCG products, credit customers, and generate GST-compliant bills.',
    benefits: ['Credit book management', 'Expiry date tracking', 'Weight-based billing', 'WhatsApp invoice sharing'],
  },
  {
    icon: Building2, title: 'Wholesalers', color: 'from-purple-500 to-purple-600',
    desc: 'Handle bulk orders, manage vendors, and track large inventories efficiently.',
    benefits: ['Bulk order processing', 'Vendor management', 'Purchase order system', 'Tiered pricing support'],
  },
  {
    icon: Pill, title: 'Pharmacies', color: 'from-red-500 to-red-600',
    desc: 'Track medicine batches, manage expiry dates, and maintain drug schedules.',
    benefits: ['Batch & expiry tracking', 'Drug schedule compliance', 'Prescription linking', 'Automatic reorder alerts'],
  },
  {
    icon: Shirt, title: 'Clothing Stores', color: 'from-pink-500 to-pink-600',
    desc: 'Manage size/color variants, seasonal collections, and provide great customer experience.',
    benefits: ['Size & color variants', 'Seasonal collections', 'Discount campaigns', 'Return & exchange management'],
  },
  {
    icon: Cpu, title: 'Electronics Stores', color: 'from-amber-500 to-amber-600',
    desc: 'Track serial numbers, manage warranties, and handle high-value inventory.',
    benefits: ['Serial number tracking', 'Warranty management', 'Service order tracking', 'EMI payment support'],
  },
];

export default function SolutionsPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              <Store className="w-3.5 h-3.5" /> Solutions
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary">
              Built for every <span className="text-primary">business type</span>
            </h1>
            <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
              Whether you run a kirana store or a multi-location retail chain, Craftory POS adapts to your needs.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {solutions.map((sol, i) => {
              const Icon = sol.icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center bg-page-bg rounded-2xl p-8 border border-border/50`}
                >
                  <div className="flex-1">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${sol.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-text-primary mb-3">{sol.title}</h3>
                    <p className="text-text-muted leading-relaxed mb-6">{sol.desc}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {sol.benefits.map((b, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm text-text-primary">
                          <Check className="w-4 h-4 text-secondary-green shrink-0" />
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="bg-white rounded-xl p-6 border border-border/50 shadow-sm">
                      <div className="text-center py-12">
                        <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${sol.color} flex items-center justify-center mb-4 opacity-20`}>
                          <Icon className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-sm text-text-muted">Industry-optimized POS solution</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Don&apos;t see your industry?</h2>
          <p className="text-white/80 mb-8">Craftory POS is flexible enough to adapt to any retail business. Talk to us.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm">
            Contact Sales <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
