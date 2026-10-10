'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryImage { url: string; altText?: string | null; }

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
}

const EMOJI_PLACEHOLDER = '🌶️';

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const hasImages = images.length > 0;
  const current = images[active];

  function prev() { setActive((i) => (i === 0 ? images.length - 1 : i - 1)); }
  function next() { setActive((i) => (i === images.length - 1 ? 0 : i + 1)); }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group">
        {hasImages && current ? (
          <>
            <Image
              src={current.url}
              alt={current.altText ?? productName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {/* Zoom btn */}
            <button
              onClick={() => setLightbox(true)}
              className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              aria-label="বড় করে দেখুন"
            >
              <ZoomIn className="w-4 h-4 text-gray-600" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-brand-50 to-brand-100">
            {EMOJI_PLACEHOLDER}
          </div>
        )}

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {active + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all',
                i === active ? 'border-brand-600 shadow-sm' : 'border-gray-100 hover:border-gray-300',
              )}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `${productName} ${i + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && hasImages && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <div className="relative max-w-2xl w-full aspect-square" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[active].url}
              alt={productName}
              fill
              className="object-contain"
            />
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-2 right-2 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
