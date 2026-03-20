'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, ChevronDown, CheckCircle2, 
  X, AlertCircle, Package, History, Store, User, FileText,
  BarChart3, MoreVertical, Edit2, Trash2, Layers,
  LayoutGrid, List, ArrowUpRight, FolderOpen, Tag,
  ArrowRight, Download, FileUp, MoreHorizontal, Printer,
  Eye, Receipt, Calculator, Clock, Calendar, Globe, Target,
  Mail, Phone, MapPin, UserCheck, SearchCode, HistoryIcon,
  Truck, Building2, Briefcase, Boxes, Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Supplier {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  _count: { purchaseOrders: number };
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/suppliers');
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    (s.phone || '').includes(search)
  );

  return (
    <div className="flex flex-col h-full bg-[#f5f7f9]">
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 transition-all shadow-sm">
        <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Suppliers</h1>
            <ChevronDown className="w-4 h-4 text-gray-400 mt-0.5" />
        </div>
        
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> New Supplier
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
               <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Suppliers..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] outline-none w-[280px]" />
            </div>
         </div>
      </div>

      <div className="flex-1 p-0 overflow-y-auto no-scrollbar bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center p-20 gap-4 flex-col bg-white h-full">
             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
             <p className="text-sm font-medium text-gray-400">Loading Vendors...</p>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="flex items-center justify-center p-20 flex-col bg-white h-full text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6"><Truck className="w-10 h-10 text-gray-100" /></div>
             <h2 className="text-lg font-bold text-gray-900 mb-2">No Vendors found</h2>
             <p className="text-sm text-gray-400 mb-8 max-w-sm">Manage your supply chain by adding vendors here. You can then create purchase orders and track restocking bills.</p>
             <button className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add First Vendor
             </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
               <tr className="border-b border-gray-100">
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Vendor Details</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Contact info</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50 text-center">Open Orders</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Payable</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredSuppliers.map(s => (
                  <tr key={s.id} className="group hover:bg-blue-50/30 transition-all">
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all font-bold text-xs shadow-sm shadow-black/5 border border-gray-100 overflow-hidden">
                              <Building2 className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-[14px] font-bold text-blue-600 group-hover:underline cursor-pointer">{s.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <MapPin className="w-3 h-3 text-gray-300" />
                                 <span className="text-[11px] text-gray-400 font-medium truncate max-w-[150px]">{s.address || 'No location set'}</span>
                              </div>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-5">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2 text-[12px] text-gray-600 font-medium">
                              <Phone className="w-3.5 h-3.5 text-blue-600" /> {s.phone || '--'}
                           </div>
                           <div className="flex items-center gap-2 text-[11px] text-gray-400 truncate max-w-[180px]">
                              <Mail className="w-3 h-3" /> {s.email || 'no email'}
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-5 text-center">
                        <div className="flex flex-col items-center">
                           <span className="text-[14px] font-bold text-gray-900">{s._count.purchaseOrders}</span>
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Confirmed</span>
                        </div>
                     </td>
                     <td className="px-8 py-5">
                        <p className="text-[14px] font-bold text-gray-900 tracking-tight">₹0.00</p>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Outstanding Payables</span>
                     </td>
                     <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-white transition-all shadow-sm border border-transparent hover:border-blue-100"><Edit2 className="w-4 h-4" /></button>
                           <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-all shadow-sm border border-transparent hover:border-red-100"><Trash2 className="w-4 h-4" /></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-8 py-3 bg-white border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
         <span>Total {filteredSuppliers.length} vendors in the system</span>
         <div className="flex items-center gap-4">
            <span className="text-gray-900">Aggregate Payables: ₹0.00</span>
         </div>
      </div>
    </div>
  );
}
