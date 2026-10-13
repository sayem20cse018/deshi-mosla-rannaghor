import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import LoginContent from './LoginContent';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-emerald-50">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
