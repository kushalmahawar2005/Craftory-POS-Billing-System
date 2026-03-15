'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Printer, CheckCircle2, ShoppingCart, ArrowLeft } from 'lucide-react';

type CartItem = { id: number; name: string; price: number; qty: number };

export default function ReceiptPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    setMounted(true);
    // Load state from session storage
    const savedCart = sessionStorage.getItem('pos_cart');
    const savedDiscount = sessionStorage.getItem('pos_discount');
    const savedCustomer = sessionStorage.getItem('pos_customer');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedDiscount) setDiscount(Number(savedDiscount));
    if (savedCustomer) setCustomerName(savedCustomer);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = (subtotal * discount) / 100;
  const gst = (subtotal - discountAmount) * 0.18;
  const total = subtotal - discountAmount + gst;

  const handleNewSale = () => {
    sessionStorage.removeItem('pos_cart');
    sessionStorage.removeItem('pos_discount');
    sessionStorage.removeItem('pos_customer');
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
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to POS
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md print:max-w-none print:shadow-none print:m-0"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 print:border-none print:rounded-none">
          {/* Header Banner */}
          <div className="bg-secondary-green p-8 text-center text-white relative print:hidden">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-secondary-green" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Payment Successful</h2>
            <p className="text-white/90 text-sm mt-1.5 font-medium">Transaction ID: TXN-{Math.floor(Math.random() * 1000000)}</p>
          </div>

          {/* Printable Receipt Area */}
          <div className="p-8 print:p-0">
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 print:border-none print:p-0">
              {/* Store Identity */}
              <div className="text-center border-b-2 border-dashed border-gray-200 pb-5 mb-5">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-gray-900" />
                  </div>
                </div>
                <h3 className="font-black text-lg uppercase tracking-widest text-gray-900">Craftory POS</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Retail Billing Software</p>
                <p className="text-sm text-gray-600 font-medium mt-2">Demo Store Location</p>
                <p className="text-xs text-gray-500 mt-0.5">Contact: +91 98765 43210</p>
                <p className="text-xs text-gray-900 font-bold mt-2 bg-gray-100 inline-block px-2 py-0.5 rounded">GSTIN: 29ABCDE1234F1ZH</p>
              </div>
              
              {/* Meta Data */}
              <div className="flex justify-between mb-5 text-sm text-gray-600 font-mono">
                <div>
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Time: {new Date().toLocaleTimeString()}</p>
                </div>
                <div className="text-right">
                  <p>Inv: #{Math.floor(Math.random() * 10000)}</p>
                  <p>Cashier: Demo User</p>
                </div>
              </div>

              {customerName && (
                <div className="mb-5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Billed To</p>
                  <p className="text-sm font-bold text-gray-900">{customerName}</p>
                </div>
              )}

              {/* Items List */}
              <div className="mb-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-dashed border-gray-200">
                      <th className="text-left font-bold text-gray-900 pb-2 w-1/2 uppercase text-xs tracking-wider">Item</th>
                      <th className="text-center font-bold text-gray-900 pb-2 w-1/4 uppercase text-xs tracking-wider">Qty</th>
                      <th className="text-right font-bold text-gray-900 pb-2 w-1/4 uppercase text-xs tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-gray-600">
                    {cart.map((item, i) => (
                      <tr key={item.id} className="align-top border-b border-gray-50 last:border-0">
                        <td className="py-2 pr-2">{item.name}</td>
                        <td className="text-center py-2">{item.qty}</td>
                        <td className="text-right py-2 text-gray-900 font-medium">₹{(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="border-t-2 border-dashed border-gray-200 pt-4 space-y-2 text-sm font-mono text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-secondary-green font-medium">
                    <span>Discount ({discount}%)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>CGST (9%)</span>
                  <span>₹{(gst/2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b-2 border-dashed border-gray-200 pb-3 mb-3">
                  <span>SGST (9%)</span>
                  <span>₹{(gst/2).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg px-3 -mx-3">
                  <span className="font-black text-gray-900 text-base uppercase tracking-wider">Grand Total</span>
                  <span className="font-black text-gray-900 text-xl">₹{total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between mt-3">
                  <span>Payment Status</span>
                  <span className="font-bold text-secondary-green uppercase tracking-wider">Paid</span>
                </div>
              </div>

              {/* Footer text */}
              <div className="text-center border-t-2 border-dashed border-gray-200 mt-6 pt-5">
                <p className="text-sm font-bold text-gray-900 italic">Thank you for your visit!</p>
                <p className="text-xs text-gray-500 mt-1">Please retain this receipt for returns/exchanges <br/> within 7 days.</p>
              </div>
            </div>
            
            {/* Actions Panel - Hidden when printing */}
            <div className="mt-8 flex gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-[1] py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-5 h-5 text-gray-500" /> Print
              </button>
              <button
                onClick={handleNewSale}
                className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)]"
              >
                Start New Sale
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Global Print Styles defined via inline CSS here for convenience */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .hide-when-printing {
            background: white !important;
            padding: 0 !important;
          }
          .print\\:hidden, .print\\:hidden * {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:m-0 {
            margin: 0 !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
          /* Target specific elements to be visible */
          .hide-when-printing > div:nth-child(2),
          .hide-when-printing > div:nth-child(2) * {
            visibility: visible;
          }
          .hide-when-printing > div:nth-child(2) {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}} />
    </div>
  );
}
