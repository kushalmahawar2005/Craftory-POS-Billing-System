'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, Package, BarChart3, Users, Settings,
  ChevronLeft, ChevronRight, Bell, Search, LogOut, Menu, X, Store,
  FileText, Truck, ClipboardList, Shield
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: any;
  href: string;
  roles?: string[]; // if undefined = all roles
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/app/dashboard' },
  { label: 'POS Billing', icon: ShoppingCart, href: '/app/pos' },
  { label: 'Inventory', icon: Package, href: '/app/inventory' },
  { label: 'Products', icon: Store, href: '/app/products', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Suppliers', icon: Truck, href: '/app/suppliers', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Purchase Orders', icon: ClipboardList, href: '/app/purchase-orders', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Reports', icon: BarChart3, href: '/app/reports', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Customers', icon: Users, href: '/app/customers', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Invoices', icon: FileText, href: '/app/invoices' },
  { label: 'Settings', icon: Settings, href: '/app/settings', roles: ['ADMIN'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) setUser(data.user);
        else window.location.href = '/login';
      })
      .catch(() => { window.location.href = '/login'; });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch {
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
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${isActive
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
            );
          })}
        </nav>

        {/* Bottom Actions */}
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
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-page-bg rounded-lg px-3 py-2 w-72">
              <Search className="w-4 h-4 text-text-muted" />
              <input type="text" placeholder="Search products, invoices..." className="bg-transparent text-sm outline-none w-full placeholder:text-text-muted" />
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

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
