"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";

type OfferOption = {
  id: string;
  name: string;
  priceCents: number;
  durationMinutes: number;
  maxParticipants: number;
};

type Slot = { time: string; remaining: number; available: boolean };

export function BookingForm({ offers }: { offers: OfferOption[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselected = searchParams.get("offer");

  const [offerId, setOfferId] = useState(preselected ?? offers[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [availabilityReason, setAvailabilityReason] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [participants, setParticipants] = useState(1);
  const [notes, setNotes] = useState("");

  const selectedOffer = useMemo(
    () => offers.find((o) => o.id === offerId),
    [offers, offerId],
  );

  useEffect(() => {
    if (!date || !offerId) {
      setSlots([]);
      return;
    }

    const run = async () => {
      setLoadingSlots(true);
      setTimeSlot("");
      setAvailabilityReason(null);
      try {
        const res = await fetch(
          `/api/availability?date=${date}&offerId=${offerId}`,
        );
        const data = await res.json();
        if (!data.ok) {
          setSlots([]);
          setAvailabilityReason(data.reason);
        } else {
          setSlots(data.slots);
        }
      } catch {
        setAvailabilityReason("error");
      } finally {
        setLoadingSlots(false);
      }
    };

    void run();
  }, [date, offerId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId,
          date,
          timeSlot,
          customerName,
          customerEmail,
          customerPhone,
          participants,
          notes: notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la réservation");
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="border border-ice/40 bg-ink p-8 text-white md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ice">
          Réservation enregistrée
        </p>
        <h2 className="font-display mt-3 text-4xl md:text-5xl">À BIENTÔT SUR LA NEIGE</h2>
        <p className="mt-4 max-w-lg text-white/70">
          Ta demande est en attente de confirmation. Paiement sur place le jour
          de la session. Tu seras contacté(e) par e-mail ou téléphone.
        </p>
        <button
          type="button"
          className="btn-primary mt-8"
          onClick={() => {
            setSuccess(false);
            setCustomerName("");
            setCustomerEmail("");
            setCustomerPhone("");
            setNotes("");
            setParticipants(1);
            setDate("");
            setTimeSlot("");
          }}
        >
          Nouvelle réservation
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 border border-ink/10 bg-white p-6 md:p-10">
      <div>
        <label className="label" htmlFor="offer">
          Offre
        </label>
        <select
          id="offer"
          className="input"
          value={offerId}
          onChange={(e) => setOfferId(e.target.value)}
          required
        >
          {offers.map((offer) => (
            <option key={offer.id} value={offer.id}>
              {offer.name} — {formatPrice(offer.priceCents)}
            </option>
          ))}
        </select>
        {selectedOffer && (
          <p className="mt-2 text-sm text-steel">
            {selectedOffer.durationMinutes} min · max {selectedOffer.maxParticipants}{" "}
            riders · paiement sur place
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="participants">
            Participants
          </label>
          <input
            id="participants"
            type="number"
            min={1}
            max={selectedOffer?.maxParticipants ?? 8}
            className="input"
            value={participants}
            onChange={(e) => setParticipants(Number(e.target.value))}
            required
          />
        </div>
      </div>

      <div>
        <p className="label">Créneau</p>
        {!date && (
          <p className="text-sm text-steel">Choisis d&apos;abord une date.</p>
        )}
        {loadingSlots && <p className="text-sm text-steel">Chargement…</p>}
        {availabilityReason && (
          <p className="text-sm text-danger">
            {availabilityReason === "out_of_season" && "Date hors saison."}
            {availabilityReason === "closed_day" && "Jour de fermeture."}
            {availabilityReason === "closed" && "Réservations fermées."}
            {availabilityReason === "offer_unavailable" && "Offre indisponible."}
            {availabilityReason === "error" && "Impossible de charger les créneaux."}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {slots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              disabled={!slot.available || slot.remaining < participants}
              onClick={() => setTimeSlot(slot.time)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                timeSlot === slot.time
                  ? "bg-ice text-ink"
                  : slot.available && slot.remaining >= participants
                    ? "bg-ink/5 text-ink hover:bg-ink/10"
                    : "cursor-not-allowed bg-ink/5 text-ink/30"
              }`}
            >
              {slot.time}
              <span className="ml-1 text-xs opacity-60">({slot.remaining})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Nom complet
          </label>
          <input
            id="name"
            className="input"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Téléphone
          </label>
          <input
            id="phone"
            className="input"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          className="input"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="notes">
          Notes (optionnel)
        </label>
        <textarea
          id="notes"
          className="input min-h-24"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && <p className="text-sm font-medium text-danger">{error}</p>}

      <button
        type="submit"
        className="btn-primary w-full disabled:opacity-60"
        disabled={submitting || !timeSlot}
      >
        {submitting ? "Envoi…" : "Confirmer la réservation"}
      </button>
    </form>
  );
}
