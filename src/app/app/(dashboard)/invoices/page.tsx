'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, ChevronDown, CheckCircle2, 
  X, AlertCircle, Package, History, Store, User, FileText,
  BarChart3, MoreVertical, Edit2, Trash2, Layers,
  LayoutGrid, List, ArrowUpRight, FolderOpen, Tag,
  ArrowRight, Download, FileUp, MoreHorizontal, Printer,
  Eye, Receipt, Calculator, Clock, Calendar, Globe, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Invoice {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  customer?: { name: string };
  user: { name: string };
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sales');
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.sales || data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || 
    (inv.customer?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f5f7f9]">
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 transition-all shadow-sm">
        <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Invoices</h1>
            <ChevronDown className="w-4 h-4 text-gray-400 mt-0.5" />
        </div>
        
        <div className="flex items-center gap-2">
           <Link href="/app/pos" className="px-4 py-2 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> New Invoice
           </Link>
           <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 transition-all shadow-sm">
              <MoreVertical className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="px-8 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Invoices..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] outline-none w-[280px]" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-blue-600 border border-gray-200 rounded-lg bg-white transition-all shadow-sm group">
               <Filter className="w-3.5 h-3.5" /> Filter <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
         </div>
      </div>

      <div className="flex-1 p-0 overflow-y-auto no-scrollbar bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center p-20 gap-4 flex-col bg-white h-full">
             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
             <p className="text-sm font-medium text-gray-400">Loading Invoices...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="flex items-center justify-center p-20 flex-col bg-white h-full text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6"><Receipt className="w-10 h-10 text-gray-100" /></div>
             <h2 className="text-lg font-bold text-gray-900 mb-2">No Invoices found</h2>
             <p className="text-sm text-gray-400 mb-8 max-w-sm">Capture sales instantly using POS billing and track all your invoices here.</p>
             <Link href="/app/pos" className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create First Invoice
             </Link>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
               <tr className="border-b border-gray-100">
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Date</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Invoice#</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Customer Name</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Status</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50 text-right">Amount</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredInvoices.map(inv => (
                  <tr key={inv.id} className="group hover:bg-blue-50/30 transition-all">
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <Calendar className="w-4 h-4 text-gray-300" />
                           <span className="text-[13px] font-medium text-gray-600">{new Date(inv.createdAt).toLocaleDateString()}</span>
                        </div>
                     </td>
                     <td className="px-8 py-5">
                        <p className="text-[14px] font-bold text-blue-600 group-hover:underline cursor-pointer">{inv.invoiceNumber}</p>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{inv.paymentMethod}</span>
                     </td>
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <User className="w-4 h-4 text-gray-400" />
                           <span className="text-[14px] font-medium text-gray-700">{inv.customer?.name || 'Walk-in Customer'}</span>
                        </div>
                     </td>
                     <td className="px-8 py-5">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${
                           inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                           inv.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                           'bg-red-50 text-red-600 border-red-100'
                        }`}>
                           {inv.status}
                        </span>
                     </td>
                     <td className="px-8 py-5 text-right">
                        <p className="text-[15px] font-bold text-gray-900 tracking-tight">₹{inv.totalAmount.toLocaleString()}</p>
                     </td>
                     <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-white transition-all shadow-sm"><Eye className="w-4 h-4" /></button>
                           <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-white transition-all shadow-sm"><Printer className="w-4 h-4" /></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-8 py-3 bg-white border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
         <span>Total {filteredInvoices.length} invoices found</span>
         <div className="flex items-center gap-4">
            <span className="text-gray-900">Aggregate Total: ₹{filteredInvoices.reduce((a, b) => a + b.totalAmount, 0).toLocaleString()}</span>
         </div>
      </div>
    </div>
  );
}
