'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Plus, Filter, Mail, Phone, Shield, Edit2, Trash2, X } from 'lucide-react';

const initialStaff = [
  { id: 1, name: 'Sunita Mehra', role: 'Store Manager', email: 'sunita@craftorypos.com', phone: '+91 98765 00001', status: 'Active', joinedDate: 'Jan 15, 2024' },
  { id: 2, name: 'Raj Kumar', role: 'Cashier', email: 'raj@craftorypos.com', phone: '+91 98765 00002', status: 'Active', joinedDate: 'Feb 10, 2024' },
  { id: 3, name: 'Priya Singh', role: 'Inventory Clerk', email: 'priya@craftorypos.com', phone: '+91 98765 00003', status: 'Active', joinedDate: 'Mar 01, 2024' },
  { id: 4, name: 'Amit Verma', role: 'Cashier', email: 'amit@craftorypos.com', phone: '+91 98765 00004', status: 'On Leave', joinedDate: 'Mar 15, 2024' },
];

export default function StaffPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Roles');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);

  const filteredStaff = initialStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(search.toLowerCase()) || staff.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All Roles' ? true : staff.role === filter;
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (staff: any) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Staff Management</h1>
          <p className="text-sm text-text-muted mt-0.5">Manage employee access, roles, and profiles.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] transition-all">
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search staff by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 cursor-pointer hover:border-primary/30 transition-all">
          <Filter className="w-4 h-4 text-text-muted" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-sm w-full outline-none text-text-primary cursor-pointer appearance-none pr-8"
          >
            <option>All Roles</option>
            <option>Store Manager</option>
            <option>Cashier</option>
            <option>Inventory Clerk</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStaff.map((staff, i) => (
          <motion.div 
            key={staff.id} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="p-5 border-b border-border/50 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-3 ring-4 ring-white shadow-sm">
                {staff.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="font-bold text-text-primary">{staff.name}</h3>
              <p className="text-xs text-text-muted mt-0.5">{staff.role}</p>
              
              <span className={`mt-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide inline-flex items-center gap-1.5 ${
                staff.status === 'Active' ? 'bg-secondary-green/10 text-secondary-green' : 'bg-amber-100 text-accent-amber'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Active' ? 'bg-secondary-green' : 'bg-accent-amber'}`} />
                {staff.status}
              </span>
            </div>
            
            <div className="p-4 space-y-3 bg-page-bg/30">
              <div className="flex items-center gap-3 text-sm text-text-muted group-hover:text-text-primary transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="truncate">{staff.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-muted group-hover:text-text-primary transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                <span>{staff.phone}</span>
              </div>
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50 text-xs text-text-muted">
                <span>Joined {staff.joinedDate}</span>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => handleEdit(staff)} className="p-1.5 rounded hover:bg-primary-light text-text-muted hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded hover:bg-red-50 text-text-muted hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredStaff.length === 0 && (
        <div className="py-12 text-center border-2 border-dashed border-border rounded-xl bg-white">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-text-primary">No staff members found</h3>
          <p className="text-sm text-text-muted mt-1">Try adjusting your search or role filters.</p>
        </div>
      )}
    </div>

      {/* Slide-over Modal for Add/Edit Staff */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-border"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-page-bg/50">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">{editingStaff ? 'Edit Staff Member' : 'Add New Staff'}</h2>
                  <p className="text-sm text-text-muted mt-1">{editingStaff ? 'Update employee details and access level.' : 'Grant access to a new team member.'}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-text-muted hover:text-text-primary hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
                  <input type="text" defaultValue={editingStaff?.name || ''} placeholder="e.g. John Doe" className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Email Address</label>
                  <input type="email" defaultValue={editingStaff?.email || ''} placeholder="john@craftorypos.com" className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Phone Number</label>
                  <input type="tel" defaultValue={editingStaff?.phone || ''} placeholder="+91 99999 00000" className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Role / Designation</label>
                  <select defaultValue={editingStaff?.role || 'Cashier'} className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <option>Store Manager</option>
                    <option>Cashier</option>
                    <option>Inventory Clerk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Account Status</label>
                  <select defaultValue={editingStaff?.status || 'Active'} className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-gray-50 flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-bold text-text-primary bg-white border border-border hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark shadow-md rounded-lg transition-colors">{editingStaff ? 'Save Changes' : 'Create Staff'}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
