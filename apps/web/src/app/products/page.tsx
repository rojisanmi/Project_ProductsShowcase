'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { IMAGE_SIZES } from '@/lib/images';

type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceMinor: number;
  currency: string;
  image: string | null;
  inStock: boolean;
  category: { slug: string; name: string } | null;
};

type ProductsResponse = {
  items: ProductListItem[];
  total: number;
  take: number;
  skip: number;
};

export default function ProductsClient() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const TAKE = 12;

  const fetchProducts = useCallback(async (query: string, offset: number, isSearch = false) => {
    try {
      if (isSearch) setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      params.set('take', TAKE.toString());
      params.set('skip', offset.toString());

      const res = await fetch(`/api/products?${params.toString()}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to load products');
      const data: ProductsResponse = await res.json();

      if (isSearch || offset === 0) {
        setProducts(data.items);
      } else {
        setProducts((prev) => [...prev, ...data.items]);
      }
      setTotal(data.total);
      setHasMore(data.items.length === TAKE && offset + data.items.length < data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch when debounced query changes
  useEffect(() => {
    setSkip(0);
    fetchProducts(debouncedQuery, 0, true);
  }, [debouncedQuery, fetchProducts]);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    fetchProducts(debouncedQuery, skip + TAKE);
    setSkip((prev) => prev + TAKE);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center card p-8 animate-fade-in">
          <p className="text-danger-text mb-4">Gagal memuat produk: {error}</p>
          <Button onClick={() => fetchProducts(debouncedQuery, 0, true)}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-bg-primary text-white">
      <header className="border-b border-bg-border bg-bg-primary/95 backdrop-blur sticky top-16 z-40">
        <div className="container py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="link text-sm font-semibold">← LOUDWELL</Link>
              <span className="text-sm text-white/70">Koleksi Produk</span>
            </div>
            <div className="relative max-w-md w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Cari produk..."
                className="input pl-10"
                aria-label="Cari produk"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container py-10">
        {loading && products.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Memuat produk">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="aspect-card skeleton rounded-xl" />
                <div className="mt-3 h-4 w-3/4 skeleton rounded" />
                <div className="mt-2 h-4 w-1/2 skeleton rounded" />
                <div className="mt-4 h-6 w-1/3 skeleton rounded" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="mx-auto w-20 h-20 rounded-full bg-accent-light flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Tidak ada produk ditemukan</h3>
            <p className="text-white/60 mb-4">Coba ubah kata kunci pencarian atau lihat semua produk.</p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Reset Pencarian
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-white/60">
                Menampilkan <span className="font-semibold text-white">{products.length}</span> dari{' '}
                <span className="font-semibold text-white">{total}</span> produk
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Daftar produk">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  isLoading={loading}
                  variant="outline"
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  Muat Lebih Banyak
                </Button>
              </div>
            )}

            {!hasMore && products.length > 0 && (
              <p className="mt-8 text-center text-sm text-white/50">
                Semua produk telah dimuat ({total} total)
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Need to import Link
import Link from 'next/link';