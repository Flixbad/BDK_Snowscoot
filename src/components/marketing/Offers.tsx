"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice, parseJsonArray } from "@/lib/utils";

export type OfferCardData = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  priceCents: number;
  durationMinutes: number;
  maxParticipants: number;
  minAge: number | null;
  includes: string;
  featured: boolean;
};

export function Offers({ offers }: { offers: OfferCardData[] }) {
  return (
    <section id="offres" className="bg-ink py-24 text-white md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ice">
              Offres
            </p>
            <h2 className="font-display mt-3 text-5xl leading-none md:text-7xl">
              CHOISIS TA
              <br />
              SESSION
            </h2>
          </div>
          <p className="max-w-md text-white/65">
            Prix adaptés à Crans-Montana. Paiement sur place le jour J —
            tu réserves juste ton créneau en ligne.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {offers.map((offer, index) => {
            const includes = parseJsonArray(offer.includes);
            return (
              <motion.article
                key={offer.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                className={`flex flex-col border p-7 ${
                  offer.featured
                    ? "border-ice bg-white/[0.04]"
                    : "border-white/15 bg-transparent"
                }`}
              >
                {offer.featured && (
                  <span className="mb-4 w-fit text-xs font-bold uppercase tracking-wider text-ice">
                    Populaire
                  </span>
                )}
                <h3 className="font-display text-3xl leading-none">{offer.name}</h3>
                <p className="mt-4 flex-1 text-white/70">{offer.shortDescription}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-4xl text-ice">
                    {formatPrice(offer.priceCents)}
                  </span>
                  <span className="text-sm text-white/50">
                    / {offer.durationMinutes} min
                  </span>
                </div>
                <ul className="mt-5 space-y-2 text-sm text-white/65">
                  {includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-ice">▸</span>
                      {item}
                    </li>
                  ))}
                  {offer.minAge != null && (
                    <li className="flex gap-2">
                      <span className="text-ice">▸</span>
                      Dès {offer.minAge} ans
                    </li>
                  )}
                  <li className="flex gap-2">
                    <span className="text-ice">▸</span>
                    Max {offer.maxParticipants} riders
                  </li>
                </ul>
                <Link
                  href={`/reserver?offer=${offer.id}`}
                  className="btn-primary mt-8 w-full"
                >
                  Réserver
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
