'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, ShoppingCart, Package, Users, IndianRupee,
  BarChart3, ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<any>([]);
  const [bestSellers, setBestSellers] = useState<any>([]);
  const [categoryData, setCategoryData] = useState<any>([]);
  const [lowStock, setLowStock] = useState<any>([]);
  const [recentOrders, setRecentOrders] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, chartRes, salesRes, bestRes, catRes, lowRes] = await Promise.all([
          fetch('/api/reports/analytics?type=summary').then(r => r.json()),
          fetch('/api/reports/analytics?type=sales_chart').then(r => r.json()),
          fetch('/api/sales?limit=5').then(r => r.json()),
          fetch('/api/reports/analytics?type=best_sellers').then(r => r.json()),
          fetch('/api/reports/analytics?type=categories').then(r => r.json()),
          fetch('/api/reports/analytics?type=low_stock').then(r => r.json())
        ]);

        setSummary(sumRes);
        setChartData(chartRes);
        setRecentOrders(salesRes.sales || []);
        setBestSellers(bestRes);
        setCategoryData(catRes);
        setLowStock(lowRes);
      } catch (error) {
        console.error('Dashboard Load Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      label: "Today's Revenue",
      value: `₹${summary?.todayRevenue?.toLocaleString() || '0'}`,
      change: '+100%',
      up: true,
      icon: IndianRupee,
      color: 'bg-primary/10 text-primary'
    },
    {
      label: 'Monthly Revenue',
      value: `₹${summary?.monthRevenue?.toLocaleString() || '0'}`,
      change: 'Monthly Sale',
      up: true,
      icon: TrendingUp,
      color: 'bg-secondary-green/10 text-secondary-green'
    },
    {
      label: 'Monthly Purchases',
      value: `₹${summary?.monthPurchases?.toLocaleString() || '0'}`,
      change: 'Expenses',
      up: false,
      icon: Package,
      color: 'bg-analytics-purple/10 text-analytics-purple'
    },
    {
      label: 'Active Customers',
      value: summary?.activeCustomers?.toString() || '0',
      change: 'Total',
      up: true,
      icon: Users,
      color: 'bg-accent-amber/10 text-accent-amber'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">Welcome back! Here&apos;s your business overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl p-5 border border-border/50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-muted font-medium">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-text-primary mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.up ? 'text-secondary-green' : 'text-error'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl p-5 border border-border/50"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Revenue Overview</h3>
              <p className="text-xs text-text-muted">Last 7 days performance</p>
            </div>
            <div className="px-3 py-1 bg-primary/5 rounded-lg text-[10px] font-bold text-primary uppercase">Sales Value</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A6BDB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1A6BDB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1A6BDB" strokeWidth={3} fill="url(#revGrad)" dot={{ r: 4, fill: '#1A6BDB', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.3 }}
           className="bg-white rounded-xl p-5 border border-border/50"
        >
          <h3 className="text-sm font-bold text-text-primary mb-1">Sales by Category</h3>
          <p className="text-xs text-text-muted mb-6">Revenue share by type</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={['#1A6BDB', '#10B981', '#F59E0B', '#6366F1', '#EC4899'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.slice(0, 3).map((cat: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: ['#1A6BDB', '#10B981', '#F59E0B'][i] }} />
                  <span className="text-xs text-text-muted font-medium">{cat.name}</span>
                </div>
                <span className="text-xs font-bold text-text-primary">₹{cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-5 border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-primary">Recent Orders</h3>
            <button className="text-xs text-primary font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-text-muted uppercase tracking-wider border-b border-border/50">
                  <th className="pb-3 font-bold">Invoice</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Method</th>
                  <th className="pb-3 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {recentOrders.map((order: any, i: number) => (
                  <tr key={i} className="text-xs">
                    <td className="py-3.5 font-bold text-text-primary uppercase">{order.invoiceNumber}</td>
                    <td className="py-3.5 text-text-muted">{order.customer?.name || 'Walk-in'}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-page-bg text-[10px] font-bold text-text-secondary uppercase">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-black text-text-primary">₹{order.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Inventory Health */}
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.45 }}
           className="bg-white rounded-xl p-5 border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-bold text-text-primary">Inventory Health</h3>
             <span className="px-2 py-0.5 bg-error/10 text-error rounded text-[10px] font-bold uppercase">Critical</span>
          </div>
          <p className="text-xs text-text-muted mb-4 italic">The following items are running low and need restocking.</p>
          <div className="space-y-3">
            {lowStock.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-page-bg/50 rounded-lg border border-border/30">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-text-muted" />
                  <span className="text-xs font-bold text-text-primary">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-text-muted">Stock:</span>
                  <span className={`text-xs font-black ${item.stockQuantity <= 5 ? 'text-error' : 'text-accent-amber'}`}>
                    {item.stockQuantity}
                  </span>
                </div>
              </div>
            ))}
            {lowStock.length === 0 && (
              <div className="py-10 text-center text-xs text-text-muted font-medium">All items are well stocked! ✅</div>
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-5 border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-bold text-text-primary">Top Selling Products</h3>
             <BarChart3 className="w-4 h-4 text-text-muted" />
          </div>
          <div className="space-y-4">
            {bestSellers.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/10">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">{item.name}</p>
                    <p className="text-[10px] text-text-muted font-medium">{item.sold} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-text-primary">₹{item.revenue.toLocaleString()}</p>
                  <p className="text-[10px] text-secondary-green font-bold">Trending</p>
                </div>
              </div>
            ))}
            {bestSellers.length === 0 && (
               <div className="py-10 text-center text-xs text-text-muted font-medium">No sales data available yet.</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

