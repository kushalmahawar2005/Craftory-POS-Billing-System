'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, ShoppingCart, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send reset link');
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 bg-secondary-green/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-secondary-green" />
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary">Check your email</h1>
        <p className="text-sm text-text-muted mt-2 mb-6">
          We&apos;ve sent password reset instructions to <span className="font-semibold text-text-primary">{email}</span>
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-8 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-800">Demo Environment</h3>
            <p className="text-xs text-amber-700 mt-1">
              Since this is a demo, no actual email was sent. In a production environment, you would receive an email with a secure link.
            </p>
            <Link
              href="/login"
              className="inline-block mt-3 px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors"
            >
              Simulate Reset & Return to Login
            </Link>
          </div>
        </div>

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
