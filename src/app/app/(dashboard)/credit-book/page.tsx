'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, ChevronDown, CheckCircle2, 
  X, AlertCircle, Package, History, Store, User, FileText,
  BarChart3, MoreVertical, Edit2, Trash2, Layers,
  LayoutGrid, List, ArrowUpRight, FolderOpen, Tag,
  ArrowRight, Download, FileUp, MoreHorizontal, Printer,
  Eye, Receipt, Calculator, Clock, Calendar, Globe, Target,
  Wallet, UserMinus, UserPlus, Scale, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreditRecord {
  id: string;
  customerName: string;
  totalDebt: number;
  lastTransactionDate: string;
  status: string;
  phone: string;
}

export default function CreditBookPage() {
  const [records, setRecords] = useState<CreditRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchRecords = async () => {
    setIsLoading(true);
    // Simulating API call for demo if needed, but in real it would fetch from /api/credit-book
    setTimeout(() => {
      setRecords([
        { id: '1', customerName: 'Rahul Sharma', totalDebt: 1250.00, lastTransactionDate: new Date().toISOString(), status: 'OVERDUE', phone: '9876543210' },
        { id: '2', customerName: 'Priya Verma', totalDebt: 450.00, lastTransactionDate: new Date().toISOString(), status: 'PENDING', phone: '8765432109' },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter(r => 
    r.customerName.toLowerCase().includes(search.toLowerCase()) || 
    r.phone.includes(search)
  );

  return (
    <div className="flex flex-col h-full bg-[#f5f7f9]">
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 transition-all shadow-sm">
        <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Credit Book (Khaata)</h1>
            <ChevronDown className="w-4 h-4 text-gray-400 mt-0.5" />
        </div>
        
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm">
              <UserPlus className="w-4 h-4" /> New Credit Entry
           </button>
           <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 transition-all shadow-sm">
              <MoreVertical className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="px-8 py-6 bg-white border-b border-gray-200">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-red-50 rounded-xl border border-red-100 group hover:shadow-lg transition-all cursor-pointer">
               <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest block mb-2">Total Receivables</span>
               <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-red-600 tracking-tight">₹1,700.00</p>
                  <TrendingUp className="w-6 h-6 text-red-200 group-hover:scale-110 transition-transform" />
               </div>
            </div>
            <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-100 group hover:shadow-lg transition-all cursor-pointer">
               <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block mb-2">Collected Today</span>
               <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-emerald-600 tracking-tight">₹4,200.00</p>
                  <CheckCircle2 className="w-6 h-6 text-emerald-200 group-hover:scale-110 transition-transform" />
               </div>
            </div>
            <div className="p-5 bg-blue-50 rounded-xl border border-blue-100 group hover:shadow-lg transition-all cursor-pointer">
               <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest block mb-2">Active Debtors</span>
               <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-blue-600 tracking-tight">{records.length}</p>
                  <Wallet className="w-6 h-6 text-blue-200 group-hover:scale-110 transition-transform" />
               </div>
            </div>
         </div>
      </div>

      <div className="px-8 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Debtors..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] outline-none w-[280px]" />
            </div>
         </div>
      </div>

      <div className="flex-1 p-0 overflow-y-auto no-scrollbar bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center p-20 gap-4 flex-col bg-white h-full">
             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
             <p className="text-sm font-medium text-gray-400">Loading Debtors...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex items-center justify-center p-20 flex-col bg-white h-full text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6"><Wallet className="w-10 h-10 text-gray-100" /></div>
             <h2 className="text-lg font-bold text-gray-900 mb-2">No dues recorded</h2>
             <p className="text-sm text-gray-400 mb-8 max-w-sm">Use credit book to track customer dues, send automated reminders and record part-payments easily.</p>
             <button className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Add Debt Record
             </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-gray-100">
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Debtor Details</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Phone Number</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50 text-center">Last Transaction</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50 text-right">Outstanding Due</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredRecords.map(r => (
                  <tr key={r.id} className="group hover:bg-red-50/30 transition-all">
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs ring-4 ring-white group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                              {r.customerName.charAt(0)}
                           </div>
                           <p className="text-[14px] font-bold text-gray-900 group-hover:text-red-600 transition-colors uppercase tracking-tight">{r.customerName}</p>
                        </div>
                     </td>
                     <td className="px-8 py-5 text-[13px] text-gray-500 font-medium">{r.phone}</td>
                     <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-[11px] font-bold border border-gray-100">
                           <Calendar className="w-3.5 h-3.5" />
                           {new Date(r.lastTransactionDate).toLocaleDateString()}
                        </div>
                     </td>
                     <td className="px-8 py-5 text-right">
                        <div className="space-y-0.5">
                           <p className="text-[16px] font-bold text-red-600 tracking-tight">₹{r.totalDebt.toLocaleString()}</p>
                           <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${r.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                              {r.status}
                           </span>
                        </div>
                     </td>
                     <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-4 py-1.5 bg-red-600 text-white text-[11px] font-bold rounded shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all uppercase tracking-widest">Collect Payment</button>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-8 py-3 bg-white border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
         <span>Track dues diligently for healthy cashflow</span>
         <div className="flex items-center gap-4">
            <span className="text-gray-900">Aggregate Dues: ₹1,700.00</span>
         </div>
      </div>
    </div>
  );
}
