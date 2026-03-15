'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, MoreHorizontal, Grid3X3, List, Package, Loader2, X, Barcode, IndianRupee, Layers } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    categoryId: '',
    price: 0,
    mrp: 0,
    costPrice: 0,
    stockQuantity: 0,
    gstRate: 0,
    unit: 'PCS'
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`/api/products?q=${search}&limit=50`).then(r => r.json()),
        fetch(`/api/categories`).then(r => r.json())
      ]);
      setProducts(pRes.products || []);
      setCategories(cRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (e) {
      alert('Delete failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ name: '', barcode: '', categoryId: '', price: 0, mrp: 0, costPrice: 0, stockQuantity: 0, gstRate: 0, unit: 'PCS' });
        fetchProducts();
      }
    } catch (e) {
      alert('Operation failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Product Catalog</h1>
          <p className="text-sm text-text-muted mt-0.5">{products.length} items found in your inventory</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
            placeholder="Search by name, category or barcode..." />
          {isLoading && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />}
        </div>
        <div className="flex gap-1 bg-white border border-border rounded-xl p-1 shadow-sm">
          <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-page-bg'}`}><List className="w-4 h-4" /></button>
          <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-page-bg'}`}><Grid3X3 className="w-4 h-4" /></button>
        </div>
      </div>

      {isLoading && products.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : view === 'list' ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-page-bg border-b border-border/50">
                  <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Product Info</th>
                  <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Category</th>
                  <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider text-right">Selling Price</th>
                  <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider text-right">Stock</th>
                  <th className="text-center py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-page-bg/40 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-text-primary truncate">{product.name}</p>
                          <p className="text-[11px] text-text-muted font-mono">{product.barcode || 'NO BARCODE'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-secondary-green/10 text-secondary-green rounded-lg text-[10px] font-black uppercase tracking-tight">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-black text-text-primary">₹{product.price}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${product.stockQuantity <= 10 ? 'bg-error/10 text-error' : 'bg-page-bg text-text-primary'}`}>
                        {product.stockQuantity} {product.unit}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditingProduct(product); setFormData(product); setIsModalOpen(true); }}
                          className="p-2 rounded-lg hover:bg-primary-light text-primary transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-error transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <motion.div key={product.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-5 border border-border hover:shadow-xl hover:shadow-primary/5 transition-all group relative">
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingProduct(product); setFormData(product); setIsModalOpen(true); }} className="p-1.5 bg-white shadow-sm border border-border rounded-lg text-primary hover:bg-primary-light"><Edit2 className="w-3 h-3" /></button>
                <button onClick={() => handleDelete(product.id)} className="p-1.5 bg-white shadow-sm border border-border rounded-lg text-error hover:bg-error/5"><Trash2 className="w-3 h-3" /></button>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-text-primary line-clamp-1">{product.name}</h3>
              <p className="text-[10px] text-text-muted mt-1 uppercase font-black">{product.category?.name || 'General'}</p>
              <div className="flex items-center justify-between mt-4 border-t border-border/50 pt-4">
                <span className="text-lg font-black text-primary">₹{product.price}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${product.stockQuantity <= 10 ? 'bg-error/10 text-error' : 'bg-page-bg text-text-muted'}`}>
                  STOCK: {product.stockQuantity}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Product Form Modal (Simplified for now) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-black text-text-primary">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-page-bg rounded-xl transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase">Product Name</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-page-bg border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary shadow-inner" placeholder="e.g. Basmati Rice 5kg" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase">Barcode (optional)</label>
                    <div className="relative">
                      <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input type="text" value={formData.barcode} onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-page-bg border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary shadow-inner" placeholder="Scan or type barcode" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase">Category</label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <select required value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-page-bg border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary shadow-inner appearance-none">
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase">Selling Price (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full pl-10 pr-4 py-3 bg-page-bg border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary shadow-inner" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase">Opening Stock</label>
                    <input required type="number" disabled={!!editingProduct} value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-page-bg border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary shadow-inner disabled:opacity-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase">GST Rate (%)</label>
                    <input type="number" value={formData.gstRate} onChange={e => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-page-bg border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary shadow-inner" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-page-bg text-text-primary font-bold rounded-2xl hover:bg-border transition-colors">Cancel</button>
                  <button type="submit" className="flex-[2] py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all active:scale-95">
                    {editingProduct ? 'Update Product' : 'Create Product'}
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

