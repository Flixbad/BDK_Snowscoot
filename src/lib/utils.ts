import { z } from "zod";

export const offerSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(4000),
  shortDescription: z.string().min(10).max(280),
  priceCents: z.number().int().min(0),
  durationMinutes: z.number().int().min(15).max(480),
  maxParticipants: z.number().int().min(1).max(30),
  minAge: z.number().int().min(0).max(99).nullable().optional(),
  includes: z.array(z.string().min(1).max(120)).default([]),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const seasonSchema = z.object({
  seasonName: z.string().min(2).max(120),
  openingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  closingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  openTime: z.string().regex(/^\d{2}:\d{2}$/),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/),
  closedWeekdays: z.array(z.number().int().min(0).max(6)).default([]),
  slotDurationMinutes: z.number().int().min(30).max(480),
  maxBookingsPerSlot: z.number().int().min(1).max(50),
  meetingPoint: z.string().min(3).max(240),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(6).max(40),
  infoText: z.string().min(5).max(1000),
  isOpen: z.boolean(),
});

export const bookingSchema = z.object({
  offerId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/),
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(6).max(40),
  participants: z.number().int().min(1).max(30),
  notes: z.string().max(1000).optional().nullable(),
});

export const bookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: "CHF",
  }).format(cents / 100);
}

export function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function parseJsonNumberArray(value: string): number[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.map(Number).filter((n) => Number.isFinite(n))
      : [];
  } catch {
    return [];
  }
}
