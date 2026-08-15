# BDK_Snowscoot

Site vitrine + CRM pour l'activité **snowscoot freestyle** à **Crans-Montana**.

Trottinette freestyle dont les roues sont remplacées par des patins de ski — glisse sur le domaine skiable tout l'hiver. Paiement sur place.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + Framer Motion
- Prisma + SQLite
- Auth admin JWT (cookie httpOnly) + Zod

## Démarrage rapide

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

- Site : [http://localhost:3000](http://localhost:3000)
- Admin : [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Identifiants par défaut (à changer) : voir `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Fonctionnalités

### Vitrine
- Hero plein écran marque **BDK_SNOWCOOT**
- Concept ski × trott freestyle
- Offres dynamiques depuis le CRM
- Infos saison / lieu Crans-Montana
- Réservation de dates & créneaux

### CRM (`/admin`)
- CRUD offres (nom, description, prix, durée, capacité…)
- Saison : ouverture/fermeture, horaires, jours fermés, capacité
- Réservations : confirmer / annuler / terminer (paiement sur place)

## Scripts

| Commande | Action |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run db:setup` | Push schéma + seed |
| `npm run db:seed` | Re-seed admin & données |

## Licence

MIT — voir `LICENSE`.
