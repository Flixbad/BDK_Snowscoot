"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Ta trott",
    text: "Une base freestyle solide, faite pour le contrôle et le style.",
  },
  {
    n: "02",
    title: "Les patins",
    text: "On remplace les roues par des patins de ski — ready pour la poudre.",
  },
  {
    n: "03",
    title: "La montagne",
    text: "Tu glisses sur le domaine de Crans-Montana, coaching inclus.",
  },
];

export function Concept() {
  return (
    <section id="concept" className="relative bg-snow py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ice-deep">
            Le concept
          </p>
          <h2 className="font-display mt-3 text-5xl leading-none text-ink md:text-7xl">
            SKI × TROTT
            <br />
            <span className="text-steel">FREESTYLE</span>
          </h2>
          <p className="mt-6 text-lg text-ink/70 md:text-xl">
            Le snowscoot, c&apos;est l&apos;hybride qui claque : sensations de ski,
            attitude trottinette, terrain montagne. Pas de forfait de ski
            traditionnel — juste toi, la glisse, et la vibe freestyle.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.article
              key={step.n}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              className="border-t-2 border-ink pt-6"
            >
              <p className="font-display text-4xl text-ice-deep">{step.n}</p>
              <h3 className="mt-4 text-2xl font-bold text-ink">{step.title}</h3>
              <p className="mt-3 text-ink/65">{step.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
