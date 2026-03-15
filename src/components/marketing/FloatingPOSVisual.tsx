'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ShoppingCart, CheckCircle2, LayoutDashboard, Package, Users, BarChart3, Settings, QrCode, ScanLine } from 'lucide-react';

export default function FloatingPOSVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [isViewingGateway, setIsViewingGateway] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [150, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.8, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [25, 0]);

  // Simulate payment flow after scroll reveals the gateway
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isViewingGateway) {
       timer = setTimeout(() => setShowSuccess(true), 3500);
    } else {
       setShowSuccess(false);
    }
    return () => clearTimeout(timer);
  }, [isViewingGateway]);

  return (
    <section ref={containerRef} className="py-24 bg-gradient-to-b from-blue-50/50 to-page-bg overflow-hidden relative" style={{ perspective: 1200 }}>
      {/* Decorative wording / title above the UI */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10 px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary tracking-tight">
          You've built your business.<br className="hidden md:block"/> We'll help you scale it.
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          style={{ scale, y, opacity, rotateX, transformStyle: "preserve-3d" }}
          className="relative bg-[#0F172A] rounded-2xl md:rounded-[2rem] p-2 md:p-3 shadow-[0_30px_100px_rgba(0,118,255,0.2)] border border-[#ffffff1a] w-full aspect-[4/3] md:aspect-video mx-auto origin-bottom"
        >
          {/* Top Bar for Browser Chrome feel */}
          <div className="w-full flex items-center px-4 py-2 gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <div className="flex-1 mx-4">
               <div className="bg-white/10 rounded-md h-6 w-full max-w-[300px] mx-auto hidden md:block" />
            </div>
          </div>

          {/* Inner Screen */}
          <div className="bg-page-bg w-full h-[calc(100%-2.5rem)] rounded-xl md:rounded-[1.2rem] overflow-hidden flex relative">
            
            {/* Sidebar */}
            <div className="w-16 md:w-56 bg-sidebar-dark text-sidebar-text h-full flex flex-col pt-6 z-10">
              <div className="flex items-center gap-3 px-4 mb-8">
                 <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/40">
                    <ShoppingCart className="w-4 h-4 text-white" />
                 </div>
                 <span className="hidden md:block font-bold text-white tracking-wide text-lg">CraftoryPOS</span>
              </div>
              <div className="space-y-1.5 px-3">
                 {[
                   { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
                   { icon: <ShoppingCart className="w-4 h-4" />, label: 'POS Billing', active: true },
                   { icon: <Package className="w-4 h-4" />, label: 'Inventory' },
                   { icon: <Users className="w-4 h-4" />, label: 'Customers' },
                   { icon: <BarChart3 className="w-4 h-4" />, label: 'Reports' },
                   { icon: <Settings className="w-4 h-4" />, label: 'Settings' }
                 ].map((item, i) => (
                    <div key={i} className={`h-10 rounded-lg flex items-center justify-center md:justify-start px-3 transition-colors ${item.active ? 'bg-primary/20 text-white' : 'text-sidebar-text/70 hover:bg-white/5'}`}>
                      <div className="shrink-0">{item.icon}</div>
                      <div className="hidden md:block ml-3 font-medium text-sm">{item.label}</div>
                    </div>
                 ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 md:p-8 flex gap-6 relative z-0 opacity-40 md:opacity-100 transition-opacity">
               <div className="flex-1 flex flex-col gap-6">
                 {/* Top Stats */}
                 <div className="flex gap-4">
                   {[
                     { label: "Today's Sales", value: '₹34,500', color: 'text-secondary-green' },
                     { label: 'Orders', value: '142', color: 'text-primary' },
                     { label: 'Active Cart', value: '₹1,245', color: 'text-accent-amber' }
                   ].map((stat, i) => (
                     <div key={i} className="flex-1 bg-white h-24 rounded-xl shadow-sm border border-border/50 p-4 flex flex-col justify-center">
                       <p className="text-xs text-text-muted mb-1">{stat.label}</p>
                       <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                     </div>
                   ))}
                 </div>
                 {/* Main Grid Product Thumbnails */}
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                    {[
                      { name: 'Basmati Rice 5kg', price: '₹650', color: 'from-orange-100 to-orange-50', icon: '🌾' },
                      { name: 'Sunflower Oil 1L', price: '₹145', color: 'from-yellow-100 to-yellow-50', icon: '🛢️' },
                      { name: 'Toor Dal 1kg', price: '₹160', color: 'from-amber-100 to-amber-50', icon: '🥣' },
                      { name: 'Sugar 2kg', price: '₹90', color: 'from-slate-100 to-slate-50', icon: '🍚' },
                      { name: 'Tata Salt 1kg', price: '₹24', color: 'from-blue-100 to-blue-50', icon: '🧂' },
                      { name: 'Aashirvaad Atta 5kg', price: '₹210', color: 'from-orange-200 to-orange-100', icon: '🌾' },
                      { name: 'Taj Mahal Tea 250g', price: '₹140', color: 'from-red-100 to-red-50', icon: '☕' },
                      { name: 'Maggi Noodles 4pk', price: '₹56', color: 'from-yellow-200 to-yellow-100', icon: '🍜' }
                    ].map((prod, i) => (
                      <div key={i} className="bg-white rounded-xl shadow-sm border border-border/50 p-3 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/40 transition-colors cursor-pointer">
                         <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${prod.color}`} />
                         <div className="w-12 h-12 bg-white rounded-full mb-3 relative z-10 flex items-center justify-center text-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                           {prod.icon}
                         </div>
                         <div className="text-xs font-bold text-gray-800 text-center relative z-10 line-clamp-1">{prod.name}</div>
                         <div className="text-[10px] text-gray-500 relative z-10 mt-0.5">{prod.price}</div>
                      </div>
                    ))}
                 </div>
               </div>
               
               {/* Right Panel (Cart / Receipt) */}
               <div className="hidden lg:flex w-80 bg-white rounded-xl shadow-sm border border-border/50 flex-col overflow-hidden relative z-0">
                 <div className="p-4 border-b border-border/50 bg-gray-50 flex justify-between items-center">
                   <div className="text-sm font-bold text-gray-800">Current Order</div>
                   <div className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">#ORD-089</div>
                 </div>
                 <div className="flex-1 p-4 space-y-4 overflow-hidden relative opacity-60">
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
                    {[
                      { name: 'Basmati Rice 5kg', qty: 1, price: '650' },
                      { name: 'Sunflower Oil 1L', qty: 2, price: '290' },
                      { name: 'Toor Dal 1kg', qty: 1, price: '160' },
                      { name: 'Sugar 2kg', qty: 1, price: '90' },
                      { name: 'Maggi Noodles 4pk', qty: 1, price: '56' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3 items-center">
                         <div className="w-8 h-8 rounded border border-gray-100 bg-gray-50 shrink-0 flex items-center justify-center text-xs font-bold text-gray-400">
                           {item.qty}x
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="text-xs font-bold text-gray-800 truncate">{item.name}</div>
                           <div className="text-[10px] text-gray-500">₹{parseInt(item.price) / item.qty} / unit</div>
                         </div>
                         <div className="text-xs font-bold text-gray-800">₹{item.price}</div>
                      </div>
                    ))}
                 </div>
                 <div className="p-4 border-t border-border/50 bg-gray-100 shrink-0 space-y-3 opacity-60">
                    <div className="space-y-1.5 text-xs text-gray-600">
                       <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-800">₹1,246.00</span></div>
                       <div className="flex justify-between"><span>Tax (CGST+SGST)</span><span className="font-medium text-gray-800">₹62.30</span></div>
                       <div className="h-px w-full bg-border/50 my-2" />
                       <div className="flex justify-between items-center mt-2">
                         <span className="text-sm font-bold text-gray-800">Total</span>
                         <span className="text-lg font-extrabold text-primary">₹1,308.30</span>
                       </div>
                    </div>
                 </div>
                 
                 {/* Dark Overlay over Right Panel indicating it's waiting for payment */}
                 <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[1px] z-10 pointer-events-none flex flex-col justify-end p-4 pb-8">
                    <div className="bg-primary/90 text-white rounded-lg p-3 text-center shadow-lg backdrop-blur-md border border-primary/20">
                      <span className="text-sm font-bold block mb-1 animate-pulse">Awaiting Payment...</span>
                    </div>
                 </div>
               </div>
            </div>

            {/* Immersive Payment Gateway Floating Modal (Centered) */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               whileInView={{ opacity: 1, scale: 1, y: 0 }}
               viewport={{ once: false, amount: 0.6 }}
               onViewportEnter={() => setIsViewingGateway(true)}
               onViewportLeave={() => setIsViewingGateway(false)}
               transition={{ delay: 1.2, duration: 0.5, type: "spring", stiffness: 200 }}
               className="absolute left-[50%] md:left-[50%] top-1/2 -translate-x-[50%] -translate-y-1/2 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.4)] rounded-2xl border border-border w-[310px] sm:w-[340px] z-40 flex flex-col overflow-hidden"
            >
               {/* Header */}
               <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center font-bold text-xs">₹</div>
                     <span className="font-bold text-sm text-gray-900">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-secondary-green/10 text-secondary-green px-2 py-1 rounded-md">
                     <div className="w-1.5 h-1.5 rounded-full bg-secondary-green animate-pulse" />
                     <span className="font-bold text-xs">04:59</span>
                  </div>
               </div>
               
               {/* Body: QR Code and details */}
               <div className="p-6 pb-8 flex flex-col items-center relative">
                  <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">Amount to Pay</div>
                  <div className="text-3xl font-black text-gray-900 mb-6 drop-shadow-sm">₹1,308.30</div>
                  
                  {/* QR Code Placeholder with Scanner Animation */}
                  <div className="w-44 h-44 bg-white border-2 border-dashed border-gray-200 rounded-xl p-3 relative flex items-center justify-center mb-6 shadow-sm overflow-hidden group">
                     <motion.div 
                       animate={{ y: [0, 150, 0] }} 
                       transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                       className="absolute top-2 left-2 right-2 h-[2px] bg-primary/60 shadow-[0_0_12px_rgba(0,118,255,1)] z-10" 
                     />
                     <QrCode className="w-full h-full text-gray-200/80" strokeWidth={1} />
                     <div className="absolute inset-0 flex items-center justify-center z-20">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-6 opacity-30 grayscale" />
                     </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold bg-gray-50 px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                     <ScanLine className="w-4 h-4 text-primary" />
                     <span>Scan with any UPI app</span>
                  </div>

                  {/* Success Overlay state triggered by scroll timeout */}
                  <AnimatePresence>
                     {showSuccess && (
                        <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6 border-t border-gray-100"
                        >
                           <motion.div 
                             initial={{ scale: 0, rotate: -45 }}
                             animate={{ scale: 1, rotate: 0 }}
                             transition={{ type: 'spring', bounce: 0.6 }}
                             className="w-16 h-16 rounded-full bg-secondary-green flex items-center justify-center mb-5 text-white shadow-xl shadow-secondary-green/30"
                           >
                              <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />
                           </motion.div>
                           <h3 className="text-xl font-extrabold text-gray-900 mb-2">Payment Successful!</h3>
                           <p className="text-xs text-gray-500 font-medium">Redirecting to receipt in 3 seconds...</p>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </motion.div>

            {/* Subtle Notification Toast (Moved out of the way to top right) */}
            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ delay: 1.8, duration: 0.4 }}
               className="absolute right-4 top-4 bg-[#1E293B]/90 backdrop-blur shadow-xl rounded-xl px-4 py-3 border border-white/10 z-20 flex items-center gap-3 hidden md:flex"
            >
               <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
               <span className="text-xs font-bold text-white">New Online Order Received</span>
            </motion.div>

          </div>
        </motion.div>
      </div>
      
      {/* Decorative background blur to make it pop like Zoho */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </section>
  );
}
