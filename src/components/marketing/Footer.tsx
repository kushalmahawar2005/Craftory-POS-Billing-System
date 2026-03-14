'use client';

import Link from 'next/link';
import { ShoppingCart, Mail, Phone, ArrowRight } from 'lucide-react';

const links = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Integrations', href: '/integrations' },
    { label: 'Product Demo', href: '/demo' },
  ],
  Solutions: [
    { label: 'Retail Shops', href: '/solutions' },
    { label: 'Kirana Stores', href: '/solutions' },
    { label: 'Wholesalers', href: '/solutions' },
    { label: 'Pharmacies', href: '/solutions' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Support', href: '/contact' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/about' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-sidebar-dark text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold">Stay updated with Craftory POS</h3>
              <p className="text-sm text-slate-400 mt-1">Get product updates, tips, and business insights delivered to your inbox.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-2.5 bg-white/10 border border-white/15 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50"
              />
              <button className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold">Craftory<span className="text-blue-400">POS</span></span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Cloud-based POS billing software for modern retail businesses across India.
            </p>
            <div className="space-y-2.5">
              <a href="mailto:hello@craftorypos.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 shrink-0" /> hello@craftorypos.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4 shrink-0" /> +91 98765 43210
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">© 2026 Craftory POS. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {['Twitter', 'LinkedIn', 'YouTube', 'Instagram'].map((social) => (
                <a key={social} href="#" className="text-slate-500 hover:text-white transition-colors">
                  <span className="text-xs font-medium">{social}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
