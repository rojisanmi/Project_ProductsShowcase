'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/hooks/useCartStore';

const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/products', label: 'Produk' },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[var(--z-fixed)] glass-strong border-b border-bg-border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-lg p-1 -ml-1"
            aria-label="LOUDWELL - Home"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center" aria-hidden="true">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="text-xs text-white/60 tracking-wider uppercase">LOUDWELL</div>
              <div className="text-sm font-bold text-white">Outfit Indie Premium</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    ? 'bg-accent-light text-accent-primary'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="hidden sm:inline-flex btn btn-primary btn-sm"
            >
              Belanja Sekarang
            </Link>

            <button
              onClick={openCart}
              className="relative btn btn-icon btn-ghost glass"
              aria-label={`Keranjang belanja${totalItems > 0 ? `, ${totalItems} item` : ', kosong'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7m12 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m12 0H6m10 0l-3-3m3 3l-3 3" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[18px] rounded-full bg-accent-primary text-xs font-semibold text-white flex items-center justify-center px-1.5 animate-scale-in">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}