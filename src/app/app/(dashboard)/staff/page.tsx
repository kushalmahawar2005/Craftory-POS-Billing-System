'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Plus, Filter, Mail, Phone, Shield, Edit2, Trash2, X, Loader2 } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Roles');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CASHIER',
    status: 'Active',
    password: ''
  });

  const formatRole = (role: string) => {
    switch (role) {
      case 'MANAGER': return 'Store Manager';
      case 'CASHIER': return 'Cashier';
      case 'INVENTORY_CLERK': return 'Inventory Clerk';
      case 'ADMIN': return 'Administrator';
      default: return role;
    }
  };

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/staff?q=${encodeURIComponent(search)}&role=${encodeURIComponent(filter)}`);
      if (!res.ok) throw new Error('Failed to fetch staff');
      const data = await res.json();
      setStaffList(data);
    } catch (e) {
      console.error(e);
      setError('Failed to load staff list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchStaff, 300);
    return () => clearTimeout(timer);
  }, [search, filter]);

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone || '',
      role: staff.role,
      status: staff.status,
      password: ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'CASHIER',
      status: 'Active',
      password: ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const url = editingStaff ? `/api/staff/${editingStaff.id}` : '/api/staff';
      const method = editingStaff ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save staff member');
      }

      setIsModalOpen(false);
      fetchStaff();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete staff');
      fetchStaff();
    } catch (e: any) {
      alert(e.message);
    }
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
              <option value="All Roles">All Roles</option>
              <option value="MANAGER">Store Manager</option>
              <option value="CASHIER">Cashier</option>
              <option value="INVENTORY_CLERK">Inventory Clerk</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
            <p className="text-sm text-text-muted">Loading staff members...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {staffList.map((staff, i) => (
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
                  <h3 className="font-bold text-text-primary truncate w-full px-2">{staff.name}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{formatRole(staff.role)}</p>
                  
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
                    <span>{staff.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50 text-xs text-text-muted">
                    <span>Joined {new Date(staff.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => handleEdit(staff)} className="p-1.5 rounded hover:bg-primary-light text-text-muted hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(staff.id)} className="p-1.5 rounded hover:bg-red-50 text-text-muted hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {!isLoading && staffList.length === 0 && (
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

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe" 
                    className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@craftorypos.com" 
                    className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 99999 00000" 
                    className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Role / Designation</label>
                  <select 
                    value={formData.role} 
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="MANAGER">Store Manager</option>
                    <option value="CASHIER">Cashier</option>
                    <option value="INVENTORY_CLERK">Inventory Clerk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Account Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    {editingStaff ? 'Change Password (optional)' : 'Set Password'}
                  </label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingStaff ? 'Leave empty to keep current' : 'Default: Staff@123'} 
                    className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                  />
                </div>

                <div className="p-6 border-t border-border bg-gray-50 flex gap-3 -mx-6 -mb-6 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-bold text-text-primary bg-white border border-border hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark shadow-md rounded-lg transition-colors flex items-center justify-center gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingStaff ? 'Save Changes' : 'Create Staff')}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
