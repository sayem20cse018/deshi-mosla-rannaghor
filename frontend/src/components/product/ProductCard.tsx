'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { formatPriceEn, cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCartStore();

  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';

  return (
    <div className={cn('product-card', className)}>
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {product.primaryImage ? (
            <Image
              src={product.primaryImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🌶️</div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.discountPercent && (
              <Badge variant="spice" className="text-xs px-1.5 py-0.5">
                -{product.discountPercent}%
              </Badge>
            )}
            {product.isNewArrival && (
              <Badge variant="brand" className="text-xs px-1.5 py-0.5">নতুন</Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="success" className="text-xs px-1.5 py-0.5">বেস্টসেলার</Badge>
            )}
          </div>

          {/* Wishlist */}
          <button className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
            <Heart className="w-4 h-4 text-gray-500 hover:text-red-500" />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-gray-800 font-medium text-sm leading-tight hover:text-brand-700 transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>

        {product.weight && (
          <p className="text-gray-400 text-xs mb-2">{product.weight}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-spice-400 text-spice-400" />
          <span className="text-xs text-gray-600 font-medium">{product.avgRating}</span>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="price-tag text-base">
            {formatPriceEn(product.discountPrice ?? product.price)}
          </span>
          {product.discountPrice && (
            <span className="price-original">
              {formatPriceEn(product.price)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          variant="brand"
          size="sm"
          className="w-full gap-1.5 text-xs h-8"
          disabled={isOutOfStock}
          onClick={() => addItem(product.id)}
        >
          {isOutOfStock ? (
            'স্টক শেষ'
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              কার্টে যোগ করুন
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
