'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page-bg flex">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-gradient-to-br from-sidebar-dark via-[#162040] to-[#0c1425] text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

        <div className="relative px-10 pt-10">
          <Link href="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Craftory<span className="text-blue-400">POS</span></span>
          </Link>

          <h2 className="text-3xl font-extrabold leading-tight">
            Smart billing for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">modern retail</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-xs">
            Join 15,000+ businesses using Craftory POS to manage billing, inventory, and customers effortlessly.
          </p>
        </div>

        <div className="relative px-10 pb-10 space-y-4">
          {['GST-compliant invoicing', 'Real-time inventory tracking', 'Multi-store management'].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-slate-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-12">
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </div>
    </div>
  );
}
