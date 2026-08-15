"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { parseJsonNumberArray } from "@/lib/utils";

type Season = {
  seasonName: string;
  openingDate: string;
  closingDate: string;
  openTime: string;
  closeTime: string;
  closedWeekdays: string;
  slotDurationMinutes: number;
  maxBookingsPerSlot: number;
  meetingPoint: string;
  contactEmail: string;
  contactPhone: string;
  infoText: string;
  isOpen: boolean;
};

const WEEKDAYS = [
  { v: 0, l: "Dim" },
  { v: 1, l: "Lun" },
  { v: 2, l: "Mar" },
  { v: 3, l: "Mer" },
  { v: 4, l: "Jeu" },
  { v: 5, l: "Ven" },
  { v: 6, l: "Sam" },
];

export function SeasonForm({ season }: { season: Season }) {
  const router = useRouter();
  const [form, setForm] = useState({
    ...season,
    closedWeekdays: parseJsonNumberArray(season.closedWeekdays),
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggleDay(day: number) {
    setForm((prev) => ({
      ...prev,
      closedWeekdays: prev.closedWeekdays.includes(day)
        ? prev.closedWeekdays.filter((d) => d !== day)
        : [...prev.closedWeekdays, day],
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/season", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur");
        return;
      }
      setMessage("Saison mise à jour");
      router.refresh();
    } catch {
      setError("Erreur réseau");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4 border border-ink/10 bg-white p-6">
      <div>
        <label className="label">Nom de saison</label>
        <input
          className="input"
          value={form.seasonName}
          onChange={(e) => setForm({ ...form, seasonName: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Ouverture</label>
          <input
            type="date"
            className="input"
            value={form.openingDate}
            onChange={(e) => setForm({ ...form, openingDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Fermeture</label>
          <input
            type="date"
            className="input"
            value={form.closingDate}
            onChange={(e) => setForm({ ...form, closingDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Heure début</label>
          <input
            type="time"
            className="input"
            value={form.openTime}
            onChange={(e) => setForm({ ...form, openTime: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Heure fin</label>
          <input
            type="time"
            className="input"
            value={form.closeTime}
            onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Durée créneau (min)</label>
          <input
            type="number"
            className="input"
            value={form.slotDurationMinutes}
            onChange={(e) =>
              setForm({ ...form, slotDurationMinutes: Number(e.target.value) })
            }
            required
          />
        </div>
        <div>
          <label className="label">Capacité / créneau</label>
          <input
            type="number"
            className="input"
            value={form.maxBookingsPerSlot}
            onChange={(e) =>
              setForm({ ...form, maxBookingsPerSlot: Number(e.target.value) })
            }
            required
          />
        </div>
      </div>

      <div>
        <p className="label">Jours fermés</p>
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((d) => (
            <button
              key={d.v}
              type="button"
              onClick={() => toggleDay(d.v)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                form.closedWeekdays.includes(d.v)
                  ? "bg-danger/15 text-danger"
                  : "bg-ink/5 text-ink"
              }`}
            >
              {d.l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Point de rendez-vous</label>
        <input
          className="input"
          value={form.meetingPoint}
          onChange={(e) => setForm({ ...form, meetingPoint: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">E-mail contact</label>
          <input
            type="email"
            className="input"
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Téléphone</label>
          <input
            className="input"
            value={form.contactPhone}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <label className="label">Texte info réservation</label>
        <textarea
          className="input min-h-24"
          value={form.infoText}
          onChange={(e) => setForm({ ...form, infoText: e.target.value })}
          required
        />
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={form.isOpen}
          onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
        />
        Réservations ouvertes
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}
      {message && <p className="text-sm text-ice-deep">{message}</p>}
      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
