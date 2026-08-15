import { SiteHeader } from "@/components/marketing/SiteHeader";
import { Hero } from "@/components/marketing/Hero";
import { Concept } from "@/components/marketing/Concept";
import { Offers } from "@/components/marketing/Offers";
import { Location } from "@/components/marketing/Location";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [offers, season] = await Promise.all([
    prisma.offer.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.seasonSettings.findUnique({ where: { id: "default" } }),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Concept />
        <Offers offers={offers} />
        <Location season={season} />
      </main>
      <SiteFooter email={season?.contactEmail} phone={season?.contactPhone} />
    </>
  );
}
