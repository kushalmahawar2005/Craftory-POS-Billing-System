'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, Package, BarChart3, Users, Settings,
  ChevronLeft, ChevronRight, Bell, Search, LogOut, Menu, X, Store, FileText, Truck, UserCog, ChevronDown, Plus, Shield, ClipboardList, RotateCcw, HandCoins
} from 'lucide-react';

type NavItem = {
  label: string;
  icon: any;
  href?: string;
  subItems?: { label: string; href: string }[];
  roles?: string[];
};

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/app/dashboard' },
  { label: 'POS Billing', icon: ShoppingCart, href: '/app/pos' },
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
  { label: 'Reports', icon: BarChart3, href: '/app/reports', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Customers', icon: Users, href: '/app/customers', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Staff', icon: UserCog, href: '/app/staff', roles: ['ADMIN'] },
  { label: 'Suppliers', icon: Truck, href: '/app/suppliers', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Purchase Orders', icon: ClipboardList, href: '/app/purchase-orders', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Invoices', icon: FileText, href: '/app/invoices' },
  { label: 'Returns', icon: RotateCcw, href: '/app/returns', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Credit Book', icon: HandCoins, href: '/app/credit-book', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Settings', icon: Settings, href: '/app/settings', roles: ['ADMIN'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedNav, setExpandedNav] = useState<string>('Inventory');
  const [user, setUser] = useState<any>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{ products: any[], invoices: any[] }>({ products: [], invoices: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // Fetch user session
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          window.location.href = '/login';
        }
      })
      .catch(() => {
        window.location.href = '/login';
      });
  }, []);

  useEffect(() => {
    if (globalSearch.length < 2) {
      setSearchResults({ products: [], invoices: [] });
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [pRes, iRes] = await Promise.all([
          fetch(`/api/products?q=${globalSearch}&limit=5`).then(r => r.json()),
          fetch(`/api/sales?q=${globalSearch}&limit=5`).then(r => r.json())
        ]);
        setSearchResults({
          products: pRes.products || [],
          invoices: iRes.sales || []
        });
        setShowResults(true);
      } catch (e) {
        console.error('Search error', e);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [globalSearch]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter(item => {
    if (!item.roles) return true; // visible to all
    if (!user?.role) return false; // hide until role loaded
    return item.roles.includes(user.role);
  });

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-primary/20 text-primary',
    MANAGER: 'bg-blue-500/20 text-blue-400',
    CASHIER: 'bg-green-500/20 text-green-400',
  };

  if (!mounted) {
    return (
      <div className="flex h-screen bg-page-bg">
        <div className="w-[240px] hidden lg:block bg-sidebar-dark" />
        <div className="flex-1" />
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-page-bg overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-sidebar-dark flex flex-col transition-all duration-300
        ${collapsed ? 'w-[68px]' : 'w-[240px]'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-16 border-b border-white/8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <motion.span initial={false} animate={{ opacity: collapsed ? 0 : 1 }}
              className="text-base font-bold text-white whitespace-nowrap">
              Craftory<span className="text-blue-400">POS</span>
            </motion.span>
          )}
        </div>

        {/* Role Badge */}
        {!collapsed && user?.role && (
          <div className="mx-3 mt-3 mb-1">
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${roleColors[user.role] || 'bg-white/10 text-white'}`}>
              <Shield className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isSubItemActive = hasSubItems && item.subItems!.some(sub => pathname === sub.href || pathname.startsWith(sub.href + '/'));
            const isActive = item.href ? (pathname === item.href || pathname.startsWith(item.href + '/')) : isSubItemActive;
            const Icon = item.icon;

            return (
              <div key={item.label} className="mb-1">
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                      isActive
                        ? 'bg-primary/15 text-white'
                        : 'text-sidebar-text hover:text-white hover:bg-sidebar-hover'
                    }`}
                  >
                    {isActive && (
                      <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                    )}
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-primary' : ''}`} />
                    {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                  </Link>
                ) : (
                  <button
                    onClick={() => setExpandedNav(expandedNav === item.label ? '' : item.label)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                      isActive || expandedNav === item.label
                        ? 'text-white'
                        : 'text-sidebar-text hover:text-white hover:bg-sidebar-hover'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                       {isActive && expandedNav !== item.label && (
                         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                       )}
                       <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-primary' : ''}`} />
                       {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown className={`w-4 h-4 text-sidebar-text transition-transform ${expandedNav === item.label ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                )}

                {/* Sub Menu */}
                <AnimatePresence>
                  {hasSubItems && !collapsed && expandedNav === item.label && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-1 flex flex-col space-y-1 overflow-hidden"
                    >
                      {item.subItems!.map(sub => {
                        const subActive = pathname === sub.href;
                        return (
                          <div className="flex items-center justify-between w-full group/sub">
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className={`flex-1 pl-11 pr-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                                pathname === sub.href
                                  ? 'bg-primary text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <span>{sub.label}</span>
                            </Link>
                            {sub.label === 'Products' && (
                              <Link
                                href="/app/products/new"
                                className="mr-3 p-1 hover:bg-white/10 rounded transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5 opacity-50 hover:opacity-100" />
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="px-2 py-3 border-t border-white/8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-text hover:text-white hover:bg-sidebar-hover transition-all w-full"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-full mt-1 py-2 text-sidebar-text hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-[240px]'}`}>
        {/* Topbar */}
        {!pathname.includes('/products/new') && (
          <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="hidden sm:flex items-center gap-2 bg-page-bg rounded-lg px-3 py-2 w-72 relative">
                <Search className={`w-4 h-4 ${isSearching ? 'text-primary animate-pulse' : 'text-text-muted'}`} />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  onFocus={() => globalSearch.length >= 2 && setShowResults(true)}
                  placeholder="Search products, invoices..."
                  className="bg-transparent text-sm outline-none w-full placeholder:text-text-muted"
                />

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showResults && (globalSearch.length >= 2) && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowResults(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-border shadow-2xl z-20 overflow-hidden max-h-[400px] overflow-y-auto"
                      >
                        {/* Products */}
                        {searchResults.products.length > 0 && (
                          <div className="p-2 border-b border-border">
                            <p className="px-3 py-1.5 text-[10px] font-black text-text-muted uppercase tracking-widest">Products</p>
                            {searchResults.products.map(p => (
                              <Link
                                key={p.id}
                                href="/app/products"
                                onClick={() => { setGlobalSearch(''); setShowResults(false); }}
                                className="flex items-center gap-3 p-2 hover:bg-page-bg rounded-lg transition-colors group"
                              >
                                <div className="w-8 h-8 bg-primary/5 rounded flex items-center justify-center">
                                  <Package className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-text-primary truncate">{p.name}</p>
                                  <p className="text-[10px] text-text-muted">₹{p.price.toFixed(2)} · Stock: {p.stockQuantity}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Invoices */}
                        {searchResults.invoices.length > 0 && (
                          <div className="p-2">
                            <p className="px-3 py-1.5 text-[10px] font-black text-text-muted uppercase tracking-widest">Invoices</p>
                            {searchResults.invoices.map(inv => (
                              <Link
                                key={inv.id}
                                href="/app/invoices"
                                onClick={() => { setGlobalSearch(''); setShowResults(false); }}
                                className="flex items-center gap-3 p-2 hover:bg-page-bg rounded-lg transition-colors group"
                              >
                                <div className="w-8 h-8 bg-analytics-purple/5 rounded flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-analytics-purple" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-text-primary truncate uppercase">{inv.invoiceNumber}</p>
                                  <p className="text-[10px] text-text-muted">{inv.customer?.name || 'Walk-in'} · ₹{inv.total.toFixed(2)}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        {searchResults.products.length === 0 && searchResults.invoices.length === 0 && !isSearching && (
                          <div className="p-8 text-center">
                            <Search className="w-8 h-8 text-text-muted/20 mx-auto mb-2" />
                            <p className="text-xs text-text-muted font-medium">No results found for "{globalSearch}"</p>
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-text-muted" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-border">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-text-primary leading-none">{user?.name || 'Loading...'}</p>
                  <p className="text-[11px] text-text-muted">{user?.role || '...'}</p>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto ${pathname.includes('/products/new') ? '' : 'p-4 lg:p-6'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
