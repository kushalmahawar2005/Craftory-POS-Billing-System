'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, FileText, Bell, Printer, Globe, Users, Shield, CreditCard, Save, Loader2, CheckCircle2, Download, Database } from 'lucide-react';

const settingsSections = [
  { id: 'store', label: 'Store Profile', icon: Store },
  { id: 'tax', label: 'Tax & GST', icon: FileText },
  { id: 'receipt', label: 'Receipt Template', icon: Printer },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data Management', icon: Database },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('store');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shopData, setShopData] = useState({
    name: '', businessType: '', address: '', city: '', state: '', pincode: '', phone: '', email: '',
    gstin: '', regType: 'Regular', defaultGstRate: '18', legalName: '', tradeName: '',
    receiptHeader: '', receiptFooter: '', paperSize: '80mm', showLogo: true, showGst: true,
    requirePINForRefunds: false, sessionTimeout: 30, twoFactorEnabled: false,
    emailAlerts: true, lowStockAlerts: true, dailySalesReports: false, whatsappAlerts: true
  });
  const [staff, setStaff] = useState<any[]>([]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings/shop');
      const shop = await res.json();
      
      if (shop && !shop.error) {
        const store = shop.stores?.[0];
        const prefs = shop.preferences;
        setShopData(prev => ({
          ...prev,
          name: shop.shopName || '',
          businessType: shop.businessType || '',
          email: shop.email || '',
          phone: shop.phone || '',
          address: store?.address || '',
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
          twoFactorEnabled: prefs?.twoFactorEnabled || false
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
    const target = section || activeSection;
    setIsSaving(true);
    setSaved(false);
    
    let url = '/api/settings/shop';
    if (target === 'tax') url = '/api/settings/gst';
    else if (target === 'receipt') url = '/api/settings/receipt';
    else if (target === 'security') url = '/api/settings/security';

    try {
      await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopData)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
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

  const inputClass = "w-full px-4 py-3 bg-page-bg border border-border/50 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-muted/50";
  const labelClass = "block text-[11px] font-black text-text-muted uppercase tracking-wider mb-2 px-1";

  return (
    <div className="space-y-6 font-[PlusJakartaSans]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Settings</h1>
          <p className="text-sm text-text-muted mt-0.5">Control your business configuration and security.</p>
        </div>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-4 py-2 bg-secondary-green/10 text-secondary-green rounded-xl text-xs font-bold ring-1 ring-secondary-green/20">
            <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
          </motion.div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <nav className="space-y-1 bg-white rounded-3xl border border-border p-3 shadow-sm sticky top-24">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button key={section.id} onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-xs font-bold transition-all ${activeSection === section.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-page-bg hover:text-text-primary'
                    }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              
              {/* Store Profile */}
              {activeSection === 'store' && (
                <div className="bg-white rounded-3xl p-8 border border-border shadow-sm space-y-8">
                  <header><h2 className="text-lg font-black text-text-primary tracking-tight">Store Profile</h2><p className="text-xs text-text-muted mt-1">Basic information about your business location.</p></header>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div><label className={labelClass}>Business Name</label><input type="text" className={inputClass} value={shopData.name} onChange={e => setShopData({ ...shopData, name: e.target.value })} /></div>
                    <div><label className={labelClass}>Business Type</label>
                      <select className={inputClass} value={shopData.businessType} onChange={e => setShopData({ ...shopData, businessType: e.target.value })}>
                        <option value="">Select Type</option>
                        <option>Kirana Store</option>
                        <option>Supermarket</option>
                        <option>Pharmacy</option>
                        <option>Restaurant</option>
                        <option>Clothing Store</option>
                      </select>
                    </div>
                  </div>
                  <div><label className={labelClass}>Full Address</label><input type="text" className={inputClass} value={shopData.address} onChange={e => setShopData({ ...shopData, address: e.target.value })} /></div>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div><label className={labelClass}>City</label><input type="text" className={inputClass} value={shopData.city} onChange={e => setShopData({ ...shopData, city: e.target.value })} /></div>
                    <div><label className={labelClass}>State</label><input type="text" className={inputClass} value={shopData.state} onChange={e => setShopData({ ...shopData, state: e.target.value })} /></div>
                    <div><label className={labelClass}>Pincode</label><input type="text" className={inputClass} value={shopData.pincode} onChange={e => setShopData({ ...shopData, pincode: e.target.value })} /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div><label className={labelClass}>Contact Phone</label><input type="tel" className={inputClass} value={shopData.phone} onChange={e => setShopData({ ...shopData, phone: e.target.value })} /></div>
                    <div><label className={labelClass}>Public Email</label><input type="email" className={inputClass} value={shopData.email} onChange={e => setShopData({ ...shopData, email: e.target.value })} /></div>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <button onClick={() => handleSave('store')} disabled={isSaving} className="flex items-center gap-2 px-8 py-4 bg-primary text-white text-xs font-black rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/10 disabled:opacity-50">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {isSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </div>
              )}

              {/* Tax & GST */}
              {activeSection === 'tax' && (
                <div className="bg-white rounded-3xl p-8 border border-border shadow-sm space-y-8">
                  <header><h2 className="text-lg font-black text-text-primary tracking-tight">Tax & GST Configuration</h2><p className="text-xs text-text-muted mt-1">Manage your tax registrations and default rates.</p></header>
                  <div className="space-y-6">
                     <div><label className={labelClass}>GSTIN Number</label><input type="text" className={inputClass} value={shopData.gstin} onChange={e => setShopData({ ...shopData, gstin: e.target.value })} placeholder="29ABCDE1234F1ZH" /></div>
                     <div className="grid sm:grid-cols-2 gap-6">
                        <div><label className={labelClass}>Registration Type</label>
                          <select className={inputClass} value={shopData.regType} onChange={e => setShopData({ ...shopData, regType: e.target.value })}>
                            <option>Regular</option><option>Composition</option>
                          </select>
                        </div>
                        <div><label className={labelClass}>Global GST Rate (%)</label>
                          <select className={inputClass} value={shopData.defaultGstRate} onChange={e => setShopData({ ...shopData, defaultGstRate: e.target.value })}>
                            <option value="18">18% (Standard)</option><option value="12">12%</option><option value="5">5%</option><option value="28">28%</option><option value="0">Exempted</option>
                          </select>
                        </div>
                     </div>
                     <div><label className={labelClass}>Legal Entity Name</label><input type="text" className={inputClass} value={shopData.legalName} onChange={e => setShopData({ ...shopData, legalName: e.target.value })} /></div>
                     <div className="pt-4 border-t border-border/50">
                        <button onClick={() => handleSave('tax')} disabled={isSaving} className="flex items-center gap-2 px-8 py-4 bg-primary text-white text-xs font-black rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/10">
                           <Save className="w-4 h-4" /> Save GST Details
                        </button>
                     </div>
                  </div>
                </div>
              )}

              {/* Receipt */}
              {activeSection === 'receipt' && (
                <div className="bg-white rounded-3xl p-8 border border-border shadow-sm space-y-8">
                  <header><h2 className="text-lg font-black text-text-primary tracking-tight">Receipt Customization</h2><p className="text-xs text-text-muted mt-1">Configure how your invoices look when printed.</p></header>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Invoice Header Text</label><textarea rows={2} className={inputClass + " resize-none"} value={shopData.receiptHeader} onChange={e => setShopData({ ...shopData, receiptHeader: e.target.value })} /></div>
                    <div><label className={labelClass}>Invoice Footer Text</label><textarea rows={2} className={inputClass + " resize-none"} value={shopData.receiptFooter} onChange={e => setShopData({ ...shopData, receiptFooter: e.target.value })} /></div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div><label className={labelClass}>Default Paper Size</label>
                        <select className={inputClass} value={shopData.paperSize} onChange={e => setShopData({ ...shopData, paperSize: e.target.value })}>
                          <option>80mm (Standard)</option><option>58mm (Small)</option><option>A4 (Full Page)</option>
                        </select>
                      </div>
                      <div className="flex flex-col justify-end gap-3 pb-1">
                         <label className="flex items-center gap-3 cursor-pointer group">
                           <input type="checkbox" checked={shopData.showLogo} onChange={e => setShopData({...shopData, showLogo: e.target.checked})} className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary/20" />
                           <span className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">Show Store Logo</span>
                         </label>
                         <label className="flex items-center gap-3 cursor-pointer group">
                           <input type="checkbox" checked={shopData.showGst} onChange={e => setShopData({...shopData, showGst: e.target.checked})} className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary/20" />
                           <span className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">Print GST Breakdown</span>
                         </label>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border/50">
                        <button onClick={() => handleSave('receipt')} disabled={isSaving} className="flex items-center gap-2 px-8 py-4 bg-primary text-white text-xs font-black rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/10">
                           <Save className="w-4 h-4" /> Save Template
                        </button>
                     </div>
                  </div>
                </div>
              )}

              {/* Users */}
              {activeSection === 'users' && (
                <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
                  <header className="p-8 border-b border-border flex items-center justify-between">
                    <div><h2 className="text-lg font-black text-text-primary tracking-tight">Staff Management</h2><p className="text-xs text-text-muted mt-1">Manage users and their access levels.</p></div>
                    <button onClick={() => window.location.href='/app/staff'} className="px-4 py-2 bg-primary/10 text-primary text-[11px] font-black rounded-xl hover:bg-primary hover:text-white transition-all">Add Staff Member</button>
                  </header>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-page-bg/50">
                        <tr className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
                          <th className="px-8 py-4">Name</th>
                          <th className="px-8 py-4">Email</th>
                          <th className="px-8 py-4">Role</th>
                          <th className="px-8 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {staff.map((user, i) => (
                          <tr key={i} className="hover:bg-page-bg/20 transition-colors">
                            <td className="px-8 py-4 font-bold text-sm text-text-primary">{user.name}</td>
                            <td className="px-8 py-4 text-xs text-text-muted">{user.email}</td>
                            <td className="px-8 py-4"><span className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded uppercase">{user.role}</span></td>
                            <td className="px-8 py-4"><span className="flex items-center gap-1.5 text-[10px] font-bold text-secondary-green"><div className="w-1.5 h-1.5 rounded-full bg-secondary-green" /> Active</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeSection === 'security' && (
                <div className="bg-white rounded-3xl p-8 border border-border shadow-sm space-y-8">
                  <header><h2 className="text-lg font-black text-text-primary tracking-tight">Security & Privacy</h2><p className="text-xs text-text-muted mt-1">Protect your store data and manage session policies.</p></header>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-page-bg/50 rounded-2xl border border-border/50">
                        <div><p className="text-sm font-bold text-text-primary">Require PIN for Refunds</p><p className="text-[11px] text-text-muted mt-0.5">Prompt for admin PIN when a cashier attempts a refund.</p></div>
                        <input type="checkbox" checked={shopData.requirePINForRefunds} onChange={e => setShopData({...shopData, requirePINForRefunds: e.target.checked})} className="sr-only peer" />
                        <label onClick={() => setShopData({...shopData, requirePINForRefunds: !shopData.requirePINForRefunds})} className="relative w-10 h-5 bg-gray-200 rounded-full cursor-pointer peer-checked:bg-primary transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></label>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                       <div><label className={labelClass}>Session Timeout (Minutes)</label><input type="number" className={inputClass} value={shopData.sessionTimeout} onChange={e => setShopData({...shopData, sessionTimeout: parseInt(e.target.value)})} /></div>
                       <div className="pt-2"><label className={labelClass}>Two-Factor Authentication</label>
                          <button 
                            onClick={() => setShopData({...shopData, twoFactorEnabled: !shopData.twoFactorEnabled})}
                            className={`w-full py-3 rounded-2xl text-[11px] font-black transition-all ${shopData.twoFactorEnabled ? 'bg-secondary-green/10 text-secondary-green border border-secondary-green/20' : 'bg-red-50 text-red-600 border border-red-100'}`}
                          >
                            {shopData.twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                          </button>
                       </div>
                    </div>
                    <div className="pt-4 border-t border-border/50">
                        <button onClick={() => handleSave('security')} disabled={isSaving} className="flex items-center gap-2 px-8 py-4 bg-primary text-white text-xs font-black rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/10">
                           <Save className="w-4 h-4" /> Save Security Policies
                        </button>
                     </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeSection === 'notifications' && (
                <div className="bg-white rounded-3xl p-8 border border-border shadow-sm space-y-8">
                  <header><h2 className="text-lg font-black text-text-primary tracking-tight">Notification Preferences</h2><p className="text-xs text-text-muted mt-1">Choose how and when you want to be notified.</p></header>
                  <div className="space-y-4">
                    {[
                      { id: 'emailAlerts', title: 'Email Notifications', desc: 'Receive security alerts and weekly summaries via email.' },
                      { id: 'lowStockAlerts', title: 'Low Stock Alerts', desc: 'Get notified when items fall below their reorder points.' },
                      { id: 'dailySalesReports', title: 'Daily Sales Report', desc: 'Receive a summary of today\'s performance at closing time.' },
                      { id: 'whatsappAlerts', title: 'WhatsApp Alerts', desc: 'Direct alerts for important business updates.' }
                    ].map(noti => (
                      <div key={noti.id} className="flex items-center justify-between p-6 bg-page-bg/50 rounded-2xl border border-border/50">
                        <div><p className="text-sm font-bold text-text-primary">{noti.title}</p><p className="text-[11px] text-text-muted mt-0.5">{noti.desc}</p></div>
                        <input type="checkbox" checked={(shopData as any)[noti.id]} onChange={() => {}} className="sr-only peer" />
                        <label onClick={() => setShopData({...shopData, [noti.id]: !(shopData as any)[noti.id]})} className="relative w-10 h-5 bg-gray-200 rounded-full cursor-pointer peer-checked:bg-primary transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></label>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <button onClick={() => handleSave('notifications')} disabled={isSaving} className="flex items-center gap-2 px-8 py-4 bg-primary text-white text-xs font-black rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20">
                      <Save className="w-4 h-4" /> Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Data Management */}
              {activeSection === 'data' && (
                <div className="bg-white rounded-3xl p-8 border border-border shadow-sm space-y-8">
                  <header><h2 className="text-lg font-black text-text-primary tracking-tight">Data Management & Backup</h2><p className="text-xs text-text-muted mt-1">Export your store data or perform system backups.</p></header>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-page-bg/50 rounded-2xl border border-border/50 space-y-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"><Download className="w-5 h-5 text-primary" /></div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">Full Store Backup</p>
                        <p className="text-[11px] text-text-muted mt-0.5">Download all products, sales, and customers in JSON format.</p>
                      </div>
                      <button onClick={() => handleBackup('json')} className="w-full py-3 bg-white border border-border text-[11px] font-black rounded-xl hover:bg-primary hover:text-white transition-all">Download JSON Backup</button>
                    </div>
                    <div className="p-6 bg-page-bg/50 rounded-2xl border border-border/50 space-y-4">
                      <div className="w-10 h-10 bg-secondary-green/10 rounded-xl flex items-center justify-center"><Database className="w-5 h-5 text-secondary-green" /></div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">Product Data (CSV)</p>
                        <p className="text-[11px] text-text-muted mt-0.5">Export your entire product inventory for Excel usage.</p>
                      </div>
                      <button onClick={() => handleBackup('csv')} className="w-full py-3 bg-white border border-border text-[11px] font-black rounded-xl hover:bg-secondary-green hover:text-white transition-all">Export Products CSV</button>
                    </div>
                  </div>
                  <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
                     <p className="text-xs font-bold text-red-600 mb-1">DANGER ZONE</p>
                     <p className="text-[11px] text-red-600/70 mb-4">Deleting your shop data is permanent and cannot be undone.</p>
                     <button className="px-6 py-2 bg-red-600 text-white text-[10px] font-black rounded-xl hover:bg-red-700 transition-all uppercase tracking-widest">Delete All Store Data</button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
