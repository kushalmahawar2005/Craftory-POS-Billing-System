'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Phone, Mail, IndianRupee, Users, Loader2, X, Edit2, Trash2, ShoppingCart, Calendar, MoreHorizontal, ShoppingBag, Star } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  totalSpent: number;
  currentBalance: number;
  creditLimit: number;
  createdAt: string;
  _count: { sales: number };
  sales: { createdAt: string }[];
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [creditData, setCreditData] = useState<any>(null);
  const [loadingCredit, setLoadingCredit] = useState(false);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/customers?q=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCustomers(data);
    } catch (e) {
      console.error('Fetch customers error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', email: '', creditLimit: '0' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({ name: customer.name, phone: customer.phone, email: customer.email || '', creditLimit: customer.creditLimit.toString() });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError('Name and Phone are required');
      return;
    }
    setSaving(true);
    setFormError('');

    try {
      const url = editingCustomer ? `/api/customers/${editingCustomer.id}` : '/api/customers';
      const method = editingCustomer ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Something went wrong');
        setSaving(false);
        return;
      }

      setShowModal(false);
      fetchCustomers();
    } catch {
      setFormError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', creditLimit: '0' });

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/customers/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteId(null);
        fetchCustomers();
      }
    } catch (e) {
      console.error('Delete error:', e);
    } finally {
      setDeleting(false);
    }
  };

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalOrders = customers.reduce((s, c) => s + c._count.sales, 0);
  const totalOutstanding = customers.reduce((s, c) => s + c.currentBalance, 0);
  const activeCustomer = customers.find(c => c.id === selectedCustomerId);

  useEffect(() => {
    if (selectedCustomerId) {
      setLoadingCredit(true);
      fetch(`/api/customers/${selectedCustomerId}/credit`)
        .then(res => res.json())
        .then(data => { setCreditData(data); setLoadingCredit(false); })
        .catch(() => setLoadingCredit(false));
    } else {
      setCreditData(null);
    }
  }, [selectedCustomerId]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Customers</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {isLoading ? 'Loading...' : `${customers.length} registered customers`}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-primary bg-primary/10' },
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-secondary-green bg-secondary-green/10' },
          { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'text-analytics-purple bg-analytics-purple/10' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-border shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-text-primary">{stat.value}</p>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
          placeholder="Search by name or phone number..."
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-page-bg/50 border-b border-border/50">
                <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Customer</th>
                <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider text-center">Outstanding Balance</th>
                <th className="text-right py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Credit Limit</th>
                <th className="text-center py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Orders</th>
                <th className="text-right py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Total Spent</th>
                <th className="text-center py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading && customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                    <p className="text-sm text-text-muted mt-3">Loading customers...</p>
                  </td>
                </tr>
              ) : !isLoading && customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Users className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
                    <p className="text-sm font-medium text-text-muted">
                      {search ? 'No customers match your search' : 'No customers yet'}
                    </p>
                    {!search && (
                      <p className="text-xs text-text-muted mt-1">Customers will appear here when they make a purchase or are added manually.</p>
                    )}
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const lastSaleDate = customer.sales?.[0]?.createdAt;
                  return (
                    <tr key={customer.id} onClick={() => setSelectedCustomerId(customer.id)} className="hover:bg-page-bg/20 transition-colors group cursor-pointer">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-xs font-black text-primary">
                              {customer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-text-primary">{customer.name}</p>
                            <p className="text-[10px] text-text-muted flex items-center gap-1">
                              {customer.email ? (
                                <><Mail className="w-2.5 h-2.5" /> {customer.email}</>
                              ) : (
                                <span className="text-text-muted/50">No email</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`font-black ${customer.currentBalance > 0 ? 'text-error' : 'text-text-muted/60'}`}>
                          ₹{customer.currentBalance.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-text-muted font-bold">
                        ₹{customer.creditLimit.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-black text-text-primary">{customer._count.sales}</span>
                      </td>
                      <td className="py-4 px-6 text-right font-black text-primary">
                        ₹{customer.totalSpent.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditModal(customer); }}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteId(customer.id); }}
                            className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Slide-over Modal */}
      <AnimatePresence>
        {selectedCustomerId !== null && activeCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setSelectedCustomerId(null)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-border"
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-page-bg/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-base font-bold text-primary">{activeCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary leading-tight">{activeCustomer.name}</h2>
                    <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1"><Star className="w-3 h-3 text-accent-amber fill-accent-amber" /> Loyal Customer</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomerId(null)} className="p-2 rounded-full hover:bg-gray-200 text-text-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Contact Options */}
                <div className="flex gap-3">
                  <a href={`tel:${activeCustomer.phone}`} className="flex-1 py-2.5 bg-gray-50 border border-border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm font-semibold text-text-primary">
                    <Phone className="w-4 h-4 text-primary" /> Call
                  </a>
                  {activeCustomer.email && (
                    <a href={`mailto:${activeCustomer.email}`} className="flex-1 py-2.5 bg-gray-50 border border-border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm font-semibold text-text-primary">
                      <Mail className="w-4 h-4 text-primary" /> Email
                    </a>
                  )}
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
                      <p className="text-lg font-bold text-text-primary">{activeCustomer._count.sales}</p>
                    </div>
                  </div>
                </div>

                {/* Udhar / Credit Section */}
                <div className="pt-2">
                  <h3 className="text-xs font-black text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                    <IndianRupee className="w-3 h-3 text-error" /> Credit (Udhar) Status
                  </h3>
                  <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Balance Owed</p>
                        <p className={`text-2xl font-black ${activeCustomer.currentBalance > 0 ? 'text-error' : 'text-text-muted'}`}>₹{activeCustomer.currentBalance.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Limit</p>
                        <p className="text-sm font-black text-text-primary">₹{activeCustomer.creditLimit.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-orange-200">
                      <p className="text-[9px] font-black text-text-muted uppercase mb-2 tracking-widest">Recent Transactions</p>
                      <div className="space-y-2">
                        {loadingCredit ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        ) : creditData?.transactions?.length > 0 ? (
                          creditData.transactions.map((t: any, i: number) => (
                            <div key={i} className="flex justify-between items-center text-[11px]">
                              <span className="text-text-muted font-bold truncate max-w-[140px]">{t.type.replace(/_/g, ' ')}</span>
                              <span className={`font-black ${t.type.includes('PAYMENT') ? 'text-secondary-green' : 'text-error'}`}>
                                {t.type.includes('PAYMENT') ? '-' : '+'}₹{t.amount}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-text-muted italic">No recent credit activity</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-page-bg rounded-xl p-5 border border-border/50 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-text-muted">Mobile No</span>
                        <span className="font-semibold text-text-primary">{activeCustomer.phone}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-text-muted">Member Since</span>
                        <span className="font-semibold text-text-primary">{new Date(activeCustomer.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

              </div>
              
              <div className="p-6 border-t border-border bg-page-bg/50 flex gap-3">
                <button onClick={() => { setSelectedCustomerId(null); openEditModal(activeCustomer); }}
                  className="flex-1 py-3 bg-white border border-border text-text-primary font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
                <button onClick={() => { setSelectedCustomerId(null); setDeleteId(activeCustomer.id); }}
                  className="flex-1 py-3 bg-white border border-border text-error font-bold rounded-xl hover:bg-error/5 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add/Edit Customer Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-border overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                <h2 className="text-lg font-black text-text-primary">
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-page-bg transition-colors">
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-error/5 border border-error/20 rounded-xl text-error text-sm font-medium"
                  >
                    {formError}
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-bold text-text-primary mb-1.5">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-primary mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="e.g. 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-primary mb-1.5">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={formData.creditLimit}
                    onChange={e => setFormData({ ...formData, creditLimit: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="0.00 (No limit if 0)"
                  />
                  <p className="text-[10px] text-text-muted mt-1 font-medium">Maximum credit allowed for this customer.</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 bg-page-bg text-text-muted font-bold text-sm rounded-xl hover:bg-border/50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 disabled:opacity-50 transition-all"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : editingCustomer ? (
                      'Save Changes'
                    ) : (
                      'Add Customer'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-border p-6 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-error" />
              </div>
              <h3 className="text-lg font-black text-text-primary mb-1">Delete Customer?</h3>
              <p className="text-sm text-text-muted mb-6">
                This action cannot be undone. All customer data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 bg-page-bg text-text-muted font-bold text-sm rounded-xl hover:bg-border/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-error text-white font-bold text-sm rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
