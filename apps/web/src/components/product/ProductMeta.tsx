'use client';

import { formatIDR } from '@/lib/money';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCartStore } from '@/hooks/useCartStore';

interface ProductMetaProps {
  productId: string;
  name: string;
  slug: string;
  priceMinor: number;
  currency: string;
  stockQty: number;
  description: string;
  image?: string | null;
  material?: string;
  sizes?: string;
}

export function ProductMeta({
  productId,
  name,
  slug,
  priceMinor,
  currency,
  stockQty,
  description,
  image,
  material,
  sizes,
}: ProductMetaProps) {
  const inStock = stockQty > 0;
  const { addItem, getItemCount, getItemIdByProductId } = useCartStore();
  const inCartQty = getItemCount(productId);

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      productId,
      name,
      slug,
      priceMinor,
      currency,
      image: image ?? null,
      quantity: 1,
      stockQty,
    });
  };

  const handleQuantityChange = (delta: number) => {
    const itemId = getItemIdByProductId(productId);
    if (itemId) {
      useCartStore.getState().updateQuantity(itemId, inCartQty + delta);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category/Label */}
      <div className="text-sm text-white/60">Produk</div>

      {/* Name */}
      <h1 className="text-3xl font-semibold tracking-tight text-white">{name}</h1>

      {/* Price & Stock */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-2xl font-semibold text-white">
          {formatIDR(priceMinor)}
        </div>
        <Badge variant={inStock ? 'success' : 'danger'}>
          {inStock ? `Stok: ${stockQty}` : 'Habis'}
        </Badge>
      </div>

      {/* Description */}
      <div className="prose prose-invert max-w-none text-white/70">
        <p className="whitespace-pre-line leading-7">{description}</p>
      </div>

      {/* Specs */}
      {(material || sizes) && (
        <div className="border-t border-bg-border pt-6 space-y-3">
          {material && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-white/50 w-24 shrink-0">Bahan:</span>
              <span className="text-white/80">{material}</span>
            </div>
          )}
          {sizes && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-white/50 w-24 shrink-0">Ukuran:</span>
              <span className="text-white/80">{sizes}</span>
            </div>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="pt-4">
        {inCartQty > 0 ? (
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleQuantityChange(-1)}
              className="h-12 w-12 p-0"
              aria-label="Kurangi jumlah"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </Button>
            <span className="text-lg font-semibold text-white w-10 text-center">
              {inCartQty}
            </span>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleQuantityChange(1)}
              disabled={inCartQty >= stockQty}
              className="h-12 w-12 p-0"
              aria-label="Tambah jumlah"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
            <span className="ml-auto text-sm text-white/60">
              Sudah di keranjang
            </span>
          </div>
        ) : (
          <Button
            size="lg"
            disabled={!inStock}
            onClick={handleAddToCart}
            className="w-full sm:w-auto"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7m12 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m12 0H6m10 0l-3-3m3 3l-3 3" />
            </svg>
            {inStock ? 'Tambah ke Keranjang' : 'Stok Habis'}
          </Button>
        )}
      </div>
    </div>
  );
}