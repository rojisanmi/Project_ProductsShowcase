import { prisma } from "@loudwell/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const ParamsSchema = z.object({
  slug: z.string().trim().min(1).max(120),
});

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const params = await ctx.params;
  const parsed = ParamsSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid params", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const product = await prisma.product.findUnique({
    where: { slug: parsed.data.slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      inventory: true,
      category: true,
    },
  });

  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    priceMinor: product.priceMinor,
    currency: product.currency,
    images: product.images.map((img) => ({
      url: img.url,
      alt: img.alt,
      sortOrder: img.sortOrder,
    })),
    stockQty: product.inventory?.quantity ?? 0,
    category: product.category
      ? { slug: product.category.slug, name: product.category.name }
      : null,
    material: product.material,
    sizes: product.sizes,
    shopeeUrl: product.shopeeUrl,
  });
}