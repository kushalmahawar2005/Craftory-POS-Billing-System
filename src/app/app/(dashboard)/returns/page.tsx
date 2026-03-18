'use client';

import { useState, useEffect } from 'react';
import { Search, RotateCcw, Eye, FileText, Loader2, IndianRupee, Calendar, Filter, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [stats, setStats] = useState({
    monthlyCount: 0,
    monthlyAmount: 0,
    totalCount: 0
  });

  const fetchReturns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/sales/returns?limit=50&q=${search}`);
      const data = await res.json();
      setReturns(data.returns || []);
      
      // Calculate simple stats from the fetched list for now
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      
      const monthlyReturns = (data.returns || []).filter((r: any) => {
        const d = new Date(r.createdAt);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      });

      setStats({
        monthlyCount: monthlyReturns.length,
        monthlyAmount: monthlyReturns.reduce((acc: number, cur: any) => acc + cur.refundAmount, 0),
        totalCount: data.total || 0
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchReturns, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Sales Returns</h1>
          <p className="text-sm text-text-muted mt-0.5">Manage product returns and customer refunds</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Returns This Month', value: stats.monthlyCount, icon: RotateCcw, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Refunded This Month', value: `₹${stats.monthlyAmount.toLocaleString()}`, icon: IndianRupee, color: 'text-error', bg: 'bg-red-50' },
          { label: 'Total Returns', value: stats.totalCount, icon: FileText, color: 'text-primary', bg: 'bg-primary/5' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-border flex items-center gap-4 shadow-sm">
            <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-text-primary mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none shadow-sm"
            placeholder="Search return # or invoice #..." />
        </div>
        <button className="p-3 bg-white border border-border rounded-xl text-text-muted hover:text-primary transition-all shadow-sm">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-page-bg/50 border-b border-border/50">
                <th className="py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Return Info</th>
                <th className="py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Original Sale</th>
                <th className="py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Refund Amt</th>
                <th className="py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider text-center">Reason</th>
                <th className="py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                <tr><td colSpan={6} className="py-20 text-center"><Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" /></td></tr>
              ) : returns.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center text-text-muted font-medium">No return records found.</td></tr>
              ) : returns.map((rtn) => (
                <tr key={rtn.id} className="hover:bg-page-bg/20 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-black text-text-primary text-xs uppercase tracking-tighter">{rtn.returnNumber}</p>
                    <p className="text-[10px] text-text-muted font-bold flex items-center gap-1 mt-0.5">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(rtn.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-xs font-bold text-primary uppercase">{rtn.sale?.invoiceNumber}</td>
                  <td className="py-4 px-6 font-bold text-text-primary">{rtn.sale?.customer?.name || 'Walk-in'}</td>
                  <td className="py-4 px-6 font-black text-error">₹{rtn.refundAmount.toFixed(2)}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-md text-[9px] font-black uppercase">
                      {rtn.reason.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => setSelectedReturn(rtn)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Details Modal */}
      <AnimatePresence>
        {selectedReturn && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedReturn(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-black text-text-primary uppercase tracking-tight">Return Details: {selectedReturn.returnNumber}</h2>
                  <p className="text-xs font-bold text-text-muted">Processed on {new Date(selectedReturn.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedReturn(null)} className="p-2 hover:bg-page-bg rounded-lg"><RotateCcw className="w-5 h-5 text-text-muted" /></button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-page-bg/50 rounded-2xl border border-border/50">
                  <p className="text-[10px] font-black text-text-muted uppercase mb-2">Items Returned</p>
                  <div className="space-y-2">
                    {selectedReturn.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs font-bold text-text-primary">
                        <span>{item.product?.name} x{item.quantity}</span>
                        <span>₹{item.totalAmount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-page-bg/50 rounded-2xl border border-border/50">
                    <p className="text-[10px] font-black text-text-muted uppercase mb-1">Reason</p>
                    <p className="text-xs font-bold text-text-primary">{selectedReturn.reason.replace('_', ' ')}</p>
                  </div>
                  <div className="p-4 bg-page-bg/50 rounded-2xl border border-border/50">
                    <p className="text-[10px] font-black text-text-muted uppercase mb-1">Refund Method</p>
                    <p className="text-xs font-bold text-text-primary">{selectedReturn.refundMethod}</p>
                  </div>
                </div>

                {selectedReturn.notes && (
                  <div className="p-4 bg-page-bg/50 rounded-2xl border border-border/50">
                    <p className="text-[10px] font-black text-text-muted uppercase mb-1">Notes</p>
                    <p className="text-xs font-medium text-text-primary italic">"{selectedReturn.notes}"</p>
                  </div>
                )}

                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex justify-between items-center">
                  <span className="text-sm font-black text-primary uppercase">Total Refunded</span>
                  <span className="text-2xl font-black text-primary">₹{selectedReturn.refundAmount.toFixed(2)}</span>
                </div>
              </div>

              <button onClick={() => setSelectedReturn(null)} className="w-full mt-6 py-3.5 bg-text-primary text-white font-black rounded-xl hover:bg-black transition-all">
                Close Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
