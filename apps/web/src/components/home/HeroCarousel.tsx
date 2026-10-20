'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/Image';
import { getHeroImages, IMAGE_SIZES } from '@/lib/images';
import { cn } from '@/lib/utils';

export function HeroCarousel() {
  const slides = getHeroImages();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const goNext = useCallback(() => {
    goToSlide((currentIndex + 1) % slides.length);
  }, [currentIndex, slides.length, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  }, [currentIndex, slides.length, goToSlide]);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [goNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext]);

  return (
    <section
      id="hero"
      className="relative section hero-section"
      aria-label="Hero Carousel"
    >
      <div className="container">
        <div
          className="relative overflow-hidden rounded-2xl card shadow-xl"
          role="region"
          aria-label="Promo Slider"
        >
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={slide.id} className="w-full flex-shrink-0 relative">
                <OptimizedImage
                  src={slide.url}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes={IMAGE_SIZES.hero}
                  objectFit="cover"
                  className="aspect-hero"
                  fallbackType="hero"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/95 via-bg-primary/30 to-transparent" />
                <div className="absolute inset-0 flex items-end p-6 md:p-10 lg:p-12">
                  <div className="max-w-2xl w-full animate-slide-up delay-1">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-white/90 text-sm font-medium mb-4">
                      <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                      {slide.caption.title}
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                      {slide.caption.desc}
                    </h2>
                    <Link
                      href="/products"
                      className="btn btn-primary btn-lg inline-flex"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Jelajahi Koleksi
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex btn btn-icon-lg btn-ghost glass"
            aria-label="Slide sebelumnya"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex btn btn-icon-lg btn-ghost glass"
            aria-label="Slide selanjutnya"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3" role="tablist" aria-label="Slide indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'h-2 md:h-3 transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary',
                  index === currentIndex
                    ? 'w-8 md:w-10 bg-white'
                    : 'w-2 md:w-3 bg-white/40 hover:bg-white/60'
                )}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to slide ${index + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}