'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Search, Filter, ChevronDown, CheckCircle2, 
  X, AlertCircle, Package, Truck, User, FileText,
  BarChart3, MoreVertical, Edit2, Trash2, Layers,
  LayoutGrid, List, ArrowUpRight, FolderOpen, Tag,
  ArrowRight, Download, FileUp, MoreHorizontal, Printer,
  Eye, Receipt, Calculator, Clock, Calendar, Globe, Target,
  RefreshCw, ClipboardCheck, Box, Send, MapPin, ClipboardList,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SaleOrder {
  id: string;
  invoiceNumber: string;
  total: number;
  status: string;
  orderStatus?: string;
  createdAt: string;
  paymentMethod: string;
  customer?: { name: string; phone?: string };
  staff?: { name: string };
  items?: any[];
}

export default function SalesOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<SaleOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [activeRowMenu, setActiveRowMenu] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sales?limit=500');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.sales || data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    setUpdatingStatus(id);
    try {
      const res = await fetch(`/api/sales/${id}/fulfillment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status })
      });
      if (res.ok) {
        // Update locally for instant feedback
        setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: status } : o));
        setActiveRowMenu(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update order status');
      }
    } catch (e) {
      console.error('Update status error:', e);
      alert('An error occurred while updating status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== id));
        setActiveRowMenu(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete order');
      }
    } catch (e) {
      console.error('Delete error:', e);
      alert('An error occurred while deleting');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCSV = () => {
    const csv = ['Date,Invoice#,Customer,Phone,Status,Payment Method,Total'];
    orders.forEach(o => {
      csv.push(`${new Date(o.createdAt).toLocaleDateString()},${o.invoiceNumber},${o.customer?.name || 'Walk-in'},${o.customer?.phone || 'N/A'},${o.orderStatus || 'PENDING'},${o.paymentMethod},${o.total}`);
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowHeaderMenu(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || 
      (order.customer?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.customer?.phone || '').includes(search);
    
    if (activeTab === 'ALL') return matchesSearch;
    return matchesSearch && order.orderStatus === activeTab;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => !o.orderStatus || o.orderStatus === 'PENDING').length,
    confirmed: orders.filter(o => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PACKING').length,
    shipped: orders.filter(o => o.orderStatus === 'SHIPPED').length,
    delivered: orders.filter(o => o.orderStatus === 'DELIVERED').length,
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f7f9]">
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 transition-all shadow-sm">
        <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Sales Orders</h1>
            <div className="h-4 w-px bg-gray-200 mx-1" />
            <span className="text-[11px] font-black text-gray-400 border border-gray-100 px-2 py-0.5 rounded uppercase tracking-widest">{stats.total} ORDERS</span>
        </div>
        
        <div className="flex items-center gap-2">
           <Link href="/app/pos" className="px-5 py-2.5 bg-[#1a6bdb] text-white text-[12px] font-black rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 uppercase tracking-wider active:scale-[0.95]">
              <Plus className="w-4 h-4" /> New Order
           </Link>
           <div className="relative">
             <button onClick={() => setShowHeaderMenu(!showHeaderMenu)} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm active:scale-95">
                <MoreVertical className="w-4 h-4" />
             </button>
             <AnimatePresence>
               {showHeaderMenu && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setShowHeaderMenu(false)} />
                   <motion.div
                     initial={{ opacity: 0, y: -5, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: -5, scale: 0.95 }}
                     className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden z-50 p-1.5"
                   >
                     <button onClick={() => { fetchOrders(); setShowHeaderMenu(false); }} className="w-full text-left px-4 py-2.5 text-[11px] font-black text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center gap-3 rounded-xl uppercase tracking-widest">
                       <RefreshCw className="w-4 h-4 text-gray-400" /> Sync Registry
                     </button>
                     <button onClick={handleExportCSV} className="w-full text-left px-4 py-2.5 text-[11px] font-black text-emerald-600 hover:bg-emerald-50 transition-all flex items-center gap-3 rounded-xl uppercase tracking-widest">
                       <FileUp className="w-4 h-4" /> Export CSV
                     </button>
                     <div className="h-px bg-gray-50 my-1 mx-2" />
                     <button onClick={() => { setShowAuditLog(true); setShowHeaderMenu(false); }} className="w-full text-left px-4 py-2.5 text-[11px] font-black text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center gap-3 rounded-xl uppercase tracking-widest">
                       <Calculator className="w-4 h-4 text-gray-400" /> Audit Logs
                     </button>
                   </motion.div>
                 </>
               )}
             </AnimatePresence>
           </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50/50">
         {[
           { label: 'Pending Pack', value: stats.pending, icon: Package, bgColor: 'bg-indigo-50', borderColor: 'border-indigo-100', iconColor: 'text-indigo-600', bottomColor: '#6366f1', filter: 'PENDING' },
           { label: 'Confirmed', value: stats.confirmed, icon: ClipboardCheck, bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100', iconColor: 'text-emerald-600', bottomColor: '#10b981', filter: 'CONFIRMED' },
           { label: 'In Transit', value: stats.shipped, icon: Truck, bgColor: 'bg-orange-50', borderColor: 'border-orange-100', iconColor: 'text-orange-600', bottomColor: '#f97316', filter: 'SHIPPED' },
           { label: 'Fulfilled', value: stats.delivered, icon: CheckCircle2, bgColor: 'bg-blue-50', borderColor: 'border-blue-100', iconColor: 'text-blue-600', bottomColor: '#3b82f6', filter: 'DELIVERED' },
         ].map((stat, i) => (
           <div 
             key={i} 
             onClick={() => setActiveTab(stat.filter)}
             className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer border-b-4"
             style={{ borderBottomColor: stat.bottomColor }}
           >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center border ${stat.borderColor} group-hover:scale-110 transition-transform`}>
                   <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <span className="text-2xl font-black text-gray-900 leading-none">{stat.value}</span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">{stat.label}</p>
           </div>
         ))}
      </div>

      {/* Filters & Search */}
      <div className="px-8 py-4 bg-white border-y border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
            {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-400 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative group w-full sm:w-[320px]">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
             <input 
               type="text" 
               value={search} 
               onChange={e => setSearch(e.target.value)} 
               placeholder="Find Order by Identity or Phone..." 
               className="w-full pl-11 pr-5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:bg-white focus:border-blue-500 transition-all outline-none shadow-inner" 
             />
          </div>
      </div>

      <div className="flex-1 p-0 overflow-y-auto no-scrollbar bg-white">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
             <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
             <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Hydrating Orders Register...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-20 text-center">
             <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-gray-100 shadow-inner">
                <ClipboardList className="w-10 h-10 text-gray-200" />
             </div>
             <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Registry Silent</h2>
             <p className="text-sm text-gray-400 mb-8 max-w-sm font-medium">Capture or import sales orders to start tracking your fulfillment pipeline.</p>
             <Link href="/app/pos" className="px-10 py-3.5 bg-[#1a6bdb] text-white text-[12px] font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2 uppercase tracking-widest active:scale-95">
                <Plus className="w-4 h-4" /> Initialize Order
             </Link>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
               <tr className="border-b border-gray-50">
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/30">Order Entity</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/30">Customer</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/30">Fulfillment Status</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/30 text-right">Valuation</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/30"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredOrders.map(order => (
                  <tr key={order.id} className="group hover:bg-blue-50/30 transition-all">
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-[1rem] bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-blue-600 transition-all shadow-sm">
                             <Box className="w-5 h-5 text-gray-300 group-hover:text-white" />
                           </div>
                           <div className="flex flex-col">
                             <span 
                               onClick={() => router.push(`/app/receipt?id=${order.id}`)}
                               className="text-[14px] font-black text-blue-600 group-hover:underline cursor-pointer"
                             >
                               {order.invoiceNumber}
                             </span>
                             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Captured {new Date(order.createdAt).toLocaleDateString()}</span>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <User className="w-4 h-4 text-gray-300" />
                           <div className="flex flex-col">
                             <span className="text-[14px] font-bold text-gray-900">{order.customer?.name || 'Walk-in Customer'}</span>
                             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{order.customer?.phone || 'ANONYMOUS'}</span>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 text-[10px] font-black rounded-xl border uppercase tracking-widest shadow-sm ${
                           order.orderStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                           order.orderStatus === 'PENDING' || !order.orderStatus ? 'bg-red-50 text-red-600 border-red-100' : 
                           order.orderStatus === 'SHIPPED' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                           order.orderStatus === 'CONFIRMED' || order.orderStatus === 'PACKING' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                           order.orderStatus === 'CANCELLED' ? 'bg-gray-100 text-gray-500 border-gray-200 line-through' :
                           'bg-indigo-50 text-indigo-600 border-indigo-100'
                        }`}>
                           {order.orderStatus || 'PENDING'}
                        </span>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <p className="text-[16px] font-black text-gray-900 tracking-tighter leading-none">₹{(order.total || 0).toLocaleString()}</p>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">{order.paymentMethod}</span>
                     </td>
                     <td className="px-8 py-6 text-right relative">
                        <div className="flex items-center justify-end gap-2">
                           <button onClick={() => setActiveRowMenu(activeRowMenu === order.id ? null : order.id)} className={`p-2.5 rounded-xl border transition-all ${activeRowMenu === order.id ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-900 hover:bg-white border-transparent hover:border-gray-100 shadow-sm'}`}>
                             <MoreVertical className="w-4 h-4" />
                           </button>
                           <AnimatePresence>
                             {activeRowMenu === order.id && (
                               <>
                                 <div className="fixed inset-0 z-40" onClick={() => setActiveRowMenu(null)} />
                                 <motion.div
                                   initial={{ opacity: 0, scale: 0.95, x: 10 }}
                                   animate={{ opacity: 1, scale: 1, x: 0 }}
                                   exit={{ opacity: 0, scale: 0.95, x: 10 }}
                                   className="absolute right-full top-1/2 -translate-y-1/2 mr-4 w-52 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden z-50 p-1.5"
                                 >
                                   {/* View Details */}
                                   <button 
                                     onClick={() => { router.push(`/app/receipt?id=${order.id}`); setActiveRowMenu(null); }}
                                     className="flex items-center gap-3 w-full px-4 py-3 text-[11px] font-black text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-xl uppercase tracking-widest"
                                   >
                                     <Eye className="w-4 h-4 text-blue-500" /> View Details
                                   </button>
                                   {/* Print */}
                                   <button 
                                     onClick={() => { router.push(`/app/receipt?id=${order.id}`); setActiveRowMenu(null); }}
                                     className="flex items-center gap-3 w-full px-4 py-3 text-[11px] font-black text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-xl uppercase tracking-widest"
                                   >
                                     <Printer className="w-4 h-4 text-gray-400" /> Print Invoice
                                   </button>
                                   <div className="h-px bg-gray-50 my-1 mx-2" />
                                   {/* Fulfillment Actions */}
                                   {order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED' && (
                                     <>
                                       {(!order.orderStatus || order.orderStatus === 'PENDING') && (
                                         <button 
                                           disabled={updatingStatus === order.id}
                                           onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                                           className="flex items-center gap-3 w-full px-4 py-3 text-[11px] font-black text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-xl uppercase tracking-widest disabled:opacity-50"
                                         >
                                           {updatingStatus === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4 text-indigo-500" />} Confirm Pack
                                         </button>
                                       )}
                                       {(order.orderStatus === 'CONFIRMED' || order.orderStatus === 'PACKING') && (
                                         <button 
                                           disabled={updatingStatus === order.id}
                                           onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                                           className="flex items-center gap-3 w-full px-4 py-3 text-[11px] font-black text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-xl uppercase tracking-widest disabled:opacity-50"
                                         >
                                           {updatingStatus === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4 text-orange-500" />} Init Shipping
                                         </button>
                                       )}
                                       {order.orderStatus === 'SHIPPED' && (
                                         <button 
                                           disabled={updatingStatus === order.id}
                                           onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                           className="flex items-center gap-3 w-full px-4 py-3 text-[11px] font-black text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-xl uppercase tracking-widest disabled:opacity-50"
                                         >
                                           {updatingStatus === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />} Mark Delivered
                                         </button>
                                       )}
                                       <div className="h-px bg-gray-50 my-1 mx-2" />
                                     </>
                                   )}
                                   {/* Delete */}
                                   <button 
                                     disabled={deletingId === order.id}
                                     onClick={() => handleDeleteOrder(order.id)}
                                     className="flex items-center gap-3 w-full px-4 py-3 text-[11px] font-black text-red-600 hover:bg-red-50 transition-all rounded-xl uppercase tracking-widest disabled:opacity-50"
                                   >
                                     {deletingId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
                                   </button>
                                 </motion.div>
                               </>
                             )}
                           </AnimatePresence>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-8 py-5 bg-white border-t border-gray-100 flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
         <div className="flex items-center gap-6">
            <span>Archive Index {filteredOrders.length} records</span>
            <div className="h-4 w-px bg-gray-200" />
            <span className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               Pulse Healthy
            </span>
         </div>
         <div className="flex items-center gap-4">
            <span className="text-gray-900 border-l border-gray-100 pl-6 flex items-center gap-3">
               Register Value: <span className="text-[14px] text-emerald-600 tracking-tighter font-black uppercase">₹{filteredOrders.reduce((a, b) => a + (b.total || 0), 0).toLocaleString()}</span>
            </span>
         </div>
      </div>

      {/* Audit Log Modal */}
      <AnimatePresence>
        {showAuditLog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowAuditLog(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[480px] bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-tight">Audit Log</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{orders.length} records tracked</p>
                  </div>
                </div>
                <button onClick={() => setShowAuditLog(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Summary */}
              <div className="px-6 py-4 border-b border-gray-50 grid grid-cols-4 gap-3">
                {[
                  { label: 'Pending', count: stats.pending, color: 'text-red-600 bg-red-50' },
                  { label: 'Confirmed', count: stats.confirmed, color: 'text-indigo-600 bg-indigo-50' },
                  { label: 'Shipped', count: stats.shipped, color: 'text-orange-600 bg-orange-50' },
                  { label: 'Delivered', count: stats.delivered, color: 'text-emerald-600 bg-emerald-50' },
                ].map((s, i) => (
                  <div key={i} className={`rounded-xl p-3 text-center ${s.color}`}>
                    <p className="text-lg font-black">{s.count}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-0">
                  {[...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order, idx) => (
                    <div key={order.id} className="flex gap-4 group">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 mt-1.5 ${
                          order.orderStatus === 'DELIVERED' ? 'bg-emerald-500 border-emerald-300' :
                          order.orderStatus === 'SHIPPED' ? 'bg-orange-500 border-orange-300' :
                          order.orderStatus === 'CONFIRMED' || order.orderStatus === 'PACKING' ? 'bg-indigo-500 border-indigo-300' :
                          order.orderStatus === 'CANCELLED' ? 'bg-gray-400 border-gray-300' :
                          'bg-red-500 border-red-300'
                        }`} />
                        {idx < orders.length - 1 && <div className="w-px flex-1 bg-gray-100 my-1" />}
                      </div>

                      {/* Content */}
                      <div className="pb-6 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[12px] font-black text-gray-900">{order.invoiceNumber}</p>
                          <span className={`px-2 py-0.5 text-[8px] font-black rounded-lg uppercase tracking-widest ${
                            order.orderStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' :
                            order.orderStatus === 'SHIPPED' ? 'bg-orange-50 text-orange-600' :
                            order.orderStatus === 'CONFIRMED' || order.orderStatus === 'PACKING' ? 'bg-indigo-50 text-indigo-600' :
                            order.orderStatus === 'CANCELLED' ? 'bg-gray-100 text-gray-500' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {order.orderStatus || 'PENDING'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">
                          {order.customer?.name || 'Walk-in'} • ₹{(order.total || 0).toLocaleString()} • {order.paymentMethod}
                        </p>
                        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-1">
                          {new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-400">No audit records yet</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 text-center">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Last synced • {new Date().toLocaleTimeString()}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
