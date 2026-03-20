'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Package, ShoppingCart, Truck, FileText, ChevronDown, Zap, X,
  AlertTriangle, CheckCircle2, TrendingUp, Eye, ArrowUpRight, 
  ArrowDownRight, Activity, Wallet, PieChart, Layers, 
  Target, Globe, BarChart3, Box, Users, Clock, History, 
  MousePointer2, ExternalLink, MoreVertical, Plus, ClipboardList
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────
interface DashboardData {
  salesActivity: {
    toBePacked: number;
    toBeShipped: number;
    toBeDelivered: number;
    toBeInvoiced: number;
  };
  inventorySummary: {
    quantityInHand: number;
    quantityToBeReceived: number;
  };
  itemDetails: {
    lowStockItems: number;
    allItemGroups: number;
    allItems: number;
    activeItems: number;
  };
  topSellingItems: Array<{ name: string; quantity: number; revenue: number }>;
  purchaseOrder: {
    quantityOrdered: number;
  };
  salesOrder: {
    channels: Array<{ name: string; pending: number; confirmed: number }>;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('This Month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, topRes, lowRes] = await Promise.all([
          fetch('/api/reports/analytics?type=summary').then(r => r.json()).catch(() => ({})),
          fetch('/api/reports/analytics?type=top_products').then(r => r.json()).catch(() => []),
          fetch('/api/reports/analytics?type=low_stock').then(r => r.json()).catch(() => []),
        ]);

        setData({
          salesActivity: {
            toBePacked: sumRes?.toBePacked || 0,
            toBeShipped: sumRes?.toBeShipped || 0,
            toBeDelivered: sumRes?.toBeDelivered || 0,
            toBeInvoiced: sumRes?.toBeInvoiced || 0,
          },
          inventorySummary: {
            quantityInHand: sumRes?.totalStock || 0,
            quantityToBeReceived: sumRes?.toBeReceived || 0,
          },
          itemDetails: {
            lowStockItems: lowRes?.length || 0,
            allItemGroups: sumRes?.totalCategories || 0,
            allItems: sumRes?.totalProducts || 0,
            activeItems: sumRes?.activeProducts || 0,
          },
          topSellingItems: (topRes || []).slice(0, 5),
          purchaseOrder: {
            quantityOrdered: sumRes?.quantityOrdered || 0,
          },
          salesOrder: {
            channels: [
              { name: 'Direct Sales', pending: sumRes?.pendingSales || 0, confirmed: sumRes?.confirmedSales || 0 },
            ],
          },
        });
      } catch (error) { console.error('Dashboard error:', error); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 h-full bg-[#f5f7f9] animate-pulse" />;

  const d = data!;

  return (
    <div className="flex flex-col h-full bg-[#f5f7f9]">
      <div className="mb-10">
         <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
         <p className="text-[13px] text-gray-500 mt-1">Status as of today, {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* ─── SALES ACTIVITY ─── */}
        <div className="col-span-12 md:col-span-8 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Sales Activity</h2>
              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">In the last 30 days</div>
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { count: d.salesActivity.toBePacked, label: 'TO BE PACKED', icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { count: d.salesActivity.toBeShipped, label: 'TO BE SHIPPED', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
                { count: d.salesActivity.toBeDelivered, label: 'TO BE DELIVERED', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { count: d.salesActivity.toBeInvoiced, label: 'TO BE INVOICED', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
                   <p className={`text-3xl font-bold ${item.color} mb-3 transition-transform group-hover:scale-110`}>{item.count}</p>
                   <div className="flex items-center gap-2 mb-2">
                      <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">{item.label}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* ─── INVENTORY SUMMARY ─── */}
        <div className="col-span-12 md:col-span-4 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
           <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-10">Inventory Summary</h2>
           <div className="space-y-12">
              <div className="flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">QUANTITY IN HAND</span>
                    <span className="text-2xl font-bold text-gray-800">{d.inventorySummary.quantityInHand}</span>
                 </div>
                 <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                    <History className="w-6 h-6 text-gray-400" />
                 </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-8">
                 <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">TO BE RECEIVED</span>
                    <span className="text-2xl font-bold text-gray-800">{d.inventorySummary.quantityToBeReceived}</span>
                 </div>
                 <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                    <Truck className="w-6 h-6 text-gray-400" />
                 </div>
              </div>
           </div>
        </div>

        {/* ─── PRODUCT DETAILS ─── */}
        <div className="col-span-12 md:col-span-4 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
           <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-8">Product Details</h2>
           <div className="space-y-6">
              <Link href="/app/products" className="flex items-center justify-between p-4 bg-red-50/30 rounded-xl border border-red-50 group hover:border-red-200 transition-all">
                 <span className="text-[13px] font-semibold text-gray-600">Low Stock Items</span>
                 <span className="text-lg font-bold text-red-600">{d.itemDetails.lowStockItems}</span>
              </Link>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                 <span className="text-[13px] font-semibold text-gray-600">Item Groups</span>
                 <span className="text-lg font-bold text-gray-800">{d.itemDetails.allItemGroups}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                 <span className="text-[13px] font-semibold text-gray-600">All Items</span>
                 <span className="text-lg font-bold text-gray-800">{d.itemDetails.allItems}</span>
              </div>
           </div>
        </div>

        {/* ─── TOP SELLING ITEMS ─── */}
        <div className="col-span-12 md:col-span-8 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Top Selling Items</h2>
              <button className="text-[11px] font-bold text-blue-600 hover:underline uppercase tracking-widest flex items-center gap-2 transition-all">
                 {timeFilter} <ChevronDown className="w-3.5 h-3.5" />
              </button>
           </div>
           <div className="space-y-1">
              {d.topSellingItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-500 border border-gray-200">{i + 1}</div>
                      <span className="text-[14px] font-semibold text-gray-700 tracking-tight">{item.name}</span>
                   </div>
                   <div className="text-right">
                      <p className="text-[13px] font-bold text-gray-800">{item.quantity} units</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">₹{item.revenue.toLocaleString()}</p>
                   </div>
                </div>
              ))}
              {d.topSellingItems.length === 0 && <div className="py-10 text-center text-gray-400 text-sm italic">No sales recorded this month.</div>}
           </div>
        </div>

        {/* ─── PURCHASE ORDER & CHANNELS ─── */}
        <div className="col-span-12 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                 <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-6">Purchase Order</h2>
                 <div className="flex items-center gap-6 p-6 bg-[#f8faff] rounded-2xl border border-blue-50">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50">
                       <ClipboardList className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Quantity Ordered</p>
                        <p className="text-3xl font-bold text-gray-800">{d.purchaseOrder.quantityOrdered}</p>
                    </div>
                 </div>
              </div>
              <div>
                 <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-6">Sales Order by Channels</h2>
                 <div className="space-y-4">
                    {d.salesOrder.channels.map((ch, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4">
                         <span className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">{ch.name}</span>
                         <div className="flex gap-4">
                            <div className="flex flex-col items-end">
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Confirmed</span>
                               <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg">{ch.confirmed}</span>
                            </div>
                            <div className="flex flex-col items-end">
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending</span>
                               <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg">{ch.pending}</span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
