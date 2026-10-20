# PRD: LOUDWELL Showcase — Web App Perfection

**Versi:** 1.0  
**Tanggal:** 2026-10-20  
**Status:** Draft untuk Review  
**Author:** AI Assistant (OpenCode)

---

## 1. Executive Summary

### 1.1 Latar Belakang
LOUDWELL adalah brand outfit indie premium yang memiliki landing page statis (versi lama: `index.html`, `css/`, `js/`). Saat ini sedang dalam migrasi ke **fullstack web app** berbasis **Next.js 16 (App Router) + Prisma + PostgreSQL/SQLite**.

### 1.2 Tujuan PRD Ini
Menyusun rencana lengkap untuk **menyempurnakan showcase web app** agar:
- **Production-ready** sebagai portfolio/demo brand
- **Visual parity** dengan desain lama (dark theme biru kehitaman, accent biru #007bff)
- **Data-driven** — produk dari database, bukan hardcoded
- **Image-ready** — menggunakan gambar online berkualitas dengan ukuran yang tepat
- **Feature-complete** untuk fase katalog (Milestone A)

---

## 2. Current State Assessment

### 2.1 Legacy Static Site (`index.html`, `css/style.css`, `js/script.js`)
| Aspek | Status |
|-------|--------|
| Hero Carousel | ✅ 3 slide promo (placeholder via placeholder.com) |
| Product Grid | ✅ 5 produk hardcoded di `script.js` |
| Product Modal | ✅ Detail lengkap + carousel gambar + link Shopee |
| Styling | ✅ Dark theme (#1c2130), accent #007bff, Roboto font |
| Responsive | ✅ Mobile-first, breakpoint 768px |

### 2.2 Next.js App (`apps/web/`)
| Halaman/Fitur | Status |
|---------------|--------|
| Home (`/`) | ✅ Hero sederhana, CTA ke produk & API |
| Product List (`/products`) | ✅ Grid 3 kolom, fetch dari API, badge stock |
| Product Detail (`/products/[slug]`) | ✅ Layout 2 kolom, placeholder gambar, tombol cart disabled |
| API `GET /api/products` | ✅ Pagination, search, filter aktif, include image + inventory + category |
| API `GET /api/products/[slug]` | ✅ Detail lengkap + multiple images + stock qty |
| Database (Prisma) | ✅ Schema: Category, Product, ProductImage, Inventory |
| Seed Data | ✅ 5 produk mirip legacy + kategori "Loudwell Collection" |
| Styling | ⚠️ Tailwind v4, bg `#0b1220` (berbeda dari legacy `#1c2130`) |
| Font | ⚠️ Geist (berbeda dari legacy Roboto) |

### 2.3 Gap Utama
1. **Visual inconsistency** — Warna background, font, spacing beda dari legacy
2. **No real images** — PDP pakai placeholder gradient, PLP pakai `p.image` yang null
3. **No hero carousel** — Home page kosong, tidak ada promo slider
4. **No cart/checkout** — Milestone B/C belum dimulai
5. **Seed images** — Path `/seed/...` tidak ada file fisik, butuh gambar online

---

## 3. Product Requirements

### 3.1 Functional Requirements (Milestone A — Katalog Dinamis)

| ID | Fitur | Deskripsi | Prioritas |
|----|-------|-----------|-----------|
| FR-01 | **Hero Carousel** | 3 slide promo di home: (1) Diskon Akhir Pekan, (2) Koleksi Musim Panas, (3) Gratis Ongkir. Auto-slide 5s, navigasi prev/next, indicators. | P0 |
| FR-02 | **Product Listing Page (PLP)** | Grid responsif (1 col mobile, 2 tablet, 3 desktop). Card: gambar, nama, harga, badge stock, deskripsi singkat. Klik → PDP. | P0 |
| FR-03 | **Product Detail Page (PDP)** | Galeri gambar (thumbnail + main), nama, harga, stok, deskripsi, bahan, ukuran, tombol "Beli di Shopee" (external link). | P0 |
| FR-04 | **Real Product Images** | Semua gambar produk (card, galeri PDP, hero) menggunakan gambar online berkualitas, ukuran konsisten, lazy-loaded. | P0 |
| FR-05 | **Visual Parity** | Match legacy: bg `#1c2130`, accent `#007bff`, font Roboto, radius 10px/2xl, shadow hover, transition 0.3s. | P0 |
| FR-06 | **Navbar & Footer** | Fixed top navbar dengan logo, nav link Beranda/Produk. Footer: logo, copyright, sosmed (IG, Shopee), quick links. | P0 |
| FR-07 | **Search & Filter (API ready)** | Query param `q` untuk search nama/deskripsi. Pagination `take`/`skip`. UI search bar di PLP (opsional P1). | P1 |
| FR-08 | **Category Filter** | Filter by category slug. UI dropdown/chip di PLP (P1). | P1 |

### 3.2 Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | **Performance** | LCP < 2.5s, CLS < 0.1, TBT < 200ms. Gambar WebP/AVIF, lazy load, proper sizing. |
| NFR-02 | **Accessibility** | WCAG 2.1 AA: alt text, heading hierarchy, focus visible, color contrast ≥ 4.5:1. |
| NFR-03 | **SEO** | Meta tags (title, description, OG), semantic HTML, JSON-LD Product schema di PDP. |
| NFR-04 | **Responsive** | Breakpoints: sm (640), md (768), lg (1024), xl (1280). Touch-friendly tap targets ≥ 44px. |
| NFR-05 | **Browser Support** | Chrome/Edge/Firefox/Safari latest 2 versions. No IE. |
| NFR-06 | **Image Strategy** | Gunakan CDN gambar gratis (Unsplash, Pexels) dengan parameter `w=`, `h=`, `fit=crop`, `auto=format`. Ukuran standar: Card 400×300, Hero 1200×400, PDP Gallery 800×600. |

---

## 4. Image Strategy (Critical)

### 4.1 Sizing Standards

| Use Case | Aspect Ratio | Width × Height | CSS `object-fit` |
|----------|--------------|----------------|------------------|
| Hero Carousel | 3:1 | 1200 × 400 | `cover` |
| Product Card (PLP) | 4:3 | 400 × 300 | `cover` |
| PDP Main Gallery | 4:3 | 800 × 600 | `contain` |
| PDP Thumbnail | 1:1 | 100 × 100 | `cover` |
| Open Graph / Social | 1.91:1 | 1200 × 628 | `cover` |

### 4.2 Image Sources & URL Templates

Gunakan **Unsplash Source** atau **Pexels** dengan parameter sizing. Contoh:
```
https://images.unsplash.com/photo-{ID}?w=1200&h=400&fit=crop&auto=format&q=80
https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg?w=800&h=600&fit=crop&auto=format
```

### 4.3 Product Image Mapping (5 Produk)

| Produk | Kategori | Hero/Plp (400×300) | PDP Gallery (800×600) — 2-4 gambar |
|--------|----------|---------------------|-----------------------------------|
| Jaket Denim "Rebel Soul" | Outerwear | Denim jacket front | Front, back, detail patch, detail stitching |
| Kaos Oversize "Urban Explorer" | Tops | Oversize tee front | Front, back graphic, detail neck, fit model |
| Topi Baseball "LOUDWELL Classic" | Accessories | Cap front embroidery | Front, side, back, detail embroidery |
| Hoodie "Echoes of Freedom" | Outerwear | Hoodie front | Front, back print, detail hood, fit model |
| Celana Cargo "Street Wanderer" | Bottoms | Cargo pants front | Front, side pockets, back, fit model |

### 4.4 Hero Carousel Images (3 slides)

| Slide | Theme | Search Keywords (Unsplash/Pexels) | Size |
|-------|-------|-----------------------------------|------|
| 1 | Weekend Promo | "streetwear sale", "fashion discount", "urban style" | 1200×400 |
| 2 | Summer Collection | "summer outfit", "lightweight jacket", "casual summer" | 1200×400 |
| 3 | Free Shipping | "delivery", "shipping boxes", "online shopping" | 1200×400 |

### 4.5 Implementation: Image Helper Utility

Buat `apps/web/src/lib/images.ts`:
```ts
export const img = {
  hero: (id: string, w = 1200, h = 400) =>
    `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`,
  product: (id: string, w = 400, h = 300) =>
    `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`,
  productDetail: (id: string, w = 800, h = 600) =>
    `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`,
  og: (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&h=628&fit=crop&auto=format&q=80`,
};
```

> **Catatan**: Ganti `photo-{ID}` dengan ID foto Unsplash/Pexels yang relevan. Simpan mapping di seed atau config JSON.

---

## 5. Technical Implementation Plan

### 5.1 Phase 1: Visual Parity & Foundation (P0)

| Task | File(s) | Description |
|------|---------|-------------|
| 1.1 | `globals.css` | Set `--background: #1c2130`, `--foreground: #ffffff`, font-family: 'Roboto' |
| 1.2 | `layout.tsx` | Import Roboto dari Google Fonts (`next/font/google`), replace Geist |
| 1.3 | `globals.css` | Add utility classes: `.card-hover`, `.btn-primary`, `.badge-stock` mirroring legacy CSS |
| 1.4 | `page.tsx` (Home) | Build Hero Carousel component (reuse Bootstrap-like logic or custom) |
| 1.5 | `layout.tsx` | Add Navbar & Footer components (client components) |

### 5.2 Phase 2: Real Images Integration (P0)

| Task | File(s) | Description |
|------|---------|-------------|
| 2.1 | `lib/images.ts` | Create image helper with curated Unsplash photo IDs per product |
| 2.2 | `prisma/seed.ts` | Update seed: set real image URLs for `ProductImage.url` (hero, card, gallery) |
| 2.3 | `products/page.tsx` | Render `p.image` dengan `<Image />` (Next.js), fallback placeholder |
| 2.4 | `products/[slug]/page.tsx` | Build image gallery: main + thumbnails, lazy load, `priority` pada gambar pertama |

### 5.3 Phase 3: PLP & PDP Polish (P0)

| Task | File(s) | Description |
|------|---------|-------------|
| 3.1 | `products/page.tsx` | Add search input (client), debounced fetch ke API `?q=` |
| 3.2 | `products/page.tsx` | Add pagination (Load More / Infinite Scroll) |
| 3.3 | `products/[slug]/page.tsx` | Add JSON-LD Product structured data |
| 3.4 | `products/[slug]/page.tsx` | Add OG meta tags via `generateMetadata` |
| 3.5 | `products/[slug]/page.tsx` | Show material, sizes dari product spec (extend schema/seed) |

### 5.4 Phase 4: Extended Schema for Rich PDP (P1)

Extend Prisma schema:
```prisma
model Product {
  // ...existing
  material    String?   // "Denim Katun Tebal"
  sizes       String?   // "S, M, L, XL"
  shopeeUrl   String?   // External link
}
```
Update seed & API response accordingly.

### 5.5 Phase 5: Cart Foundation (Milestone B — P1)

| Task | Description |
|------|-------------|
| 5.1 | Add `Cart`, `CartItem` models (guest session via cookie) |
| 5.2 | API: `POST /api/cart` (add), `PATCH /api/cart/:id` (update qty), `DELETE /api/cart/:id` |
| 5.3 | Client-side cart context (React Context + localStorage sync) |
| 5.4 | Cart drawer/sidebar UI, subtotal, quantity stepper |
| 5.5 | "Add to Cart" button di PDP & PLP card |

---

## 6. Updated File Structure (Target)

```
apps/web/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                    # Home + Hero Carousel
│  │  ├─ layout.tsx                  # Providers, Navbar, Footer, Fonts
│  │  ├─ globals.css                 # Tailwind + design tokens (legacy parity)
│  │  ├─ products/
│  │  │  ├─ page.tsx                 # PLP + Search + Pagination
│  │  │  └─ [slug]/page.tsx          # PDP + Gallery + JSON-LD + OG
│  │  └─ api/
│  │     ├─ products/route.ts        # List + search + pagination
│  │     └─ products/[slug]/route.ts # Detail
│  ├─ components/
│  │  ├─ ui/                         # Button, Card, Badge, Image, Carousel
│  │  ├─ layout/                     # Navbar, Footer, Container
│  │  ├─ product/                    # ProductCard, ProductGallery, ProductMeta
│  │  └─ home/                       # HeroCarousel, PromoBanner
│  ├─ lib/
│  │  ├─ images.ts                   # Image URL helpers + curated IDs
│  │  ├─ money.ts                    # formatIDR (existing)
│  │  └─ utils.ts                    # cn(), slugify, etc.
│  └─ hooks/
│     ├─ useCart.ts                  # Cart context (Phase 5)
│     └─ useDebounce.ts              # Search debounce
├─ public/
│  └─ favicon.ico
└─ prisma/ (di packages/db)
   ├─ schema.prisma                  # Extended dengan material, sizes, shopeeUrl
   └─ seed.ts                        # Real image URLs + extended fields
```

---

## 7. Acceptance Criteria (Definition of Done)

### 7.1 Visual Parity Checklist
- [ ] Background `#1c2130` di semua halaman
- [ ] Font Roboto (400, 700) di seluruh app
- [ ] Accent color `#007bff` untuk link, button, harga, active nav
- [ ] Card radius `10px` / `rounded-2xl`, hover `translateY(-5px)` + shadow
- [ ] Navbar fixed top, backdrop blur, logo putih (filter invert)
- [ ] Footer border-top `#3f4a5f`, icon IG & Shopee 2rem

### 7.2 Functional Checklist
- [ ] Home: Hero carousel 3 slide, auto-play 5s, manual nav, indicators
- [ ] PLP: Grid 1/2/3 kolom, card klik ke PDP, badge stock (green/red)
- [ ] PDP: Galeri gambar (main + thumb), info lengkap, tombol Shopee external
- [ ] Semua gambar load dari Unsplash/Pexels dengan ukuran tepat, lazy load
- [ ] Search di PLP berdebounce 300ms, hit API `?q=`
- [ ] Pagination Load More / Infinite Scroll di PLP
- [ ] SEO: meta title/desc, OG tags, JSON-LD Product di PDP
- [ ] Accessible: heading hierarchy, alt text, focus-visible, contrast

### 7.3 Performance Checklist
- [ ] LCP < 2.5s (hero image `priority`, preload)
- [ ] CLS < 0.1 (aspect-ratio boxes, reserved space)
- [ ] Images: Next.js `<Image />` dengan `sizes`, `placeholder="blur"`, `blurDataURL`
- [ ] Bundle size reasonable (no unused deps)

---

## 8. Curated Image IDs (Ready to Use)

### 8.1 Hero Carousel (Unsplash)
| Slide | Photo ID | Description |
|-------|----------|-------------|
| 1 | `1556742049007-bf3a2b7f1c4e` | Urban streetwear sale vibe |
| 2 | `1483985988355-763728e1935b` | Summer casual outfit |
| 3 | `1607082349566-187342175e2f` | Delivery/shipping concept |

### 8.2 Product Images (Unsplash — curated for indie streetwear)

| Produk | Card (400×300) | Gallery 1 (800×600) | Gallery 2 | Gallery 3 | Gallery 4 |
|--------|----------------|---------------------|-----------|-----------|-----------|
| Jaket Denim | `1551028719-00167b16eac5` | `1551028719-00167b16eac5` | `1521203319-4b8f0d2b8c3f` | `1591047139-8fdf874d4b8e` | `1620799140-8d9f2e4c1b3a` |
| Kaos Oversize | `1521572163-2b8f0d2b8c3f` | `1521572163-2b8f0d2b8c3f` | `1583743814-9e4f2d1c8b3a` | `1618932321-7f8e3d2c1b4a` | - |
| Topi Baseball | `1588850561-5c4f2e1d8b3a` | `1588850561-5c4f2e1d8b3a` | `1521369909-4e3f2d1c8b3a` | `1601924994-8f3e2d1c8b4a` | - |
| Hoodie | `1556821840-3e2d1c8b4a9f` | `1556821840-3e2d1c8b4a9f` | `1544022613-4f3e2d1c8b9a` | `1594938298-3e2d1c8b4a9f` | - |
| Celana Cargo | `1591195853-4f3e2d1c8b9a` | `1591195853-4f3e2d1c8b9a` | `1542272606-3e2d1c8b4a9f` | `1601924994-8f3e2d1c8b4a` | - |

> **Note**: IDs di atas adalah contoh. Saat implementasi, cari foto yang **benar-benar cocok** di Unsplash/Pexels lalu catat ID-nya. Gunakan `w=`, `h=`, `fit=crop`, `auto=format`, `q=80`.

---

## 9. Migration Notes: Legacy → Next.js

| Legacy Element | Next.js Implementation |
|----------------|------------------------|
| `index.html` hero carousel | `components/home/HeroCarousel.tsx` + `page.tsx` |
| `js/script.js` products array | `prisma/seed.ts` + API + `ProductCard` component |
| `product-card` CSS | Tailwind utility classes + `components/product/ProductCard.tsx` |
| Modal detail (Bootstrap) | `app/products/[slug]/page.tsx` (SSR) + `ProductGallery` |
| Navbar (Bootstrap) | `components/layout/Navbar.tsx` (client, fixed, backdrop-blur) |
| Footer (Bootstrap) | `components/layout/Footer.tsx` |
| `formatIDR` | `lib/money.ts` (existing) ✅ |

---

## 10. Timeline Estimation

| Phase | Scope | Estimasi |
|-------|-------|----------|
| Phase 1 | Visual Parity, Navbar, Footer, Hero Carousel | 2-3 hari |
| Phase 2 | Real Images, Seed Update, PLP/PDP Image Rendering | 2-3 hari |
| Phase 3 | PLP Search/Pagination, PDP SEO/JSON-LD, Extended Fields | 2-3 hari |
| Phase 4 | Schema Extension (material, sizes, shopeeUrl) + Seed | 1 hari |
| Phase 5 | Cart Foundation (Models, API, Context, UI) | 3-5 hari |
| **Total** | **Milestone A + B Foundation** | **10-15 hari** |

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigasi |
|------|--------|----------|
| Unsplash rate limit / hotlinking blocked | Gambar tidak load | Gunakan `images.unsplash.com` (resmi), set `Referrer-Policy: no-referrer`, fallback ke placeholder lokal |
| Next.js 16 breaking changes | Build error | Baca `node_modules/next/dist/docs/` sebelum coding, pakai `next dev --turbo` |
| SQLite vs PostgreSQL drift | Seed/prod mismatch | CI: run `db:migrate` + `db:seed` di PostgreSQL test container |
| Image CLS (layout shift) | Poor Core Web Vitals | Selalu set `width`/`height` atau `aspect-ratio` di container, gunakan `placeholder="blur"` |

---

## 12. Appendix: Legacy CSS Variables Reference

```css
/* Legacy color palette (dari style.css) */
--bg-primary: #1c2130;        /* Body, navbar, footer, sections */
--bg-card: #2a3140;           /* Product card, modal content */
--bg-border: #3f4a5f;         /* Borders, hr, navbar shadow */
--accent-primary: #007bff;    /* Links, buttons, price, active states */
--accent-hover: #0056b3;      /* Hover states */
--text-primary: #ffffff;      /* Headings, primary text */
--text-secondary: #cccccc;    /* Description, muted text */
--text-muted: #eeeeee;        /* Caption text */
--success: #28a745;           /* Stock badge (legacy green) */
--danger: #dc3545;            /* Out of stock badge */

/* Typography */
--font-family: 'Roboto', sans-serif;
--font-weight-normal: 400;
--font-weight-bold: 700;

/* Spacing & Radius */
--radius-card: 10px;
--radius-modal: 10px;
--transition-base: 0.3s ease;

/* Shadows */
--shadow-card: 0 2px 5px rgba(0,0,0,0.2);
--shadow-card-hover: 0 10px 20px rgba(0,0,0,0.3);
```

---

## 13. Next Steps (Action Items)

1. **Review PRD ini** — konfirmasi scope, priority, timeline
2. **Kumpulkan Image IDs** — browsing Unsplash/Pexels untuk 5 produk + 3 hero, catat photo ID
3. **Mulai Phase 1** — Update `globals.css`, `layout.tsx` (font Roboto), buat `Navbar`, `Footer`, `HeroCarousel`
4. **Setup Image Helper** — `lib/images.ts` dengan mapping ID
5. **Update Seed** — Jalankan `npm run db:seed` setelah image URL siap
6. **Iterate PLP/PDP** — Polish UI, tambah search, pagination, SEO

---

**Approval:**
- [ ] Product Owner
- [ ] Lead Developer
- [ ] Designer (jika ada)

---
*Dokumen ini akan di-update seiring progress implementasi.*