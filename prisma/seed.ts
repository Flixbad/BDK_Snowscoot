import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@bdk-snowscoot.ch";
  const password = process.env.ADMIN_PASSWORD ?? "BDKadmin2026!";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name: "BDK Admin" },
    create: {
      email,
      passwordHash,
      name: "BDK Admin",
    },
  });

  await prisma.seasonSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      seasonName: "Hiver 2025-2026",
      openingDate: "2025-12-06",
      closingDate: "2026-04-12",
      openTime: "09:00",
      closeTime: "16:30",
      closedWeekdays: "[]",
      slotDurationMinutes: 120,
      maxBookingsPerSlot: 8,
      meetingPoint: "Crans-Montana — point rendez-vous domaine skiable",
      contactEmail: "hello@bdk-snowscoot.ch",
      contactPhone: "+41 79 000 00 00",
      infoText:
        "Paiement exclusivement sur place (espèces ou carte). Casque et brief sécurité inclus.",
      isOpen: true,
    },
  });

  const offers = [
    {
      name: "Initiation Snowscoot",
      slug: "initiation-snowscoot",
      shortDescription:
        "Découvre le freestyle sur neige : patins à la place des roues, sensations garanties.",
      description:
        "Session d'initiation idéale pour découvrir le snowscoot à Crans-Montana. Brief sécurité, matériel fourni, et coaching sur piste pour apprendre à glisser, freiner et prendre du plaisir en montagne.",
      priceCents: 8900,
      durationMinutes: 120,
      maxParticipants: 6,
      minAge: 12,
      includes: JSON.stringify([
        "Snowscoot + patins",
        "Casque",
        "Brief sécurité",
        "Coaching initiation",
      ]),
      featured: true,
      sortOrder: 1,
    },
    {
      name: "Session Freestyle",
      slug: "session-freestyle",
      shortDescription:
        "Pour riders déjà à l'aise : lines, carves et freestyle sur le domaine.",
      description:
        "Session avancée pour rider qui veut pousser le style. On enchaîne les lines sur le domaine de Crans-Montana avec coaching freestyle, tips de carves et sessions filmées si conditions ok.",
      priceCents: 11900,
      durationMinutes: 150,
      maxParticipants: 4,
      minAge: 14,
      includes: JSON.stringify([
        "Matériel snowscoot pro",
        "Casque",
        "Coaching freestyle",
        "Accès domaine (hors forfait)",
      ]),
      featured: true,
      sortOrder: 2,
    },
    {
      name: "Privatisé Groupe / Famille",
      slug: "prive-groupe-famille",
      shortDescription:
        "Créneau privé pour amis ou famille — jusqu'à 8 riders, rythme sur mesure.",
      description:
        "Réserve un créneau privé pour ton crew. Parfait pour un enterrement de vie de jeune fille/garçon, une sortie famille ou un team building d'hiver. Coach dédié, rythme adapté, souvenirs assurés.",
      priceCents: 34900,
      durationMinutes: 180,
      maxParticipants: 8,
      minAge: 10,
      includes: JSON.stringify([
        "Créneau privé",
        "Matériel pour le groupe",
        "Coach dédié",
        "Brief + photos souvenir",
      ]),
      featured: false,
      sortOrder: 3,
    },
  ];

  for (const offer of offers) {
    await prisma.offer.upsert({
      where: { slug: offer.slug },
      update: offer,
      create: offer,
    });
  }

  console.log("Seed OK");
  console.log(`Admin: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
