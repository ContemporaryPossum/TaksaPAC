# Taska & Tadika PAC website

The new website for Taska & Tadika PAC (日昇幼儿园), a Montessori nursery, kindergarten and childcare centre in Kota Kemuning, Shah Alam. It replaces the old WordPress site at www.taskapac.com.

- **Languages:** Bahasa Malaysia (`/ms`) and English (`/en`). Visitors to `/` are sent to their browser's language, and their choice is remembered.
- **Stack:**
  - Next.js 16.4 (App Router, every page statically generated), TypeScript.
  - Tailwind CSS 4 and shadcn/ui.
  - The enquiry form uses a Server Action that sends email through Resend.
- **Hosting:** Cloudflare Workers, through the OpenNext adapter (`@opennextjs/cloudflare`).
- **Design:** "Daybreak". 日昇 means rising sun, so the palette is indigo, sunrise gold, apricot and lilac. Headings use Petrona, body text uses Figtree. See `docs/phase-2/BRIEF.md`.

## Run it on your computer

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. To test the plain Next.js production build:

```bash
npm run build:next
npm start
```

To test the real Cloudflare build in Cloudflare's local runtime (workerd), at http://localhost:8787:

```bash
npm run preview
```

`npm run build` produces the Cloudflare bundle in `.open-next/`. It runs `next build` first, then the OpenNext adapter. OpenNext warns that Windows isn't fully supported. It built and ran fine on Windows here, and Cloudflare's own build machines run Linux.

## Edit text

All words on the site live in two files, one per language. Keep them in step: the build fails if the BM file is missing a key that the English file has.

| What | Where |
|---|---|
| English text | `src/content/en.json` |
| Bahasa Malaysia text | `src/content/ms.json` |
| Phone, email, addresses, hours, Facebook, video | `src/content/site.ts` |

Text in square brackets, such as `[FEES TO CONFIRM]`, shows on the site as a yellow "to confirm" chip. Replace the whole bracket, brackets included, with the real fact once the centre confirms it. `docs/CONTENT-CHECKLIST.md` lists every one.

## Add photos

1. Only use photos the centre supplies. Children must not be identifiable unless the centre has **written parental consent** for that photo.
2. Put the file in `public/photos/`, for example `public/photos/garden.jpg`. Use JPG or WebP, around 1600 px wide. The site resizes and compresses it automatically.
3. Where a page shows a "Photo to come" arch, pass the file to it, for example in `src/app/[lang]/page.tsx`:

   ```tsx
   <ArchPhoto src="/photos/garden.jpg" caption={h.photo} placeholderLabel={t.common.photoToCome} priority />
   ```

   The caption text becomes the photo's alt text, so make sure it describes the photo.

## Turn on the video tour

The 2020 tour video on YouTube shows children's faces, so it's switched off. Once the centre confirms written consent from every family in it, set `tourVideo.enabled` to `true` in `src/content/site.ts`. It then appears on "A day at PAC" as a privacy-enhanced YouTube player that loads only when clicked, with captions on.

## The booking form

Requests are checked on the server and then emailed to the centre. Nothing is stored in a database.

- **Spam protection:**
  - A hidden honeypot field.
  - A minimum fill time.
  - A per-connection rate limit.
  - Optionally, Cloudflare Turnstile.
- **Data minimisation:** the form never asks for a child's name, MyKid number or medical details.
- **Setup:** for local testing, copy `.env.example` to `.env.local` and fill in the values. On Cloudflare, see the next section. Without `RESEND_API_KEY` the form says the email wasn't sent: in development it reports success and logs a note, and in production it tells parents to WhatsApp instead.

## Deploy to Cloudflare

The Worker **taksapac** is connected to the GitHub repository ContemporaryPossum/TaksaPAC. Every push to `main` builds and deploys automatically, using the dashboard's default commands:

| Setting (Workers & Pages → taksapac → Settings → Builds) | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Files that make this work:

- `wrangler.jsonc`: the Worker name (`taksapac`, which must match the dashboard), the entry file `.open-next/worker.js` and the static assets.
- `open-next.config.ts`: serves the prerendered pages from Workers static assets. No R2 bucket or KV namespace is needed.
- `public/_headers`: long-term caching for build files and fonts.

**Email and spam keys.** Set these in **Workers & Pages → taksapac → Settings**:

| Name | Where | Type |
|---|---|---|
| `RESEND_API_KEY` | Variables and secrets | Secret |
| `RESEND_FROM` | Variables and secrets | Text |
| `ENQUIRY_TO` | Variables and secrets | Text (optional, defaults to amypac2008@gmail.com) |
| `TURNSTILE_SECRET_KEY` | Variables and secrets | Secret (optional) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Builds → Variables and secrets | Build variable (optional). It's baked into the page at build time |

`keep_vars` in `wrangler.jsonc` keeps dashboard variables in place on every deploy. After adding variables, redeploy by pushing a commit, or use **Deployments → Retry build**.

**Custom domain.** In **Workers & Pages → taksapac → Settings → Domains & Routes → Add → Custom domain**, add `www.taskapac.com`. The domain's DNS must be on Cloudflare (see `docs/LAUNCH-CHECKLIST.md`).

**What the site needs at runtime:**
- The language routing and old-URL redirects live in `src/proxy.ts`. OpenNext runs Next.js 16's proxy on Workers, and labels this support "experimental".
- If a future Next or OpenNext update breaks it, rename `src/proxy.ts` to `src/middleware.ts` and its function from `proxy` to `middleware`. The code only uses standard web APIs.
- Pages are fully static. Next's Cache Components feature is off because the static-assets cache doesn't support `"use cache"`.

## Old website addresses

`src/proxy.ts` handles every old WordPress URL, using the map in `src/lib/legacy.ts`:
- Old pages such as `/?page_id=5` get a permanent (301) redirect to the matching new page.
- Old gallery pages go to "A day at PAC".
- Old media files (`/wp-content/...`), feeds and WordPress admin addresses return **410 Gone**, so search engines drop the old photos of children.

The full audited list is `docs/phase-1/redirects.csv`.

## Project map

```
src/
  app/
    [lang]/            one folder per page; [lang] is "en" or "ms"
    sitemap.ts, robots.ts, icon.svg
  components/          header, footer, cards, form, embeds
  components/ui/       shadcn/ui components, sized for touch
  content/             en.json, ms.json, site.ts  ← edit these
  lib/                 language routes, dictionary, form action, old-URL map
  proxy.ts             language detection, BM addresses, old-URL redirects
docs/
  phase-1/             audit of the old site and online research
  phase-2/             brief and design directions
  CONTENT-CHECKLIST.md facts still needed from the centre
  LAUNCH-CHECKLIST.md  steps to go live
```

BM pages have BM addresses (for example `/ms/tentang-kami`). The proxy maps them onto the English-named folders, and `src/lib/i18n.ts` holds the table.

## Checks done (27 October 2026)

- `npm run build`: all 52 routes prerender without errors. ESLint and TypeScript pass.
- **Routing:** language detection, BM addresses and the BM↔EN switch work. All old-URL types redirect or return 410. Unknown pages return 404.
- **Phone, tablet and desktop:** pages checked at 390, 768 and 1440 px wide, with no sideways scrolling and no console errors.
- **Accessibility basics:**
  - Body text is 18 px and tap targets are at least 44 px.
  - Every colour pair passes WCAG AA.
  - There's a skip link and visible focus outlines.
  - The mobile menu closes with Esc and returns focus to the menu button.
  - Animations are off when "reduce motion" is set.
- **Booking form:**
  - Server-side errors appear in a summary at the top and next to each field.
  - Answers are kept after an error.
  - The email path is not tested yet, because it needs a real Resend key.

- **Cloudflare build:** `npm run build` (OpenNext) completes. On the local Workers runtime:
  - All pages load in both languages.
  - BM addresses, old-URL redirects, 410s and 404s work.
  - Security headers and the language cookie are present.
  - The booking form's server code runs: it validates and reaches the email step.

**Not yet done:** Lighthouse scores, automated Playwright tests and a full security review. These are Phase 5 in the brief.
