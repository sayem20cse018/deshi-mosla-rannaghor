'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, User, Phone, Tag, ShoppingBag,
  ArrowLeft, Loader2, Check, AlertCircle, Shield,
  Package, Minus, Plus, Trash2, CreditCard,
  Info, Truck, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { PaymentLogo, PAYMENT_COLORS } from '@/components/payment/PaymentLogos';
import api from '@/lib/api';
import { cn, formatPriceEn } from '@/lib/utils';
import toast from 'react-hot-toast';

const DIVISIONS = ['Dhaka','Chittagong','Sylhet','Rajshahi','Khulna','Barisal','Rangpur','Mymensingh'];
const FREE_THRESHOLD = 1000;
const DEFAULT_DELIVERY = 60;

type PayKey = 'CASH_ON_DELIVERY' | 'BKASH' | 'NAGAD' | 'ROCKET' | 'SSLCOMMERZ';

const PAYMENTS: { key: PayKey; label: string; sub: string; online: boolean }[] = [
  { key: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', sub: 'Pay when you receive',   online: false },
  { key: 'BKASH',            label: 'bKash',            sub: 'Mobile banking',          online: true  },
  { key: 'NAGAD',            label: 'Nagad',            sub: 'Mobile banking',          online: true  },
  { key: 'ROCKET',           label: 'Rocket',           sub: 'Mobile banking',          online: true  },
  { key: 'SSLCOMMERZ',       label: 'Card / Net Banking', sub: 'Visa, Mastercard, AMEX',online: true  },
];

function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
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

const ic = (err?: string) => cn(
  'w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all bg-white',
  err ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-orange-100 focus:border-orange-400',
);

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { items, getTotals, appliedCoupon, applyCoupon, removeCoupon, clearCart, updateItem, removeItem } = useCartStore();
  const totals = getTotals();

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '',
    division: '', district: '', area: '',
    fullAddress: '', deliveryNote: '',
    saveAddress: false,
  });
  const [errors,         setErrors]         = useState<Record<string, string>>({});
  const [payment,        setPayment]        = useState<PayKey>('CASH_ON_DELIVERY');
  const [couponInput,    setCouponInput]    = useState('');
  const [couponLoading,  setCouponLoading]  = useState(false);
  const [submitting,     setSubmitting]     = useState(false);
  const [agreed,         setAgreed]         = useState(false);
  const [savedAddrs,     setSavedAddrs]     = useState<any[]>([]);
  const [orderCollapsed, setOrderCollapsed] = useState(false);

  const deliveryCharge = totals.subtotal >= FREE_THRESHOLD || totals.isFreeDelivery ? 0 : DEFAULT_DELIVERY;
  const grandTotal     = totals.subtotal - totals.itemDiscount - (totals.couponDiscount ?? 0) + deliveryCharge;

  useEffect(() => {
    if (user) setForm(f => ({ ...f, fullName: f.fullName || user.name || '', phone: f.phone || user.phone || '', email: f.email || user.email || '' }));
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get('/users/me/addresses').then(r => setSavedAddrs(r.data.data ?? [])).catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => { if (appliedCoupon) setCouponInput(appliedCoupon.code); }, [appliedCoupon]);
  useEffect(() => { if (items.length === 0) router.replace('/shop'); }, [items, router]);

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
    if (!form.phone.trim() || !/^(?:\+?88)?01[3-9]\d{8}$/.test(form.phone.trim())) e.phone = 'Valid BD phone required';
    if (!form.division)         e.division    = 'Select division';
    if (!form.district.trim())  e.district    = 'District required';
    if (!form.area.trim())      e.area        = 'Area required';
    if (!form.fullAddress.trim()) e.fullAddress = 'Address required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try { await applyCoupon(couponInput.trim()); } finally { setCouponLoading(false); }
  }

  async function placeOrder() {
    if (!validate()) { toast.error('Please fill all required fields'); return; }
    if (!agreed)     { toast.error('Please agree to terms & conditions'); return; }
    setSubmitting(true);
    try {
      let res;
      if (isAuthenticated) {
        res = await api.post('/orders', {
          deliveryAddress: { fullName: form.fullName.trim(), phone: form.phone.trim(), division: form.division, district: form.district.trim(), area: form.area.trim(), fullAddress: form.fullAddress.trim(), saveAddress: form.saveAddress },
          deliveryNote: form.deliveryNote || undefined,
          couponCode: appliedCoupon?.code || undefined,
          paymentMethod: payment,
        });
      } else {
        res = await api.post('/orders/guest', {
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
          deliveryAddress: { fullName: form.fullName.trim(), phone: form.phone.trim(), email: form.email.trim() || undefined, division: form.division, district: form.district.trim(), area: form.area.trim(), fullAddress: form.fullAddress.trim() },
          deliveryNote: form.deliveryNote || undefined,
          couponCode: appliedCoupon?.code || undefined,
          paymentMethod: payment,
        });
      }
      const data = res.data;
      if (data.requiresGateway && data.gatewayUrl) {
        clearCart(); toast.success('Redirecting to payment...'); window.location.href = data.gatewayUrl; return;
      }
      clearCart(); toast.success('Order placed!');
      router.push(data.data?.id ? `/order/${data.data.id}/confirmation` : `/order-tracking?order=${data.data?.orderNumber}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Order failed. Please try again.');
    } finally { setSubmitting(false); }
  }

  if (items.length === 0) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;

  const selPay = PAYMENTS.find(p => p.key === payment)!;
  const payColor = PAYMENT_COLORS[payment] ?? { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB', selectedBg: '#F3F4F6' };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-10">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/cart" className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900">Checkout</h1>
            <nav className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <Link href="/" className="hover:text-orange-500">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/cart" className="hover:text-orange-500">Cart</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-600 font-medium">Checkout</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-5">
        <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-start">

          {/*  LEFT  */}
          <div className="space-y-4">

            {/* Guest notice */}
            {!isAuthenticated && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-orange-800">Guest Checkout</p>
                  <p className="text-xs text-orange-600 mt-0.5 leading-relaxed">
                    No account needed.{' '}
                    <Link href="/login?redirect=/checkout" className="underline font-semibold hover:text-orange-800 transition-colors">Sign in</Link>{' '}
                    to save addresses and track orders easily.
                  </p>
                </div>
              </div>
            )}

            {/* Order Review */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button type="button" onClick={() => setOrderCollapsed(c => !c)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">1</div>
                  <span className="font-black text-gray-900">Order Review</span>
                  <span className="text-xs text-gray-400 font-medium">{totals.itemCount} item{totals.itemCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-orange-500 text-sm">{formatPriceEn(totals.subtotal)}</span>
                  {orderCollapsed ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                </div>
              </button>
              {!orderCollapsed && (
                <div className="border-t border-gray-50 px-5 pb-4 space-y-3 pt-3">
                  {items.map(item => {
                    const ep = item.product.discountPrice ?? item.product.price;
                    const max = Math.min(item.product.availableStock ?? 99, 20);
                    return (
                      <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.product.primaryImage
                            ? <Image src={item.product.primaryImage} alt={item.product.name} width={48} height={48} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-gray-300" /></div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.product.name}</p>
                          {item.product.weight && <p className="text-xs text-gray-400">{item.product.weight}</p>}
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-black text-orange-500">{formatPriceEn(ep)}</span>
                            {item.product.discountPrice && <span className="text-xs text-gray-400 line-through">{formatPriceEn(item.product.price)}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button type="button" onClick={() => updateItem(item.productId, item.quantity - 1)} disabled={item.quantity <= 1} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-orange-500 disabled:opacity-30 transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                            <button type="button" onClick={() => updateItem(item.productId, item.quantity + 1)} disabled={item.quantity >= max} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-orange-500 disabled:opacity-30 transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-sm font-black text-gray-900 min-w-[60px] text-right">{formatPriceEn(ep * item.quantity)}</span>
                          <button type="button" onClick={() => removeItem(item.productId)} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">2</div>
                <h2 className="font-black text-gray-900">Contact Information</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Full Name" required error={errors.fullName}>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input type="text" value={form.fullName} onChange={setF('fullName')} placeholder="Your full name" className={cn(ic(errors.fullName), 'pl-9')} autoComplete="name" />
                  </div>
                </Field>
                <Field label="Phone Number" required error={errors.phone}>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input type="tel" value={form.phone} onChange={setF('phone')} placeholder="01XXXXXXXXX" className={cn(ic(errors.phone), 'pl-9')} inputMode="tel" />
                  </div>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email (optional)">
                    <input type="email" value={form.email} onChange={setF('email')} placeholder="email@example.com" className={ic()} autoComplete="email" />
                  </Field>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">3</div>
                  <h2 className="font-black text-gray-900">Shipping Address</h2>
                </div>
                {savedAddrs.length > 0 && (
                  <select className="text-xs border border-gray-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 text-gray-600 max-w-[160px]"
                    onChange={e => { const a = savedAddrs.find(x => x.id === e.target.value); if (a) { setForm(f => ({ ...f, fullName: a.fullName, phone: a.phone, division: a.division, district: a.district, area: a.area, fullAddress: a.fullAddress })); setErrors({}); } }}>
                    <option value="">Saved address...</option>
                    {savedAddrs.map(a => <option key={a.id} value={a.id}>{a.area}, {a.district}</option>)}
                  </select>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Division" required error={errors.division}>
                  <select value={form.division} onChange={setF('division')} className={ic(errors.division)}>
                    <option value="">Select division</option>
                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="District" required error={errors.district}>
                  <input value={form.district} onChange={setF('district')} placeholder="e.g. Dhaka" className={ic(errors.district)} />
                </Field>
                <Field label="Area / Thana" required error={errors.area}>
                  <input value={form.area} onChange={setF('area')} placeholder="e.g. Mirpur" className={ic(errors.area)} />
                </Field>
                <Field label="Postal Code">
                  <input value={(form as any).postalCode ?? ''} onChange={setF('postalCode')} placeholder="Optional" className={ic()} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Full Address" required error={errors.fullAddress}>
                    <textarea value={form.fullAddress} onChange={setF('fullAddress')} rows={2} placeholder="House/flat no., road, block, area..." className={cn(ic(errors.fullAddress), 'resize-none')} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Delivery Note (optional)">
                    <input value={form.deliveryNote} onChange={setF('deliveryNote')} placeholder="e.g. Call before delivery" className={ic()} />
                  </Field>
                </div>
                {isAuthenticated && (
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={form.saveAddress} onChange={setF('saveAddress')} className="w-4 h-4 rounded border-gray-300 accent-orange-500" />
                      <span className="text-sm text-gray-700">Save address for future orders</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">4</div>
                <h2 className="font-black text-gray-900">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PAYMENTS.map(opt => {
                  const sel = payment === opt.key;
                  const pc  = PAYMENT_COLORS[opt.key] ?? { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB', selectedBg: '#F3F4F6' };
                  return (
                    <label key={opt.key}
                      className={cn(
                        'flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all',
                        sel ? 'ring-2 ring-offset-1' : 'border-gray-200 bg-white hover:border-gray-300',
                      )}
                      style={sel ? { background: pc.selectedBg, borderColor: pc.border } : {}}>
                      <input type="radio" name="pm" value={opt.key} checked={sel} onChange={() => setPayment(opt.key)} className="sr-only" />
                      <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all')} style={sel ? { borderColor: pc.text, background: pc.text } : { borderColor: '#D1D5DB' }}>
                        {sel && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <PaymentLogo method={opt.key} className="h-7 w-auto flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-800 leading-tight">{opt.label}</p>
                        <p className="text-xs text-gray-500 leading-tight">{opt.sub}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              {selPay.online && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">Secure SSL payment. Your details are never stored.</p>
                </div>
              )}
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">5</div>
                <h2 className="font-black text-gray-900">Coupon Code</h2>
              </div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-green-800">{appliedCoupon.code}</p>
                      <p className="text-xs text-green-600">Saving {formatPriceEn(appliedCoupon.discountAmount)}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => { removeCoupon(); setCouponInput(''); }} className="text-xs text-gray-400 hover:text-red-500 font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                      placeholder="Enter coupon code" className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
                  </div>
                  <button type="button" onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5 flex-shrink-0">
                    {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-orange-500" />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="text-orange-500 hover:underline font-semibold" target="_blank">Terms</Link>,{' '}
                  <Link href="/privacy" className="text-orange-500 hover:underline font-semibold" target="_blank">Privacy Policy</Link>{' '}
                  &amp;{' '}
                  <Link href="/refund" className="text-orange-500 hover:underline font-semibold" target="_blank">Refund Policy</Link>.
                </span>
              </label>
            </div>

          </div>

          {/*  RIGHT  Sticky Order Summary  */}
          <div className="lg:sticky lg:top-20 space-y-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Summary header */}
              <div className="px-5 py-4 bg-gradient-to-r from-orange-500 to-orange-600">
                <h2 className="font-black text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Order Summary
                </h2>
                <p className="text-orange-100 text-xs mt-0.5">{totals.itemCount} item{totals.itemCount !== 1 ? 's' : ''}</p>
              </div>

              {/* Items compact */}
              <div className="px-5 py-3 max-h-44 overflow-y-auto space-y-2 border-b border-gray-50">
                {items.map(item => {
                  const ep = item.product.discountPrice ?? item.product.price;
                  return (
                    <div key={item.id} className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.product.primaryImage
                          ? <Image src={item.product.primaryImage} alt={item.product.name} width={36} height={36} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><Package className="w-3.5 h-3.5 text-gray-300" /></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                      </div>
                      <p className="text-xs font-black text-gray-900 flex-shrink-0">{formatPriceEn(ep * item.quantity)}</p>
                    </div>
                  );
                })}
              </div>

              {/* Price breakdown */}
              <div className="px-5 py-4 space-y-2">
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
                {deliveryCharge > 0 && <p className="text-xs text-gray-400">Free delivery on orders over {formatPriceEn(FREE_THRESHOLD)}</p>}

                <div className="border-t border-gray-100 pt-3 mt-1">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-gray-900 text-base">Total</span>
                    <span className="font-black text-orange-500 text-2xl" style={{ fontFamily: 'Manrope, sans-serif' }}>{formatPriceEn(grandTotal)}</span>
                  </div>
                  {(totals.itemDiscount + (totals.couponDiscount ?? 0)) > 0 && (
                    <p className="text-xs text-green-600 font-semibold mt-1 text-right">You save {formatPriceEn(totals.itemDiscount + (totals.couponDiscount ?? 0))}</p>
                  )}
                </div>
              </div>

              {/* Payment badge */}
              <div className="px-5 pb-3">
                <div className="flex items-center gap-2 p-2.5 rounded-xl border" style={{ background: payColor.selectedBg, borderColor: payColor.border }}>
                  <PaymentLogo method={payment} className="h-6 w-auto flex-shrink-0" />
                  <p className="text-xs font-semibold" style={{ color: payColor.text }}>{selPay.label}</p>
                </div>
              </div>

              {/* Place Order */}
              <div className="px-5 pb-5">
                <button type="button" disabled={submitting} onClick={placeOrder}
                  className="w-full flex items-center justify-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-base transition-all active:scale-[0.98] shadow-lg shadow-orange-200">
                  {submitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                      {selPay.online ? 'Redirecting...' : 'Placing order...'}</>
                  ) : selPay.online ? (
                    <><CreditCard className="w-5 h-5 flex-shrink-0" />
                      Pay via {selPay.label}  {formatPriceEn(grandTotal)}</>
                  ) : (
                    <><ShoppingBag className="w-5 h-5 flex-shrink-0" />
                      Place Order  {formatPriceEn(grandTotal)}</>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1.5">
                  {selPay.online
                    ? <><Shield className="w-3 h-3 text-blue-400 flex-shrink-0" /> Secure SSL payment</>
                    : <><Check className="w-3 h-3 text-green-400 flex-shrink-0" /> Pay cash on delivery</>
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-[72px] inset-x-0 z-30 bg-white border-t border-gray-100 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PaymentLogo method={payment} className="h-6 w-auto" />
            <span className="text-xs text-gray-500">{totals.itemCount} items</span>
          </div>
          <span className="font-black text-orange-500 text-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>{formatPriceEn(grandTotal)}</span>
        </div>
        <button type="button" disabled={submitting} onClick={placeOrder}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl text-sm transition-all active:scale-[0.98] shadow-md shadow-orange-200">
          {submitting
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing order...</>
            : <><ShoppingBag className="w-4 h-4" /> Place Order  {formatPriceEn(grandTotal)}</>
          }
        </button>
      </div>
    </div>
  );
}