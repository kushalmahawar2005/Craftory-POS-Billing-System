'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList, Plus, Search, Loader2, X, ChevronDown, ChevronUp,
    Package, IndianRupee, CheckCircle, Clock, Truck, AlertCircle
} from 'lucide-react';

interface PurchaseOrder {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    supplier?: { name: string; phone?: string | null } | null;
    items: { id: string; quantity: number; costPrice: number; product?: { name: string } | null }[];
}

interface Product { id: string; name: string; price: number; }
interface Supplier { id: string; name: string; }

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'Pending', color: 'bg-accent-amber/10 text-accent-amber', icon: Clock },
    COMPLETED: { label: 'Completed', color: 'bg-secondary-green/10 text-secondary-green', icon: CheckCircle },
    CANCELLED: { label: 'Cancelled', color: 'bg-error/10 text-error', icon: AlertCircle },
};

export default function PurchaseOrdersPage() {
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [formError, setFormError] = useState('');

    const [form, setForm] = useState({
        supplierId: '',
        status: 'PENDING' as 'PENDING' | 'COMPLETED',
        items: [{ productId: '', quantity: 1, costPrice: 0 }],
    });

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/purchase-orders');
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        fetchOrders();
        Promise.all([fetch('/api/suppliers'), fetch('/api/products')]).then(async ([sRes, pRes]) => {
            setSuppliers(await sRes.json());
            const pd = await pRes.json();
            setProducts(pd.products || pd);
        });
    }, []);

    const filtered = orders.filter(o =>
        o.supplier?.name.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase())
    );

    const totals = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        completed: orders.filter(o => o.status === 'COMPLETED').length,
        value: orders.reduce((s, o) => s + o.totalAmount, 0),
    };

    const addItem = () => setForm(f => ({ ...f, items: [...f.items, { productId: '', quantity: 1, costPrice: 0 }] }));
    const removeItem = (i: number) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
    const updateItem = (i: number, field: string, value: any) =>
        setForm(f => ({ ...f, items: f.items.map((item, idx) => idx === i ? { ...item, [field]: value } : item) }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.supplierId) { setFormError('Please select a supplier'); return; }
        if (form.items.some(i => !i.productId)) { setFormError('Please select product for all items'); return; }
        setSaving(true); setFormError('');
        try {
            const res = await fetch('/api/purchase-orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) { const d = await res.json(); setFormError(d.error || 'Failed'); return; }
            setShowModal(false);
            setForm({ supplierId: '', status: 'PENDING', items: [{ productId: '', quantity: 1, costPrice: 0 }] });
            fetchOrders();
        } catch { setFormError('Network error'); }
        finally { setSaving(false); }
    };

    const inputClass = "w-full px-3 py-2 bg-input-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-text-primary tracking-tight">Purchase Orders</h1>
                    <p className="text-sm text-text-muted mt-0.5">{orders.length} total orders</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all">
                    <Plus className="w-4 h-4" /> New Order
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', value: totals.total, icon: ClipboardList, color: 'text-primary bg-primary/10' },
                    { label: 'Pending', value: totals.pending, icon: Clock, color: 'text-accent-amber bg-accent-amber/10' },
                    { label: 'Completed', value: totals.completed, icon: CheckCircle, color: 'text-secondary-green bg-secondary-green/10' },
                    { label: 'Total Value', value: `₹${totals.value.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-analytics-purple bg-analytics-purple/10' },
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="bg-white rounded-2xl p-4 border border-border shadow-sm flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xl font-black text-text-primary">{stat.value}</p>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="Search by supplier or order ID..." />
            </div>

            {/* Orders List */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-border">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-border p-16 text-center">
                        <ClipboardList className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
                        <p className="font-bold text-text-muted">{search ? 'No orders found' : 'No purchase orders yet'}</p>
                        <p className="text-sm text-text-muted mt-1">Create your first order to restock inventory</p>
                    </div>
                ) : filtered.map((order, i) => {
                    const sc = statusConfig[order.status] || statusConfig.PENDING;
                    const StatusIcon = sc.icon;
                    const isExpanded = expandedId === order.id;
                    return (
                        <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-page-bg/30 transition-colors"
                                onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-black text-text-primary text-sm">{order.supplier?.name || 'Unknown Supplier'}</p>
                                        <p className="text-[10px] text-text-muted font-mono">{order.id.slice(0, 12)}...</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${sc.color}`}>
                                        <StatusIcon className="w-3 h-3" /> {sc.label}
                                    </span>
                                    <div className="text-right">
                                        <p className="font-black text-text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                        <p className="text-[10px] text-text-muted">{order.items.length} items</p>
                                    </div>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                                </div>
                            </div>
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                        <div className="px-5 pb-5 border-t border-border/50">
                                            <p className="text-[10px] font-black text-text-muted uppercase tracking-wider mt-4 mb-3">Order Items</p>
                                            <div className="space-y-2">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center p-3 bg-page-bg rounded-xl border border-border/30">
                                                        <div className="flex items-center gap-2">
                                                            <Package className="w-4 h-4 text-text-muted" />
                                                            <span className="text-sm font-bold">{item.product?.name || 'Unknown Product'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="text-text-muted">Qty: <strong>{item.quantity}</strong></span>
                                                            <span className="font-black text-primary">₹{(item.costPrice * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-text-muted mt-3 text-right">
                                                Created: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* New Order Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6"
                        onClick={() => setShowModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', duration: 0.4 }}
                            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-border max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 sticky top-0 bg-white">
                                <h2 className="text-lg font-black text-text-primary">Create Purchase Order</h2>
                                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-page-bg transition-colors">
                                    <X className="w-5 h-5 text-text-muted" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {formError && <div className="p-3 bg-error/5 border border-error/20 rounded-xl text-error text-sm">{formError}</div>}

                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-1.5">Supplier *</label>
                                    <select value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })} className={inputClass}>
                                        <option value="">Select a supplier</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-1.5">Status</label>
                                    <div className="flex gap-3">
                                        {(['PENDING', 'COMPLETED'] as const).map(s => (
                                            <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${form.status === s ? 'border-primary bg-primary-light text-primary' : 'border-border text-text-muted'
                                                    }`}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                    {form.status === 'COMPLETED' && (
                                        <p className="text-xs text-secondary-green mt-1.5 font-medium">✓ Stock will be updated immediately</p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-bold text-text-primary">Items *</label>
                                        <button type="button" onClick={addItem} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                                            <Plus className="w-3 h-3" /> Add Item
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {form.items.map((item, i) => (
                                            <div key={i} className="p-3 bg-page-bg rounded-xl border border-border/50 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-text-muted">Item {i + 1}</span>
                                                    {form.items.length > 1 && (
                                                        <button type="button" onClick={() => removeItem(i)} className="text-error hover:text-red-700">
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                                <select value={item.productId} onChange={e => updateItem(i, 'productId', e.target.value)} className={inputClass}>
                                                    <option value="">Select product</option>
                                                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                </select>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-xs text-text-muted font-medium">Quantity</label>
                                                        <input type="number" min={1} value={item.quantity}
                                                            onChange={e => updateItem(i, 'quantity', parseInt(e.target.value) || 1)} className={inputClass} />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-text-muted font-medium">Cost Price (₹)</label>
                                                        <input type="number" min={0} step="0.01" value={item.costPrice}
                                                            onChange={e => updateItem(i, 'costPrice', parseFloat(e.target.value) || 0)} className={inputClass} />
                                                    </div>
                                                </div>
                                                {item.quantity > 0 && item.costPrice > 0 && (
                                                    <p className="text-xs text-right text-primary font-bold">
                                                        Subtotal: ₹{(item.quantity * item.costPrice).toFixed(2)}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 p-3 bg-primary/5 rounded-xl border border-primary/10 flex justify-between">
                                        <span className="text-sm font-bold text-primary">Total Amount</span>
                                        <span className="text-sm font-black text-primary">
                                            ₹{form.items.reduce((s, i) => s + i.quantity * i.costPrice, 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-page-bg text-text-muted font-bold text-sm rounded-xl">Cancel</button>
                                    <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 disabled:opacity-50 transition-all">
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Order'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
