'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus, Search, Filter, ArrowUpDown, ChevronDown, CheckCircle2,
  X, AlertCircle, Package, History, Store, User, FileText,
  LayoutGrid, List, MoreHorizontal, ArrowRight, Trash2, Edit2, Scale,
  Zap, ShieldCheck, Activity, Target, Globe, ArrowUpRight, Loader2,
  MoreVertical, FileUp, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  category: { name: string };
  imageUrl: string | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('list');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
        const text = e.target?.result as string;
        try {
            const res = await fetch('/api/products/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ csvData: text })
            });
            const data = await res.json();
            if (res.ok) alert(`Successfully imported ${data.count} products`);
            else alert(data.error || 'Failed to import');
            fetchProducts();
        } catch (error) { alert('Internal error'); }
        finally { setIsImporting(false); }
    };
    reader.readAsText(file);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f5f7f9]">
      {/* ─── HEADER ─── */}
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 transition-all">
        <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Items</h1>
            <ChevronDown className="w-4 h-4 text-gray-400 mt-0.5" />
        </div>
        
        <div className="flex items-center gap-2">
           <Link href="/app/products/new" className="px-4 py-2 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> New
           </Link>
           <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 transition-all shadow-sm">
              <MoreVertical className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* ─── FILTER BAR ─── */}
      <div className="px-8 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
               <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Items..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:bg-white focus:border-blue-500 transition-all outline-none w-[280px]" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-blue-600 border border-gray-200 rounded-lg bg-white transition-all shadow-sm group">
               <Filter className="w-3.5 h-3.5" /> Filter <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
            </button>
         </div>

         <div className="flex items-center gap-2 border-l border-gray-100 pl-4">
            <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
               <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><List className="w-4 h-4" /></button>
               <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><LayoutGrid className="w-4 h-4" /></button>
            </div>
            <button onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50">
               {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 transition-all shadow-sm"><Download className="w-4 h-4" /></button>
         </div>
      </div>

      {/* ─── CONTENT (Professional Table) ─── */}
      <div className="flex-1 p-0 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white p-20 gap-4">
             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
             <p className="text-sm font-medium text-gray-400">Loading your catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 bg-white">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6"><Package className="w-10 h-10 text-gray-100" /></div>
             <h2 className="text-lg font-bold text-gray-900 mb-2">No items found</h2>
             <p className="text-sm text-gray-400 max-w-sm text-center mb-8">Start by creating your first product or import them in bulk from a CSV file.</p>
             <Link href="/app/products/new" className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Item
             </Link>
          </div>
        ) : view === 'list' ? (
          <div className="flex-1 overflow-auto no-scrollbar bg-white">
             <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                   <tr className="border-b border-gray-100">
                      <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Item Name</th>
                      <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">SKU</th>
                      <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Category</th>
                      <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 text-right">Price</th>
                      <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 text-center">Stock</th>
                      <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {filteredProducts.map(p => (
                      <tr key={p.id} className="group hover:bg-blue-50/40 transition-all hover:shadow-sm">
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                                  {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-gray-200" />}
                               </div>
                               <div>
                                  <Link href={`/app/products/${p.id}`} className="text-[14px] font-bold text-blue-600 group-hover:underline cursor-pointer">{p.name}</Link>
                                  <p className="text-[11px] text-gray-400 font-medium">Modified 2 days ago</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-5 text-[13px] text-gray-500 font-medium">{p.sku}</td>
                         <td className="px-8 py-5">
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-full group-hover:bg-white transition-colors">{p.category?.name || 'Uncategorized'}</span>
                         </td>
                         <td className="px-8 py-5 text-right text-[14px] font-bold text-gray-900">₹{p.price.toLocaleString()}</td>
                         <td className="px-8 py-5 text-center">
                            <div className="flex flex-col items-center">
                               <span className={`text-[14px] font-bold ${p.stockQuantity <= 10 ? 'text-red-500' : 'text-emerald-600'}`}>{p.stockQuantity}</span>
                               <div className="w-12 h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (p.stockQuantity/100)*100)}%` }} className={`h-full ${p.stockQuantity <= 10 ? 'bg-red-500' : 'bg-green-500'}`} />
                                </div>
                            </div>
                         </td>
                         <td className="px-8 py-5 text-right w-10">
                            <button className="p-2 text-gray-300 hover:text-gray-900 group-hover:bg-white rounded-lg transition-all"><MoreVertical className="w-4 h-4" /></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        ) : (
          <div className="flex-1 p-8 overflow-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
             {filteredProducts.map(p => (
                <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-xl hover:border-blue-200 transition-all flex flex-col cursor-pointer">
                   <div className="aspect-square bg-gray-50 relative overflow-hidden">
                      {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-12 h-12 text-gray-100" /></div>}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Link href={`/app/products/${p.id}/edit`} className="w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-400 hover:text-blue-600 border border-gray-100"><Edit2 className="w-4 h-4" /></Link>
                      </div>
                   </div>
                   <Link href={`/app/products/${p.id}`} className="p-5 flex-1 flex flex-col">
                      <p className="text-[14px] font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-2">{p.name}</p>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{p.sku}</p>
                   </Link>
                   <div className="p-5 pt-0 mt-auto flex items-center justify-between">
                         <span className="text-[11px] font-extrabold text-white bg-gray-900 px-3 py-1 rounded-sm">₹{p.price.toLocaleString()}</span>
                         <span className={`text-[11px] font-bold ${p.stockQuantity <= 10 ? 'text-red-500' : 'text-emerald-500'} uppercase tracking-widest`}>Qty: {p.stockQuantity}</span>
                      </div>
                </div>
             ))}
          </div>
        )}
      </div>

      {/* ─── FOOTER ─── */}
      <div className="px-8 py-3 bg-white border-t border-gray-200 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
         <span>Showing {filteredProducts.length} items</span>
         <div className="flex items-center gap-4">
            <button className="hover:text-blue-600 transition-colors">Previous</button>
            <div className="flex items-center gap-2">
               <span className="text-blue-600">1</span>
               <span>2</span>
               <span>3</span>
               <span>...</span>
            </div>
            <button className="hover:text-blue-600 transition-colors">Next</button>
         </div>
      </div>
    </div>
  );
}
