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
  const [recentOrders, setRecentOrders] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, chartRes, salesRes] = await Promise.all([
          fetch('/api/reports/analytics?type=summary').then(r => r.json()),
          fetch('/api/reports/analytics?type=sales_chart').then(r => r.json()),
          fetch('/api/sales?limit=5').then(r => r.json())
        ]);

        setSummary(sumRes);
        setChartData(chartRes);
        setRecentOrders(salesRes.sales || []);
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
      label: 'Today Orders',
      value: summary?.todayOrders?.toString() || '0',
      change: '+100%',
      up: true,
      icon: ShoppingCart,
      color: 'bg-secondary-green/10 text-secondary-green'
    },
    {
      label: 'Low Stock Products',
      value: summary?.lowStockItems?.toString() || '0',
      change: 'Alert',
      up: false,
      icon: Package,
      color: 'bg-error/10 text-error'
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-white rounded-xl p-5 border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Revenue Overview</h3>
              <p className="text-xs text-text-muted">Last 7 days performance</p>
            </div>
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
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1A6BDB" strokeWidth={3} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-1 gap-4">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-5 border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-primary">Recent Orders</h3>
            <button className="text-xs text-primary font-medium hover:underline">View All Sales</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-text-muted border-b border-border/50">
                  <th className="pb-3 font-medium">Invoice No</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Method</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-text-muted">No orders found yet. Start selling!</td>
                  </tr>
                ) : (
                  recentOrders.map((order: any, i: number) => (
                    <tr key={i} className="text-sm">
                      <td className="py-4 font-medium text-text-primary uppercase">{order.invoiceNumber}</td>
                      <td className="py-4 text-text-muted">{order.customer?.name || 'Walk-in'}</td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 rounded-full bg-page-bg text-[11px] font-medium text-text-secondary uppercase">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-4 text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 text-right font-bold text-text-primary">₹{order.total.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

