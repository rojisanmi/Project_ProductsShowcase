'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/Image';
import { Button } from '@/components/ui/Button';
import { formatIDR } from '@/lib/money';
import { IMAGE_SIZES } from '@/lib/images';
import { useCartStore } from '@/hooks/useCartStore';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotalItems,
  } = useCartStore();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeCart]);

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const shipping = subtotal > 0 ? 15000 : 0; // Rp 15.000 flat rate
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-modal-backdrop)] transition-opacity animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-sm z-[var(--z-modal)] bg-bg-primary border-l border-bg-border flex flex-col shadow-[var(--shadow-xl)] animate-slide-in"
        role="dialog"
        aria-label="Keranjang belanja"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-bg-border bg-bg-card/50 backdrop-blur sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-white">Keranjang Belanja</h2>
          <button
            onClick={closeCart}
            className="btn btn-icon btn-ghost"
            aria-label="Tutup keranjang"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-white/60 px-6">
              <div className="w-20 h-20 rounded-full bg-accent-light flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7m12 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m12 0H6m10 0l-3-3m3 3l-3 3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Keranjang Kosong</h3>
              <p className="text-sm text-white/50 mb-6">Tambahkan produk untuk memulai belanja</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="btn btn-primary w-full sm:w-auto"
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl bg-bg-card border border-bg-border card-hover group"
                >
                  <div className="relative aspect-thumb w-20 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                    <OptimizedImage
                      src={item.image || '/images/placeholder-product.svg'}
                      alt={item.name}
                      fill
                      sizes={IMAGE_SIZES.thumb}
                      objectFit="cover"
                      fallbackType="thumb"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="font-medium text-white hover:text-accent-primary truncate block group-hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-accent-primary font-semibold mt-1">
                        {formatIDR(item.priceMinor)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border border-bg-border rounded-lg overflow-hidden bg-bg-primary/50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="btn btn-icon btn-ghost p-1.5 disabled:opacity-50"
                          aria-label="Kurangi jumlah"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stockQty}
                          className="btn btn-icon btn-ghost p-1.5 disabled:opacity-50"
                          aria-label="Tambah jumlah"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="btn btn-icon btn-ghost p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
                        aria-label={`Hapus ${item.name} dari keranjang`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Subtotal */}
              <div className="border-t border-bg-border pt-4 space-y-3 animate-slide-up">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Subtotal</span>
                  <span className="text-white font-medium">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Ongkir</span>
                  <span className="text-white font-medium">
                    {shipping > 0 ? formatIDR(shipping) : <span className="text-success-text">Gratis</span>}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white border-t border-bg-border pt-3">
                  <span>Total</span>
                  <span>{formatIDR(total)}</span>
                </div>
                <p className="text-xs text-white/50 text-center">Pembayaran COD (Bayar di Tempat)</p>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-4 border-t border-bg-border space-y-3 bg-bg-card/50 backdrop-blur sticky bottom-0 z-10 animate-slide-up">
            <Link href="/products" onClick={closeCart} className="block">
              <Button variant="outline" className="w-full">
                Lanjut Belanja
              </Button>
            </Link>
            <Link href="/checkout" className="block">
              <Button className="w-full" size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7m12 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m12 0H6m10 0l-3-3m3 3l-3 3" />
                </svg>
                Checkout <span className="ml-2">{formatIDR(total)}</span>
              </Button>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}