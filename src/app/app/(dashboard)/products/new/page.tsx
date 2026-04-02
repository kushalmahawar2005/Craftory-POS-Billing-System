'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
   X, HelpCircle, ChevronDown, Plus, Upload, Package, ArrowRight,
   Info, AlertCircle, Save, RotateCcw, Search, Trash2, Edit2,
   PlusCircle, CheckCircle2, ChevronUp, Image as ImageIcon, Box,
   Loader2, Check, Settings2, Tag, Store, Layers
} from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewProductPage() {
   const router = useRouter();

   // Basic states
   const [name, setName] = useState('');
   const [activeType, setActiveType] = useState('Goods');
   const [sku, setSku] = useState('');
   const [barcode, setBarcode] = useState('');

   // Pricing/Stock states
   const [sellingPrice, setSellingPrice] = useState('0.00');
   const [costPrice, setCostPrice] = useState('0.00');
   const [taxRate, setTaxRate] = useState('18');
   const [openingStock, setOpeningStock] = useState('0');
   const [reorderLevel, setReorderLevel] = useState('0');
   const [description, setDescription] = useState('');

   // Taxonomy states
   const [categories, setCategories] = useState<any[]>([]);
   const [selectedCategory, setSelectedCategory] = useState<any>(null);
   const [brands, setBrands] = useState<any[]>([]);
   const [selectedBrand, setSelectedBrand] = useState<any>(null);
   const [units, setUnits] = useState<any[]>([]);
   const [selectedUnit, setSelectedUnit] = useState<any>(null);
   const [manufacturers, setManufacturers] = useState<any[]>([]);
   const [selectedManufacturer, setSelectedManufacturer] = useState<any>(null);

   // Images
   const [frontImage, setFrontImage] = useState({ url: '', publicId: '' });
   const [rearImage, setRearImage] = useState({ url: '', publicId: '' });
   const [gallery, setGallery] = useState<{ url: string; publicId: string }[]>([]);

   // Control States
   const [isSaving, setIsSaving] = useState(false);
   const [itemType, setItemType] = useState<'Single Item' | 'Contains Variants'>('Single Item');

   // Variants Logic
   const [attributes, setAttributes] = useState<{ id: string, name: string, values: string[] }[]>([]);
   const [variants, setVariants] = useState<any[]>([]);

   useEffect(() => {
      if (itemType === 'Contains Variants' && attributes.length > 0) {
         generateVariants();
      }
   }, [attributes, itemType]);

   const generateVariants = () => {
      // Cartesian product logic
      const attrValues = attributes.filter(a => a.values.length > 0).map(a => a.values.map(v => ({ [a.name]: v })));
      if (attrValues.length === 0) return setVariants([]);

      const cartesian = attrValues.reduce((a, b) => a.flatMap(d => b.map(e => ({ ...d, ...e }))));

      setVariants(cartesian.map((v: any, i: number) => ({
         sku: `${sku}-${i + 1}`,
         price: sellingPrice,
         stock: openingStock,
         attributes: v
      })));
   };
   const [loadingInitial, setLoadingInitial] = useState(true);

   // Modals & Search
   const [showManageCategories, setShowManageCategories] = useState(false);
   const [showManageBrands, setShowManageBrands] = useState(false);
   const [showManageManufacturers, setShowManageManufacturers] = useState(false);
   const [showManageUnits, setShowManageUnits] = useState(false);

   const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
   const [showBrandDropdown, setShowBrandDropdown] = useState(false);
   const [showManufacturerDropdown, setShowManufacturerDropdown] = useState(false);
   const [showUnitDropdown, setShowUnitDropdown] = useState(false);

   // Modal & Search Inputs
   const [newCatName, setNewCatName] = useState('');
   const [newBrandName, setNewBrandName] = useState('');
   const [newManufacturerName, setNewManufacturerName] = useState('');
   const [newUnitName, setNewUnitName] = useState('');

   const [searchCategory, setSearchCategory] = useState('');
   const [searchBrand, setSearchBrand] = useState('');
   const [searchManufacturer, setSearchManufacturer] = useState('');
   const [searchUnit, setSearchUnit] = useState('');

   // Initial Data Load
   const fetchMetadata = async () => {
      try {
         const [catRes, brandRes, unitRes, manRes] = await Promise.all([
            fetch('/api/categories?flat=true').then(r => r.json()),
            fetch('/api/brands').then(r => r.json()),
            fetch('/api/units').then(r => r.json()),
            fetch('/api/manufacturers').then(r => r.json()),
         ]);
         setCategories(Array.isArray(catRes) ? catRes : []);
         setBrands(Array.isArray(brandRes) ? brandRes : []);
         setUnits(Array.isArray(unitRes) ? unitRes : []);
         setManufacturers(Array.isArray(manRes) ? manRes : []);
      } catch (e) { console.error('Data load error:', e); }
      finally { setLoadingInitial(false); }
   };

   useEffect(() => { fetchMetadata(); }, []);

   // Creation Actions
   const handleAddCategory = async () => {
      if (!newCatName) return;
      try {
         const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCatName })
         });
         if (res.ok) {
            setNewCatName('');
            await fetchMetadata();
         }
      } catch (e) { console.error(e); }
   };

   const handleAddBrand = async () => {
      if (!newBrandName) return;
      try {
         const res = await fetch('/api/brands', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newBrandName })
         });
         if (res.ok) {
            setNewBrandName('');
            await fetchMetadata();
         }
      } catch (e) { console.error(e); }
   };

   const handleAddManufacturer = async () => {
      if (!newManufacturerName) return;
      try {
         const res = await fetch('/api/manufacturers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newManufacturerName })
         });
         if (res.ok) {
            setNewManufacturerName('');
            await fetchMetadata();
         }
      } catch (e) { console.error(e); }
   };

   const handleAddUnit = async () => {
      if (!newUnitName) return;
      try {
         const res = await fetch('/api/units', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newUnitName })
         });
         if (res.ok) {
            setNewUnitName('');
            await fetchMetadata();
         }
      } catch (e) { console.error(e); }
   };

   const handleSave = async () => {
      if (!name || isSaving) return alert('Name is required');
      setIsSaving(true);
      try {
         const payload = {
            name, itemType: activeType, categoryId: selectedCategory?.id,
            brandId: selectedBrand?.id, unitId: selectedUnit?.id,
            manufacturerId: selectedManufacturer?.id,
            sku, barcode, price: parseFloat(sellingPrice), costPrice: parseFloat(costPrice),
            taxRate: parseFloat(taxRate), stockQuantity: parseInt(openingStock),
            reorderLevel: parseInt(reorderLevel), description,
            frontImageUrl: frontImage.url, frontImagePublicId: frontImage.publicId,
            rearImageUrl: rearImage.url, rearImagePublicId: rearImage.publicId,
            gallery, hasVariants: itemType === 'Contains Variants'
         };

         const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
         });
         if (!res.ok) throw new Error('Save failed');
         router.push('/app/products');
      } catch (e) { alert('Failed to save'); }
      finally { setIsSaving(false); }
   };

   return (
      <div className="min-h-screen bg-[#f5f7f9] text-[#1e2128]">
         {/* HEADER */}
         <header className="fixed top-0 right-0 left-0 lg:left-[298px] z-50 h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-10 shadow-sm">
            <h1 className="text-xl font-bold text-gray-800 uppercase tracking-widest">New Item</h1>
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-900 transition-all p-3 rounded-full hover:bg-gray-100">
               <X className="w-5 h-5" />
            </button>
         </header>

         {/* MAIN FORM */}
         <main className="pt-[90px] pb-[120px] px-10 transition-all max-w-[1400px] mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 space-y-16">
               <div className="grid grid-cols-12 gap-16 items-start">
                  <div className="col-span-12 lg:col-span-7 space-y-10">
                     <div className="flex items-start gap-10">
                        <label className="w-32 shrink-0 text-[13px] font-bold text-red-500 mt-2.5">Name*</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Entry item name" className="flex-1 px-4 py-2 border border-gray-200 rounded text-[14px] focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none" />
                     </div>
                     <div className="flex items-center gap-10">
                        <label className="w-32 shrink-0 text-[13px] font-bold text-gray-500 flex items-center gap-1">Type <HelpCircle className="w-3.5 h-3.5 text-gray-300" /></label>
                        <div className="flex items-center gap-8">
                           {['Goods', 'Service'].map(t => (
                              <button key={t} type="button" onClick={() => setActiveType(t)} className="flex items-center gap-2 group">
                                 <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${activeType === t ? 'border-blue-600 bg-white ring-4 ring-blue-50' : 'border-gray-200 group-hover:border-gray-400'}`}>
                                    {activeType === t && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                 </div>
                                 <span className={`text-[13px] font-bold ${activeType === t ? 'text-gray-900' : 'text-gray-500'}`}>{t}</span>
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="flex items-center gap-10">
                        <label className="w-32 shrink-0 text-[13px] font-bold text-gray-500">Category</label>
                        <div className="flex-1 relative">
                           <div onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="flex items-center justify-between w-full px-4 py-2 border border-gray-200 rounded text-[14px] cursor-pointer hover:border-blue-400 bg-white group transition-all">
                              <span className={selectedCategory ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'}>{selectedCategory?.name || 'Select a category'}</span>
                              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                           </div>
                           <AnimatePresence>
                              {showCategoryDropdown && (
                                 <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 z-[60] mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden">
                                    <div className="p-2 border-b border-gray-50 flex items-center bg-gray-50/30">
                                       <Search className="w-4 h-4 text-gray-300 ml-2" />
                                       <input type="text" autoFocus placeholder="Search categories..." className="w-full px-3 py-2 bg-transparent text-[13px] font-medium outline-none placeholder:text-gray-300" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} />
                                    </div>
                                    <div className="max-h-[200px] overflow-y-auto no-scrollbar py-1">
                                       {categories.filter(c => c.name.toLowerCase().includes(searchCategory.toLowerCase())).length > 0 ? (
                                          categories.filter(c => c.name.toLowerCase().includes(searchCategory.toLowerCase())).map(cat => (
                                             <button key={cat.id} onClick={() => { setSelectedCategory(cat); setShowCategoryDropdown(false); }} className="w-full text-left px-5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-between group">
                                                {cat.name}
                                                {selectedCategory?.id === cat.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                             </button>
                                          ))
                                       ) : (
                                          <div className="px-5 py-4 text-[12px] text-gray-400 text-center font-medium italic">No matches found</div>
                                       )}
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); setShowManageCategories(true); setShowCategoryDropdown(false); }} className="w-full bg-[#f8fbff] py-3 px-5 text-left text-[11px] font-black text-[#1a6bdb] hover:bg-[#eff6ff] border-t border-blue-50 flex items-center gap-2 transition-all uppercase tracking-widest">
                                       <PlusCircle className="w-3.5 h-3.5" /> Manage Categories
                                    </button>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     </div>
                     <div className="flex items-center gap-10">
                        <label className="w-32 shrink-0 text-[13px] font-bold text-gray-500">Brand</label>
                        <div className="flex-1 relative">
                           <div onClick={() => setShowBrandDropdown(!showBrandDropdown)} className="flex items-center justify-between w-full px-4 py-2 border border-gray-200 rounded text-[14px] cursor-pointer hover:border-blue-400 bg-white group transition-all">
                              <span className={selectedBrand ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'}>{selectedBrand?.name || 'Select or Add Brand'}</span>
                              <ChevronUPDown className="w-4 h-4 text-gray-400" />
                           </div>
                           <AnimatePresence>
                              {showBrandDropdown && (
                                 <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 z-[60] mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden">
                                    <div className="p-2 border-b border-gray-50 flex items-center bg-gray-50/30">
                                       <Search className="w-4 h-4 text-gray-300 ml-2" />
                                       <input type="text" autoFocus placeholder="Search brands..." className="w-full px-3 py-2 bg-transparent text-[13px] font-medium outline-none placeholder:text-gray-300" value={searchBrand} onChange={(e) => setSearchBrand(e.target.value)} />
                                    </div>
                                    <div className="max-h-[200px] overflow-y-auto no-scrollbar py-1">
                                       {brands.filter(b => b.name.toLowerCase().includes(searchBrand.toLowerCase())).length > 0 ? (
                                          brands.filter(b => b.name.toLowerCase().includes(searchBrand.toLowerCase())).map(brand => (
                                             <button key={brand.id} onClick={() => { setSelectedBrand(brand); setShowBrandDropdown(false); }} className="w-full text-left px-5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-between group">
                                                {brand.name}
                                                {selectedBrand?.id === brand.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                             </button>
                                          ))
                                       ) : (
                                          <div className="px-5 py-4 text-[12px] text-gray-400 text-center font-medium italic">No matches found</div>
                                       )}
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); setShowManageBrands(true); setShowBrandDropdown(false); }} className="w-full bg-[#f8fbff] py-3 px-5 text-left text-[11px] font-black text-[#1a6bdb] hover:bg-[#eff6ff] border-t border-blue-50 flex items-center gap-2 transition-all uppercase tracking-widest">
                                       <PlusCircle className="w-3.5 h-3.5" /> Manage Brands
                                    </button>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     </div>
                     <div className="flex items-center gap-10">
                        <label className="w-32 shrink-0 text-[13px] font-bold text-gray-500">Unit</label>
                        <div className="flex-1 relative">
                           <div onClick={() => setShowUnitDropdown(!showUnitDropdown)} className="flex items-center justify-between w-full px-4 py-2 border border-gray-200 rounded text-[14px] cursor-pointer hover:border-blue-400 bg-white group transition-all">
                              <span className={selectedUnit ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'}>{selectedUnit?.name || 'Select Unit (e.g. Kg, Pcs)'}</span>
                              <ChevronUPDown className="w-4 h-4 text-gray-400" />
                           </div>
                           <AnimatePresence>
                              {showUnitDropdown && (
                                 <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 z-[60] mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden">
                                    <div className="max-h-[200px] overflow-y-auto no-scrollbar py-1">
                                       {units.map(unit => (
                                          <button key={unit.id} onClick={() => { setSelectedUnit(unit); setShowUnitDropdown(false); }} className="w-full text-left px-5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-between group">
                                             {unit.name}
                                             {selectedUnit?.id === unit.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                          </button>
                                       ))}
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); setShowManageUnits(true); setShowUnitDropdown(false); }} className="w-full bg-[#f8fbff] py-3 px-5 text-left text-[11px] font-black text-[#1a6bdb] hover:bg-[#eff6ff] border-t border-blue-50 flex items-center gap-2 transition-all uppercase tracking-widest">
                                       <PlusCircle className="w-3.5 h-3.5" /> Manage Units
                                    </button>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-10">
                        <div className="flex items-center gap-10">
                           <label className="w-32 shrink-0 text-[13px] font-bold text-gray-500">SKU</label>
                           <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="flex-1 px-4 py-2 border border-blue-50 bg-[#f8fbff] rounded text-[14px] font-bold outline-none border-dashed" placeholder="SKU001" />
                        </div>
                        <div className="flex items-center gap-4">
                           <label className="w-20 shrink-0 text-[13px] font-bold text-gray-500">Barcode</label>
                           <input type="text" value={barcode} onChange={e => setBarcode(e.target.value)} className="flex-1 px-4 py-2 border border-gray-100 rounded text-[14px] outline-none" placeholder="Scan Barcode" />
                        </div>
                     </div>
                     <div className="flex items-center gap-10">
                        <label className="w-32 shrink-0 text-[13px] font-bold text-gray-500">Manufacturer</label>
                        <div className="flex-1 relative">
                           <div onClick={() => setShowManufacturerDropdown(!showManufacturerDropdown)} className="flex items-center justify-between w-full px-4 py-2 border border-gray-200 rounded text-[14px] cursor-pointer hover:border-blue-400 bg-white group transition-all">
                              <span className={selectedManufacturer ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'}>{selectedManufacturer?.name || 'Select Manufacturer'}</span>
                              <ChevronUPDown className="w-4 h-4 text-gray-400" />
                           </div>
                           <AnimatePresence>
                              {showManufacturerDropdown && (
                                 <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 z-[60] mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden">
                                    <div className="p-2 border-b border-gray-50 flex items-center bg-gray-50/30">
                                       <Search className="w-4 h-4 text-gray-300 ml-2" />
                                       <input type="text" autoFocus placeholder="Search manufacturers..." className="w-full px-3 py-2 bg-transparent text-[13px] font-medium outline-none placeholder:text-gray-300" value={searchManufacturer} onChange={(e) => setSearchManufacturer(e.target.value)} />
                                    </div>
                                    <div className="max-h-[200px] overflow-y-auto no-scrollbar py-1">
                                       {manufacturers.filter(m => m.name.toLowerCase().includes(searchManufacturer.toLowerCase())).length > 0 ? (
                                          manufacturers.filter(m => m.name.toLowerCase().includes(searchManufacturer.toLowerCase())).map(man => (
                                             <button key={man.id} onClick={() => { setSelectedManufacturer(man); setShowManufacturerDropdown(false); }} className="w-full text-left px-5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-between group">
                                                {man.name}
                                                {selectedManufacturer?.id === man.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                             </button>
                                          ))
                                       ) : (
                                          <div className="px-5 py-4 text-[12px] text-gray-400 text-center font-medium italic">No matches found</div>
                                       )}
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); setShowManageManufacturers(true); setShowManufacturerDropdown(false); }} className="w-full bg-[#f8fbff] py-3 px-5 text-left text-[11px] font-black text-[#1a6bdb] hover:bg-[#eff6ff] border-t border-blue-50 flex items-center gap-2 transition-all uppercase tracking-widest">
                                       <PlusCircle className="w-3.5 h-3.5" /> Manage Manufacturers
                                    </button>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     </div>
                  </div>
                  <div className="col-span-12 lg:col-span-5 relative">
                     <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6 sticky top-24">
                        <div className="space-y-4">
                           <div className="flex items-center justify-between px-1">
                              <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                 <ImageIcon className="w-4 h-4 text-blue-600" /> Primary Product Image
                              </h3>
                              {frontImage.url && <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">Ready to Display</span>}
                           </div>

                           <div className="relative group">
                              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                              <div className="relative shadow-xl shadow-blue-500/5 rounded-2xl overflow-hidden hover:scale-[1.01] transition-all">
                                 <ImageUpload
                                    width="w-full"
                                    height="aspect-square"
                                    currentImage={frontImage.url}
                                    onUpload={(url, pid) => setFrontImage({ url, publicId: pid })}
                                    onDelete={() => setFrontImage({ url: '', publicId: '' })}
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-50/50 flex gap-4">
                           <div className="w-1.5 bg-blue-500/20 rounded-full shrink-0" />
                           <p className="text-[10px] font-bold text-blue-900/60 leading-relaxed uppercase tracking-normal">
                              Note: This image will be the primary visual for this item on the POS Billing screen. Use a high-quality 1:1 photo for the best appearance.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="space-y-10 border-t border-gray-100 pt-16">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[12px] font-black text-gray-900 border-l-[4px] border-blue-600 pl-4 uppercase tracking-[0.2em]">Inventory Type</h3>
                     <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['Single Item', 'Contains Variants'].map(t => (
                           <button key={t} onClick={() => setItemType(t as any)} className={`px-4 py-2 text-[11px] font-bold rounded-md transition-all ${itemType === t ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                              {t}
                           </button>
                        ))}
                     </div>
                  </div>

                  {itemType === 'Contains Variants' && (
                     <div className="pl-6 space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="space-y-6">
                           <div className="flex items-center justify-between">
                              <p className="text-[13px] font-bold text-gray-500">Product Attributes (e.g. Size, Color)</p>
                              <button onClick={() => setAttributes([...attributes, { id: Math.random().toString(), name: '', values: [] }])} className="text-[11px] font-black text-[#1a6bdb] flex items-center gap-2 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">
                                 <Plus className="w-3 h-3" /> Add Attribute
                              </button>
                           </div>

                           <div className="space-y-4">
                              {attributes.map((attr, idx) => (
                                 <div key={attr.id} className="flex items-start gap-4 p-6 bg-gray-50/50 rounded-xl border border-gray-100">
                                    <div className="w-1/3">
                                       <input type="text" value={attr.name} onChange={e => {
                                          const n = [...attributes];
                                          n[idx].name = e.target.value;
                                          setAttributes(n);
                                       }} placeholder="Attribute Name (e.g. Size)" className="w-full px-4 py-2 border border-gray-200 rounded text-[13px] font-bold outline-none focus:border-blue-500" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                       <div className="flex flex-wrap gap-2">
                                          {attr.values.map((v, vIdx) => (
                                             <span key={vIdx} className="px-3 py-1 bg-blue-100 text-blue-600 text-[11px] font-bold rounded-lg flex items-center gap-2">
                                                {v} <button onClick={() => {
                                                   const n = [...attributes];
                                                   n[idx].values = n[idx].values.filter((_, i) => i !== vIdx);
                                                   setAttributes(n);
                                                }}><X className="w-3 h-3 text-blue-400 hover:text-blue-600" /></button>
                                             </span>
                                          ))}
                                          <input type="text" onKeyDown={e => {
                                             if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = (e.currentTarget.value).trim();
                                                if (val) {
                                                   const n = [...attributes];
                                                   n[idx].values.push(val);
                                                   setAttributes(n);
                                                   e.currentTarget.value = '';
                                                }
                                             }
                                          }} placeholder="Type and press Enter" className="bg-transparent border-none outline-none text-[13px] font-medium py-1" />
                                       </div>
                                    </div>
                                    <button onClick={() => setAttributes(attributes.filter((_, i) => i !== idx))} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {variants.length > 0 && (
                           <div className="space-y-4">
                              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Generated Variants ({variants.length})</p>
                              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                 <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50">
                                       <tr>
                                          <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Variant</th>
                                          <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU</th>
                                          <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                                          <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                                       </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                       {variants.map((v, idx) => (
                                          <tr key={idx} className="hover:bg-blue-50/20 transition-all">
                                             <td className="px-6 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                   {Object.entries(v.attributes).map(([k, val]) => (
                                                      <span key={k} className="text-[11px] font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{val as string}</span>
                                                   ))}
                                                </div>
                                             </td>
                                             <td className="px-6 py-3">
                                                <input type="text" value={v.sku} onChange={e => {
                                                   const n = [...variants];
                                                   n[idx].sku = e.target.value;
                                                   setVariants(n);
                                                }} className="w-full bg-transparent border-none outline-none text-[13px] font-bold text-blue-600" />
                                             </td>
                                             <td className="px-6 py-3">
                                                <input type="number" value={v.price} onChange={e => {
                                                   const n = [...variants];
                                                   n[idx].price = e.target.value;
                                                   setVariants(n);
                                                }} className="w-24 bg-transparent border-none outline-none text-[13px] font-bold text-gray-900" />
                                             </td>
                                             <td className="px-6 py-3">
                                                <input type="number" value={v.stock} onChange={e => {
                                                   const n = [...variants];
                                                   n[idx].stock = e.target.value;
                                                   setVariants(n);
                                                }} className="w-20 bg-transparent border-none outline-none text-[13px] font-bold text-gray-900" />
                                             </td>
                                          </tr>
                                       ))}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        )}
                     </div>
                  )}
               </div>
               <div className="space-y-8 border-t border-gray-100 pt-10">
                  <h3 className="text-[12px] font-black text-gray-900 border-l-[4px] border-blue-600 pl-4 uppercase tracking-[0.2em]">
                     Pricing & Inventory
                  </h3>

                  <div className="grid grid-cols-2 gap-6">

                     <div className="space-y-2 min-w-0">
                        <label className="text-[12px] font-bold text-red-500">Selling Price*</label>
                        <div className="flex shadow-sm w-full min-w-0">
                           <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l text-[11px] font-bold text-gray-500">
                              INR
                           </span>
                           <input
                              type="text"
                              value={sellingPrice}
                              onChange={e => setSellingPrice(e.target.value)}
                              className="flex-1 min-w-0 px-4 py-2 border border-gray-200 rounded-r text-[15px] font-bold text-gray-900 outline-none text-right focus:border-blue-500"
                           />
                        </div>
                     </div>

                     <div className="space-y-2 min-w-0">
                        <label className="text-[12px] font-bold text-gray-500">Cost Price</label>
                        <div className="flex shadow-sm w-full min-w-0">
                           <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l text-[11px] font-bold text-gray-500">
                              INR
                           </span>
                           <input
                              type="text"
                              value={costPrice}
                              onChange={e => setCostPrice(e.target.value)}
                              className="flex-1 min-w-0 px-4 py-2 border border-gray-200 rounded-r text-[15px] font-bold text-gray-900 outline-none text-right focus:border-blue-500"
                           />
                        </div>
                     </div>

                     <div className="space-y-2 min-w-0">
                        <label className="text-[12px] font-bold text-gray-500">Current Stock</label>
                        <input
                           type="number"
                           value={openingStock}
                           onChange={e => setOpeningStock(e.target.value)}
                           className="w-full min-w-0 px-4 py-2 border border-gray-200 rounded text-[15px] font-bold text-gray-800 outline-none focus:border-blue-500"
                        />
                     </div>

                     <div className="space-y-2 min-w-0">
                        <label className="text-[12px] font-bold text-gray-500">Reorder Alert</label>
                        <input
                           type="number"
                           value={reorderLevel}
                           onChange={e => setReorderLevel(e.target.value)}
                           className="w-full min-w-0 px-4 py-2 border border-gray-200 rounded text-[15px] font-bold text-gray-800 outline-none focus:border-blue-500"
                        />
                     </div>

                  </div>
               </div>
               <div className="space-y-10 border-t border-gray-100 pt-16">
                  <h3 className="text-[12px] font-black text-gray-900 border-l-[4px] border-blue-600 pl-4 uppercase tracking-[0.2em]">Item Manifest</h3>
                  <div className="flex items-start gap-10 pl-6">
                     <label className="w-32 shrink-0 text-[13px] font-bold text-gray-500 mt-2.5">Description</label>
                     <textarea className="flex-1 px-4 py-4 border border-gray-200 rounded-xl text-[14px] font-medium outline-none min-h-[140px] focus:border-blue-500 ring-offset-2 transition-all resize-none shadow-sm" placeholder="Enter item details..." value={description} onChange={e => setDescription(e.target.value)} />
                  </div>
               </div>
            </div>
         </main>

         {/* FOOTER */}
         <footer className="fixed bottom-0 right-0 left-0 lg:left-[298px] z-[70] h-[75px] bg-white border-t border-gray-200 px-10 flex items-center shadow-xl">
            <div className="flex items-center gap-4">
               <button onClick={handleSave} disabled={isSaving} className="px-12 py-3 bg-[#1a6bdb] text-white text-[13px] font-black rounded shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center gap-3 uppercase tracking-widest">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Item
               </button>
               <button onClick={() => router.back()} className="px-12 py-3 bg-white border border-gray-200 text-gray-600 text-[13px] font-black rounded hover:bg-gray-50 transition-all uppercase tracking-widest">Cancel</button>
            </div>
         </footer>

         {/* MODALS: CATEGORY */}
         <AnimatePresence>
            {showManageCategories && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowManageCategories(false)} className="absolute inset-0 bg-black/50 backdrop-blur-md" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col mx-4">
                     <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                        <h2 className="text-[13px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                           <Box className="w-4 h-4 text-blue-600" /> Manage Categories
                        </h2>
                        <button onClick={() => setShowManageCategories(false)} className="text-gray-400 hover:text-gray-900 transition-colors"><X className="w-5 h-5" /></button>
                     </div>
                     <div className="p-8 grow overflow-y-auto no-scrollbar bg-gray-50/20">
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">New Category Name*</label>
                              <div className="flex gap-2">
                                 <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded outline-none focus:border-blue-500 text-[14px] font-bold text-gray-700 placeholder:font-normal placeholder:text-gray-300" placeholder="e.g. Beverages" />
                                 <button onClick={handleAddCategory} className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[11px] font-black rounded shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest whitespace-nowrap">Add</button>
                              </div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Existing Categories ({categories.length})</p>
                           <div className="max-h-[300px] overflow-y-auto no-scrollbar divide-y divide-gray-50 border border-gray-100 rounded-lg bg-white overflow-hidden">
                              {categories.map(cat => (
                                 <div key={cat.id} className="group flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-all">
                                    <span className="text-[13px] font-bold text-gray-700">{cat.name}</span>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                       <button onClick={() => { setSelectedCategory(cat); setShowManageCategories(false); }} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all">Select</button>
                                       <button className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* MODALS: BRANDS */}
         <AnimatePresence>
            {showManageBrands && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowManageBrands(false)} className="absolute inset-0 bg-black/50 backdrop-blur-md" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col mx-4">
                     <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                        <h2 className="text-[13px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                           <Tag className="w-4 h-4 text-blue-600" /> Manage Brands
                        </h2>
                        <button onClick={() => setShowManageBrands(false)} className="text-gray-400 hover:text-gray-900 transition-colors"><X className="w-5 h-5" /></button>
                     </div>
                     <div className="p-8 grow overflow-y-auto no-scrollbar bg-gray-50/20">
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">New Brand Name*</label>
                              <div className="flex gap-2">
                                 <input type="text" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded outline-none focus:border-blue-500 text-[14px] font-bold text-gray-700 placeholder:font-normal placeholder:text-gray-300" placeholder="e.g. Nike" />
                                 <button onClick={handleAddBrand} className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[11px] font-black rounded shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest whitespace-nowrap">Add</button>
                              </div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Existing Brands ({brands.length})</p>
                           <div className="max-h-[300px] overflow-y-auto no-scrollbar divide-y divide-gray-50 border border-gray-100 rounded-lg bg-white overflow-hidden">
                              {brands.map(brand => (
                                 <div key={brand.id} className="group flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-all">
                                    <span className="text-[13px] font-bold text-gray-700">{brand.name}</span>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                       <button onClick={() => { setSelectedBrand(brand); setShowManageBrands(false); }} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all">Select</button>
                                       <button className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* MODALS: MANUFACTURERS */}
         <AnimatePresence>
            {showManageManufacturers && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowManageManufacturers(false)} className="absolute inset-0 bg-black/50 backdrop-blur-md" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col mx-4 font-sans">
                     <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                        <h2 className="text-[13px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2 font-sans">
                           <Store className="w-4 h-4 text-blue-600" /> Manage Manufacturers
                        </h2>
                        <button onClick={() => setShowManageManufacturers(false)} className="text-gray-400 hover:text-gray-900 transition-colors"><X className="w-5 h-5" /></button>
                     </div>
                     <div className="p-8 grow overflow-y-auto no-scrollbar bg-gray-50/20">
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block font-sans">New Manufacturer Name*</label>
                              <div className="flex gap-2 font-sans">
                                 <input type="text" value={newManufacturerName} onChange={e => setNewManufacturerName(e.target.value)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded outline-none focus:border-blue-500 text-[14px] font-bold text-gray-700 placeholder:font-normal placeholder:text-gray-300" placeholder="e.g. Samsung" />
                                 <button onClick={handleAddManufacturer} className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[11px] font-black rounded shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest whitespace-nowrap">Add</button>
                              </div>
                           </div>
                        </div>
                        <div className="space-y-2 font-sans">
                           <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Manufacturer Directory ({manufacturers.length})</p>
                           <div className="max-h-[300px] overflow-y-auto no-scrollbar divide-y divide-gray-50 border border-gray-100 rounded-lg bg-white overflow-hidden">
                              {manufacturers.map(m => (
                                 <div key={m.id} className="group flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-all">
                                    <span className="text-[13px] font-bold text-gray-700">{m.name}</span>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all font-sans">
                                       <button onClick={() => { setSelectedManufacturer(m); setShowManageManufacturers(false); }} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all">Select</button>
                                       <button className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* MODALS: UNITS */}
         <AnimatePresence>
            {showManageUnits && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowManageUnits(false)} className="absolute inset-0 bg-black/50 backdrop-blur-md" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col mx-4">
                     <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white font-sans">
                        <h2 className="text-[13px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2 font-sans">
                           <Layers className="w-4 h-4 text-blue-600" /> Manage Units
                        </h2>
                        <button onClick={() => setShowManageUnits(false)} className="text-gray-400 hover:text-gray-900 transition-colors"><X className="w-5 h-5" /></button>
                     </div>
                     <div className="p-8 grow overflow-y-auto no-scrollbar bg-gray-50/20 font-sans">
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8 font-sans">
                           <div className="space-y-4 font-sans">
                              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block font-sans">New Unit Name*</label>
                              <div className="flex gap-2">
                                 <input type="text" value={newUnitName} onChange={e => setNewUnitName(e.target.value)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded outline-none focus:border-blue-500 text-[14px] font-bold text-gray-700 placeholder:font-normal placeholder:text-gray-300 font-sans" placeholder="e.g. Box" />
                                 <button onClick={handleAddUnit} className="px-6 py-2.5 bg-[#1a6bdb] text-white text-[11px] font-black rounded shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest whitespace-nowrap">Add</button>
                              </div>
                           </div>
                        </div>
                        <div className="space-y-2 font-sans">
                           <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Unit List ({units.length}) font-sans</p>
                           <div className="max-h-[300px] overflow-y-auto no-scrollbar divide-y divide-gray-50 border border-gray-100 rounded-lg bg-white overflow-hidden font-sans font-sans">
                              {units.map(u => (
                                 <div key={u.id} className="group flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-all font-sans font-sans font-sans">
                                    <span className="text-[13px] font-bold text-gray-700 font-sans font-sans font-sans">{u.name}</span>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all font-sans">
                                       <button onClick={() => { setSelectedUnit(u); setShowManageUnits(false); }} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all font-sans">Select</button>
                                       <button className="p-1.5 text-gray-300 hover:text-red-500 transition-colors font-sans"><Trash2 className="w-3.5 h-3.5 font-sans" /></button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
}

function ChevronUPDown({ className }: { className?: string }) {
   return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
         <ChevronUp className="w-2.5 h-2.5 -mb-0.5" />
         <ChevronDown className="w-2.5 h-2.5 -mt-0.5" />
      </div>
   );
}
