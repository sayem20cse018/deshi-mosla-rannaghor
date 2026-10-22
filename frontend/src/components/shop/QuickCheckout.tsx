'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  X, ShoppingBag, MapPin, CreditCard, ChevronDown,
  Loader2, Check, Plus, Minus, Package,
} from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import toast from 'react-hot-toast';

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuickProduct {
  id:           string;
  name:         string;
  slug:         string;
  price:        number;
  discountPrice: number | null;
  primaryImage: string | null;
  weight:       string | null;
  minOrderQty:  number;
  maxOrderQty?: number | null;
  availableStock: number;
}

interface QuickCheckoutProps {
  open:     boolean;
  onClose:  () => void;
  product:  QuickProduct;
  initialQty?: number;
}

const DIVISIONS = [
  'Dhaka','Chittagong','Sylhet','Rajshahi','Khulna','Barisal','Rangpur','Mymensingh',
];

type PayMethod = 'CASH_ON_DELIVERY' | 'BKASH' | 'NAGAD';

// ── QuickCheckout Modal ───────────────────────────────────────────────────────

export function QuickCheckout({ open, onClose, product, initialQty = 1 }: QuickCheckoutProps) {
  const { user, isAuthenticated } = useAuthStore();

  const [qty, setQty]       = useState(initialQty);
  const [step, setStep]     = useState<'review' | 'address' | 'done'>('review');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNum, setOrderNum] = useState<string | null>(null);

  // Address form
  const [form, setForm] = useState({
    fullName:    user?.name ?? '',
    phone:       user?.phone ?? '',
    division:    '',
    district:    '',
    area:        '',
    fullAddress: '',
    deliveryNote:'',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState<PayMethod>('CASH_ON_DELIVERY');

  if (!open) return null;

  const effectivePrice = product.discountPrice ?? product.price;
  const subtotal       = effectivePrice * qty;
  const delivery       = subtotal >= 1000 ? 0 : 60;
  const total          = subtotal + delivery;
  const maxQty         = Math.min(product.availableStock, product.maxOrderQty ?? 99);

  function setF(k: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      setErrors((er) => { const n = { ...er }; delete n[k]; return n; });
    };
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Name required';
    if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(form.phone.trim())) e.phone = 'Valid phone required';
    if (!form.division) e.division = 'Select division';
    if (!form.district.trim()) e.district = 'District required';
    if (!form.area.trim()) e.area = 'Area required';
    if (!form.fullAddress.trim()) e.fullAddress = 'Address required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleOrder() {
    if (!validate()) { toast.error('Please fill all required fields'); return; }
    setSubmitting(true);
    try {
      // Build order payload — guest order: add to cart first then checkout
      // For quick checkout we call orders directly if authenticated,
      // otherwise we use a guest order endpoint
      let res;
      if (isAuthenticated) {
        // Add to server cart first
        await api.post('/cart/add', { productId: product.id, quantity: qty });
        res = await api.post('/orders', {
          deliveryAddress: {
            fullName:    form.fullName.trim(),
            phone:       form.phone.trim(),
            division:    form.division,
            district:    form.district.trim(),
            area:        form.area.trim(),
            fullAddress: form.fullAddress.trim(),
            saveAddress: false,
          },
          deliveryNote:  form.deliveryNote || undefined,
          paymentMethod: payment,
        });
      } else {
        // Guest quick order — direct guest checkout endpoint
        res = await api.post('/orders/guest', {
          items: [{ productId: product.id, quantity: qty }],
          deliveryAddress: {
            fullName:    form.fullName.trim(),
            phone:       form.phone.trim(),
            division:    form.division,
            district:    form.district.trim(),
            area:        form.area.trim(),
            fullAddress: form.fullAddress.trim(),
          },
          deliveryNote:  form.deliveryNote || undefined,
          paymentMethod: payment,
        });
      }

      const data = res.data;
      setOrderId(data.data?.id ?? null);
      setOrderNum(data.data?.orderNumber ?? null);
      setStep('done');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Order failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet / Modal */}
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-orange-500" />
            <span className="font-black text-gray-900 text-sm">
              {step === 'review' ? 'Order Review' : step === 'address' ? 'Delivery Details' : 'Order Confirmed!'}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── STEP 1: Review ─────────────────────────────────── */}
          {step === 'review' && (
            <div className="p-5 space-y-5">

              {/* Product row */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {product.primaryImage ? (
                    <Image src={product.primaryImage} alt={product.name} width={64} height={64} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-gray-300" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{product.name}</p>
                  {product.weight && <p className="text-xs text-gray-500 mt-0.5">{product.weight}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-black text-orange-600 text-sm">{formatPriceEn(effectivePrice)}</span>
                    {product.discountPrice && (
                      <span className="text-xs text-gray-400 line-through">{formatPriceEn(product.price)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity selector */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty(q => Math.max(product.minOrderQty, q - 1))}
                      disabled={qty <= product.minOrderQty}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-black text-gray-900">{qty}</span>
                    <button
                      onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                      disabled={qty >= maxQty}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Total: <strong className="text-gray-900">{formatPriceEn(effectivePrice * qty)}</strong>
                  </span>
                </div>
              </div>

              {/* Price summary */}
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPriceEn(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span className={cn('font-semibold', delivery === 0 && 'text-green-600')}>
                    {delivery === 0 ? 'Free' : formatPriceEn(delivery)}
                  </span>
                </div>
                {delivery === 0 && (
                  <p className="text-xs text-green-600 font-medium">Free delivery on orders over Tk 1000</p>
                )}
                <div className="border-t border-orange-200 pt-2 flex justify-between">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-orange-600 text-lg">{formatPriceEn(total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Address ────────────────────────────────── */}
          {step === 'address' && (
            <div className="p-5 space-y-4">

              {/* Payment method */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', icon: '💵' },
                    { key: 'BKASH',            label: 'bKash',            icon: '📱' },
                    { key: 'NAGAD',            label: 'Nagad',            icon: '📱' },
                  ] as const).map(({ key, label, icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPayment(key)}
                      className={cn(
                        'flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-xs font-bold transition-all',
                        payment === key
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300',
                      )}
                    >
                      <span className="text-lg">{icon}</span>
                      <span className="leading-tight text-center">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address form */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Full Name *" error={errors.fullName}>
                    <input value={form.fullName} onChange={setF('fullName')} placeholder="Your name" className={inputCls(errors.fullName)} />
                  </Field>
                  <Field label="Phone *" error={errors.phone}>
                    <input value={form.phone} onChange={setF('phone')} placeholder="01XXXXXXXXX" className={inputCls(errors.phone)} />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Division *" error={errors.division}>
                    <select value={form.division} onChange={setF('division')} className={inputCls(errors.division)}>
                      <option value="">Select</option>
                      {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="District *" error={errors.district}>
                    <input value={form.district} onChange={setF('district')} placeholder="District" className={inputCls(errors.district)} />
                  </Field>
                </div>

                <Field label="Area / Thana *" error={errors.area}>
                  <input value={form.area} onChange={setF('area')} placeholder="Area or Thana" className={inputCls(errors.area)} />
                </Field>

                <Field label="Full Address *" error={errors.fullAddress}>
                  <textarea value={form.fullAddress} onChange={setF('fullAddress')} rows={2} placeholder="House no, road, block..." className={cn(inputCls(errors.fullAddress), 'resize-none')} />
                </Field>

                <Field label="Delivery Note (optional)">
                  <input value={form.deliveryNote} onChange={setF('deliveryNote')} placeholder="Any note for delivery" className={inputCls()} />
                </Field>
              </div>

              {/* Order summary mini */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <span className="text-sm text-gray-600 font-medium">{product.name} x {qty}</span>
                <span className="font-black text-orange-600">{formatPriceEn(total)}</span>
              </div>
            </div>
          )}

          {/* ── STEP 3: Done ───────────────────────────────────── */}
          {step === 'done' && (
            <div className="p-8 flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-1">Order Placed!</h3>
                {orderNum && (
                  <p className="text-sm text-gray-500">Order #{orderNum}</p>
                )}
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Your order has been placed successfully. You will receive a confirmation soon.
                </p>
              </div>
              <div className="w-full bg-orange-50 border border-orange-100 rounded-2xl p-4 text-left space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Product</span>
                  <span className="font-semibold text-gray-800 truncate ml-4 max-w-[160px]">{product.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Qty</span>
                  <span className="font-semibold text-gray-800">{qty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment</span>
                  <span className="font-semibold text-gray-800">{payment === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : payment}</span>
                </div>
                <div className="border-t border-orange-100 pt-1.5 flex justify-between">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-orange-600">{formatPriceEn(total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {step !== 'done' && (
          <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
            {step === 'review' ? (
              <button
                onClick={() => setStep('address')}
                className="w-full flex items-center justify-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-black py-4 rounded-2xl text-base transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98]"
              >
                <MapPin className="w-5 h-5 flex-shrink-0" />
                Continue to Address
              </button>
            ) : (
              <button
                onClick={handleOrder}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-base transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98]"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin flex-shrink-0" /> Placing Order...</>
                ) : (
                  <><CreditCard className="w-5 h-5 flex-shrink-0" /> Place Order — {formatPriceEn(total)}</>
                )}
              </button>
            )}
            {step === 'address' && (
              <button onClick={() => setStep('review')} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-2.5 py-1 transition-colors">
                Back to review
              </button>
            )}
          </div>
        )}
        {step === 'done' && (
          <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-black py-4 rounded-2xl text-base transition-all active:scale-[0.98]"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function inputCls(error?: string) {
  return cn(
    'w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all bg-gray-50 focus:bg-white',
    error
      ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
      : 'border-gray-200 focus:ring-orange-200 focus:border-orange-400',
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
