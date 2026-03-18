'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Download, TrendingUp, IndianRupee, ShoppingCart, 
  Package, Loader2, BarChart3, FileText 
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'gst', label: 'GST Report', icon: FileText },
  { id: 'pl', label: 'Profit & Loss', icon: TrendingUp },
  { id: 'category', label: 'Category Performance', icon: Package },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  const [overviewData, setOverviewData] = useState<any>(null);
  const [gstData, setGstData] = useState<any[]>([]);
  const [plData, setPlData] = useState<any>(null);
  const [catPerformance, setCatPerformance] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    const queryParams = `?startDate=${startDate}&endDate=${endDate}`;
    try {
      if (activeTab === 'overview') {
        const [sum, chart] = await Promise.all([
          fetch('/api/reports/analytics?type=summary' + queryParams).then(r => r.json()),
          fetch('/api/reports/analytics?type=sales_chart' + queryParams).then(r => r.json())
        ]);
        setOverviewData({ summary: sum, chart });
      } else if (activeTab === 'gst') {
        const res = await fetch('/api/reports/gst' + queryParams).then(r => r.json());
        setGstData(res);
      } else if (activeTab === 'pl') {
        const res = await fetch('/api/reports/profit-loss' + queryParams).then(r => r.json());
        setPlData(res);
      } else if (activeTab === 'category') {
        const res = await fetch('/api/reports/category-wise' + queryParams).then(r => r.json());
        setCatPerformance(res);
      }
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, startDate, endDate]);

  const downloadCSV = (data: any[], fileName: string) => {
    if (!data || data.length === 0) {
      alert('No data available to export');
      return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        let val = row[h];
        if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
        return val;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = (type: string) => {
    let dataToExport: any[] = [];
    let fileName = 'report';

    if (type === 'overview') {
      dataToExport = overviewData?.chart || [];
      fileName = 'overview_report';
    } else if (type === 'gst') {
      dataToExport = gstData;
      fileName = 'gst_report';
    } else if (type === 'pl') {
      dataToExport = [
        { Metric: 'Total Revenue', Value: plData?.revenue },
        { Metric: 'Total Expenses', Value: plData?.expenses },
        { Metric: 'Net Profit', Value: plData?.netProfit },
        { Metric: 'Profit Margin (%)', Value: plData?.margin?.toFixed(2) }
      ];
      fileName = 'profit_loss_report';
    } else if (type === 'category') {
      dataToExport = catPerformance;
      fileName = 'category_performance';
    }

    downloadCSV(dataToExport, fileName);
  };

  return (
    <div className="space-y-6 font-[PlusJakartaSans]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Business Reports</h1>
          <p className="text-sm text-text-muted mt-0.5">Comprehensive analytics and financial reporting.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-border rounded-xl px-3 py-1.5 shadow-sm gap-2">
            <Calendar className="w-4 h-4 text-text-muted" />
            <input type="date" className="text-xs font-bold bg-transparent outline-none" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span className="text-text-muted">-</span>
            <input type="date" className="text-xs font-bold bg-transparent outline-none" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <button onClick={() => handleExport(activeTab)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-border p-1 rounded-2xl shadow-sm ">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-page-bg'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-text-muted font-bold">Fetching latest data...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Revenue", value: `₹${overviewData?.summary?.monthRevenue?.toLocaleString() || 0}`, icon: IndianRupee, color: 'bg-primary/10 text-primary' },
                    { label: 'Purchases', value: `₹${overviewData?.summary?.monthPurchases?.toLocaleString() || 0}`, icon: Package, color: 'bg-orange-50 text-orange-600' },
                    { label: 'Low Stock', value: overviewData?.summary?.lowStockItems || 0, icon: Package, color: 'bg-red-50 text-red-600' },
                    { label: 'Total SKUs', value: overviewData?.summary?.totalSkus || 0, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-border shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] uppercase tracking-wider font-black text-text-muted">{stat.label}</p>
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                      </div>
                      <p className="text-2xl font-black text-text-primary tracking-tight">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-wider mb-5">Sales Performance</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={Array.isArray(overviewData?.chart) ? overviewData.chart : []}>
                        <defs>
                          <linearGradient id="repoGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1A6BDB" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#1A6BDB" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#1A6BDB" strokeWidth={3} fill="url(#repoGrad)" dot={{ r: 4, fill: '#1A6BDB', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: GST Report */}
            {activeTab === 'gst' && (
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">GST Sales Report</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-page-bg">
                      <tr className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
                        <th className="px-6 py-4">Invoice</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Taxable Amt</th>
                        <th className="px-6 py-4">CGST</th>
                        <th className="px-6 py-4">SGST</th>
                        <th className="px-6 py-4">Total GST</th>
                        <th className="px-6 py-4 text-right">Total Amt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {Array.isArray(gstData) && gstData.map((row, i) => (
                        <tr key={i} className="text-xs hover:bg-page-bg/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-text-primary uppercase">{row.invoiceNumber}</td>
                          <td className="px-6 py-4 text-text-muted">{row.customerName}</td>
                          <td className="px-6 py-4 font-medium">₹{row.taxableAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-text-muted">₹{row.cgst.toLocaleString()}</td>
                          <td className="px-6 py-4 text-text-muted">₹{row.sgst.toLocaleString()}</td>
                          <td className="px-6 py-4 font-bold text-primary">₹{row.totalGst.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right font-black text-text-primary">₹{row.totalAmount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!Array.isArray(gstData) || gstData.length === 0) && (
                    <div className="py-20 text-center text-sm text-text-muted font-bold">No data found for selected dates.</div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Profit & Loss */}
            {activeTab === 'pl' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                    <p className="text-[10px] uppercase font-black text-text-muted mb-1">Total Revenue</p>
                    <p className="text-2xl font-black text-text-primary">₹{plData?.revenue?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                    <p className="text-[10px] uppercase font-black text-text-muted mb-1">Total Expenses</p>
                    <p className="text-2xl font-black text-red-600">₹{plData?.expenses?.toLocaleString() || 0}</p>
                  </div>
                  <div className={`bg-white rounded-2xl p-6 border-2 shadow-sm ${plData?.netProfit >= 0 ? 'border-green-100' : 'border-red-100'}`}>
                    <p className="text-[10px] uppercase font-black text-text-muted mb-1">Net Profit</p>
                    <p className={`text-2xl font-black ${plData?.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{plData?.netProfit?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-8 border border-border shadow-sm text-center">
                  <div className="max-w-xs mx-auto space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-primary/10">
                      <p className="text-xl font-black text-primary">{plData?.margin?.toFixed(1) || 0}%</p>
                    </div>
                    <h3 className="font-bold text-text-primary">Profit Margin</h3>
                    <p className="text-xs text-text-muted">Your net profit margin for the selected period.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Category Performance */}
            {activeTab === 'category' && (
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="text-sm font-black text-text-primary uppercase tracking-wider mb-6">Top Categories by Sales</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Array.isArray(catPerformance) ? catPerformance : []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 'bold' }} width={120} />
                      <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="sales" fill="#1A6BDB" radius={[0, 8, 8, 0]} barSize={32} name="Total Sales (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border">
                  {Array.isArray(catPerformance) && catPerformance.slice(0, 4).map((cat, i) => (
                    <div key={i} className="text-center">
                      <p className="text-[10px] uppercase font-bold text-text-muted mb-1">{cat.name}</p>
                      <p className="text-sm font-black text-text-primary">₹{cat.sales.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
