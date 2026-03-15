'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, FileText, Package, ShoppingCart, Settings, ArrowRight, ArrowLeft,
  Upload, Check, Loader2
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Create a Store', icon: Store },
  { id: 2, title: 'Configure Tax Settings', icon: FileText },
  { id: 3, title: 'Build Your Inventory', icon: Package },
  { id: 4, title: 'Stock Up Inventory', icon: ShoppingCart },
  { id: 5, title: 'Manage Preferences', icon: Settings },
  { id: 6, title: 'Set Up POS Register', icon: ShoppingCart },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  const [storeData, setStoreData] = useState({
    businessName: '', businessType: '', address: '', city: '', state: '', pincode: '', language: 'English',
  });
  const [taxData, setTaxData] = useState({
    gstRegistered: '', gstin: '', registrationType: '', legalName: '', tradeName: '', registeredOn: '',
  });
  const [prefData, setPrefData] = useState({
    enableDiscounts: true,
    additionalCharges: true,
    soundNotifications: true,
    emailNotifications: false,
    invoicePdf: false,
  });

  // Fetch existing onboarding data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/onboarding');
        if (!res.ok) return;
        const data = await res.json();

        if (data.step1) setStoreData(data.step1);
        if (data.step2) setTaxData(data.step2);
        if (data.step5) setPrefData(data.step5);

        if (data.onboardingCompleted) {
          window.location.href = '/app/dashboard';
        }
      } catch (e) {
        console.error('Failed to load onboarding data:', e);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const saveStep = async (stepNumber: number, stepData: Record<string, any>) => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');

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
    let success = false;

    if (currentStep === 1) {
      if (!storeData.businessName.trim()) {
        setSaveError('Business name is required');
        return;
      }
      success = await saveStep(1, storeData);
    } else if (currentStep === 2) {
      success = await saveStep(2, taxData);
    } else if (currentStep === 3 || currentStep === 4) {
      // Steps 3 & 4 are navigation steps — no data to save
      success = true;
    } else if (currentStep === 5) {
      success = await saveStep(5, prefData);
    }

    if (success && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = async () => {
    const success = await saveStep(6, {});
    if (success) {
      window.location.href = '/app/dashboard';
    }
  };

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

  return (
    <div className="min-h-screen bg-page-bg">
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
                <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${currentStep === step.id ? 'text-primary bg-primary-light' :
                    currentStep > step.id ? 'text-secondary-green' :
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
                  <div className={`flex-1 h-0.5 mx-1 rounded ${currentStep > step.id ? 'bg-secondary-green' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Success/Error Messages */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-secondary-green/10 border border-secondary-green/20 text-secondary-green text-sm font-medium rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" /> {saveSuccess}
            </motion.div>
          )}
          {saveError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-error/5 border border-error/20 text-error text-sm font-medium rounded-xl">
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
            {/* Step 1: Create Store */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl p-8 border border-border/50 shadow-sm">
                <h2 className="text-xl font-black text-text-primary mb-1">Create your store</h2>
                <p className="text-sm text-text-muted mb-6">Tell us about your business to set up your store profile.</p>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Business Name *</label>
                    <input type="text" className={inputClass} placeholder="e.g. Kumar Electronics" value={storeData.businessName}
                      onChange={e => setStoreData({ ...storeData, businessName: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Business Type *</label>
                    <select className={inputClass} value={storeData.businessType}
                      onChange={e => setStoreData({ ...storeData, businessType: e.target.value })}>
                      <option value="">Select type</option>
                      <option>Retail Shop</option>
                      <option>Kirana Store</option>
                      <option>Wholesale</option>
                      <option>Pharmacy</option>
                      <option>Clothing Store</option>
                      <option>Electronics Store</option>
                      <option>Restaurant</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className={labelClass}>Business Address</label>
                      <input type="text" className={inputClass} placeholder="Street address" value={storeData.address}
                        onChange={e => setStoreData({ ...storeData, address: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>City</label>
                      <input type="text" className={inputClass} placeholder="City" value={storeData.city}
                        onChange={e => setStoreData({ ...storeData, city: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>State</label>
                      <input type="text" className={inputClass} placeholder="State" value={storeData.state}
                        onChange={e => setStoreData({ ...storeData, state: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>Pincode</label>
                      <input type="text" className={inputClass} placeholder="Pincode" value={storeData.pincode}
                        onChange={e => setStoreData({ ...storeData, pincode: e.target.value })} maxLength={6} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Upload Logo</label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/30 hover:bg-primary-light/30 transition-all">
                      <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
                      <p className="text-sm text-text-muted">Click to upload or drag and drop</p>
                      <p className="text-xs text-text-muted mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Language</label>
                    <select className={inputClass} value={storeData.language}
                      onChange={e => setStoreData({ ...storeData, language: e.target.value })}>
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Tamil</option>
                      <option>Telugu</option>
                      <option>Kannada</option>
                      <option>Malayalam</option>
                      <option>Marathi</option>
                      <option>Bengali</option>
                      <option>Gujarati</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Tax Settings */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl p-8 border border-border/50 shadow-sm">
                <h2 className="text-xl font-black text-text-primary mb-1">Configure tax settings</h2>
                <p className="text-sm text-text-muted mb-6">Set up GST for your business invoices.</p>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Is your business registered for GST?</label>
                    <div className="flex gap-3 mt-1">
                      {['Yes', 'No'].map(opt => (
                        <button key={opt} onClick={() => setTaxData({ ...taxData, gstRegistered: opt })}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${taxData.gstRegistered === opt
                              ? 'border-primary bg-primary-light text-primary'
                              : 'border-border text-text-muted hover:border-primary/30'
                            }`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  {taxData.gstRegistered === 'Yes' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                      <div>
                        <label className={labelClass}>GSTIN (15 digits) *</label>
                        <input type="text" className={inputClass} maxLength={15} placeholder="e.g. 29ABCDE1234F1ZH" value={taxData.gstin}
                          onChange={e => setTaxData({ ...taxData, gstin: e.target.value.toUpperCase() })} />
                      </div>
                      <div>
                        <label className={labelClass}>Registration Type</label>
                        <select className={inputClass} value={taxData.registrationType}
                          onChange={e => setTaxData({ ...taxData, registrationType: e.target.value })}>
                          <option value="">Select type</option>
                          <option>Regular</option>
                          <option>Composition</option>
                          <option>Unregistered</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Business Legal Name</label>
                        <input type="text" className={inputClass} placeholder="As per GST registration" value={taxData.legalName}
                          onChange={e => setTaxData({ ...taxData, legalName: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelClass}>Business Trade Name</label>
                        <input type="text" className={inputClass} placeholder="Your brand/trade name" value={taxData.tradeName}
                          onChange={e => setTaxData({ ...taxData, tradeName: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelClass}>GST Registered On</label>
                        <input type="date" className={inputClass} value={taxData.registeredOn}
                          onChange={e => setTaxData({ ...taxData, registeredOn: e.target.value })} />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Build Inventory */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl p-8 border border-border/50 shadow-sm">
                <h2 className="text-xl font-black text-text-primary mb-1">Build your inventory</h2>
                <p className="text-sm text-text-muted mb-6">Add products to your store. You can import in bulk or add manually.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 hover:bg-primary-light/30 transition-all cursor-pointer group">
                    <Upload className="w-10 h-10 text-text-muted mx-auto mb-3 group-hover:text-primary transition-colors" />
                    <h3 className="font-bold text-text-primary mb-1">Import Items</h3>
                    <p className="text-xs text-text-muted">Bulk import from .csv, .tsv, or .xls file</p>
                    <button className="mt-4 px-4 py-2 bg-primary text-white text-sm rounded-xl font-bold hover:bg-primary-dark transition-colors">
                      Import Items
                    </button>
                  </div>
                  <button
                    onClick={() => window.location.href = '/app/products'}
                    className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 hover:bg-primary-light/30 transition-all cursor-pointer group"
                  >
                    <Package className="w-10 h-10 text-text-muted mx-auto mb-3 group-hover:text-primary transition-colors" />
                    <h3 className="font-bold text-text-primary mb-1">Add Manually</h3>
                    <p className="text-xs text-text-muted">Create items/services one by one</p>
                    <span className="inline-block mt-4 px-4 py-2 bg-white text-primary text-sm rounded-xl font-bold border border-primary hover:bg-primary-light transition-colors">
                      Add Item
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Stock Up */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl p-8 border border-border/50 shadow-sm">
                <h2 className="text-xl font-black text-text-primary mb-1">Stock up your inventory</h2>
                <p className="text-sm text-text-muted mb-6">Record purchase bills for items supplied by vendors to increase your stock.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <button className="border-2 border-border rounded-xl p-6 text-center hover:border-primary/30 hover:bg-primary-light/30 transition-all group">
                    <FileText className="w-10 h-10 text-text-muted mx-auto mb-3 group-hover:text-primary transition-colors" />
                    <h3 className="font-bold text-text-primary mb-1">Create Purchase Bill</h3>
                    <p className="text-xs text-text-muted">Record items received from vendors</p>
                  </button>
                  <button className="border-2 border-border rounded-xl p-6 text-center hover:border-primary/30 hover:bg-primary-light/30 transition-all group">
                    <ShoppingCart className="w-10 h-10 text-text-muted mx-auto mb-3 group-hover:text-primary transition-colors" />
                    <h3 className="font-bold text-text-primary mb-1">Create Purchase Order</h3>
                    <p className="text-xs text-text-muted">Place orders with your suppliers</p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Preferences */}
            {currentStep === 5 && (
              <div className="bg-white rounded-2xl p-8 border border-border/50 shadow-sm">
                <h2 className="text-xl font-black text-text-primary mb-1">Manage store preferences</h2>
                <p className="text-sm text-text-muted mb-6">Configure discounts, charges, notifications, and invoice settings.</p>
                <div className="space-y-4">
                  {[
                    { key: 'enableDiscounts', label: 'Enable discounts on billing', desc: 'Allow item or cart level discounts' },
                    { key: 'additionalCharges', label: 'Additional charges', desc: 'Delivery, packaging, or service charges' },
                    { key: 'soundNotifications', label: 'Sound notifications', desc: 'Audio alerts for new orders and scans' },
                    { key: 'emailNotifications', label: 'Email notifications', desc: 'Daily sales summary and alerts' },
                    { key: 'invoicePdf', label: 'Invoice PDF', desc: 'Generate PDF invoices for customers' },
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between p-4 bg-page-bg rounded-xl border border-border/50">
                      <div>
                        <p className="text-sm font-bold text-text-primary">{pref.label}</p>
                        <p className="text-xs text-text-muted">{pref.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={prefData[pref.key as keyof typeof prefData]}
                          onChange={e => setPrefData({ ...prefData, [pref.key]: e.target.checked })}
                        />
                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: POS Register - Complete */}
            {currentStep === 6 && (
              <div className="bg-white rounded-2xl p-8 border border-border/50 shadow-sm text-center">
                <div className="w-20 h-20 bg-secondary-green/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-secondary-green" />
                </div>
                <h2 className="text-xl font-black text-text-primary mb-2">You're all set!</h2>
                <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
                  Your store is ready! Click below to complete the setup and start using your POS dashboard.
                </p>
                <div className="bg-page-bg rounded-xl p-4 mb-6 text-left space-y-2.5 max-w-sm mx-auto">
                  <div className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-secondary-green shrink-0" /> <span className="font-medium">Store profile saved</span></div>
                  <div className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-secondary-green shrink-0" /> <span className="font-medium">Tax settings configured</span></div>
                  <div className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-secondary-green shrink-0" /> <span className="font-medium">Inventory setup initiated</span></div>
                  <div className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-secondary-green shrink-0" /> <span className="font-medium">Preferences configured</span></div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={prev} disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <div className="flex gap-2">
            {currentStep < 6 && (
              <button onClick={() => setCurrentStep(6)} className="px-4 py-2 text-sm text-text-muted hover:text-text-primary transition-colors font-medium">
                Skip for now
              </button>
            )}
            {currentStep < 6 ? (
              <button
                onClick={handleSaveAndContinue}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 disabled:opacity-50 transition-all"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Save & Continue <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 disabled:opacity-50 transition-all"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Go to Dashboard <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
