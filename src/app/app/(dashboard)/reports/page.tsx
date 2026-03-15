'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Download, TrendingUp, IndianRupee, ShoppingCart, Package, FileText, FileSpreadsheet } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const dailyData = [
  { date: 'Mar 1', revenue: 18200, orders: 35, profit: 4550 },
  { date: 'Mar 2', revenue: 22100, orders: 42, profit: 5525 },
  { date: 'Mar 3', revenue: 19800, orders: 38, profit: 4950 },
  { date: 'Mar 4', revenue: 25600, orders: 48, profit: 6400 },
  { date: 'Mar 5', revenue: 21300, orders: 41, profit: 5325 },
  { date: 'Mar 6', revenue: 28900, orders: 55, profit: 7225 },
  { date: 'Mar 7', revenue: 24580, orders: 47, profit: 6145 },
  { date: 'Mar 8', revenue: 26700, orders: 51, profit: 6675 },
  { date: 'Mar 9', revenue: 23400, orders: 44, profit: 5850 },
  { date: 'Mar 10', revenue: 29100, orders: 56, profit: 7275 },
  { date: 'Mar 11', revenue: 27300, orders: 52, profit: 6825 },
  { date: 'Mar 12', revenue: 31200, orders: 60, profit: 7800 },
  { date: 'Mar 13', revenue: 28600, orders: 54, profit: 7150 },
  { date: 'Mar 14', revenue: 32400, orders: 62, profit: 8100 },
];

const categoryData = [
  { category: 'Groceries', sales: 42000 },
  { category: 'Beverages', sales: 18500 },
  { category: 'Household', sales: 15200 },
  { category: 'Dairy', sales: 12800 },
  { category: 'Personal Care', sales: 9600 },
  { category: 'Snacks', sales: 7400 },
];

const gstData = [
  { id: 'GST-Mar-01', period: 'Mar 1-7, 2026', totalTaxable: 145000, cgst: 6525, sgst: 6525, totalGst: 13050, status: 'Filed' },
  { id: 'GST-Mar-02', period: 'Mar 8-14, 2026', totalTaxable: 162000, cgst: 7290, sgst: 7290, totalGst: 14580, status: 'Draft' },
  { id: 'GST-Feb-04', period: 'Feb 21-28, 2026', totalTaxable: 138000, cgst: 6210, sgst: 6210, totalGst: 12420, status: 'Filed' },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'sales' | 'gst'>('sales');
  const [period, setPeriod] = useState('weekly');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Reports & Analytics</h1>
          <p className="text-sm text-text-muted mt-0.5">Track your business performance and tax liabilities.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setReportType('sales')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${reportType === 'sales' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-primary'}`}
            >
              Sales Overview
            </button>
            <button
              onClick={() => setReportType('gst')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${reportType === 'gst' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-primary'}`}
            >
              GST Reports
            </button>
          </div>
          <div className="flex gap-0.5 bg-white border border-border rounded-lg p-0.5 ml-2">
            {['daily', 'weekly', 'monthly'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                  period === p ? 'bg-primary text-white' : 'text-text-muted hover:bg-gray-50'
                }`}>{p}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-xs font-medium text-text-muted hover:border-primary/30">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {reportType === 'sales' ? (
          <motion.div key="sales" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
            {/* Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: '₹3,89,200', change: '+14.2%', icon: IndianRupee, color: 'bg-primary/10 text-primary' },
                { label: 'Total Orders', value: '685', change: '+10.5%', icon: ShoppingCart, color: 'bg-secondary-green/10 text-secondary-green' },
                { label: 'Total Profit', value: '₹97,300', change: '+12.8%', icon: TrendingUp, color: 'bg-analytics-purple/10 text-analytics-purple' },
                { label: 'Products Sold', value: '2,140', change: '+9.3%', icon: Package, color: 'bg-accent-amber/10 text-accent-amber' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-text-muted font-medium">{stat.label}</p>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}><stat.icon className="w-4 h-4" /></div>
                  </div>
                  <p className="text-2xl font-extrabold text-text-primary">{stat.value}</p>
                  <p className="text-xs text-secondary-green font-medium mt-1">{stat.change} vs last period</p>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl p-5 border border-border/50">
              <h3 className="text-sm font-bold text-text-primary mb-4">Revenue & Profit Trend</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1A6BDB" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#1A6BDB" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#1A6BDB" strokeWidth={2} fill="url(#revGrad2)" name="Revenue" />
                    <Area type="monotone" dataKey="profit" stroke="#059669" strokeWidth={2} fill="url(#profGrad)" name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Sales */}
            <div className="bg-white rounded-xl p-5 border border-border/50">
              <h3 className="text-sm font-bold text-text-primary mb-4">Sales by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} width={90} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                    <Bar dataKey="sales" fill="#1A6BDB" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="gst" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 border border-border/50 shadow-sm border-l-4 border-l-primary">
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">Total Taxable Value</p>
                <div className=" flex items-end gap-3"><p className="text-3xl font-extrabold text-text-primary flex items-center gap-1"><IndianRupee className="w-6 h-6"/> 3,07,000</p></div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-border/50 shadow-sm border-l-4 border-l-secondary-green">
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">Total CGST Collected</p>
                <div className=" flex items-end gap-3"><p className="text-3xl font-extrabold text-text-primary flex items-center gap-1"><IndianRupee className="w-6 h-6"/> 13,815</p></div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-border/50 shadow-sm border-l-4 border-l-analytics-purple">
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">Total SGST Collected</p>
                <div className=" flex items-end gap-3"><p className="text-3xl font-extrabold text-text-primary flex items-center gap-1"><IndianRupee className="w-6 h-6"/> 13,815</p></div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border/50 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-border bg-page-bg/50 flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-text-primary flex items-center gap-2"><FileSpreadsheet className="w-5 h-5 text-primary"/> GSTR-3B Summary</h3>
                <button className="text-xs font-bold text-primary hover:underline">Download GSTR-1 Excel</button>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs text-text-muted uppercase tracking-wider border-b border-border/50">
                  <tr>
                    <th className="py-4 px-6 font-bold">Return Period</th>
                    <th className="py-4 px-6 font-bold text-right">Taxable Value (₹)</th>
                    <th className="py-4 px-6 font-bold text-right">CGST (₹)</th>
                    <th className="py-4 px-6 font-bold text-right">SGST (₹)</th>
                    <th className="py-4 px-6 font-bold text-right">Total Tax (₹)</th>
                    <th className="py-4 px-6 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {gstData.map((row) => (
                    <tr key={row.id} className="hover:bg-primary/5 transition-colors">
                      <td className="py-4 px-6 font-bold text-text-primary">{row.period}</td>
                      <td className="py-4 px-6 text-right font-mono">{row.totalTaxable.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right font-mono text-secondary-green">{row.cgst.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right font-mono text-analytics-purple">{row.sgst.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right font-bold text-text-primary">{(row.totalGst).toLocaleString()}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${row.status === 'Filed' ? 'bg-secondary-green/10 text-secondary-green' : 'bg-gray-100 text-gray-500'}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
