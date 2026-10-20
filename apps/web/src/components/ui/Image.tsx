'use client';

import Image from 'next/image';
import { forwardRef, HTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { BLUR_DATA_URL, LOCAL_PLACEHOLDERS } from '@/lib/images';

export interface OptimizedImageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackType?: 'hero' | 'card' | 'gallery' | 'thumb';
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = forwardRef<HTMLDivElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      priority = false,
      fill = false,
      sizes,
      className,
      objectFit = 'cover',
      fallbackType = 'card',
      onLoad,
      onError,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    const fallbackSrc = LOCAL_PLACEHOLDERS[fallbackType];

    const handleLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleError = () => {
      if (currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setIsLoading(true); // Show loading for fallback too
      } else {
        setIsLoading(false);
        setHasError(true);
      }
      onError?.();
    };

    if (hasError) {
      return (
        <div
          ref={ref}
          className={cn(
            'relative bg-white/5 flex items-center justify-center',
            className
          )}
          style={{ width, height }}
          {...props}
        >
          <div className="text-center p-4 text-white/40">
            <svg
              className="mx-auto h-8 w-8 mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">Gambar tidak tersedia</p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          className
        )}
        style={{ width: fill ? undefined : width, height: fill ? undefined : height }}
        {...props}
      >
        <Image
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className={cn(
            'transition-opacity duration-500 ease-in-out',
            isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
            `object-${objectFit}`,
            fill && 'absolute inset-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          quality={85}
        />
        {isLoading && (
          <div
            className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="h-8 w-8 text-white/30 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';