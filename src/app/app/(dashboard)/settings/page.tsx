'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, FileText, Bell, Printer, Globe, Users, Shield, CreditCard, Save, Loader2, CheckCircle2, Download, Database } from 'lucide-react';

const settingsSections = [
  { id: 'store', label: 'Store Profile', icon: Store },
  { id: 'tax', label: 'Tax & GST', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'receipt', label: 'Receipt Template', icon: Printer },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'backup', label: 'Database Backup', icon: Database },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('store');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shopData, setShopData] = useState({
    name: '', businessType: '', address: '', city: '', state: '', pincode: '', phone: '', email: '',
    gstin: '', regType: 'Regular', defaultGstRate: '18', legalName: '', tradeName: '',
    receiptHeader: 'Thank you for shopping with us!',
    receiptFooter: 'Visit again! | Exchange within 7 days',
    paperSize: '80mm', fontSize: 'Medium',
    showLogo: true, showGst: true
  });

  // Fetch shop settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/shop');
        const data = await res.json();
        if (data && data.shop) {
          const shop = data.shop;
          setShopData(prev => ({
            ...prev,
            name: shop.name || '',
            address: shop.address || '',
            phone: shop.phone || '',
            email: shop.email || '',
            gstin: shop.gstin || '',
            legalName: shop.legalName || '',
            tradeName: shop.tradeName || shop.name || '',
          }));
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      await fetch('/api/settings/shop', {
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

  const inputClass = "w-full px-4 py-3 bg-page-bg border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary shadow-inner transition-all";
  const labelClass = "block text-[11px] font-black text-text-muted uppercase tracking-wider mb-2";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Settings</h1>
          <p className="text-sm text-text-muted mt-0.5">Manage your business settings and preferences</p>
        </div>
        {saved && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 px-4 py-2 bg-secondary-green/10 text-secondary-green rounded-xl text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" /> Saved!
          </motion.div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 shrink-0">
          <nav className="space-y-1 lg:sticky lg:top-24 bg-white rounded-2xl border border-border p-2 shadow-sm">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button key={section.id} onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === section.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-page-bg'
                    }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div key={activeSection} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            {activeSection === 'store' && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-lg font-black text-text-primary mb-6 tracking-tight">Store Profile</h2>
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label className={labelClass}>Business Name</label><input type="text" className={inputClass} value={shopData.name} onChange={e => setShopData({ ...shopData, name: e.target.value })} /></div>
                    <div><label className={labelClass}>Business Type</label>
                      <select className={inputClass} value={shopData.businessType} onChange={e => setShopData({ ...shopData, businessType: e.target.value })}>
                        <option value="">Select Type</option>
                        <option>Retail Shop</option><option>Electronics Store</option><option>Grocery Store</option><option>Clothing Store</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div><label className={labelClass}>Address</label><input type="text" className={inputClass} value={shopData.address} onChange={e => setShopData({ ...shopData, address: e.target.value })} /></div>
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div><label className={labelClass}>City</label><input type="text" className={inputClass} value={shopData.city} onChange={e => setShopData({ ...shopData, city: e.target.value })} /></div>
                    <div><label className={labelClass}>State</label><input type="text" className={inputClass} value={shopData.state} onChange={e => setShopData({ ...shopData, state: e.target.value })} /></div>
                    <div><label className={labelClass}>Pincode</label><input type="text" className={inputClass} value={shopData.pincode} onChange={e => setShopData({ ...shopData, pincode: e.target.value })} /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label className={labelClass}>Phone</label><input type="tel" className={inputClass} value={shopData.phone} onChange={e => setShopData({ ...shopData, phone: e.target.value })} /></div>
                    <div><label className={labelClass}>Email</label><input type="email" className={inputClass} value={shopData.email} onChange={e => setShopData({ ...shopData, email: e.target.value })} /></div>
                  </div>
                  <button onClick={handleSave} disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white text-sm font-black rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'tax' && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-lg font-black text-text-primary mb-6 tracking-tight">Tax & GST Configuration</h2>
                <div className="space-y-5">
                  <div><label className={labelClass}>GSTIN</label><input type="text" className={inputClass} value={shopData.gstin} onChange={e => setShopData({ ...shopData, gstin: e.target.value })} maxLength={15} placeholder="29ABCDE1234F1ZH" /></div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label className={labelClass}>Registration Type</label>
                      <select className={inputClass} value={shopData.regType} onChange={e => setShopData({ ...shopData, regType: e.target.value })}>
                        <option>Regular</option><option>Composition</option>
                      </select>
                    </div>
                    <div><label className={labelClass}>Default GST Rate</label>
                      <select className={inputClass} value={shopData.defaultGstRate} onChange={e => setShopData({ ...shopData, defaultGstRate: e.target.value })}>
                        <option value="18">18%</option><option value="12">12%</option><option value="5">5%</option><option value="0">0%</option>
                      </select>
                    </div>
                  </div>
                  <div><label className={labelClass}>Legal Business Name</label><input type="text" className={inputClass} value={shopData.legalName} onChange={e => setShopData({ ...shopData, legalName: e.target.value })} /></div>
                  <div><label className={labelClass}>Trade Name</label><input type="text" className={inputClass} value={shopData.tradeName} onChange={e => setShopData({ ...shopData, tradeName: e.target.value })} /></div>
                  <button onClick={handleSave} disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white text-sm font-black rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Tax Settings
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-lg font-black text-text-primary mb-6 tracking-tight">Notification Preferences</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Daily sales summary', desc: 'Receive end-of-day sales report via email', default: true },
                    { label: 'Low stock alerts', desc: 'Get notified when products are running low', default: true },
                    { label: 'New order notifications', desc: 'Sound alert for every new sale', default: true },
                    { label: 'Payment reminders', desc: 'Send reminders for pending payments', default: false },
                    { label: 'Weekly analytics', desc: 'Weekly business performance report', default: true },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-page-bg/50 rounded-2xl border border-border/50">
                      <div>
                        <p className="text-sm font-bold text-text-primary">{notif.label}</p>
                        <p className="text-xs text-text-muted mt-0.5">{notif.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={notif.default} />
                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'receipt' && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-lg font-black text-text-primary mb-6 tracking-tight">Receipt Template</h2>
                <div className="space-y-5">
                  <div><label className={labelClass}>Header Text</label><input type="text" className={inputClass} value={shopData.receiptHeader} onChange={e => setShopData({ ...shopData, receiptHeader: e.target.value })} /></div>
                  <div><label className={labelClass}>Footer Text</label><input type="text" className={inputClass} value={shopData.receiptFooter} onChange={e => setShopData({ ...shopData, receiptFooter: e.target.value })} /></div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label className={labelClass}>Paper Size</label>
                      <select className={inputClass} value={shopData.paperSize} onChange={e => setShopData({ ...shopData, paperSize: e.target.value })}>
                        <option>80mm</option><option>58mm</option>
                      </select>
                    </div>
                    <div><label className={labelClass}>Font Size</label>
                      <select className={inputClass} value={shopData.fontSize} onChange={e => setShopData({ ...shopData, fontSize: e.target.value })}>
                        <option>Small</option><option>Medium</option><option>Large</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={shopData.showLogo} onChange={e => setShopData({ ...shopData, showLogo: e.target.checked })} className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20" />
                      <span className="text-sm font-bold text-text-primary">Show logo on receipt</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={shopData.showGst} onChange={e => setShopData({ ...shopData, showGst: e.target.checked })} className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20" />
                      <span className="text-sm font-bold text-text-primary">Show GST details</span>
                    </label>
                  </div>
                  <button onClick={handleSave} disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white text-sm font-black rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Template
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'backup' && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-lg font-black text-text-primary mb-6 tracking-tight">Database Backup & Export</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-page-bg rounded-lg border border-border/50">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">System Backup</p>
                      <p className="text-xs text-text-muted">Generate a full backup of your store data.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm font-semibold text-text-primary hover:bg-gray-50 transition-all">
                      <Download className="w-4 h-4" /> Download Backup
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-page-bg rounded-lg border border-border/50">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Product Database Export</p>
                      <p className="text-xs text-text-muted">Download a CSV of your entire catalog for bulk editing.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm font-semibold text-text-primary hover:bg-gray-50 transition-all">
                      <Download className="w-4 h-4" /> Export CSV
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-lg font-black text-text-primary mb-6 tracking-tight">Security Settings</h2>
                <div className="space-y-5">
                  <div><label className={labelClass}>Current Password</label><input type="password" className={inputClass} placeholder="Enter current password" /></div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label className={labelClass}>New Password</label><input type="password" className={inputClass} placeholder="Enter new password" /></div>
                    <div><label className={labelClass}>Confirm Password</label><input type="password" className={inputClass} placeholder="Confirm new password" /></div>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-page-bg/50 rounded-2xl border border-border/50">
                    <div>
                      <p className="text-sm font-bold text-text-primary">Two-Factor Authentication</p>
                      <p className="text-xs text-text-muted mt-0.5">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white text-sm font-black rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all active:scale-95">
                    <Save className="w-4 h-4" /> Update Security
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
