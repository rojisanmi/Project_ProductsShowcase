import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductMeta } from '@/components/product/ProductMeta';
import { ProductActions } from '@/components/product/ProductActions';
import { getProductImages } from '@/lib/images';
import { formatIDR } from '@/lib/money';

type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceMinor: number;
  currency: string;
  images: { url: string; alt: string | null; sortOrder: number }[];
  stockQty: number;
  category: { slug: string; name: string } | null;
  material?: string;
  sizes?: string;
  shopeeUrl?: string;
};

async function getProduct(slug: string): Promise<ProductDetail | null> {
  const res = await fetch(`http://localhost:3000/api/products/${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

function generateJsonLd(product: ProductDetail) {
  const inStock = product.stockQty > 0;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.url),
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'LOUDWELL',
    },
    offers: {
      '@type': 'Offer',
      url: `https://loudwell.com/products/${product.slug}`,
      priceCurrency: product.currency,
      price: (product.priceMinor / 100).toFixed(0),
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'LOUDWELL',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  };
}

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan',
    };
  }

  const firstImage = product.images[0]?.url;

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: firstImage ? [{ url: firstImage, width: 800, height: 600, alt: product.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description.slice(0, 160),
      images: firstImage ? [firstImage] : [],
    },
    other: {
      'product:retailer_item_id': product.id,
      'og:price:amount': (product.priceMinor / 100).toString(),
      'og:price:currency': product.currency,
      'og:availability': product.stockQty > 0 ? 'instock' : 'outofstock',
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // Merge with curated images if available
  const curatedImages = getProductImages(slug);
  const galleryImages = curatedImages
    ? curatedImages.gallery.map((url, index) => ({
        url,
        alt: curatedImages.alt[index] ?? `${product.name} - Gambar ${index + 1}`,
        sortOrder: index,
      }))
    : product.images.length > 0
      ? product.images
      : [{ url: '/images/placeholder-product.svg', alt: product.name, sortOrder: 0 }];

  const jsonLd = generateJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-full bg-bg-primary text-white">
        <header className="border-b border-bg-border bg-bg-primary/95 backdrop-blur sticky top-16 z-40">
          <div className="container py-4">
            <nav className="flex items-center gap-2 text-sm text-white/50" aria-label="Breadcrumb">
              <Link href="/" className="link">Beranda</Link>
              <span aria-hidden="true">/</span>
              <Link href="/products" className="link">Produk</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white/70 truncate max-w-xs" aria-current="page">{product.name}</span>
            </nav>
          </div>
        </header>

        <main className="container py-10">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Gallery */}
            <div className="card p-6">
              <ProductGallery images={galleryImages} productName={product.name} />
              <p className="mt-4 text-xs text-white/50 text-center">
                Klik gambar untuk memperbesar • Geser untuk melihat lebih banyak
              </p>
            </div>

            {/* Product Meta */}
            <div className="card p-6 sticky top-24 lg:sticky lg:top-24">
              <ProductMeta
                productId={product.id}
                name={product.name}
                slug={product.slug}
                priceMinor={product.priceMinor}
                currency={product.currency}
                stockQty={product.stockQty}
                description={product.description}
                image={galleryImages[0]?.url}
                material={product.material}
                sizes={product.sizes}
              />

              {/* Share / JSON link / Shopee */}
              <ProductActions
                productName={product.name}
                productDescription={product.description}
                productSlug={product.slug}
                shopeeUrl={product.shopeeUrl}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Need to import Link
import Link from 'next/link';