import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ShopContent from './ShopContent';

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
