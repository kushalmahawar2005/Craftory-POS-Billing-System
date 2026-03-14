'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1500);
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 bg-secondary-green/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-secondary-green" />
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary">Check your email</h1>
        <p className="text-sm text-text-muted mt-2 mb-8">
          We&apos;ve sent password reset instructions to <span className="font-semibold text-text-primary">{email}</span>
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:text-primary-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <ShoppingCart className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-text-primary">Craftory<span className="text-primary">POS</span></span>
      </Link>

      <h1 className="text-2xl font-extrabold text-text-primary">Forgot password?</h1>
      <p className="text-sm text-text-muted mt-1 mb-8">No worries, we&apos;ll send you reset instructions.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-input-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark shadow-md disabled:opacity-50 transition-all text-sm"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Reset Password <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-text-muted mt-6">
        <Link href="/login" className="inline-flex items-center gap-1 text-primary font-semibold hover:text-primary-dark transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to sign in
        </Link>
      </p>
    </motion.div>
  );
}
