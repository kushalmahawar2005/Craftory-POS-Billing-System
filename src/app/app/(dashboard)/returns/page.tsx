'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, ChevronDown, CheckCircle2, 
  X, AlertCircle, Package, History, Store, User, FileText,
  BarChart3, MoreVertical, Edit2, Trash2, Layers,
  LayoutGrid, List, ArrowUpRight, FolderOpen, Tag,
  ArrowRight, Download, FileUp, MoreHorizontal, Printer,
  Eye, Receipt, Calculator, Clock, Calendar, Globe, Target,
  RotateCcw, ShieldAlert, Archive, Boxes
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Return {
  id: string;
  returnNumber: string;
  invoiceNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  customerName: string;
  reason: string;
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<Return[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchReturns = async () => {
    setIsLoading(true);
    // Simulating API call for demo
    setTimeout(() => {
      setReturns([
        { id: '1', returnNumber: 'RET-0001', invoiceNumber: 'INV-1023', totalAmount: 450.50, status: 'RECEIVED', createdAt: new Date().toISOString(), customerName: 'Rahul Sharma', reason: 'Defective Product' },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const filteredReturns = returns.filter(r => 
    r.returnNumber.toLowerCase().includes(search.toLowerCase()) || 
    r.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f5f7f9]">
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 transition-all shadow-sm">
        <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Sales Returns</h1>
            <ChevronDown className="w-4 h-4 text-gray-400 mt-0.5" />
        </div>
        
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm uppercase tracking-widest">
              <Plus className="w-4 h-4" /> New Return
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
               <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Return# or Invoice#..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] outline-none w-[280px]" />
            </div>
         </div>
      </div>

      <div className="flex-1 p-0 overflow-y-auto no-scrollbar bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center p-20 gap-4 flex-col bg-white h-full">
             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
             <p className="text-sm font-medium text-gray-400">Loading Return Records...</p>
          </div>
        ) : filteredReturns.length === 0 ? (
          <div className="flex items-center justify-center p-20 flex-col bg-white h-full text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6"><RotateCcw className="w-10 h-10 text-gray-100" /></div>
             <h2 className="text-lg font-bold text-gray-900 mb-2">No Returns recorded</h2>
             <p className="text-sm text-gray-400 mb-8 max-w-sm">Process sales returns easily and track inventory restocking protocols for returned items.</p>
             <button className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2 uppercase tracking-widest">
                <Plus className="w-4 h-4" /> Create First Return
             </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-gray-100">
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Return Details</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Original Invoice#</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50 text-center">Status</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50 text-right">Refund Amount</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredReturns.map(r => (
                  <tr key={r.id} className="group hover:bg-orange-50/30 transition-all">
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-100 font-bold group-hover:bg-orange-500 group-hover:text-white transition-all text-xs">
                              <RotateCcw className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-[14px] font-bold text-orange-600 group-hover:underline cursor-pointer">{r.returnNumber}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <User className="w-3 h-3 text-gray-300" />
                                 <span className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">{r.customerName}</span>
                              </div>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-[14px] font-bold text-blue-600 cursor-pointer hover:underline">
                           <FileText className="w-4 h-4" /> {r.invoiceNumber}
                        </div>
                     </td>
                     <td className="px-8 py-5 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border shadow-sm bg-orange-50 text-orange-600 border-orange-100 uppercase tracking-widest`}>
                           {r.status}
                        </span>
                     </td>
                     <td className="px-8 py-5 text-right">
                        <p className="text-[15px] font-bold text-gray-900 tracking-tight">₹{r.totalAmount.toLocaleString()}</p>
                     </td>
                     <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-end gap-2 text-gray-400">
                           <button className="p-2 hover:text-gray-900 transition-all"><Printer className="w-4 h-4" /></button>
                           <button className="p-2 hover:text-gray-900 transition-all"><Eye className="w-4 h-4" /></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-8 py-3 bg-white border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
         <span>Track customer returns and handle refund processing</span>
         <div className="flex items-center gap-4">
            <span className="text-gray-900">Total Refunded: ₹450.50</span>
         </div>
      </div>
    </div>
  );
}
