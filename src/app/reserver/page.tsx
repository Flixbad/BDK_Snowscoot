import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { BookingForm } from "@/components/booking/BookingForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Réserver" };

export default async function ReserverPage() {
  const [offers, season] = await Promise.all([
    prisma.offer.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        priceCents: true,
        durationMinutes: true,
        maxParticipants: true,
      },
    }),
    prisma.seasonSettings.findUnique({ where: { id: "default" } }),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="bg-snow pt-28 pb-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1fr_1.1fr] md:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ice-deep">
              Réservation
            </p>
            <h1 className="font-display mt-3 text-5xl leading-none text-ink md:text-7xl">
              BOOK TA
              <br />
              SESSION
            </h1>
            <p className="mt-5 max-w-md text-ink/70">
              Choisis l&apos;offre, la date et le créneau. Confirmation sous peu —
              paiement sur place uniquement.
            </p>
            {season && (
              <div className="mt-8 space-y-2 text-sm text-ink/65">
                <p>
                  <strong className="text-ink">Saison :</strong> {season.seasonName}
                </p>
                <p>
                  <strong className="text-ink">Ouverture :</strong>{" "}
                  {season.openingDate} → {season.closingDate}
                </p>
                <p>
                  <strong className="text-ink">Horaires :</strong> {season.openTime} –{" "}
                  {season.closeTime}
                </p>
                <p>
                  <strong className="text-ink">RDV :</strong> {season.meetingPoint}
                </p>
                <p className="pt-2 text-ink/80">{season.infoText}</p>
              </div>
            )}
            <Link href="/#offres" className="mt-8 inline-block text-sm font-semibold text-ice-deep">
              ← Voir les offres
            </Link>
          </div>

          {offers.length === 0 ? (
            <div className="border border-ink/10 bg-white p-8 text-ink/70">
              Aucune offre disponible pour le moment.
            </div>
          ) : (
            <Suspense fallback={<div className="p-8 text-steel">Chargement…</div>}>
              <BookingForm offers={offers} />
            </Suspense>
          )}
        </div>
      </main>
      <SiteFooter email={season?.contactEmail} phone={season?.contactPhone} />
    </>
  );
}
