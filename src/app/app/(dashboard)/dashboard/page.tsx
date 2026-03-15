'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, ShoppingCart, Package, Users, IndianRupee,
  BarChart3, ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const stats = [
  { label: "Today's Revenue", value: '₹24,580', change: '+12.5%', up: true, icon: IndianRupee, color: 'bg-primary/10 text-primary' },
  { label: 'Total Orders', value: '47', change: '+8.2%', up: true, icon: ShoppingCart, color: 'bg-secondary-green/10 text-secondary-green' },
  { label: 'Products Sold', value: '156', change: '+15.3%', up: true, icon: Package, color: 'bg-analytics-purple/10 text-analytics-purple' },
  { label: 'New Customers', value: '8', change: '-2.1%', up: false, icon: Users, color: 'bg-accent-amber/10 text-accent-amber' },
];

const revenueData = [
  { day: 'Mon', revenue: 4200, orders: 32 },
  { day: 'Tue', revenue: 5800, orders: 41 },
  { day: 'Wed', revenue: 4900, orders: 28 },
  { day: 'Thu', revenue: 7200, orders: 52 },
  { day: 'Fri', revenue: 6100, orders: 45 },
  { day: 'Sat', revenue: 8400, orders: 63 },
  { day: 'Sun', revenue: 5600, orders: 38 },
];

const topProducts = [
  { name: 'Basmati Rice 5kg', sold: 45, revenue: '₹11,250' },
  { name: 'Sunflower Oil 1L', sold: 38, revenue: '₹5,700' },
  { name: 'Tata Salt 1kg', sold: 32, revenue: '₹640' },
  { name: 'Red Label Tea 250g', sold: 28, revenue: '₹5,600' },
  { name: 'Surf Excel 1kg', sold: 25, revenue: '₹5,500' },
];

const paymentData = [
  { name: 'Cash', value: 45, color: '#059669' },
  { name: 'UPI', value: 35, color: '#1A6BDB' },
  { name: 'Card', value: 15, color: '#7C3AED' },
  { name: 'Credit', value: 5, color: '#F59E0B' },
];

const recentOrders = [
  { id: 'INV-001', customer: 'Rahul S.', amount: '₹2,450', status: 'Paid', time: '2 min ago' },
  { id: 'INV-002', customer: 'Priya M.', amount: '₹890', status: 'Paid', time: '15 min ago' },
  { id: 'INV-003', customer: 'Amit K.', amount: '₹5,200', status: 'Pending', time: '32 min ago' },
  { id: 'INV-004', customer: 'Neha R.', amount: '₹1,340', status: 'Paid', time: '1 hr ago' },
  { id: 'INV-005', customer: 'Vikash P.', amount: '₹760', status: 'Paid', time: '2 hr ago' },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted mt-0.5">Welcome back! Here&apos;s your business overview for today.</p>
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
                {stat.change} vs yesterday
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
          className="lg:col-span-2 bg-white rounded-xl p-5 border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Revenue Overview</h3>
              <p className="text-xs text-text-muted">Last 7 days</p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-gray-100"><MoreHorizontal className="w-4 h-4 text-text-muted" /></button>
          </div>
          <div className="h-64">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A6BDB" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1A6BDB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#1A6BDB" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-5 border border-border/50"
        >
          <h3 className="text-sm font-bold text-text-primary mb-4">Payment Methods</h3>
          <div className="h-48 flex items-center justify-center">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentData} innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                    {paymentData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="space-y-2 mt-2">
            {paymentData.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-text-muted">{p.name}</span>
                </div>
                <span className="font-medium text-text-primary">{p.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-5 border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-primary">Recent Orders</h3>
            <button className="text-xs text-primary font-medium hover:text-primary-dark">View all</button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">{order.customer[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{order.customer}</p>
                    <p className="text-[11px] text-text-muted">{order.id} · {order.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-primary">{order.amount}</p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    order.status === 'Paid' ? 'bg-green-50 text-secondary-green' : 'bg-amber-50 text-accent-amber'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-5 border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-primary">Top Selling Products</h3>
            <button className="text-xs text-primary font-medium hover:text-primary-dark">View all</button>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-xs text-text-muted font-medium">#{i+1}</span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{product.name}</p>
                    <p className="text-[11px] text-text-muted">{product.sold} units sold</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-text-primary">{product.revenue}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
