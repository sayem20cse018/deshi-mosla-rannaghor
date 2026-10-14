'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlist.store';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface WishlistButtonProps {
  productId:  string;
  productName?: string;
  /** extra Tailwind classes */
  className?: string;
  /** icon size class */
  iconSize?: string;
  /** show label next to icon */
  showLabel?: boolean;
}

export function WishlistButton({
  productId,
  productName,
  className,
  iconSize = 'w-4 h-4',
  showLabel = false,
}: WishlistButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlistStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const wishlisted = isWishlisted(productId);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast('উইশলিস্টে যোগ করতে লগইন করুন', { icon: '🔐' });
      router.push('/login');
      return;
    }

    if (busy) return;
    setBusy(true);
    try {
      if (wishlisted) {
        await removeFromWishlist(productId);
        toast('উইশলিস্ট থেকে সরানো হয়েছে', { icon: '💔' });
      } else {
        await addToWishlist(productId);
        toast.success(productName ? `"${productName}" উইশলিস্টে যোগ হয়েছে` : 'উইশলিস্টে যোগ হয়েছে');
      }
    } catch {
      toast.error('কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={wishlisted ? 'উইশলিস্ট থেকে সরান' : 'উইশলিস্টে যোগ করুন'}
      className={cn(
        'flex items-center justify-center gap-1.5 transition-all duration-200 rounded-full',
        wishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400',
        busy && 'opacity-60 cursor-not-allowed',
        className,
      )}
    >
      <Heart
        className={cn(
          iconSize,
          'transition-all duration-200',
          wishlisted && 'fill-current scale-110',
          busy && 'animate-pulse',
        )}
      />
      {showLabel && (
        <span className="text-xs font-semibold">
          {wishlisted ? 'সরান' : 'উইশলিস্ট'}
        </span>
      )}
    </button>
  );
}
