import { Suspense } from 'react';
import PaymentCancelContent from './PaymentCancelContent';

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-4xl animate-bounce">⚠️</div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
