'use client';

import { useState } from 'react';
import { Search, Plus, Phone, Mail, IndianRupee, MoreHorizontal, Users, X, ShoppingBag, Calendar, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  
  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));
  const activeCustomer = customers.find(c => c.id === selectedCustomer);

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
              <tr key={customer.id} onClick={() => setSelectedCustomer(customer.id)} className="border-b border-border/30 hover:bg-page-bg/50 transition-colors cursor-pointer group">
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

      {/* Customer Details Slide-over Modal */}
      <AnimatePresence>
        {selectedCustomer !== null && activeCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setSelectedCustomer(null)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-border"
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-page-bg/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-base font-bold text-primary">{activeCustomer.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary leading-tight">{activeCustomer.name}</h2>
                    <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1"><Star className="w-3 h-3 text-accent-amber fill-accent-amber" /> {activeCustomer.loyaltyPoints} Loyalty Points</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-2 rounded-full hover:bg-gray-200 text-text-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Contact Options */}
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 bg-gray-50 border border-border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm font-semibold text-text-primary">
                    <Phone className="w-4 h-4 text-primary" /> Call
                  </button>
                  <button className="flex-1 py-2.5 bg-gray-50 border border-border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm font-semibold text-text-primary">
                    <Mail className="w-4 h-4 text-primary" /> Email
                  </button>
                </div>

                {/* Lifetime Stats */}
                <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Lifetime Values</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                      <p className="text-xs text-text-muted mb-1">Total Spent</p>
                      <p className="text-lg font-bold text-primary">₹{activeCustomer.totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="bg-page-bg border border-border/50 rounded-xl p-4">
                      <p className="text-xs text-text-muted mb-1">Total Orders</p>
                      <p className="text-lg font-bold text-text-primary">{activeCustomer.totalOrders}</p>
                    </div>
                  </div>
                </div>

                {/* Recent Purchases Mock */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Recent Purchases</h3>
                    <button className="text-xs font-bold text-primary hover:underline">View All</button>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <p className="font-bold text-sm text-text-primary truncate">Order #INV-{(8000 + i * 14)}</p>
                            <p className="font-bold text-sm text-text-primary">₹{(Math.random() * 2000 + 500).toFixed(0)}</p>
                          </div>
                          <div className="flex justify-between items-center text-xs text-text-muted">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {i} days ago</span>
                            <span>{Math.floor(Math.random() * 5 + 1)} items</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
              <div className="p-6 border-t border-border bg-page-bg/50">
                <button
                  className="w-full py-3.5 bg-white border border-border text-error font-bold rounded-xl hover:bg-error/5 transition-all flex items-center justify-center gap-2"
                >
                  Delete Customer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
