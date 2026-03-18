'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Eye, Printer, FileText, Loader2, IndianRupee, Calendar, MessageCircle, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InvoicesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnItems, setReturnItems] = useState<any[]>([]);
  const [returnReason, setReturnReason] = useState('DAMAGED');
  const [returnNotes, setReturnNotes] = useState('');
  const [refundMethod, setRefundMethod] = useState('CASH');
  const [isProcessingReturn, setIsProcessingReturn] = useState(false);

  const downloadPdf = async (saleId: string, invoiceNumber: string) => {
    setDownloadingId(saleId);
    try {
      const res = await fetch(`/api/invoices/${saleId}/pdf`);
      if (!res.ok) throw new Error('Failed to generate PDF');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('PDF download error:', e);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const shareWhatsApp = (sale: any) => {
    const items = sale.items?.map((i: any) => `• ${i.product?.name || 'Item'} x${i.quantity} = ₹${i.total?.toFixed(2)}`).join('%0A') || '';
    const msg = [
      `*Invoice: ${sale.invoiceNumber}*`,
      `Customer: ${sale.customer?.name || 'Walk-in Customer'}`,
      `Date: ${new Date(sale.createdAt).toLocaleDateString('en-IN')}`,
      ``,
      `*Items:*`,
      items,
      ``,
      `*Total: ₹${sale.total?.toFixed(2)}*`,
      `Payment: ${sale.paymentMethod}`,
      ``,
      `Thank you for shopping with us! 🛍️`,
    ].join('%0A');
    const phone = sale.customer?.phone ? sale.customer.phone.replace(/[^0-9]/g, '') : '';
    const url = phone ? `https://wa.me/91${phone}?text=${msg}` : `https://wa.me/?text=${msg}`;
    window.open(url, '_blank');
  };

  const printThermal = (sale: any) => {
    const items = sale.items?.map((i: any) =>
      `<tr><td>${i.product?.name || 'Item'}</td><td style="text-align:center">${i.quantity}</td><td style="text-align:right">₹${i.total?.toFixed(2)}</td></tr>`
    ).join('') || '';
    const html = `
      <!DOCTYPE html><html><head><title>${sale.invoiceNumber}</title>
      <style>
        @media print { @page { size: 80mm auto; margin: 4mm; } }
        body { font-family: monospace; font-size: 12px; width: 72mm; margin: auto; }
        h1 { font-size: 16px; text-align: center; margin: 0; }
        .center { text-align: center; }
        .divider { border-top: 1px dashed #000; margin: 6px 0; }
        table { width: 100%; border-collapse: collapse; }
        th { font-size: 10px; text-align: left; border-bottom: 1px solid #000; padding-bottom: 3px; }
        td { padding: 2px 0; font-size: 11px; }
        .total { font-size: 14px; font-weight: bold; text-align: right; margin-top: 6px; }
        .footer { text-align: center; font-size: 10px; margin-top: 10px; }
      </style></head><body>
      <h1>RECEIPT</h1>
      <div class="center" style="font-size:11px">Invoice: <b>${sale.invoiceNumber}</b></div>
      <div class="center" style="font-size:10px">${new Date(sale.createdAt).toLocaleString('en-IN')}</div>
      <div class="divider"></div>
      <div style="font-size:11px">Customer: <b>${sale.customer?.name || 'Walk-in'}</b></div>
      <div class="divider"></div>
      <table><thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Amt</th></tr></thead>
      <tbody>${items}</tbody></table>
      <div class="divider"></div>
      <div style="text-align:right;font-size:11px">Subtotal: ₹${sale.subtotal?.toFixed(2)}</div>
      ${sale.discount > 0 ? `<div style="text-align:right;font-size:11px;color:#16a34a">Discount: -₹${sale.discount?.toFixed(2)}</div>` : ''}
      <div class="total">TOTAL: ₹${sale.total?.toFixed(2)}</div>
      <div style="text-align:right;font-size:10px">Payment: ${sale.paymentMethod}</div>
      <div class="divider"></div>
      <div class="footer">Thank you for shopping!<br/>Powered by CraftoryPOS</div>
      </body></html>`;
    const win = window.open('', '_blank', 'width=300,height=500');
    if (win) { win.document.write(html); win.document.close(); win.focus(); win.print(); win.close(); }
  };

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/sales?limit=50`);
      const data = await res.json();
      setSales(data.sales || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleExportCSV = () => {
    if (sales.length === 0) return alert('No data to export');
    const headers = ['Invoice Number', 'Date', 'Customer', 'Items', 'Total Amount', 'Payment Method'];
    const rows = sales.map(s => [
      s.invoiceNumber,
      new Date(s.createdAt).toLocaleString(),
      s.customer?.name || 'Walk-in',
      s.items?.length || 0,
      s.total,
      s.paymentMethod
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenReturn = (sale: any) => {
    setSelectedSale(sale);
    setReturnItems(sale.items.map((item: any) => ({
      productId: item.productId,
      name: item.product?.name || 'Item',
      originalQty: item.quantity,
      returnQty: 0,
      price: item.price,
      restock: true,
      selected: false
    })));
    setShowReturnModal(true);
  };

  const handleProcessReturn = async () => {
    const selectedItems = returnItems.filter(i => i.selected && i.returnQty > 0);
    if (selectedItems.length === 0) return alert('Select items to return');

    setIsProcessingReturn(true);
    try {
      const res = await fetch(`/api/sales/${selectedSale.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedItems.map(i => ({
            productId: i.productId,
            quantity: i.returnQty,
            restockItem: i.restock
          })),
          reason: returnReason,
          notes: returnNotes,
          refundMethod,
          refundAmount: selectedItems.reduce((acc, cur) => acc + (cur.returnQty * cur.price), 0)
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Return processed: ${data.return.returnNumber}`);
        setShowReturnModal(false);
        fetchSales();
      } else {
        alert(data.error || 'Return failed');
      }
    } catch (e) {
      alert('Internal error');
    } finally {
      setIsProcessingReturn(false);
    }
  };

  const filtered = sales.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Sales & Invoices</h1>
          <p className="text-sm text-text-muted mt-0.5">{sales.length} transactions recorded total</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-xs font-bold text-text-muted hover:border-primary hover:text-primary transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            placeholder="Search by invoice # or customer name..." />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-page-bg/50 border-b border-border/50">
                <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Invoice Info</th>
                <th className="text-left py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Customer</th>
                <th className="text-right py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Total Amount</th>
                <th className="text-center py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Payment</th>
                <th className="text-center py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Status</th>
                <th className="text-center py-4 px-6 font-bold text-text-muted text-[11px] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center"><Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" /></td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-text-muted font-medium">No invoices found. Start selling in the POS!</td>
                </tr>
              ) : filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-page-bg/20 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/5 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-black text-text-primary text-xs uppercase tracking-tighter">{inv.invoiceNumber}</p>
                        <p className="text-[10px] text-text-muted font-bold flex items-center gap-1 mt-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-page-bg rounded-full flex items-center justify-center text-[10px] font-black">{inv.customer?.name?.[0] || 'W'}</div>
                      <p className="font-bold text-text-primary">{inv.customer?.name || 'Walk-in Customer'}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <p className="font-black text-text-primary">₹{inv.total.toFixed(2)}</p>
                    <p className="text-[10px] text-text-muted font-bold tracking-tight">Items: {inv.items?.length || 0}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-[10px] font-black px-2 py-1 bg-page-bg rounded text-text-muted uppercase border border-border/50">
                      {inv.paymentMethod}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-2.5 py-1 bg-secondary-green/10 text-secondary-green rounded-lg text-[10px] font-black uppercase tracking-tight">
                      Paid
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedSale(inv)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all" title="View Invoice">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadPdf(inv.id, inv.invoiceNumber)}
                        disabled={downloadingId === inv.id}
                        className="p-2 rounded-lg hover:bg-secondary-green/10 text-secondary-green transition-all disabled:opacity-50"
                        title="Download PDF"
                      >
                        {downloadingId === inv.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      </button>
                      <button onClick={() => shareWhatsApp(inv)} className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-all" title="Share on WhatsApp">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => printThermal(inv)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all" title="Thermal Print">
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      <AnimatePresence>
        {selectedSale && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSale(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between bg-page-bg/20">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-black text-text-primary uppercase tracking-tight">Invoice: {selectedSale.invoiceNumber}</h2>
                </div>
                <button onClick={() => setSelectedSale(null)} className="p-1.5 hover:bg-page-bg rounded-lg text-text-muted hover:text-text-primary transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-wider mb-1">Customer Details</p>
                    <p className="text-sm font-black text-text-primary">{selectedSale.customer?.name || 'Walk-in Customer'}</p>
                    <p className="text-xs font-bold text-text-muted">{selectedSale.customer?.phone || 'No Phone'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-wider mb-1">Date & Time</p>
                    <p className="text-sm font-bold text-text-primary">{new Date(selectedSale.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-dashed border-border">
                  <div className="flex justify-between px-2 text-[10px] font-black text-text-muted uppercase tracking-widest">
                    <span>Item Description</span>
                    <div className="flex gap-12">
                      <span>Qty</span>
                      <span>Price</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedSale.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-page-bg/30 rounded-xl border border-border/30">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 bg-primary/5 rounded-lg border border-primary/10 overflow-hidden flex items-center justify-center shrink-0">
                             {item.product?.imageUrl ? (
                                <img src={item.product?.imageUrl} alt={item.product?.name} className="w-full h-full object-cover" />
                             ) : (
                                <Package className="w-4 h-4 text-primary opacity-50" />
                             )}
                          </div>
                          <div>
                            <p className="text-xs font-black text-text-primary">{item.product?.name || 'Unnamed Product'}</p>
                            <p className="text-[10px] text-text-muted font-bold font-mono">CODE: {item.product?.barcode || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex gap-12 text-xs font-black text-text-primary">
                          <span className="w-8 text-center">{item.quantity}</span>
                          <span className="w-16 text-right">₹{item.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-dashed border-border space-y-2">
                  <div className="flex justify-between text-xs font-bold text-text-muted px-2">
                    <span>Subtotal</span><span>₹{selectedSale.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-secondary-green px-2">
                    <span>Discount</span><span>-₹{selectedSale.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-text-primary bg-primary/5 p-4 rounded-2xl border border-primary/10 mt-4">
                    <span className="uppercase tracking-tight text-primary">Grand Total</span>
                    <span className="text-primary tracking-tighter">₹{selectedSale.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <div className="flex gap-3">
                    <button
                      onClick={() => downloadPdf(selectedSale.id, selectedSale.invoiceNumber)}
                      disabled={downloadingId === selectedSale.id}
                      className="flex-1 py-3 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {downloadingId === selectedSale.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      {downloadingId === selectedSale.id ? 'Generating...' : 'Download PDF'}
                    </button>
                    {selectedSale.status !== 'RETURNED' && (Date.now() - new Date(selectedSale.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000 && (
                      <button onClick={() => handleOpenReturn(selectedSale)} className="flex-1 py-3 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 shadow-xl shadow-orange-600/20 transition-all">
                        Return Items
                      </button>
                    )}
                    <button onClick={() => setSelectedSale(null)} className="flex-1 py-3 bg-page-bg text-text-primary font-bold rounded-2xl border border-border transition-all">
                      Close
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => shareWhatsApp(selectedSale)}
                      className="flex-1 py-3 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" /> WhatsApp Share
                    </button>
                    <button onClick={() => printThermal(selectedSale)}
                      className="flex-1 py-3 bg-page-bg text-text-primary font-bold rounded-2xl border border-border hover:bg-border/50 transition-all flex items-center justify-center gap-2">
                      <Printer className="w-4 h-4" /> Thermal Print
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Return Processing Modal */}
      <AnimatePresence>
        {showReturnModal && selectedSale && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReturnModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]">
              <div className="p-6 border-b border-border flex items-center justify-between bg-orange-50/50">
                <h2 className="text-lg font-black text-orange-700 uppercase tracking-tight">Process Return: {selectedSale.invoiceNumber}</h2>
                <button onClick={() => setShowReturnModal(false)} className="p-2 hover:bg-orange-100 rounded-full transition-colors"><X className="w-5 h-5 text-orange-700" /></button>
              </div>

              <div className="p-6 space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2">Select</th>
                        <th className="text-left py-2 px-2">Product</th>
                        <th className="text-center py-2 px-2">Original Qty</th>
                        <th className="text-center py-2 px-2">Return Qty</th>
                        <th className="text-right py-2 px-2">Price</th>
                        <th className="text-center py-2 px-2">Restock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {returnItems.map((item, idx) => (
                        <tr key={idx} className={item.selected ? 'bg-orange-50/30' : ''}>
                          <td className="py-3 px-2">
                            <input type="checkbox" checked={item.selected} onChange={e => {
                                const newItems = [...returnItems];
                                newItems[idx].selected = e.target.checked;
                                if (e.target.checked && newItems[idx].returnQty === 0) newItems[idx].returnQty = 1;
                                setReturnItems(newItems);
                            }} className="w-4 h-4 accent-orange-600 cursor-pointer" />
                          </td>
                          <td className="py-3 px-2 font-bold">{item.name}</td>
                          <td className="py-3 px-2 text-center">{item.originalQty}</td>
                          <td className="py-3 px-2 text-center">
                            <input type="number" min={0} max={item.originalQty} value={item.returnQty} 
                              onChange={e => {
                                const newItems = [...returnItems];
                                newItems[idx].returnQty = Math.min(item.originalQty, Math.max(0, parseInt(e.target.value) || 0));
                                setReturnItems(newItems);
                              }}
                              className="w-16 px-2 py-1 border border-border rounded text-center focus:ring-1 focus:ring-orange-500 focus:outline-none" 
                            />
                          </td>
                          <td className="py-3 px-2 text-right">₹{item.price}</td>
                          <td className="py-3 px-2 text-center">
                            <input type="checkbox" checked={item.restock} onChange={e => {
                                const newItems = [...returnItems];
                                newItems[idx].restock = e.target.checked;
                                setReturnItems(newItems);
                            }} className="w-4 h-4 accent-orange-600 cursor-pointer" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase mb-1.5">Return Reason</label>
                    <select value={returnReason} onChange={e => setReturnReason(e.target.value)} className="w-full p-3 bg-page-bg/50 border border-border rounded-xl text-xs font-bold outline-none focus:border-orange-500 appearance-none">
                      <option value="DAMAGED">Damaged Product</option>
                      <option value="WRONG_ITEM">Wrong Item Delivered</option>
                      <option value="CUSTOMER_REQUEST">Customer Request</option>
                      <option value="EXPIRED">Expired Product</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase mb-1.5">Refund Method</label>
                    <select value={refundMethod} onChange={e => setRefundMethod(e.target.value)} className="w-full p-3 bg-page-bg/50 border border-border rounded-xl text-xs font-bold outline-none focus:border-orange-500 appearance-none">
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="CARD">Card</option>
                      <option value="STORE_CREDIT">Store Credit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase mb-1.5">Notes (Optional)</label>
                  <textarea value={returnNotes} onChange={e => setReturnNotes(e.target.value)} className="w-full p-3 bg-page-bg/50 border border-border rounded-xl text-xs font-bold h-20 outline-none focus:border-orange-500 resize-none" placeholder="Add some details about the return..."></textarea>
                </div>

                <div className="flex justify-between items-center p-5 bg-orange-50 rounded-2xl border border-orange-200">
                  <div>
                    <p className="text-[10px] text-orange-700 font-black uppercase tracking-wider mb-1">Estimated Refund</p>
                    <p className="text-3xl font-black text-orange-700">₹{returnItems.filter(i => i.selected).reduce((acc, cur) => acc + (cur.returnQty * cur.price), 0).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={handleProcessReturn}
                    disabled={isProcessingReturn || returnItems.filter(i => i.selected && i.returnQty > 0).length === 0}
                    className="px-10 py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 shadow-xl shadow-orange-600/30 disabled:opacity-50 flex items-center gap-2 transform active:scale-95 transition-all"
                  >
                    {isProcessingReturn ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Return'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
