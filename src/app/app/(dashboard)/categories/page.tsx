'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, ChevronDown, CheckCircle2, 
  X, AlertCircle, Package, History, Store, User, FileText,
  BarChart3, MoreVertical, Edit2, Trash2, Layers,
  LayoutGrid, List, ArrowUpRight, FolderOpen, Tag,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  description: string | null;
  _count: { products: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    setSaving(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName, description: newCatDesc }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewCatName('');
        setNewCatDesc('');
        fetchCategories();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f5f7f9]">
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 transition-all">
        <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Item Groups</h1>
            <ChevronDown className="w-4 h-4 text-gray-400 mt-0.5" />
        </div>
        
        <div className="flex items-center gap-2">
           <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> New Group
           </button>
           <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 transition-all shadow-sm">
              <MoreVertical className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="px-8 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Groups..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] outline-none w-[280px]" />
            </div>
         </div>
      </div>

      <div className="flex-1 p-0 overflow-y-auto no-scrollbar bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center p-20 gap-4 flex-col bg-white h-full">
             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
             <p className="text-sm font-medium text-gray-400">Loading Groups...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex items-center justify-center p-20 flex-col bg-white h-full text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6"><Layers className="w-10 h-10 text-gray-100" /></div>
             <h2 className="text-lg font-bold text-gray-900 mb-2">No Item Groups found</h2>
             <p className="text-sm text-gray-400 mb-8 max-w-sm">Use item groups to organize your products into logical collections like Electronics, Furniture, etc.</p>
             <button onClick={() => setIsModalOpen(true)} className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Item Group
             </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
               <tr className="border-b border-gray-100">
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Group Name</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Description</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50 text-center">Product Count</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredCategories.map(c => (
                  <tr key={c.id} className="group hover:bg-blue-50/30 transition-all">
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors"><FolderOpen className="w-5 h-5 text-gray-300" /></div>
                           <div>
                              <p className="text-[14px] font-bold text-blue-600 group-hover:underline cursor-pointer">{c.name}</p>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {c.id.slice(-6)}</span>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-5 text-[13px] text-gray-500 max-w-xs truncate">{c.description || 'No description'}</td>
                     <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-[12px] font-bold border border-gray-100 shadow-sm transition-colors group-hover:bg-white group-hover:border-blue-100">
                           <Package className="w-3.5 h-3.5 text-blue-600" />
                           {c._count.products} Items
                        </div>
                     </td>
                     <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-white transition-all shadow-sm"><Edit2 className="w-4 h-4" /></button>
                           <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
               <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-[#1a6bdb] rounded-xl flex items-center justify-center text-white"><Plus className="w-6 h-6" /></div>
                     <h2 className="text-lg font-bold text-gray-900 leading-none">New Item Group</h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400"><X className="w-6 h-6" /></button>
               </div>
               
               <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Group Name *</label>
                     <input autoFocus type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="e.g., Electronics" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-600 transition-all outline-none" required />
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                     <textarea value={newCatDesc} onChange={e => setNewCatDesc(e.target.value)} placeholder="Describe what this group contains..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-600 transition-all outline-none resize-none h-24" />
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-gray-50 text-gray-400 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all">Cancel</button>
                     <button type="submit" disabled={saving || !newCatName} className="flex-[2] py-3.5 bg-[#1a6bdb] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-3">
                        {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        {saving ? 'Creating...' : 'Save Group'}
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
