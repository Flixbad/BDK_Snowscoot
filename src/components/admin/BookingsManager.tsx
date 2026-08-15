"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

type BookingRow = {
  id: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  participants: number;
  notes: string | null;
  status: string;
  paymentMethod: string;
  offer: { name: string; priceCents: number };
};

const statuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const;

const statusLabel: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
  COMPLETED: "Terminée",
};

export function BookingsManager({ bookings }: { bookings: BookingRow[] }) {
  const router = useRouter();

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette réservation ?")) return;
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {bookings.length === 0 && (
        <p className="border border-ink/10 bg-white p-6 text-steel">
          Aucune réservation.
        </p>
      )}
      {bookings.map((b) => (
        <article key={b.id} className="border border-ink/10 bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-semibold text-ink">{b.customerName}</p>
              <p className="text-sm text-steel">
                {b.offer.name} · {formatPrice(b.offer.priceCents)} · paiement{" "}
                {b.paymentMethod === "ON_SITE" ? "sur place" : b.paymentMethod}
              </p>
              <p className="mt-1 text-sm text-ink">
                {b.date} à {b.timeSlot} · {b.participants} pers.
              </p>
              <p className="text-sm text-steel">
                {b.customerEmail} · {b.customerPhone}
              </p>
              {b.notes && (
                <p className="mt-2 text-sm italic text-ink/70">{b.notes}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="input w-auto"
                value={b.status}
                onChange={(e) => void updateStatus(b.id, e.target.value)}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel[s]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="text-sm font-semibold text-danger"
                onClick={() => void remove(b.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
