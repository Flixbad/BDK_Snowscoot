"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "#concept", label: "Concept" },
  { href: "#offres", label: "Offres" },
  { href: "#lieu", label: "Crans-Montana" },
  { href: "/reserver", label: "Réserver" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-ink/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="font-display text-2xl tracking-wide text-white md:text-3xl">
          BDK<span className="text-ice">_</span>SNOWCOOT
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/75 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/reserver" className="btn-primary text-sm md:text-base">
          Réserver
        </Link>
      </div>
    </header>
  );
}
