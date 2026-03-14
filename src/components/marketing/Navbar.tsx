'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, ShoppingCart, BarChart3, Package, Users, Store, Receipt,
  MessageSquare, FileText, Layers, Zap, BookOpen, Info, Phone, CreditCard
} from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Product',
    children: [
      { label: 'Features', href: '/features', icon: Zap, desc: 'Everything you need to run your business' },
      { label: 'Integrations', href: '/integrations', icon: Layers, desc: 'Connect with your favorite tools' },
      { label: 'Product Demo', href: '/demo', icon: ShoppingCart, desc: 'See Craftory POS in action' },
    ]
  },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/pricing' },
  {
    label: 'Resources',
    children: [
      { label: 'Documentation', href: '/docs', icon: BookOpen, desc: 'Guides & tutorials' },
      { label: 'About Us', href: '/about', icon: Info, desc: 'Our story and team' },
      { label: 'Contact', href: '/contact', icon: Phone, desc: 'Get in touch with us' },
    ]
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tight">
              Craftory<span className="text-primary">POS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors
                    ${openDropdown === link.label ? 'text-primary bg-primary-light' : 'text-text-primary hover:text-primary hover:bg-gray-50'}`}>
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-border/50 p-2 z-50"
                      >
                        {link.children.map((child) => {
                          const Icon = child.icon;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary-light transition-colors group/item"
                            >
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5 group-hover/item:bg-primary/15 transition-colors">
                                <Icon className="w-4.5 h-4.5 text-primary" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-text-primary">{child.label}</div>
                                <div className="text-xs text-text-muted mt-0.5">{child.desc}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-primary bg-primary-light'
                      : 'text-text-primary hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark shadow-md hover:shadow-lg transition-all"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                      className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-text-primary rounded-lg hover:bg-gray-50"
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 space-y-1"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-3 py-2 text-sm text-text-muted hover:text-primary rounded-lg hover:bg-primary-light transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      pathname === link.href
                        ? 'text-primary bg-primary-light'
                        : 'text-text-primary hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-3 border-t border-border space-y-2">
                <Link href="/login" className="block px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-gray-50 rounded-lg">
                  Sign In
                </Link>
                <Link href="/signup" className="block px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg text-center hover:bg-primary-dark">
                  Start Free Trial
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
