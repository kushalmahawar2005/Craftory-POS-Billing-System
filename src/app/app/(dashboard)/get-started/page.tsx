'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Circle, Store, Receipt, Package, ShoppingCart, Settings2,
  Upload, Plus, ArrowRight, Sparkles, Users, Truck, ChevronRight,
  Mail, Phone, MessageCircle, BookOpen, Globe, FileSpreadsheet,
  AlertCircle, Zap, ExternalLink, HelpCircle, BarChart3, CreditCard,
  History, Target, Compass, HardDrive, Cpu, Globe2, MessageSquare,
  LifeBuoy, Headphones, Check, UserCheck, Lightbulb, FileText
} from 'lucide-react';

type OnboardingStep = {
  id: string;
  number: number;
  title: string;
  checkKey: string;
  content: {
    title: string;
    description: string;
    secondaryDescription?: string;
    primaryAction: { label: string; href: string };
    secondaryAction?: { label: string; href: string };
    tip?: string;
    tipAction?: { label: string; href: string };
  };
};

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'create-store',
    number: 1,
    title: 'Create a Store',
    checkKey: 'storeCreated',
    content: {
      title: 'Create your Store',
      description: 'Set up your store profile with name, address, phone, and GST details.',
      secondaryDescription: 'Your customers will see these details on the invoices you generate.',
      primaryAction: { label: 'Go to Settings', href: '/app/settings' },
      tip: 'This information is used to personalize your business presence across all documents.',
    },
  },
  {
    id: 'configure-tax',
    number: 2,
    title: 'Configure tax settings',
    checkKey: 'taxConfigured',
    content: {
      title: 'Configure Tax Settings',
      description: 'Configure your GST number, default tax rates, and HSN/SAC codes for invoices.',
      secondaryDescription: 'Proper tax settings ensure your business stays compliant with Indian regulations.',
      primaryAction: { label: 'Tax Settings', href: '/app/settings' },
      tip: 'Correct tax configuration ensures your business remains tax-compliant and transparent.',
    },
  },
  {
    id: 'build-inventory',
    number: 3,
    title: 'Build your inventory',
    checkKey: 'inventoryBuilt',
    content: {
      title: 'Build your inventory',
      description: 'To start selling, add your products or services to the master list.',
      secondaryDescription: 'You can manually add items or import them in bulk using a spreadsheet.',
      primaryAction: { label: 'Add Item', href: '/app/products/new' },
      secondaryAction: { label: 'Import Items', href: '/app/products' },
      tip: 'Importing items in bulk saves time and avoids manual errors. Use .csv or .xlsx format.',
    },
  },
  {
    id: 'stock-inventory',
    number: 4,
    title: 'Stock up your inventory',
    checkKey: 'inventoryStocked',
    content: {
      title: 'Stock up your inventory',
      description: 'To increase the stock of your inventory, record a purchase bill for the items/services supplied by the vendors on credit.',
      primaryAction: { label: 'Create Purchase Bill', href: '/app/purchase-orders' },
      secondaryAction: { label: 'Create Purchase Order', href: '/app/purchase-orders' },
      tip: 'To record purchase transactions, create vendors manually or import using a file.',
      tipAction: { label: 'Add Vendor', href: '/app/suppliers' },
    },
  },
  {
    id: 'manage-preferences',
    number: 5,
    title: 'Manage store preferences',
    checkKey: 'preferencesManaged',
    content: {
      title: 'Manage store preferences',
      description: 'Customize your receipt templates, terms and conditions, and store-wide settings.',
      secondaryDescription: 'Make the point of sale interface specifically tailored for your workflow.',
      primaryAction: { label: 'Go to Settings', href: '/app/settings' },
      tip: 'Standardize your sales experience by setting default payment modes and receipt formats.',
    },
  },
  {
    id: 'setup-pos',
    number: 6,
    title: 'Set up POS register',
    checkKey: 'posSetup',
    content: {
      title: 'Set up POS register',
      description: 'Open your billing counter to start processing your first sales transaction.',
      secondaryDescription: 'Configure keyboard shortcuts and scanner settings for high-speed billing.',
      primaryAction: { label: 'Open POS', href: '/app/pos' },
      tip: 'Using a barcode scanner significantly increases billing speed and accuracy.',
    },
  },
  {
    id: 'setup-mobile',
    number: 7,
    title: 'Set up mobile store',
    checkKey: 'customersAdded',
    content: {
      title: 'Set up Mobile Store',
      description: 'Enable your storefront on mobile devices to manage sales on the go.',
      secondaryDescription: 'Share a digital catalog with your customers via WhatsApp.',
      primaryAction: { label: 'Configure Mobile', href: '/app/settings' },
      tip: 'Mobilize your workforce by enabling secure access to the POS on tablets and smartphones.',
    },
  },
];

export default function GetStartedPage() {
  const [user, setUser] = useState<any>(null);
  const [activeStep, setActiveStep] = useState<string>('stock-inventory');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statusRes] = await Promise.all([
          fetch('/api/auth/me').then(r => r.json()),
          fetch('/api/onboarding/status').then(r => r.json()).catch(() => ({})),
        ]);
        if (userRes.authenticated) setUser(userRes.user);
        const completed = new Set<string>();
        if (userRes.user?.shop || userRes.user?.store) completed.add('create-store');
        if (statusRes?.completedSteps) statusRes.completedSteps.forEach((s: string) => completed.add(s));
        setCompletedSteps(completed);
        const firstIncomplete = onboardingSteps.find(s => !completed.has(s.id));
        if (firstIncomplete) setActiveStep(firstIncomplete.id);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const completedCount = completedSteps.size;
  const totalSteps = onboardingSteps.length;
  const currentStepData = onboardingSteps.find(s => s.id === activeStep);

  if (loading) return <div className="p-10 h-full bg-white animate-pulse" />;

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-4 select-none">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
         <div>
            <h1 className="text-[22px] font-bold text-gray-900">Welcome, {user?.name || 'Partner'}!</h1>
            <p className="text-[13px] text-gray-500 font-medium mt-1">Follow our quick checklist to get started with Craftory POS</p>
         </div>

         <div className="flex flex-col items-end">
            <p className="text-[13px] text-gray-500 font-medium mb-3">{completedSteps.size}/{totalSteps} Steps Completed</p>
            <div className="flex gap-1.5 h-1">
               {onboardingSteps.map((step) => (
                  <div key={step.id} className={`w-10 rounded-full transition-all duration-300 ${completedSteps.has(step.id) ? 'bg-[#1a6bdb]' : 'bg-blue-100'}`} />
               ))}
            </div>
         </div>
      </div>

      {/* ─── MAIN ONBOARDING CARD ─── */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col lg:flex-row min-h-[580px] shadow-sm">
         {/* LEFT: STEP LIST (CHECKLIST) */}
         <div className="w-full lg:w-[320px] bg-white border-r border-gray-100 py-6 overflow-y-auto">
            <div className="space-y-1">
               {onboardingSteps.map((step) => {
                  const isCompleted = completedSteps.has(step.id);
                  const isActive = activeStep === step.id;
                  return (
                     <button 
                        key={step.id} 
                        onClick={() => setActiveStep(step.id)} 
                        className={`w-full flex items-center gap-4 px-6 py-3.5 transition-all text-left ${isActive ? 'bg-[#eef5ff]' : 'hover:bg-gray-50'}`}
                     >
                        <div className="shrink-0 relative">
                           {isCompleted ? (
                              <div className="w-5 h-5 rounded-full bg-[#1a6bdb] flex items-center justify-center text-white">
                                 <Check className="w-3 h-3" strokeWidth={4} />
                              </div>
                           ) : (
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${isActive ? 'bg-white border-[#1a6bdb] text-[#1a6bdb]' : 'border-gray-200 text-gray-400'}`}>
                                 {step.number}
                              </div>
                           )}
                        </div>
                        <span className={`text-[14px] font-medium transition-colors ${isActive ? 'text-[#1a6bdb]' : isCompleted ? 'text-gray-400' : 'text-gray-700'}`}>
                           {step.title}
                        </span>
                     </button>
                  );
               })}
            </div>
         </div>

         {/* RIGHT: CONTENT ZONE */}
         <div className="flex-1 p-12 bg-white flex flex-col relative">
            <AnimatePresence mode="wait">
               {currentStepData && (
                  <motion.div 
                     key={currentStepData.id}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="max-w-3xl"
                  >
                     <h2 className="text-[20px] font-bold text-gray-800 mb-8">{currentStepData.content.title}</h2>
                     
                     {/* Information Box */}
                     <div className="bg-[#f8fbff] border border-[#e2efff] rounded-lg p-10 mb-8">
                        <p className="text-[15px] text-gray-600 leading-[1.7]">
                           {currentStepData.content.description}
                        </p>
                        {currentStepData.content.secondaryDescription && (
                           <p className="text-[15px] text-gray-500 font-medium mt-4 leading-[1.7]">
                              {currentStepData.content.secondaryDescription}
                           </p>
                        )}

                        <div className="flex items-center gap-4 mt-8">
                           <Link href={currentStepData.content.primaryAction.href} className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[13px] font-bold rounded hover:bg-blue-600 transition-all">
                              {currentStepData.content.primaryAction.label}
                           </Link>

                           {currentStepData.content.secondaryAction && (
                              <Link href={currentStepData.content.secondaryAction.href} className="px-6 py-2.5 bg-white border border-[#1a6bdb] text-[#1a6bdb] text-[13px] font-bold rounded hover:bg-blue-50 transition-all">
                                 {currentStepData.content.secondaryAction.label}
                              </Link>
                           )}
                        </div>
                     </div>

                     {/* Tip Section */}
                     <div className="flex items-start gap-3 px-2">
                        <Lightbulb className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                        <div className="text-[13px] text-gray-500 font-medium leading-relaxed">
                           {currentStepData.content.tip}
                           {currentStepData.content.tipAction && (
                              <Link href={currentStepData.content.tipAction.href} className="text-[#1a6bdb] ml-2 hover:underline">
                                 {currentStepData.content.tipAction.label}
                              </Link>
                           )}
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Illustration Placeholder (Zoho Style) removed as per user request */}
            <div className="absolute bottom-12 right-12 hidden xl:block opacity-60">
            </div>
         </div>
      </div>

      {/* ─── FOOTER QUICK LINKS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-20 px-4">
         <div>
            <h4 className="text-[14px] font-bold text-gray-900 mb-6">More with Zoho POS</h4>
            <div className="space-y-4">
               {[
                  { label: 'Customers', icon: Users, href: '/app/customers' },
                  { label: 'Manage Sessions', icon: History, href: '/app/pos' },
                  { label: 'Price List', icon: FileText, href: '/app/reports' },
                  { label: 'Invite Users', icon: UserCheck, href: '/app/staff' }
               ].map((item, i) => (
                  <Link key={i} href={item.href} className="flex items-center gap-3 text-[14px] text-gray-700 hover:text-blue-600 transition-colors group">
                     <item.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                     {item.label}
                  </Link>
               ))}
            </div>
         </div>

         <div>
            <h4 className="text-[14px] font-bold text-gray-900 mb-6">Need Help?</h4>
            <div className="space-y-4">
               <a href="#" className="flex items-center gap-3 text-[14px] text-gray-700 hover:text-blue-600 transition-colors group">
                  <Mail className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  Email us <span className="font-semibold ml-1">support@zohopos.com</span>
               </a>
               <div className="flex items-center gap-3 text-[14px] text-gray-700 group transition-colors">
                  <Phone className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  Call us at <span className="font-semibold ml-1">1800 102 9944</span>
               </div>
               <a href="#" className="flex items-center gap-3 text-[14px] text-gray-700 hover:text-blue-600 transition-colors group">
                  <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  Chat with us
               </a>
               <Link href="#" className="flex items-center gap-3 text-[14px] text-gray-700 hover:text-blue-600 transition-colors group">
                  <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  Help Resources
               </Link>
               <Link href="#" className="flex items-center gap-3 text-[14px] text-gray-700 hover:text-blue-600 transition-colors group">
                  <Users className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  User Community
               </Link>
            </div>
         </div>

         <div>
            <h4 className="text-[14px] font-bold text-gray-900 mb-6">Need experts help to jumpstart your business?</h4>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-6 font-medium">
               Our onboarding experts will assist you in setting up Zoho POS, including data import, Billing apps, user training, customization, and much more.
            </p>
            <Link href="#" className="text-[14px] font-bold text-[#1a6bdb] flex items-center gap-2 hover:underline">
               Get in touch <ArrowRight className="w-4 h-4" />
            </Link>
         </div>
      </div>
    </div>
  );
}
