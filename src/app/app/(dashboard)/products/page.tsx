'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, MoreHorizontal, Grid3X3, List, Package } from 'lucide-react';

const products = [
  { id: 1, name: 'Basmati Rice 5kg', sku: 'RCE001', category: 'Groceries', price: 250, mrp: 280, stock: 45, gst: 5 },
  { id: 2, name: 'Sunflower Oil 1L', sku: 'OIL002', category: 'Groceries', price: 150, mrp: 170, stock: 8, gst: 5 },
  { id: 3, name: 'Tata Salt 1kg', sku: 'SLT003', category: 'Groceries', price: 20, mrp: 22, stock: 120, gst: 0 },
  { id: 4, name: 'Red Label Tea 250g', sku: 'TEA004', category: 'Beverages', price: 200, mrp: 220, stock: 3, gst: 12 },
  { id: 5, name: 'Surf Excel 1kg', sku: 'DET005', category: 'Household', price: 220, mrp: 250, stock: 67, gst: 18 },
  { id: 6, name: 'Amul Butter 500g', sku: 'BTR006', category: 'Dairy', price: 280, mrp: 300, stock: 12, gst: 12 },
  { id: 7, name: 'Maggi Noodles 4pk', sku: 'NDL007', category: 'Groceries', price: 56, mrp: 60, stock: 5, gst: 12 },
  { id: 8, name: 'Colgate 200g', sku: 'TPS008', category: 'Personal Care', price: 105, mrp: 115, stock: 34, gst: 18 },
];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('list');

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Products</h1>
          <p className="text-sm text-text-muted mt-0.5">{products.length} products in catalog</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark shadow-md transition-all">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Search products..." />
        </div>
        <div className="flex gap-0.5 bg-white border border-border rounded-lg p-0.5">
          <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-primary/10 text-primary' : 'text-text-muted'}`}><List className="w-4 h-4" /></button>
          <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-primary/10 text-primary' : 'text-text-muted'}`}><Grid3X3 className="w-4 h-4" /></button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-page-bg border-b border-border/50">
                <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">SKU</th>
                <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">MRP</th>
                <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">GST</th>
                <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-text-muted text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-border/30 hover:bg-page-bg/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4 text-text-muted">{product.sku}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 bg-primary-light text-primary rounded-full text-[10px] font-medium">{product.category}</span></td>
                  <td className="py-3 px-4 font-medium">₹{product.price}</td>
                  <td className="py-3 px-4 text-text-muted">₹{product.mrp}</td>
                  <td className="py-3 px-4 text-text-muted">{product.gst}%</td>
                  <td className="py-3 px-4 font-medium">{product.stock}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-primary-light text-text-muted hover:text-primary transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-error transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 border border-border/50 hover:shadow-md transition-all group">
              <div className="w-full h-28 bg-page-bg rounded-lg flex items-center justify-center mb-3">
                <Package className="w-10 h-10 text-text-muted/30" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">{product.name}</h3>
              <p className="text-[10px] text-text-muted mt-0.5">{product.sku} · {product.category}</p>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-base font-bold text-primary">₹{product.price}</span>
                  <span className="text-xs text-text-muted line-through ml-1">₹{product.mrp}</span>
                </div>
                <span className="text-[10px] font-medium text-text-muted bg-page-bg px-1.5 py-0.5 rounded">Stock: {product.stock}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
