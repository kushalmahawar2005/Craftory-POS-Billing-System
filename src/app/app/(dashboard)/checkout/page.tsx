'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CreditCard, Smartphone, Banknote, ShieldCheck, 
  Wallet, QrCode, Building2, CheckCircle2, ChevronRight, Clock, AlertCircle
} from 'lucide-react';

// Mock payment methods
const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'cash', name: 'Cash', icon: Banknote, description: 'Pay at counter' },
  { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'All major banks supported' },
  { id: 'wallet', name: 'Wallets', icon: Wallet, description: 'Amazon Pay, MobiKwik' },
];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  
  // 5 Minutes = 300 seconds
  const [timeLeft, setTimeLeft] = useState(300);
  
  // Read order amount from params, default to 0 if none
  const amountParam = searchParams.get('amount');
  const [orderTotal] = useState(amountParam ? parseFloat(amountParam) : 0);
  const [cashTendered, setCashTendered] = useState(Math.ceil(orderTotal).toString());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Timer Countdown Logic
  useEffect(() => {
    if (!mounted || showSuccess || isTimeout || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted, showSuccess, isTimeout, timeLeft]);

  const handleTimeout = () => {
    setIsTimeout(true);
    setTimeout(() => {
      router.replace('/app/pos?status=timeout');
    }, 3000);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment gateway processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Auto redirect to dedicated receipt page
      setTimeout(() => {
        router.replace('/app/receipt');
      }, 3000);
    }, 2000);
  };

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-none">Craftory Secure Checkout</h1>
                <p className="text-[11px] text-gray-500 mt-0.5">256-bit SSL Encrypted</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 hidden sm:flex">
            {/* Timer UI */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm border ${
              timeLeft < 60 ? 'bg-red-50 text-error border-red-200 animate-pulse' : 'bg-orange-50 text-orange-600 border-orange-200'
            }`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Transaction ID</p>
              <p className="text-sm font-mono font-medium text-gray-900">TXN-{Math.floor(Math.random() * 1000000)}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Payment Options */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Select Payment Method</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row h-full">
              {/* Sidebar Methods */}
              <div className="w-full sm:w-64 bg-white border-r border-gray-100 flex-shrink-0">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isActive = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors border-l-4 ${
                        isActive 
                          ? 'bg-primary/5 border-primary' 
                          : 'border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                      <div>
                        <p className={`text-sm font-semibold ${isActive ? 'text-primary dark:text-gray-900' : 'text-gray-700'}`}>
                          {method.name}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5 max-w-[140px] truncate">
                          {method.description}
                        </p>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-primary ml-auto" />}
                    </button>
                  );
                })}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6 sm:p-8 bg-white min-h-[360px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedMethod}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full flex flex-col"
                  >
                    {/* UPI Flow */}
                    {selectedMethod === 'upi' && (
                      <div className="flex-1 max-w-sm mx-auto w-full">
                        <h3 className="text-lg font-bold mb-6 text-center">Pay via UPI</h3>
                        <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center text-center mb-8">
                          <QrCode className="w-32 h-32 text-gray-900 mb-4" />
                          <p className="text-sm font-medium text-gray-900">Scan QR Code</p>
                          <p className="text-xs text-gray-500 mt-1">Open any UPI app to pay</p>
                        </div>
                        <div className="relative flex items-center py-4 mb-4">
                          <div className="flex-grow border-t border-gray-200"></div>
                          <span className="flex-shrink-0 mx-4 text-xs text-gray-400 uppercase font-bold tracking-wider">OR</span>
                          <div className="flex-grow border-t border-gray-200"></div>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-widest">Enter UPI ID</label>
                          <input 
                            type="text" 
                            placeholder="username@ybl"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* Card Flow */}
                    {selectedMethod === 'card' && (
                      <div className="flex-1 max-w-sm mx-auto w-full">
                         <h3 className="text-lg font-bold mb-6">Enter Card Details</h3>
                         <div className="space-y-5">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-widest">Card Number</label>
                              <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                  type="text" 
                                  placeholder="0000 0000 0000 0000"
                                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono transition-all"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-widest">Expiry</label>
                                <input 
                                  type="text" 
                                  placeholder="MM/YY"
                                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono transition-all"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-widest">CVV</label>
                                <input 
                                  type="password" 
                                  placeholder="•••"
                                  maxLength={3}
                                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono transition-all"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-widest">Name on Card</label>
                              <input 
                                type="text" 
                                placeholder="John Doe"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              />
                            </div>
                         </div>
                      </div>
                    )}

                    {/* Cash Flow */}
                    {selectedMethod === 'cash' && (
                      <div className="flex-1 max-w-sm mx-auto w-full">
                         <h3 className="text-lg font-bold mb-6 text-center">Cash Counter</h3>
                         <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 text-center mb-8">
                            <Banknote className="w-16 h-16 text-primary mx-auto mb-3" />
                            <p className="text-2xl font-black text-gray-900">₹{orderTotal.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">Amount Due</p>
                         </div>

                         <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-widest">Cash Tendered by Customer</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold text-lg">₹</span>
                              <input
                                type="number"
                                value={cashTendered}
                                onChange={e => setCashTendered(e.target.value)}
                                className="w-full pl-8 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                              />
                            </div>
                          </div>
                          
                          {Number(cashTendered) > 0 && (
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <span className="text-sm font-medium text-gray-600">Change to return:</span>
                              <span className={`font-bold text-xl ${Number(cashTendered) - orderTotal >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                ₹{Math.max(0, Number(cashTendered) - orderTotal).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Netbanking / Wallets (Placeholders) */}
                    {(selectedMethod === 'netbanking' || selectedMethod === 'wallet') && (
                      <div className="flex-1 max-w-sm mx-auto w-full text-center flex flex-col items-center justify-center">
                         <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            {selectedMethod === 'netbanking' ? <Building2 className="w-10 h-10 text-gray-400" /> : <Wallet className="w-10 h-10 text-gray-400" />}
                         </div>
                         <h3 className="text-lg font-bold mb-2">Redirecting to Partner</h3>
                         <p className="text-sm text-gray-500">You will be redirected securely to complete this payment.</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal (4 items)</span>
                <span className="font-medium">₹2,152.96</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">CGST (9%)</span>
                <span className="font-medium">₹193.77</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">SGST (9%)</span>
                <span className="font-medium">₹193.77</span>
              </div>
            </div>

            <div className="py-4 border-y border-dashed border-gray-200 mb-6 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total Due</span>
              <span className="text-2xl font-black text-gray-900">₹{orderTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing || isTimeout || (selectedMethod === 'cash' && Number(cashTendered) < orderTotal)}
              className="w-full py-4 px-6 bg-primary text-white text-base font-bold rounded-xl hover:bg-primary-dark shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay ₹${orderTotal.toFixed(2)}`
              )}
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              100% Secure Payment
            </div>
          </div>
        </div>
      </main>

      {/* Fullscreen Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-500 font-medium mb-8">TXN-{Math.floor(Math.random() * 1000000)} • ₹{orderTotal.toFixed(2)}</p>
              
              <div className="w-8 h-8 mx-auto border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-gray-400 mt-4">Redirecting to Receipt...</p>
            </motion.div>
          </motion.div>
        )}
        
        {/* Fullscreen Timeout Overlay */}
        {isTimeout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-error" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Session Expired</h2>
              <p className="text-gray-500 font-medium mb-8">You exceeded the 5:00 minute time limit.</p>
              
              <div className="w-8 h-8 mx-auto border-4 border-gray-100 border-t-error rounded-full animate-spin" />
              <p className="text-sm text-gray-400 mt-4">Redirecting back to cart...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
