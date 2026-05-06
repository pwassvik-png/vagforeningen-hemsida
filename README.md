# Skogstorp-Gunntorps Samfällighetsförening

Medlemsportal och hemsida för Skogstorp-Gunntorps vägsamfällighet.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + Supabase (PostgreSQL + Auth + Storage)
- **Hosting:** Vercel (frontend) + Supabase (backend)
- **E-post:** Resend (transaktionella e-post)
- **Karta:** Leaflet

## Funktioner

- 🔐 Inloggning med roller (admin/medlem)
- 👥 Medlemsregister med andelstal och avgifter
- 📰 Nyheter och kungörelser
- 🐛 Problemrapportering (vägskador, vegetation, etc.)
- 🗺️ Interaktiv karta över vägen
- 📄 Dokumenthantering (protokoll, stadgar, etc.)
- 💰 Avgiftshantering och debiteringslängd
- 🏛️ Årsmöteshantering (kallelse, dagordning, protokoll)
- 📧 E-postnotiser (via Resend)
- 🔧 Underhållsplanering
- 📱 Responsiv design (mobilvänlig)

## Komma igång

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000)

## Miljövariabler

Skapa `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend (e-post)
RESEND_API_KEY=re_xxx

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Projektstruktur

```
/app
  /(public)       # Publika sidor
  /(auth)         # Inloggning
  /(dashboard)    # Medlemsportal (skyddad)
  /api            # API-routes
/components       # Återanvändbara komponenter
/lib              # Hjälpare, Supabase-klienter
/supabase         # Migreringar och typer
/types            # TypeScript-typer
```

## Licens

Privat projekt för Skogstorp-Gunntorps Samfällighetsförening.