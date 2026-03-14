'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Zap, Star, Crown, Building2 } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter', icon: Zap, monthlyPrice: 499, yearlyPrice: 399,
    desc: 'Perfect for small shops getting started with digital billing.',
    features: ['1 Store Location', 'Up to 500 Products', 'Basic Billing (POS)', 'Thermal Printer Support', 'Daily Sales Report', 'Email Support', 'Cloud Backup'],
    excluded: ['Multi-Store Management', 'Advanced Analytics', 'WhatsApp Invoices', 'Tally Export', 'Priority Support', 'API Access'],
    highlight: false,
  },
  {
    name: 'Growth', icon: Star, monthlyPrice: 999, yearlyPrice: 799,
    desc: 'Ideal for growing businesses that need more power and insights.',
    features: ['Up to 3 Stores', 'Unlimited Products', 'Advanced Billing + GST', 'Barcode Scanner Support', 'Inventory Management', 'Sales & Profit Reports', 'Customer Management', 'WhatsApp Invoices', 'Tally Export', 'Chat + Email Support'],
    excluded: ['Unlimited Stores', 'Custom Analytics', 'API Access'],
    highlight: true,
  },
  {
    name: 'Pro', icon: Crown, monthlyPrice: 1999, yearlyPrice: 1599,
    desc: 'For established businesses needing full-featured analytics and multi-store.',
    features: ['Up to 10 Stores', 'Unlimited Products', 'Advanced POS + GST', 'Full Inventory Suite', 'Advanced Analytics', 'Customer Loyalty System', 'WhatsApp + SMS Invoices', 'Tally Export + Reports', 'Priority Support', 'Multi-user Access'],
    excluded: ['Unlimited Stores', 'Custom API'],
    highlight: false,
  },
  {
    name: 'Enterprise', icon: Building2, monthlyPrice: null, yearlyPrice: null,
    desc: 'Custom solution for large retail chains and franchises.',
    features: ['Unlimited Stores', 'Unlimited Products', 'Custom Workflows', 'Dedicated Account Manager', 'Custom Analytics Dashboard', 'API Access', 'SLA Guarantee', 'On-premise Option', 'Custom Integrations', 'Training & Onboarding'],
    excluded: [],
    highlight: false,
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary">
              Simple, transparent <span className="text-primary">pricing</span>
            </h1>
            <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
              Choose the plan that&apos;s right for your business. All plans include a 14-day free trial.
            </p>
            {/* Toggle */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${!yearly ? 'text-text-primary' : 'text-text-muted'}`}>Monthly</span>
              <button
                onClick={() => setYearly(!yearly)}
                className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <motion.div
                  animate={{ x: yearly ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                />
              </button>
              <span className={`text-sm font-medium ${yearly ? 'text-text-primary' : 'text-text-muted'}`}>
                Yearly <span className="text-xs text-secondary-green font-bold ml-1">Save 20%</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-2xl p-6 border-2 transition-all ${
                    plan.highlight
                      ? 'border-primary shadow-xl shadow-primary/10 bg-white'
                      : 'border-border/50 bg-white hover:border-primary/20'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">{plan.name}</h3>
                  <p className="text-sm text-text-muted mt-1 mb-4">{plan.desc}</p>
                  <div className="mb-6">
                    {price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-text-primary">₹{price}</span>
                        <span className="text-sm text-text-muted">/month</span>
                      </div>
                    ) : (
                      <div className="text-2xl font-extrabold text-text-primary">Custom</div>
                    )}
                  </div>
                  <Link
                    href={price !== null ? '/signup' : '/contact'}
                    className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      plan.highlight
                        ? 'bg-primary text-white hover:bg-primary-dark shadow-md'
                        : 'bg-primary-light text-primary hover:bg-primary/15'
                    }`}
                  >
                    {price !== null ? 'Start Free Trial' : 'Contact Sales'}
                  </Link>
                  <div className="mt-6 space-y-3">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-text-primary">
                        <Check className="w-4 h-4 text-secondary-green shrink-0" />
                        {f}
                      </div>
                    ))}
                    {plan.excluded.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-text-muted line-through">
                        <X className="w-4 h-4 text-gray-300 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-page-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-text-primary text-center mb-10">Frequently Asked Questions</h2>
          {[
            { q: 'Can I switch plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.' },
            { q: 'Is there a free trial?', a: 'Yes! All plans come with a free 14-day trial with full access to all features. No credit card required.' },
            { q: 'What payment methods do you accept?', a: 'We accept UPI, credit/debit cards, net banking, and bank transfers for annual plans.' },
            { q: 'Can I cancel anytime?', a: 'Absolutely. You can cancel your subscription at any time. You will retain access until the end of your billing period.' },
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-5 mb-3 border border-border/50"
            >
              <h4 className="font-semibold text-text-primary text-sm">{faq.q}</h4>
              <p className="text-sm text-text-muted mt-2">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
