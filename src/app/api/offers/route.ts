import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { offerSchema, slugify } from "@/lib/utils";

export async function GET() {
  const offers = await prisma.offer.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(offers);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = offerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const baseSlug = slugify(data.name);
    let slug = baseSlug;
    let i = 1;
    while (await prisma.offer.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`;
    }

    const offer = await prisma.offer.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        shortDescription: data.shortDescription,
        priceCents: data.priceCents,
        durationMinutes: data.durationMinutes,
        maxParticipants: data.maxParticipants,
        minAge: data.minAge ?? null,
        includes: JSON.stringify(data.includes),
        active: data.active,
        featured: data.featured,
        sortOrder: data.sortOrder,
      },
    });

    return NextResponse.json(offer, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
