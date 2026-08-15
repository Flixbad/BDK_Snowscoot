# Contribuer

## Setup local

1. Copier `.env.example` vers `.env`
2. `npm install`
3. `npm run db:setup`
4. `npm run dev`

## Conventions

- Messages de commit : `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- UI publique en français
- Ne jamais committer `.env` ni la base SQLite

## Architecture

- `src/app` — pages & API routes
- `src/components` — UI marketing / booking / admin
- `src/lib` — prisma, auth, disponibilités, validations
- `prisma` — schéma & seed
