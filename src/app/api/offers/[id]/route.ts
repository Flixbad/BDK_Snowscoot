import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { offerSchema, slugify } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = offerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const existing = await prisma.offer.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
    }

    const data = parsed.data;
    let slug = existing.slug;
    if (data.name !== existing.name) {
      const baseSlug = slugify(data.name);
      slug = baseSlug;
      let i = 1;
      while (
        await prisma.offer.findFirst({
          where: { slug, NOT: { id } },
        })
      ) {
        slug = `${baseSlug}-${i++}`;
      }
    }

    const offer = await prisma.offer.update({
      where: { id },
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

    return NextResponse.json(offer);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.offer.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Impossible de supprimer (réservations liées ?)" },
      { status: 400 },
    );
  }
}
