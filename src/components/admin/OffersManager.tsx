"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice, parseJsonArray } from "@/lib/utils";

export type AdminOffer = {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  priceCents: number;
  durationMinutes: number;
  maxParticipants: number;
  minAge: number | null;
  includes: string;
  active: boolean;
  featured: boolean;
  sortOrder: number;
};

const emptyForm = {
  name: "",
  description: "",
  shortDescription: "",
  priceChf: "89",
  durationMinutes: "120",
  maxParticipants: "6",
  minAge: "12",
  includesText: "",
  active: true,
  featured: false,
  sortOrder: "0",
};

export function OffersManager({ initialOffers }: { initialOffers: AdminOffer[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function loadOffer(offer: AdminOffer) {
    setEditingId(offer.id);
    setForm({
      name: offer.name,
      description: offer.description,
      shortDescription: offer.shortDescription,
      priceChf: String(offer.priceCents / 100),
      durationMinutes: String(offer.durationMinutes),
      maxParticipants: String(offer.maxParticipants),
      minAge: offer.minAge != null ? String(offer.minAge) : "",
      includesText: parseJsonArray(offer.includes).join("\n"),
      active: offer.active,
      featured: offer.featured,
      sortOrder: String(offer.sortOrder),
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      description: form.description,
      shortDescription: form.shortDescription,
      priceCents: Math.round(Number(form.priceChf) * 100),
      durationMinutes: Number(form.durationMinutes),
      maxParticipants: Number(form.maxParticipants),
      minAge: form.minAge === "" ? null : Number(form.minAge),
      includes: form.includesText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      active: form.active,
      featured: form.featured,
      sortOrder: Number(form.sortOrder),
    };

    try {
      const res = await fetch(
        editingId ? `/api/offers/${editingId}` : "/api/offers",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur");
        return;
      }
      resetForm();
      router.refresh();
    } catch {
      setError("Erreur réseau");
    } finally {
      setSaving(false);
    }
  }

  async function removeOffer(id: string) {
    if (!confirm("Supprimer cette offre ?")) return;
    await fetch(`/api/offers/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-4 border border-ink/10 bg-white p-6">
        <h2 className="font-display text-3xl text-ink">
          {editingId ? "Modifier l'offre" : "Nouvelle offre"}
        </h2>
        <div>
          <label className="label">Nom</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Accroche courte</label>
          <input
            className="input"
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            className="input min-h-28"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Prix (CHF)</label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.priceChf}
              onChange={(e) => setForm({ ...form, priceChf: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Durée (min)</label>
            <input
              className="input"
              type="number"
              value={form.durationMinutes}
              onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Max participants</label>
            <input
              className="input"
              type="number"
              value={form.maxParticipants}
              onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Âge min</label>
            <input
              className="input"
              type="number"
              value={form.minAge}
              onChange={(e) => setForm({ ...form, minAge: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="label">Inclus (1 ligne = 1 item)</label>
          <textarea
            className="input min-h-24"
            value={form.includesText}
            onChange={(e) => setForm({ ...form, includesText: e.target.value })}
          />
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Mise en avant
          </label>
          <div className="flex items-center gap-2">
            <span>Ordre</span>
            <input
              className="input w-20"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
          </div>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Enregistrement…" : editingId ? "Mettre à jour" : "Créer"}
          </button>
          {editingId && (
            <button type="button" className="text-sm font-semibold text-steel" onClick={resetForm}>
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {initialOffers.map((offer) => (
          <article key={offer.id} className="border border-ink/10 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-ink">{offer.name}</h3>
                <p className="text-sm text-steel">
                  {formatPrice(offer.priceCents)} · {offer.durationMinutes} min ·{" "}
                  {offer.active ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="flex gap-2 text-sm">
                <button
                  type="button"
                  className="font-semibold text-ice-deep"
                  onClick={() => loadOffer(offer)}
                >
                  Éditer
                </button>
                <button
                  type="button"
                  className="font-semibold text-danger"
                  onClick={() => void removeOffer(offer.id)}
                >
                  Suppr.
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
