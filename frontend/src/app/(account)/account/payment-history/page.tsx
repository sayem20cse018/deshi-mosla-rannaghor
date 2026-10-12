'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { cn, formatPriceEn } from '@/lib/utils';

const STATUS_COLOR: Record<string,string> = {
  PAID: 'bg-green-50 text-green-700 border-green-200',
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
  REFUNDED: 'bg-teal-50 text-teal-700 border-teal-200',
};
const PAY_LABEL: Record<string,string> = {
  CASH_ON_DELIVERY:'ক্যাশ অন ডেলিভারি', BKASH:'bKash',
  NAGAD:'Nagad', ROCKET:'Rocket', SSLCOMMERZ:'SSLCommerz',
  BANK_TRANSFER:'ব্যাংক ট্রান্সফার', VISA:'Visa', MASTERCARD:'Mastercard',
};
const STATUS_LABEL: Record<string,string> = {PAID:'পরিশোধিত',PENDING:'অপেক্ষারত',FAILED:'ব্যর্থ',REFUNDED:'রিফান্ড',};

export default function PaymentHistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['payment-history'],
    queryFn: async () => { const r = await api.get('/users/me/payment-history'); return r.data.data; },
  });

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div>
      <h2 className="text-base font-bold text-gray-900 mb-5">পেমেন্ট ইতিহাস</h2>
      {!data?.length ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <CreditCard className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">কোনো পেমেন্ট ইতিহাস নেই</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item: any) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/account/orders/${item.id}`} className="font-bold text-gray-900 text-sm hover:text-brand-700 transition-colors">#{item.orderNumber}</Link>
                  <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border', STATUS_COLOR[item.paymentStatus] ?? 'bg-gray-50 text-gray-600 border-gray-200')}>
                    {STATUS_LABEL[item.paymentStatus] ?? item.paymentStatus}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  {PAY_LABEL[item.paymentMethod] ?? item.paymentMethod}
                  {item.payment?.transactionId && ` · TxnID: ${item.payment.transactionId}`}
                </p>
                <p className="text-gray-400 text-xs">{new Date(item.createdAt).toLocaleDateString('bn-BD',{year:'numeric',month:'long',day:'numeric'})}</p>
              </div>
              <p className="font-black text-brand-700 flex-shrink-0">{formatPriceEn(item.totalAmount)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
