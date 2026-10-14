'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search, Package, Truck, CheckCircle, XCircle, Clock,
  MapPin, CreditCard, RotateCcw, ChevronRight,
  AlertCircle, Phone, Box, Star,
} from 'lucide-react';
import api from '@/lib/api';
import { cn, formatPriceEn } from '@/lib/utils';

// ── Status config ─────────────────────────────────────────
const ORDER_STEPS = [
  { key: 'PENDING',    label: 'অর্ডার প্রদান',  icon: Clock,         color: 'text-yellow-600',  bg: 'bg-yellow-100' },
  { key: 'CONFIRMED',  label: 'নিশ্চিত',         icon: CheckCircle,   color: 'text-blue-600',    bg: 'bg-blue-100'   },
  { key: 'PROCESSING', label: 'প্রক্রিয়াধীন',    icon: Box,           color: 'text-indigo-600',  bg: 'bg-indigo-100' },
  { key: 'PACKED',     label: 'প্যাক করা',       icon: Package,       color: 'text-purple-600',  bg: 'bg-purple-100' },
  { key: 'SHIPPED',    label: 'পাঠানো হয়েছে',    icon: Truck,         color: 'text-spice-600',   bg: 'bg-orange-100' },
  { key: 'DELIVERED',  label: 'ডেলিভারি হয়েছে',  icon: CheckCircle,   color: 'text-green-600',   bg: 'bg-green-100'  },
];

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'অপেক্ষারত', CONFIRMED: 'নিশ্চিত', PROCESSING: 'প্রক্রিয়াধীন',
  PACKED: 'প্যাক করা', SHIPPED: 'পাঠানো হয়েছে', DELIVERED: 'ডেলিভারি হয়েছে',
  CANCELLED: 'বাতিল', RETURNED: 'ফেরত', REFUNDED: 'রিফান্ড',
};

const PAY_LABEL: Record<string, string> = {
  PENDING: 'অপেক্ষারত', PROCESSING: 'প্রক্রিয়াধীন', PAID: 'পরিশোধিত',
  FAILED: 'ব্যর্থ', CANCELLED: 'বাতিল', REFUNDED: 'রিফান্ড',
};

const DELIVERY_STATUS_LABEL: Record<string, string> = {
  PENDING: 'অপেক্ষারত', ASSIGNED: 'কুরিয়ারে দেওয়া হয়েছে',
  PICKED_UP: 'কুরিয়ার নিয়েছে', IN_TRANSIT: 'পথে আছে',
  OUT_FOR_DELIVERY: 'ডেলিভারিতে বের হয়েছে', DELIVERED: 'ডেলিভারি হয়েছে',
  FAILED: 'ডেলিভারি ব্যর্থ', RETURNED: 'ফেরত এসেছে',
};

const PAY_METHOD_LABEL: Record<string, string> = {
  CASH_ON_DELIVERY: 'ক্যাশ অন ডেলিভারি', BKASH: 'bKash', NAGAD: 'Nagad',
  ROCKET: 'Rocket', VISA: 'Visa Card', MASTERCARD: 'Mastercard',
  SSLCOMMERZ: 'SSLCommerz', CREDIT_CARD: 'Credit Card', DEBIT_CARD: 'Debit Card',
};

// ── Status badge ──────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING:    'bg-yellow-50 text-yellow-700 border-yellow-200',
    CONFIRMED:  'bg-blue-50 text-blue-700 border-blue-200',
    PROCESSING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    PACKED:     'bg-purple-50 text-purple-700 border-purple-200',
    SHIPPED:    'bg-orange-50 text-orange-700 border-orange-200',
    DELIVERED:  'bg-green-50 text-green-700 border-green-200',
    CANCELLED:  'bg-red-50 text-red-700 border-red-200',
    RETURNED:   'bg-gray-50 text-gray-600 border-gray-200',
    REFUNDED:   'bg-teal-50 text-teal-700 border-teal-200',
  };
  return (
    <span className={cn('text-xs font-bold px-3 py-1 rounded-full border', map[status] ?? 'bg-gray-50 text-gray-600 border-gray-200')}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

// ── Timeline step ─────────────────────────────────────────
function TimelineStep({ step, isCompleted, isCurrent, isLast, historyItem }: {
  step: typeof ORDER_STEPS[0];
  isCompleted: boolean;
  isCurrent: boolean;
  isLast: boolean;
  historyItem?: any;
}) {
  const Icon = step.icon;
  return (
    <div className="flex gap-4">
      {/* Left: icon + line */}
      <div className="flex flex-col items-center">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 border-2',
          isCompleted
            ? `${step.bg} ${step.color} border-current`
            : isCurrent
              ? `${step.bg} ${step.color} border-current ring-4 ring-offset-2 ring-current/20`
              : 'bg-gray-50 text-gray-300 border-gray-200',
        )}>
          {isCompleted ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>
        {!isLast && (
          <div className={cn(
            'w-0.5 flex-1 mt-1 min-h-[32px] transition-colors duration-300',
            isCompleted ? 'bg-green-300' : 'bg-gray-200',
          )} />
        )}
      </div>

      {/* Right: info */}
      <div className={cn('pb-6 flex-1 pt-1.5', isLast && 'pb-0')}>
        <p className={cn(
          'font-bold text-sm',
          isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400',
        )}>
          {step.label}
        </p>
        {historyItem && (
          <>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(historyItem.createdAt).toLocaleDateString('bn-BD', {
                day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
            {historyItem.note && (
              <p className="text-xs text-gray-500 mt-1 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                {historyItem.note}
              </p>
            )}
          </>
        )}
        {isCurrent && !historyItem && (
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-spice-500 animate-pulse inline-block" />
            বর্তমান অবস্থা
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone,       setPhone]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [order,       setOrder]       = useState<any>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const num = orderNumber.trim().toUpperCase();
    if (!num) { setError('অর্ডার নম্বর দিন'); return; }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const params = phone.trim() ? `?phone=${encodeURIComponent(phone.trim())}` : '';
      const res = await api.get(`/orders/track/${num}${params}`);
      setOrder(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'অর্ডারটি পাওয়া যায়নি। সঠিক নম্বর দিন।');
    } finally {
      setLoading(false);
    }
  }

  const isCancelled = order && ['CANCELLED', 'RETURNED', 'REFUNDED'].includes(order.status);
  const currentStep = order ? ORDER_STEPS.findIndex(s => s.key === order.status) : -1;

  // Map statusHistory to steps
  const historyByStatus: Record<string, any> = {};
  order?.statusHistory?.forEach((h: any) => { historyByStatus[h.status] = h; });

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-forest-800 to-forest-700 text-white">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black mb-2">অর্ডার ট্র্যাক করুন</h1>
            <p className="text-white/70 text-sm">আপনার অর্ডার নম্বর দিয়ে রিয়েল-টাইম স্ট্যাটাস দেখুন</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">

        {/* Search form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <form onSubmit={handleTrack} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                অর্ডার নম্বর <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="যেমন: DMR261015XXXX"
                  className="input-base pl-10 font-mono tracking-wide uppercase"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                ফোন নম্বর (ঐচ্ছিক — অতিরিক্ত নিরাপত্তার জন্য)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01700000000"
                  className="input-base pl-10"
                  inputMode="tel"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-800 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60 shadow-sm"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? 'খোঁজা হচ্ছে...' : 'অর্ডার ট্র্যাক করুন'}
            </button>
          </form>
        </div>

        {/* Result */}
        {order && (
          <div className="space-y-4 animate-fade-up">

            {/* Order header card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">অর্ডার নম্বর</p>
                  <p className="font-black text-xl text-gray-900 font-mono">#{order.orderNumber}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status} />
                  <p className="font-black text-xl text-forest-700 mt-2">{formatPriceEn(order.totalAmount)}</p>
                  <p className="text-xs text-gray-400">{PAY_METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}</p>
                </div>
              </div>

              {/* Progress bar */}
              {!isCancelled && (
                <div className="mt-5 overflow-x-auto">
                  <div className="flex items-center min-w-max gap-0">
                    {ORDER_STEPS.map((step, i) => {
                      const done    = i < currentStep;
                      const current = i === currentStep;
                      const Icon    = step.icon;
                      return (
                        <div key={step.key} className="flex items-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className={cn(
                              'w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all',
                              done    ? 'bg-forest-700 border-forest-700 text-white'
                              : current ? `${step.bg} ${step.color} border-current ring-4 ring-current/15`
                              : 'bg-white border-gray-200 text-gray-300',
                            )}>
                              {done ? <CheckCircle className="w-4.5 h-4.5" /> : <Icon className="w-4.5 h-4.5" />}
                            </div>
                            <p className={cn('text-[9px] font-semibold text-center leading-tight w-14',
                              done || current ? 'text-gray-700' : 'text-gray-400')}>
                              {step.label}
                            </p>
                          </div>
                          {i < ORDER_STEPS.length - 1 && (
                            <div className={cn('h-0.5 w-8 mb-5 transition-colors', done ? 'bg-forest-600' : 'bg-gray-200')} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cancelled state */}
              {isCancelled && (
                <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">{STATUS_LABEL[order.status]}</p>
                    {order.cancelReason && (
                      <p className="text-xs text-red-500 mt-0.5">{order.cancelReason}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Delivery info */}
            {order.delivery && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-forest-600" /> ডেলিভারি তথ্য
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">ডেলিভারি স্ট্যাটাস</p>
                    <p className="font-semibold text-gray-800">
                      {DELIVERY_STATUS_LABEL[order.delivery.status] ?? order.delivery.status}
                    </p>
                  </div>
                  {order.delivery.courierName && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">কুরিয়ার</p>
                      <p className="font-semibold text-gray-800">{order.delivery.courierName}</p>
                    </div>
                  )}
                  {order.delivery.trackingNumber && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">ট্র্যাকিং নম্বর</p>
                      <p className="font-semibold text-gray-800 font-mono text-sm">{order.delivery.trackingNumber}</p>
                    </div>
                  )}
                  {order.delivery.estimatedDate && (
                    <div className="bg-spice-50 border border-spice-100 rounded-xl p-3">
                      <p className="text-xs text-spice-600 mb-0.5">আনুমানিক ডেলিভারি</p>
                      <p className="font-bold text-spice-700">
                        {new Date(order.delivery.estimatedDate).toLocaleDateString('bn-BD', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status timeline */}
            {!isCancelled && order.statusHistory && order.statusHistory.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-forest-600" /> অর্ডারের গতিবিধি
                </h3>
                <div>
                  {ORDER_STEPS.map((step, i) => {
                    const isCompleted = i < currentStep;
                    const isCurrent   = i === currentStep;
                    const isReached   = i <= currentStep;
                    if (!isReached) return null;
                    return (
                      <TimelineStep
                        key={step.key}
                        step={step}
                        isCompleted={isCompleted}
                        isCurrent={isCurrent}
                        isLast={i === currentStep}
                        historyItem={historyByStatus[step.key]}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cancelled timeline */}
            {isCancelled && order.statusHistory && order.statusHistory.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" /> অর্ডারের ইতিহাস
                </h3>
                <div className="space-y-3">
                  {order.statusHistory.map((h: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={cn(
                        'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                        h.status === 'CANCELLED' ? 'bg-red-400' : 'bg-forest-500',
                      )} />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{STATUS_LABEL[h.status] ?? h.status}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(h.createdAt).toLocaleDateString('bn-BD', {
                            day: 'numeric', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                        {h.note && <p className="text-xs text-gray-500 mt-0.5">{h.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-forest-600" /> পণ্য তালিকা
              </h3>
              <div className="space-y-3">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
                      {item.productImage
                        ? <Image src={item.productImage} alt={item.productName} width={48} height={48} className="w-full h-full object-cover" />
                        : '🌶️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{item.productName}</p>
                      <p className="text-gray-400 text-xs">{item.quantity} টি</p>
                    </div>
                    <p className="font-bold text-gray-900 flex-shrink-0">{formatPriceEn(item.totalPrice)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Address + Payment */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-forest-600" /> ডেলিভারি ঠিকানা
                </h3>
                <p className="font-semibold text-gray-800 text-sm">{order.address?.fullName}</p>
                <p className="text-gray-500 text-xs mt-1">{order.address?.fullAddress}</p>
                <p className="text-gray-500 text-xs">{order.address?.area}, {order.address?.district}</p>
                <p className="text-gray-500 text-xs">{order.address?.division}</p>
                <p className="text-gray-400 text-xs mt-1.5">📞 {order.address?.phone}</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-forest-600" /> পেমেন্ট
                </h3>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">পদ্ধতি:</span>{' '}
                  {PAY_METHOD_LABEL[order.payment?.paymentMethod ?? ''] ?? order.payment?.paymentMethod ?? '—'}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-semibold">স্ট্যাটাস:</span>{' '}
                  <span className={cn('font-bold',
                    order.payment?.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600')}>
                    {PAY_LABEL[order.payment?.paymentStatus ?? ''] ?? '—'}
                  </span>
                </p>
                {order.payment?.paidAt && (
                  <p className="text-gray-400 text-xs mt-1.5">
                    পরিশোধ: {new Date(order.payment.paidAt).toLocaleDateString('bn-BD')}
                  </p>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center py-2">
              <Link href="/shop" className="btn-primary px-8">
                আরও কেনাকাটা করুন
              </Link>
            </div>
          </div>
        )}

        {/* Delivery charge table */}
        {!order && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-forest-600" /> ডেলিভারি চার্জ তালিকা
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-xs font-bold text-gray-500 uppercase tracking-wide">এলাকা</th>
                    <th className="text-right py-2 text-xs font-bold text-gray-500 uppercase tracking-wide">চার্জ</th>
                    <th className="text-right py-2 text-xs font-bold text-gray-500 uppercase tracking-wide">ফ্রি ডেলিভারি</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { area: 'ঢাকা মহানগর',     charge: '৳৪০',  free: '৳৮০০+' },
                    { area: 'ঢাকা জেলা',        charge: '৳৬০',  free: '৳১০০০+' },
                    { area: 'চট্টগ্রাম সিটি',   charge: '৳১০০', free: '৳১৫০০+' },
                    { area: 'সিলেট / রাজশাহী',  charge: '৳১২০', free: '৳১৫০০+' },
                    { area: 'সারাদেশ',          charge: '৳৬০',  free: '৳১০০০+' },
                  ].map((row) => (
                    <tr key={row.area} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 text-gray-700 font-medium">{row.area}</td>
                      <td className="py-2.5 text-right font-bold text-forest-700">{row.charge}</td>
                      <td className="py-2.5 text-right text-green-600 font-semibold text-xs">{row.free}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
