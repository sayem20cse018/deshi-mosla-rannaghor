'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Package, MapPin, CreditCard, Truck, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { cn, formatPriceEn } from '@/lib/utils';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED'];
const STATUS_LABEL: Record<string, string> = {
  PENDING: 'অপেক্ষারত',
  CONFIRMED: 'নিশ্চিত',
  PROCESSING: 'প্রক্রিয়াধীন',
  PACKED: 'প্যাক',
  SHIPPED: 'পাঠানো',
  DELIVERED: 'ডেলিভারি',
  CANCELLED: 'বাতিল',
  RETURNED: 'ফেরত',
  REFUNDED: 'রিফান্ড',
};
const PAY_LABEL: Record<string, string> = {
  PENDING: 'অপেক্ষারত',
  PAID: 'পরিশোধিত',
  FAILED: 'ব্যর্থ',
  CANCELLED: 'বাতিল',
  REFUNDED: 'ফেরত',
  PROCESSING: 'প্রক্রিয়াধীন',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-order', id],
    queryFn: async () => {
      const r = await api.get(`/users/me/orders/${id}`);
      return r.data.data;
    },
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  if (error || !data)
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <p className="text-gray-500 mb-4">অর্ডারটি পাওয়া যায়নি।</p>
        <Link href="/account/orders" className="btn-primary px-6 text-sm">
          অর্ডার তালিকায় ফিরুন
        </Link>
      </div>
    );

  const currentStep = STATUS_STEPS.indexOf(data.status);
  const isCancelled = ['CANCELLED', 'RETURNED', 'REFUNDED'].includes(data.status);

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Back */}
      <Link
        href="/account/orders"
        className="flex items-center gap-1.5 text-sm text-brand-700 hover:text-brand-800 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> অর্ডার তালিকা
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">অর্ডার নম্বর</p>
            <p className="font-black text-lg text-gray-900">#{data.orderNumber}</p>
            <p className="text-gray-400 text-xs mt-1">
              {new Date(data.createdAt).toLocaleDateString('bn-BD', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">মোট মূল্য</p>
            <p className="font-black text-2xl text-brand-700">{formatPriceEn(data.totalAmount)}</p>
            <span
              className={cn(
                'text-xs font-semibold px-2 py-0.5 rounded-full',
                data.paymentStatus === 'PAID'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-yellow-50 text-yellow-700',
              )}
            >
              {PAY_LABEL[data.paymentStatus] ?? data.paymentStatus}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {!isCancelled && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all',
                      i < currentStep
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : i === currentStep
                          ? 'bg-white border-brand-600 text-brand-600 ring-2 ring-brand-200'
                          : 'bg-white border-gray-200 text-gray-300',
                    )}
                  >
                    {i < currentStep ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <p
                    className={cn(
                      'text-[10px] mt-1 text-center leading-tight',
                      i <= currentStep ? 'text-brand-700 font-semibold' : 'text-gray-400',
                    )}
                  >
                    {STATUS_LABEL[s]}
                  </p>
                </div>
              ))}
            </div>
            <div className="relative mt-1">
              <div className="h-1 bg-gray-100 rounded-full" />
              <div
                className="absolute top-0 left-0 h-1 bg-brand-600 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-2 text-sm text-red-600 font-semibold">
            {STATUS_LABEL[data.status]} {data.cancelReason && `— ${data.cancelReason}`}
          </div>
        )}
      </div>

      {/* Order items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-brand-600" /> পণ্য তালিকা
        </h3>
        <div className="space-y-3">
          {data.items?.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    width={48}
                    height={48}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  '🌶️'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm leading-tight truncate">
                  {item.productName}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {item.productSku} · {item.quantity} × {formatPriceEn(item.unitPrice)}
                </p>
              </div>
              <p className="font-bold text-gray-900 flex-shrink-0">
                {formatPriceEn(item.totalPrice)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>সাবটোটাল</span>
            <span>{formatPriceEn(data.subtotal)}</span>
          </div>
          {data.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>ছাড়</span>
              <span>−{formatPriceEn(data.discountAmount)}</span>
            </div>
          )}
          {data.couponDiscount > 0 && (
            <div className="flex justify-between text-sm text-brand-600">
              <span>কুপন ছাড়</span>
              <span>−{formatPriceEn(data.couponDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-500">
            <span>ডেলিভারি</span>
            <span>{data.deliveryCharge > 0 ? formatPriceEn(data.deliveryCharge) : 'ফ্রি'}</span>
          </div>
          <div className="flex justify-between font-black text-base text-gray-900 pt-2 border-t border-gray-100 mt-2">
            <span>সর্বমোট</span>
            <span className="text-brand-700">{formatPriceEn(data.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Address + Payment side by side */}
      <div className="grid sm:grid-cols-2 gap-4">
        {data.address && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" /> ডেলিভারি ঠিকানা
            </h3>
            <p className="font-semibold text-gray-800 text-sm">{data.address.fullName}</p>
            <p className="text-gray-500 text-sm mt-1">{data.address.fullAddress}</p>
            <p className="text-gray-500 text-sm">
              {data.address.area}, {data.address.district}
            </p>
            <p className="text-gray-500 text-sm">{data.address.division}</p>
            <p className="text-gray-500 text-sm mt-1">📞 {data.address.phone}</p>
          </div>
        )}

        {data.payment && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" /> পেমেন্ট তথ্য
            </h3>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">পদ্ধতি:</span>{' '}
              {data.payment.paymentMethod?.replace(/_/g, ' ')}
            </p>
            <p className="text-gray-700 text-sm mt-1">
              <span className="font-semibold">স্ট্যাটাস:</span>{' '}
              <span
                className={cn(
                  'font-bold',
                  data.payment.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600',
                )}
              >
                {PAY_LABEL[data.payment.paymentStatus]}
              </span>
            </p>
            {data.payment.transactionId && (
              <p className="text-gray-500 text-xs mt-2 font-mono break-all">
                TxnID: {data.payment.transactionId}
              </p>
            )}
            {data.payment.paidAt && (
              <p className="text-gray-400 text-xs mt-1">
                {new Date(data.payment.paidAt).toLocaleDateString('bn-BD')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Delivery */}
      {data.delivery && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-600" /> ডেলিভারি তথ্য
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              { label: 'স্ট্যাটাস', value: data.delivery.status?.replace(/_/g, ' ') },
              { label: 'কুরিয়ার', value: data.delivery.courierName },
              { label: 'ট্র্যাকিং', value: data.delivery.trackingNumber },
              {
                label: 'প্রত্যাশিত',
                value: data.delivery.estimatedDate
                  ? new Date(data.delivery.estimatedDate).toLocaleDateString('bn-BD')
                  : null,
              },
            ]
              .filter((r) => r.value)
              .map((r) => (
                <div key={r.label}>
                  <p className="text-gray-400 text-xs">{r.label}</p>
                  <p className="text-gray-800 font-semibold mt-0.5">{r.value}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
