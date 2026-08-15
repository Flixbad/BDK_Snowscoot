import { NextResponse } from "next/server";
import { getAvailabilityForDate } from "@/lib/availability";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const offerId = searchParams.get("offerId") ?? undefined;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  const availability = await getAvailabilityForDate(date, offerId);
  return NextResponse.json(availability);
}
