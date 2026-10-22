'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, MapPin, User, Phone, Truck,
  Tag, ShoppingBag, ArrowLeft, Loader2, Check,
  AlertCircle, Shield, Package, Minus, Plus,
  Trash2, CreditCard, Smartphone, Info,
} from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { cn, formatPriceEn } from '@/lib/utils';
import toast from 'react-hot-toast';

// ── Constants ─────────────────────────────────────────────────────────────────
const DIVISIONS = ['Dhaka','Chittagong','Sylhet','Rajshahi','Khulna','Barisal','Rangpur','Mymensingh'];
const FREE_THRESHOLD = 1000;
const DEFAULT_DELIVERY = 60;

// ── Payment options ───────────────────────────────────────────────────────────
type PayKey = 'CASH_ON_DELIVERY' | 'BKASH' | 'NAGAD' | 'ROCKET' | 'SSLCOMMERZ';

const PAYMENTS: { key: PayKey; label: string; sub: string; badge?: string; online: boolean }[] = [
  { key: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', sub: 'Pay when you receive', online: false },
  { key: 'BKASH',            label: 'bKash',            sub: 'Pay via bKash',          badge: 'Mobile', online: true },
  { key: 'NAGAD',            label: 'Nagad',            sub: 'Pay via Nagad',          badge: 'Mobile', online: true },
  { key: 'ROCKET',           label: 'Rocket',           sub: 'Pay via Rocket',         badge: 'Mobile', online: true },
  { key: 'SSLCOMMERZ',       label: 'Card / Net Banking',sub: 'Visa, Mastercard, AMEX', badge: 'Secure', online: true },
];

// ── Field component ───────────────────────────────────────────────────────────
function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

const inputCls = (err?: string) => cn(
  'w-full border rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all bg-white',
  err ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-orange-100 focus:border-orange-400',
);

// ── Section header ────────────────────────────────────────────────────────────
function SectionHead({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black flex-shrink-0 shadow-sm shadow-orange-200">
        {n}
      </div>
      <h2 className="font-black text-gray-900 text-base">{label}</h2>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { items, getTotals, appliedCoupon, applyCoupon, removeCoupon, clearCart, updateItem, removeItem } = useCartStore();
  const totals = getTotals();

  // ── Form state ────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    fullName:    '',
    phone:       '',
    email:       '',
    division:    '',
    district:    '',
    area:        '',
    fullAddress: '',
    deliveryNote:'',
    saveAddress: false,
    sameAsBilling: true,
  });
  const [errors,      setErrors]      = useState<Record<string, string>>({});
  const [payment,     setPayment]     = useState<PayKey>('CASH_ON_DELIVERY');
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [agreed,      setAgreed]      = useState(false);
  const [savedAddrs,  setSavedAddrs]  = useState<any[]>([]);

  // Delivery charge
  const deliveryCharge = totals.subtotal >= FREE_THRESHOLD || totals.isFreeDelivery ? 0 : DEFAULT_DELIVERY;
  const grandTotal     = totals.subtotal - totals.itemDiscount - (totals.couponDiscount ?? 0) + deliveryCharge;

  // Pre-fill if logged in
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        fullName: f.fullName || user.name || '',
        phone:    f.phone    || user.phone || '',
        email:    f.email    || user.email || '',
      }));
    }
  }, [user]);

  // Load saved addresses for logged-in users
  useEffect(() => {
    if (!isAuthenticated) return;
    api.get('/users/me/addresses').then(r => setSavedAddrs(r.data.data ?? [])).catch(() => {});
  }, [isAuthenticated]);

  // Sync coupon input
  useEffect(() => {
    if (appliedCoupon) setCouponInput(appliedCoupon.code);
  }, [appliedCoupon]);

  // Redirect if cart empty
  useEffect(() => {
    if (items.length === 0) router.replace('/shop');
  }, [items, router]);

  function setF(k: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm(f => ({ ...f, [k]: val }));
      setErrors(er => { const n = { ...er }; delete n[k]; return n; });
    };
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.fullName.trim())  e.fullName    = 'Name required';
    if (!form.phone.trim())     e.phone       = 'Phone required';
    if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(form.phone.trim())) e.phone = 'Enter valid phone';
    if (!form.division)         e.division    = 'Select division';
    if (!form.district.trim())  e.district    = 'District required';
    if (!form.area.trim())      e.area        = 'Area required';
    if (!form.fullAddress.trim()) e.fullAddress = 'Full address required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try { await applyCoupon(couponInput.trim()); }
    finally { setCouponLoading(false); }
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validate()) { toast.error('Please fill all required fields'); return; }
    if (!agreed)     { toast.error('Please agree to terms & conditions'); return; }

    setSubmitting(true);
    try {
      let res;
      if (isAuthenticated) {
        // Logged-in order via existing orders endpoint
        res = await api.post('/orders', {
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
          paymentMethod: payment,
        });
      } else {
        // Guest order
        res = await api.post('/orders/guest', {
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
          deliveryAddress: {
            fullName:    form.fullName.trim(),
            phone:       form.phone.trim(),
            email:       form.email.trim() || undefined,
            division:    form.division,
            district:    form.district.trim(),
            area:        form.area.trim(),
            fullAddress: form.fullAddress.trim(),
          },
          deliveryNote:  form.deliveryNote || undefined,
          couponCode:    appliedCoupon?.code || undefined,
          paymentMethod: payment,
        });
      }

      const data = res.data;

      if (data.requiresGateway && data.gatewayUrl) {
        clearCart();
        toast.success('Redirecting to payment gateway...');
        window.location.href = data.gatewayUrl;
        return;
      }

      clearCart();
      toast.success('Order placed successfully!');
      const orderId = data.data?.id;
      const orderNumber = data.data?.orderNumber;
      if (orderId) {
        router.push(`/order/${orderId}/confirmation`);
      } else {
        router.push(`/order-tracking?order=${orderNumber}`);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(msg || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const selectedPayment = PAYMENTS.find(p => p.key === payment)!;

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-8">

      {/* ── Top breadcrumb bar ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-orange-500 transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-semibold">Checkout</span>
          </nav>
          <Link href="/shop" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-500 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* ══════════════════════════════════════════════
              LEFT COLUMN
          ══════════════════════════════════════════════ */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* ── Guest notice ── */}
            {!isAuthenticated && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-orange-800">Ordering as Guest</p>
                  <p className="text-xs text-orange-600 mt-0.5">
                    You can order without an account.{' '}
                    <Link href="/login?redirect=/checkout" className="underline font-semibold hover:text-orange-800">
                      Sign in
                    </Link>{' '}to track orders and save addresses.
                  </p>
                </div>
              </div>
            )}

            {/* ── 1. Order Review ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SectionHead n="1" label="Order Review" />
              <div className="space-y-3">
                {items.map(item => {
                  const ep  = item.product.discountPrice ?? item.product.price;
                  const max = Math.min(item.product.availableStock ?? 99, 20);
                  return (
                    <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                        {item.product.primaryImage
                          ? <Image src={item.product.primaryImage} alt={item.product.name} width={56} height={56} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-gray-300" /></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-1">{item.product.name}</p>
                        {item.product.weight && <p className="text-xs text-gray-400 mt-0.5">{item.product.weight}</p>}
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-orange-500">{formatPriceEn(ep)}</span>
                          {item.product.discountPrice && (
                            <span className="text-xs text-gray-400 line-through">{formatPriceEn(item.product.price)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button type="button" onClick={() => updateItem(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-orange-500 disabled:opacity-30 transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                          <button type="button" onClick={() => updateItem(item.productId, item.quantity + 1)} disabled={item.quantity >= max}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-orange-500 disabled:opacity-30 transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-black text-gray-900 w-16 text-right">{formatPriceEn(ep * item.quantity)}</span>
                        <button type="button" onClick={() => removeItem(item.productId)} className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── 2. Customer Info ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SectionHead n="2" label="Your Information" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" required error={errors.fullName}>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={form.fullName} onChange={setF('fullName')} placeholder="Your full name" className={cn(inputCls(errors.fullName), 'pl-9')} autoComplete="name" />
                  </div>
                </Field>
                <Field label="Phone Number" required error={errors.phone}>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={form.phone} onChange={setF('phone')} placeholder="01XXXXXXXXX" className={cn(inputCls(errors.phone), 'pl-9')} autoComplete="tel" inputMode="tel" />
                  </div>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email (optional)">
                    <input type="email" value={form.email} onChange={setF('email')} placeholder="email@example.com" className={inputCls()} autoComplete="email" />
                  </Field>
                </div>
              </div>
            </section>

            {/* ── 3. Delivery Address ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-sm shadow-orange-200">3</div>
                  <h2 className="font-black text-gray-900 text-base">Delivery Address</h2>
                </div>
                {/* Saved address picker for logged-in */}
                {savedAddrs.length > 0 && (
                  <select className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 text-gray-600 max-w-[180px]"
                    onChange={e => {
                      const a = savedAddrs.find(x => x.id === e.target.value);
                      if (a) {
                        setForm(f => ({ ...f, fullName: a.fullName, phone: a.phone, division: a.division, district: a.district, area: a.area, fullAddress: a.fullAddress }));
                        setErrors({});
                      }
                    }}>
                    <option value="">Use saved address...</option>
                    {savedAddrs.map(a => <option key={a.id} value={a.id}>{a.area}, {a.district}</option>)}
                  </select>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Division" required error={errors.division}>
                  <select value={form.division} onChange={setF('division')} className={inputCls(errors.division)}>
                    <option value="">Select division</option>
                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="District" required error={errors.district}>
                  <input type="text" value={form.district} onChange={setF('district')} placeholder="e.g. Dhaka" className={inputCls(errors.district)} />
                </Field>
                <Field label="Area / Thana" required error={errors.area}>
                  <input type="text" value={form.area} onChange={setF('area')} placeholder="e.g. Mirpur" className={inputCls(errors.area)} />
                </Field>
                <Field label="Postal Code">
                  <input type="text" value={(form as any).postalCode ?? ''} onChange={setF('postalCode')} placeholder="Optional" className={inputCls()} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Full Address" required error={errors.fullAddress}>
                    <textarea value={form.fullAddress} onChange={setF('fullAddress')} rows={2} placeholder="House/flat no., road, block, area..." className={cn(inputCls(errors.fullAddress), 'resize-none')} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Delivery Note (optional)">
                    <input type="text" value={form.deliveryNote} onChange={setF('deliveryNote')} placeholder="e.g. Call before delivery" className={inputCls()} />
                  </Field>
                </div>
                {isAuthenticated && (
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={form.saveAddress} onChange={setF('saveAddress')} className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-200 accent-orange-500" />
                      <span className="text-sm text-gray-700">Save this address for future orders</span>
                    </label>
                  </div>
                )}
              </div>
            </section>

            {/* ── 4. Coupon ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SectionHead n="4" label="Have a Coupon?" />
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-green-800">{appliedCoupon.code}</p>
                      <p className="text-xs text-green-600">Saving {formatPriceEn(appliedCoupon.discountAmount)}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => { removeCoupon(); setCouponInput(''); }} className="text-xs text-gray-400 hover:text-red-500 font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-red-50">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                      placeholder="Enter coupon code" className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
                  </div>
                  <button type="button" onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors flex-shrink-0 flex items-center gap-1.5">
                    {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
              )}
            </section>

            {/* ── 5. Payment Method ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SectionHead n="5" label="Payment Method" />
              <div className="space-y-2.5">
                {PAYMENTS.map(opt => {
                  const sel = payment === opt.key;
                  return (
                    <label key={opt.key} className={cn(
                      'flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all',
                      sel ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-100' : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/20',
                    )}>
                      <input type="radio" name="pm" value={opt.key} checked={sel} onChange={() => setPayment(opt.key)} className="sr-only" />
                      {/* Custom radio */}
                      <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all', sel ? 'border-orange-500 bg-orange-500' : 'border-gray-300')}>
                        {sel && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      {/* Icon */}
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg', sel ? 'bg-orange-100' : 'bg-gray-100')}>
                        {opt.key === 'CASH_ON_DELIVERY' && '💵'}
                        {opt.key === 'BKASH'            && '🩷'}
                        {opt.key === 'NAGAD'            && '🟠'}
                        {opt.key === 'ROCKET'           && '🚀'}
                        {opt.key === 'SSLCOMMERZ'       && '💳'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-bold text-sm', sel ? 'text-orange-700' : 'text-gray-800')}>{opt.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.sub}</p>
                      </div>
                      {opt.badge && (
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0', sel ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500')}>
                          {opt.badge}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              {selectedPayment.online && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    You will be redirected to a <strong>secure payment gateway</strong>. Your card/account details are never stored on our servers.
                  </p>
                </div>
              )}
            </section>

            {/* ── Terms ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-orange-500" />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I have read and agree to the{' '}
                  <Link href="/terms" className="text-orange-500 hover:underline font-semibold" target="_blank">Terms &amp; Conditions</Link>,{' '}
                  <Link href="/privacy" className="text-orange-500 hover:underline font-semibold" target="_blank">Privacy Policy</Link>{' '}
                  &amp;{' '}
                  <Link href="/refund" className="text-orange-500 hover:underline font-semibold" target="_blank">Refund Policy</Link>.
                </span>
              </label>
            </section>

          </form>

          {/* ══════════════════════════════════════════════
              RIGHT COLUMN — Order Summary (sticky)
          ══════════════════════════════════════════════ */}
          <div className="lg:sticky lg:top-20 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Summary header */}
              <div className="px-5 py-4 bg-gradient-to-r from-orange-500 to-orange-600">
                <h2 className="font-black text-white flex items-center gap-2 text-base">
                  <ShoppingBag className="w-4 h-4" /> Order Summary
                </h2>
                <p className="text-orange-100 text-xs mt-0.5">{totals.itemCount} item{totals.itemCount !== 1 ? 's' : ''} in cart</p>
              </div>

              {/* Items list (compact) */}
              <div className="px-5 py-3 max-h-48 overflow-y-auto space-y-2.5 border-b border-gray-50">
                {items.map(item => {
                  const ep = item.product.discountPrice ?? item.product.price;
                  return (
                    <div key={item.id} className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                        {item.product.primaryImage
                          ? <Image src={item.product.primaryImage} alt={item.product.name} width={40} height={40} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-gray-300" /></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-black text-gray-900 flex-shrink-0">{formatPriceEn(ep * item.quantity)}</p>
                    </div>
                  );
                })}
              </div>

              {/* Price breakdown */}
              <div className="px-5 py-4 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">{formatPriceEn(totals.subtotal)}</span>
                </div>
                {totals.itemDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Item Discount</span>
                    <span className="font-semibold">-{formatPriceEn(totals.itemDiscount)}</span>
                  </div>
                )}
                {appliedCoupon && totals.couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-orange-600">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{appliedCoupon.code}</span>
                    <span className="font-semibold">-{formatPriceEn(totals.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Truck className="w-3 h-3" />Delivery</span>
                  <span className={cn('font-semibold', deliveryCharge === 0 && 'text-green-600')}>
                    {deliveryCharge === 0 ? 'Free' : formatPriceEn(deliveryCharge)}
                  </span>
                </div>
                {deliveryCharge === 0 && totals.subtotal < FREE_THRESHOLD && (
                  <p className="text-xs text-green-600 font-medium">Coupon applied — free delivery!</p>
                )}
                {deliveryCharge > 0 && (
                  <p className="text-xs text-gray-400">Free delivery on orders over {formatPriceEn(FREE_THRESHOLD)}</p>
                )}

                {/* Grand total */}
                <div className="border-t border-gray-100 pt-3 mt-1">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-gray-900 text-base">Total</span>
                    <span className="font-black text-orange-500 text-2xl" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {formatPriceEn(grandTotal)}
                    </span>
                  </div>
                  {(totals.itemDiscount + (totals.couponDiscount ?? 0)) > 0 && (
                    <p className="text-xs text-green-600 font-semibold mt-1 text-right">
                      You save {formatPriceEn(totals.itemDiscount + (totals.couponDiscount ?? 0))}
                    </p>
                  )}
                </div>
              </div>

              {/* Place order button */}
              <div className="px-5 pb-5">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={submitting}
                  onClick={() => handleSubmit()}
                  className="w-full flex items-center justify-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-base transition-all active:scale-[0.98] shadow-lg shadow-orange-200"
                >
                  {submitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                      {selectedPayment.online ? 'Redirecting...' : 'Placing order...'}</>
                  ) : selectedPayment.online ? (
                    <><CreditCard className="w-5 h-5 flex-shrink-0" />
                      Pay via {selectedPayment.label} — {formatPriceEn(grandTotal)}</>
                  ) : (
                    <><ShoppingBag className="w-5 h-5 flex-shrink-0" />
                      Place Order — {formatPriceEn(grandTotal)}</>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-2.5 flex items-center justify-center gap-1.5">
                  {selectedPayment.online
                    ? <><Shield className="w-3 h-3 text-blue-400 flex-shrink-0" /> Secure SSL payment</>
                    : <><Check className="w-3 h-3 text-green-400 flex-shrink-0" /> Pay cash when delivered</>
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky Place Order bar ── */}
      <div className="lg:hidden fixed bottom-[72px] inset-x-0 z-30 bg-white border-t border-gray-100 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">{totals.itemCount} items</span>
          <span className="font-black text-orange-500 text-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>{formatPriceEn(grandTotal)}</span>
        </div>
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleSubmit()}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl text-sm transition-all active:scale-[0.98] shadow-md shadow-orange-200"
        >
          {submitting
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing order...</>
            : <><ShoppingBag className="w-4 h-4" /> Place Order — {formatPriceEn(grandTotal)}</>
          }
        </button>
      </div>
    </div>
  );
}
