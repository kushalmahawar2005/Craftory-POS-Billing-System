'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, ChevronDown, CheckCircle2, 
  X, AlertCircle, Package, History, Store, User, FileText,
  BarChart3, MoreVertical, Edit2, Trash2, Layers,
  LayoutGrid, List, ArrowUpRight, FolderOpen, Tag,
  ArrowRight, Download, FileUp, MoreHorizontal, Printer,
  Eye, Receipt, Calculator, Clock, Calendar, Globe, Target,
  Settings, Zap, ShieldCheck, Scale, Boxes, Box, ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Adjustment {
  id: string;
  reason: string;
  type: string;
  date: string;
  status: string;
  referenceNumber: string;
  user: { name: string };
}

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAdjustments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/adjustments');
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

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const filteredAdjustments = adjustments.filter(adj => 
    adj.referenceNumber.toLowerCase().includes(search.toLowerCase()) || 
    adj.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f5f7f9]">
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 transition-all shadow-sm">
        <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Inventory Adjustments</h1>
            <ChevronDown className="w-4 h-4 text-gray-400 mt-0.5" />
        </div>
        
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> New Adjustment
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
               <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Ref# or Reason..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] outline-none w-[280px]" />
            </div>
         </div>
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-blue-50 text-blue-600 text-[13px] font-bold rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-all">
               <History className="w-4 h-4" /> Adjustment History
            </button>
         </div>
      </div>

      <div className="flex-1 p-0 overflow-y-auto no-scrollbar bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center p-20 gap-4 flex-col bg-white h-full">
             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
             <p className="text-sm font-medium text-gray-400">Loading Adjustments...</p>
          </div>
        ) : filteredAdjustments.length === 0 ? (
          <div className="flex items-center justify-center p-20 flex-col bg-white h-full text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6"><ClipboardList className="w-10 h-10 text-gray-100" /></div>
             <h2 className="text-lg font-bold text-gray-900 mb-2">No adjustments yet</h2>
             <p className="text-sm text-gray-400 mb-8 max-w-sm">Use inventory adjustments to fix stock discrepancies, record damages, or handle stock corrections manually.</p>
             <button className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Inventory Adjustment
             </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
               <tr className="border-b border-gray-100">
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Date</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Ref#</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Reason</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Type</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Status</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredAdjustments.map(adj => (
                  <tr key={adj.id} className="group hover:bg-blue-50/30 transition-all">
                     <td className="px-8 py-5">
                         <span className="text-[13px] font-medium text-gray-600">{new Date(adj.date).toLocaleDateString()}</span>
                     </td>
                     <td className="px-8 py-5 text-[14px] font-bold text-blue-600 group-hover:underline cursor-pointer">{adj.referenceNumber}</td>
                     <td className="px-8 py-5">
                         <div className="space-y-0.5">
                            <p className="text-[13px] font-bold text-gray-800">{adj.reason}</p>
                            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest italic">By {adj.user.name}</span>
                         </div>
                     </td>
                     <td className="px-8 py-5">
                         <span className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">{adj.type}</span>
                     </td>
                     <td className="px-8 py-5">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border shadow-sm bg-blue-50 text-blue-600 border-blue-100 uppercase tracking-widest`}>
                           {adj.status}
                        </span>
                     </td>
                     <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-white transition-all shadow-sm border border-transparent hover:border-gray-100"><Eye className="w-4 h-4" /></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
