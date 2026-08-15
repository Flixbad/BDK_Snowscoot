"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type SeasonInfo = {
  seasonName: string;
  openingDate: string;
  closingDate: string;
  openTime: string;
  closeTime: string;
  meetingPoint: string;
  isOpen: boolean;
};

function formatFrDate(iso: string) {
  return new Intl.DateTimeFormat("fr-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}

export function Location({ season }: { season: SeasonInfo | null }) {
  return (
    <section id="lieu" className="relative overflow-hidden bg-snow py-24 md:py-32">
      <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-glacier/30 blur-3xl" />
      <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-ice/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2 md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ice-deep">
            Où rider
          </p>
          <h2 className="font-display mt-3 text-5xl leading-none text-ink md:text-7xl">
            CRANS-
            <br />
            MONTANA
          </h2>
          <p className="mt-6 text-lg text-ink/70">
            Au cœur de l&apos;aire de ski, tout l&apos;hiver. Point de rendez-vous
            communiqué à la confirmation — équipement fourni, paiement sur place.
          </p>
          <Link href="/reserver" className="btn-primary mt-8 inline-flex">
            Voir les disponibilités
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border border-ink/10 bg-white/70 p-8 backdrop-blur"
        >
          <dl className="space-y-6">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-steel">
                Saison
              </dt>
              <dd className="mt-1 text-2xl font-bold text-ink">
                {season?.seasonName ?? "Hiver"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-steel">
                Dates
              </dt>
              <dd className="mt-1 text-lg text-ink">
                {season
                  ? `${formatFrDate(season.openingDate)} → ${formatFrDate(season.closingDate)}`
                  : "À confirmer"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-steel">
                Horaires
              </dt>
              <dd className="mt-1 text-lg text-ink">
                {season ? `${season.openTime} – ${season.closeTime}` : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-steel">
                RDV
              </dt>
              <dd className="mt-1 text-lg text-ink">
                {season?.meetingPoint ?? "Crans-Montana"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-steel">
                Statut
              </dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                    season?.isOpen
                      ? "bg-ice/20 text-ice-deep"
                      : "bg-danger/15 text-danger"
                  }`}
                >
                  {season?.isOpen ? "Réservations ouvertes" : "Fermé temporairement"}
                </span>
              </dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
