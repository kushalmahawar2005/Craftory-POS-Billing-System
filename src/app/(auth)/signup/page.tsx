'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Phone, MapPin, ArrowRight, ShoppingCart, Shield } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      setStep('otp');
      setLoading(false);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    const code = otp.join('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid OTP');
        setLoading(false);
        return;
      }
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/app/onboarding';
    } catch {
      setError('Verification failed');
      setLoading(false);
    }
  };

  const handleResend = () => {
    setLoading(true);
    setError('');
    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      setOtp(['1', '2', '3', '4', '5', '6']);
    }, 600);
  };

  if (step === 'otp') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-text-primary">Craftory<span className="text-primary">POS</span></span>
        </Link>

        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary">Verify your phone</h1>
        <p className="text-sm text-text-muted mt-1 mb-4">
          We&apos;ve sent a 6-digit code to <span className="font-semibold text-text-primary">{formData.phone}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-error text-sm rounded-lg">{error}</div>
        )}

        <div className="flex gap-2 justify-center mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              className="w-12 h-12 text-center text-lg font-bold bg-input-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          ))}
        </div>

        <button
          onClick={verifyOtp}
          disabled={loading || otp.join('').length !== 6}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark shadow-md disabled:opacity-50 transition-all text-sm"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Verify & Continue <ArrowRight className="w-4 h-4" /></>
          )}
        </button>

        <p className="text-center text-sm text-text-muted mt-4">
          Didn&apos;t receive code?{' '}
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-primary font-semibold hover:text-primary-dark transition-colors disabled:opacity-50"
          >
            Resend
          </button>
        </p>
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

      <h1 className="text-2xl font-extrabold text-text-primary">Create your account</h1>
      <p className="text-sm text-text-muted mt-1 mb-8">Start your free 14-day trial. No credit card required.</p>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 text-error text-sm rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSignup} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Owner / Client Name</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"><User className="w-[18px] h-[18px] text-text-muted" /></div>
            <input
              type="text" required value={formData.name} onChange={e => update('name', e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-input-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Your full name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Email address</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"><Mail className="w-[18px] h-[18px] text-text-muted" /></div>
            <input
              type="email" required value={formData.email} onChange={e => update('email', e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-input-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"><Lock className="w-[18px] h-[18px] text-text-muted" /></div>
            <input
              type={showPassword ? 'text' : 'password'} required value={formData.password}
              onChange={e => update('password', e.target.value)}
              className="w-full h-11 pl-11 pr-11 bg-input-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Min 8 characters"
              minLength={8}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
              {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Phone Number</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"><Phone className="w-[18px] h-[18px] text-text-muted" /></div>
            <input
              type="tel" required value={formData.phone} onChange={e => update('phone', e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-input-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Location</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"><MapPin className="w-[18px] h-[18px] text-text-muted" /></div>
            <input
              type="text" required value={formData.location} onChange={e => update('location', e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-input-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="City, State"
            />
          </div>
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <input type="checkbox" required className="w-4 h-4 rounded border-border text-primary accent-primary mt-0.5" />
          <span className="text-xs text-text-muted leading-relaxed">
            I agree to the <Link href="#" className="text-primary font-medium">Terms of Service</Link> and{' '}
            <Link href="#" className="text-primary font-medium">Privacy Policy</Link>
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 flex items-center justify-center gap-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Create Account <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button className="w-full h-11 flex items-center justify-center gap-3 bg-white border border-border rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-text-primary">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign up with Google
      </button>

      <p className="text-center text-sm text-text-muted mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
