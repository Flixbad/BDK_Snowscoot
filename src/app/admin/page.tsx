import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [offersCount, pending, confirmed, season, recent] = await Promise.all([
    prisma.offer.count({ where: { active: true } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.seasonSettings.findUnique({ where: { id: "default" } }),
    prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { offer: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-ink">Dashboard</h1>
        <p className="text-steel">Bienvenue {session.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Offres actives", value: String(offersCount) },
          { label: "En attente", value: String(pending) },
          { label: "Confirmées", value: String(confirmed) },
          {
            label: "Saison",
            value: season?.isOpen ? "Ouverte" : "Fermée",
          },
        ].map((stat) => (
          <div key={stat.label} className="border border-ink/10 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-steel">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-4xl text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/offres" className="btn-primary">
          Gérer les offres
        </Link>
        <Link
          href="/admin/saison"
          className="inline-flex rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold"
        >
          Saison & horaires
        </Link>
        <Link
          href="/admin/reservations"
          className="inline-flex rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold"
        >
          Réservations
        </Link>
      </div>

      <section className="border border-ink/10 bg-white">
        <div className="border-b border-ink/10 px-5 py-4">
          <h2 className="font-semibold text-ink">Dernières réservations</h2>
        </div>
        <div className="divide-y divide-ink/5">
          {recent.length === 0 && (
            <p className="p-5 text-sm text-steel">Aucune réservation pour l&apos;instant.</p>
          )}
          {recent.map((b) => (
            <div
              key={b.id}
              className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-ink">{b.customerName}</p>
                <p className="text-sm text-steel">
                  {b.offer.name} · {b.date} {b.timeSlot} · {b.participants} pers.
                </p>
              </div>
              <div className="text-sm">
                <span className="font-medium">{formatPrice(b.offer.priceCents)}</span>
                <span className="ml-3 rounded-full bg-ink/5 px-2 py-1 text-xs font-bold">
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
