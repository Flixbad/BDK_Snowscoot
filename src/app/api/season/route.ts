import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { seasonSchema } from "@/lib/utils";

export async function GET() {
  const season = await prisma.seasonSettings.findUnique({
    where: { id: "default" },
  });
  return NextResponse.json(season);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = seasonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const season = await prisma.seasonSettings.update({
      where: { id: "default" },
      data: {
        seasonName: data.seasonName,
        openingDate: data.openingDate,
        closingDate: data.closingDate,
        openTime: data.openTime,
        closeTime: data.closeTime,
        closedWeekdays: JSON.stringify(data.closedWeekdays),
        slotDurationMinutes: data.slotDurationMinutes,
        maxBookingsPerSlot: data.maxBookingsPerSlot,
        meetingPoint: data.meetingPoint,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        infoText: data.infoText,
        isOpen: data.isOpen,
      },
    });

    return NextResponse.json(season);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
