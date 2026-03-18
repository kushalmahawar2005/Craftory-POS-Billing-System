'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, Smartphone, Percent, User, Loader2, CheckCircle2, Package, Camera, Printer } from 'lucide-react';
import BarcodeScanner from '@/components/BarcodeScanner';

type CartItem = { id: string; name: string; price: number; qty: number };

export default function POSPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [cashTendered, setCashTendered] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState<any[]>([]);

  // Fetch products based on search
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?q=${search}&limit=20`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newQty = item.qty + delta;
      return newQty > 0 ? { ...item, qty: newQty } : item;
    }).filter(item => item.qty > 0));
  };

  const removeItem = (id: string) => setCart(prev => prev.filter(item => item.id !== id));

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0; // Set to 0 for now or fetch from settings
  const total = subtotal - discountAmount + tax;

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'CREDIT' && !selectedCustomer) {
      alert('Please select a customer for Credit purchase');
      return;
    }
    
    setIsProcessing(true);
    try {
      const saleData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.qty,
          price: item.price
        })),
        customerId: selectedCustomer?.id,
        customerPhone: customerPhone || selectedCustomer?.phone,
        customerName: customerName || selectedCustomer?.name,
        paymentMethod,
        subtotal,
        discount: discountAmount,
        tax,
        total
      };

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(data.sale);
        setCart([]);
        setSelectedCustomer(null);
        setCustomerName('');
        setCustomerPhone('');
        setDiscount(0);
      } else {
        alert(data.error || 'Sale failed');
      }
    } catch (e) {
      alert('Internal error. Check logs.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!customerSearch) {
      setCustomerResults([]);
      return;
    }
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`/api/customers?q=${customerSearch}`);
        const data = await res.json();
        setCustomerResults(data || []);
      } catch (e) {
        console.log(e);
      }
    };
    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  const handleScan = (barcode: string) => {
    setSearch(barcode);
    setShowScanner(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] animate-in zoom-in-95 duration-300">
        <CheckCircle2 className="w-16 h-16 text-secondary-green mb-4" />
        <h2 className="text-2xl font-bold text-text-primary">Sale Completed!</h2>
        <p className="text-text-muted mt-2">Invoice: <span className="font-mono text-primary font-bold uppercase">{success.invoiceNumber}</span></p>
        <div className="flex gap-3 mt-8 no-print">
          <button onClick={() => setSuccess(null)} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md">Next Customer</button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2 bg-white border border-border text-text-primary font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-all">
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>

        {/* Print Receipt View (hidden on screen) */}
        <div className="hidden print:block fixed inset-0 bg-white p-6 font-mono text-sm">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold uppercase">Craftory POS</h2>
            <p className="text-xs">Invoice: {success.invoiceNumber}</p>
            <p className="text-xs">{new Date(success.createdAt).toLocaleString()}</p>
          </div>
          <div className="border-t border-b border-black py-2 mb-4">
            <div className="flex justify-between font-bold border-b border-black pb-1 mb-1">
              <span>Item</span>
              <span>Qty x Price</span>
              <span>Total</span>
            </div>
            {success.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-xs py-0.5 items-center">
                <span className="truncate max-w-[120px] flex items-center gap-2">
                   {item.product?.imageUrl ? (
                      <img src={item.product?.imageUrl} className="w-4 h-4 object-cover rounded" alt="" />
                   ) : null}
                   {item.product?.name || 'Item'}
                </span>
                <span>{item.quantity} x {item.price}</span>
                <span>₹{(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex justify-between w-full"><span>Subtotal:</span> <span>₹{success.subtotal.toFixed(2)}</span></div>
            {success.discount > 0 && <div className="flex justify-between w-full"><span>Discount:</span> <span>-₹{success.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between w-full font-bold pt-1 border-t border-black"><span>Total:</span> <span>₹{success.total.toFixed(2)}</span></div>
          </div>
          <div className="text-center mt-6 text-xs italic">
            <p>Thank you for shopping!</p>
            <p>Payment: {success.paymentMethod}</p>
          </div>
        </div>
      </div>
    );
  }

  const startNewSale = () => {
    setCart([]);
    setSelectedCustomer(null);
    setCustomerName('');
    setDiscount(0);
    setPaymentMethod('CASH');
    setCashTendered('');
    
    // Clear storage
    sessionStorage.removeItem('pos_cart');
    sessionStorage.removeItem('pos_discount');
    sessionStorage.removeItem('pos_customer');
    
    router.replace('/app/pos'); 
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-112px)]">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Search by product name or barcode..."
            />
            {isLoading && <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />}
            <button
              onClick={() => setShowScanner(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-primary/5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="Scan Barcode"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {products.length === 0 && !isLoading ? (
            <div className="bg-white rounded-xl p-12 text-center border border-dashed border-border mt-4">
              <Package className="w-12 h-12 mx-auto text-border mb-3" />
              <p className="text-text-muted">No products found. Add some in the products page first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {products.map((product) => (
                <motion.button
                  key={product.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-xl p-4 border border-border/50 hover:border-primary/30 hover:shadow-md text-left transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-page-bg rounded text-[9px] font-bold text-text-muted uppercase tracking-tight z-10">
                    Stock: {product.stockQuantity}
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors overflow-hidden border border-primary/5">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 text-primary opacity-50" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-text-primary truncate">{product.name}</p>
                  <p className="text-[10px] text-text-muted mt-0.5 truncate">{product.barcode || 'NO BARCODE'} · {product.category?.name || 'General'}</p>
                  <p className="text-base font-extrabold text-primary mt-1">₹{product.price}</p>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart side-panel */}
      <div className="w-full lg:w-[360px] bg-white rounded-xl border border-border/50 flex flex-col shrink-0 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-page-bg/30">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            Active Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})
          </h3>
          <div className="mt-3 space-y-2 relative">
            {!selectedCustomer ? (
              <>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                  <input
                    type="text" value={customerSearch} onChange={e => setCustomerSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-border rounded-md text-xs focus:outline-none focus:border-primary shadow-sm"
                    placeholder="Search/Select Customer"
                  />
                </div>
                {customerResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-border rounded-lg shadow-xl z-20 mt-1 max-h-40 overflow-y-auto">
                    {customerResults.map(c => (
                      <button key={c.id} onClick={() => { setSelectedCustomer(c); setCustomerSearch(''); setCustomerResults([]); }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-page-bg border-b border-border last:border-0 flex justify-between items-center">
                        <span>
                          <span className="font-bold">{c.name}</span>
                          <span className="text-text-muted ml-1">({c.phone})</span>
                        </span>
                        {c.currentBalance > 0 && <span className="text-[10px] font-bold text-error">₹{c.currentBalance}</span>}
                      </button>
                    ))}
                  </div>
                )}
                <div className="text-[9px] text-text-muted text-center italic">Or manually enter name/phone below</div>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                  <input
                    type="text" value={customerName} onChange={e => setCustomerName(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-border rounded-md text-xs focus:outline-none focus:border-primary shadow-sm"
                    placeholder="Walk-in Customer Name"
                  />
                </div>
                <div className="relative">
                  <Smartphone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                  <input
                    type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-border rounded-md text-xs focus:outline-none focus:border-primary shadow-sm"
                    placeholder="Phone Number"
                  />
                </div>
              </>
            ) : (
              <div className="p-2 bg-primary/5 border border-primary/20 rounded-lg flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs font-bold text-primary">{selectedCustomer.name}</p>
                  <p className="text-[10px] text-text-muted">{selectedCustomer.phone}</p>
                  <div className="mt-1.5 flex gap-2">
                    <div className="p-1.5 bg-white rounded border border-primary/10 flex-1">
                      <p className="text-[8px] text-text-muted uppercase font-bold">Udhar</p>
                      <p className={`text-[11px] font-black ${selectedCustomer.currentBalance > 0 ? 'text-error' : 'text-text-muted'}`}>₹{selectedCustomer.currentBalance}</p>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-primary/10 flex-1">
                      <p className="text-[8px] text-text-muted uppercase font-bold">Limit</p>
                      <p className="text-[11px] font-black text-text-primary">₹{selectedCustomer.creditLimit || 'No Limit'}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-1 text-text-muted hover:text-error transition-colors">
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-10" />
              <p className="text-sm">Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-page-bg/50 rounded-xl border border-border/30">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-text-primary truncate">{item.name}</p>
                  <p className="text-[11px] text-text-muted">₹{item.price} per unit</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-lg bg-white shadow-sm border border-border flex items-center justify-center hover:bg-gray-50">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-black w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-lg bg-white shadow-sm border border-border flex items-center justify-center hover:bg-gray-50">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="border-t border-border/50 p-5 space-y-3 bg-page-bg/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-3.5 h-3.5 text-secondary-green" />
              <span className="text-xs text-text-muted">Discount</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number" min={0} max={100} value={discount} onChange={e => setDiscount(Number(e.target.value))}
                className="w-12 px-1 py-0.5 bg-white border border-border rounded text-xs text-center font-bold focus:outline-none focus:border-primary"
              />
              <span className="text-xs font-bold font-mono">%</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs text-text-muted font-medium">
              <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-text-primary pt-1">
              <span>Grand Total</span><span className="text-primary tracking-tight">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex gap-2 pt-2">
            {[
              { id: 'CASH', icon: Banknote, label: 'Cash' },
              { id: 'UPI', icon: Smartphone, label: 'UPI' },
              { id: 'CARD', icon: CreditCard, label: 'Card' },
              { id: 'CREDIT', icon: User, label: 'Credit', disabled: !selectedCustomer },
            ].map(pm => (
              <button key={pm.id} onClick={() => !pm.disabled && setPaymentMethod(pm.id)}
                disabled={pm.disabled}
                className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg text-[10px] font-bold border-2 transition-all ${paymentMethod === pm.id
                  ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                  : pm.disabled 
                    ? 'border-border bg-page-bg text-text-muted/30 cursor-not-allowed opacity-50'
                    : 'border-border bg-white text-text-muted hover:border-border-dark'
                  }`}>
                <pm.icon className="w-3.5 h-3.5" />
                {pm.id}
              </button>
            ))}
          </div>

          <button
            disabled={cart.length === 0 || isProcessing}
            onClick={handleCompleteSale}
            className="w-full py-3.5 bg-primary text-white text-sm font-black rounded-xl hover:bg-primary-dark shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
            COMPLETE SALE · ₹{total.toFixed(2)}
          </button>
        </div>
      </div>

      {/* No more modals here! Navigated flow handles Checkout -> Receipt */}
      
      {/* Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <BarcodeScanner
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

