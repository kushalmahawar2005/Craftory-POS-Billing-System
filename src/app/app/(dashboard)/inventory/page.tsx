'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Package, AlertTriangle, TrendingDown, Loader2, History, ArrowUpCircle, ArrowDownCircle, RefreshCw, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Log {
  id: string;
  changeType: string;
  quantity: number;
  reason?: string | null;
  createdAt: string;
  product?: { name: string; barcode?: string | null } | null;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'inventory' | 'logs'>('inventory');
  const [isLoading, setIsLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products?q=${search}&limit=100`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch('/api/inventory/logs?limit=50');
      const data = await res.json();
      setLogs(data.logs || data || []);
    } catch (e) { console.error(e); }
    finally { setLogsLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(fetchInventory, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab]);

  const getStatus = (stock: number) => {
    if (stock <= 0) return { label: 'Out of Stock', color: 'bg-red-100 text-error' };
    if (stock <= 10) return { label: 'Low Stock', color: 'bg-amber-100 text-accent-amber' };
    return { label: 'In Stock', color: 'bg-green-100 text-secondary-green' };
  };

  const filtered = products.filter(item => {
    const status = getStatus(item.stockQuantity).label;
    if (filter === 'all') return true;
    if (filter === 'low') return status === 'Low Stock';
    if (filter === 'out') return status === 'Out of Stock';
    return true;
  });

  const lowStockCount = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10).length;
  const outStockCount = products.filter(p => p.stockQuantity <= 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);

  const logTypeConfig: Record<string, { label: string; color: string; icon: any }> = {
    ADD: { label: 'Stock Added', color: 'text-secondary-green bg-secondary-green/10', icon: ArrowUpCircle },
    REMOVE: { label: 'Stock Removed', color: 'text-error bg-error/10', icon: ArrowDownCircle },
    ADJUST: { label: 'Adjusted', color: 'text-primary bg-primary/10', icon: RefreshCw },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-800">Stock Inventory</h1>
          <span className="text-sm text-gray-400">({products.length})</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAlerts(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Bell className={`w-3.5 h-3.5 ${lowStockCount + outStockCount > 0 ? 'text-orange-500' : ''}`} /> Alerts
          </button>
          <button onClick={() => window.location.href = '/app/products'}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Items
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {[
          { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-500 bg-blue-50' },
          { label: 'Low Stock', value: lowStockCount, icon: AlertTriangle, color: 'text-orange-500 bg-orange-50' },
          { label: 'Out of Stock', value: outStockCount, icon: TrendingDown, color: 'text-red-500 bg-red-50' },
          { label: 'Total Value', value: `₹${totalValue.toLocaleString('en-IN')}`, icon: Package, color: 'text-purple-500 bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white border border-border rounded-xl w-fit">
        {[
          { id: 'inventory', label: 'Stock Table', icon: Package },
          { id: 'logs', label: 'Change History', icon: History },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-page-bg'
              }`}>
            <tab.icon className="w-3.5 h-3.5" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'inventory' && (
        <>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="Search products by name or barcode..." />
            </div>
            <div className="flex gap-1.5 p-1 bg-white border border-border rounded-xl w-full sm:w-auto">
              {[{ id: 'all', label: 'All' }, { id: 'low', label: 'Low Stock' }, { id: 'out', label: 'Out' }].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f.id ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-page-bg'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-page-bg/50 border-b border-border/50">
                    <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Product Info</th>
                    <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Category</th>
                    <th className="text-right py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Current Stock</th>
                    <th className="text-right py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Price</th>
                    <th className="text-center py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {isLoading && products.length === 0 ? (
                    <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" /></td></tr>
                  ) : filtered.map((item) => {
                    const status = getStatus(item.stockQuantity);
                    return (
                      <tr key={item.id} className="hover:bg-page-bg/20 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-bold text-text-primary">{item.name}</p>
                          <p className="text-[10px] text-text-muted uppercase font-black">{item.barcode || 'No Barcode'}</p>
                        </td>
                        <td className="py-4 px-6"><span className="text-[11px] font-bold text-text-muted">{item.category?.name || 'General'}</span></td>
                        <td className="py-4 px-6 text-right font-black text-text-primary">
                          {item.stockQuantity} <span className="text-[10px] text-text-muted">{item.unit}</span>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-primary">₹{item.price}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${status.color}`}>{status.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!isLoading && filtered.length === 0 && (
                <div className="py-20 text-center text-text-muted text-sm font-medium">No products match your current filters.</div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
            <div>
              <h2 className="font-black text-text-primary">Stock Change History</h2>
              <p className="text-xs text-text-muted mt-0.5">All ADD / REMOVE / ADJUST operations</p>
            </div>
            <button onClick={fetchLogs} className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
          <div className="divide-y divide-border/30">
            {logsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="py-16 text-center">
                <History className="w-10 h-10 text-text-muted/30 mx-auto mb-2" />
                <p className="text-sm font-medium text-text-muted">No inventory changes recorded yet</p>
              </div>
            ) : logs.map((log, i) => {
              const cfg = logTypeConfig[log.changeType] || logTypeConfig.ADJUST;
              const LogIcon = cfg.icon;
              return (
                <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="flex items-center justify-between px-6 py-4 hover:bg-page-bg/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.color}`}>
                      <LogIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary text-sm">{log.product?.name || 'Unknown Product'}</p>
                      <p className="text-xs text-text-muted">{log.reason || 'Manual adjustment'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 text-right">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${cfg.color}`}>
                      {log.changeType === 'ADD' ? '+' : log.changeType === 'REMOVE' ? '-' : '~'}{log.quantity} units
                    </span>
                    <div>
                      <p className="text-[11px] font-bold text-text-muted">
                        {new Date(log.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </p>
                      <p className="text-[10px] text-text-muted/70">
                        {new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inventory Alerts Slide-over Modal */}
      <AnimatePresence>
        {showAlerts && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setShowAlerts(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-border"
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-page-bg/50">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-accent-amber animate-bounce" /> Inventory Alerts
                </h2>
                <button onClick={() => setShowAlerts(false)} className="p-2 rounded-full hover:bg-gray-200 text-text-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <p className="text-sm text-text-muted mb-6">These products are falling below their required stock levels and need immediate reordering.</p>
                
                {products.filter(i => i.stockQuantity <= 10).map(item => (
                  <div key={item.id} className="bg-white border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-text-primary">{item.name}</h4>
                      <p className="text-xs text-text-muted mt-0.5">Barcode: {item.barcode || 'N/A'} | Category: {item.category?.name || 'General'}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.stockQuantity <= 0 ? 'bg-error text-white' :
                        'bg-amber-100 text-accent-amber'
                      }`}>
                        {item.stockQuantity} left
                      </span>
                      <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                        <RefreshCw className="w-3 h-3" /> Order More
                      </button>
                    </div>
                  </div>
                ))}

                {products.filter(i => i.stockQuantity <= 10).length === 0 && (
                  <div className="py-20 text-center">
                    <Package className="w-12 h-12 text-text-muted/20 mx-auto mb-3" />
                    <p className="text-sm font-medium text-text-muted">All stock levels are healthy!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
