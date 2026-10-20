'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/Image';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatIDR } from '@/lib/money';
import { IMAGE_SIZES } from '@/lib/images';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/hooks/useCartStore';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceMinor: number;
  currency: string;
  image: string | null;
  inStock: boolean;
  category?: { slug: string; name: string } | null;
}

export function ProductCard({
  id,
  name,
  slug,
  description,
  priceMinor,
  currency,
  image,
  inStock,
  category,
}: ProductCardProps) {
  const productImage = image || '/placeholder-product.jpg';
  const { addItem, getItemCount } = useCartStore();
  const inCartQty = getItemCount(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem({
      productId: id,
      name,
      slug,
      priceMinor,
      currency,
      image,
      quantity: 1,
      stockQty: 999, // Will be validated server-side
    });
  };

  const handleQuantityChange = (delta: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const itemId = useCartStore.getState().getItemIdByProductId(id);
    if (itemId) {
      useCartStore.getState().updateQuantity(itemId, inCartQty + delta);
    }
  };

  const handleRemoveItem = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const itemId = useCartStore.getState().getItemIdByProductId(id);
    if (itemId) useCartStore.getState().removeItem(itemId);
  };

  return (
    <div className="group">
      <Link
        href={`/products/${slug}`}
        className="card-hover block rounded-2xl border border-bg-border bg-bg-card overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        aria-label={`Lihat detail ${name}`}
      >
        <div className="relative aspect-card overflow-hidden bg-white/5">
          <OptimizedImage
            src={productImage}
            alt={name}
            fill
            sizes={IMAGE_SIZES.card}
            objectFit="cover"
            fallbackType="card"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Badge variant={inStock ? 'success' : 'danger'} size="sm">
              {inStock ? 'Tersedia' : 'Habis'}
            </Badge>
          </div>
          {category && (
            <div className="absolute top-3 left-3">
              <Badge variant="accent" size="sm">
                {category.name}
              </Badge>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-base font-semibold text-white leading-6 line-clamp-2 group-hover:text-accent-primary transition-colors">
            {name}
          </h3>

          <p className="mt-2 text-sm text-white/60 line-clamp-2">
            {description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-semibold text-accent-primary">
              {formatIDR(priceMinor)}
            </div>
            <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
              Lihat Detail →
            </span>
          </div>
        </div>
      </Link>

      {/* Quick Add to Cart */}
      {inStock && (
        <div className="px-5 pb-5 pt-0">
          {inCartQty > 0 ? (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => handleQuantityChange(-1, e)}
                className="h-9 w-9 p-0"
                aria-label="Kurangi jumlah"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </Button>
              <span className="text-sm font-semibold text-white w-8 text-center">
                {inCartQty}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => handleQuantityChange(1, e)}
                disabled={inCartQty >= 99}
                className="h-9 w-9 p-0"
                aria-label="Tambah jumlah"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveItem}
                className="ml-auto h-9 px-2"
              >
                <svg className="h-4 w-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="w-full"
              size="sm"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7m12 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m12 0H6m10 0l-3-3m3 3l-3 3" />
              </svg>
              Tambah ke Keranjang
            </Button>
          )}
        </div>
      )}
    </div>
  );
}