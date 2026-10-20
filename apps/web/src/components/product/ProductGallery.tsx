'use client';

import { useState, useCallback } from 'react';
import { OptimizedImage } from '@/components/ui/Image';
import { IMAGE_SIZES } from '@/lib/images';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: { url: string; alt: string | null; sortOrder: number }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const validImages = images.length > 0
    ? images
    : [{ url: '/images/placeholder-product.svg', alt: productName, sortOrder: 0 }];

  const goToSlide = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  const currentImage = validImages[selectedIndex];

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card overflow-hidden card">
      {/* Main Image */}
      <div className="relative aspect-gallery overflow-hidden bg-white/5">
        <OptimizedImage
          src={currentImage.url}
          alt={currentImage.alt ?? productName}
          fill
          priority={selectedIndex === 0}
          sizes={IMAGE_SIZES.gallery}
          objectFit="contain"
          fallbackType="gallery"
          className="transition-opacity duration-300"
        />

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:flex btn btn-icon btn-ghost glass"
              aria-label="Gambar sebelumnya"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex btn btn-icon btn-ghost glass"
              aria-label="Gambar selanjutnya"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          className="absolute top-3 right-3 hidden sm:flex btn btn-icon btn-ghost glass"
          aria-label="Buka galeri penuh"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3 pb-0" role="tablist" aria-label="Thumbnail gambar produk">
          {validImages.map((img, index) => (
            <button
              key={`${img.url}-${index}`}
              onClick={() => goToSlide(index)}
              className={cn(
                'flex-shrink-0 relative aspect-thumb w-20 rounded-xl overflow-hidden border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary',
                index === selectedIndex
                  ? 'border-accent-primary ring-2 ring-accent-primary ring-offset-2 ring-offset-bg-card'
                  : 'border-transparent hover:border-white/20'
              )}
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`Lihat gambar ${index + 1}`}
              type="button"
            >
              <OptimizedImage
                src={img.url}
                alt={img.alt ?? `${productName} - Gambar ${index + 1}`}
                fill
                sizes={IMAGE_SIZES.thumb}
                objectFit="cover"
                fallbackType="thumb"
              />
              {index === selectedIndex && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Mobile swipe indicator */}
      {validImages.length > 1 && (
        <div className="sm:hidden px-3 py-2 text-center">
          <p className="text-xs text-white/50">
            Geser untuk melihat gambar lain ({selectedIndex + 1} / {validImages.length})
          </p>
        </div>
      )}
    </div>
  );
}