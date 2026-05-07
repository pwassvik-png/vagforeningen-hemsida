# Skogstorp-Gunntorps Samfällighetsförening — SITE.md

## Vision

En modern, professionell medlemsportal för Skogstorp-Gunntorps vägsamfällighetsförening med skandinavisk skogsdesign.

## Stitch Project

- **Project ID:** 2745131481204487279
- **Design System Asset:** assets/4d16c7fa51904478ab26c5fecb85b989

## Tech Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (PostgreSQL + Auth + Storage)
- Netlify (hosting)
- Resend (e-post)
- Leaflet (karta)

## Sitemap

- [x] `/` — Startsida (hero + features + om oss)
- [ ] `/login` — Inloggning
- [ ] `/dashboard` — Översikt
- [ ] `/dashboard/news` — Nyheter
- [ ] `/dashboard/issues` — Problemrapportering
- [ ] `/dashboard/documents` — Dokument
- [ ] `/dashboard/members` — Medlemsregister (admin/styrelse)
- [ ] `/dashboard/meetings` — Möten
- [ ] `/dashboard/fees` — Avgifter
- [ ] `/dashboard/maintenance` — Underhåll (admin/styrelse)
- [ ] `/dashboard/settings` — Inställningar (admin)

## Roadmap

1. Applicera Forest Road Design System på alla sidor
2. Bygga startsida med Stitch-genererad design
3. Style dashboard-layout (sidebar + topbar)
4. Style login-sida
5. Style alla undersidor

## Deployment

- **URL:** vagforeningen-hemsida.netlify.app
- **Repo:** pwassvik-png/vagforeningen-hemsida
- **Supabase:** llhvthhsasbzfrrpggbb (Stockholm)
- **Auto-deploy:** Push till main = deploy