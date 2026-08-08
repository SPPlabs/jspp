# 01_CLIENT_WEBSITE_SPEC.md — Client Website Architecture Specification

## 1. Project Overview & Objective
This specification defines the production requirements for building high-converting, modern client websites for businesses within the **SPP Labs** ecosystem. Every client website must be built using **Next.js (App Router)** and styled exclusively with **Tailwind CSS**. 

All client websites connect directly to the **SPP Labs CRM Dashboard** backend infrastructure via `https://api.spplabs.es`.

---

## 2. Mandatory Tech Stack Requirements
- **Framework:** Next.js (App Router - React 19+).
- **Styling:** Tailwind CSS (v4 / modern utility-first CSS).
- **Typography & Icons:** Google Fonts (`Inter`, `Outfit`, or `Roboto`) and Lucide React or Heroicons.
- **Data Fetching:** Native `fetch` with strict error boundary management, dynamic runtime configuration, and clean state updates.

---

## 3. Environment Variables Configuration (`.env.local` & Production `.env`)
Every client website repository must include a `.env.example` file (for repository documentation) and a `.env.local` file (for local development). Real API tokens must be supplied in the production `.env` file on the server.

```env
# Host domain for the SPP Labs CRM API Engine
NEXT_PUBLIC_SPPLABS_API_HOST=https://api.spplabs.es

# Registered business domain (identifies the client business in the CRM)
NEXT_PUBLIC_SPPLABS_DOMAIN=clientbusiness.com

# Public API Token issued from the SPP Labs CRM Dashboard (Format: spp_api_...)
NEXT_PUBLIC_SPPLABS_API_KEY=spp_api_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

> [!IMPORTANT]
> Next.js inlines `NEXT_PUBLIC_*` environment variables during build time (`npm run build`). Always pass these variables as `ARG`s in the Docker builder stage and `build.args` in `docker-compose.yml` so production builds embed the real API credentials.

---

## 4. Required Next.js App Router Structure
The AI Coder Agent must create and maintain the following folder hierarchy:

```
app/
├── layout.js                 # Global layout (Header, Footer, Analytics Tracker, Cookie Consent Banner)
├── page.js                   # Homepage / Hero section
├── servicios/
│   └── page.js               # Services / Products overview page
├── contacto/
│   └── page.js               # Contact form page (connected to SPP Labs API)
├── reservas/
│   └── page.js               # Interactive booking calendar page (connected to SPP Labs API)
├── politica-de-privacidad/
│   └── page.js               # GDPR / LOPDGDD Privacy Policy page
├── politica-de-cookies/
│   └── page.js               # Cookie & Web Storage inventory page
└── terminos-y-condiciones/
    └── page.js               # Terms and Conditions / Legal notice page
```

---

## 5. UI/UX & Tailwind CSS Styling Guidelines
- **Visual Quality:** Modern dark/light theme contrast, glassmorphism cards (`backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm`), smooth micro-interactions.
- **User Feedback:**
  - Active submission states (*loading spinners*, disabled buttons with `opacity-50 cursor-not-allowed`).
  - Clear success banners (`bg-emerald-950/80 border-emerald-800 text-emerald-200`).
  - Friendly error banners for network or validation failures (`bg-red-950/80 border-red-800 text-red-200`).
- **No Dummy Content:** Forms, calendars, and text sections must present clean, realistic business content.
