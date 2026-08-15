# Documentation

## Installation

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Site : http://localhost:3000  
Admin : http://localhost:3000/admin/login

## Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | Chemin SQLite Prisma (`file:./dev.db`) |
| `AUTH_SECRET` | Secret JWT (≥ 16 caractères) |
| `ADMIN_EMAIL` | E-mail admin (seed) |
| `ADMIN_PASSWORD` | Mot de passe admin (seed) |

## Fonctionnalités CRM

- **Offres** : nom, descriptions, prix CHF, durée, capacité, inclus, actif/featured
- **Saison** : dates ouverture/fermeture, horaires, jours fermés, capacité créneaux
- **Réservations** : statuts PENDING / CONFIRMED / CANCELLED / COMPLETED, paiement ON_SITE

## Arborescence

```
src/
  app/           # App Router (vitrine, résa, admin, API)
  components/    # UI
  lib/           # core
prisma/          # schema + seed
docs/            # documentation
assets/          # assets marque
```
