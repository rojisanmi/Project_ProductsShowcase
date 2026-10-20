import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface CheckoutSuccessPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: CheckoutSuccessPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Pesanan Berhasil — ${orderNumber}`,
    description: `Pesanan Anda ${orderNumber} telah dikonfirmasi. Kami akan segera memprosesnya.`,
  };
}

export default async function CheckoutSuccessPage({ params }: CheckoutSuccessPageProps) {
  const { orderNumber } = await params;

  return (
    <div className="min-h-full bg-bg-primary text-white">
      <main className="container py-20">
        <div className="text-center animate-fade-in">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-bg">
            <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-h1 text-white mb-2">Pesanan Berhasil Dibuat!</h1>
          <p className="text-body-lg text-white/70 mb-6">
            Terima kasih telah berbelanja di LOUDWELL. Pesanan Anda sedang diproses.
          </p>

          <div className="card p-6 mb-8 text-left max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60">Nomor Pesanan</span>
              <code className="text-lg font-mono font-semibold text-accent-primary bg-bg-primary px-3 py-1 rounded">
                {orderNumber}
              </code>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Status</span>
                <Badge variant="success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse mr-2" />
                  Menunggu Konfirmasi
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Metode Pembayaran</span>
                <span className="text-white">COD (Bayar di Tempat)</span>
              </div>
              <p className="text-white/50 text-xs mt-4">
                Simpan nomor pesanan ini untuk pelacakan. Tim kami akan menghubungi Anda via WhatsApp/telepon untuk konfirmasi pengiriman.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Link href="/products">
              <Button className="w-full sm:w-auto">
                Lanjut Belanja
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline" className="w-full sm:w-auto">
                Lihat Riwayat Pesanan
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}