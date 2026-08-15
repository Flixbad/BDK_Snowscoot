import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingsManager } from "@/components/admin/BookingsManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Réservations" };

export default async function AdminBookingsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const bookings = await prisma.booking.findMany({
    include: { offer: true },
    orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-ink">Réservations</h1>
        <p className="text-steel">
          Confirme, annule ou marque comme terminée. Paiement sur place.
        </p>
      </div>
      <BookingsManager bookings={bookings} />
    </div>
  );
}
