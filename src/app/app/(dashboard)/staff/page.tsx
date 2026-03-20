'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, ChevronDown, CheckCircle2, 
  X, AlertCircle, Package, History, Store, User, FileText,
  BarChart3, MoreVertical, Edit2, Trash2, Layers,
  LayoutGrid, List, ArrowUpRight, FolderOpen, Tag,
  ArrowRight, Download, FileUp, MoreHorizontal, Printer,
  Eye, Receipt, Calculator, Clock, Calendar, Globe, Target,
  Users, UserCheck, ShieldCheck, Mail, Phone, Lock, Briefcase, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
  lastLogin: string | null;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStaff = async () => {
    setIsLoading(true);
    // Simulating API call for demo
    setTimeout(() => {
      setStaff([
        { id: '1', name: 'Naman Admin', role: 'ADMIN', email: 'admin@craftory.com', phone: '9876543210', status: 'ACTIVE', lastLogin: new Date().toISOString() },
        { id: '2', name: 'Kushal Cashier', role: 'CASHIER', email: 'cashier@craftory.com', phone: '8765432109', status: 'ACTIVE', lastLogin: null },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f5f7f9]">
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 transition-all shadow-sm">
        <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Users & Roles</h1>
            <ChevronDown className="w-4 h-4 text-gray-400 mt-0.5" />
        </div>
        
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm uppercase tracking-widest">
              <Plus className="w-4 h-4" /> Add New User
           </button>
           <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 transition-all shadow-sm">
              <Settings className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="px-8 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Users..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] outline-none w-[280px]" />
            </div>
         </div>
      </div>

      <div className="flex-1 p-0 overflow-y-auto no-scrollbar bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center p-20 gap-4 flex-col bg-white h-full">
             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
             <p className="text-sm font-medium text-gray-400">Loading Access Records...</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="flex items-center justify-center p-20 flex-col bg-white h-full text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6"><Users className="w-10 h-10 text-gray-100" /></div>
             <h2 className="text-lg font-bold text-gray-900 mb-2">No Staff Members found</h2>
             <p className="text-sm text-gray-400 mb-8 max-w-sm">Invite your team members and assign them roles like Cashier, Manager or Admin to manage store operations.</p>
             <button className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2 uppercase tracking-widest">
                <Plus className="w-4 h-4" /> Invite First Member
             </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-gray-100">
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Staff Detail</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Role & Access</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50">Connectivity</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50 text-center">Protocol Level</th>
                  <th className="px-8 py-4 text-[12px] font-bold text-gray-400 uppercase bg-gray-50/50"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredStaff.map(s => (
                  <tr key={s.id} className="group hover:bg-blue-50/30 transition-all">
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-100 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all text-xs">
                              {s.name.charAt(0)}
                           </div>
                           <div>
                              <p className="text-[14px] font-bold text-blue-600 group-hover:underline cursor-pointer">{s.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <Mail className="w-3 h-3 text-gray-300" />
                                 <span className="text-[11px] text-gray-400 font-medium">{s.email}</span>
                              </div>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <ShieldCheck className="w-4 h-4 text-emerald-500" />
                           <span className="text-[14px] font-bold text-gray-800 uppercase tracking-tight">{s.role}</span>
                        </div>
                     </td>
                     <td className="px-8 py-5">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2 text-[12px] text-gray-600 font-medium">
                              <Phone className="w-3.5 h-3.5 text-blue-600" /> {s.phone}
                           </div>
                           <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest italic">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Synchronized
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-100 group-hover:bg-white transition-colors">
                           <Briefcase className="w-3 h-3 text-blue-600" />
                           Store Official
                        </div>
                     </td>
                     <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg bg-gray-50 hover:bg-white transition-all border border-transparent hover:border-blue-100"><Edit2 className="w-4 h-4" /></button>
                           <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg bg-gray-50 hover:bg-white transition-all border border-transparent hover:border-red-100"><Lock className="w-4 h-4" /></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-8 py-3 bg-white border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
         <span>Manage administrative access levels from global settings</span>
         <div className="flex items-center gap-4">
            <span className="text-gray-900">Total Personnel: {staff.length}</span>
         </div>
      </div>
    </div>
  );
}
