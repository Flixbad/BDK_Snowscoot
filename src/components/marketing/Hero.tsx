"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Snowfield } from "./Snowfield";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden alpine-gradient text-white">
      <Snowfield />
      <div className="noise-overlay absolute inset-0 z-[2]" />
      <div className="absolute inset-x-0 bottom-0 z-[2] h-[38vh] ridge bg-gradient-to-t from-ink via-ink/90 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-20 pt-32 md:px-8 md:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-glacier"
        >
          Crans-Montana · Tout l&apos;hiver
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1 }}
          className="font-display max-w-5xl text-[clamp(3.4rem,12vw,9.5rem)] leading-[0.88] tracking-tight"
        >
          BDK
          <span className="text-ice">_</span>
          SNOWCOOT
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.25 }}
          className="mt-6 max-w-xl text-lg text-white/80 md:text-xl"
        >
          La trottinette freestyle, version montagne. Remplace tes roues par des
          patins de ski et ride la neige sur le domaine de Crans-Montana.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link href="/reserver" className="btn-primary">
            Réserver une session
          </Link>
          <Link href="#concept" className="btn-ghost">
            Découvrir le concept
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
