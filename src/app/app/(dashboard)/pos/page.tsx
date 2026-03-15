'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, Smartphone, Percent, User, X, QrCode, Printer, CheckCircle2, FileText } from 'lucide-react';

const productCatalog = [
  { id: 1, name: 'Basmati Rice 5kg', price: 250, category: 'Groceries', sku: 'RCE001' },
  { id: 2, name: 'Sunflower Oil 1L', price: 150, category: 'Groceries', sku: 'OIL002' },
  { id: 3, name: 'Tata Salt 1kg', price: 20, category: 'Groceries', sku: 'SLT003' },
  { id: 4, name: 'Red Label Tea 250g', price: 200, category: 'Beverages', sku: 'TEA004' },
  { id: 5, name: 'Surf Excel 1kg', price: 220, category: 'Household', sku: 'DET005' },
  { id: 6, name: 'Amul Butter 500g', price: 280, category: 'Dairy', sku: 'BTR006' },
  { id: 7, name: 'Maggi Noodles 4pk', price: 56, category: 'Groceries', sku: 'NDL007' },
  { id: 8, name: 'Colgate 200g', price: 105, category: 'Personal Care', sku: 'TPS008' },
  { id: 9, name: 'Dettol Soap 125g', price: 55, category: 'Personal Care', sku: 'SOP009' },
  { id: 10, name: 'Parle-G Biscuit', price: 10, category: 'Snacks', sku: 'BSC010' },
  { id: 11, name: 'Coca Cola 750ml', price: 40, category: 'Beverages', sku: 'BVR011' },
  { id: 12, name: 'Aashirvaad Atta 5kg', price: 280, category: 'Groceries', sku: 'FLR012' },
];

type CartItem = { id: number; name: string; price: number; qty: number };

export default function POSPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerName, setCustomerName] = useState('');

  // Modals state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cashTendered, setCashTendered] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filtered = productCatalog.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: typeof productCatalog[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newQty = item.qty + delta;
      return newQty > 0 ? { ...item, qty: newQty } : item;
    }).filter(item => item.qty > 0));
  };

  const removeItem = (id: number) => setCart(prev => prev.filter(item => item.id !== id));

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = (subtotal * discount) / 100;
  const gst = (subtotal - discountAmount) * 0.18;
  const total = subtotal - discountAmount + gst;

  // Listen for return from checkout
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get('status') === 'timeout') {
      alert("Payment checkout session expired after 5 minutes.");
      router.replace('/app/pos'); // Clear param after alert
    }
  }, [searchParams, router]);

  const handleCompleteSale = () => {
    // Navigate to the dedicated checkout page with the query params
    const amountStr = total.toFixed(2);
    
    // Save current order data to sessionStorage to recover it after checkout redirects back
    sessionStorage.setItem('pos_cart', JSON.stringify(cart));
    sessionStorage.setItem('pos_discount', discount.toString());
    sessionStorage.setItem('pos_customer', customerName);
    
    router.push(`/app/checkout?amount=${amountStr}`);
  };

  const startNewSale = () => {
    setCart([]);
    setCustomerName('');
    setDiscount(0);
    setPaymentMethod('cash');
    setCashTendered('');
    
    // Clear storage
    sessionStorage.removeItem('pos_cart');
    sessionStorage.removeItem('pos_discount');
    sessionStorage.removeItem('pos_customer');
    
    router.replace('/app/pos'); // Clear success params
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-112px)] relative">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Search products or scan barcode..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
            {filtered.map((product) => (
              <motion.button
                key={product.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => addToCart(product)}
                className="bg-white rounded-xl p-4 border border-border/50 hover:border-primary/30 hover:shadow-md text-left transition-all group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary/15 transition-colors">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-semibold text-text-primary truncate">{product.name}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{product.sku} · {product.category}</p>
                <p className="text-base font-bold text-primary mt-1">₹{product.price}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart */}
      <div className="w-[340px] bg-white rounded-xl border border-border/50 flex flex-col shrink-0">
        <div className="p-4 border-b border-border/50">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            Cart ({cart.reduce((sum, item) => sum + item.qty, 0)} items)
          </h3>
          <div className="mt-2 relative">
            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text" value={customerName} onChange={e => setCustomerName(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-input-bg border border-border rounded-md text-xs focus:outline-none focus:border-primary"
              placeholder="Customer name (optional)"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Cart is empty</p>
              <p className="text-xs mt-1">Click products to add them</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-2 p-2 bg-page-bg rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{item.name}</p>
                  <p className="text-[10px] text-text-muted">₹{item.price} × {item.qty}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-white border border-border flex items-center justify-center hover:bg-gray-50">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-white border border-border flex items-center justify-center hover:bg-gray-50">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-right w-14">
                  <p className="text-xs font-bold">₹{item.price * item.qty}</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-text-muted hover:text-error transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="border-t border-border/50 p-4 space-y-2 bg-page-bg rounded-b-xl border border-border/50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-3.5 h-3.5 text-text-muted" />
            <input
              type="number" min={0} max={100} value={discount} onChange={e => setDiscount(Number(e.target.value))}
              className="w-16 px-2 py-1 bg-white border border-border rounded text-xs text-center focus:outline-none focus:border-primary"
            />
            <span className="text-xs text-text-muted">% discount</span>
          </div>
          <div className="flex justify-between text-xs text-text-muted">
            <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-xs text-secondary-green">
              <span>Discount ({discount}%)</span><span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-text-muted">
            <span>GST (18%)</span><span>₹{gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-text-primary pt-2 border-t border-border">
            <span>Total</span><span>₹{total.toFixed(2)}</span>
          </div>

          {/* Payment Methods */}
          <div className="flex gap-1.5 pt-2">
            {[
              { id: 'cash', icon: Banknote, label: 'Cash' },
              { id: 'upi', icon: Smartphone, label: 'UPI' },
              { id: 'card', icon: CreditCard, label: 'Card' },
            ].map(pm => (
              <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-medium border transition-all ${
                  paymentMethod === pm.id ? 'border-primary bg-primary-light text-primary' : 'border-border bg-white text-text-muted hover:border-primary/30'
                }`}>
                <pm.icon className="w-4 h-4" />
                {pm.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCompleteSale}
            disabled={cart.length === 0}
            className="w-full mt-2 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Charge · ₹{total.toFixed(2)}
          </button>
        </div>
      </div>

      {/* No more modals here! Navigated flow handles Checkout -> Receipt */}
    </div>
  );
}
