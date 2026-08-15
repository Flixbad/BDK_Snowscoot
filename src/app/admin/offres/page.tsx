import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OffersManager } from "@/components/admin/OffersManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Offres" };

export default async function AdminOffersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const offers = await prisma.offer.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-ink">Offres</h1>
        <p className="text-steel">
          Crée, modifie ou désactive tes formules (nom, prix, description…).
        </p>
      </div>
      <OffersManager initialOffers={offers} />
    </div>
  );
}
