'use client';

import { useState, useEffect } from 'react';
import { Search, User, IndianRupee, History, HandCoins, ArrowDownToLine, Loader2, ArrowUpRight, TrendingUp, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreditBookPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      // Fetch customers with potential balances
      const res = await fetch(`/api/customers?q=${search}`);
      const data = await res.json();
      // Filter the ones with actual balance or limit for the "book"
      setCustomers(data.filter((c: any) => c.currentBalance > 0 || c.creditLimit > 0));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCollectPayment = async () => {
    if (!paymentAmount || isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/customers/${showPaymentModal.id}/credit/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          notes: paymentNotes,
          paymentMethod: 'CASH'
        })
      });
      if (res.ok) {
        alert('Payment collected successfully');
        setShowPaymentModal(null);
        setPaymentAmount('');
        setPaymentNotes('');
        fetchCustomers();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to collect payment');
      }
    } catch (e) {
      alert('Error connecting to server');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalOutstanding = customers.reduce((acc, cur) => acc + cur.currentBalance, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight italic">Credit Book (Udhar Khata)</h1>
          <p className="text-sm text-text-muted mt-0.5">Track customer debts and collect payments</p>
        </div>
      </div>

      {/* Credit Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm bg-gradient-to-br from-white to-red-50/30">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-red-100 text-error rounded-2xl"><TrendingUp className="w-5 h-5" /></div>
            <span className="text-[10px] font-black text-error bg-red-100 px-2 py-1 rounded-full uppercase tracking-widest">To Collect</span>
          </div>
          <p className="text-[11px] font-black text-text-muted uppercase mt-4 tracking-wider">Total Outstanding</p>
          <p className="text-3xl font-black text-text-primary mt-1">₹{totalOutstanding.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl"><User className="w-5 h-5" /></div>
          </div>
          <p className="text-[11px] font-black text-text-muted uppercase mt-4 tracking-wider">Active Debtors</p>
          <p className="text-3xl font-black text-text-primary mt-1">{customers.filter(c => c.currentBalance > 0).length}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm bg-gradient-to-br from-white to-green-50/30">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-secondary-green/10 text-secondary-green rounded-2xl"><HandCoins className="w-5 h-5" /></div>
          </div>
          <p className="text-[11px] font-black text-text-muted uppercase mt-4 tracking-wider">Potential Credit</p>
          <p className="text-3xl font-black text-text-primary mt-1">₹{customers.reduce((acc, cur) => acc + (cur.creditLimit || 0), 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-border rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm font-medium"
            placeholder="Search customer by name or phone..." />
        </div>
        <button className="p-3.5 bg-white border border-border rounded-2xl text-text-muted hover:text-primary transition-all shadow-sm"><Filter className="w-5 h-5" /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-20 text-center"><Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" /></div>
        ) : customers.length === 0 ? (
          <div className="col-span-full py-20 text-center text-text-muted font-bold bg-white rounded-3xl border border-dashed border-border italic">No customers found with outstanding credit.</div>
        ) : customers.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-3xl border border-border shadow-sm group hover:border-primary/30 transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-page-bg rounded-2xl flex items-center justify-center font-black text-text-muted uppercase">{c.name[0]}</div>
                  <div>
                    <h3 className="text-sm font-black text-text-primary">{c.name}</h3>
                    <p className="text-[10px] font-bold text-text-muted">{c.phone}</p>
                  </div>
                </div>
                {c.currentBalance > 0 && <span className="text-[9px] font-black text-error bg-red-50 border border-red-100 px-2.5 py-1 rounded-full uppercase italic animate-pulse">Pending</span>}
              </div>

              <div className="mt-6 flex gap-3">
                <div className="flex-1 p-3 bg-page-bg rounded-2xl border border-border/50">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Balance</p>
                  <p className={`text-lg font-black mt-0.5 ${c.currentBalance > 0 ? 'text-error' : 'text-text-primary'}`}>₹{c.currentBalance.toLocaleString()}</p>
                </div>
                <div className="flex-1 p-3 bg-page-bg rounded-2xl border border-border/50">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Limit</p>
                  <p className="text-lg font-black text-text-primary mt-0.5">₹{c.creditLimit?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setShowPaymentModal(c)}
                className="flex-1 py-3 bg-primary text-white text-[11px] font-black rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <HandCoins className="w-3.5 h-3.5" /> Collect Payment
              </button>
              <button 
                className="p-3 bg-page-bg border border-border rounded-xl text-text-muted hover:text-text-primary transition-all"
                title="Transaction History"
              >
                <History className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Collect Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <ArrowDownToLine className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">Collect Payment</h2>
                <p className="text-sm font-bold text-text-muted mt-1">{showPaymentModal.name} owes ₹{showPaymentModal.currentBalance}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase mb-1.5 tracking-widest">Payment Amount (₹)</label>
                  <input
                    type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)}
                    className="w-full px-4 py-4 bg-page-bg border border-border rounded-2xl text-lg font-black text-primary focus:outline-none focus:border-primary shadow-sm"
                    placeholder="0.00" autoFocus />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase mb-1.5 tracking-widest">Notes / Receipt Ref</label>
                  <textarea
                    value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)}
                    className="w-full px-4 py-4 bg-page-bg border border-border rounded-2xl text-xs font-bold h-24 outline-none focus:border-primary resize-none"
                    placeholder="Reference, notes or cash denominations..." />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleCollectPayment}
                  disabled={!paymentAmount || isProcessing}
                  className="flex-1 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
                  Confirm Payment
                </button>
                <button onClick={() => setShowPaymentModal(null)} className="px-6 py-4 bg-page-bg text-text-muted font-bold rounded-2xl hover:bg-border/50 transition-all">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
