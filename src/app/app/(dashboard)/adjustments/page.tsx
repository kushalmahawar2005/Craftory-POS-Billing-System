'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, ChevronDown, CheckCircle2, 
  X, AlertCircle, Package, History, MoreVertical, 
  ClipboardList, Loader2, ArrowUpRight, ArrowDownRight,
  TrendingUp, TrendingDown, Calendar, User, Info, Trash2, FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Adjustment {
  id: string;
  reason: string;
  note?: string;
  adjustmentDate: string;
  staff: { name: string };
  items: Array<{
    id: string;
    quantityChange: number;
    product: { name: string };
  }>;
}

interface Product {
  id: string;
  name: string;
  stockQuantity: number;
}

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // New Adjustment Form State
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Array<{ id: string; name: string; currentStock: number; change: number }>>([]);
  const [reason, setReason] = useState('Stock Correction');
  const [note, setNote] = useState('');

  const fetchAdjustments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/inventory/adjustments');
      if (res.ok) {
        const data = await res.json();
        setAdjustments(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(productSearch)}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAdjustments();
  }, []);

  useEffect(() => {
    if (showModal) {
        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }
  }, [productSearch, showModal]);

  const handleAddProduct = (p: Product) => {
    if (selectedProducts.find(item => item.id === p.id)) return;
    setSelectedProducts([...selectedProducts, { id: p.id, name: p.name, currentStock: p.stockQuantity, change: 0 }]);
    setProductSearch('');
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== id));
  };

  const handleUpdateChange = (id: string, val: number) => {
    setSelectedProducts(selectedProducts.map(p => p.id === id ? { ...p, change: val } : p));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProducts.length === 0) return;
    if (selectedProducts.some(p => p.change === 0)) {
        alert('Please specify a quantity change for all items');
        return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/inventory/adjustments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            reason,
            note,
            items: selectedProducts.map(p => ({
                productId: p.id,
                quantityChange: p.change
            }))
        })
      });

      if (res.ok) {
        setShowModal(false);
        setSelectedProducts([]);
        setNote('');
        fetchAdjustments();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save adjustment');
      }
    } catch (e) {
      console.error(e);
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  const filteredAdjustments = adjustments.filter(adj => 
    adj.id.toLowerCase().includes(search.toLowerCase()) || 
    adj.reason.toLowerCase().includes(search.toLowerCase()) ||
    adj.items.some(i => i.product.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-[#f5f7f9]">
      {/* Header */}
      <div className="px-8 py-6 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Inventory Adjustments</h1>
            <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mt-1">Manual Stock Corrections</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95">
              <Plus className="w-4 h-4" /> New Adjustment
           </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
         <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
                type="text" 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search ID, Reason or Product..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] outline-none w-[320px] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all" 
            />
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center p-20 gap-4 flex-col bg-white rounded-3xl border border-gray-100 h-[400px]">
             <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
             <p className="text-sm font-medium text-gray-400 italic">Retrieving adjustment logs...</p>
          </div>
        ) : filteredAdjustments.length === 0 ? (
          <div className="flex items-center justify-center p-20 flex-col bg-white rounded-3xl border border-gray-100 h-[400px] text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                <ClipboardList className="w-10 h-10 text-gray-200" />
             </div>
             <h2 className="text-lg font-bold text-gray-900 mb-2">No adjustments yet</h2>
             <p className="text-xs text-gray-400 mb-8 max-w-sm font-medium leading-relaxed uppercase tracking-wider">Use inventory adjustments to fix stock discrepancies, record damages, or handle stock corrections manually.</p>
             <button onClick={() => setShowModal(true)} className="px-8 py-3 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Start First Adjustment
             </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAdjustments.map((adj) => (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={adj.id} 
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                    <div className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-blue-50 transition-colors">
                                <History className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-gray-900">{adj.reason}</h3>
                                    <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md uppercase tracking-tighter">REF: {adj.id.slice(0, 8)}</span>
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                    <span className="text-[11px] text-gray-400 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                                        <Calendar className="w-3 h-3" /> {new Date(adj.adjustmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                    <span className="text-[11px] text-gray-400 flex items-center gap-1.5 font-bold uppercase tracking-widest border-l border-gray-100 pl-4">
                                        <User className="w-3 h-3" /> {adj.staff.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">TOTAL ITEMS</p>
                                <p className="text-lg font-bold text-gray-800">{adj.items.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-[#fafbfc]/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {adj.items.map(item => (
                                <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-200/60 flex items-center justify-between">
                                    <span className="text-[13px] font-semibold text-gray-600 truncate mr-2">{item.product.name}</span>
                                    <span className={`text-[12px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                                        item.quantityChange > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'
                                    }`}>
                                        {item.quantityChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {item.quantityChange > 0 ? `+${item.quantityChange}` : item.quantityChange}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {adj.note && (
                            <div className="mt-4 flex items-start gap-2 text-[11px] text-gray-500 italic bg-white p-2 rounded-lg border border-gray-100">
                                <Info className="w-3 h-3 mt-0.5 text-gray-400" />
                                <span>Note: {adj.note}</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* New Adjustment Modal */}
      <AnimatePresence>
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowModal(false)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                >
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-page-bg/30">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">New Inventory Adjustment</h2>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Adjust stock levels manually</p>
                        </div>
                        <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Reason for Adjustment</label>
                                <select 
                                    value={reason} 
                                    onChange={e => setReason(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-semibold"
                                >
                                    <option>Stock Correction</option>
                                    <option>Damaged Goods</option>
                                    <option>Stock Loss / Theft</option>
                                    <option>Expired Items</option>
                                    <option>Inventory Audit</option>
                                    <option>Return to Vendor</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Additional Note (Optional)</label>
                                <input 
                                    type="text" 
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    placeholder="e.g. Audit held by John Doe"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-semibold"
                                />
                            </div>
                        </div>

                        {/* Product Search & Select */}
                        <div className="space-y-4">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Select Products to Adjust</label>
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={productSearch}
                                    onChange={e => setProductSearch(e.target.value)}
                                    placeholder="Search products by name or SKU..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[13px] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                                />
                                {/* Dropdown */}
                                {productSearch && products.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 max-h-48 overflow-y-auto no-scrollbar py-2">
                                        {products.map(p => (
                                            <button 
                                                type="button"
                                                key={p.id}
                                                onClick={() => handleAddProduct(p)}
                                                className="w-full px-4 py-2 text-left hover:bg-page-bg transition-colors flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                        <Package className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                    <span className="text-[13px] font-semibold text-gray-700">{p.name}</span>
                                                </div>
                                                <span className="text-[11px] font-bold text-gray-400 uppercase">Stock: {p.stockQuantity}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected Products List */}
                            <div className="space-y-3">
                                {selectedProducts.map((p) => (
                                    <div key={p.id} className="p-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                                                <Package className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-gray-800">{p.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Current Stock: {p.currentStock}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleUpdateChange(p.id, p.change - 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg font-bold"
                                                >-</button>
                                                <div className="w-16 text-center text-[13px] font-bold bg-white border-x border-gray-200 flex items-center justify-center h-10">
                                                    {p.change > 0 ? `+${p.change}` : p.change}
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleUpdateChange(p.id, p.change + 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg font-bold text-blue-600"
                                                >+</button>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveProduct(p.id)}
                                                className="p-2.5 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {selectedProducts.length === 0 && (
                                    <div className="py-12 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2">
                                        <FolderOpen className="w-8 h-8 text-gray-200" />
                                        <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">No products selected</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button 
                                type="button" 
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3.5 bg-gray-50 text-gray-400 text-[13px] font-bold rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest border border-gray-100"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={saving || selectedProducts.length === 0}
                                className="flex-1 py-3.5 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Adjustment'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
