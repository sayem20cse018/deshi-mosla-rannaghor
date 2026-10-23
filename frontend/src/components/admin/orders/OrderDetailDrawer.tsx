'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  X, Package, Truck, CreditCard, MapPin, User,
  Clock, CheckCircle2, ChevronDown, Loader2, ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useAdminOrder, useUpdateOrderStatus, useRefundOrder,
  AdminOrderDetail, OrderStatus,
} from '@/hooks/useAdminOrders';
import {
  ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG, PAYMENT_METHOD_LABELS,
  NEXT_STATUSES, formatCurrency, formatDate,
} from '@/lib/orderUtils';
import { OrderStatusBadge, PaymentStatusBadge } from './OrderStatusBadge';
import { Modal, AdminBtn } from '@/components/admin/ui';

interface OrderDetailDrawerProps {
  orderId: string | null;
  onClose: () => void;
}

export function OrderDetailDrawer({ orderId, onClose }: OrderDetailDrawerProps) {
  const { data, isLoading, isError } = useAdminOrder(orderId);
  const updateStatus = useUpdateOrderStatus();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus]     = useState('');
  const [statusNote, setStatusNote]   = useState('');
  const [courier, setCourier]         = useState('');
  const [tracking, setTracking]       = useState('');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount]       = useState('');
  const [refundReason, setRefundReason]       = useState('');
  const refundOrder = useRefundOrder();

  const order = data?.data;

  function openStatusChange(s: string) {
    if (s === 'REFUNDED') {
      setRefundAmount(order ? String(Math.round(Number(order.totalAmount))) : '');
      setRefundReason('');
      setShowRefundModal(true);
      return;
    }
    setNewStatus(s);
    setStatusNote('');
    setCourier('');
    setTracking('');
    setShowStatusModal(true);
  }

  async function handleRefund() {
    if (!order) return;
    await refundOrder.mutateAsync({
      orderId: order.id,
      amount: refundAmount ? Number(refundAmount) : undefined,
      reason: refundReason || undefined,
    });
    setShowRefundModal(false);
  }

  async function handleStatusUpdate() {
    if (!order) return;
    await updateStatus.mutateAsync({
      orderId: order.id,
      status:  newStatus,
      note:    statusNote || undefined,
      courierName:    courier   || undefined,
      trackingNumber: tracking  || undefined,
    });
    setShowStatusModal(false);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          orderId ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      />

      {/* Drawer */}
      <div className={cn(
        'fixed top-0 right-0 h-full bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300',
        orderId ? 'translate-x-0' : 'translate-x-full',
      )} style={{ width: 'min(560px, 100vw)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
          <div>
            <h3 className="font-black text-gray-900 text-base">Order Detail</h3>
            {order && <p className="text-xs text-gray-500 mt-0.5">#{order.orderNumber}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-7 h-7 animate-spin text-orange-500" />
            </div>
          )}
          {isError && (
            <div className="p-6 text-center text-red-500 text-sm">Failed to load order.</div>
          )}
          {order && (
            <div className="p-6 space-y-6">

              {/* Status + Quick Actions */}
              <div className="bg-gray-50 rounded-2xl p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order Status</p>
                  <OrderStatusBadge status={order.status} />
                  <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Payment</p>
                  <PaymentStatusBadge status={order.paymentStatus} />
                  <p className="text-xs text-gray-400 mt-1">{PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
                </div>
              </div>

              {/* Status Action Buttons */}
              {NEXT_STATUSES[order.status]?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {NEXT_STATUSES[order.status].map((s) => {
                      const cfg = ORDER_STATUS_CONFIG[s];
                      return (
                        <button
                          key={s}
                          onClick={() => openStatusChange(s)}
                          className={cn(
                            'px-3 py-1.5 rounded-xl text-xs font-bold border transition-all hover:scale-105',
                            cfg?.color, cfg?.bg, cfg?.border,
                          )}
                        >
                           {cfg?.label ?? s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Timeline */}
              {order.statusHistory?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Timeline
                  </p>
                  <div className="space-y-1">
                    {order.statusHistory.map((h, idx) => {
                      const cfg = ORDER_STATUS_CONFIG[h.status];
                      return (
                        <div key={h.id} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className={cn('w-2.5 h-2.5 rounded-full mt-0.5', cfg?.dot ?? 'bg-gray-400')} />
                            {idx < order.statusHistory.length - 1 && (
                              <div className="w-px flex-1 bg-gray-200 min-h-[20px]" />
                            )}
                          </div>
                          <div className="pb-2 flex-1">
                            <p className={cn('text-xs font-bold', cfg?.color ?? 'text-gray-700')}>{cfg?.label ?? h.status}</p>
                            {h.note && <p className="text-xs text-gray-500">{h.note}</p>}
                            <p className="text-xs text-gray-400">{formatDate(h.createdAt)}  {h.createdBy}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" /> Items ({order.items.length})
                </p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.productImage ? (
                          <Image src={item.productImage} alt={item.productName} width={48} height={48} className="object-cover w-full h-full" />
                        ) : (
                          <Package className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.productName}</p>
                        <p className="text-xs text-gray-500">SKU: {item.productSku}  Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(item.totalPrice)}</p>
                        <p className="text-xs text-gray-400">{formatCurrency(item.unitPrice)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Summary</p>
                <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
                {order.discountAmount > 0 && <Row label="Item Discount" value={`-${formatCurrency(order.discountAmount)}`} valueClass="text-green-600" />}
                {order.couponDiscount > 0 && <Row label="Coupon Discount" value={`-${formatCurrency(order.couponDiscount)}`} valueClass="text-green-600" />}
                <Row label="Delivery" value={order.deliveryCharge === 0 ? 'Free' : formatCurrency(order.deliveryCharge)} valueClass={order.deliveryCharge === 0 ? 'text-green-600' : ''} />
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <Row label="Total" value={formatCurrency(order.totalAmount)} labelClass="font-black text-gray-900" valueClass="font-black text-gray-900 text-base" />
                </div>
              </div>

              {/* Customer */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Customer
                </p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                  <p className="font-semibold text-gray-800">{order.user.name}</p>
                  <p className="text-xs text-gray-500">{order.user.email}</p>
                  <p className="text-xs text-gray-500">{order.user.phone}</p>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Delivery Address
                </p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                  <p className="font-semibold text-gray-800">{order.address.fullName}</p>
                  <p className="text-xs text-gray-500">{order.address.phone}</p>
                  <p className="text-xs text-gray-500">{order.address.fullAddress}</p>
                  <p className="text-xs text-gray-500">{order.address.area}, {order.address.district}, {order.address.division}</p>
                </div>
              </div>

              {/* Delivery Info */}
              {order.delivery && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5" /> Delivery Info
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    <Row label="Status"   value={order.delivery.status} />
                    {order.delivery.courierName    && <Row label="Courier"  value={order.delivery.courierName} />}
                    {order.delivery.trackingNumber && <Row label="Tracking" value={order.delivery.trackingNumber} />}
                    {order.delivery.estimatedDate  && <Row label="ETA"      value={formatDate(order.delivery.estimatedDate, true)} />}
                    {order.delivery.deliveredAt    && <Row label="Delivered"value={formatDate(order.delivery.deliveredAt, true)} />}
                  </div>
                </div>
              )}

              {/* Payment Info */}
              {order.payment && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" /> Payment
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    <Row label="Method"  value={PAYMENT_METHOD_LABELS[order.payment.paymentMethod] ?? order.payment.paymentMethod} />
                    <Row label="Status"  value={<PaymentStatusBadge status={order.payment.paymentStatus} size="sm" />} />
                    {order.payment.transactionId && <Row label="Txn ID" value={order.payment.transactionId} />}
                    {order.payment.paidAt        && <Row label="Paid At" value={formatDate(order.payment.paidAt, true)} />}
                  </div>
                </div>
              )}

              {order.deliveryNote && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-700 mb-1">Delivery Note</p>
                  <p className="text-sm text-amber-800">{order.deliveryNote}</p>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* Refund Modal */}
      <Modal open={showRefundModal} onClose={() => setShowRefundModal(false)} title="Process Refund" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Refund Amount (optional)</label>
            <input
              type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)}
              placeholder="Leave blank for full refund"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason (optional)</label>
            <textarea value={refundReason} onChange={(e) => setRefundReason(e.target.value)} rows={3}
              placeholder="Reason for refund..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <AdminBtn variant="secondary" onClick={() => setShowRefundModal(false)} className="flex-1">Cancel</AdminBtn>
            <AdminBtn variant="primary" loading={refundOrder.isPending} onClick={handleRefund} className="flex-1">
              Process Refund
            </AdminBtn>
          </div>
        </div>
      </Modal>

      {/* Status Update Modal */}
      <Modal open={showStatusModal} onClose={() => setShowStatusModal(false)} title={`Update to ${ORDER_STATUS_CONFIG[newStatus]?.label ?? newStatus}`} size="md">
        <div className="space-y-4">
          {(newStatus === 'SHIPPED') && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Courier Name</label>
                <input
                  value={courier} onChange={(e) => setCourier(e.target.value)}
                  placeholder="e.g. Pathao, Sundarban"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tracking Number</label>
                <input
                  value={tracking} onChange={(e) => setTracking(e.target.value)}
                  placeholder="Tracking ID"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Note (optional)</label>
            <textarea
              value={statusNote} onChange={(e) => setStatusNote(e.target.value)}
              rows={3}
              placeholder="Add a note for this status change..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <AdminBtn variant="secondary" onClick={() => setShowStatusModal(false)} className="flex-1">Cancel</AdminBtn>
            <AdminBtn
              variant="primary"
              loading={updateStatus.isPending}
              onClick={handleStatusUpdate}
              className="flex-1"
            >
              Confirm Update
            </AdminBtn>
          </div>
        </div>
      </Modal>
    </>
  );
}

//  Mini helper 
function Row({
  label, value, labelClass = '', valueClass = '',
}: { label: string; value: React.ReactNode; labelClass?: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={cn('text-xs text-gray-500', labelClass)}>{label}</span>
      <span className={cn('text-xs font-semibold text-gray-800 text-right', valueClass)}>{value}</span>
    </div>
  );
}
