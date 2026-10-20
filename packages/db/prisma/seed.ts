import { prisma } from "../src/index.js";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Unsplash image URLs with proper sizing
const IMAGES = {
  // Jaket Denim "Rebel Soul"
  'jaket-denim-rebel-soul': {
    card: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop&auto=format&q=80&fm=webp',
    gallery: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1521203319-4b8f0d2b8c3f?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1591047139-8fdf874d4b8e?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1620799140-8d9f2e4c1b3a?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
    ],
    alt: [
      'Jaket Denim Rebel Soul - Front View',
      'Jaket Denim Rebel Soul - Back View',
      'Jaket Denim Rebel Soul - Patch Detail',
      'Jaket Denim Rebel Soul - Stitching Detail',
    ],
  },

  // Kaos Oversize "Urban Explorer"
  'kaos-oversize-urban-explorer': {
    card: 'https://images.unsplash.com/photo-1521572163-2b8f0d2b8c3f?w=400&h=300&fit=crop&auto=format&q=80&fm=webp',
    gallery: [
      'https://images.unsplash.com/photo-1521572163-2b8f0d2b8c3f?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1583743814-9e4f2d1c8b3a?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1618932321-7f8e3d2c1b4a?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1503341504-4f3e2d1c8b9a?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
    ],
    alt: [
      'Kaos Oversize Urban Explorer - Front',
      'Kaos Oversize Urban Explorer - Back Graphic',
      'Kaos Oversize Urban Explorer - Neck Detail',
      'Kaos Oversize Urban Explorer - Model Fit',
    ],
  },

  // Topi Baseball "LOUDWELL Classic"
  'topi-baseball-loudwell-classic': {
    card: 'https://images.unsplash.com/photo-1588850561-5c4f2e1d8b3a?w=400&h=300&fit=crop&auto=format&q=80&fm=webp',
    gallery: [
      'https://images.unsplash.com/photo-1588850561-5c4f2e1d8b3a?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1521369909-4e3f2d1c8b3a?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1601924994-8f3e2d1c8b4a?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1556742049-007bf3a2b7f1?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
    ],
    alt: [
      'Topi Baseball LOUDWELL Classic - Front',
      'Topi Baseball LOUDWELL Classic - Side',
      'Topi Baseball LOUDWELL Classic - Back',
      'Topi Baseball LOUDWELL Classic - Embroidery Detail',
    ],
  },

  // Hoodie "Echoes of Freedom"
  'hoodie-echoes-of-freedom': {
    card: 'https://images.unsplash.com/photo-1556821840-3e2d1c8b4a9f?w=400&h=300&fit=crop&auto=format&q=80&fm=webp',
    gallery: [
      'https://images.unsplash.com/photo-1556821840-3e2d1c8b4a9f?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1544022613-4f3e2d1c8b9a?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1594938298-3e2d1c8b4a9f?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1523170178-5c4f2e1d8b3a?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
    ],
    alt: [
      'Hoodie Echoes of Freedom - Front',
      'Hoodie Echoes of Freedom - Back Print',
      'Hoodie Echoes of Freedom - Hood Detail',
      'Hoodie Echoes of Freedom - Model Fit',
    ],
  },

  // Celana Cargo "Street Wanderer"
  'celana-cargo-street-wanderer': {
    card: 'https://images.unsplash.com/photo-1591195853-4f3e2d1c8b9a?w=400&h=300&fit=crop&auto=format&q=80&fm=webp',
    gallery: [
      'https://images.unsplash.com/photo-1591195853-4f3e2d1c8b9a?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1542272606-3e2d1c8b4a9f?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1601924994-8f3e2d1c8b4a?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
      'https://images.unsplash.com/photo-1551488252-3e2d1c8b4a9f?w=800&h=600&fit=crop&auto=format&q=80&fm=webp',
    ],
    alt: [
      'Celana Cargo Street Wanderer - Front',
      'Celana Cargo Street Wanderer - Side Pockets',
      'Celana Cargo Street Wanderer - Back',
      'Celana Cargo Street Wanderer - Model Fit',
    ],
  },
} as const;

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: "loudwell-collection" },
    update: {},
    create: { name: "Loudwell Collection", slug: "loudwell-collection" },
  });

  const products = [
    {
      name: 'Jaket Denim LOUDWELL "Rebel Soul"',
      description:
        'Jaket denim premium dengan detail jahitan yang unik dan patch "Rebel Soul". Cocok untuk tampilan kasual yang berani.',
      priceMinor: 399_000,
      quantity: 25,
      material: 'Denim Katun Tebal 12oz',
      sizes: 'S, M, L, XL',
      shopeeUrl: 'https://shopee.co.id/jaket-denim-loudwell-rebel-soul-i.123456789.987654321',
      images: IMAGES['jaket-denim-rebel-soul'].gallery.map((url, index) => ({
        url,
        alt: IMAGES['jaket-denim-rebel-soul'].alt[index],
        sortOrder: index,
      })),
    },
    {
      name: 'Kaos Oversize "Urban Explorer"',
      description:
        'Kaos oversize nyaman dengan desain grafis "Urban Explorer" yang minimalis namun penuh gaya. Ideal untuk keseharian Anda.',
      priceMinor: 149_000,
      quantity: 40,
      material: 'Katun Combed 30s',
      sizes: 'M, L, XL, XXL',
      shopeeUrl: 'https://shopee.co.id/kaos-oversize-loudwell-urban-explorer-i.987654321.123456789',
      images: IMAGES['kaos-oversize-urban-explorer'].gallery.map((url, index) => ({
        url,
        alt: IMAGES['kaos-oversize-urban-explorer'].alt[index],
        sortOrder: index,
      })),
    },
    {
      name: 'Topi Baseball "LOUDWELL Classic"',
      description:
        'Topi baseball klasik dengan bordiran logo LOUDWELL. Tambahan sempurna untuk melengkapi gaya indie Anda.',
      priceMinor: 89_000,
      quantity: 60,
      material: 'Katun Twill',
      sizes: 'All Size (Adjustable)',
      shopeeUrl: 'https://shopee.co.id/topi-baseball-loudwell-classic-i.112233445.556677889',
      images: IMAGES['topi-baseball-loudwell-classic'].gallery.map((url, index) => ({
        url,
        alt: IMAGES['topi-baseball-loudwell-classic'].alt[index],
        sortOrder: index,
      })),
    },
    {
      name: 'Hoodie "Echoes of Freedom"',
      description:
        'Hoodie tebal dengan desain "Echoes of Freedom" di bagian belakang. Hangat dan stylish untuk cuaca dingin.',
      priceMinor: 299_000,
      quantity: 18,
      material: 'Fleece Katun 320gsm',
      sizes: 'S, M, L, XL',
      shopeeUrl: 'https://shopee.co.id/hoodie-loudwell-echoes-of-freedom-i.334455667.778899001',
      images: IMAGES['hoodie-echoes-of-freedom'].gallery.map((url, index) => ({
        url,
        alt: IMAGES['hoodie-echoes-of-freedom'].alt[index],
        sortOrder: index,
      })),
    },
    {
      name: 'Celana Cargo "Street Wanderer"',
      description:
        'Celana cargo dengan banyak saku, nyaman dan fungsional untuk petualangan urban Anda.',
      priceMinor: 279_000,
      quantity: 30,
      material: 'Katun Ripstop',
      sizes: '28, 30, 32, 34, 36',
      shopeeUrl: 'https://shopee.co.id/celana-cargo-loudwell-street-wanderer-i.556677889.990011223',
      images: IMAGES['celana-cargo-street-wanderer'].gallery.map((url, index) => ({
        url,
        alt: IMAGES['celana-cargo-street-wanderer'].alt[index],
        sortOrder: index,
      })),
    },
  ];

  for (const p of products) {
    const slug = slugify(p.name);
    const cardImage = IMAGES[slug as keyof typeof IMAGES]?.card;

    // First, find existing product to delete its images
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
      include: { images: true },
    });

    if (existingProduct) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId: existingProduct.id },
      });
    }

    await prisma.product.upsert({
      where: { slug },
      update: {
        name: p.name,
        description: p.description,
        priceMinor: p.priceMinor,
        currency: "IDR",
        isActive: true,
        categoryId: category.id,
        material: p.material,
        sizes: p.sizes,
        shopeeUrl: p.shopeeUrl,
        images: {
          create: [
            // Card image first (sortOrder -1 to appear first)
            ...(cardImage ? [{ url: cardImage, alt: `${p.name} - Card Image`, sortOrder: -1 }] : []),
            // Gallery images
            ...p.images,
          ],
        },
      },
      create: {
        name: p.name,
        slug,
        description: p.description,
        priceMinor: p.priceMinor,
        currency: "IDR",
        isActive: true,
        categoryId: category.id,
        material: p.material,
        sizes: p.sizes,
        shopeeUrl: p.shopeeUrl,
        inventory: { create: { quantity: p.quantity } },
        images: {
          create: [
            // Card image first
            ...(cardImage ? [{ url: cardImage, alt: `${p.name} - Card Image`, sortOrder: -1 }] : []),
            // Gallery images
            ...p.images,
          ],
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });