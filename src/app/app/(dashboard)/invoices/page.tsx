'use client';

import { useState } from 'react';
import { Search, Download, Eye, Printer, FileText, Filter } from 'lucide-react';

const invoices = [
  { id: 'INV-20260314-001', customer: 'Rahul Sharma', date: 'Mar 14, 2026', amount: 2450, gst: 441, total: 2891, status: 'Paid', paymentMethod: 'UPI' },
  { id: 'INV-20260314-002', customer: 'Priya Mehta', date: 'Mar 14, 2026', amount: 890, gst: 160.2, total: 1050.2, status: 'Paid', paymentMethod: 'Cash' },
  { id: 'INV-20260314-003', customer: 'Amit Kumar', date: 'Mar 14, 2026', amount: 5200, gst: 936, total: 6136, status: 'Pending', paymentMethod: 'Credit' },
  { id: 'INV-20260313-001', customer: 'Neha Reddy', date: 'Mar 13, 2026', amount: 1340, gst: 241.2, total: 1581.2, status: 'Paid', paymentMethod: 'Card' },
  { id: 'INV-20260313-002', customer: 'Vikash Patel', date: 'Mar 13, 2026', amount: 3760, gst: 676.8, total: 4436.8, status: 'Paid', paymentMethod: 'UPI' },
  { id: 'INV-20260312-001', customer: 'Sunita Devi', date: 'Mar 12, 2026', amount: 670, gst: 120.6, total: 790.6, status: 'Paid', paymentMethod: 'Cash' },
  { id: 'INV-20260312-002', customer: 'Mohammed Ali', date: 'Mar 12, 2026', amount: 4100, gst: 738, total: 4838, status: 'Overdue', paymentMethod: 'Credit' },
  { id: 'INV-20260311-001', customer: 'Lakshmi Iyer', date: 'Mar 11, 2026', amount: 1890, gst: 340.2, total: 2230.2, status: 'Paid', paymentMethod: 'Cash' },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.id.toLowerCase().includes(search.toLowerCase()) || inv.customer.toLowerCase().includes(search.toLowerCase());
    if (statusFilter === 'all') return matchSearch;
    return matchSearch && inv.status.toLowerCase() === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Invoices</h1>
          <p className="text-sm text-text-muted mt-0.5">{invoices.length} invoices</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-xs font-medium text-text-muted hover:border-primary/30">
          <Download className="w-3.5 h-3.5" /> Export All
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Search by invoice ID or customer..." />
        </div>
        <div className="flex gap-1.5">
          {['all', 'paid', 'pending', 'overdue'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === s ? 'bg-primary text-white' : 'bg-white border border-border text-text-muted hover:border-primary/30'
              }`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-page-bg border-b border-border/50">
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Invoice ID</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Customer</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">GST</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Total</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Payment</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id} className="border-b border-border/30 hover:bg-page-bg/50 transition-colors">
                <td className="py-3 px-4 font-medium font-mono text-xs">{inv.id}</td>
                <td className="py-3 px-4">{inv.customer}</td>
                <td className="py-3 px-4 text-text-muted">{inv.date}</td>
                <td className="py-3 px-4">₹{inv.amount.toLocaleString()}</td>
                <td className="py-3 px-4 text-text-muted">₹{inv.gst.toFixed(2)}</td>
                <td className="py-3 px-4 font-semibold">₹{inv.total.toFixed(2)}</td>
                <td className="py-3 px-4 text-text-muted">{inv.paymentMethod}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    inv.status === 'Paid' ? 'bg-green-50 text-secondary-green' :
                    inv.status === 'Pending' ? 'bg-amber-50 text-accent-amber' :
                    'bg-red-50 text-error'
                  }`}>{inv.status}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-primary-light text-text-muted hover:text-primary"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-primary-light text-text-muted hover:text-primary"><Printer className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
