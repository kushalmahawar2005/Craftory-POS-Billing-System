'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Phone, Mail, Truck, Loader2, X, Edit2, Trash2, MapPin, ExternalLink, Package, History, ArrowUpRight, Handshake } from 'lucide-react';

interface Supplier {
    id: string;
    name: string;
    contactPerson?: string | null;
    phone: string;
    email?: string | null;
    address?: string | null;
    createdAt: string;
    _count?: { products: number };
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
    const [formData, setFormData] = useState({ name: '', contactPerson: '', phone: '', email: '', address: '' });
    const [formError, setFormError] = useState('');
    const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

    const fetchSuppliers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/suppliers?q=${encodeURIComponent(search)}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setSuppliers(data);
        } catch (e) {
            console.error('Fetch suppliers error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(fetchSuppliers, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const openAddModal = () => {
        setEditingSupplier(null);
        setFormData({ name: '', contactPerson: '', phone: '', email: '', address: '' });
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            name: supplier.name,
            contactPerson: supplier.contactPerson || '',
            phone: supplier.phone,
            email: supplier.email || '',
            address: supplier.address || '',
        });
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
            const url = editingSupplier ? `/api/suppliers/${editingSupplier.id}` : '/api/suppliers';
            const method = editingSupplier ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    contactPerson: formData.contactPerson.trim() || undefined,
                    phone: formData.phone.trim(),
                    email: formData.email.trim() || undefined,
                    address: formData.address.trim() || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setFormError(data.error || 'Something went wrong');
                setSaving(false);
                return;
            }

            setShowModal(false);
            fetchSuppliers();
        } catch {
            setFormError('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/suppliers/${deleteId}`, { method: 'DELETE' });
            if (res.ok) {
                setDeleteId(null);
                fetchSuppliers();
            }
        } catch (e) {
            console.error('Delete error:', e);
        } finally {
            setDeleting(false);
        }
    };

    const activeSupplier = suppliers.find(s => s.id === selectedSupplierId);
    const inputClass = "w-full px-4 py-2.5 bg-input-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-text-primary tracking-tight">Suppliers</h1>
                    <p className="text-sm text-text-muted mt-0.5">{suppliers.length} registered suppliers</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all">
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
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-page-bg/50 border-b border-border/50">
                                <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Supplier</th>
                                <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Contact</th>
                                <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Address</th>
                                <th className="text-center py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Products</th>
                                <th className="text-center py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {isLoading && suppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                                        <p className="text-sm text-text-muted mt-3">Loading suppliers...</p>
                                    </td>
                                </tr>
                            ) : !isLoading && suppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Truck className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
                                        <p className="text-sm font-medium text-text-muted">
                                            {search ? 'No suppliers match your search' : 'No suppliers yet'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                suppliers.map((supplier) => (
                                    <tr key={supplier.id} onClick={() => setSelectedSupplierId(supplier.id)} className="hover:bg-page-bg/20 transition-colors group cursor-pointer">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                                    <Truck className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-text-primary">{supplier.name}</p>
                                                    <p className="text-[10px] text-text-muted">ID: {supplier.id.slice(0, 8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium text-text-primary">{supplier.contactPerson || 'N/A'}</p>
                                                <p className="text-xs text-text-muted flex items-center gap-1.5"><Phone className="w-3 h-3" /> {supplier.phone}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-xs text-text-muted max-w-[200px] truncate">
                                                {supplier.address || 'No address provided'}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="px-2 py-1 bg-page-bg border border-border rounded-lg text-xs font-bold text-text-primary">
                                                {supplier._count?.products || 0}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); openEditModal(supplier); }}
                                                    className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setDeleteId(supplier.id); }}
                                                    className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="e.g. Rahul Distributors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-1.5">Contact Person</label>
                                    <input type="text" value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} className={inputClass} placeholder="e.g. John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-1.5">Phone *</label>
                                    <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="e.g. 9876543210" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-1.5">Email</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="supplier@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-1.5">Address</label>
                                    <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className={inputClass} placeholder="Full address" />
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

            {/* Supplier Details Slide-over Modal */}
            <AnimatePresence>
                {selectedSupplierId !== null && activeSupplier && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                            onClick={() => setSelectedSupplierId(null)}
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-border"
                        >
                            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-page-bg/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Truck className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-text-primary leading-tight">{activeSupplier.name}</h2>
                                        <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1"><Handshake className="w-3 h-3 text-secondary-green" /> trusted Partner</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedSupplierId(null)} className="p-2 rounded-full hover:bg-gray-200 text-text-muted transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                                {/* Contact Options */}
                                <div className="flex gap-3">
                                    <a href={`tel:${activeSupplier.phone}`} className="flex-1 py-2.5 bg-gray-50 border border-border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm font-semibold text-text-primary">
                                        <Phone className="w-4 h-4 text-primary" /> Call
                                    </a>
                                    {activeSupplier.email && (
                                        <a href={`mailto:${activeSupplier.email}`} className="flex-1 py-2.5 bg-gray-50 border border-border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm font-semibold text-text-primary">
                                            <Mail className="w-4 h-4 text-primary" /> Email
                                        </a>
                                    )}
                                </div>

                                {/* Key Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-center">
                                        <p className="text-xs text-text-muted mb-1">Products Supplied</p>
                                        <p className="text-xl font-bold text-primary">{activeSupplier._count?.products || 0}</p>
                                    </div>
                                    <div className="bg-page-bg border border-border/50 rounded-xl p-4 text-center">
                                        <p className="text-xs text-text-muted mb-1">Active Orders</p>
                                        <p className="text-xl font-bold text-text-primary">0</p>
                                    </div>
                                </div>

                                {/* Info List */}
                                <div className="bg-page-bg rounded-xl p-5 border border-border/50 space-y-4">
                                    <div>
                                        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Primary Contact</h4>
                                        <p className="text-sm font-semibold text-text-primary">{activeSupplier.contactPerson || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Address</h4>
                                        <p className="text-sm text-text-primary flex items-start gap-2 italic">
                                            <MapPin className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                                            {activeSupplier.address || 'No address on file'}
                                        </p>
                                    </div>
                                </div>

                                {/* Recent Activity Mock */}
                                <div>
                                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Recent Activity</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-gray-50/50">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <History className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-text-primary">Last delivery received</p>
                                                <p className="text-[10px] text-text-muted">12 items · 3 days ago</p>
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 text-text-muted" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-border bg-page-bg/50 flex gap-3">
                                <button onClick={() => { setSelectedSupplierId(null); openEditModal(activeSupplier); }}
                                    className="flex-1 py-3 bg-white border border-border text-text-primary font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => { setSelectedSupplierId(null); setDeleteId(activeSupplier.id); }}
                                    className="flex-1 py-3 bg-white border border-border text-error font-bold rounded-xl hover:bg-error/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </motion.div>
                    </>
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
