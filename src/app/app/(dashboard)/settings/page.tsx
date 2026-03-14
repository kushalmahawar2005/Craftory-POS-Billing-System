'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, FileText, Bell, Printer, Globe, Users, Shield, CreditCard, Save } from 'lucide-react';

const settingsSections = [
  { id: 'store', label: 'Store Profile', icon: Store },
  { id: 'tax', label: 'Tax & GST', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'receipt', label: 'Receipt Template', icon: Printer },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('store');
  const inputClass = "w-full px-4 py-2.5 bg-input-bg border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";
  const labelClass = "block text-sm font-medium text-text-primary mb-1.5";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-0.5">Manage your business settings and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 shrink-0">
          <nav className="space-y-0.5 lg:sticky lg:top-24">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button key={section.id} onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === section.id ? 'bg-primary-light text-primary' : 'text-text-muted hover:bg-gray-50'
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
              <div className="bg-white rounded-xl p-6 border border-border/50">
                <h2 className="text-lg font-bold text-text-primary mb-6">Store Profile</h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Business Name</label><input type="text" className={inputClass} defaultValue="Demo Electronics" /></div>
                    <div><label className={labelClass}>Business Type</label><select className={inputClass}><option>Electronics Store</option><option>Retail Shop</option></select></div>
                  </div>
                  <div><label className={labelClass}>Address</label><input type="text" className={inputClass} defaultValue="123 MG Road, Hyderabad" /></div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div><label className={labelClass}>City</label><input type="text" className={inputClass} defaultValue="Hyderabad" /></div>
                    <div><label className={labelClass}>State</label><input type="text" className={inputClass} defaultValue="Telangana" /></div>
                    <div><label className={labelClass}>Pincode</label><input type="text" className={inputClass} defaultValue="500001" /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Phone</label><input type="tel" className={inputClass} defaultValue="+91 98765 43210" /></div>
                    <div><label className={labelClass}>Email</label><input type="email" className={inputClass} defaultValue="demo@craftorypos.com" /></div>
                  </div>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark shadow-md transition-all">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'tax' && (
              <div className="bg-white rounded-xl p-6 border border-border/50">
                <h2 className="text-lg font-bold text-text-primary mb-6">Tax & GST Configuration</h2>
                <div className="space-y-4">
                  <div><label className={labelClass}>GSTIN</label><input type="text" className={inputClass} defaultValue="29ABCDE1234F1ZH" maxLength={15} /></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Registration Type</label><select className={inputClass}><option>Regular</option><option>Composition</option></select></div>
                    <div><label className={labelClass}>Default GST Rate</label><select className={inputClass}><option>18%</option><option>12%</option><option>5%</option><option>0%</option></select></div>
                  </div>
                  <div><label className={labelClass}>Legal Business Name</label><input type="text" className={inputClass} defaultValue="Demo Electronics Pvt. Ltd." /></div>
                  <div><label className={labelClass}>Trade Name</label><input type="text" className={inputClass} defaultValue="Demo Electronics" /></div>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark shadow-md transition-all">
                    <Save className="w-4 h-4" /> Save Tax Settings
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-white rounded-xl p-6 border border-border/50">
                <h2 className="text-lg font-bold text-text-primary mb-6">Notification Preferences</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Daily sales summary', desc: 'Receive end-of-day sales report via email', default: true },
                    { label: 'Low stock alerts', desc: 'Get notified when products are running low', default: true },
                    { label: 'New order notifications', desc: 'Sound alert for every new sale', default: true },
                    { label: 'Payment reminders', desc: 'Send reminders for pending payments', default: false },
                    { label: 'Weekly analytics', desc: 'Weekly business performance report', default: true },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-page-bg rounded-lg border border-border/50">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{notif.label}</p>
                        <p className="text-xs text-text-muted">{notif.desc}</p>
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
              <div className="bg-white rounded-xl p-6 border border-border/50">
                <h2 className="text-lg font-bold text-text-primary mb-6">Receipt Template</h2>
                <div className="space-y-4">
                  <div><label className={labelClass}>Header Text</label><input type="text" className={inputClass} defaultValue="Thank you for shopping with us!" /></div>
                  <div><label className={labelClass}>Footer Text</label><input type="text" className={inputClass} defaultValue="Visit again! | Exchange within 7 days" /></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Paper Size</label><select className={inputClass}><option>80mm</option><option>58mm</option></select></div>
                    <div><label className={labelClass}>Font Size</label><select className={inputClass}><option>Small</option><option>Medium</option><option>Large</option></select></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20" />
                      <span className="text-sm text-text-primary">Show logo on receipt</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20" />
                      <span className="text-sm text-text-primary">Show GST details</span>
                    </label>
                  </div>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark shadow-md transition-all">
                    <Save className="w-4 h-4" /> Save Template
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'users' && (
              <div className="bg-white rounded-xl p-6 border border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-text-primary">User Management</h2>
                  <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark">+ Add User</button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Demo User', email: 'demo@craftorypos.com', role: 'Owner', status: 'Active' },
                    { name: 'Cashier 1', email: 'cashier1@craftorypos.com', role: 'Cashier', status: 'Active' },
                    { name: 'Manager', email: 'manager@craftorypos.com', role: 'Manager', status: 'Inactive' },
                  ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-page-bg rounded-lg border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{user.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                          <p className="text-xs text-text-muted">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-primary-light text-primary rounded-full text-[10px] font-semibold">{user.role}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${user.status === 'Active' ? 'bg-green-50 text-secondary-green' : 'bg-gray-100 text-text-muted'}`}>{user.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="bg-white rounded-xl p-6 border border-border/50">
                <h2 className="text-lg font-bold text-text-primary mb-6">Security Settings</h2>
                <div className="space-y-4">
                  <div><label className={labelClass}>Change Password</label><input type="password" className={inputClass} placeholder="Current password" /></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><input type="password" className={inputClass} placeholder="New password" /></div>
                    <div><input type="password" className={inputClass} placeholder="Confirm new password" /></div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-page-bg rounded-lg border border-border/50">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Two-Factor Authentication</p>
                      <p className="text-xs text-text-muted">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark shadow-md transition-all">
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
