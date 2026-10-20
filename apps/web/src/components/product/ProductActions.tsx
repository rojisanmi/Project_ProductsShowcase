'use client';

import { cn } from '@/lib/utils';

interface ProductActionsProps {
  productName: string;
  productDescription: string;
  productSlug: string;
  shopeeUrl?: string;
}

export function ProductActions({
  productName,
  productDescription,
  productSlug,
  shopeeUrl,
}: ProductActionsProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: productDescription,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link disalin ke clipboard!');
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-bg-border">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleShare}
          className="flex-1 sm:flex-none h-11 px-4 rounded-xl bg-white/5 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          type="button"
        >
          Bagikan
        </button>
        <a
          href={`/api/products/${productSlug}`}
          target="_blank"
          className={cn(
            'flex-1 sm:flex-none h-11 px-4 rounded-xl border border-white/15 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors flex items-center justify-center',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary'
          )}
        >
          Lihat JSON
        </a>
        {shopeeUrl && (
          <a
            href={shopeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex-1 sm:flex-none h-11 px-4 rounded-xl bg-accent-primary text-sm font-semibold text-white hover:bg-accent-hover transition-colors flex items-center justify-center',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary'
            )}
          >
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            Beli di Shopee
          </a>
        )}
      </div>
    </div>
  );
}