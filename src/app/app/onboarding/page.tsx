'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, FileText, Package, ShoppingCart, Settings, ArrowRight, ArrowLeft,
  Upload, Check, Loader2
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Business Profile', icon: Store },
  { id: 2, title: 'GST Details', icon: FileText },
  { id: 3, title: 'Store Address', icon: Store },
  { id: 4, title: 'Preferences', icon: Settings },
  { id: 5, title: 'POS Settings', icon: ShoppingCart },
  { id: 6, title: 'Finish', icon: Check },
];

export default function OnboardingPage() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  const [onboardingData, setOnboardingData] = useState({
    businessName: '',
    businessType: '',
    ownerName: '',
    phone: '',
    email: '',
    gstRegistered: 'No',
    gstin: '',
    defaultGSTRate: 18,
    address: '',
    city: '',
    state: '',
    pincode: '',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    language: 'English',
    fiscalYearStart: 'APRIL',
    receiptTemplate: 'STANDARD',
    paperSize: '80mm',
    defaultPaymentMethod: 'CASH',
  });

  // Fetch existing onboarding data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/onboarding');
        if (!res.ok) return;
        const data = await res.json();

        if (data.onboardingCompleted) {
          window.location.href = '/app/dashboard';
          return;
        }

        setOnboardingData(prev => ({
          ...prev,
          ...data.step1,
          ...data.step2,
          ...data.step3,
          ...data.step4,
          ...data.step5,
        }));
      } catch (e) {
        console.error('Failed to load onboarding data:', e);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const saveStep = async (stepNumber: number) => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');

    // Extract data for the specific step
    let stepData: any = {};
    if (stepNumber === 1) {
      stepData = {
        businessName: onboardingData.businessName,
        businessType: onboardingData.businessType,
        ownerName: onboardingData.ownerName,
        phone: onboardingData.phone,
        email: onboardingData.email,
      };
    } else if (stepNumber === 2) {
      stepData = {
        gstRegistered: onboardingData.gstRegistered,
        gstin: onboardingData.gstin,
        defaultGSTRate: onboardingData.defaultGSTRate,
      };
    } else if (stepNumber === 3) {
      stepData = {
        address: onboardingData.address,
        city: onboardingData.city,
        state: onboardingData.state,
        pincode: onboardingData.pincode,
      };
    } else if (stepNumber === 4) {
      stepData = {
        currency: onboardingData.currency,
        timezone: onboardingData.timezone,
        language: onboardingData.language,
        fiscalYearStart: onboardingData.fiscalYearStart,
      };
    } else if (stepNumber === 5) {
      stepData = {
        receiptTemplate: onboardingData.receiptTemplate,
        paperSize: onboardingData.paperSize,
        defaultPaymentMethod: onboardingData.defaultPaymentMethod,
      };
    }

    try {
      const res = await fetch('/api/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: stepNumber, ...stepData }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSaveError(data.error || 'Failed to save');
        setSaving(false);
        return false;
      }

      setSaveSuccess(data.message || 'Saved!');
      setTimeout(() => setSaveSuccess(''), 2000);
      setSaving(false);
      return true;
    } catch {
      setSaveError('Network error. Please try again.');
      setSaving(false);
      return false;
    }
  };

  const handleSaveAndContinue = async () => {
    // Basic validation
    if (currentStep === 1) {
      if (!onboardingData.businessName.trim()) return setSaveError('Business name is required');
      if (!onboardingData.businessType) return setSaveError('Business type is required');
      if (!onboardingData.ownerName.trim()) return setSaveError('Owner name is required');
    }

    const success = await saveStep(currentStep);
    if (success && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = async () => {
    const success = await saveStep(6);
    if (success) {
      window.location.href = '/app/dashboard';
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const prev = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const inputClass = "w-full px-4 py-2.5 bg-input-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all";
  const labelClass = "block text-sm font-bold text-text-primary mb-1.5";

  if (loadingData) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-muted font-medium">Loading your setup...</p>
        </div>
      </div>
    );
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-page-bg font-[PlusJakartaSans]">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">Craftory<span className="text-primary">POS</span></span>
          </div>
          <span className="text-sm text-text-muted">Step {currentStep} of 6</span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-1">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${currentStep === step.id ? 'text-primary bg-primary/10' :
                    currentStep > step.id ? 'text-green-600' :
                      'text-text-muted'
                  }`}>
                  {currentStep > step.id ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <step.icon className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden md:inline">{step.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 rounded ${currentStep > step.id ? 'bg-green-600' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <AnimatePresence>
          {saveSuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm font-medium rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" /> {saveSuccess}
            </motion.div>
          )}
          {saveError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl">
              {saveError}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Business Profile */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-xl font-black text-text-primary mb-1">Business Profile</h2>
                <p className="text-sm text-text-muted mb-6">Tell us about your business.</p>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Business Name *</label>
                    <input type="text" className={inputClass} placeholder="e.g. Kumar Electronics" value={onboardingData.businessName}
                      onChange={e => setOnboardingData({ ...onboardingData, businessName: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Business Type *</label>
                    <select className={inputClass} value={onboardingData.businessType}
                      onChange={e => setOnboardingData({ ...onboardingData, businessType: e.target.value })}>
                      <option value="">Select type</option>
                      <option>Kirana Store</option>
                      <option>Supermarket</option>
                      <option>Pharmacy</option>
                      <option>Restaurant</option>
                      <option>Clothing Store</option>
                      <option>Electronics Store</option>
                      <option>General Store</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Owner Name *</label>
                    <input type="text" className={inputClass} placeholder="Full Name" value={onboardingData.ownerName}
                      onChange={e => setOnboardingData({ ...onboardingData, ownerName: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <input type="text" className={inputClass} value={onboardingData.phone}
                        onChange={e => setOnboardingData({ ...onboardingData, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <input type="email" className={inputClass} value={onboardingData.email} disabled />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: GST Details */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-xl font-black text-text-primary mb-1">GST Details</h2>
                <p className="text-sm text-text-muted mb-6">Setup tax configuration.</p>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Is your business registered for GST?</label>
                    <div className="flex gap-3 mt-1">
                      {['Yes', 'No'].map(opt => (
                        <button key={opt} onClick={() => setOnboardingData({ ...onboardingData, gstRegistered: opt })}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${onboardingData.gstRegistered === opt
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border text-text-muted hover:border-primary/30'
                            }`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  {onboardingData.gstRegistered === 'Yes' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                      <div>
                        <label className={labelClass}>GSTIN *</label>
                        <input type="text" className={inputClass} maxLength={15} placeholder="e.g. 29ABCDE1234F1ZH" value={onboardingData.gstin}
                          onChange={e => setOnboardingData({ ...onboardingData, gstin: e.target.value.toUpperCase() })} />
                      </div>
                      <div>
                        <label className={labelClass}>Default GST Rate (%)</label>
                        <select className={inputClass} value={onboardingData.defaultGSTRate}
                          onChange={e => setOnboardingData({ ...onboardingData, defaultGSTRate: parseFloat(e.target.value) })}>
                          <option value={5}>5%</option>
                          <option value={12}>12%</option>
                          <option value={18}>18%</option>
                          <option value={28}>28%</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Store Address */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-xl font-black text-text-primary mb-1">Store Address</h2>
                <p className="text-sm text-text-muted mb-6">Where is your primary store located?</p>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Address</label>
                    <input type="text" className={inputClass} placeholder="Street address" value={onboardingData.address}
                      onChange={e => setOnboardingData({ ...onboardingData, address: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>City</label>
                      <input type="text" className={inputClass} placeholder="City" value={onboardingData.city}
                        onChange={e => setOnboardingData({ ...onboardingData, city: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>State</label>
                      <input type="text" className={inputClass} placeholder="State" value={onboardingData.state}
                        onChange={e => setOnboardingData({ ...onboardingData, state: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Pincode</label>
                    <input type="text" className={inputClass} placeholder="Pincode" value={onboardingData.pincode}
                      onChange={e => setOnboardingData({ ...onboardingData, pincode: e.target.value })} maxLength={6} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preferences */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-xl font-black text-text-primary mb-1">Preferences</h2>
                <p className="text-sm text-text-muted mb-6">General system preferences.</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Currency</label>
                      <select className={inputClass} value={onboardingData.currency}
                        onChange={e => setOnboardingData({ ...onboardingData, currency: e.target.value })}>
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Timezone</label>
                      <select className={inputClass} value={onboardingData.timezone}
                        onChange={e => setOnboardingData({ ...onboardingData, timezone: e.target.value })}>
                        <option value="Asia/Kolkata">IST (UTC+5:30)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Language</label>
                    <select className={inputClass} value={onboardingData.language}
                      onChange={e => setOnboardingData({ ...onboardingData, language: e.target.value })}>
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Fiscal Year Start</label>
                    <select className={inputClass} value={onboardingData.fiscalYearStart}
                      onChange={e => setOnboardingData({ ...onboardingData, fiscalYearStart: e.target.value })}>
                      <option>APRIL</option>
                      <option>JANUARY</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: POS Settings */}
            {currentStep === 5 && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-xl font-black text-text-primary mb-1">POS Settings</h2>
                <p className="text-sm text-text-muted mb-6">Configure your checkout experience.</p>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Receipt Template</label>
                    <select className={inputClass} value={onboardingData.receiptTemplate}
                      onChange={e => setOnboardingData({ ...onboardingData, receiptTemplate: e.target.value })}>
                      <option value="STANDARD">Standard Receipt</option>
                      <option value="MINIMAL">Minimalist</option>
                      <option value="DETAILED">Detailed Tax Invoice</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Paper Size</label>
                    <select className={inputClass} value={onboardingData.paperSize}
                      onChange={e => setOnboardingData({ ...onboardingData, paperSize: e.target.value })}>
                      <option value="80mm">Thermal 80mm</option>
                      <option value="58mm">Thermal 58mm</option>
                      <option value="A4">A4 Sheet</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Default Payment Method</label>
                    <select className={inputClass} value={onboardingData.defaultPaymentMethod}
                      onChange={e => setOnboardingData({ ...onboardingData, defaultPaymentMethod: e.target.value })}>
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI / Digital</option>
                      <option value="CARD">Card</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Finish */}
            {currentStep === 6 && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm text-center">
                <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-100">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-xl font-black text-text-primary mb-2">Setup Complete!</h2>
                <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
                  Click below to finalize and start your billing journey.
                </p>
                <div className="bg-page-bg rounded-xl p-4 mb-6 text-left space-y-2.5 max-w-sm mx-auto border border-border">
                  {[
                    'Business profile saved',
                    'Tax settings configured',
                    'Store location verified',
                    'System preferences set',
                    'POS register ready'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 shrink-0" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={prev} disabled={currentStep === 1 || saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <div className="flex gap-2">
            {currentStep < 6 ? (
              <button onClick={handleSaveAndContinue} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 disabled:opacity-50 transition-all uppercase tracking-wider">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Next <ArrowRight className="w-4 h-4" /></>}
              </button>
            ) : (
              <button onClick={handleFinish} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 disabled:opacity-50 transition-all uppercase tracking-wider">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Finish Setup <ArrowRight className="w-4 h-4" /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
