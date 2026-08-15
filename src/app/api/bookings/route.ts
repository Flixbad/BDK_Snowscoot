import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { bookingSchema } from "@/lib/utils";
import { getAvailabilityForDate } from "@/lib/availability";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const bookings = await prisma.booking.findMany({
    where: status ? { status } : undefined,
    include: { offer: true },
    orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
  });

  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const offer = await prisma.offer.findUnique({ where: { id: data.offerId } });
    if (!offer || !offer.active) {
      return NextResponse.json({ error: "Offre indisponible" }, { status: 400 });
    }

    if (data.participants > offer.maxParticipants) {
      return NextResponse.json(
        { error: `Maximum ${offer.maxParticipants} participants pour cette offre` },
        { status: 400 },
      );
    }

    const availability = await getAvailabilityForDate(data.date, data.offerId);
    if (!availability.ok) {
      return NextResponse.json(
        { error: "Date hors saison ou fermée" },
        { status: 400 },
      );
    }

    const slot = availability.slots.find((s) => s.time === data.timeSlot);
    if (!slot || !slot.available || slot.remaining < data.participants) {
      return NextResponse.json(
        { error: "Créneau complet ou indisponible" },
        { status: 409 },
      );
    }

    const booking = await prisma.booking.create({
      data: {
        offerId: data.offerId,
        date: data.date,
        timeSlot: data.timeSlot,
        customerName: data.customerName.trim(),
        customerEmail: data.customerEmail.trim().toLowerCase(),
        customerPhone: data.customerPhone.trim(),
        participants: data.participants,
        notes: data.notes?.trim() || null,
        status: "PENDING",
        paymentMethod: "ON_SITE",
      },
      include: { offer: true },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
