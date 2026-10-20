'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatIDR } from '@/lib/money';

type Order = {
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  items: { name: string; quantity: number; priceMinor: number }[];
};

const statusConfig: Record<string, { variant: 'warning' | 'accent' | 'success' | 'neutral' | 'danger'; label: string }> = {
  PENDING: { variant: 'warning', label: 'Menunggu Konfirmasi' },
  CONFIRMED: { variant: 'accent', label: 'Dikonfirmasi' },
  PACKED: { variant: 'accent', label: 'Dikemas' },
  SHIPPED: { variant: 'accent', label: 'Dikirim' },
  DELIVERED: { variant: 'success', label: 'Diterima' },
  CANCELLED: { variant: 'danger', label: 'Dibatalkan' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('loudwell-orders');
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch {
        setOrders([]);
      }
    }
    setLoading(false);
  }, []);

  const saveOrder = (order: Order) => {
    const existing = orders;
    const updated = [order, ...existing].slice(0, 50);
    setOrders(updated);
    localStorage.setItem('loudwell-orders', JSON.stringify(updated));
  };

  if (typeof window !== 'undefined') {
    (window as any).saveOrderToHistory = saveOrder;
  }

  if (loading) {
    return (
      <div className="min-h-full bg-bg-primary text-white">
        <main className="container py-16">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 w-1/4 skeleton rounded mb-4" />
                <div className="h-4 w-1/2 skeleton rounded" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-bg-primary text-white">
      <main className="container py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">Riwayat Pesanan</h1>
          <Link href="/products">
            <Button variant="outline">Belanja Lagi</Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="mx-auto w-20 h-20 rounded-full bg-accent-light flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7m12 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m12 0H6m10 0l-3-3m3 3l-3 3" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Belum Ada Pesanan</h2>
            <p className="text-white/60 mb-6">Mulai belanja untuk melihat riwayat pesanan di sini</p>
            <Link href="/products">
              <Button>Mulai Belanja</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || { variant: 'neutral' as const, label: order.status };
              return (
                <Link
                  key={order.orderNumber}
                  href={`/orders/${order.orderNumber}`}
                  className="block card-hover card p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-accent-light">
                        <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7m12 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m12 0H6m10 0l-3-3m3 3l-3 3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-white/60">Nomor Pesanan</p>
                        <p className="font-mono font-semibold text-white">{order.orderNumber}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:ml-auto">
                      <Badge variant={statusConfig[order.status]?.variant || 'neutral'}>
                        {statusConfig[order.status]?.label || order.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-white/60">Total</p>
                        <p className="font-semibold text-white">{formatIDR(order.total)}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-white/60">Tanggal</p>
                        <p className="text-sm text-white/70">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-bg-border flex items-center justify-between text-sm text-white/60">
                    <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    <span className="text-accent-primary font-medium">Lihat Detail</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  );
}