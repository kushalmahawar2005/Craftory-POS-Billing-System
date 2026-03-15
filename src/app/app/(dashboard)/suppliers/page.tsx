'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Truck, FileText, X, AlertTriangle } from 'lucide-react';

const initialSuppliers = [
  { id: 1, name: 'Metro Cash & Carry', contact: 'Rahul Singh', phone: '+91 9876543210', email: 'orders@metro.co.in', status: 'Active', activePos: 2 },
  { id: 2, name: 'Unilever Distributors', contact: 'Priya Patel', phone: '+91 9876543211', email: 'priya@unilever.dist.in', status: 'Active', activePos: 0 },
  { id: 3, name: 'Local Farm Fresh', contact: 'Amit Kumar', phone: '+91 9876543212', email: 'amit@localfarm.in', status: 'Inactive', activePos: 0 },
  { id: 4, name: 'National Spices Ltd', contact: 'Neha Sharma', phone: '+91 9876543213', email: 'sales@natspices.in', status: 'Active', activePos: 1 },
];

const mockPOs = [
  { id: 'PO-2026-001', supplier: 'Metro Cash & Carry', date: '2026-03-14', total: 45000, status: 'Pending Delivery' },
  { id: 'PO-2026-002', supplier: 'Metro Cash & Carry', date: '2026-03-10', total: 12500, status: 'Partially Delivered' },
  { id: 'PO-2026-003', supplier: 'National Spices Ltd', date: '2026-03-15', total: 8400, status: 'Draft' },
];

export default function SuppliersPage() {
  const [search, setSearch] = useState('');
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);

  const filtered = suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.contact.toLowerCase().includes(search.toLowerCase()));
  const totalPos = mockPOs.length;
  
  const selectedData = suppliers.find(s => s.id === selectedSupplier);
  const supplierPOs = mockPOs.filter(po => po.supplier === selectedData?.name);

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" /> Suppliers & POs
          </h1>
          <p className="text-sm text-text-muted mt-1">{suppliers.length} suppliers managing {totalPos} active purchase orders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] transition-all">
          <Plus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Search suppliers by name or contact..." />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-sm font-semibold rounded-lg hover:bg-gray-50 text-text-primary transition-all">
          <FileText className="w-4 h-4" /> Create PO
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-page-bg border-b border-border/50 text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left py-4 px-5 font-bold">Supplier Name</th>
              <th className="text-left py-4 px-5 font-bold">Contact Person</th>
              <th className="text-left py-4 px-5 font-bold">Contact Info</th>
              <th className="text-center py-4 px-5 font-bold">Active POs</th>
              <th className="text-left py-4 px-5 font-bold">Status</th>
              <th className="text-right py-4 px-5 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filtered.map((supplier) => (
              <tr key={supplier.id} onClick={() => setSelectedSupplier(supplier.id)} className="hover:bg-primary/5 transition-colors cursor-pointer group">
                <td className="py-4 px-5 font-semibold text-text-primary flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {supplier.name.substring(0,2).toUpperCase()}
                  </div>
                  {supplier.name}
                </td>
                <td className="py-4 px-5 text-text-muted">{supplier.contact}</td>
                <td className="py-4 px-5">
                  <div className="text-text-primary">{supplier.phone}</div>
                  <div className="text-[10px] text-text-muted">{supplier.email}</div>
                </td>
                <td className="py-4 px-5 text-center">
                  {supplier.activePos > 0 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 font-bold rounded-full text-xs">
                      {supplier.activePos}
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-4 px-5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    supplier.status === 'Active' ? 'bg-secondary-green/10 text-secondary-green' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {supplier.status}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <button className="p-2 rounded hover:bg-primary/10 text-text-muted group-hover:text-primary transition-colors inline-block mr-1" onClick={(e) => { e.stopPropagation(); }}>
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded hover:bg-error/10 text-text-muted group-hover:text-error transition-colors inline-block" onClick={(e) => { e.stopPropagation(); }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-text-muted">No suppliers found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over for Supplier Details & POs */}
      <AnimatePresence>
        {selectedSupplier !== null && selectedData && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setSelectedSupplier(null)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-border"
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-page-bg/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                    {selectedData.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">{selectedData.name}</h2>
                    <p className="text-xs text-text-muted font-medium">{selectedData.status} Supplier</p>
                  </div>
                </div>
                <button onClick={() => setSelectedSupplier(null)} className="p-2 rounded-full hover:bg-gray-200 text-text-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Contact Info */}
                <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Contact Information</h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-muted">Contact Person</span>
                      <span className="font-semibold text-text-primary">{selectedData.contact}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-muted">Phone Number</span>
                      <span className="font-medium text-text-primary font-mono">{selectedData.phone}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-muted">Email Address</span>
                      <span className="font-medium text-text-primary">{selectedData.email}</span>
                    </div>
                  </div>
                </div>

                {/* Purchase Orders */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Purchase Orders</h3>
                    <button className="text-xs font-bold text-primary hover:underline">Create New PO</button>
                  </div>
                  
                  {supplierPOs.length > 0 ? (
                    <div className="space-y-3">
                      {supplierPOs.map(po => (
                        <div key={po.id} className="bg-white border border-border rounded-xl p-4 hover:border-primary/30 transition-colors cursor-pointer group shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold font-mono text-text-primary text-sm group-hover:text-primary transition-colors">{po.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              po.status === 'Draft' ? 'bg-gray-100 text-gray-600' :
                              po.status === 'Pending Delivery' ? 'bg-amber-100 text-amber-700' :
                              'bg-green-100 text-green-700'
                            }`}>{po.status}</span>
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-xs text-text-muted">Date: {po.date}</span>
                            <span className="font-bold text-text-primary">₹{po.total.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                      <AlertTriangle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-text-muted">No purchase orders found</p>
                      <button className="mt-2 text-xs font-bold text-primary">Create the first PO</button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
