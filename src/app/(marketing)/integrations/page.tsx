'use client';

import { motion } from 'framer-motion';
import { Calculator, MessageSquare, Barcode, Printer, CreditCard, Cloud, ArrowRight, Check, Layers } from 'lucide-react';
import Link from 'next/link';

const integrations = [
  {
    icon: Calculator, name: 'Tally', category: 'Accounting',
    desc: 'Export sales, purchase, and GST data directly to Tally ERP for seamless accounting and filing.',
    features: ['One-click export', 'Auto ledger mapping', 'GSTR reconciliation'],
  },
  {
    icon: MessageSquare, name: 'WhatsApp', category: 'Communication',
    desc: 'Send invoices, payment reminders, and promotional offers directly to customers via WhatsApp Business API.',
    features: ['Invoice sharing', 'Payment reminders', 'Broadcast messages'],
  },
  {
    icon: Barcode, name: 'Barcode Scanners', category: 'Hardware',
    desc: 'Plug and play with all major USB and wireless barcode scanners for lightning-fast billing.',
    features: ['USB & wireless', '1D & 2D barcodes', 'Bulk scanning'],
  },
  {
    icon: Printer, name: 'Thermal Printers', category: 'Hardware',
    desc: 'Compatible with 58mm and 80mm thermal printers for fast, silent receipt printing at checkout.',
    features: ['58mm & 80mm support', 'Custom templates', 'Auto paper detection'],
  },
  {
    icon: CreditCard, name: 'UPI Payments', category: 'Payments',
    desc: 'Accept UPI payments with QR codes, auto-reconcile transactions, and track all digital payments.',
    features: ['Dynamic QR', 'Auto reconciliation', 'Payment analytics'],
  },
  {
    icon: Cloud, name: 'Cloud Backups', category: 'Infrastructure',
    desc: 'Automatic daily backups to secure cloud storage with one-click restore and data encryption.',
    features: ['Auto daily backup', 'One-click restore', 'AES-256 encryption'],
  },
];

export default function IntegrationsPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              <Layers className="w-3.5 h-3.5" /> Integrations
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary">
              Connect with tools <span className="text-primary">you love</span>
            </h1>
            <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
              Seamless integrations with accounting software, hardware devices, payment gateways, and communication tools.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integ, i) => {
              const Icon = integ.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl p-6 border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{integ.name}</h3>
                      <span className="text-xs text-text-muted font-medium">{integ.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed mb-4">{integ.desc}</p>
                  <div className="space-y-2">
                    {integ.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-text-primary">
                        <Check className="w-3.5 h-3.5 text-secondary-green shrink-0" />
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

      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Need a custom integration?</h2>
          <p className="text-white/80 mb-8">Our API lets you connect Craftory POS with any system. Talk to our team.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-xl transition-all text-sm">
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
