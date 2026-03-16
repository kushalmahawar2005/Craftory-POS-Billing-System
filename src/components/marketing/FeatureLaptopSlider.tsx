'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Receipt, Package, Box, BarChart3, Users, Store, FileText, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

const featureData = [
  { id: 'billing', icon: Receipt, title: 'Smart Billing', desc: 'Create invoices in seconds with barcode scanning, GST calculations, and thermal printing.', color: 'from-blue-500 to-blue-600', mockupType: 'invoice' },
  { id: 'inventory', icon: Package, title: 'Inventory Management', desc: 'Real-time stock tracking with low-stock alerts and automated reorder points.', color: 'from-amber-500 to-amber-600', mockupType: 'inventory' },
  { id: 'products', icon: Box, title: 'Product Management', desc: 'Organize products with categories, variants, pricing tiers, and batch tracking.', color: 'from-emerald-500 to-emerald-600', mockupType: 'grid' },
  { id: 'reports', icon: BarChart3, title: 'Sales Reports', desc: 'Comprehensive analytics with daily, weekly, and monthly sales insights.', color: 'from-purple-500 to-purple-600', mockupType: 'chart' },
  { id: 'customers', icon: Users, title: 'Customer Management', desc: 'Build customer profiles with purchase history, loyalty points, and credit tracking.', color: 'from-pink-500 to-rose-600', mockupType: 'list' },
  { id: 'multistore', icon: Store, title: 'Multi-Store Support', desc: 'Manage multiple store locations from a single unified dashboard.', color: 'from-indigo-500 to-indigo-600', mockupType: 'map' },
  { id: 'gst', icon: FileText, title: 'GST Billing', desc: 'Auto-calculate GST with CGST, SGST, IGST support and generate GST-compliant invoices.', color: 'from-cyan-500 to-blue-600', mockupType: 'tax' },
  { id: 'whatsapp', icon: MessageSquare, title: 'WhatsApp Invoices', desc: 'Send digital invoices directly to customers via WhatsApp integration.', color: 'from-green-500 to-emerald-600', mockupType: 'chat' }
];

export default function FeatureLaptopSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Custom Cursor State
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 32); // Offset so center of 64px circle is at mouse
      cursorY.set(e.clientY - 32);
    };
    
    // Only listen when hovering
    if (isHovering) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovering, cursorX, cursorY]);

  // Determine which slide is most visible based on scrolling
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const children = Array.from(scrollRef.current.children);
    
    let closestIndex = 0;
    let minDistance = Infinity;

    // We target the center of the screen as the "active" zone
    const targetFocusPoint = window.innerWidth * 0.5; 

    children.forEach((child, index) => {
      const rect = child.getBoundingClientRect();
      const centerOfChild = rect.left + rect.width / 2;
      
      const distance = Math.abs(centerOfChild - targetFocusPoint);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div 
      className="w-full relative py-12 overflow-hidden mx-auto bg-grid-slate-100/[0.04]" 
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      // Hide default cursor over this section to allow the custom one to shine
      style={{ cursor: 'none' }}
    >
       <h3 className="text-center text-sm font-bold text-gray-400 mb-12 uppercase tracking-widest flex items-center justify-center gap-2">
         <div className="w-8 h-px bg-gray-300"/> Swift Swipe <div className="w-8 h-px bg-gray-300"/>
       </h3>

       {/* Native horizontally scrolling container equipped with CSS scroll snapping */}
       <div 
         ref={scrollRef}
         className="flex gap-4 sm:gap-8 overflow-x-auto snap-x snap-mandatory px-[15vw] lg:px-[20vw] pb-12 scrollbar-hide"
         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
       >
         {featureData.map((feature, idx) => (
           <div key={feature.id} className="snap-center shrink-0 block border-transparent outline-none">
             <LaptopSlide feature={feature} isActive={idx === activeIndex} />
           </div>
         ))}
         {/* Blank spacer at the very end to ensure last item can be perfectly centered */}
         <div className="w-[15vw] lg:w-[20vw] shrink-0" />
       </div>

       {/* Floating Custom Cursor Bubble */}
       <motion.div
         className="fixed top-0 left-0 w-16 h-16 bg-primary/90 text-white rounded-full flex items-center justify-center pointer-events-none z-50 shadow-xl backdrop-blur-sm border border-white/20"
         style={{ x: cursorXSpring, y: cursorYSpring, opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
         transition={{ opacity: { duration: 0.2 } }}
       >
         <div className="flex items-center gap-0.5">
           <ChevronLeft className="w-4 h-4" strokeWidth={3} />
           <ChevronRight className="w-4 h-4" strokeWidth={3} />
         </div>
       </motion.div>
    </div>
  );
}

function LaptopSlide({ feature, isActive }: { feature: any, isActive: boolean }) {
  const Icon = feature.icon;
  
  return (
    <div className="w-[300px] sm:w-[340px] md:w-[400px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col justify-end h-[350px]">
       
       {/* 
         The Laptop Base + Screen wrapper 
         Using flat 2D scaling as requested by analyzing Zoho's actual mobile slider
       */}
       <div 
         className={`w-full h-full rounded-2xl rounded-b-[4px] border-[8px] sm:border-[10px] shadow-2xl overflow-hidden flex flex-col relative transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
            ${isActive 
              ? 'scale-100 border-[#0F172A] z-20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]' 
              : 'scale-[0.85] border-[#1E293B] z-10 opacity-90'
            }
         `}
       >
          {/* Top Bar for Browser Chrome feel */}
          <div className="w-full flex items-center px-4 py-2 gap-1.5 bg-[#0F172A] border-b border-white/5 shrink-0">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500/80' : 'bg-red-500/40'}`} />
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-yellow-500/80' : 'bg-yellow-500/40'}`} />
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500/80' : 'bg-green-500/40'}`} />
            <div className="flex-1 mx-4">
               <div className="bg-white/10 rounded-md h-3 w-full max-w-[120px] mx-auto opacity-50" />
            </div>
          </div>
          
          {/* Laptop Screen Content - Clean Abstracted UI based on feature */}
          <div className="flex-1 bg-white relative overflow-hidden flex flex-col p-4 sm:p-5">
             
             {/* The Zoho-style Heavy Blue Tint Overlay for Inactive Items */}
             <div 
               className={`absolute inset-0 bg-[#1A6BDB]/90 mix-blend-multiply transition-opacity duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none z-[60]
                  ${isActive ? 'opacity-0' : 'opacity-[0.85]'}
               `}
             />
             
             {/* Dynamic Top Layer for Title/Icon representing feature */}
             <div className="flex items-center gap-3 mb-4 shrink-0 mt-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg relative z-20`}>
                   <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-extrabold text-base sm:text-lg text-gray-900 tracking-tight relative z-20">{feature.title}</div>
             </div>
             
             {/* Small descriptive text inside the screen */}
             <p className="text-[12px] sm:text-[13px] text-gray-600 font-medium leading-relaxed mb-5 line-clamp-3 relative z-20 shrink-0 pr-2">
               {feature.desc}
             </p>

             {/* Mockups based on mockupType */}
             <div className="flex-1 rounded-xl bg-gray-50 border border-gray-100 p-3 flex flex-col gap-3 overflow-hidden relative z-20 shadow-inner">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white/90 pointer-events-none z-10"/>
               
               {feature.mockupType === 'invoice' && (
                 <>
                   <div className="h-8 w-full flex justify-between items-center border-b border-gray-200 pb-1.5"><div className="w-20 h-2 bg-gray-300 rounded"/><div className="w-12 h-3 bg-blue-100 rounded"/></div>
                   <div className="flex justify-between items-center"><div className="w-1/2 h-1.5 bg-gray-200 rounded"/><div className="w-6 h-1.5 bg-gray-300 rounded"/></div>
                   <div className="flex justify-between items-center"><div className="w-1/3 h-1.5 bg-gray-200 rounded"/><div className="w-6 h-1.5 bg-gray-300 rounded"/></div>
                   <div className="flex justify-between items-center"><div className="w-1/4 h-1.5 bg-gray-200 rounded"/><div className="w-6 h-1.5 bg-gray-300 rounded"/></div>
                   <div className="h-px w-full bg-gray-200 my-1 font-bold text-gray-900 border-t border-gray-200 pt-1.5 flex justify-between"><div className="w-12 h-2.5 bg-gray-400 rounded"/><div className="w-16 h-3 bg-blue-500 rounded"/></div>
                 </>
               )}
               {feature.mockupType === 'inventory' && (
                 <>
                   <div className="flex gap-3">
                     <div className="w-6 h-6 bg-orange-100 rounded-lg"/>
                     <div className="flex-1 pt-1"><div className="h-2 w-full bg-gray-200 rounded mb-1.5"/><div className="h-1.5 w-1/2 bg-gray-300 rounded"/></div>
                     <div className="w-8 h-2.5 bg-red-400 rounded mt-1"/>
                   </div>
                   <div className="flex gap-3">
                     <div className="w-6 h-6 bg-green-100 rounded-lg"/>
                     <div className="flex-1 pt-1"><div className="h-2 w-full bg-gray-200 rounded mb-1.5"/><div className="h-1.5 w-1/3 bg-gray-300 rounded"/></div>
                     <div className="w-8 h-2.5 bg-green-400 rounded mt-1"/>
                   </div>
                 </>
               )}
               {feature.mockupType === 'grid' && (
                 <div className="grid grid-cols-3 gap-2">
                   {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center shadow-sm"><div className="w-1/2 h-1/2 bg-white/50 rounded-sm"/></div>)}
                 </div>
               )}
               {feature.mockupType === 'chart' && (
                 <div className="flex-1 flex items-end gap-2 justify-around mt-4">
                   {[40, 70, 45, 90, 60, 80, 50, 100].map((h, i) => <div key={i} style={{height: `${h}%`}} className="w-4 bg-purple-200 rounded-t-sm"><div className="w-full h-full bg-gradient-to-t from-purple-500 to-transparent opacity-60"/></div>)}
                 </div>
               )}
               {(feature.mockupType === 'list' || feature.mockupType === 'tax') && (
                 <div className="flex flex-col gap-2">
                    {[1,2,3,4].map(i => <div key={i} className="w-full h-8 bg-white border border-gray-100 rounded-lg flex items-center px-2 shadow-sm"><div className="w-5 h-5 rounded-full bg-gray-200 mr-3"/><div className="h-2 w-20 bg-gray-300 rounded"/></div>)}
                 </div>
               )}
               {feature.mockupType === 'map' && (
                 <div className="w-full h-full bg-indigo-50/50 rounded-lg relative overflow-hidden flex items-center justify-center">
                    <div className="w-24 h-24 border border-indigo-200 rounded-full absolute" />
                    <div className="w-12 h-12 border border-indigo-300 rounded-full absolute" />
                    <div className="w-3 h-3 bg-indigo-500 rounded-full absolute z-10 shadow-lg shadow-indigo-500/50" />
                 </div>
               )}
               {feature.mockupType === 'chat' && (
                 <div className="flex flex-col gap-2.5 p-1">
                    <div className="w-3/4 h-6 bg-green-100 rounded-2xl rounded-tl-none self-start flex items-center px-3 shadow-sm"><div className="w-1/2 h-1.5 bg-green-600/30 rounded"/></div>
                    <div className="w-2/3 h-6 bg-gray-100 rounded-2xl rounded-tr-none self-end flex items-center px-3 justify-end shadow-sm"><div className="w-1/3 h-1.5 bg-gray-400/50 rounded"/></div>
                    <div className="w-1/2 h-6 bg-green-100 rounded-2xl rounded-tl-none self-start flex items-center px-3 shadow-sm"><div className="w-3/4 h-1.5 bg-green-600/30 rounded"/></div>
                 </div>
               )}
             </div>
          </div>
       </div>
       
       {/* Laptop Bottom Base plate (the keyboard deck slice) */}
       <div 
          className={`w-[110%] -ml-[5%] h-3 sm:h-4 rounded-b-2xl border-t border-white/10 shadow-2xl relative transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shrink-0
             ${isActive 
               ? 'bg-gradient-to-b from-[#253245] to-[#0F172A] scale-100 opacity-100' 
               : 'bg-gradient-to-b from-[#1E293B] to-[#0B0F19] scale-[0.85] opacity-50'
             }
          `}
        >
         <div className="w-1/3 h-1 relative mx-auto bg-black/40 rounded-b-sm shadow-inner" />
       </div>
    </div>
  );
}
