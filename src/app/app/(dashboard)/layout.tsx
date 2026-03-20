'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, Package, BarChart3, Users, Settings,
  ChevronLeft, ChevronRight, Bell, Search, LogOut, Menu, X, Store, FileText,
  Truck, UserCog, ChevronDown, Plus, Shield, ClipboardList, RotateCcw, HandCoins,
  Zap, Building2, Megaphone, QrCode, CircleDollarSign, ArrowLeftRight,
  Receipt, Settings2, ShieldCheck, Wallet, Activity, Target, Globe,
  Box, Sparkles, Command, UserCheck, HardDrive, Cpu, Layers,
  ArrowUpRight, Loader2, Home, Compass, Boxes, History
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────
type SubItem = { label: string; href: string };
type NavItem = {
  label: string;
  icon: any;
  href?: string;
  subItems?: SubItem[];
  roles?: string[];
};

type SidebarSection = {
  id: string;
  label: string;
  icon: any;
  navItems: NavItem[];
};

const sidebarSections: SidebarSection[] = [
  {
    id: 'business',
    label: 'Business',
    icon: Home,
    navItems: [
      { label: 'Get Started', icon: Zap, href: '/app/get-started' },
      { label: 'Dashboard', icon: LayoutDashboard, href: '/app/dashboard' },
      {
        label: 'Inventory',
        icon: Package,
        subItems: [
          { label: 'Products', href: '/app/products' },
          { label: 'Categories', href: '/app/categories' },
          { label: 'Adjustments', href: '/app/adjustments' },
        ],
        roles: ['ADMIN', 'MANAGER']
      },
      {
        label: 'Sales',
        icon: ShoppingCart,
        subItems: [
          { label: 'POS Billing', href: '/app/pos' },
          { label: 'Invoices', href: '/app/invoices' },
          { label: 'Returns', href: '/app/returns' },
        ],
      },
      {
        label: 'Orders',
        icon: FileText,
        href: '/app/sales-orders'
      },
      {
        label: 'Logistics',
        icon: Truck,
        subItems: [
          { label: 'Purchase Orders', href: '/app/purchase-orders' },
          { label: 'Suppliers', href: '/app/suppliers' },
        ],
        roles: ['ADMIN', 'MANAGER']
      },
    ],
  },
  {
    id: 'channels',
    label: 'Sales Channels',
    icon: Compass,
    navItems: [
      { label: 'Customers', icon: Users, href: '/app/customers', roles: ['ADMIN', 'MANAGER'] },
      { label: 'Credit Book', icon: HandCoins, href: '/app/credit-book', roles: ['ADMIN', 'MANAGER'] },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    navItems: [
      { label: 'Analytics', icon: BarChart3, href: '/app/reports', roles: ['ADMIN', 'MANAGER'] },
    ],
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
    navItems: [],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('business');
  const [expandedNav, setExpandedNav] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{ products: any[], invoices: any[] }>({ products: [], invoices: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) { setUser(data.user); } else { window.location.href = '/login'; }
      })
      .catch(() => { window.location.href = '/login'; });
  }, []);

  useEffect(() => {
    // Determine active section based on current path
    for (const section of sidebarSections) {
      for (const item of section.navItems) {
        if (item.href && (pathname === item.href || pathname.startsWith(item.href + '/'))) { 
          setActiveSection(section.id); return; 
        }
        if (item.subItems) {
          for (const sub of item.subItems) {
            if (pathname === sub.href || pathname.startsWith(sub.href + '/')) {
              setActiveSection(section.id); setExpandedNav(item.label); return;
            }
          }
        }
      }
    }
  }, [pathname]);

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch (e) { console.error('Logout failed', e); }
    finally { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; }
  };

  const currentSection = sidebarSections.find(s => s.id === activeSection);
  const filterByRole = (items: NavItem[]) => items.filter(item => {
    if (!item.roles) return true;
    if (!user?.role) return false;
    return item.roles.includes(user.role);
  });

  if (!mounted) return <div className="flex h-screen bg-[#1e2128]" />;

  return (
    <div className="flex h-screen bg-[#f5f7f9] overflow-hidden text-[#1e2128]">
      {/* ─── ICON RAIL (ZOHO) ─── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[68px] bg-[#1e2128] flex flex-col items-center transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="w-full h-14 flex items-center justify-center border-b border-white/5">
           <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
              <Boxes className="w-5 h-5 text-white" />
           </div>
        </div>
        
        <div className="flex-1 w-full pt-4 space-y-1">
          {sidebarSections.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button key={section.id} onClick={() => setActiveSection(section.id)} className={`relative w-full flex flex-col items-center justify-center py-4 transition-all ${isActive ? 'bg-[#2b303b] text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1a6bdb]" />}
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className="text-[10px] font-medium mt-1.5 leading-none text-center px-1">{section.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pb-6 space-y-4">
          <Link href="/app/settings" className={`group flex items-center justify-center w-full py-3 ${pathname.includes('/settings') ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
             <Settings className="w-5 h-5" />
          </Link>
          <button className="relative group flex items-center justify-center w-full py-3 text-gray-500 hover:text-white">
             <Bell className="w-5 h-5" />
             <span className="absolute top-3 right-5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1e2128]" />
          </button>
          <button onClick={handleLogout} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg mx-auto">
             {user?.name?.charAt(0) || 'U'}
          </button>
        </div>
      </aside>

      {/* ─── NAV RAIL (ZOHO) ─── */}
      <aside className={`fixed inset-y-0 left-[68px] z-40 w-[230px] bg-[#232730] flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} border-r border-white/5`}>
        <div className="px-5 h-14 flex items-center border-b border-white/5">
           <span className="text-sm font-bold text-white truncate">{user?.shop?.name || 'Kushal General Store'}</span>
           <ChevronDown className="w-3.5 h-3.5 text-gray-500 ml-auto" />
        </div>

        <nav className="flex-1 pt-6 px-3 overflow-y-auto no-scrollbar space-y-0.5">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-0.5">
               {activeSection === 'channels' && (
                 <div className="px-3 mb-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Sales Channels</p>
                    <div className="bg-[#1a6bdb] px-4 py-2.5 rounded-lg flex items-center gap-3 text-white text-sm font-semibold shadow-lg">
                       <ShoppingCart className="w-4 h-4" />
                       <span>POS</span>
                    </div>
                 </div>
               )}

              {currentSection && filterByRole(currentSection.navItems).map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isSubItemActive = hasSubItems && item.subItems!.some(sub => pathname === sub.href || pathname.startsWith(sub.href + '/'));
                const isActive = item.href ? (pathname === item.href || pathname.startsWith(item.href + '/')) : isSubItemActive;
                const Icon = item.icon;

                return (
                  <div key={item.label}>
                    {item.href ? (
                      <Link href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive ? 'bg-[#2b303b] text-white' : 'text-[#94a3b8] hover:text-white hover:bg-white/5'}`}>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#1a6bdb]' : 'text-gray-500'}`} />
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button onClick={() => setExpandedNav(expandedNav === item.label ? '' : item.label)} className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive || expandedNav === item.label ? 'text-white' : 'text-[#94a3b8] hover:text-white hover:bg-white/5'}`}>
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive || expandedNav === item.label ? 'text-[#1a6bdb]' : 'text-gray-500'}`} />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedNav === item.label ? 'rotate-90' : ''}`} />
                      </button>
                    )}

                    {hasSubItems && expandedNav === item.label && (
                      <div className="mt-1 space-y-0.5 pl-10 pr-2">
                        {item.subItems!.map(sub => {
                          const subActive = pathname === sub.href || pathname.startsWith(sub.href + '/');
                          return (
                            <Link key={sub.href} href={sub.href} onClick={() => setMobileOpen(false)} className={`block py-2 text-[13px] transition-colors ${subActive ? 'text-white font-semibold' : 'text-[#94a3b8] hover:text-white hover:underline'}`}>
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </nav>

        <div className="p-4">
           <div className="bg-[#1a1c22] p-4 rounded-xl border border-white/5">
              <p className="text-[11px] text-[#94a3b8] leading-relaxed mb-3">You're currently on our <span className="text-white font-bold">Premium Trial</span></p>
              <div className="flex gap-2">
                 <button className="flex-1 py-1.5 bg-[#1a6bdb] text-white text-[11px] font-bold rounded-md hover:bg-blue-600 transition-colors">Upgrade</button>
                 <button className="flex-1 py-1.5 bg-white/5 text-[#94a3b8] text-[11px] font-bold rounded-md hover:bg-white/10 transition-colors border border-white/5">Switch Trial</button>
              </div>
           </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 ml-0 lg:ml-[298px] flex flex-col h-full bg-[#f5f7f9] transition-all overflow-hidden">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-500"><Menu className="w-5 h-5" /></button>
            <div className="text-sm font-bold flex items-center gap-2">
               <span className="text-gray-400">POS</span>
               <span className="w-1 h-1 bg-gray-300 rounded-full" />
               <span className="text-gray-700">{pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 w-[300px] border border-transparent focus-within:bg-white focus-within:border-blue-200 transition-all">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none w-full text-gray-700" />
            </div>
            
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-[11px] font-bold rounded-full border border-green-100">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  SYNCING...
               </div>
               <button className="p-2 text-gray-400 hover:text-gray-600"><Globe className="w-5 h-5" /></button>
               <div className="flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
                  <div className="text-right hidden sm:block">
                     <p className="text-[12px] font-bold text-gray-900 leading-none">NAMAN</p>
                     <p className="text-[10px] text-blue-600 font-bold uppercase mt-1">ADMIN</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">N</div>
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative no-scrollbar">
           {children}
        </main>
      </div>
    </div>
  );
}
