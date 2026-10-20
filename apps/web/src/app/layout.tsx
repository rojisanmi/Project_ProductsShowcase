import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import { Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'LOUDWELL — Outfit Indie Premium',
    template: '%s | LOUDWELL',
  },
  description: 'Storefront LOUDWELL: katalog produk outfit indie premium, keranjang, dan checkout (COD) berbasis Next.js + Prisma.',
  keywords: ['LOUDWELL', 'outfit indie', 'streetwear', 'fashion', 'jaket denim', 'kaos oversize', 'hoodie', 'topi baseball', 'celana cargo'],
  authors: [{ name: 'LOUDWELL Team' }],
  creator: 'LOUDWELL',
  publisher: 'LOUDWELL',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://loudwell.com',
    siteName: 'LOUDWELL',
    title: 'LOUDWELL — Outfit Indie Premium',
    description: 'Koleksi outfit indie premium: jaket denim, kaos oversize, hoodie, topi baseball, celana cargo. Gratis ongkir seluruh Indonesia.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 628,
        alt: 'LOUDWELL Outfit Indie Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LOUDWELL — Outfit Indie Premium',
    description: 'Koleksi outfit indie premium dengan gaya minimal, tegas, dan nyaman.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#1c2130',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${roboto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}