'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, Smartphone, Percent, User, Loader2, CheckCircle2, Package } from 'lucide-react';

type CartItem = { id: string; name: string; price: number; qty: number };

export default function POSPage() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState<any>(null);

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
    setIsProcessing(true);
    try {
      const saleData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.qty,
          price: item.price
        })),
        customerPhone,
        customerName,
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

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] animate-in zoom-in-95 duration-300">
        <CheckCircle2 className="w-16 h-16 text-secondary-green mb-4" />
        <h2 className="text-2xl font-bold text-text-primary">Sale Completed!</h2>
        <p className="text-text-muted mt-2">Invoice: <span className="font-mono text-primary font-bold uppercase">{success.invoiceNumber}</span></p>
        <div className="flex gap-3 mt-8">
          <button onClick={() => setSuccess(null)} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md">Next Customer</button>
          <button className="px-6 py-2 bg-white border border-border text-text-primary font-semibold rounded-lg shadow-sm">Print Invoice</button>
        </div>
      </div>
    );
  }

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
            {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />}
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
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-page-bg rounded text-[9px] font-bold text-text-muted uppercase tracking-tight">
                    Stock: {product.stockQuantity}
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary/15 transition-colors">
                    <ShoppingCart className="w-4 h-4 text-primary" />
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
          <div className="mt-3 space-y-2">
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input
                type="text" value={customerName} onChange={e => setCustomerName(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-border rounded-md text-xs focus:outline-none focus:border-primary shadow-sm"
                placeholder="Walk-in Customer"
              />
            </div>
            <div className="relative">
              <Smartphone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input
                type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-border rounded-md text-xs focus:outline-none focus:border-primary shadow-sm"
                placeholder="Phone (for billing)"
              />
            </div>
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
            ].map(pm => (
              <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg text-[10px] font-bold border-2 transition-all ${paymentMethod === pm.id
                  ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-105'
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
    </div>
  );
}

