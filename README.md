# Taska & Tadika PAC website

The new website for Taska & Tadika PAC (日昇幼儿园), a Montessori nursery, kindergarten and childcare centre in Kota Kemuning, Shah Alam. It replaces the old WordPress site at www.taskapac.com.

- **Languages:** Bahasa Malaysia (`/ms`) and English (`/en`). Visitors to `/` are sent to their browser's language, and their choice is remembered.
- **Stack:**
  - Next.js 16.4 (App Router, Cache Components), TypeScript.
  - Tailwind CSS 4 and shadcn/ui.
  - The enquiry form uses a Server Action that sends email through Resend.
- **Design:** "Daybreak". 日昇 means rising sun, so the palette is indigo, sunrise gold, apricot and lilac. Headings use Petrona, body text uses Figtree. See `docs/phase-2/BRIEF.md`.

## Run it on your computer

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. To test the production build instead:

```bash
npm run build
npm start
```

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
- **Setup:** copy `.env.example` to `.env.local` and fill in the values. Without `RESEND_API_KEY` the form says the email wasn't sent: in development it reports success and logs a note, and in production it tells parents to WhatsApp instead.

## Deploy to Netlify

1. Push this folder to a GitHub repository. In Netlify, choose **Add new site, Import an existing project**, then pick the repository. `netlify.toml` already has the build settings.
2. In **Site configuration, Environment variables**, add the variables from `.env.example`.
3. In **Domain management**, add `www.taskapac.com` as the primary domain and `taskapac.com` as an alias that redirects to it. Netlify provides the HTTPS certificate.
4. Point the domain's DNS to Netlify (see `docs/LAUNCH-CHECKLIST.md`).

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

**Not yet done:** Lighthouse scores, automated Playwright tests and a full security review. These are Phase 5 in the brief.
