'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, ChevronDown, CheckCircle2, 
  X, AlertCircle, Package, History, Store, User, FileText,
  BarChart3, MoreVertical, Edit2, Trash2, Layers,
  LayoutGrid, List, ArrowUpRight, FolderOpen, Tag,
  ArrowRight, Download, FileUp, MoreHorizontal, Printer,
  Eye, Receipt, Calculator, Clock, Calendar, Globe, Target,
  Mail, Phone, MapPin, UserCheck, SearchCode, HistoryIcon, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  _count: { sales: number };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.phone || '').includes(search)
  );

  return (
    <div className="flex flex-col h-full bg-[#f5f7f9]">
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 transition-all shadow-sm">
        <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Customers</h1>
            <ChevronDown className="w-4 h-4 text-gray-400 mt-0.5" />
        </div>
        
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> New Customer
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
               <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Customers..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] outline-none w-[280px]" />
            </div>
            <button className="px-4 py-2 border border-blue-100 text-[#1a6bdb] text-[13px] font-bold rounded-lg hover:bg-blue-50/50 transition-all flex items-center gap-2">
               Show Debtors Only
            </button>
         </div>
      </div>

      <div className="flex-1 p-0 overflow-y-auto no-scrollbar bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center p-20 gap-4 flex-col bg-white h-full">
             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
             <p className="text-sm font-medium text-gray-400">Loading Client Records...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex items-center justify-center p-20 flex-col bg-white h-full text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6"><Users className="w-10 h-10 text-gray-100" /></div>
             <h2 className="text-lg font-bold text-gray-900 mb-2">No Customers found</h2>
             <p className="text-sm text-gray-400 mb-8 max-w-sm">Capture customer details during billing to build loyalty programs and track credit book transactions.</p>
             <button className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add First Customer
             </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
               <tr className="border-b border-gray-100">
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Customer Details</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Contact info</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50 text-center">Visit Count</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Balance</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredCustomers.map(c => (
                  <tr key={c.id} className="group hover:bg-blue-50/30 transition-all">
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all font-bold text-xs shadow-sm">
                              {c.name.charAt(0)}
                           </div>
                           <div>
                              <p className="text-[14px] font-bold text-blue-600 group-hover:underline cursor-pointer">{c.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <MapPin className="w-3 h-3 text-gray-300" />
                                 <span className="text-[11px] text-gray-400 font-medium truncate max-w-[150px]">{c.address || 'No address provided'}</span>
                              </div>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-5">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2 text-[12px] text-gray-600">
                              <Phone className="w-3 h-3 text-gray-300" /> {c.phone || '--'}
                           </div>
                           <div className="flex items-center gap-2 text-[11px] text-gray-400 lowercase italic">
                              <Mail className="w-2.5 h-2.5" /> {c.email || 'no email'}
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-5 text-center">
                        <div className="flex flex-col items-center">
                           <span className="text-[14px] font-bold text-gray-800">{c._count.sales}</span>
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Orders</span>
                        </div>
                     </td>
                     <td className="px-8 py-5">
                        <p className="text-[14px] font-bold text-red-600 tracking-tight">₹0.00</p>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Receivable</span>
                     </td>
                     <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-white transition-all shadow-sm"><HistoryIcon className="w-4 h-4" /></button>
                           <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-white transition-all shadow-sm"><MoreHorizontal className="w-4 h-4" /></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-8 py-3 bg-white border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
         <span>Aggregate {filteredCustomers.length} active clients</span>
         <div className="flex items-center gap-4">
            <span className="text-gray-900">Total Receivables: ₹0.00</span>
         </div>
      </div>
    </div>
  );
}
