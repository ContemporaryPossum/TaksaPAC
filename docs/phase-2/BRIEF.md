# Phase 2 brief and design direction

Status: **waiting for approval** (26 Oct 2026). The facts come from `../phase-1/ANSWERS.md`.

## 1. The centre in one paragraph

Taska & Tadika PAC (日昇幼儿园) is a Montessori taska and tadika in Kota Kemuning, Shah Alam. Ms. Amy started it in 1999, and the tadika followed in 2007. It runs from two buildings on Jalan Anggerik Aranda: 31/34 (Taska) and 31/170C (Tadika). It's open Mon–Fri 6:30 am–7 pm and Sat 8 am–1 pm. It offers:
- Montessori Nursery (2–3).
- Montessori Kindergarten (4–6), with preparation for Standard One.
- A Full Montessori mixed-age class (2–6).
- Full-day childcare and day care.
- Enrichment (speech and drama, Mandarin, BM, science, art and music) and transport.

Contact: 016-272 9666, amypac2008@gmail.com. Registration is open May–Nov 2026.

## 2. Audience, goal and tone

- **Audience.** Malaysian parents of children aged 2–6, mostly on phones and comparing several centres in Kota Kemuning, Bukit Rimau and Shah Alam. Working parents who need 6:30 am–7 pm care and transport. Grandparents who drop off.
- **The one action.** Tap **WhatsApp** or **Book a visit**. Both sit in a sticky bar on mobile and close every page.
- **Tone.** Warm, calm, plain-spoken. Say what happens in the classroom, not what Montessori promises. No "best", "award-winning", "licensed" or "accredited" claims without proof. Short sentences, translated properly into BM, never word for word.
- **Trust signals we can use honestly:**
  - "Since 1999".
  - Two dedicated buildings.
  - Small groups.
  - Montessori materials.
  - Open 6:30 am–7 pm.
  - Women-owned, per the Google listing.

  Registration numbers, staff qualifications and testimonials wait until there's proof or real permission.

## 3. Three design directions

All three use rounded shapes, warm natural colours and slow, soft motion, and all pass WCAG AA (contrast ratios below were computed). The Chinese name is set in Noto Serif SC or Noto Sans SC, loading only the five characters it needs. All fonts are free Google Fonts, self-hosted at build time so visitors' browsers never contact Google.

### A. Daybreak: soft editorial *(recommended)*

The name 日昇 means "rising sun", so this direction is built on the colours of daybreak: a pre-dawn indigo, a sunrise gold and the apricot glow in between. It avoids the cream-paper-and-terracotta look that most "warm editorial" sites now share, and no other Kota Kemuning centre uses it.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| paper | `#FCF7F4` | page | n/a |
| ink | `#262347` | text | 14.0:1 |
| muted | `#5F5A7A` | secondary text | 6.1:1 |
| indigo | `#34307A` | buttons (white label), links | 11.4:1 (white on it), 10.7:1 (as text) |
| gold | `#F0B429` | the sun motif, highlights (dark text only, never text on paper) | ink on it 8.0:1 |
| apricot | `#FCE3CF` | warm panels | ink on it 12.0:1 |
| lilac | `#E6E2F5` | cool panels | ink on it 11.7:1 |

- **Type:** Petrona (warm humanist serif, variable weight) for headings, Figtree for body at 18px. Noto Serif SC for 日昇幼儿园.
- **Shapes:**
  - Arch-shaped photo masks, like a window or a rising sun (technique from the ERA Residence notes).
  - 24px card radius.
  - Hairline rules.
  - Small uppercase labels above sentence-style headings (the restraint from the Ollivere notes).
- **Motion:** content fades up 8px. Arch masks open slowly on scroll. Buttons lift 2px on hover. All of it turns off under reduced motion.
- **Photos:**
  - Natural window light, warm white balance.
  - Close crops of hands on Montessori materials.
  - The garden with its tree-stump seats.
  - Children only from behind or out of focus unless consent is on file.
- **Why I recommend it:**
  - It reads as calm and trustworthy to a comparing parent.
  - It suits the honest, founder-led story (since 1999).
  - It ties the Chinese name to a visual idea.
  - It stays fast because it uses no heavy effects.

### B. Garden Classroom: natural and organic

Wood, leaves and oat-coloured paper, echoing the Montessori material shelf and the centre's garden.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| surface | `#F4F0E6` | page | n/a |
| ink | `#23302A` | text | 12.1:1 |
| muted | `#5B665E` | secondary text | 5.3:1 |
| leaf | `#3D6B4B` | buttons (white label), links | 6.2:1 (white on it), 5.4:1 (as text) |
| wood | `#8A5A3B` | labels, icons | 5.1:1 |
| sky | `#CFE3E8` | soft panels | ink on it 10.4:1 |

- **Type:** Bricolage Grotesque (characterful, slightly quirky) for headings, Atkinson Hyperlegible for body.
- **Shapes:**
  - Pebble and leaf masks.
  - Gentle wavy section edges.
  - A faint paper grain.
  - Soft SVG leaf patterns.
- **Motion:** leaves drift a few pixels with the scroll (soft parallax), and cards fade in.
- **Photos:** wooden materials, plants, the outdoor play area, children's work laid flat on the floor.
- **Risk:** green-and-wood is a common look for Montessori schools, so it's less distinctive locally.

### C. Clay Play: gentle claymorphism

Soft, puffy cards and paper-cut stickers, with the playful collage energy from the SweetTape notes, toned down.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| surface | `#FFF9F2` | page | n/a |
| ink | `#2B2A4A` | text | 13.1:1 |
| muted | `#5D5B78` | secondary text | 6.2:1 |
| coral | `#FFB59A` | buttons (dark label) | 8.0:1 |
| brick | `#B64A33` | links, strong buttons (white label) | 5.2:1 |
| mint / butter | `#CDEBD9` / `#FFE7A3` | card fills | ink on them 10.8:1 / 11.2:1 |

- **Type:** Fredoka (rounded) for headings, Nunito for body.
- **Shapes:**
  - 32px puffy cards with a soft inner highlight and outer shadow.
  - Sticker-style icons.
  - Tape-strip photo frames.
- **Motion:** cards squish slightly on press, and stickers wobble once on hover.
- **Photos:** polaroid-style frames, scans of children's artwork (with consent).
- **Risk:** it can look "kiddy" rather than calm, and parents rather than children are the readers.

## 4. Sitemap

Proposed, with the brief's list trimmed to what has real content today:

| Page | EN path | BM path | Notes |
|---|---|---|---|
| Home | `/en` | `/ms` | Hero, Montessori in plain words, programme cards, enrichment strip, day timeline, hours and locations, FAQ, CTA |
| About and philosophy | `/en/about` | `/ms/tentang-kami` | Founder story since 1999, the two buildings, philosophy |
| Montessori curriculum | `/en/montessori-curriculum` | `/ms/kurikulum-montessori` | 6 areas with anchors (practical life, sensorial, maths, language, cultural, creative arts) |
| Programmes | `/en/programmes` | `/ms/program` | Overview by age |
| ↳ Nursery (2–3) | `/en/programmes/nursery` | `/ms/program/nurseri` | |
| ↳ Kindergarten (4–6) | `/en/programmes/kindergarten` | `/ms/program/tadika` | Standard One preparation, bridging |
| ↳ Full Montessori class (2–6) | `/en/programmes/full-montessori` | `/ms/program/montessori-penuh` | **New**: found through research, missing from the brief |
| ↳ Childcare and day care | `/en/programmes/childcare` | `/ms/program/jagaan-harian` | **Merged** full-day childcare and morning/afternoon day care (same hours and building) |
| Enrichment | `/en/enrichment` | `/ms/aktiviti-tambahan` | Speech and drama, Mandarin, BM, science, art and music; older classes as "ask us" |
| A day at PAC | `/en/a-day-at-pac` | `/ms/sehari-di-pac` | Work-cycle timeline, the tour video (after consent) |
| Admissions and fees | `/en/admissions` | `/ms/kemasukan` | Steps, `[FEE TO CONFIRM]`, what to bring, policy summary, **transport merged in here** |
| Book a visit | `/en/book-a-visit` | `/ms/lawatan` | Form plus WhatsApp |
| FAQ | `/en/faq` | `/ms/soalan-lazim` | |
| Contact | `/en/contact` | `/ms/hubungi` | Both addresses, hours, call, WhatsApp, map behind a click |
| Privacy notice (PDPA) | `/en/privacy` | `/ms/privasi` | **Added**: required for the form |

**Removed at launch:**
- **Gallery:** there are no consented photos yet, and an empty gallery hurts trust. The old gallery URLs will redirect to `/en/a-day-at-pac`. The gallery comes back when consented photos arrive.
- **Standalone Transport page:** no areas or prices are published yet, so transport lives on Admissions until there's enough to say.

`/` detects the browser language and sends visitors to `/en` or `/ms`, remembering their choice. It's the `x-default` in the hreflang tags, and every page links to its counterpart in the other language.

## 5. Languages

- Bahasa Malaysia and English at launch.
- 日昇幼儿园 sits beside the name in the logo lock-up, the footer and the schema.
- Mandarin (`/zh`) is structurally ready, but not launched until a native speaker reviews the copy. Machine-quality Chinese on a parent-facing site would cost trust.

## 6. Tech

| Choice | Why |
|---|---|
| Next.js (App Router) + TypeScript | As briefed. Mostly static pages, one server route for the form |
| Tailwind CSS v4 + shadcn/ui | As briefed. Tokens above become CSS variables |
| next-intl | Locale routing, hreflang, BM/EN message files that non-developers can edit |
| CSS + IntersectionObserver for motion | Covers fades, lifts and arch reveals, so no animation library is needed. Respects `prefers-reduced-motion` |
| Netlify (free plan) | Vercel's free Hobby plan is non-commercial only, and Pro is paid. Netlify's free plan allows a business site |
| Resend (free tier) for form email | Server-side validation, then an email to amypac2008@gmail.com. **No database, so no stored personal data.** Needs a free account in the owner's name |
| Cloudflare Turnstile + honeypot + rate limit | Spam protection without a cookie-heavy CAPTCHA |
| Map behind a click | Shows a static map and "Open in Google Maps" until the visitor opts in, so no Google cookies load by default |

## 7. What approving this means

1. **Pick a direction:** A (recommended), B or C. You can also mix, for example A's palette with B's leaf patterns.
2. **Sitemap:** approve, or add or remove pages.
3. **OK to install Node.js LTS** (free, via `winget`) on this machine. Phase 3 can't build without it.
4. **Accounts later:** the free Netlify and Resend accounts must be created in the owner's name. I can't create accounts, so these are needed before launch, not before building.
