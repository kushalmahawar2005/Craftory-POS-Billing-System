'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, HelpCircle, ChevronDown, Plus, Upload
} from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';

export default function NewProductPage() {
  const router = useRouter();
  const [activeType, setActiveType] = useState('Goods');
  const [productType, setProductType] = useState('Single Product');
  const [returnable, setReturnable] = useState('Yes');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [imageUrl, setImageUrl] = useState('');
  const [imagePublicId, setImagePublicId] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const res = await fetch('/api/categories?flat=true');
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        console.log('Fetched Categories:', data);
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Fetch categories error:', error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#333]">
      {/* Sticky Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-[60] flex items-center justify-between px-6 py-4 shadow-sm">
        <h1 className="text-xl font-bold">New Product</h1>
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="max-w-[1400px] mx-auto py-8 px-6">
        <form className="space-y-12 pb-60">
          
          {/* Section 1: Main Info & Media Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Name */}
              <div className="flex flex-row items-center">
                <label className="w-[200px] shrink-0 text-sm font-semibold text-red-500">Name*</label>
                <div className="flex-1">
                   <input type="text" className="w-[85%] bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-blue-400 font-medium" placeholder="Enter product name" />
                </div>
              </div>

              {/* Type */}
              <div className="flex flex-row items-center">
                <label className="w-[200px] shrink-0 text-sm font-semibold text-gray-400 flex items-center gap-1.5">
                  Type <HelpCircle className="w-3.5 h-3.5" />
                </label>
                <div className="flex-1 flex items-center gap-8">
                   {['Goods', 'Service'].map(t => (
                     <label key={t} className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveType(t)}>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${activeType === t ? 'border-blue-500' : 'border-gray-300'}`}>
                           {activeType === t && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                        </div>
                        <span className="text-sm font-semibold">{t}</span>
                     </label>
                   ))}
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-row items-center">
                <label className="w-[200px] shrink-0 text-sm font-semibold text-gray-500">Category</label>
                <div className="flex-1 relative max-w-[450px]">
                   <select className="w-full bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 text-sm outline-none appearance-none focus:border-blue-400 font-medium disabled:opacity-50" disabled={loading}>
                      <option value="">{loading ? 'Loading categories...' : 'Select a category'}</option>
                      {categories.map((cat, idx) => (
                        <option key={`${cat.id}-${idx}`} value={cat.id}>
                          {cat.fullPath}
                        </option>
                      ))}
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Brand */}
              <div className="flex flex-row items-center">
                <label className="w-[200px] shrink-0 text-sm font-semibold text-gray-500">Brand</label>
                <div className="flex-1 relative max-w-[450px]">
                   <select className="w-full bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 text-sm outline-none appearance-none focus:border-blue-400 font-medium">
                      <option>Select or Add Brand</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Manufacturer */}
              <div className="flex flex-row items-center">
                <label className="w-[200px] shrink-0 text-sm font-semibold text-gray-500">Manufacturer</label>
                <div className="flex-1 relative max-w-[450px]">
                   <select className="w-full bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 text-sm outline-none appearance-none focus:border-blue-400 font-medium">
                      <option>Select or Add Manufacturer</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Right Column: Media */}
            <div className="lg:col-span-4">
               <div className="bg-white border border-gray-100 rounded-lg p-5 space-y-4 shadow-sm">
                  <span className="text-[11px] font-bold text-gray-500 uppercase block mb-2">Product Image</span>
                  <ImageUpload 
                     currentImage={imageUrl}
                     onUpload={(url, publicId) => {
                        setImageUrl(url);
                        setImagePublicId(publicId);
                     }}
                     onDelete={() => {
                        setImageUrl('');
                        setImagePublicId('');
                     }}
                  />
                  <p className="text-[10px] text-gray-400 mt-2 text-center leading-relaxed">
                     Upload a high-quality product image (max 5 MB).
                  </p>
               </div>
            </div>
          </div>

          {/* Section 2: Product Details */}
          <div className="space-y-6 border-t border-gray-200 pt-10">
             <div className="bg-[#f2f4f7] px-6 py-2 -mx-6 mb-6">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Product Details</span>
             </div>

             {/* Product Type */}
             <div className="flex flex-row items-center">
                <label className="w-[200px] shrink-0 text-sm font-bold text-gray-500">Product Type</label>
                <div className="flex p-1 bg-[#f0f3f6] rounded-lg border border-gray-200">
                   {['Single Product', 'Contains Variants'].map(pt => (
                     <button 
                        key={pt}
                        type="button"
                        onClick={() => setProductType(pt)}
                        className={`px-6 py-1.5 rounded-md text-[11px] font-black uppercase transition-all ${productType === pt ? 'bg-white shadow-sm text-blue-600 border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                        {pt}
                     </button>
                   ))}
                </div>
             </div>

             {/* Unit & SKU */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6">
                <div className="flex flex-row items-center">
                   <label className="w-[200px] shrink-0 text-sm font-bold text-red-500 flex items-center gap-1">Unit* <HelpCircle className="w-3.5 h-3.5 text-gray-400" /></label>
                   <div className="flex-1 relative">
                      <select className="w-full bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 text-sm outline-none appearance-none font-bold focus:border-blue-400">
                         <option>Select or type to add</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                   </div>
                </div>
                <div className="flex flex-row items-center">
                   <label className="w-[200px] shrink-0 text-sm font-bold text-gray-400 flex items-center gap-1.5">SKU <HelpCircle className="w-3.5 h-3.5" /></label>
                   <div className="flex-1">
                      <input type="text" className="w-full bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 text-sm outline-none font-bold focus:border-blue-400" />
                   </div>
                </div>
             </div>

             <div className="flex flex-row items-center">
                <div className="w-[200px]"></div>
                <button type="button" className="text-blue-500 text-[13px] font-bold flex items-center gap-2 hover:underline">
                   <Plus className="w-4 h-4" /> Add Identifier
                </button>
             </div>
          </div>

          {/* Section 3: Sales info */}
          <div className="space-y-6 pt-6 mb-6">
             <div className="flex flex-row items-center gap-3">
                <input type="checkbox" className="w-4 h-4 accent-blue-600" defaultChecked />
                <span className="text-[13px] font-bold text-gray-700">Sales Information</span>
             </div>

             <div className="pl-8 grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6">
                <div className="space-y-5">
                   <div className="flex flex-row items-center">
                      <label className="w-[170px] shrink-0 text-sm font-bold text-red-500">Selling Price*</label>
                      <div className="flex-1 flex">
                         <span className="bg-[#f0f3f6] border border-r-0 border-gray-200 px-3 py-2 rounded-l text-[10px] font-black text-gray-400">INR</span>
                         <input type="text" className="w-full bg-[#f9f9f9] border border-gray-200 rounded-r px-3 py-2 outline-none font-bold text-sm focus:border-blue-400" defaultValue="0.00" />
                      </div>
                   </div>
                   <div className="flex flex-row items-center">
                      <label className="w-[170px] shrink-0 text-sm font-bold text-red-500">Account*</label>
                      <select className="flex-1 bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 outline-none font-bold text-sm focus:border-blue-400 bg-white">
                         <option>Sales</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-5">
                   <div className="flex flex-row items-center">
                      <label className="w-[170px] shrink-0 text-sm font-bold text-gray-400 flex items-center gap-1.5">MRP <HelpCircle className="w-3.5 h-3.5" /></label>
                      <input type="text" className="flex-1 bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 outline-none font-bold text-sm focus:border-blue-400" />
                   </div>
                   <div className="flex flex-row items-start">
                      <label className="w-[170px] shrink-0 text-sm font-bold text-gray-400 mt-2">Description</label>
                      <textarea className="flex-1 bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 outline-none text-sm h-20 resize-none focus:border-blue-400" />
                   </div>
                </div>
             </div>
          </div>

          {/* Section 4: Purchase Info */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
             <div className="flex flex-row items-center gap-3">
                <input type="checkbox" className="w-4 h-4 accent-blue-600" defaultChecked />
                <span className="text-[13px] font-bold text-gray-700">Purchase Information</span>
             </div>

             <div className="pl-8 grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6">
                <div className="space-y-5">
                   <div className="flex flex-row items-center">
                      <label className="w-[170px] shrink-0 text-sm font-bold text-red-500">Cost Price*</label>
                      <div className="flex-1 flex">
                         <span className="bg-[#f0f3f6] border border-r-0 border-gray-200 px-3 py-2 rounded-l text-[10px] font-black text-gray-400">INR</span>
                         <input type="text" className="w-full bg-[#f9f9f9] border border-gray-200 rounded-r px-3 py-2 outline-none font-bold text-sm focus:border-blue-400" defaultValue="0.00" />
                      </div>
                   </div>
                   <div className="flex flex-row items-start">
                      <label className="w-[170px] shrink-0 text-sm font-bold text-gray-400 mt-2">Description</label>
                      <textarea className="flex-1 bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 outline-none text-sm h-20 resize-none focus:border-blue-400" />
                   </div>
                </div>
                <div className="space-y-5">
                   <div className="flex flex-row items-center">
                      <label className="w-[170px] shrink-0 text-sm font-bold text-gray-400">Account*</label>
                      <select className="flex-1 bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 outline-none font-bold text-sm focus:border-blue-400 bg-white">
                         <option>Cost of Goods Sold</option>
                      </select>
                   </div>
                   <div className="flex flex-row items-center">
                      <label className="w-[170px] shrink-0 text-sm font-bold text-gray-400">Preferred Vendor</label>
                      <select className="flex-1 bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 outline-none font-bold text-sm focus:border-blue-400 bg-white">
                         <option>Select a Vendor</option>
                      </select>
                   </div>
                </div>
             </div>
          </div>

          {/* Section 5: Inventory Tracking */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
             <div className="flex flex-row items-center gap-3">
                <input type="checkbox" className="w-4 h-4 accent-blue-600" defaultChecked />
                <span className="text-[13px] font-bold text-gray-700">Track Inventory for this product</span>
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 ml-1" />
             </div>

             <div className="pl-8 space-y-6">
                <p className="text-[11px] text-gray-400 italic">You cannot enable/disable inventory tracking once you've created transactions for this product.</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6">
                   <div className="space-y-5">
                      <div className="flex flex-row items-center">
                         <label className="w-[170px] shrink-0 text-sm font-bold text-red-500">Inventory Account*</label>
                         <select className="flex-1 bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 outline-none font-bold text-sm focus:border-blue-400 bg-white">
                            <option>Select an account</option>
                         </select>
                      </div>
                      <div className="flex flex-row items-center">
                         <label className="w-[170px] shrink-0 text-sm font-bold text-gray-400">Reorder Point</label>
                         <input type="text" className="flex-1 bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 outline-none font-bold text-sm focus:border-blue-400" />
                      </div>
                   </div>
                   <div className="space-y-5">
                      <div className="flex flex-row items-center">
                         <label className="w-[170px] shrink-0 text-sm font-bold text-red-500 flex items-center gap-1.5">Valuation Method* <HelpCircle className="w-3.5 h-3.5" /></label>
                         <select className="flex-1 bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 outline-none font-bold text-sm focus:border-blue-400 bg-white">
                            <option>Select the valuation method</option>
                         </select>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Section 6: Cancellation and Returns */}
          <div className="space-y-6 pt-10 border-t border-gray-200">
             <h3 className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">Cancellation and Returns</h3>
             <div className="pl-8 flex flex-row items-center pt-2">
                <label className="w-[200px] shrink-0 text-sm font-bold text-gray-400 flex items-center gap-1.5 text-sm uppercase tracking-tight">Returnable Product <HelpCircle className="w-3.5 h-3.5" /></label>
                <div className="flex-1 flex items-center gap-10">
                   {['Yes', 'No'].map(r => (
                     <label key={r} className="flex items-center gap-2 cursor-pointer" onClick={() => setReturnable(r)}>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${returnable === r ? 'border-blue-500' : 'border-gray-300'}`}>
                           {returnable === r && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                        </div>
                        <span className="text-sm font-semibold">{r}</span>
                     </label>
                   ))}
                </div>
             </div>
          </div>

          {/* Section 7: Fulfilment Details */}
          <div className="space-y-6 pt-10 border-t border-gray-200">
             <h3 className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">Fulfilment Details</h3>
             <div className="pl-8 space-y-8">
                <div className="flex flex-row items-center">
                   <label className="w-[200px] shrink-0 text-sm font-bold text-gray-400 uppercase tracking-tight">Dimensions</label>
                   <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center gap-2 max-w-sm">
                         <div className="flex border border-gray-200 rounded overflow-hidden">
                           <input type="text" placeholder="L" className="w-20 bg-[#f9f9f9] py-2 outline-none text-center font-bold text-sm border-r border-gray-100" />
                           <span className="bg-[#f0f3f6] px-3 py-2 text-[10px] text-gray-300 font-bold border-r border-gray-100 flex items-center">x</span>
                           <input type="text" placeholder="W" className="w-20 bg-[#f9f9f9] py-2 outline-none text-center font-bold text-sm border-r border-gray-100" />
                           <span className="bg-[#f0f3f6] px-3 py-2 text-[10px] text-gray-300 font-bold border-r border-gray-100 flex items-center">x</span>
                           <input type="text" placeholder="H" className="w-20 bg-[#f9f9f9] py-2 outline-none text-center font-bold text-sm" />
                         </div>
                         <select className="bg-[#f0f3f6] border border-gray-200 rounded px-3 py-2 text-[10px] font-black outline-none uppercase">
                           <option>cm</option>
                         </select>
                      </div>
                      <span className="text-[10px] font-bold italic text-gray-400">(Length X Width X Height)</span>
                   </div>
                </div>

                <div className="flex flex-row items-center group">
                   <label className="w-[200px] shrink-0 text-sm font-bold text-gray-400 uppercase tracking-tight">Weight</label>
                   <div className="flex-1 flex items-center gap-2 max-w-xs">
                      <input type="text" className="w-56 bg-[#f9f9f9] border border-gray-200 rounded px-3 py-2 outline-none font-bold text-sm focus:border-blue-400" />
                      <select className="bg-[#f0f3f6] border border-gray-200 rounded px-3 py-2 text-[10px] font-black outline-none uppercase">
                        <option>kg</option>
                      </select>
                   </div>
                </div>
             </div>
          </div>

        </form>
      </div>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#fcfcfc] border-t border-gray-200 px-6 py-4 flex items-center z-50 lg:pl-[240px]">
         <div className="max-w-[1400px] mx-auto w-full flex items-center gap-3">
            <button className="px-8 py-2 bg-blue-600 text-white text-[13px] font-bold rounded shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-all uppercase tracking-wide">
              Save
            </button>
            <button 
              onClick={() => router.back()}
              className="px-8 py-2 bg-white border border-gray-300 text-gray-700 text-[13px] font-bold rounded hover:bg-gray-50 transition-all uppercase tracking-wide"
            >
              Cancel
            </button>
         </div>
      </footer>
    </div>
  );
}
