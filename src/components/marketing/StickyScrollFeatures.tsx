'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const features = [
  {
    id: 'inventory',
    title: 'Never run out of stock again',
    description: 'Gone are the days of being out-of-stock. Have the right stock at the right time with Craftory POS. Reorder items exactly when they\'re needed by setting reorder and alert points for your inventory.',
    label: 'INVENTORY MANAGEMENT',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800&h=600'
  },
  {
    id: 'mobile',
    title: 'Scan, sell, and manage instantly',
    description: 'Speed up your checkout lines drastically. Our interface is heavily optimized for fast barcode scanning, quick action hotkeys, and seamless thermal printer integration.',
    label: 'LIGHTNING FAST BILLING',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&q=80&w=800&h=600'
  },
  {
    id: 'reports',
    title: 'Make decisions based on real data',
    description: 'Stop guessing what sells best. Our intelligent reports give you a clear view of your top-performing products, seasonal trends, and profit margins. Instantly generate GST-compliant summaries.',
    label: 'REPORTS & ANALYTICS',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=600'
  }
];

export default function StickyScrollFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="py-24 bg-page-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-6">Discover what Craftory POS can do for your store</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-24 relative items-start">
          
          {/* Left Side - Scrolling Text */}
          <div className="w-full md:w-5/12 pb-[10vh] md:py-[10vh]">
             {features.map((feature, index) => (
                <FeatureText 
                  key={feature.id} 
                  feature={feature} 
                  index={index} 
                  setActiveFeature={setActiveFeature} 
                />
             ))}
          </div>

          {/* Right Side - Sticky Image */}
          <div className="hidden md:block w-full md:w-7/12 sticky top-32 h-[500px] lg:h-[600px] transition-all">
             <div className="w-full h-full relative rounded-3xl overflow-hidden bg-gray-50 shadow-2xl shadow-primary/10 border border-border/50">
               <AnimatePresence mode="wait">
                 <motion.img
                   key={activeFeature}
                   initial={{ opacity: 0, scale: 1.05 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 0.5, ease: "easeInOut" }}
                   src={features[activeFeature].image}
                   alt={features[activeFeature].title}
                   className="absolute inset-0 w-full h-full object-cover"
                 />
               </AnimatePresence>
               {/* Optional overlay gradient to make it look premium */}
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent pointer-events-none" />
               
               {/* Small floating indicator */}
               <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white z-10">
                 <span className="text-sm font-bold tracking-wide drop-shadow-md">{features[activeFeature].label}</span>
                 <div className="flex gap-2">
                   {features.map((_, i) => (
                     <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === activeFeature ? 'bg-white scale-125' : 'bg-white/40'}`} />
                   ))}
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function FeatureText({ feature, index, setActiveFeature }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  // When this component enters the center of the viewport, update the active feature
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // If it's roughly near the center of its scroll progress, trigger the switch.
      if (latest > 0.4 && latest < 0.6) {
        setActiveFeature(index);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, index, setActiveFeature]);

  // Transform opacity so it fades out slightly when scrolling past
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.3, 1, 1, 0.3]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity }}
      className="min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center py-12"
    >
      <div className="text-secondary-green font-extrabold text-xs tracking-widest uppercase mb-5">{feature.label}</div>
      <h3 className="text-3xl lg:text-4xl font-extrabold text-text-primary mb-6 leading-tight tracking-tight">{feature.title}</h3>
      <p className="text-lg text-text-muted leading-relaxed">
        {feature.description}
      </p>
      
      {/* Small mobile image (visible only on mobile) */}
      <div className="block md:hidden mt-10 w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-border/50 relative">
         <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}
