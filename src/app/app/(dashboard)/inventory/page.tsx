'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Plus, Package, AlertTriangle, TrendingDown, Loader2 } from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products?q=${search}&limit=100`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchInventory, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const getStatus = (stock: number) => {
    if (stock <= 0) return { label: 'Out of Stock', color: 'bg-red-100 text-error' };
    if (stock <= 10) return { label: 'Low Stock', color: 'bg-amber-100 text-accent-amber' };
    return { label: 'In Stock', color: 'bg-green-100 text-secondary-green' };
  };

  const filtered = products.filter(item => {
    const status = getStatus(item.stockQuantity).label;
    if (filter === 'all') return true;
    if (filter === 'low') return status === 'Low Stock';
    if (filter === 'out') return status === 'Out of Stock';
    return true;
  });

  const lowStockCount = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10).length;
  const outStockCount = products.filter(p => p.stockQuantity <= 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Stock Inventory</h1>
          <p className="text-sm text-text-muted mt-0.5">{products.length} products listed · Total Value: ₹{totalValue.toLocaleString('en-IN')}</p>
        </div>
        <button onClick={() => window.location.href = '/app/products'} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all">
          <Plus className="w-4 h-4" /> Manage Products
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Products', value: products.length, icon: Package, color: 'text-primary bg-primary/10' },
          { label: 'Low Stock Items', value: lowStockCount, icon: AlertTriangle, color: 'text-accent-amber bg-accent-amber/10' },
          { label: 'Out of Stock', value: outStockCount, icon: TrendingDown, color: 'text-error bg-error/10' },
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

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
            placeholder="Search products by name or barcode..." />
        </div>
        <div className="flex gap-1.5 p-1 bg-white border border-border rounded-xl w-full sm:w-auto">
          {[{ id: 'all', label: 'All' }, { id: 'low', label: 'Low Stock' }, { id: 'out', label: 'Out' }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f.id ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-page-bg'
                }`}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-page-bg/50 border-b border-border/50">
                <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Product Info</th>
                <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Category</th>
                <th className="text-right py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Current Stock</th>
                <th className="text-right py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Price</th>
                <th className="text-center py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading && products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center"><Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" /></td>
                </tr>
              ) : filtered.map((item) => {
                const status = getStatus(item.stockQuantity);
                return (
                  <tr key={item.id} className="hover:bg-page-bg/20 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-text-primary">{item.name}</p>
                      <p className="text-[10px] text-text-muted uppercase font-black">{item.barcode || 'No Barcode'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[11px] font-bold text-text-muted">{item.category?.name || 'General'}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-black text-text-primary">
                      {item.stockQuantity} <span className="text-[10px] text-text-muted">{item.unit}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-primary">₹{item.price}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!isLoading && filtered.length === 0 && (
            <div className="py-20 text-center text-text-muted text-sm font-medium">No products match your current filters.</div>
          )}
        </div>
      </div>

      {/* Inventory Alerts Slide-over Modal */}
      <AnimatePresence>
        {showAlerts && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setShowAlerts(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-border"
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-page-bg/50">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Bell className="w-5 h-5 text-accent-amber animate-bounce" /> Inventory Alerts
                </h2>
                <button onClick={() => setShowAlerts(false)} className="p-2 rounded-full hover:bg-gray-200 text-text-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <p className="text-sm text-text-muted mb-6">These items are falling below their required stock levels and need immediate reordering.</p>
                
                {inventoryItems.filter(i => i.status === 'Out of Stock' || i.status === 'Critical' || i.status === 'Low Stock').map(item => (
                  <div key={item.id} className="bg-white border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-text-primary">{item.name}</h4>
                      <p className="text-xs text-text-muted mt-0.5">SKU: {item.sku} | Reorder: {item.reorderLevel}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'Out of Stock' ? 'bg-error text-white' :
                        item.status === 'Critical' ? 'bg-red-100 text-error' :
                        'bg-amber-100 text-accent-amber'
                      }`}>
                        {item.stock} left
                      </span>
                      <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                        <RefreshCw className="w-3 h-3" /> Order Mix
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
