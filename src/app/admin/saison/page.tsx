import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SeasonForm } from "@/components/admin/SeasonForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Saison" };

export default async function AdminSeasonPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const season = await prisma.seasonSettings.findUnique({
    where: { id: "default" },
  });

  if (!season) {
    return <p>Configuration saison manquante. Lance le seed.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-ink">Saison & horaires</h1>
        <p className="text-steel">
          Dates d&apos;ouverture/fermeture, horaires, capacité et infos contact.
        </p>
      </div>
      <SeasonForm season={season} />
    </div>
  );
}
