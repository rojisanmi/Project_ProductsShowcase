'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/Image';
import { formatIDR } from '@/lib/money';
import { IMAGE_SIZES } from '@/lib/images';
import { useCartStore } from '@/hooks/useCartStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart, closeCart } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = subtotal > 0 ? 15000 : 0;
  const total = subtotal + shipping;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email tidak valid';
    if (!formData.address.trim()) newErrors.address = 'Alamat lengkap wajib diisi';
    if (!formData.city.trim()) newErrors.city = 'Kota wajib diisi';
    if (!formData.province.trim()) newErrors.province = 'Provinsi wajib diisi';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Kode pos wajib diisi';
    else if (!/^\d{5}$/.test(formData.postalCode)) newErrors.postalCode = 'Kode pos harus 5 digit angka';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            priceMinor: item.priceMinor,
            quantity: item.quantity,
            image: item.image,
          })),
          subtotal,
          shippingCost: shipping,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat pesanan');
      }

      // Save to localStorage order history
      const orderHistory = {
        orderNumber: data.orderNumber,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        total,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          priceMinor: item.priceMinor,
        })),
      };

      const existing = localStorage.getItem('loudwell-orders');
      const orders = existing ? JSON.parse(existing) : [];
      orders.unshift(orderHistory);
      localStorage.setItem('loudwell-orders', JSON.stringify(orders.slice(0, 50)));

      clearCart();
      closeCart();
      router.push(`/checkout/success/${data.orderNumber}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-full bg-bg-primary text-white">
        <main className="container py-16">
          <div className="text-center animate-fade-in">
            <div className="mx-auto w-20 h-20 rounded-full bg-accent-light flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7m12 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m12 0H6m10 0l-3-3m3 3l-3 3" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Keranjang Kosong</h1>
            <p className="text-white/60 mb-6">Tambahkan produk ke keranjang sebelum checkout</p>
            <Link href="/products">
              <Button className="w-full sm:w-auto">Mulai Belanja</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-bg-primary text-white">
      <main className="container py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Ringkasan Pesanan</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative aspect-thumb w-16 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                      <OptimizedImage
                        src={item.image || '/images/placeholder-product.svg'}
                        alt={item.name}
                        fill
                        sizes={IMAGE_SIZES.thumb}
                        objectFit="cover"
                        fallbackType="thumb"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-xs text-white/50">{item.quantity} x {formatIDR(item.priceMinor)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-bg-border mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Subtotal</span>
                  <span className="text-white font-medium">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Ongkir</span>
                  <span className="text-white font-medium">{formatIDR(shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white border-t border-bg-border pt-3">
                  <span>Total</span>
                  <span>{formatIDR(total)}</span>
                </div>
                <p className="text-xs text-white/50 text-center">Pembayaran COD (Bayar di Tempat)</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-6 space-y-6" noValidate>
              <h2 className="text-xl font-semibold text-white">Informasi Pengiriman</h2>

              {submitError && (
                <div className="p-4 rounded-lg bg-danger-bg border border-danger text-danger-text text-sm animate-slide-up">
                  {submitError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="input-label">Nama Lengkap *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input ${errors.name ? 'input-error' : ''}`}
                    placeholder="Nama penerima"
                    disabled={isSubmitting}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && <p id="name-error" className="input-error-message">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="input-label">Nomor Telepon *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input ${errors.phone ? 'input-error' : ''}`}
                    placeholder="08xxxxxxxxxx"
                    disabled={isSubmitting}
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && <p id="phone-error" className="input-error-message">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="input-label">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input ${errors.email ? 'input-error' : ''}`}
                    placeholder="email@domain.com"
                    disabled={isSubmitting}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && <p id="email-error" className="input-error-message">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="input-label">Alamat Lengkap *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`textarea ${errors.address ? 'input-error' : ''}`}
                  placeholder="Jalan, RT/RW, Kelurahan, dll"
                  disabled={isSubmitting}
                  aria-invalid={errors.address ? 'true' : 'false'}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                />
                {errors.address && <p id="address-error" className="input-error-message">{errors.address}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="city" className="input-label">Kota *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`input ${errors.city ? 'input-error' : ''}`}
                    placeholder="Kota"
                    disabled={isSubmitting}
                    aria-invalid={errors.city ? 'true' : 'false'}
                    aria-describedby={errors.city ? 'city-error' : undefined}
                  />
                  {errors.city && <p id="city-error" className="input-error-message">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="province" className="input-label">Provinsi *</label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className={`input ${errors.province ? 'input-error' : ''}`}
                    placeholder="Provinsi"
                    disabled={isSubmitting}
                    aria-invalid={errors.province ? 'true' : 'false'}
                    aria-describedby={errors.province ? 'province-error' : undefined}
                  />
                  {errors.province && <p id="province-error" className="input-error-message">{errors.province}</p>}
                </div>

                <div>
                  <label htmlFor="postalCode" className="input-label">Kode Pos *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    maxLength={5}
                    className={`input ${errors.postalCode ? 'input-error' : ''}`}
                    placeholder="12345"
                    disabled={isSubmitting}
                    aria-invalid={errors.postalCode ? 'true' : 'false'}
                    aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
                  />
                  {errors.postalCode && <p id="postalCode-error" className="input-error-message">{errors.postalCode}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="input-label">Catatan (Opsional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="textarea"
                  placeholder="Instruksi pengiriman khusus, dll"
                  disabled={isSubmitting}
                />
              </div>

              <div className="pt-4 border-t border-bg-border">
                <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7m12 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m12 0H6m10 0l-3-3m3 3l-3 3" />
                  </svg>
                  Buat Pesanan COD — {formatIDR(total)}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link href="/products" className="link text-sm">← Lanjut Belanja</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}