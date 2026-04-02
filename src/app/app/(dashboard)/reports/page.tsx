'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, ChevronDown, CheckCircle2, 
  X, AlertCircle, Package, History, Store, User, FileText,
  BarChart3, MoreVertical, Edit2, Trash2, Layers,
  LayoutGrid, List, ArrowUpRight, FolderOpen, Tag,
  ArrowRight, Download, FileUp, MoreHorizontal, Printer,
  Eye, Receipt, Calculator, Clock, Calendar, Globe, Target,
  TrendingUp, TrendingDown, DollarSign, PieChart, LineChart, 
  Activity, Zap, ShieldCheck, Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('inventory');

  const reportSections = [
    { id: 'inventory', label: 'Inventory Reports', icon: Box },
    { id: 'sales', label: 'Sales Reports', icon: TrendingUp },
    { id: 'receivables', label: 'Receivables Reports', icon: Wallet },
    { id: 'payments', label: 'Payment Reports', icon: CreditCard },
  ];

  const inventoryReports = [
    { title: 'Inventory Details', description: 'Complete list of all items with SKU, cost and current stock.', icon: FileText },
    { title: 'Stock Summary', description: 'Overview of stock levels, quantity on hand and committed stock.', icon: BarChart3 },
    { title: 'Inventory Valuation', description: 'The total value of inventory at hand as of today.', icon: Calculator },
    { title: 'Low Stock Report', description: 'List of items that have dropped below reorder level.', icon: AlertCircle },
  ];

  const salesReports = [
    { title: 'Sales by Item', description: 'Detailed breakdown of sales performance for each individual item.', icon: PieChart },
    { title: 'Sales by Category', description: 'Performance analysis of different item groups.', icon: Layers },
    { title: 'Sales by Day', description: 'Daily revenue and order count trends.', icon: Calendar },
    { title: 'Tax Summary', description: 'Summarized report of taxes collected on every sale.', icon: ShieldCheck },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f5f7f9]">
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 transition-all shadow-sm">
        <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Reports</h1>
            <ChevronDown className="w-4 h-4 text-gray-400 mt-0.5" />
        </div>
        
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 border border-gray-200 text-gray-700 text-[13px] font-bold rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
              <Download className="w-3.5 h-3.5" /> Export All
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* SIDE NAV FOR REPORTS */}
         <div className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0">
            <div className="p-6 space-y-1">
               {reportSections.map(rs => (
                  <button 
                    key={rs.id} 
                    onClick={() => setActiveTab(rs.id)} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-bold transition-all ${activeTab === rs.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                     <rs.icon className="w-4 h-4" />
                     {rs.label}
                  </button>
               ))}
            </div>
         </div>

         {/* MAIN REPORT GRID */}
         <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
            <div className="max-w-4xl space-y-10">
               <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-tight">{reportSections.find(s => s.id === activeTab)?.label}</h2>
                  <p className="text-sm text-gray-400 font-medium">Analyze your business performance with detailed metrics and summaries.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(activeTab === 'inventory' ? inventoryReports : salesReports).map((report, idx) => (
                     <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: idx * 0.05 }}
                        className="group bg-white rounded-xl border border-gray-100 p-6 hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer flex items-start gap-5"
                     >
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                           <report.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight mb-1">{report.title}</h3>
                           <p className="text-[12px] text-gray-400 leading-relaxed group-hover:text-gray-500 transition-colors">{report.description}</p>
                           <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Generate Report</span>
                              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

// Missing imports fix
import { Wallet, CreditCard } from 'lucide-react';
