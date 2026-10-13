import { Suspense } from 'react';
import PaymentFailedContent from './PaymentFailedContent';

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-4xl animate-bounce">❌</div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
