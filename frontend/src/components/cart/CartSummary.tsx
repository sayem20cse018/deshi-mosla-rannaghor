'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Tag,
  Check,
  X,
  Truck,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';

interface CartSummaryProps {
  className?: string;
  sticky?: boolean;
}

const SUGGESTED_COUPONS = ['WELCOME10', 'FREEDEL', 'SAVE50'];

export function CartSummary({ className, sticky = true }: CartSummaryProps) {
  const { appliedCoupon, couponError, applyCoupon, removeCoupon, getTotals, items } =
    useCartStore();

  const totals = getTotals();
  const [couponInput, setCouponInput] = useState(appliedCoupon?.code ?? '');
  const [showCoupon, setShowCoupon] = useState(!!appliedCoupon);
  const [applying, setApplying] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (appliedCoupon) setCouponInput(appliedCoupon.code);
  }, [appliedCoupon]);

  useEffect(() => {
    if (showCoupon && !appliedCoupon) setTimeout(() => inputRef.current?.focus(), 80);
  }, [showCoupon, appliedCoupon]);

  async function handleApply() {
    if (!couponInput.trim() || applying) return;
    setApplying(true);
    await applyCoupon(couponInput.trim());
    setApplying(false);
    setShowSuggestions(false);
  }

  function handleRemove() {
    removeCoupon();
    setCouponInput('');
    setShowCoupon(false);
  }

  const FREE_THRESHOLD = 1000;
  const progressPct = Math.min(100, (totals.subtotal / FREE_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_THRESHOLD - totals.subtotal);
  const totalSavings = totals.itemDiscount + totals.couponDiscount;

  if (items.length === 0) return null;

  return (
    <div className={cn(sticky && 'sticky top-24', className)}>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-brand-700 px-5 py-4">
          <h2 className="text-white font-bold text-base">অর্ডার সামারি</h2>
          <p className="text-brand-200 text-xs mt-0.5">{totals.itemCount} টি পণ্য</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Free delivery progress */}
          <div className="bg-brand-50 rounded-xl p-3 border border-brand-100">
            {totals.isFreeDelivery ? (
              <div className="flex items-center gap-2 text-brand-700">
                <div className="w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs font-semibold">ফ্রি ডেলিভারি যোগ্য!</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs text-brand-700 mb-2">
                  <span className="flex items-center gap-1 font-medium">
                    <Truck className="w-3 h-3" />
                    ফ্রি ডেলিভারি পেতে
                  </span>
                  <span className="font-bold">{formatPriceEn(remaining)} বাকি</span>
                </div>
                <div className="w-full h-2 bg-brand-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-700 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Price breakdown */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">সাবটোটাল</span>
              <span className="font-semibold text-gray-800">{formatPriceEn(totals.subtotal)}</span>
            </div>

            {totals.itemDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">পণ্যে ছাড়</span>
                <span className="font-semibold text-green-600">
                  −{formatPriceEn(totals.itemDiscount)}
                </span>
              </div>
            )}

            {appliedCoupon && totals.couponDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-600 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  কুপন ({appliedCoupon.code})
                </span>
                <span className="font-semibold text-brand-600">
                  −{formatPriceEn(totals.couponDiscount)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                <Truck className="w-3 h-3" />
                ডেলিভারি
              </span>
              <span
                className={cn(
                  'font-semibold',
                  totals.isFreeDelivery ? 'text-brand-600' : 'text-gray-800',
                )}
              >
                {totals.isFreeDelivery ? 'ফ্রি' : formatPriceEn(totals.deliveryCharge)}
              </span>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
              <span className="font-bold text-gray-900">সর্বমোট</span>
              <span className="text-2xl font-black text-brand-700">
                {formatPriceEn(totals.grandTotal)}
              </span>
            </div>

            {totalSavings > 0 && (
              <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-center">
                <p className="text-green-700 text-xs font-bold">
                  🎉 আপনি {formatPriceEn(totalSavings)} সাশ্রয় করছেন!
                </p>
              </div>
            )}
          </div>

          {/* Coupon section */}
          <div className="border-t border-gray-100 pt-3">
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-brand-50 border border-brand-200 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-brand-600 rounded-lg flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-700">{appliedCoupon.code}</p>
                    <p className="text-[11px] text-brand-500">
                      {formatPriceEn(appliedCoupon.discountAmount)} সাশ্রয়
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemove}
                  className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : showCoupon ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                      placeholder="কুপন কোড লিখুন..."
                      className="input-base uppercase font-mono tracking-wider text-sm pr-8"
                    />
                    {couponInput && (
                      <button
                        onClick={() => {
                          setCouponInput('');
                          inputRef.current?.focus();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleApply}
                    disabled={applying || !couponInput.trim()}
                    className="btn-primary px-4 py-2 text-sm flex-shrink-0 disabled:opacity-50"
                  >
                    {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'প্রয়োগ'}
                  </button>
                </div>

                {/* Suggestions */}
                {showSuggestions && !couponInput && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-2">
                    <p className="text-[11px] text-gray-400 font-medium px-1 mb-1.5">পরামর্শ:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_COUPONS.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setCouponInput(c);
                            setShowSuggestions(false);
                          }}
                          className="text-[11px] font-mono font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-lg hover:bg-brand-100 transition-colors"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {couponError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" /> {couponError}
                  </p>
                )}

                <button
                  onClick={() => {
                    setShowCoupon(false);
                    setCouponInput('');
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  বাতিল
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCoupon(true)}
                className="w-full flex items-center justify-between text-sm text-brand-600 hover:text-brand-800 font-medium py-1 transition-colors group"
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  কুপন কোড আছে?
                </span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* CTA */}
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-base transition-all shadow-lg shadow-brand-700/20"
          >
            অর্ডার করুন
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              { icon: ShieldCheck, label: 'নিরাপদ পেমেন্ট' },
              { icon: RotateCcw, label: '৭ দিনে রিটার্ন' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-gray-500 text-xs">
                <Icon className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment badges */}
      <div className="mt-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
        <p className="text-xs text-gray-400 mb-2 font-medium">গ্রহণযোগ্য পেমেন্ট</p>
        <div className="flex flex-wrap gap-1.5">
          {['COD', 'bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard'].map((m) => (
            <span
              key={m}
              className="text-[11px] font-semibold bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
