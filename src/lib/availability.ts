import { addMinutes, format, parse } from "date-fns";
import { prisma } from "@/lib/prisma";
import { parseJsonNumberArray } from "@/lib/utils";

export type TimeSlotAvailability = {
  time: string;
  remaining: number;
  available: boolean;
};

function generateSlots(openTime: string, closeTime: string, duration: number) {
  const slots: string[] = [];
  const base = parse(openTime, "HH:mm", new Date());
  const end = parse(closeTime, "HH:mm", new Date());
  let cursor = base;

  while (addMinutes(cursor, duration) <= end) {
    slots.push(format(cursor, "HH:mm"));
    cursor = addMinutes(cursor, duration);
  }

  return slots;
}

export async function getSeason() {
  return prisma.seasonSettings.findUnique({ where: { id: "default" } });
}

export async function getAvailabilityForDate(date: string, offerId?: string) {
  const season = await getSeason();
  if (!season || !season.isOpen) {
    return { ok: false as const, reason: "closed" as const, slots: [] as TimeSlotAvailability[] };
  }

  if (date < season.openingDate || date > season.closingDate) {
    return {
      ok: false as const,
      reason: "out_of_season" as const,
      slots: [] as TimeSlotAvailability[],
    };
  }

  const weekday = new Date(`${date}T12:00:00`).getDay();
  const closed = parseJsonNumberArray(season.closedWeekdays);
  if (closed.includes(weekday)) {
    return {
      ok: false as const,
      reason: "closed_day" as const,
      slots: [] as TimeSlotAvailability[],
    };
  }

  let maxParticipants = season.maxBookingsPerSlot;
  if (offerId) {
    const offer = await prisma.offer.findUnique({ where: { id: offerId } });
    if (!offer || !offer.active) {
      return {
        ok: false as const,
        reason: "offer_unavailable" as const,
        slots: [] as TimeSlotAvailability[],
      };
    }
    maxParticipants = Math.min(offer.maxParticipants, season.maxBookingsPerSlot);
  }

  const slots = generateSlots(
    season.openTime,
    season.closeTime,
    season.slotDurationMinutes,
  );

  const bookings = await prisma.booking.findMany({
    where: {
      date,
      status: { in: ["PENDING", "CONFIRMED"] },
      ...(offerId ? { offerId } : {}),
    },
  });

  const bySlot = new Map<string, number>();
  for (const booking of bookings) {
    bySlot.set(
      booking.timeSlot,
      (bySlot.get(booking.timeSlot) ?? 0) + booking.participants,
    );
  }

  const availability = slots.map((time) => {
    const used = bySlot.get(time) ?? 0;
    const remaining = Math.max(0, maxParticipants - used);
    return {
      time,
      remaining,
      available: remaining > 0,
    };
  });

  return { ok: true as const, reason: null, slots: availability, season };
}
