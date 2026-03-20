'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, 
  Smartphone, Percent, User, Loader2, CheckCircle2, Package, Camera, 
  Printer, X, ChevronRight, UserPlus, Info, History, ArrowLeft,
  ChevronDown, Settings, Bell, Monitor, Power, Clock, Wallet, ShieldCheck,
  Zap, Globe, Target, MoreVertical, Activity, QrCode, Receipt,
  Check
} from 'lucide-react';
import BarcodeScanner from '@/components/BarcodeScanner';

type CartItem = { id: string; name: string; price: number; qty: number; stock?: number };

export default function POSPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState<any[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const customerSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/categories?limit=50')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let url = `/api/products?q=${search}&limit=24`;
        if (selectedCategory !== 'all') url += `&categoryId=${selectedCategory}`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };
    const timer = setTimeout(fetchProducts, 200);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  useEffect(() => {
    if (customerSearch.length < 2) { setCustomerResults([]); return; }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/customers?q=${customerSearch}`);
      const data = await res.json();
      setCustomerResults(data || []);
      setShowCustomerDropdown(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, stock: product.stockQuantity }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newQty = item.qty + delta;
      if (newQty > (item.stock || 9999)) {
        // Simple alert for stock limit
        return item;
      }
      return newQty > 0 ? { ...item, qty: newQty } : item;
    }).filter(item => item.qty > 0));
  };

  const removeItem = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'CREDIT' && !selectedCustomer) {
      alert('Please select a customer for credit transactions.');
      return;
    }
    setIsProcessing(true);
    try {
      const saleData = {
        items: cart.map(item => ({ productId: item.id, quantity: item.qty, price: item.price })),
        customerId: selectedCustomer?.id,
        paymentMethod,
        subtotal,
        discount: discountAmount,
        total
      };
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.sale);
        // Save for receipt
        sessionStorage.setItem('pos_cart', JSON.stringify(cart));
        sessionStorage.setItem('pos_discount', discount.toString());
        sessionStorage.setItem('pos_customer', selectedCustomer?.name || '');
        sessionStorage.setItem('pos_payment_mode', paymentMethod);
        sessionStorage.setItem('pos_invoice', data.sale.invoiceNumber);
        sessionStorage.setItem('pos_staff', 'Store Staff'); // Can be improved with actual user name
        
        setTimeout(() => {
          setCart([]);
          setSelectedCustomer(null);
          setDiscount(0);
          setSuccess(null);
          router.push('/app/receipt');
        }, 1000);
      } else {
        alert(data.error || 'Failed to complete sale.');
      }
    } catch (e) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'F2') {
        e.preventDefault();
        customerSearchRef.current?.focus();
      }
      if (e.key === 'F9') {
        e.preventDefault();
        const methods = ['CASH', 'UPI', 'CARD', 'CREDIT'];
        const currentIdx = methods.indexOf(paymentMethod);
        const nextIdx = (currentIdx + 1) % methods.length;
        setPaymentMethod(methods[nextIdx]);
      }
      if (e.key === 'F10' || (e.key === 'Enter' && e.ctrlKey)) {
        e.preventDefault();
        handleCompleteSale();
      }
      if (e.key === 'Escape') {
        setSearch('');
        setCustomerSearch('');
        setShowCustomerDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paymentMethod, handleCompleteSale]);

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-112px)] bg-[#f5f7f9] p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col items-center text-center p-12">
           <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-8">
             <CheckCircle2 className="w-10 h-10" />
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Sale Completed</h2>
           <p className="text-sm text-gray-400 font-medium">Invoice #{success.invoiceNumber} has been generated</p>
           
           <div className="mt-10 py-6 px-10 bg-gray-50 rounded-xl border border-gray-100 w-full">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">Amount Collected</p>
              <p className="text-4xl font-bold text-[#1a6bdb] tracking-tight">₹{success.total.toLocaleString()}</p>
           </div>
           
           <div className="mt-12 w-full grid grid-cols-2 gap-4">
              <button 
                onClick={() => setSuccess(null)} 
                className="py-4 bg-[#1a6bdb] text-white font-bold text-[13px] rounded-lg hover:bg-blue-600 transition-all shadow-md shadow-blue-600/10"
              >
                Next Sale
              </button>
              <button 
                onClick={() => window.print()} 
                className="py-4 bg-white border border-gray-200 text-gray-700 font-bold text-[13px] rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
           </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] overflow-hidden -m-4 lg:-m-6 bg-[#f5f7f9]">
      {/* POS HEADER */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-30 shadow-sm transition-all">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
             <span className="text-[12px] font-bold text-gray-900">Register Open</span>
           </div>
           <div className="h-4 w-[1px] bg-gray-200" />
           <div className="flex items-center gap-2 text-gray-500">
             <Clock className="w-4 h-4" />
             <span className="text-[11px] font-medium uppercase tracking-tight">Session: {new Date().toLocaleDateString()}</span>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-2 text-gray-400 hover:text-gray-900 transition-all rounded-lg hover:bg-gray-50"><History className="w-5 h-5" /></button>
           <button className="p-2 text-gray-400 hover:text-gray-900 transition-all rounded-lg hover:bg-gray-50"><Monitor className="w-5 h-5" /></button>
           <button onClick={() => router.push('/app/dashboard')} className="p-2 text-red-400 hover:text-white hover:bg-red-500 transition-all rounded-lg ml-2 border border-transparent hover:border-red-600"><Power className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* PRODUCT CATALOG SECTOR */}
        <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-gray-100 relative shadow-sm">
          <div className="p-6 pb-4 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                   ref={searchInputRef}
                   type="text" 
                   value={search} 
                   onChange={e => setSearch(e.target.value)} 
                   placeholder="Search products (F1)..." 
                   className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-bold text-gray-900 focus:bg-white focus:border-[#1a6bdb] focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-inner" 
                 />
                {isLoading && <Loader2 className="absolute right-14 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 animate-spin" />}
                <button 
                   onClick={() => setShowScanner(true)} 
                   className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 transition-all"
                >
                   <QrCode className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
              <button 
                onClick={() => setSelectedCategory('all')} 
                className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all shrink-0 border ${selectedCategory === 'all' ? 'bg-gray-900 border-gray-900 text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:border-gray-300'}`}
              >
                All Items
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => setSelectedCategory(cat.id)} 
                  className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all shrink-0 border ${selectedCategory === cat.id ? 'bg-[#1a6bdb] border-[#1a6bdb] text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:border-gray-300'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-8 no-scrollbar bg-gray-50/30">
            {products.length === 0 && !isLoading ? (
               <div className="py-32 flex flex-col items-center gap-4 opacity-30">
                 <Package className="w-12 h-12 text-gray-400" />
                 <p className="text-[12px] font-bold uppercase tracking-widest">No products found</p>
               </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <button 
                    key={product.id} 
                    onClick={() => addToCart(product)} 
                    className="bg-white rounded-xl border border-gray-200 hover:border-[#1a6bdb] hover:shadow-xl hover:shadow-blue-600/5 transition-all text-left overflow-hidden group active:scale-[0.98] flex flex-col"
                  >
                    <div className="aspect-square bg-white relative overflow-hidden border-b border-gray-50">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                           <Package className="w-8 h-8 text-gray-200" />
                        </div>
                      )}
                      {product.stockQuantity <= 5 && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-[9px] font-black rounded-full shadow-sm">
                           LOW STOCK: {product.stockQuantity}
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h4 className="text-[13px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-2 mb-1">{product.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.sku || 'NO SKU'}</p>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                         <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                         <div className="w-7 h-7 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-[#1a6bdb] group-hover:text-white transition-all">
                            <Plus className="w-4 h-4" />
                         </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CART SECTOR (Zoho Styled Sidebar) */}
        <div className="w-full lg:w-[420px] bg-white border-l border-gray-100 flex flex-col shrink-0 z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
          <div className="p-6 border-b border-gray-50">
            {!selectedCustomer ? (
              <div className="relative">
                <div className="flex items-center gap-3">
                   <div className="flex-1 relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input 
                         ref={customerSearchRef}
                         type="text" 
                         value={customerSearch} 
                         onChange={e => { setCustomerSearch(e.target.value); if(!e.target.value) setShowCustomerDropdown(false); }} 
                         placeholder="Search Customer (F2)..." 
                         className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-bold text-gray-900 focus:bg-white focus:border-[#1a6bdb] outline-none transition-all shadow-inner" 
                       />
                   </div>
                   <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><UserPlus className="w-5 h-5" /></button>
                </div>
                <AnimatePresence>
                  {showCustomerDropdown && customerResults.length > 0 && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowCustomerDropdown(false)} />
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-gray-50 max-h-60 overflow-y-auto">
                        {customerResults.map(c => (
                          <button key={c.id} onClick={() => { setSelectedCustomer(c); setShowCustomerDropdown(false); setCustomerSearch(''); }} className="w-full px-5 py-4 flex items-center justify-between hover:bg-blue-50 transition-all text-left group">
                            <div>
                               <p className="text-[13px] font-bold text-gray-900 tracking-tight group-hover:text-blue-600 uppercase">{c.name}</p>
                               <p className="text-[10px] font-bold text-gray-400 tracking-wider mt-0.5">{c.phone}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Balance</p>
                               <p className={`text-[13px] font-bold ${c.currentBalance > 0 ? 'text-red-600' : 'text-gray-300'}`}>₹{c.currentBalance}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100 animate-in fade-in zoom-in duration-300">
                <div className="w-10 h-10 bg-[#1a6bdb] rounded-lg flex items-center justify-center font-bold text-white text-base shadow-lg shadow-blue-600/20 uppercase">{selectedCustomer.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-[14px] font-bold text-gray-900 uppercase tracking-tight truncate">{selectedCustomer.name}</h4>
                   <p className="text-[11px] text-[#1a6bdb] font-bold tracking-wider mt-0.5">{selectedCustomer.phone}</p>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-2 text-gray-300 hover:text-red-600 transition-all rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-gray-50/10">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-20 py-20 grayscale">
                <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <motion.div layout key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between group shadow-sm hover:shadow-md transition-all">
                  <div className="flex-1 pr-4 min-w-0">
                    <h5 className="text-[13px] font-bold text-gray-900 uppercase tracking-tight truncate">{item.name}</h5>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">₹{item.price.toLocaleString()} / Unit</p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                     <div className="flex items-center gap-3">
                        <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-md flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100 transition-all"><Minus className="w-3 h-3" /></button>
                        <span className="w-6 text-center text-[13px] font-bold text-gray-900">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-md flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100 transition-all"><Plus className="w-3 h-3" /></button>
                     </div>
                     <p className="w-20 text-right text-[14px] font-bold text-gray-900 tracking-tight">₹{(item.price * item.qty).toLocaleString()}</p>
                     <button onClick={() => removeItem(item.id)} className="p-1 text-gray-200 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="bg-white border-t border-gray-100 p-8 pt-6 space-y-6 shadow-[0_-15px_40px_rgba(0,0,0,0.03)]">
            <div className="space-y-4">
               <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <Percent className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Discount (%)</span>
                  </div>
                  <input 
                    type="number" 
                    value={discount} 
                    onChange={e => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))} 
                    className="w-16 px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-right font-bold text-xs text-orange-600 outline-none focus:border-orange-200" 
                  />
               </div>
               <div className="flex justify-between items-center px-1">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                 <span className="text-[14px] font-bold text-gray-600">₹{subtotal.toLocaleString()}</span>
               </div>
               {discountAmount > 0 && (
                 <div className="flex justify-between items-center px-1 text-red-500">
                   <span className="text-[10px] font-bold uppercase tracking-widest">Discount Applied</span>
                   <span className="text-[14px] font-bold">-₹{discountAmount.toLocaleString()}</span>
                 </div>
               )}
               <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                  <span className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em] mb-1.5 ml-1">Net Payable</span>
                  <span className="text-4xl font-bold text-[#1a6bdb] tracking-tight">₹{total.toLocaleString()}</span>
               </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
               {[
                 { id: 'CASH', icon: Banknote, label: 'Cash' },
                 { id: 'UPI', icon: Smartphone, label: 'UPI' },
                 { id: 'CARD', icon: CreditCard, label: 'Card' },
                 { id: 'CREDIT', icon: Wallet, label: 'Credit', disabled: !selectedCustomer }
               ].map(pm => (
                 <button 
                    key={pm.id} 
                    onClick={() => !pm.disabled && setPaymentMethod(pm.id)} 
                    disabled={pm.disabled} 
                    className={`flex flex-col items-center justify-center gap-2 py-3.5 rounded-xl border transition-all ${
                        paymentMethod === pm.id ? 'bg-gray-900 border-gray-900 text-white shadow-xl' : 
                        pm.disabled ? 'bg-gray-50 border-transparent text-gray-200 opacity-50 cursor-not-allowed' : 
                        'bg-white border-gray-100 text-gray-400 hover:border-[#1a6bdb] hover:text-[#1a6bdb]'
                    }`}
                 >
                   <pm.icon className="w-4 h-4" />
                   <span className="text-[9px] font-bold uppercase tracking-widest">{pm.label}</span>
                 </button>
               ))}
            </div>

            <button 
               disabled={cart.length === 0 || isProcessing} 
               onClick={handleCompleteSale} 
               className="w-full h-16 bg-[#1a6bdb] hover:bg-blue-600 disabled:bg-gray-100 text-white rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center px-8 transition-all hover:-translate-y-0.5 active:scale-[0.98] group"
            >
               <div className="flex items-center gap-3">
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  <div className="text-center">
                     <p className="text-lg font-bold uppercase tracking-tight">Complete Sale</p>
                  </div>
               </div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showScanner && (
          <BarcodeScanner onScan={(code) => { setSearch(code); setShowScanner(false); }} onClose={() => setShowScanner(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
