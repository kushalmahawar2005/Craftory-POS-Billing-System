'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Printer, CheckCircle2, ShoppingCart, ArrowLeft, Download, Share2, RefreshCw, RotateCcw } from 'lucide-react';

type ReturnItem = { id: string; product: { name: string }; price: number; quantity: number };

function ReturnReceiptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [mounted, setMounted] = useState(false);
  const [returnDetails, setReturnDetails] = useState<any>(null);
  const [shopInfo, setShopInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Fetch shop info
    fetch('/api/settings/shop')
      .then(res => res.json())
      .then(data => setShopInfo(data))
      .catch(e => console.error(e));

    if (id) {
      fetch(`/api/sales/returns/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          setReturnDetails(data);
        })
        .catch(e => {
          console.error(e);
          alert('Failed to load return details');
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-8 h-8 text-orange-600 animate-spin" />
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center">Fetching Return Data...</p>
      </div>
    );
  }

  if (!returnDetails) return <div className="text-center p-10 font-bold">Return Record Not Found</div>;

  const subtotal = returnDetails.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-8 pb-20 items-center hide-when-printing">
      <div className="w-full max-w-md px-4 mb-6 flex justify-between items-center print:hidden">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md print:max-w-none print:shadow-none print:m-0"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-orange-500/5 overflow-hidden border border-gray-100 print:border-none print:rounded-none">
          {/* Header Banner - Orange for Returns */}
          <div className="bg-orange-600 p-8 text-center text-white relative print:hidden">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/20">
              <RotateCcw className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight uppercase">Return Voucher</h2>
            <p className="text-orange-100 text-[11px] mt-1 font-bold tracking-widest uppercase">Credit Note for Transaction</p>
          </div>

          {/* Printable Receipt Area */}
          <div className="p-8 print:p-0">
            <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-6 print:border-none print:p-0">
              {/* Store Identity */}
              <div className="text-center border-b border-gray-100 pb-6 mb-6">
                <h3 className="font-black text-lg uppercase tracking-[0.2em] text-gray-900 leading-none">{shopInfo?.gstTradeName || shopInfo?.shopName || 'CRAFTORY POS'}</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 px-3 py-1 bg-gray-50 inline-block rounded-full">Return Credit Note</p>
                <div className="mt-4 space-y-0.5">
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-tight">{shopInfo?.stores?.[0]?.address || 'Your Address Here'}</p>
                    {shopInfo?.gstin && <p className="text-[10px] text-gray-400 font-black tracking-widest">GSTIN: {shopInfo.gstin}</p>}
                </div>
              </div>
              
              {/* Meta Data */}
              <div className="flex justify-between mb-6 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                <div>
                  <p>Date: {new Date(returnDetails.createdAt).toLocaleDateString()}</p>
                  <p>Time: {new Date(returnDetails.createdAt).toLocaleTimeString()}</p>
                </div>
                <div className="text-right uppercase tracking-[0.1em] text-[10px] font-bold text-gray-500 underline underline-offset-4 decoration-orange-100">
                  <p>Return#: <span className="text-gray-900 font-black">{returnDetails.returnNumber}</span></p>
                  <p>Original Inv: <span className="text-gray-900 font-black">{returnDetails.sale?.invoiceNumber}</span></p>
                  <p>Staff: <span className="text-gray-900 font-black">{returnDetails.staff?.name || 'Admin'}</span></p>
                </div>
              </div>

              {returnDetails.sale?.customer?.name && (
                <div className="mb-6 bg-orange-50/30 p-4 rounded-2xl border border-orange-50">
                  <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-1.5">Returned By</p>
                  <p className="text-sm font-black text-gray-900 leading-none">{returnDetails.sale.customer.name}</p>
                </div>
              )}

              {/* Items List */}
              <div className="mb-6">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left font-black text-gray-400 pb-3 w-1/2 uppercase tracking-widest">Item Description</th>
                      <th className="text-center font-black text-gray-400 pb-3 w-1/4 uppercase tracking-widest">Qty</th>
                      <th className="text-right font-black text-gray-400 pb-3 w-1/4 uppercase tracking-widest">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 font-medium">
                    {returnDetails.items.map((item: any, i: number) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pr-2 font-bold">{item.product?.name}</td>
                        <td className="text-center py-3">{item.quantity}</td>
                        <td className="text-right py-3 font-black">₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="border-t border-gray-100 pt-6 space-y-2 text-xs font-bold">
                <div className="flex justify-between text-gray-400 uppercase tracking-widest">
                  <span>Return Total</span>
                  <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 px-4 bg-orange-600 rounded-2xl -mx-4 mt-4 shadow-xl shadow-orange-600/10">
                  <span className="font-black text-white text-[11px] uppercase tracking-[0.2em]">Refund Amount</span>
                  <span className="font-black text-white text-2xl tracking-tighter">₹{returnDetails.refundAmount.toFixed(2)}</span>
                </div>

                <div className="pt-4 text-center italic text-gray-400 text-[10px]">
                    Reason: {returnDetails.reason}
                </div>
              </div>

              {/* Footer text */}
              <div className="text-center mt-10">
                <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Return Processed</p>
                <p className="text-[10px] text-gray-400 mt-2 font-bold">This is a credit note for the returned items. <br/> Amount refunded via {returnDetails.refundMethod}.</p>
              </div>
            </div>
            
            {/* Actions Panel - Hidden when printing */}
            <div className="mt-8 flex gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 h-14 bg-white text-gray-800 font-black text-[11px] uppercase tracking-widest rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Voucher
              </button>
            </div>
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

export default function ReturnReceiptPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReturnReceiptContent />
    </Suspense>
  );
}
