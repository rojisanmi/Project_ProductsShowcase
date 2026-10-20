import Link from 'next/link';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-full bg-bg-primary text-white">
      <HeroCarousel />

      <main className="container py-10 md:py-16">
        <section className="grid gap-10 md:grid-cols-2 md:items-center animate-fade-in">
          <div>
            <h1 className="text-h1 text-white">
              Koleksi LOUDWELL.
              <span className="block text-white/70 font-normal">
                Minimal, tegas, dan nyaman dipakai sehari-hari.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-body-lg text-white/70">
              Temukan outfit indie premium yang mencerminkan gaya unikmu.
              Dari jaket denim iconic, kaos oversize nyaman, hingga aksesoris
              pelengkap penampilan sehari-hari.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Lihat Semua Produk
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Hubungi Kami
              </Button>
            </div>
          </div>

          <div className="card p-6 md:p-8">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="p-5 rounded-xl bg-bg-primary/50">
                <div className="text-sm text-white/60">Backend</div>
                <div className="mt-1 text-lg font-semibold text-white">Next.js API Routes</div>
                <div className="mt-2 text-sm text-white/70">
                  Endpoint katalog produk siap dipakai UI dengan pencarian & pagination.
                </div>
              </div>
              <div className="p-5 rounded-xl bg-bg-primary/50">
                <div className="text-sm text-white/60">Database</div>
                <div className="mt-1 text-lg font-semibold text-white">Prisma + PostgreSQL</div>
                <div className="mt-2 text-sm text-white/70">
                  Tipe data ketat, migrasi versi, dan seed data konsisten.
                </div>
              </div>
              <div className="col-span-2 p-5 rounded-xl bg-bg-primary/50">
                <div className="text-sm text-white/60">Roadmap</div>
                <div className="mt-1 text-lg font-semibold text-white">
                  Cart → Checkout COD → Admin Panel
                </div>
                <div className="mt-2 text-sm text-white/70">
                  Setelah katalog stabil, kita lanjut fitur e-commerce lengkap.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Trust Signals */}
        <section className="section" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">Keunggulan LOUDWELL</h2>
          <div className="grid-auto-fit">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L3 12l5.714-2.143L13 3z" />
                  </svg>
                ),
                title: 'Desain Original',
                desc: 'Setiap produk dirancang in-house dengan estetika indie yang khas.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Bahan Premium',
                desc: 'Menggunakan kain berkualitas tinggi untuk kenyamanan maksimal.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Gratis Ongkir',
                desc: 'Pengiriman gratis ke seluruh Indonesia untuk setiap pembelian.',
              },
            ].map((feature, index) => (
              <article
                key={index}
                className="card p-6 text-center hover:border-accent-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-light text-accent-primary group-hover:bg-accent-primary group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/60">{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}