'use client';

import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, Plus, Package, AlertTriangle, TrendingDown, X, Bell, RefreshCw } from 'lucide-react';

const inventoryItems = [
  { id: 1, name: 'Basmati Rice 5kg', sku: 'RCE001', category: 'Groceries', stock: 45, reorderLevel: 10, price: 250, status: 'In Stock' },
  { id: 2, name: 'Sunflower Oil 1L', sku: 'OIL002', category: 'Groceries', stock: 8, reorderLevel: 15, price: 150, status: 'Low Stock' },
  { id: 3, name: 'Tata Salt 1kg', sku: 'SLT003', category: 'Groceries', stock: 120, reorderLevel: 20, price: 20, status: 'In Stock' },
  { id: 4, name: 'Red Label Tea 250g', sku: 'TEA004', category: 'Beverages', stock: 3, reorderLevel: 10, price: 200, status: 'Critical' },
  { id: 5, name: 'Surf Excel 1kg', sku: 'DET005', category: 'Household', stock: 67, reorderLevel: 15, price: 220, status: 'In Stock' },
  { id: 6, name: 'Amul Butter 500g', sku: 'BTR006', category: 'Dairy', stock: 12, reorderLevel: 10, price: 280, status: 'In Stock' },
  { id: 7, name: 'Maggi Noodles 4pk', sku: 'NDL007', category: 'Groceries', stock: 5, reorderLevel: 20, price: 56, status: 'Low Stock' },
  { id: 8, name: 'Colgate 200g', sku: 'TPS008', category: 'Personal Care', stock: 34, reorderLevel: 10, price: 105, status: 'In Stock' },
  { id: 9, name: 'Dettol Soap 125g', sku: 'SOP009', category: 'Personal Care', stock: 0, reorderLevel: 15, price: 55, status: 'Out of Stock' },
  { id: 10, name: 'Parle-G Biscuit', sku: 'BSC010', category: 'Snacks', stock: 200, reorderLevel: 50, price: 10, status: 'In Stock' },
];

export default function InventoryPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAlerts, setShowAlerts] = useState(false);

  const filtered = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    if (filter === 'all') return matchesSearch;
    if (filter === 'low') return matchesSearch && (item.status === 'Low Stock' || item.status === 'Critical');
    if (filter === 'out') return matchesSearch && item.status === 'Out of Stock';
    return matchesSearch;
  });

  const lowStockCount = inventoryItems.filter(i => i.status === 'Low Stock' || i.status === 'Critical').length;
  const outStockCount = inventoryItems.filter(i => i.status === 'Out of Stock').length;
  const totalValue = inventoryItems.reduce((sum, i) => sum + i.price * i.stock, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Inventory</h1>
          <p className="text-sm text-text-muted mt-0.5">{inventoryItems.length} products · Stock value: ₹{totalValue.toLocaleString()}</p>
        </div>
        <button onClick={() => router.push('/app/products')} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] transition-all">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Products', value: inventoryItems.length, icon: Package, color: 'text-primary bg-primary/10', action: null },
          { label: 'Low Stock Items', value: lowStockCount, icon: AlertTriangle, color: 'text-accent-amber bg-accent-amber/10', action: () => setShowAlerts(true) },
          { label: 'Out of Stock', value: outStockCount, icon: TrendingDown, color: 'text-error bg-error/10', action: () => setShowAlerts(true) },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            onClick={stat.action || undefined}
            className={`bg-white rounded-xl p-4 border border-border/50 flex items-center gap-3 ${stat.action ? 'cursor-pointer hover:border-primary/50 hover:shadow-md transition-all' : ''}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-muted">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Search products..." />
        </div>
        <div className="flex gap-1.5">
          {[{ id: 'all', label: 'All' }, { id: 'low', label: 'Low Stock' }, { id: 'out', label: 'Out of Stock' }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filter === f.id ? 'bg-primary text-white' : 'bg-white border border-border text-text-muted hover:border-primary/30'
              }`}>{f.label}</button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-xs font-medium text-text-muted hover:border-primary/30">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-page-bg border-b border-border/50">
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Product</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">SKU</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Stock</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Reorder Level</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Price</th>
              <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-border/30 hover:bg-page-bg/50 transition-colors">
                <td className="py-3 px-4 font-medium">{item.name}</td>
                <td className="py-3 px-4 text-text-muted">{item.sku}</td>
                <td className="py-3 px-4 text-text-muted">{item.category}</td>
                <td className="py-3 px-4 font-medium">{item.stock}</td>
                <td className="py-3 px-4 text-text-muted">{item.reorderLevel}</td>
                <td className="py-3 px-4 font-medium">₹{item.price}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.status === 'In Stock' ? 'bg-green-50 text-secondary-green' :
                    item.status === 'Low Stock' ? 'bg-amber-50 text-accent-amber' :
                    item.status === 'Critical' ? 'bg-red-50 text-error' :
                    'bg-gray-100 text-text-muted'
                  }`}>{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
