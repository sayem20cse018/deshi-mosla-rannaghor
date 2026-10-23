'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { formatPriceEn } from '@/lib/utils';

const PAY_METHOD_LABEL: Record<string, string> = {
  CASH_ON_DELIVERY: 'Cash on Delivery',
  BKASH: 'bKash', NAGAD: 'Nagad', ROCKET: 'Rocket',
  SSLCOMMERZ: 'Card / SSLCommerz', VISA: 'Visa', MASTERCARD: 'Mastercard',
};

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get(`/orders/${id}/invoice`)
      .then(r => setOrder(r.data.data))
      .catch(() => setError('Invoice not found or access denied.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-600">{error || 'Invoice not available.'}</p>
        <Link href="/account/orders" className="text-orange-500 hover:underline text-sm">Back to Orders</Link>
      </div>
    );
  }

  const subtotal = Number(order.subtotal);
  const discount = Number(order.discountAmount) + Number(order.couponDiscount);
  const delivery = Number(order.deliveryCharge);
  const total    = Number(order.totalAmount);

  return (
    <>
      {/* Print controls - hidden in print */}
      <div className="print:hidden bg-white border-b border-gray-100 sticky top-0 z-10 px-4 py-3 flex items-center gap-3">
        <Link href={`/account/orders/${id}`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex-1" />
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* Invoice */}
      <div className="max-w-2xl mx-auto p-6 print:p-0 print:max-w-none">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm print:shadow-none print:border-0 p-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-xs">দম</span>
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">দেশি মসলার রান্নাঘর</p>
                  <p className="text-xs text-gray-500">Deshi Moslar Rannaghar</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Dhaka, Bangladesh</p>
              <p className="text-xs text-gray-400">info@deshimoslar.com</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-gray-900">INVOICE</p>
              <p className="text-xs text-gray-500 mt-1 font-mono">#{order.orderNumber}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(order.createdAt).toLocaleDateString('en-BD', {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Bill To</p>
              <p className="font-semibold text-gray-900 text-sm">{order.address?.fullName}</p>
              <p className="text-xs text-gray-500">{order.address?.phone}</p>
              <p className="text-xs text-gray-500 mt-1">{order.address?.fullAddress}</p>
              <p className="text-xs text-gray-500">{order.address?.area}, {order.address?.district}</p>
              <p className="text-xs text-gray-500">{order.address?.division}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Payment</p>
              <p className="text-sm font-semibold text-gray-800">{PAY_METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}</p>
              <p className="text-xs text-gray-500 mt-1">Status: {order.paymentStatus}</p>
              {order.payment?.paidAt && (
                <p className="text-xs text-gray-500">
                  Paid: {new Date(order.payment.paidAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>

          {/* Items table */}
          <table className="w-full mb-6 text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 text-xs font-black text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-center py-2 text-xs font-black text-gray-500 uppercase tracking-wider w-16">Qty</th>
                <th className="text-right py-2 text-xs font-black text-gray-500 uppercase tracking-wider w-24">Unit Price</th>
                <th className="text-right py-2 text-xs font-black text-gray-500 uppercase tracking-wider w-24">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="py-3">
                    <p className="font-semibold text-gray-900">{item.productName}</p>
                    {item.productSku && <p className="text-xs text-gray-400">SKU: {item.productSku}</p>}
                  </td>
                  <td className="py-3 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-700">{formatPriceEn(Number(item.unitPrice))}</td>
                  <td className="py-3 text-right font-semibold text-gray-900">{formatPriceEn(Number(item.totalPrice))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span><span>{formatPriceEn(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span><span>-{formatPriceEn(discount)}</span>
              </div>
            )}
            {order.coupon && (
              <div className="flex justify-between text-xs text-orange-600">
                <span>Coupon ({order.coupon.code})</span><span>Applied</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery</span>
              <span>{delivery === 0 ? 'Free' : formatPriceEn(delivery)}</span>
            </div>
            <div className="flex justify-between font-black text-gray-900 text-base border-t border-gray-200 pt-2 mt-2">
              <span>Total</span>
              <span className="text-orange-500">{formatPriceEn(total)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">Thank you for shopping with দেশি মসলার রান্নাঘর!</p>
            <p className="text-xs text-gray-400 mt-0.5">For queries: info@deshimoslar.com | +880 1700-000000</p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print-invoice, .print-invoice * { visibility: visible; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </>
  );
}