'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, TrendingUp, IndianRupee, ShoppingCart, Package, Loader2 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const gstData = [
  { id: 'GST-Mar-01', period: 'Mar 1-7, 2026', totalTaxable: 145000, cgst: 6525, sgst: 6525, totalGst: 13050, status: 'Filed' },
  { id: 'GST-Mar-02', period: 'Mar 8-14, 2026', totalTaxable: 162000, cgst: 7290, sgst: 7290, totalGst: 14580, status: 'Draft' },
  { id: 'GST-Feb-04', period: 'Feb 21-28, 2026', totalTaxable: 138000, cgst: 6210, sgst: 6210, totalGst: 12420, status: 'Filed' },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'sales' | 'gst'>('sales');
  const [period, setPeriod] = useState('weekly');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ todayRevenue: 0, monthRevenue: 0, totalSales: 0, lowStock: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [categorySales, setCategorySales] = useState<any[]>([]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      // Fetch analytics summary & chart data
      const [analyticsRes, salesRes] = await Promise.all([
        fetch('/api/reports/analytics').then(r => r.json()),
        fetch('/api/sales?limit=100').then(r => r.json())
      ]);

      // Set summary stats
      setStats({
        todayRevenue: analyticsRes.todayRevenue || 0,
        monthRevenue: analyticsRes.monthRevenue || 0,
        totalSales: analyticsRes.totalSales || 0,
        lowStock: analyticsRes.lowStockCount || 0
      });

      // Set chart data from analytics
      setChartData(analyticsRes.chartData || []);

      // Build category sales from actual sales data
      const catMap: { [key: string]: number } = {};
      const sales = salesRes.sales || [];
      for (const sale of sales) {
        for (const item of (sale.items || [])) {
          const catName = item.product?.category?.name || 'General';
          catMap[catName] = (catMap[catName] || 0) + item.total;
        }
      }
      const catData = Object.entries(catMap)
        .map(([category, sales]) => ({ category, sales: Math.round(sales) }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 8);
      setCategorySales(catData);

    } catch (e) {
      console.error('Report fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [period]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
          <p className="text-sm text-text-muted font-bold">Generating reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Business Reports</h1>
          <p className="text-sm text-text-muted mt-0.5">Track your business performance and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white border border-border rounded-xl p-1 shadow-sm">
            {['daily', 'weekly', 'monthly'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize ${period === p ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-page-bg'
                  }`}>{p}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-xs font-bold text-text-muted hover:border-primary transition-all shadow-sm">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: `₹${stats.todayRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'bg-primary/10 text-primary' },
          { label: 'Monthly Revenue', value: `₹${stats.monthRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'bg-secondary-green/10 text-secondary-green' },
          { label: 'Total Sales', value: stats.totalSales.toString(), icon: ShoppingCart, color: 'bg-analytics-purple/10 text-analytics-purple' },
          { label: 'Low Stock Items', value: stats.lowStock.toString(), icon: Package, color: 'bg-accent-amber/10 text-accent-amber' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] uppercase tracking-wider font-black text-text-muted">{stat.label}</p>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-black text-text-primary tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 border border-border shadow-sm">
        <h3 className="text-sm font-black text-text-primary uppercase tracking-wider mb-5">Revenue Trend</h3>
        <div className="h-72">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A6BDB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1A6BDB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: '600' }} />
                <Area type="monotone" dataKey="revenue" stroke="#1A6BDB" strokeWidth={2.5} fill="url(#revGrad2)" name="Revenue (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted text-sm font-medium">
              No chart data available yet. Complete some sales first!
            </div>
          )}
        </div>
      </motion.div>

      {/* Category Sales */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 border border-border shadow-sm">
        <h3 className="text-sm font-black text-text-primary uppercase tracking-wider mb-5">Sales by Category</h3>
        <div className="h-64">
          {categorySales.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySales} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} width={100} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: '600' }} />
                <Bar dataKey="sales" fill="#1A6BDB" radius={[0, 6, 6, 0]} barSize={24} name="Sales (₹)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted text-sm font-medium">
              No category sales data available yet.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
