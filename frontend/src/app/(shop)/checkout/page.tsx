'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, MapPin, User, Phone, Mail, Truck,
  Tag, ShoppingBag, ArrowLeft, Loader2, Check,
  AlertCircle, ChevronDown, CreditCard, Smartphone,
  Shield, ExternalLink,
} from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { cn, formatPriceEn } from '@/lib/utils';
import toast from 'react-hot-toast';

const DIVISIONS = [
  'ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী',
  'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ',
];

// ── Payment method definitions ─────────────────────────────
type PaymentMethodKey =
  | 'CASH_ON_DELIVERY'
  | 'SSLCOMMERZ'
  | 'BKASH'
  | 'NAGAD'
  | 'ROCKET';

interface PaymentOption {
  key:       PaymentMethodKey;
  label:     string;
  sublabel:  string;
  emoji:     string;
  color:     string;
  online:    boolean;   // requires gateway redirect
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    key: 'CASH_ON_DELIVERY',
    label: 'ক্যাশ অন ডেলিভারি',
    sublabel: 'পণ্য পাওয়ার পর নগদ পরিশোধ করুন',
    emoji: '💵',
    color: 'brand',
    online: false,
  },
  {
    key: 'SSLCOMMERZ',
    label: 'কার্ড / ইন্টারনেট ব্যাংকিং',
    sublabel: 'Visa, Mastercard, AMEX, ডেবিট কার্ড',
    emoji: '💳',
    color: 'blue',
    online: true,
  },
  {
    key: 'BKASH',
    label: 'bKash',
    sublabel: 'বিকাশে পেমেন্ট করুন',
    emoji: '📱',
    color: 'pink',
    online: true,
  },
  {
    key: 'NAGAD',
    label: 'Nagad',
    sublabel: 'নগদে পেমেন্ট করুন',
    emoji: '📱',
    color: 'orange',
    online: true,
  },
  {
    key: 'ROCKET',
    label: 'Rocket',
    sublabel: 'রকেটে পেমেন্ট করুন',
    emoji: '🚀',
    color: 'purple',
    online: true,
  },
];

const OPTION_COLOR: Record<string, string> = {
  brand:  'border-brand-600 bg-brand-50 ring-brand-200',
  blue:   'border-blue-500 bg-blue-50 ring-blue-200',
  pink:   'border-pink-500 bg-pink-50 ring-pink-200',
  orange: 'border-orange-500 bg-orange-50 ring-orange-200',
  purple: 'border-purple-500 bg-purple-50 ring-purple-200',
};

const DOT_COLOR: Record<string, string> = {
  brand:  'border-brand-600 bg-brand-600',
  blue:   'border-blue-500 bg-blue-500',
  pink:   'border-pink-500 bg-pink-500',
  orange: 'border-orange-500 bg-orange-500',
  purple: 'border-purple-500 bg-purple-500',
};

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  area: string;
  fullAddress: string;
  deliveryNote: string;
  couponCode: string;
  saveAddress: boolean;
}
interface FieldError { [key: string]: string; }

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { items, getTotals, appliedCoupon, applyCoupon, removeCoupon, clearCart } = useCartStore();
  const totals = getTotals();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>('CASH_ON_DELIVERY');
  const [form, setForm] = useState<FormData>({
    fullName: user?.name ?? '', phone: user?.phone ?? '', email: user?.email ?? '',
    division: '', district: '', area: '', fullAddress: '',
    deliveryNote: '', couponCode: '', saveAddress: false,
  });
  const [errors, setErrors]       = useState<FieldError>({});
  const [submitting, setSubmitting] = useState(false);
  const [couponInput, setCouponInput] = useState(appliedCoupon?.code ?? '');
  const [applyingCpn, setApplyingCpn] = useState(false);
  const [savedAddrs, setSavedAddrs]   = useState<any[]>([]);
  const [addrOpen, setAddrOpen]       = useState(false);

  useEffect(() => { if (!isAuthenticated) router.replace('/login?redirect=/checkout'); }, [isAuthenticated, router]);
  useEffect(() => { if (items.length === 0) router.replace('/cart'); }, [items, router]);
  useEffect(() => {
    if (user) setForm((f) => ({
      ...f,
      fullName: f.fullName || user.name,
      phone:    f.phone    || user.phone,
      email:    f.email    || user.email,
    }));
  }, [user]);
  useEffect(() => {
    if (!isAuthenticated) return;
    api.get('/users/me/addresses').then((r) => setSavedAddrs(r.data.data ?? [])).catch(() => {});
  }, [isAuthenticated]);

  function set_(k: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm((f) => ({ ...f, [k]: val }));
      setErrors((er) => { const n = { ...er }; delete n[k]; return n; });
    };
  }

  function fillFromSaved(addr: any) {
    setForm((f) => ({
      ...f, fullName: addr.fullName, phone: addr.phone,
      division: addr.division, district: addr.district,
      area: addr.area, fullAddress: addr.fullAddress,
    }));
    setAddrOpen(false);
  }

  function validate(): boolean {
    const e: FieldError = {};
    if (!form.fullName.trim()) e.fullName = 'নাম দিন';
    if (!form.phone.trim()) e.phone = 'ফোন নম্বর দিন';
    if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(form.phone.trim())) e.phone = 'সঠিক ফোন নম্বর দিন';
    if (!form.division) e.division = 'বিভাগ নির্বাচন করুন';
    if (!form.district.trim()) e.district = 'জেলা দিন';
    if (!form.area.trim()) e.area = 'এলাকা দিন';
    if (!form.fullAddress.trim()) e.fullAddress = 'সম্পূর্ণ ঠিকানা দিন';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setApplyingCpn(true);
    try { await applyCoupon(couponInput.trim()); }
    finally { setApplyingCpn(false); }
  }

  const selectedOption = PAYMENT_OPTIONS.find((o) => o.key === paymentMethod)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) { toast.error('অনুগ্রহ করে সব প্রয়োজনীয় তথ্য দিন'); return; }

    setSubmitting(true);
    try {
      const body = {
        deliveryAddress: {
          fullName:    form.fullName.trim(),
          phone:       form.phone.trim(),
          division:    form.division,
          district:    form.district.trim(),
          area:        form.area.trim(),
          fullAddress: form.fullAddress.trim(),
          saveAddress: form.saveAddress,
        },
        deliveryNote:  form.deliveryNote || undefined,
        couponCode:    appliedCoupon?.code || undefined,
        paymentMethod,
      };

      const res   = await api.post('/orders', body);
      const data  = res.data;

      // ── Online payment — redirect to gateway ──────────
      if (data.requiresGateway && data.gatewayUrl) {
        clearCart();
        toast.success('পেমেন্ট গেটওয়েতে নিয়ে যাচ্ছি...');
        // Hard redirect to SSLCommerz gateway page
        window.location.href = data.gatewayUrl;
        return;
      }

      // ── COD — go to confirmation ───────────────────────
      clearCart();
      toast.success('অর্ডার সফলভাবে প্রদান করা হয়েছে!');
      router.push(`/order/${data.data.id}/confirmation`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'অর্ডার দেওয়া ব্যর্থ হয়েছে');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isAuthenticated || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const Field = ({
    label, name, required = false, error, children,
  }: { label: string; name: string; required?: boolean; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
            <Link href="/" className="hover:text-brand-600">হোম</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/cart" className="hover:text-brand-600">কার্ট</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-medium">চেকআউট</span>
          </nav>
          <h1 className="text-xl font-bold text-gray-900">চেকআউট</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-6 items-start">

            {/* ══ Left column ══════════════════════════════ */}
            <div className="lg:col-span-2 space-y-5">

              {/* ── 1. Customer Info ── */}
              <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 bg-brand-700 text-white rounded-full flex items-center justify-center text-xs font-black">১</div>
                  ব্যক্তিগত তথ্য
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="পূর্ণ নাম" name="fullName" required error={errors.fullName}>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={form.fullName} onChange={set_('fullName')}
                        placeholder="রহিম উদ্দিন"
                        className={cn('input-base pl-9', errors.fullName && 'border-red-400')}
                        autoComplete="name" />
                    </div>
                  </Field>
                  <Field label="মোবাইল নম্বর" name="phone" required error={errors.phone}>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="tel" value={form.phone} onChange={set_('phone')}
                        placeholder="01700000000"
                        className={cn('input-base pl-9', errors.phone && 'border-red-400')}
                        autoComplete="tel" inputMode="tel" />
                    </div>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="ইমেইল" name="email" error={errors.email}>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="email" value={form.email} onChange={set_('email')}
                          placeholder="rahim@example.com"
                          className="input-base pl-9" autoComplete="email" />
                      </div>
                    </Field>
                  </div>
                </div>
              </section>

              {/* ── 2. Delivery Address ── */}
              <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-7 h-7 bg-brand-700 text-white rounded-full flex items-center justify-center text-xs font-black">২</div>
                    ডেলিভারি ঠিকানা
                  </h2>
                  {savedAddrs.length > 0 && (
                    <div className="relative">
                      <button type="button" onClick={() => setAddrOpen((o) => !o)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-xl hover:bg-brand-100 transition-colors">
                        <MapPin className="w-3.5 h-3.5" /> সংরক্ষিত ঠিকানা
                        <ChevronDown className={cn('w-3 h-3 transition-transform', addrOpen && 'rotate-180')} />
                      </button>
                      {addrOpen && (
                        <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 z-20 w-72 py-1.5 max-h-64 overflow-y-auto">
                          {savedAddrs.map((addr) => (
                            <button key={addr.id} type="button" onClick={() => fillFromSaved(addr)}
                              className="w-full text-left px-4 py-3 hover:bg-brand-50 transition-colors border-b border-gray-50 last:border-0">
                              <p className="font-semibold text-gray-800 text-sm">{addr.fullName}</p>
                              <p className="text-gray-500 text-xs mt-0.5">{addr.area}, {addr.district}</p>
                              <p className="text-gray-400 text-xs">{addr.phone}</p>
                              {addr.isDefault && (
                                <span className="text-[10px] bg-brand-50 text-brand-600 border border-brand-200 px-1.5 py-0.5 rounded-full font-semibold mt-1 inline-block">ডিফল্ট</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="বিভাগ" name="division" required error={errors.division}>
                    <select value={form.division} onChange={set_('division')}
                      className={cn('input-base bg-white', errors.division && 'border-red-400')}>
                      <option value="">বিভাগ নির্বাচন করুন</option>
                      {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="জেলা" name="district" required error={errors.district}>
                    <input type="text" value={form.district} onChange={set_('district')}
                      placeholder="যেমন: ঢাকা"
                      className={cn('input-base', errors.district && 'border-red-400')} />
                  </Field>
                  <Field label="উপজেলা / এলাকা" name="area" required error={errors.area}>
                    <input type="text" value={form.area} onChange={set_('area')}
                      placeholder="যেমন: মিরপুর"
                      className={cn('input-base', errors.area && 'border-red-400')} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="সম্পূর্ণ ঠিকানা" name="fullAddress" required error={errors.fullAddress}>
                      <textarea value={form.fullAddress} onChange={set_('fullAddress')} rows={2}
                        placeholder="বাড়ি/ফ্ল্যাট নম্বর, রোড, মহল্লা..."
                        className={cn('input-base resize-none', errors.fullAddress && 'border-red-400')} />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="ডেলিভারি নোট (ঐচ্ছিক)" name="deliveryNote">
                      <input type="text" value={form.deliveryNote} onChange={set_('deliveryNote')}
                        placeholder="যেমন: সন্ধ্যার পরে ডেলিভারি দিন" className="input-base" />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="checkbox" checked={form.saveAddress} onChange={set_('saveAddress')}
                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                      <span className="text-sm text-gray-700 group-hover:text-brand-700 transition-colors">
                        এই ঠিকানা সংরক্ষণ করুন (পরবর্তী অর্ডারের জন্য)
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              {/* ── 3. Payment Method ── */}
              <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 bg-brand-700 text-white rounded-full flex items-center justify-center text-xs font-black">৩</div>
                  পেমেন্ট পদ্ধতি
                </h2>

                <div className="space-y-2.5">
                  {PAYMENT_OPTIONS.map((opt) => {
                    const selected = paymentMethod === opt.key;
                    return (
                      <label
                        key={opt.key}
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                          selected
                            ? `${OPTION_COLOR[opt.color]} ring-2`
                            : 'border-gray-100 bg-gray-50 hover:border-gray-200',
                        )}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={opt.key}
                          checked={selected}
                          onChange={() => setPaymentMethod(opt.key)}
                          className="sr-only"
                        />
                        {/* Radio dot */}
                        <div className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                          selected ? DOT_COLOR[opt.color] : 'border-gray-300 bg-white',
                        )}>
                          {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>

                        <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm">{opt.label}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{opt.sublabel}</p>
                        </div>

                        {opt.online && (
                          <div className="flex items-center gap-1 text-[10px] bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-full font-semibold flex-shrink-0">
                            <ExternalLink className="w-2.5 h-2.5" /> গেটওয়ে
                          </div>
                        )}
                        {!opt.online && selected && (
                          <span className="text-xs bg-brand-600 text-white px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                            নির্বাচিত
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>

                {/* Online payment info box */}
                {selectedOption.online && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-800">নিরাপদ পেমেন্ট গেটওয়ে</p>
                      <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
                        &ldquo;অর্ডার নিশ্চিত করুন&rdquo; চাপলে আপনাকে SSLCommerz-এর নিরাপদ পেমেন্ট পেজে নিয়ে যাওয়া হবে।
                        পেমেন্ট সম্পন্ন হলে স্বয়ংক্রিয়ভাবে ফিরে আসবেন।
                      </p>
                      <p className="text-[11px] text-blue-500 mt-1 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> CVV বা PIN কোথাও সংরক্ষণ করা হয় না
                      </p>
                    </div>
                  </div>
                )}
              </section>

              <Link href="/cart" className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-700 lg:hidden">
                <ArrowLeft className="w-4 h-4" /> কার্টে ফিরুন
              </Link>
            </div>

            {/* ══ Right column: Order Summary ══════════════ */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-50 bg-brand-700 rounded-t-2xl">
                  <h2 className="font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> অর্ডার সামারি
                  </h2>
                  <p className="text-brand-200 text-xs mt-0.5">{totals.itemCount} টি পণ্য</p>
                </div>

                {/* Items */}
                <div className="p-4 max-h-56 overflow-y-auto space-y-3 border-b border-gray-50">
                  {items.map((item) => {
                    const ep = item.product.discountPrice ?? item.product.price;
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          {item.product.primaryImage ? (
                            <Image src={item.product.primaryImage} alt={item.product.name}
                              width={48} height={48} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🌶️</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 leading-tight truncate">{item.product.name}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{item.quantity} × {formatPriceEn(ep)}</p>
                        </div>
                        <p className="font-bold text-gray-900 text-sm flex-shrink-0">{formatPriceEn(ep * item.quantity)}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon */}
                <div className="px-4 py-3 border-b border-gray-50">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-brand-50 border border-brand-200 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-brand-600 rounded-lg flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-brand-700">{appliedCoupon.code}</p>
                          <p className="text-[11px] text-brand-500">−{formatPriceEn(appliedCoupon.discountAmount)} সাশ্রয়</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => { removeCoupon(); setCouponInput(''); }}
                        className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input type="text" value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                          placeholder="কুপন কোড"
                          className="input-base pl-8 text-sm uppercase font-mono tracking-wide py-2" />
                      </div>
                      <button type="button" onClick={handleApplyCoupon}
                        disabled={applyingCpn || !couponInput.trim()}
                        className="btn-primary px-3 py-2 text-xs flex-shrink-0 disabled:opacity-50">
                        {applyingCpn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'প্রয়োগ'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="px-4 py-3 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>সাবটোটাল</span>
                    <span className="font-medium">{formatPriceEn(totals.subtotal)}</span>
                  </div>
                  {totals.itemDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>পণ্যে ছাড়</span>
                      <span className="font-medium">−{formatPriceEn(totals.itemDiscount)}</span>
                    </div>
                  )}
                  {appliedCoupon && totals.couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-brand-600">
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{appliedCoupon.code}</span>
                      <span className="font-medium">−{formatPriceEn(totals.couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3" />ডেলিভারি</span>
                    <span className={cn('font-medium', totals.isFreeDelivery && 'text-brand-600')}>
                      {totals.isFreeDelivery ? '🎉 ফ্রি' : formatPriceEn(totals.deliveryCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-black text-base border-t border-gray-100 pt-2 mt-2">
                    <span>সর্বমোট</span>
                    <span className="text-brand-700 text-xl">{formatPriceEn(totals.grandTotal)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <div className="px-4 pb-4">
                  <button type="submit" disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-bold py-4 rounded-xl text-base transition-all active:scale-[0.98] shadow-lg shadow-brand-700/20">
                    {submitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" />
                        {selectedOption.online ? 'গেটওয়েতে যাচ্ছে...' : 'অর্ডার দেওয়া হচ্ছে...'}</>
                    ) : selectedOption.online ? (
                      <><ExternalLink className="w-4 h-4" />
                        {selectedOption.label}-এ পেমেন্ট করুন — {formatPriceEn(totals.grandTotal)}</>
                    ) : (
                      <>অর্ডার নিশ্চিত করুন — {formatPriceEn(totals.grandTotal)}</>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                    {selectedOption.online
                      ? <><Shield className="w-3 h-3 text-blue-500" /> SSLCommerz নিরাপদ পেমেন্ট</>
                      : <>💵 ক্যাশ অন ডেলিভারি — পণ্য পেলে পরিশোধ করুন</>
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Mobile sticky bottom */}
      <div className="lg:hidden fixed bottom-16 inset-x-0 z-30 bg-white border-t border-gray-200 px-4 py-3">
        <button type="button" disabled={submitting} onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all">
          {submitting
            ? <><Loader2 className="w-4 h-4 animate-spin" /> হচ্ছে...</>
            : <>অর্ডার নিশ্চিত করুন — {formatPriceEn(totals.grandTotal)}</>
          }
        </button>
      </div>
    </div>
  );
}
