import { prisma } from "@loudwell/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const QuerySchema = z.object({
  q: z.string().trim().min(1).max(80).optional(),
  take: z.coerce.number().int().min(1).max(60).optional(),
  skip: z.coerce.number().int().min(0).max(500).optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    q: url.searchParams.get("q") ?? undefined,
    take: url.searchParams.get("take") ?? undefined,
    skip: url.searchParams.get("skip") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { q, take = 24, skip = 0 } = parsed.data;

  const where = {
    isActive: true,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        inventory: true,
        category: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    items: items.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      priceMinor: p.priceMinor,
      currency: p.currency,
      image: p.images[0]?.url ?? null,
      inStock: (p.inventory?.quantity ?? 0) > 0,
      category: p.category ? { slug: p.category.slug, name: p.category.name } : null,
    })),
    total,
    take,
    skip,
  });
}