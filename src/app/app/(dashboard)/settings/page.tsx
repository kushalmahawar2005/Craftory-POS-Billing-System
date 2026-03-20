'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, FileText, Bell, Printer, Users, Shield, Save, Loader2, CheckCircle2,
  Download, Database, Search, ChevronDown, ChevronRight, Building2, MapPin,
  UserCog, CreditCard, Receipt, Settings2, Package, ShoppingCart, Truck,
  Upload, ImageIcon, Plus, Trash2, Eye, UserPlus, Mail, Box, BarChart3, MessageSquare
} from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';

// ─── Indian states list ─────────────────────────────────
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

const businessTypes = [
  'Food & Beverage', 'Kirana Store', 'General Store', 'Supermarket', 'Pharmacy',
  'Restaurant / Cafe', 'Clothing & Apparel', 'Electronics', 'Hardware',
  'Stationery', 'Cosmetics & Beauty', 'Mobile & Accessories', 'Other',
];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get('tab') || 'profile';

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [staff, setStaff] = useState<any[]>([]);

  const [shopData, setShopData] = useState({
    name: '', businessType: '', businessLocation: 'India',
    phone: '', email: '', website: '',
    address1: '', address2: '', city: '', state: '', pincode: '',
    gstin: '', regType: 'Regular', defaultGstRate: '18', legalName: '', tradeName: '',
    receiptHeader: '', receiptFooter: '', paperSize: '80mm', showLogo: true, showGst: true,
    requirePINForRefunds: false, sessionTimeout: 30, twoFactorEnabled: false,
    emailAlerts: true, lowStockAlerts: true, dailySalesReports: false, whatsappAlerts: true,
    logoUrl: '',
  });

  const [shopId, setShopId] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings/shop');
      const shop = await res.json();

      if (shop && !shop.error) {
        const store = shop.stores?.[0];
        const prefs = shop.preferences;
        setShopId(shop.id || null);
        setShopData(prev => ({
          ...prev,
          name: shop.shopName || '',
          businessType: shop.businessType || '',
          email: shop.email || '',
          phone: shop.phone || '',
          address1: store?.address || '',
          city: store?.city || '',
          state: store?.state || '',
          pincode: store?.pincode || '',
          gstin: shop.gstin || '',
          regType: shop.gstRegistrationType || 'Regular',
          defaultGstRate: shop.defaultGSTRate?.toString() || '18',
          legalName: shop.gstLegalName || '',
          tradeName: shop.gstTradeName || shop.shopName || '',
          receiptHeader: prefs?.receiptHeader || '',
          receiptFooter: prefs?.receiptFooter || '',
          paperSize: prefs?.paperSize || '80mm',
          showLogo: prefs?.showLogo ?? true,
          showGst: prefs?.showGST ?? true,
          requirePINForRefunds: prefs?.requirePINForRefunds || false,
          sessionTimeout: prefs?.sessionTimeout || 30,
          twoFactorEnabled: prefs?.twoFactorEnabled || false,
        }));
      }

      const staffRes = await fetch('/api/staff');
      const staffData = await staffRes.json();
      setStaff(staffData || []);
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (section?: string) => {
    setIsSaving(true);
    setSaved(false);

    let url = '/api/settings/shop';
    const target = section || activeSection;
    if (['gst', 'tax-rates'].includes(target)) url = '/api/settings/gst';
    else if (['receipt-template', 'payment-methods'].includes(target)) url = '/api/settings/receipt';

    try {
      await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopData)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackup = async (format: 'json' | 'csv') => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/settings/backup?format=${format}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `craftory_backup_${new Date().toISOString().split('T')[0]}.${format === 'json' ? 'json' : 'zip'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      alert('Backup failed');
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Zoho-style form input classes ────────────────────
  const inputClass = "w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400";
  const selectClass = "w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none";
  const labelClass = "block text-sm font-medium text-text-primary mb-1.5";
  const labelRequired = "text-red-500 ml-0.5";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-3 bg-secondary-green text-white rounded-xl text-sm font-bold shadow-xl"
          >
            <CheckCircle2 className="w-4 h-4" />
            Changes saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
        >
          {/* ─── BUSINESS PROFILE ─── */}
          {activeSection === 'profile' && (
            <div className="space-y-10 pb-10">
              <div className="flex items-center justify-between mb-8 overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-blue-500/5">
                <div className="px-8 py-6 flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Store className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-gray-900 leading-none">Business Profile</h1>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                       {shopData.name || 'Setup your store identity'} 
                       {shopId && <span className="text-gray-200">|</span>}
                       {shopId && <span className="lowercase font-medium">#{shopId.slice(0, 12)}</span>}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm space-y-10">
                {/* Visual Identity Section */}
                <div className="flex flex-col md:flex-row gap-12">
                   <div className="w-full md:w-64 shrink-0 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand Mark</h3>
                      </div>
                      <div className="relative group">
                         <div className="bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 p-8 text-center hover:border-blue-200 transition-all cursor-pointer">
                            <ImageUpload
                              currentImage={shopData.logoUrl}
                              onUpload={(url: string) => setShopData({ ...shopData, logoUrl: url })}
                              onDelete={() => setShopData({ ...shopData, logoUrl: '' })}
                            />
                            {!shopData.logoUrl && (
                              <div className="mt-4">
                                <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Store Logo</p>
                                <p className="text-[9px] text-gray-400 mt-2 font-medium">PNG or JPG, Max 1MB</p>
                              </div>
                            )}
                         </div>
                      </div>
                   </div>

                   <div className="flex-1 space-y-8">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Core Information</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className={labelClass}>Business Name <span className="text-red-500">*</span></label>
                          <input type="text" className={inputClass + " font-bold text-gray-900"} value={shopData.name} onChange={e => setShopData({ ...shopData, name: e.target.value })} placeholder="e.g. Zylker Global" />
                        </div>
                        <div>
                          <label className={labelClass}>Business Category <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <select className={selectClass + " font-bold text-gray-900"} value={shopData.businessType} onChange={e => setShopData({ ...shopData, businessType: e.target.value })}>
                              <option value="">Select Type</option>
                              {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>Primary Mobile <span className="text-red-500">*</span></label>
                          <input type="tel" className={inputClass} value={shopData.phone} onChange={e => setShopData({ ...shopData, phone: e.target.value })} placeholder="+91 00000 00000" />
                        </div>
                        <div>
                          <label className={labelClass}>Email Address</label>
                          <input type="email" className={inputClass} value={shopData.email} onChange={e => setShopData({ ...shopData, email: e.target.value })} placeholder="business@email.com" />
                        </div>
                      </div>
                   </div>
                </div>

                {/* Address Section */}
                <div className="pt-10 border-t border-gray-50 space-y-8">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="col-span-2">
                      <label className={labelClass}>Store Address Line</label>
                      <input type="text" className={inputClass} value={shopData.address1} onChange={e => setShopData({ ...shopData, address1: e.target.value })} placeholder="Building No, Street, Landmark" />
                    </div>
                    <div>
                      <label className={labelClass}>State / Province</label>
                      <div className="relative">
                        <select className={selectClass} value={shopData.state} onChange={e => setShopData({ ...shopData, state: e.target.value })}>
                          <option value="">Select State</option>
                          {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                       <div>
                          <label className={labelClass}>ZIP Code</label>
                          <input type="text" className={inputClass} value={shopData.pincode} onChange={e => setShopData({ ...shopData, pincode: e.target.value })} placeholder="000 000" />
                       </div>
                       <div>
                          <label className={labelClass}>City</label>
                          <input type="text" className={inputClass} value={shopData.city} onChange={e => setShopData({ ...shopData, city: e.target.value })} placeholder="City Name" />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Save Interaction */}
                <div className="pt-8 flex justify-end">
                   <button
                    onClick={() => handleSave('profile')}
                    disabled={isSaving}
                    className="px-12 py-4 bg-blue-600 text-white text-[13px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 flex items-center gap-3"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSaving ? 'Processing...' : 'Sync Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── LOCATIONS ─── */}
          {activeSection === 'locations' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-text-primary">Store Locations</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-all">
                  <Plus className="w-4 h-4" /> Add Location
                </button>
              </div>
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="p-6 flex items-center gap-4 border-b border-border/50">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-text-primary">{shopData.name || 'Main Store'}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {[shopData.address1, shopData.city, shopData.state, shopData.pincode].filter(Boolean).join(', ') || 'No address set'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-secondary-green/10 text-secondary-green text-[10px] font-bold rounded-full uppercase">Primary</span>
                </div>
                <div className="p-12 text-center text-sm text-text-muted">
                  <MapPin className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="font-medium">Multi-location support coming soon</p>
                  <p className="text-xs mt-1">You&apos;ll be able to manage multiple store branches from here.</p>
                </div>
              </div>
            </div>
          )}

          {/* ─── USERS ─── */}
          {activeSection === 'users' && (
            <div className="space-y-10 pb-10">
              <div className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-blue-500/5">
                <div className="px-8 py-6 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/20">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-black text-gray-900 leading-none">User Management</h1>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2">{staff.length} Active System Users</p>
                    </div>
                  </div>
                  <button onClick={() => window.location.href='/app/staff'} className="px-6 py-3.5 bg-purple-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Personnel Hub
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-50">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Identity</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Access Role</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {staff.map((user, i) => (
                      <tr key={i} className="hover:bg-blue-50/20 transition-all group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-blue-600 text-xs">
                                 {user.name[0]}
                              </div>
                              <div>
                                <p className="text-[13px] font-black text-gray-900 leading-none">{user.name}</p>
                                <p className="text-[11px] text-gray-400 font-bold mt-1">{user.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-600 uppercase tracking-widest border border-gray-100 group-hover:bg-white group-hover:border-blue-100 group-hover:text-blue-600 transition-all">
                              {user.role}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Active</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── SUBSCRIPTION ─── */}
          {activeSection === 'subscription' && (
            <div className="space-y-10 pb-10">
               <div className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-blue-500/5">
                <div className="px-8 py-6 flex items-center gap-4 bg-gray-50/30">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <CreditCard className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-gray-900 leading-none">Subscription</h1>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2">Manage your plan and billing</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-125 transition-transform duration-700" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Current Operating Tier</p>
                    <h2 className="text-4xl font-black mt-3 flex items-center gap-4">
                       CRAFTORY FREE
                       <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-xl text-[10px] border border-white/10">PERPETUAL</span>
                    </h2>
                    <div className="mt-8 space-y-3">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-bold opacity-90">Up to 500 Inventory Skus</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-bold opacity-90">Core POS Terminal Access</span>
                       </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <button className="px-10 py-5 bg-white text-indigo-700 text-[13px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-black/10">
                        Upgrade Experience
                     </button>
                     <p className="text-center text-[10px] font-black uppercase tracking-widest opacity-60">Starting at ₹499 / Month</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── GST SETTINGS ─── */}
          {activeSection === 'gst' && (
            <div className="space-y-10 pb-10">
              <div className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-blue-500/5">
                <div className="px-8 py-6 flex items-center gap-4 bg-gray-50/30">
                  <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/20">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-gray-900 leading-none">GST Settings</h1>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2">Manage tax registration & default rates</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm space-y-10">
                <div className="space-y-8">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-green-600 rounded-full" />
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registration Details</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className={labelClass}>GSTIN Number</label>
                        <input type="text" className={inputClass + " font-black text-gray-900 tracking-wider"} value={shopData.gstin} onChange={e => setShopData({ ...shopData, gstin: e.target.value })} placeholder="29ABCDE1234F1ZH" />
                      </div>
                      <div>
                        <label className={labelClass}>Registration Type</label>
                        <div className="relative">
                          <select className={selectClass + " font-bold text-gray-900"} value={shopData.regType} onChange={e => setShopData({ ...shopData, regType: e.target.value })}>
                            <option>Regular</option>
                            <option>Composition</option>
                            <option>Unregistered</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="pt-10 border-t border-gray-50 space-y-8">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Business Legal Info</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className={labelClass}>Legal Entity Name</label>
                        <input type="text" className={inputClass} value={shopData.legalName} onChange={e => setShopData({ ...shopData, legalName: e.target.value })} placeholder="As per GST certificate" />
                      </div>
                      <div>
                        <label className={labelClass}>Trade Name</label>
                        <input type="text" className={inputClass} value={shopData.tradeName} onChange={e => setShopData({ ...shopData, tradeName: e.target.value })} placeholder="Business trade name" />
                      </div>
                   </div>
                </div>

                <div className="pt-10 border-t border-gray-50 space-y-8">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-orange-600 rounded-full" />
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing & Defaults</h3>
                   </div>

                   <div className="w-full md:w-1/2">
                      <label className={labelClass}>Default GST Rate (%)</label>
                      <div className="grid grid-cols-5 gap-2">
                        {['0', '5', '12', '18', '28'].map(rate => (
                          <button
                            key={rate}
                            onClick={() => setShopData({...shopData, defaultGstRate: rate})}
                            className={`py-3 px-1 text-xs font-black rounded-xl border transition-all ${
                              shopData.defaultGstRate === rate
                              ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20'
                              : 'bg-white border-gray-100 text-gray-400 hover:border-orange-200'
                            }`}
                          >
                            {rate}%
                          </button>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="pt-8 flex justify-end">
                   <button
                    onClick={() => handleSave('gst')}
                    disabled={isSaving}
                    className="px-12 py-4 bg-green-600 text-white text-[13px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-600/20 disabled:opacity-50 flex items-center gap-3"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSaving ? 'Processing...' : 'Save GST Details'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAX RATES ─── */}
          {activeSection === 'tax-rates' && (
            <div>
              <h1 className="text-xl font-bold text-text-primary mb-6">Tax Rates</h1>
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-page-bg/50 border-b border-border">
                    <tr className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                      <th className="px-6 py-3.5">Tax Name</th>
                      <th className="px-6 py-3.5">Rate</th>
                      <th className="px-6 py-3.5">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {[
                      { name: 'GST 5%', rate: '5%', type: 'CGST + SGST' },
                      { name: 'GST 12%', rate: '12%', type: 'CGST + SGST' },
                      { name: 'GST 18%', rate: '18%', type: 'CGST + SGST' },
                      { name: 'GST 28%', rate: '28%', type: 'CGST + SGST' },
                      { name: 'Exempt', rate: '0%', type: 'No Tax' },
                    ].map((tax, i) => (
                      <tr key={i} className="hover:bg-page-bg/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-sm text-text-primary">{tax.name}</td>
                        <td className="px-6 py-4 text-sm text-text-muted">{tax.rate}</td>
                        <td className="px-6 py-4 text-sm text-text-muted">{tax.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── RECEIPT TEMPLATE ─── */}
          {activeSection === 'receipt-template' && (
            <div>
              <h1 className="text-xl font-bold text-text-primary mb-6">Receipt Template</h1>
              <div className="bg-white rounded-xl border border-border p-6 space-y-5">
                <div>
                  <label className={labelClass}>Receipt Header Text</label>
                  <textarea rows={2} className={inputClass + " resize-none"} value={shopData.receiptHeader} onChange={e => setShopData({ ...shopData, receiptHeader: e.target.value })} placeholder="Enter header text for receipt" />
                </div>
                <div>
                  <label className={labelClass}>Receipt Footer Text</label>
                  <textarea rows={2} className={inputClass + " resize-none"} value={shopData.receiptFooter} onChange={e => setShopData({ ...shopData, receiptFooter: e.target.value })} placeholder="Enter footer text (e.g., Thank you!)" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Paper Size</label>
                    <div className="relative">
                      <select className={selectClass} value={shopData.paperSize} onChange={e => setShopData({ ...shopData, paperSize: e.target.value })}>
                        <option>80mm (Standard)</option>
                        <option>58mm (Small)</option>
                        <option>A4 (Full Page)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-end gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={shopData.showLogo} onChange={e => setShopData({...shopData, showLogo: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20" />
                      <span className="text-sm font-medium text-text-primary">Show Store Logo</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={shopData.showGst} onChange={e => setShopData({...shopData, showGst: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20" />
                      <span className="text-sm font-medium text-text-primary">Print GST Breakdown</span>
                    </label>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <button onClick={() => handleSave('receipt-template')} disabled={isSaving} className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Template
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── PAYMENT METHODS ─── */}
          {activeSection === 'payment-methods' && (
            <div>
              <h1 className="text-xl font-bold text-text-primary mb-6">Payment Methods</h1>
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                {['Cash', 'UPI', 'Credit/Debit Card', 'Net Banking', 'Wallet'].map((method, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-border/30 last:border-0 hover:bg-page-bg/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-text-primary">{method}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-secondary-green/10 text-secondary-green text-[10px] font-bold rounded-full uppercase">Enabled</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── NOTIFICATION PREFERENCES ─── */}
          {activeSection === 'alert-prefs' && (
            <div className="space-y-10 pb-10">
              <div className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-blue-500/5">
                <div className="px-8 py-6 flex items-center gap-4 bg-gray-50/30">
                  <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20">
                    <Bell className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-gray-900 leading-none">Security & Alerts</h1>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2">Coordinate system pulse & alerts</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-4">
                {[
                  { id: 'emailAlerts', title: 'Email Relay', desc: 'Secure alerts and weekly operational clusters.', icon: Mail },
                  { id: 'lowStockAlerts', title: 'Inventory Pulse', desc: 'Reorder alerts when stock deviates from reorder points.', icon: Box },
                  { id: 'dailySalesReports', title: 'Performance Matrix', desc: "Daily summary of terminal performance at EOD.", icon: BarChart3 },
                  { id: 'whatsappAlerts', title: 'Real-time Signal', desc: 'Critical business warnings via Direct Signal (WhatsApp).', icon: MessageSquare },
                ].map(noti => {
                  const isOn = (shopData as any)[noti.id];
                  const Icon = noti.icon;
                  return (
                    <div key={noti.id} className="flex items-center justify-between p-7 bg-gray-50/30 rounded-3xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/20 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">
                           <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-black text-gray-900 leading-none">{noti.title}</p>
                          <p className="text-[11px] text-gray-400 font-bold mt-2">{noti.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShopData({...shopData, [noti.id]: !isOn})}
                        className={`relative w-14 h-8 rounded-2xl transition-all ${isOn ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-lg shadow-sm transition-all duration-300 ${isOn ? 'left-8 rotate-180' : 'left-1.5'}`} />
                      </button>
                    </div>
                  );
                })}

                <div className="pt-8 flex justify-end">
                   <button
                    onClick={() => handleSave('notifications')}
                    disabled={isSaving}
                    className="px-10 py-4 bg-orange-600 text-white text-[13px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 disabled:opacity-50 flex items-center gap-3"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Store Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Placeholder for upcoming sections ─── */}
          {['inventory-prefs', 'units', 'sales-prefs', 'discounts', 'purchase-prefs'].includes(activeSection) && (
            <div>
              <h1 className="text-xl font-bold text-text-primary mb-6">
                {activeSection === 'inventory-prefs' && 'Inventory Preferences'}
                {activeSection === 'units' && 'Units of Measure'}
                {activeSection === 'sales-prefs' && 'Sales Preferences'}
                {activeSection === 'discounts' && 'Discounts'}
                {activeSection === 'purchase-prefs' && 'Purchase Preferences'}
              </h1>
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <Settings2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-sm font-semibold text-text-muted">Coming Soon</p>
                <p className="text-xs text-text-muted mt-1">This section is under development.</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
