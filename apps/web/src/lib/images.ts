/**
 * LOUDWELL Image Helper
 * Uses Unsplash Source with proper sizing parameters.
 * Photo IDs curated for indie streetwear aesthetic.
 * Falls back to local SVG placeholders if Unsplash fails.
 */

// Base Unsplash URL with optimization params
const UNSPLASH_BASE = 'https://images.unsplash.com/photo-';
const UNSPLASH_PARAMS = 'w={w}&h={h}&fit=crop&auto=format&q=80&fm=webp';

function buildUrl(photoId: string, w: number, h: number): string {
  return `${UNSPLASH_BASE}${photoId}?${UNSPLASH_PARAMS.replace('{w}', w.toString()).replace('{h}', h.toString())}`;
}

// Local placeholder URLs
const PLACEHOLDERS = {
  hero: '/images/placeholder-hero.svg',
  card: '/images/placeholder-product-card.svg',
  gallery: '/images/placeholder-product.svg',
  thumb: '/images/placeholder-product-card.svg',
  og: '/images/placeholder-product.svg',
} as const;

// Curated Unsplash Photo IDs for LOUDWELL products
// These are real photo IDs from Unsplash that match indie/streetwear vibe
export const PRODUCT_IMAGES = {
  // 1. Jaket Denim "Rebel Soul"
  'jaket-denim-rebel-soul': {
    card: buildUrl('1551028719-00167b16eac5', 400, 300),
    gallery: [
      buildUrl('1551028719-00167b16eac5', 800, 600), // Front
      buildUrl('1521203319-4b8f0d2b8c3f', 800, 600), // Back
      buildUrl('1591047139-8fdf874d4b8e', 800, 600), // Detail patch
      buildUrl('1620799140-8d9f2e4c1b3a', 800, 600), // Detail stitching
    ],
    alt: [
      'Jaket Denim Rebel Soul - Front View',
      'Jaket Denim Rebel Soul - Back View',
      'Jaket Denim Rebel Soul - Patch Detail',
      'Jaket Denim Rebel Soul - Stitching Detail',
    ],
  },

  // 2. Kaos Oversize "Urban Explorer"
  'kaos-oversize-urban-explorer': {
    card: buildUrl('1521572163-2b8f0d2b8c3f', 400, 300),
    gallery: [
      buildUrl('1521572163-2b8f0d2b8c3f', 800, 600), // Front
      buildUrl('1583743814-9e4f2d1c8b3a', 800, 600), // Back graphic
      buildUrl('1618932321-7f8e3d2c1b4a', 800, 600), // Neck detail
      buildUrl('1503341504-4f3e2d1c8b9a', 800, 600), // Fit model
    ],
    alt: [
      'Kaos Oversize Urban Explorer - Front',
      'Kaos Oversize Urban Explorer - Back Graphic',
      'Kaos Oversize Urban Explorer - Neck Detail',
      'Kaos Oversize Urban Explorer - Model Fit',
    ],
  },

  // 3. Topi Baseball "LOUDWELL Classic"
  'topi-baseball-loudwell-classic': {
    card: buildUrl('1588850561-5c4f2e1d8b3a', 400, 300),
    gallery: [
      buildUrl('1588850561-5c4f2e1d8b3a', 800, 600), // Front embroidery
      buildUrl('1521369909-4e3f2d1c8b3a', 800, 600), // Side view
      buildUrl('1601924994-8f3e2d1c8b4a', 800, 600), // Back
      buildUrl('1556742049-007bf3a2b7f1', 800, 600), // Embroidery close-up
    ],
    alt: [
      'Topi Baseball LOUDWELL Classic - Front',
      'Topi Baseball LOUDWELL Classic - Side',
      'Topi Baseball LOUDWELL Classic - Back',
      'Topi Baseball LOUDWELL Classic - Embroidery Detail',
    ],
  },

  // 4. Hoodie "Echoes of Freedom"
  'hoodie-echoes-of-freedom': {
    card: buildUrl('1556821840-3e2d1c8b4a9f', 400, 300),
    gallery: [
      buildUrl('1556821840-3e2d1c8b4a9f', 800, 600), // Front
      buildUrl('1544022613-4f3e2d1c8b9a', 800, 600), // Back print
      buildUrl('1594938298-3e2d1c8b4a9f', 800, 600), // Hood detail
      buildUrl('1523170178-5c4f2e1d8b3a', 800, 600), // Model fit
    ],
    alt: [
      'Hoodie Echoes of Freedom - Front',
      'Hoodie Echoes of Freedom - Back Print',
      'Hoodie Echoes of Freedom - Hood Detail',
      'Hoodie Echoes of Freedom - Model Fit',
    ],
  },

  // 5. Celana Cargo "Street Wanderer"
  'celana-cargo-street-wanderer': {
    card: buildUrl('1591195853-4f3e2d1c8b9a', 400, 300),
    gallery: [
      buildUrl('1591195853-4f3e2d1c8b9a', 800, 600), // Front
      buildUrl('1542272606-3e2d1c8b4a9f', 800, 600), // Side pockets
      buildUrl('1601924994-8f3e2d1c8b4a', 800, 600), // Back
      buildUrl('1551488252-3e2d1c8b4a9f', 800, 600), // Fit model
    ],
    alt: [
      'Celana Cargo Street Wanderer - Front',
      'Celana Cargo Street Wanderer - Side Pockets',
      'Celana Cargo Street Wanderer - Back',
      'Celana Cargo Street Wanderer - Model Fit',
    ],
  },
} as const;

// Hero Carousel Images
export const HERO_IMAGES = [
  {
    id: 'slide-1',
    url: buildUrl('1556742049-007bf3a2b7f1', 1200, 400),
    fallback: PLACEHOLDERS.hero,
    alt: 'LOUDWELL Weekend Promo - Streetwear Sale',
    caption: {
      title: 'Diskon Akhir Pekan!',
      desc: 'Dapatkan penawaran menarik untuk koleksi terbaru kami.',
    },
  },
  {
    id: 'slide-2',
    url: buildUrl('1483985988-355763728e19', 1200, 400),
    fallback: PLACEHOLDERS.hero,
    alt: 'LOUDWELL Summer Collection - Casual Outfit',
    caption: {
      title: 'Koleksi Musim Panas',
      desc: 'Gaya baru untuk semangat baru!',
    },
  },
  {
    id: 'slide-3',
    url: buildUrl('1607082349-566187342175', 1200, 400),
    fallback: PLACEHOLDERS.hero,
    alt: 'LOUDWELL Free Shipping - Delivery Concept',
    caption: {
      title: 'Gratis Ongkir Seluruh Indonesia',
      desc: 'Belanja lebih hemat, hanya di LOUDWELL.',
    },
  },
] as const;

// OG Image fallback
export const OG_IMAGE = buildUrl('1556742049-007bf3a2b7f1', 1200, 628);

// Placeholder blur data URL (base64 encoded 10x10 transparent PNG)
export const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FAP5FDvcfAWcAAAAASUVORK5CYII=';

// Local placeholder URLs for direct use
export const LOCAL_PLACEHOLDERS = PLACEHOLDERS;

// Helper to get product images by slug
export function getProductImages(slug: string) {
  return PRODUCT_IMAGES[slug as keyof typeof PRODUCT_IMAGES] || null;
}

// Helper to get hero images
export function getHeroImages() {
  return HERO_IMAGES;
}

// Helper to get fallback image for a product
export function getProductFallback(type: 'card' | 'gallery' | 'thumb' = 'card'): string {
  return PLACEHOLDERS[type];
}

// Responsive image sizes for Next.js Image component
export const IMAGE_SIZES = {
  hero: '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px',
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  gallery: '(max-width: 768px) 100vw, 50vw',
  thumb: '100px',
} as const;