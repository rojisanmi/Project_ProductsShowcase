# LOUDWELL Showcase (Fullstack)

Showcase untuk brand outfit **LOUDWELL** yang sedang di-upgrade dari landing page statis menjadi **aplikasi fullstack**: katalog produk dinamis, cart, dan checkout (COD/simulasi) dengan backend API dan database.

> Status saat ini: fondasi **Next.js** sudah di-*scaffold*. Backend/database dan fitur e-commerce sedang dikerjakan bertahap.

## Tujuan Proyek

- Menyajikan **storefront modern** (UI/UX rapi, cepat, mobile-first).
- Memindahkan data produk dari **hardcoded** (file JS) menjadi **database-driven**.
- Menyediakan **backend API** untuk katalog, cart, dan checkout.
- Menjadi basis untuk fitur kompleks lanjutan: promo/coupon, inventory rules, search lebih pintar, admin panel, dan analytics.

## Tech Stack

### Frontend

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**

### Backend

- **Next.js API Routes** (di dalam App Router)
- **Zod** (validasi request/response) *(planned)*

### Database

- **PostgreSQL** (development via Docker Compose)
- **Prisma ORM**

### Tooling

- **ESLint**
- **npm** (workspace/scripts di root)

## Struktur Folder

```
.
├─ index.html                 # versi lama (static site)
├─ css/                       # versi lama
├─ js/                        # versi lama (produk hardcoded)
├─ img/                       # aset lama
├─ apps/
│  └─ web/                    # Next.js app (UI + API)
└─ packages/
   └─ db/                     # Prisma schema + seed + prisma client
```

## Prasyarat

- **Node.js** (di mesin ini terdeteksi v24+) dan **npm**
- **Docker Desktop** (opsional tapi direkomendasikan) untuk menjalankan PostgreSQL via `docker-compose`

Jika `docker` belum tersedia di PATH, install Docker Desktop terlebih dulu atau siapkan PostgreSQL lokal.

## Konfigurasi Environment

Ada contoh environment di:

- Root: `.env.example`
- Web app: `apps/web/.env.local.example`

Minimal yang dibutuhkan:

```bash
DATABASE_URL="postgresql://loudwell:loudwell@localhost:5432/loudwell?schema=public"
```

Catatan:
- File `.env` sudah dibuat untuk kebutuhan development lokal. Jangan commit file `.env` bila repo ini nanti dipublish.

## Cara Menjalankan (Development)

### 1) Install dependencies

Di root project:

```bash
npm install
```

### 2) Jalankan database (PostgreSQL via Docker)

Di root project:

```bash
npm run db:up
```

Perintah yang tersedia:

- `npm run db:up` — start Postgres (background)
- `npm run db:down` — stop Postgres

### 3) Prisma migrate + seed

Setelah DB hidup dan `DATABASE_URL` benar:

```bash
npm run db:migrate
npm run db:seed
```

### 4) Jalankan web app

```bash
npm run dev
```

Lalu buka `http://localhost:3000`.

## Scripts Penting

Di root `package.json`:

- **dev**: `npm run dev` (menjalankan `apps/web`)
- **build**: `npm run build`
- **start**: `npm run start`
- **lint**: `npm run lint`
- **db:up / db:down**: kontrol PostgreSQL via Docker Compose
- **db:migrate / db:seed**: Prisma migrate & seed

## Roadmap Fitur (yang akan dibangun)

### Milestone A — Katalog Dinamis

- API:
  - `GET /api/products` (list + pagination + search dasar)
  - `GET /api/products/:slug` (detail)
- UI:
  - Home storefront + product listing (PLP)
  - Product detail (PDP) dengan galeri gambar
- Data dari Prisma + PostgreSQL (seed produk awal dari versi statis)

### Milestone B — Cart

- Guest cart (persist via cookie/session id)
- Add/update/remove cart item
- UI cart (subtotal, update qty)

### Milestone C — Checkout (COD / simulasi)

- Checkout form (alamat, catatan)
- Create order + order items
- Order detail + status timeline (created/packed/shipped/delivered/cancelled)

### Milestone Lanjutan (Kompleks)

- Promo/coupon + pricing rules
- Inventory rules (prevent oversell)
- Search lebih bagus (Postgres full-text)
- Admin panel (CRUD produk/stock/promo/order)
- Analytics events dan dashboard

## Catatan Migrasi dari Versi Lama

Versi lama tetap disimpan (`index.html`, `css/`, `js/`) sebagai referensi konten & styling. Namun sumber data produk akan dipindah ke database, dan UI akan dibangun ulang dengan Next.js + Tailwind.

> **Catatan Khusus**: Halaman beranda statis (`index.html`) telah disederhanakan dengan menghapus bagian "Tentang Kami" (*About Us*) dan "Hubungi Kami" (*Contact Us*). Saat membangun ulang UI di Next.js, Anda dapat mengikuti format yang lebih bersih ini (fokus pada promo dan katalog).

## Lisensi

Belum ditentukan (private/internal).

