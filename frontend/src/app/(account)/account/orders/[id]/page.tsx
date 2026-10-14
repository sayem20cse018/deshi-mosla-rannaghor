'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Loader2, Package, MapPin, CreditCard, Truck,
  CheckCircle, XCircle, Clock, Box, AlertTriangle,
  RotateCcw, Star, ExternalLink,
} from 'lucide-react';
import api from '@/lib/api';
import { cn, formatPriceEn } from '@/lib/utils';
import toast from 'react-hot-toast';

// ─── constants ───────────────────────────────────────────
const ORDER_STEPS = [
  { key: 'PENDING',    label: 'অর্ডার\nপ্রদান',   icon: Clock       },
  { key: 'CONFIRMED',  label: 'নিশ্চিত',            icon: CheckCircle },
  { key: 'PROCESSING', label: 'প্রক্রিয়া\nধীন',     icon: Box         },
  { key: 'PACKED',     label: 'প্যাক\nকরা',         icon: Package     },
  { key: 'SHIPPED',    label: 'পাঠানো\nহয়েছে',       icon: Truck       },
  { key: 'DELIVERED',  label: 'ডেলিভারি\nহয়েছে',    icon: CheckCircle },
];

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'অপেক্ষারত', CONFIRMED: 'নিশ্চিত', PROCESSING: 'প্রক্রিয়াধীন',
  PACKED: 'প্যাক করা', SHIPPED: 'পাঠানো হয়েছে', DELIVERED: 'ডেলিভারি হয়েছে',
  CANCELLED: 'বাতিল', RETURNED: 'ফেরত', REFUNDED: 'রিফান্ড',
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  PACKED: 'bg-purple-50 text-purple-700 border-purple-200',
  SHIPPED: 'bg-orange-50 text-orange-700 border-orange-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  RETURNED: 'bg-gray-50 text-gray-600 border-gray-200',
  REFUNDED: 'bg-teal-50 text-teal-700 border-teal-200',
};

const PAY_LABEL: Record<string, string> = {
  PENDING: 'অপেক্ষারত', PROCESSING: 'প্রক্রিয়াধীন', PAID: 'পরিশোধিত',
  FAILED: 'ব্যর্থ', CANCELLED: 'বাতিল', REFUNDED: 'রিফান্ড',
};

const PAY_METHOD_LABEL: Record<string, string> = {
  CASH_ON_DELIVERY: 'ক্যাশ অন ডেলিভারি', BKASH: 'bKash', NAGAD: 'Nagad',
  ROCKET: 'Rocket', SSLCOMMERZ: 'SSLCommerz', VISA: 'Visa',
  MASTERCARD: 'Mastercard', CREDIT_CARD: 'Credit Card', DEBIT_CARD: 'Debit Card',
};

const DELIVERY_LABEL: Record<string, string> = {
  PENDING: 'অপেক্ষারত', ASSIGNED: 'কুরিয়ারে দেওয়া হয়েছে',
  PICKED_UP: 'কুরিয়ার নিয়েছে', IN_TRANSIT: 'পথে আছে',
  OUT_FOR_DELIVERY: 'ডেলিভারিতে বের হয়েছে', DELIVERED: 'ডেলিভারি হয়েছে',
  FAILED: 'ডেলিভারি ব্যর্থ', RETURNED: 'ফেরত এসেছে',
};

// ─── Cancel modal ────────────────────────────────────────
function CancelModal({
  onConfirm, onClose, loading,
}: { onConfirm: (reason: string) => void; onClose: () => void; loading: boolean }) {
  const [reason, setReason] = useState('');
  const REASONS = [
    'ভুলে অর্ডার দিয়েছিলাম',
    'অন্য জায়গায় কম দামে পেয়েছি',
    'পণ্যটি এখন আর দরকার নেই',
    'ডেলিভারি সময় বেশি',
    'অন্য কারণ',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-up">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-lg font-black text-gray-900 text-center mb-1">অর্ডার বাতিল করবেন?</h3>
        <p className="text-gray-500 text-sm text-center mb-5">
          বাতিল করলে স্টক ফেরত দেওয়া হবে। এটি পূর্বাবস্থায় ফেরানো যাবে না।
        </p>

        <div className="space-y-2 mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">বাতিলের কারণ নির্বাচন করুন</p>
          {REASONS.map((r) => (
            <label key={r} className={cn(
              'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
              reason === r ? 'border-red-400 bg-red-50' : 'border-gray-100 hover:border-gray-200',
            )}>
              <div className={cn(
                'w-4 h-4 rounded-full border-2 flex-shrink-0',
                reason === r ? 'border-red-500 bg-red-500' : 'border-gray-300',
              )}>
                {reason === r && <div className="w-full h-full rounded-full bg-white scale-[0.4] transform" />}
              </div>
              <input type="radio" className="sr-only" value={r} checked={reason === r}
                onChange={() => setReason(r)} />
              <span className="text-sm text-gray-700">{r}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
            ফিরে যান
          </button>
          <button
            onClick={() => onConfirm(reason || 'গ্রাহক কর্তৃক বাতিল')}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> বাতিল হচ্ছে...</>
              : 'হ্যাঁ, বাতিল করুন'
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────
export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const qc      = useQueryClient();
  const [showCancel, setShowCancel] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-order', id],
    queryFn: async () => {
      const r = await api.get(`/users/me/orders/${id}`);
      return r.data.data;
    },
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: (reason: string) =>
      api.patch(`/orders/${id}/cancel`, { reason }),
    onSuccess: () => {
      toast.success('অর্ডার বাতিল হয়েছে');
      setShowCancel(false);
      qc.invalidateQueries({ queryKey: ['my-order', id] });
      qc.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'বাতিল করা সম্ভব হয়নি');
      setShowCancel(false);
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
      </div>
    );

  if (error || !data)
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <Package className="w-14 h-14 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-600 font-semibold mb-4">অর্ডারটি পাওয়া যায়নি।</p>
        <Link href="/account/orders" className="btn-primary px-6 text-sm">
          অর্ডার তালিকায় ফিরুন
        </Link>
      </div>
    );

  const currentStep  = ORDER_STEPS.findIndex(s => s.key === data.status);
  const isCancelled  = ['CANCELLED', 'RETURNED', 'REFUNDED'].includes(data.status);
  const canCancel    = data.status === 'PENDING';

  // Build map from status → history entry
  const historyMap: Record<string, any> = {};
  data.statusHistory?.forEach((h: any) => { historyMap[h.status] = h; });

  return (
    <>
      {showCancel && (
        <CancelModal
          onConfirm={(r) => cancelMutation.mutate(r)}
          onClose={() => setShowCancel(false)}
          loading={cancelMutation.isPending}
        />
      )}

      <div className="space-y-4 max-w-2xl">

        {/* Back */}
        <Link href="/account/orders"
          className="inline-flex items-center gap-1.5 text-sm text-forest-700 hover:text-forest-800 font-medium">
          <ArrowLeft className="w-4 h-4" /> অর্ডার তালিকা
        </Link>

        {/* ── Header card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">অর্ডার নম্বর</p>
              <p className="font-black text-xl text-gray-900 font-mono">#{data.orderNumber}</p>
              <p className="text-gray-400 text-xs mt-1">
                {new Date(data.createdAt).toLocaleDateString('bn-BD', {
                  year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
            <div className="text-right space-y-2">
              <span className={cn('text-xs font-bold px-3 py-1 rounded-full border',
                STATUS_COLOR[data.status] ?? 'bg-gray-50 text-gray-600 border-gray-200')}>
                {STATUS_LABEL[data.status] ?? data.status}
              </span>
              <p className="font-black text-2xl text-forest-700">{formatPriceEn(data.totalAmount)}</p>
              <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full',
                data.paymentStatus === 'PAID'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-yellow-50 text-yellow-700')}>
                {PAY_LABEL[data.paymentStatus] ?? data.paymentStatus}
              </span>
            </div>
          </div>

          {/* ── Progress stepper ── */}
          {!isCancelled && (
            <div className="mt-6">
              {/* Desktop stepper */}
              <div className="hidden sm:flex items-start justify-between relative">
                {/* connector line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 z-0" />
                <div
                  className="absolute top-5 left-0 h-0.5 bg-forest-600 z-0 transition-all duration-700"
                  style={{ width: `${Math.max(0, (currentStep / (ORDER_STEPS.length - 1)) * 100)}%` }}
                />
                {ORDER_STEPS.map((step, i) => {
                  const done = i < currentStep;
                  const curr = i === currentStep;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                      <div className={cn(
                        'w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white transition-all duration-300',
                        done ? 'border-forest-600 bg-forest-600 text-white'
                          : curr ? 'border-forest-600 text-forest-600 ring-4 ring-forest-100'
                          : 'border-gray-200 text-gray-300',
                      )}>
                        {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4.5 h-4.5" />}
                      </div>
                      <p className={cn('text-[10px] text-center leading-tight whitespace-pre-line',
                        done || curr ? 'text-forest-700 font-bold' : 'text-gray-400')}>
                        {step.label}
                      </p>
                      {historyMap[step.key] && (
                        <p className="text-[9px] text-gray-400 text-center leading-tight">
                          {new Date(historyMap[step.key].createdAt).toLocaleDateString('bn-BD', {
                            day: 'numeric', month: 'short',
                          })}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile: compact progress */}
              <div className="sm:hidden">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-600">অগ্রগতি</p>
                  <p className="text-xs text-forest-600 font-semibold">
                    {currentStep + 1}/{ORDER_STEPS.length} ধাপ
                  </p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-forest-600 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(8, ((currentStep + 1) / ORDER_STEPS.length) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5 text-right font-medium">
                  বর্তমান: {STATUS_LABEL[data.status]}
                </p>
              </div>
            </div>
          )}

          {/* Cancelled */}
          {isCancelled && (
            <div className="mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700">{STATUS_LABEL[data.status]}</p>
                {data.cancelReason && (
                  <p className="text-xs text-red-500 mt-0.5">{data.cancelReason}</p>
                )}
              </div>
            </div>
          )}

          {/* Estimated delivery */}
          {data.estimatedDelivery && !isCancelled && data.status !== 'DELIVERED' && (
            <div className="mt-4 flex items-center gap-2.5 bg-spice-50 border border-spice-100 rounded-xl px-4 py-2.5">
              <Truck className="w-4 h-4 text-spice-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-spice-600 font-semibold">আনুমানিক ডেলিভারি</p>
                <p className="text-sm font-black text-spice-700">
                  {new Date(data.estimatedDelivery).toLocaleDateString('bn-BD', {
                    weekday: 'long', day: 'numeric', month: 'long',
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-4 flex gap-2.5 flex-wrap">
            <Link
              href={`/order-tracking?order=${data.orderNumber}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-forest-700 bg-forest-50 hover:bg-forest-100 border border-forest-200 px-3.5 py-2 rounded-xl transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> পাবলিক ট্র্যাক
            </Link>
            {canCancel && (
              <button
                onClick={() => setShowCancel(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-2 rounded-xl transition-colors">
                <XCircle className="w-3.5 h-3.5" /> অর্ডার বাতিল
              </button>
            )}
            {data.status === 'DELIVERED' && (
              <Link
                href={`/product/${data.items?.[0]?.productSlug ?? '#'}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3.5 py-2 rounded-xl transition-colors">
                <Star className="w-3.5 h-3.5" /> রিভিউ দিন
              </Link>
            )}
          </div>
        </div>

        {/* ── Delivery card ── */}
        {data.delivery && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-forest-600" /> ডেলিভারি তথ্য
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">ডেলিভারি স্ট্যাটাস</p>
                <p className="font-semibold text-gray-800 text-sm">
                  {DELIVERY_LABEL[data.delivery.status] ?? data.delivery.status}
                </p>
              </div>
              {data.delivery.courierName && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">কুরিয়ার সার্ভিস</p>
                  <p className="font-semibold text-gray-800 text-sm">{data.delivery.courierName}</p>
                </div>
              )}
              {data.delivery.trackingNumber && (
                <div className="bg-forest-50 border border-forest-100 rounded-xl p-3 sm:col-span-2">
                  <p className="text-xs text-forest-600 mb-0.5">ট্র্যাকিং নম্বর</p>
                  <p className="font-black text-forest-700 font-mono">{data.delivery.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Status timeline ── */}
        {data.statusHistory && data.statusHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-forest-600" /> অর্ডারের গতিবিধি
            </h3>
            <div className="relative">
              {data.statusHistory.map((h: any, i: number) => {
                const isLast = i === data.statusHistory.length - 1;
                const isCxl  = h.status === 'CANCELLED';
                return (
                  <div key={i} className="flex gap-4">
                    {/* icon + line */}
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                        isCxl
                          ? 'bg-red-50 border-red-400 text-red-500'
                          : isLast
                            ? 'bg-forest-100 border-forest-600 text-forest-600'
                            : 'bg-green-50 border-green-400 text-green-600',
                      )}>
                        {isCxl
                          ? <XCircle className="w-4 h-4" />
                          : isLast
                            ? <Clock className="w-4 h-4" />
                            : <CheckCircle className="w-4 h-4" />
                        }
                      </div>
                      {!isLast && <div className="w-0.5 flex-1 bg-gray-100 my-1 min-h-[24px]" />}
                    </div>
                    {/* info */}
                    <div className={cn('flex-1 pt-1.5', !isLast && 'pb-5')}>
                      <p className={cn('font-bold text-sm',
                        isCxl ? 'text-red-600' : isLast ? 'text-forest-700' : 'text-gray-700')}>
                        {STATUS_LABEL[h.status] ?? h.status}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(h.createdAt).toLocaleDateString('bn-BD', {
                          day: 'numeric', month: 'long', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                      {h.note && (
                        <p className="text-xs text-gray-500 mt-1 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                          {h.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Order items ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-forest-600" /> পণ্য তালিকা
          </h3>
          <div className="space-y-3">
            {data.items?.map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                  {item.productImage
                    ? <Image src={item.productImage} alt={item.productName} width={48} height={48} className="w-full h-full object-cover" />
                    : '🌶️'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm leading-tight truncate">{item.productName}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {item.productSku} · {item.quantity} × {formatPriceEn(item.unitPrice)}
                  </p>
                </div>
                <p className="font-bold text-gray-900 flex-shrink-0">{formatPriceEn(item.totalPrice)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
            {[
              { label: 'সাবটোটাল', value: data.subtotal, color: 'text-gray-600' },
              ...(data.discountAmount > 0 ? [{ label: 'পণ্যে ছাড়', value: -data.discountAmount, color: 'text-green-600' }] : []),
              ...(data.couponDiscount > 0 ? [{ label: 'কুপন ছাড়', value: -data.couponDiscount, color: 'text-forest-600' }] : []),
              { label: 'ডেলিভারি চার্জ', value: data.deliveryCharge, color: data.deliveryCharge === 0 ? 'text-green-600' : 'text-gray-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className={cn('font-semibold', color)}>
                  {value === 0 && label === 'ডেলিভারি চার্জ' ? '🎉 ফ্রি' : (Number(value) < 0 ? `−${formatPriceEn(Math.abs(Number(value)))}` : formatPriceEn(Number(value)))}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-black text-base border-t border-gray-100 pt-2 mt-1">
              <span>সর্বমোট</span>
              <span className="text-forest-700 text-lg">{formatPriceEn(data.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* ── Address + Payment ── */}
        <div className="grid sm:grid-cols-2 gap-4">
          {data.address && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-forest-600" /> ডেলিভারি ঠিকানা
              </h3>
              <p className="font-semibold text-gray-800 text-sm">{data.address.fullName}</p>
              <div className="text-gray-500 text-sm mt-1.5 space-y-0.5">
                <p>{data.address.fullAddress}</p>
                <p>{data.address.area}, {data.address.district}</p>
                <p>{data.address.division}</p>
                <p className="text-gray-400 text-xs mt-1">📞 {data.address.phone}</p>
              </div>
            </div>
          )}

          {data.payment && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-forest-600" /> পেমেন্ট তথ্য
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">পদ্ধতি</span>
                  <span className="font-semibold text-gray-800">
                    {PAY_METHOD_LABEL[data.payment.paymentMethod] ?? data.payment.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">স্ট্যাটাস</span>
                  <span className={cn('font-bold',
                    data.payment.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600')}>
                    {PAY_LABEL[data.payment.paymentStatus] ?? data.payment.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">পরিমাণ</span>
                  <span className="font-bold text-gray-800">{formatPriceEn(data.payment.amount)}</span>
                </div>
                {data.payment.transactionId && (
                  <div className="pt-2 border-t border-gray-50">
                    <p className="text-xs text-gray-400">Transaction ID</p>
                    <p className="text-xs font-mono text-gray-600 break-all mt-0.5">{data.payment.transactionId}</p>
                  </div>
                )}
                {data.payment.paidAt && (
                  <p className="text-xs text-gray-400">
                    পরিশোধ: {new Date(data.payment.paidAt).toLocaleDateString('bn-BD')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Delivery note */}
        {data.deliveryNote && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-700 mb-0.5">ডেলিভারি নোট</p>
              <p className="text-sm text-amber-700">{data.deliveryNote}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
