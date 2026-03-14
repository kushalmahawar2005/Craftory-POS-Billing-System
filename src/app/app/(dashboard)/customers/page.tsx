'use client';

import { useState } from 'react';
import { Search, Plus, Phone, Mail, IndianRupee, MoreHorizontal, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const customers = [
  { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul@email.com', totalOrders: 24, totalSpent: 18500, lastVisit: '2 hours ago', loyaltyPoints: 185 },
  { id: 2, name: 'Priya Mehta', phone: '+91 98765 43211', email: 'priya@email.com', totalOrders: 18, totalSpent: 12400, lastVisit: '1 day ago', loyaltyPoints: 124 },
  { id: 3, name: 'Amit Kumar', phone: '+91 98765 43212', email: 'amit@email.com', totalOrders: 32, totalSpent: 28900, lastVisit: '3 hours ago', loyaltyPoints: 289 },
  { id: 4, name: 'Neha Reddy', phone: '+91 98765 43213', email: 'neha@email.com', totalOrders: 15, totalSpent: 9200, lastVisit: '2 days ago', loyaltyPoints: 92 },
  { id: 5, name: 'Vikash Patel', phone: '+91 98765 43214', email: 'vikash@email.com', totalOrders: 41, totalSpent: 35600, lastVisit: '5 hours ago', loyaltyPoints: 356 },
  { id: 6, name: 'Sunita Devi', phone: '+91 98765 43215', email: 'sunita@email.com', totalOrders: 9, totalSpent: 5800, lastVisit: '5 days ago', loyaltyPoints: 58 },
  { id: 7, name: 'Mohammed Ali', phone: '+91 98765 43216', email: 'ali@email.com', totalOrders: 28, totalSpent: 22100, lastVisit: '1 day ago', loyaltyPoints: 221 },
  { id: 8, name: 'Lakshmi Iyer', phone: '+91 98765 43217', email: 'lakshmi@email.com', totalOrders: 12, totalSpent: 8900, lastVisit: '4 days ago', loyaltyPoints: 89 },
];

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Customers</h1>
          <p className="text-sm text-text-muted mt-0.5">{customers.length} registered customers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark shadow-md transition-all">
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, icon: Users, color: 'bg-primary/10 text-primary' },
          { label: 'Total Revenue', value: `₹${customers.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}`, icon: IndianRupee, color: 'bg-secondary-green/10 text-secondary-green' },
          { label: 'Total Orders', value: customers.reduce((s, c) => s + c.totalOrders, 0), icon: IndianRupee, color: 'bg-analytics-purple/10 text-analytics-purple' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl p-4 border border-border/50 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-xl font-extrabold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-muted">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Search customers..." />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-page-bg border-b border-border/50">
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Customer</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Phone</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Orders</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Total Spent</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Last Visit</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Points</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id} className="border-b border-border/30 hover:bg-page-bg/50 transition-colors cursor-pointer">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{customer.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-[10px] text-text-muted">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-text-muted">{customer.phone}</td>
                <td className="py-3 px-4 font-medium">{customer.totalOrders}</td>
                <td className="py-3 px-4 font-medium">₹{customer.totalSpent.toLocaleString()}</td>
                <td className="py-3 px-4 text-text-muted">{customer.lastVisit}</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 bg-accent-amber/10 text-accent-amber rounded-full text-[10px] font-semibold">{customer.loyaltyPoints} pts</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
