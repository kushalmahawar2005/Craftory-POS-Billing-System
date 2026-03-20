'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Printer, CheckCircle2, ShoppingCart, ArrowLeft, Download, Share2 } from 'lucide-react';

type CartItem = { id: number; name: string; price: number; qty: number };

export default function ReceiptPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [staffName, setStaffName] = useState('');
  const [shopInfo, setShopInfo] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Load state from session storage
    const savedCart = sessionStorage.getItem('pos_cart');
    const savedDiscount = sessionStorage.getItem('pos_discount');
    const savedCustomer = sessionStorage.getItem('pos_customer');
    const savedInvoice = sessionStorage.getItem('pos_invoice');
    const savedMode = sessionStorage.getItem('pos_payment_mode');
    const savedStaff = sessionStorage.getItem('pos_staff');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedDiscount) setDiscount(Number(savedDiscount));
    if (savedCustomer) setCustomerName(savedCustomer);
    if (savedInvoice) setInvoiceNumber(savedInvoice);
    if (savedMode) setPaymentMode(savedMode);
    if (savedStaff) setStaffName(savedStaff);

    // Fetch shop info
    fetch('/api/settings/shop')
      .then(res => res.json())
      .then(data => setShopInfo(data))
      .catch(e => console.error(e));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleNewSale = () => {
    sessionStorage.removeItem('pos_cart');
    sessionStorage.removeItem('pos_discount');
    sessionStorage.removeItem('pos_customer');
    sessionStorage.removeItem('pos_invoice');
    sessionStorage.removeItem('pos_payment_mode');
    sessionStorage.removeItem('pos_staff');
    router.replace('/app/pos');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-8 pb-20 items-center hide-when-printing">
      <div className="w-full max-w-md px-4 mb-6 flex justify-between items-center print:hidden">
        <button 
          onClick={handleNewSale}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Terminal
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md print:max-w-none print:shadow-none print:m-0"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-500/5 overflow-hidden border border-gray-100 print:border-none print:rounded-none">
          {/* Header Banner - Clean Blue */}
          <div className="bg-blue-600 p-8 text-center text-white relative print:hidden">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/20">
              <CheckCircle2 className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight uppercase">Payment Success</h2>
            <p className="text-blue-100 text-[11px] mt-1 font-bold tracking-widest uppercase">Invoice #{Math.floor(Math.random() * 1000000)}</p>
          </div>

          {/* Printable Receipt Area */}
          <div className="p-8 print:p-0">
            <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-6 print:border-none print:p-0">
              {/* Store Identity */}
              <div className="text-center border-b border-gray-100 pb-6 mb-6">
                <h3 className="font-black text-lg uppercase tracking-[0.2em] text-gray-900 leading-none">{shopInfo?.gstTradeName || shopInfo?.shopName || 'CRAFTORY POS'}</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 px-3 py-1 bg-gray-50 inline-block rounded-full">{shopInfo?.businessType || 'Retail Store'}</p>
                <div className="mt-4 space-y-0.5">
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-tight">{shopInfo?.stores?.[0]?.address || 'Your Address Here'}</p>
                    {shopInfo?.gstin && <p className="text-[10px] text-gray-400 font-black tracking-widest">GSTIN: {shopInfo.gstin}</p>}
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Contact: {shopInfo?.phone || '+91 XXXXX XXXXX'}</p>
                </div>
              </div>
              
              {/* Meta Data */}
              <div className="flex justify-between mb-6 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                <div>
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Time: {new Date().toLocaleTimeString()}</p>
                </div>
                <div className="text-right uppercase tracking-[0.1em] text-[10px] font-bold text-gray-500 underline underline-offset-4 decoration-blue-100">
                  <p>Inv: <span className="text-gray-900 font-black">{invoiceNumber || "DRAFT"}</span></p>
                  <p>Mode: <span className="text-gray-900 font-black">{paymentMode || "CASH"}</span></p>
                  <p>Staff: <span className="text-gray-900 font-black">{staffName || "Admin"}</span></p>
                </div>
              </div>

              {customerName && (
                <div className="mb-6 bg-blue-50/30 p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1.5">Billed To</p>
                  <p className="text-sm font-black text-gray-900 leading-none">{customerName}</p>
                </div>
              )}

              {/* Items List */}
              <div className="mb-6">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left font-black text-gray-400 pb-3 w-1/2 uppercase tracking-widest">Item Description</th>
                      <th className="text-center font-black text-gray-400 pb-3 w-1/4 uppercase tracking-widest">Qty</th>
                      <th className="text-right font-black text-gray-400 pb-3 w-1/4 uppercase tracking-widest">Price</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 font-medium">
                    {cart.map((item, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0 group">
                        <td className="py-3 pr-2 font-bold">{item.name}</td>
                        <td className="text-center py-3">{item.qty}</td>
                        <td className="text-right py-3 font-black">₹{(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="border-t border-gray-100 pt-6 space-y-2 text-xs font-bold">
                <div className="flex justify-between text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-500 uppercase tracking-widest">
                    <span>Discount ({discount}%)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-4 px-4 bg-gray-900 rounded-2xl -mx-4 mt-4 shadow-xl shadow-gray-900/10">
                  <span className="font-black text-white text-[11px] uppercase tracking-[0.2em]">Total Amount</span>
                  <span className="font-black text-white text-2xl tracking-tighter">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Footer text */}
              <div className="text-center mt-10">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Thank you for your visit!</p>
                <p className="text-[10px] text-gray-400 mt-2 font-bold">Please retain this receipt for any <br/> support or returns.</p>
              </div>
            </div>
            
            {/* Actions Panel - Hidden when printing */}
            <div className="mt-8 flex gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 h-14 bg-white text-gray-800 font-black text-[11px] uppercase tracking-widest rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button
                 className="flex-1 h-14 bg-white text-gray-800 font-black text-[11px] uppercase tracking-widest rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
            <button
              onClick={handleNewSale}
              className="w-full mt-3 h-14 bg-blue-600 text-white font-black text-[13px] uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20"
            >
              Start New Sale
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Global Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .hide-when-printing { background: white !important; padding: 0 !important; }
          .print\\:hidden, .print\\:hidden * { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-none { border: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:m-0 { margin: 0 !important; }
          .print\\:max-w-none { max-width: none !important; }
          .hide-when-printing > div:nth-child(2),
          .hide-when-printing > div:nth-child(2) * { visibility: visible; }
          .hide-when-printing > div:nth-child(2) {
            position: absolute; left: 0; top: 0; width: 100%;
          }
        }
      `}} />
    </div>
  );
}
