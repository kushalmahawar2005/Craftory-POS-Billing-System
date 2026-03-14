'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, BarChart3, ShoppingCart, Package, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

const demos = [
  {
    id: 'billing', label: 'POS Billing', icon: ShoppingCart,
    title: 'Lightning-Fast Billing Interface',
    desc: 'See how easy it is to create bills with barcode scanning, product search, and one-click checkout.',
  },
  {
    id: 'inventory', label: 'Inventory', icon: Package,
    title: 'Smart Inventory Dashboard',
    desc: 'Track stock levels across locations, manage reorder points, and get real-time low-stock alerts.',
  },
  {
    id: 'analytics', label: 'Analytics', icon: BarChart3,
    title: 'Comprehensive Analytics',
    desc: 'Visualize sales trends, profit margins, customer insights, and growth metrics in beautiful dashboards.',
  },
];

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState('billing');
  const current = demos.find(d => d.id === activeDemo)!;

  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              <Play className="w-3.5 h-3.5" /> Product Demo
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary">
              See Craftory POS <span className="text-primary">in action</span>
            </h1>
            <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
              Explore our interactive product preview to understand how Craftory POS streamlines your daily business operations.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-12">
            {demos.map((demo) => {
              const Icon = demo.icon;
              return (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeDemo === demo.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-page-bg text-text-muted hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {demo.label}
                </button>
              );
            })}
          </div>

          {/* Demo Preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-extrabold text-text-primary">{current.title}</h2>
                <p className="text-text-muted mt-2 max-w-lg mx-auto">{current.desc}</p>
              </div>

              {/* Dashboard Preview */}
              <div className="bg-white rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
                <div className="bg-sidebar-dark p-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-8">
                    <div className="bg-white/10 rounded-md px-3 py-1 text-xs text-sidebar-text text-center">
                      app.craftorypos.com/{activeDemo}
                    </div>
                  </div>
                </div>
                <div className="bg-page-bg p-8">
                  {activeDemo === 'billing' && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 bg-white rounded-xl p-4 border border-border/50">
                        <h4 className="text-sm font-semibold mb-3">Products</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {['Apples', 'Milk 1L', 'Bread', 'Rice 5kg', 'Oil 1L', 'Sugar 1kg', 'Tea', 'Soap'].map((item, i) => (
                            <div key={i} className="bg-page-bg rounded-lg p-3 text-center cursor-pointer hover:bg-primary-light border border-transparent hover:border-primary/20 transition-all">
                              <div className="text-xs font-medium">{item}</div>
                              <div className="text-[10px] text-text-muted">₹{(50 + i * 30)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-border/50">
                        <h4 className="text-sm font-semibold mb-3">Cart (3 items)</h4>
                        {['Rice 5kg', 'Oil 1L', 'Sugar 1kg'].map((item, i) => (
                          <div key={i} className="flex justify-between py-2 border-b border-border/30 text-xs">
                            <span>{item}</span>
                            <span className="font-medium">₹{(150 + i * 80)}</span>
                          </div>
                        ))}
                        <div className="mt-3 pt-2 border-t border-border flex justify-between font-bold text-sm">
                          <span>Total</span>
                          <span className="text-primary">₹640</span>
                        </div>
                        <button className="w-full mt-3 bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
                          Checkout
                        </button>
                      </div>
                    </div>
                  )}
                  {activeDemo === 'inventory' && (
                    <div className="bg-white rounded-xl p-4 border border-border/50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-semibold">Inventory Overview</h4>
                        <span className="text-xs text-text-muted">324 products</span>
                      </div>
                      <table className="w-full text-xs">
                        <thead><tr className="border-b border-border text-text-muted text-left">
                          <th className="py-2 font-medium">Product</th><th className="py-2 font-medium">SKU</th><th className="py-2 font-medium">Stock</th><th className="py-2 font-medium">Status</th>
                        </tr></thead>
                        <tbody>
                          {[
                            { name: 'Basmati Rice 5kg', sku: 'RCE001', stock: 45, status: 'In Stock' },
                            { name: 'Sunflower Oil 1L', sku: 'OIL002', stock: 8, status: 'Low Stock' },
                            { name: 'Tata Salt 1kg', sku: 'SLT003', stock: 120, status: 'In Stock' },
                            { name: 'Red Label Tea 250g', sku: 'TEA004', stock: 3, status: 'Critical' },
                            { name: 'Surf Excel 1kg', sku: 'DET005', stock: 67, status: 'In Stock' },
                          ].map((item, i) => (
                            <tr key={i} className="border-b border-border/30">
                              <td className="py-2.5 font-medium">{item.name}</td>
                              <td className="py-2.5 text-text-muted">{item.sku}</td>
                              <td className="py-2.5">{item.stock}</td>
                              <td className="py-2.5">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                  item.status === 'In Stock' ? 'bg-green-50 text-secondary-green' :
                                  item.status === 'Low Stock' ? 'bg-amber-50 text-accent-amber' :
                                  'bg-red-50 text-error'
                                }`}>{item.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {activeDemo === 'analytics' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { label: 'Revenue', value: '₹3,42,580', change: '+18%' },
                          { label: 'Orders', value: '1,247', change: '+12%' },
                          { label: 'Customers', value: '386', change: '+8%' },
                          { label: 'Avg Order', value: '₹274', change: '+5%' },
                        ].map((s, i) => (
                          <div key={i} className="bg-white rounded-xl p-4 border border-border/50">
                            <p className="text-[10px] text-text-muted">{s.label}</p>
                            <p className="text-lg font-bold mt-1">{s.value}</p>
                            <p className="text-xs text-secondary-green font-medium">{s.change}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white rounded-xl p-6 border border-border/50">
                        <h4 className="text-sm font-semibold mb-4">Monthly Revenue</h4>
                        <div className="flex items-end gap-2 h-32">
                          {[45, 60, 55, 70, 65, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              whileInView={{ height: `${h}%` }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05, duration: 0.5 }}
                              className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-md"
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[9px] text-text-muted">
                          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                            <span key={m}>{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="text-center mt-12">
            <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all text-sm">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
