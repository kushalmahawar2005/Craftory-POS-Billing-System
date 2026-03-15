'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Plus, Search, Edit2, Trash2, Loader2, X, Phone, Mail, MapPin, Package } from 'lucide-react';

interface Supplier {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    createdAt: string;
}

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
    const [formError, setFormError] = useState('');

    const fetchSuppliers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/suppliers');
            const data = await res.json();
            setSuppliers(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchSuppliers(); }, []);

    const filtered = suppliers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.phone?.includes(search) || s.email?.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => {
        setEditingSupplier(null);
        setForm({ name: '', phone: '', email: '', address: '' });
        setFormError('');
        setShowModal(true);
    };

    const openEdit = (s: Supplier) => {
        setEditingSupplier(s);
        setForm({ name: s.name, phone: s.phone || '', email: s.email || '', address: s.address || '' });
        setFormError('');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) { setFormError('Supplier name is required'); return; }
        setSaving(true); setFormError('');
        try {
            const url = editingSupplier ? `/api/suppliers/${editingSupplier.id}` : '/api/suppliers';
            const method = editingSupplier ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) { const d = await res.json(); setFormError(d.error || 'Failed'); return; }
            setShowModal(false);
            fetchSuppliers();
        } catch { setFormError('Network error'); }
        finally { setSaving(false); }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await fetch(`/api/suppliers/${deleteId}`, { method: 'DELETE' });
            setDeleteId(null);
            fetchSuppliers();
        } catch (e) { console.error(e); }
        finally { setDeleting(false); }
    };

    const inputClass = "w-full px-4 py-2.5 bg-input-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-text-primary tracking-tight">Suppliers</h1>
                    <p className="text-sm text-text-muted mt-0.5">{suppliers.length} registered suppliers</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all">
                    <Plus className="w-4 h-4" /> Add Supplier
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="Search suppliers by name, phone, email..." />
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border p-16 text-center">
                    <Truck className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
                    <p className="font-bold text-text-muted">{search ? 'No suppliers found' : 'No suppliers yet'}</p>
                    <p className="text-sm text-text-muted mt-1">Add your first supplier to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((supplier, i) => (
                        <motion.div key={supplier.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-2xl border border-border/50 p-5 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <span className="text-sm font-black text-primary">{supplier.name[0].toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <p className="font-black text-text-primary">{supplier.name}</p>
                                        <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Supplier</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(supplier)} className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors">
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => setDeleteId(supplier.id)} className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {supplier.phone && (
                                    <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <Phone className="w-3 h-3" /> {supplier.phone}
                                    </div>
                                )}
                                {supplier.email && (
                                    <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <Mail className="w-3 h-3" /> {supplier.email}
                                    </div>
                                )}
                                {supplier.address && (
                                    <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <MapPin className="w-3 h-3" /> {supplier.address}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
                        onClick={() => setShowModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', duration: 0.4 }}
                            className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-border"
                            onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                                <h2 className="text-lg font-black text-text-primary">{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
                                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-page-bg transition-colors">
                                    <X className="w-5 h-5 text-text-muted" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {formError && <div className="p-3 bg-error/5 border border-error/20 rounded-xl text-error text-sm">{formError}</div>}
                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-1.5">Supplier Name *</label>
                                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g. Rahul Distributors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-1.5">Phone</label>
                                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="e.g. 9876543210" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-1.5">Email</label>
                                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="supplier@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-1.5">Address</label>
                                    <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={inputClass} placeholder="Full address" />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-page-bg text-text-muted font-bold text-sm rounded-xl hover:bg-border/50 transition-all">Cancel</button>
                                    <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 disabled:opacity-50 transition-all">
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingSupplier ? 'Save Changes' : 'Add Supplier'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirm */}
            <AnimatePresence>
                {deleteId && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
                        onClick={() => setDeleteId(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl border border-border"
                            onClick={e => e.stopPropagation()}>
                            <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-7 h-7 text-error" />
                            </div>
                            <h3 className="text-lg font-black text-text-primary mb-1">Delete Supplier?</h3>
                            <p className="text-sm text-text-muted mb-6">This cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 bg-page-bg text-text-muted font-bold text-sm rounded-xl transition-all">Cancel</button>
                                <button onClick={handleDelete} disabled={deleting} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-error text-white font-bold text-sm rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all">
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
