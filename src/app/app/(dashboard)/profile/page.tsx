'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCog, Save, Loader2, CheckCircle2, Mail, Phone, Shield, Building2, User } from 'lucide-react';

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: '',
    shopName: '',
    subscriptionPlan: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/me');
        const data = await res.json();
        if (res.ok) {
          setProfileData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            role: data.role || 'User',
            status: data.status || 'Active',
            shopName: data.shop?.shopName || 'My Shop',
            subscriptionPlan: data.shop?.subscriptionPlan || 'FREE',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profileData.name.trim()) return alert('Name cannot be empty');
    
    setIsSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update profile');
      }
    } catch (e) {
      alert('Network error while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-blue-500">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="mt-4 text-sm font-bold text-gray-500 tracking-widest uppercase">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Success toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-xl text-sm font-bold shadow-xl shadow-green-500/20 shadow-green-500/20"
          >
            <CheckCircle2 className="w-5 h-5" />
            Profile updated successfully
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
        
        {/* Header Section */}
        <div className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-blue-500/5">
          <div className="px-8 py-8 flex items-center justify-between bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50" />
            
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 text-white font-black text-2xl">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 leading-none tracking-tight">Personal Identity</h1>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                   {profileData.role} Access 
                   <span className="text-gray-300">|</span> 
                   <span className="text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> {profileData.status}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm shadow-gray-200/50 space-y-10">
          
          <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
            <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
            <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Base Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClass}>Full Legal Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="text" className={inputClass + " pl-11"} value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} placeholder="John Doe" />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 line-through-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Primary Phone Number</label>
              <div className="relative">
                <input type="tel" className={inputClass + " pl-11"} value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} placeholder="+91 00000 00000" />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-gray-50 pb-4 pt-4">
            <div className="w-1.5 h-5 bg-orange-500 rounded-full" />
            <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Authentication & Security</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClass}>Login Email Address</label>
              <div className="relative group">
                <input type="email" disabled className={inputClass + " pl-11 bg-gray-50/50 text-gray-500 cursor-not-allowed border-gray-100"} value={profileData.email} />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                
                {/* Tooltip for read-only email */}
                <div className="absolute -top-10 left-0 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                   Email is bound to your root identity and cannot be changed here.
                   <div className="absolute -bottom-1 left-4 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Access Level</label>
              <div className="relative">
                <input type="text" disabled className={inputClass + " pl-11 bg-gray-50/50 text-gray-500 cursor-not-allowed border-gray-100 font-black"} value={profileData.role} />
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-gray-50 pb-4 pt-4">
            <div className="w-1.5 h-5 bg-purple-500 rounded-full" />
            <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Workspace Context</h3>
          </div>

          <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
                   <Building2 className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                   <p className="text-sm font-black text-gray-900">{profileData.shopName}</p>
                   <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">Bound Workspace</p>
                </div>
             </div>
             <div className="text-right">
                <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-purple-600 uppercase tracking-widest shadow-sm">
                   {profileData.subscriptionPlan} TIER
                </span>
             </div>
          </div>

          {/* Save Action */}
          <div className="pt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-10 py-4 bg-blue-600 text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 flex items-center gap-3 active:scale-95"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSaving ? 'Synchronizing...' : 'Save Profile Changes'}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
