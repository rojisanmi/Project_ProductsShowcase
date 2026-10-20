import { prisma } from "@loudwell/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const OrderItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  priceMinor: z.number().int().positive(),
  quantity: z.number().int().positive(),
  image: z.string().url().nullable().optional(),
});

const CreateOrderSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(20).regex(/^[\d\s\-\+\(\)]+$/),
  email: z.string().email(),
  address: z.string().min(10).max(500),
  city: z.string().min(2).max(100),
  province: z.string().min(2).max(100),
  postalCode: z.string().regex(/^\d{5}$/),
  notes: z.string().max(1000).optional(),
  items: z.array(OrderItemSchema).min(1),
  subtotal: z.number().int().positive(),
  shippingCost: z.number().int().nonnegative(),
  total: z.number().int().positive(),
});

function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LWL-${dateStr}-${random}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Verify stock for each item
    const productIds = data.items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { inventory: true },
    });

    const productMap = new Map(products.map(p => [p.id, p]));
    const outOfStock: string[] = [];

    for (const item of data.items) {
      const product = productMap.get(item.productId);
      const available = product?.inventory?.quantity ?? 0;
      if (available < item.quantity) {
        outOfStock.push(`${item.name} (tersedia: ${available})`);
      }
    }

    if (outOfStock.length > 0) {
      return NextResponse.json(
        { error: "Stok tidak mencukupi", outOfStock },
        { status: 400 },
      );
    }

    // Create order with items and update inventory in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const orderNumber = generateOrderNumber();

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          status: "PENDING",
          customerName: data.name,
          customerPhone: data.phone,
          customerEmail: data.email,
          address: data.address,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode,
          notes: data.notes,
          subtotal: data.subtotal,
          shippingCost: data.shippingCost,
          total: data.total,
          currency: "IDR",
          paymentMethod: "COD",
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              name: item.name,
              priceMinor: item.priceMinor,
              quantity: item.quantity,
              image: item.image,
            })),
          },
        },
        include: { items: true },
      });

      // Decrease inventory
      for (const item of data.items) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json(
      { error: "Gagal membuat pesanan" },
      { status: 500 },
    );
  }
}