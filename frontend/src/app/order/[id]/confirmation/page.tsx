'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  Truck,
  ArrowRight,
  Home,
  ShoppingBag,
  Loader2,
  Clock,
  Phone,
} from 'lucide-react';
import api from '@/lib/api';
import { formatPriceEn } from '@/lib/utils';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'অর্ডার প্রদান', icon: Package },
  { key: 'CONFIRMED', label: 'নিশ্চিত', icon: CheckCircle },
  { key: 'PROCESSING', label: 'প্রক্রিয়াধীন', icon: Clock },
  { key: 'SHIPPED', label: 'পাঠানো হয়েছে', icon: Truck },
  { key: 'DELIVERED', label: 'ডেলিভারি', icon: CheckCircle },
];

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api
      .get(`/orders/${id}`)
      .then((r) => setOrder(r.data.data))
      .catch(() => setError('অর্ডার লোড করা যায়নি'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-brand-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">অর্ডার লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow p-8 text-center max-w-md w-full">
          <p className="text-gray-600 mb-4">{error || 'অর্ডার পাওয়া যায়নি'}</p>
          <Link href="/account/orders" className="btn-primary px-6">
            আমার অর্ডার দেখুন
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* ── Success Hero ── */}
      <div className="bg-gradient-to-br from-brand-700 to-brand-800 text-white py-10 px-4">
        <div className="container mx-auto text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-2">অর্ডার সফলভাবে প্রদান হয়েছে!</h1>
          <p className="text-brand-200 text-sm mb-4">
            ধন্যবাদ! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
          </p>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-5 py-2.5 rounded-full">
            <Package className="w-4 h-4" />
            <span className="font-bold tracking-wide text-sm">অর্ডার: #{order.orderNumber}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-5 max-w-2xl">
        {/* ── Order Progress ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-5">অর্ডারের অবস্থা</h2>
          <div className="flex items-center justify-between mb-3">
            {STATUS_STEPS.map((step, i) => {
              const done = i < currentStepIdx;
              const current = i === currentStepIdx;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center flex-1 relative">
                  {/* Connector line */}
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`absolute top-4 left-1/2 w-full h-0.5 ${done ? 'bg-brand-600' : 'bg-gray-200'}`}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      done
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : current
                          ? 'bg-white border-brand-600 text-brand-600 ring-2 ring-brand-200'
                          : 'bg-white border-gray-200 text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <p
                    className={`text-[10px] mt-1.5 text-center font-medium leading-tight ${
                      done || current ? 'text-brand-700' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Estimated delivery */}
          {order.estimatedDelivery && (
            <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-2.5 flex items-center gap-2 mt-4">
              <Truck className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-brand-700">প্রত্যাশিত ডেলিভারি</p>
                <p className="text-xs text-brand-500">
                  {new Date(order.estimatedDelivery).toLocaleDateString('bn-BD', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Order Items ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-600" /> অর্ডার আইটেম
          </h2>
          <div className="space-y-3">
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
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
                    {item.quantity} × {formatPriceEn(item.unitPrice)}
                  </p>
                </div>
                <p className="font-bold text-gray-900 flex-shrink-0">
                  {formatPriceEn(item.totalPrice)}
                </p>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="space-y-1.5 mt-4 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>সাবটোটাল</span>
              <span>{formatPriceEn(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>পণ্যে ছাড়</span>
                <span>−{formatPriceEn(order.discountAmount)}</span>
              </div>
            )}
            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-sm text-brand-600">
                <span>কুপন ছাড়</span>
                <span>−{formatPriceEn(order.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-500">
              <span>ডেলিভারি</span>
              <span className={order.deliveryCharge === 0 ? 'text-brand-600 font-medium' : ''}>
                {order.deliveryCharge === 0 ? 'ফ্রি' : formatPriceEn(order.deliveryCharge)}
              </span>
            </div>
            <div className="flex justify-between font-black text-base text-gray-900 border-t border-gray-100 pt-2 mt-2">
              <span>মোট পরিশোধ</span>
              <span className="text-brand-700">{formatPriceEn(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* ── Payment + Address grid ── */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-brand-600" /> পেমেন্ট
            </h3>
            <p className="text-sm font-semibold text-gray-800">ক্যাশ অন ডেলিভারি</p>
            <p className="text-xs text-gray-400 mt-1">পণ্য হাতে পেলে নগদ পরিশোধ করুন</p>
            <div className="mt-2 inline-flex items-center gap-1 text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 px-2.5 py-1 rounded-full font-semibold">
              <Clock className="w-3 h-3" /> অপেক্ষারত
            </div>
          </div>

          {/* Delivery address */}
          {order.address && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600" /> ডেলিভারি ঠিকানা
              </h3>
              <p className="font-semibold text-gray-800 text-sm">{order.address.fullName}</p>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                {order.address.fullAddress}, {order.address.area}
                <br />
                {order.address.district}, {order.address.division}
              </p>
              <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {order.address.phone}
              </p>
            </div>
          )}
        </div>

        {/* ── COD reminder ── */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <p className="font-bold text-amber-800 text-sm">ক্যাশ অন ডেলিভারি মনে রাখুন</p>
            <p className="text-amber-700 text-xs mt-1 leading-relaxed">
              ডেলিভারির সময় <strong>{formatPriceEn(order.totalAmount)}</strong> প্রস্তুত রাখুন।
              আমাদের ডেলিভারি এজেন্ট আপনার সাথে যোগাযোগ করবেন।
            </p>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/account/orders"
            className="flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> আমার অর্ডার
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border border-gray-200 hover:border-brand-300 text-gray-700 hover:text-brand-700 font-semibold py-3.5 rounded-xl text-sm transition-all"
          >
            <Home className="w-4 h-4" /> হোমপেজে যান
          </Link>
        </div>

        {/* Track order */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5 text-brand-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm">অর্ডার ট্র্যাক করুন</p>
            <p className="text-gray-400 text-xs mt-0.5">
              অর্ডার #{order.orderNumber} এর অবস্থান ট্র্যাক করুন
            </p>
          </div>
          <Link
            href="/order-tracking"
            className="text-brand-600 hover:text-brand-800 text-xs font-semibold flex items-center gap-1"
          >
            ট্র্যাক করুন <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
