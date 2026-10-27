# Content still needed from the centre

Each item shows on the site as a yellow "to confirm" chip until it's filled in. Change the text in both `src/content/en.json` and `src/content/ms.json`. The sources for everything already on the site are in `docs/phase-1/ANSWERS.md`.

## Facts shown on the site

| Marker | Where it appears | What to send |
|---|---|---|
| `[FEES TO CONFIRM]` | Admissions, FAQ | Current fee sheet: registration, monthly fee per programme, materials, uniform, insurance, meals, enrichment, outings |
| `[SESSION TIMES TO CONFIRM]` | Nursery, Kindergarten, Full Montessori pages | Class start and end times for each programme |
| `[DAILY TIMETABLE TO CONFIRM]` | A day at PAC | A typical day with times |
| `[AGES TO CONFIRM]` | Childcare page, programme cards, FAQ | Which ages childcare and day care accept |
| `[HALAL STATUS AND DIETARY OPTIONS TO CONFIRM]` | Childcare page, FAQ | Whether meals are halal, and how special diets are handled |
| `[TRANSPORT AREAS AND FEES TO CONFIRM]` | Admissions, FAQ, Contact | Areas covered, cost, own van or a third party |
| `[REGISTRATION DOCUMENTS TO CONFIRM]` | Admissions | Documents parents bring to register |
| `[RETENTION PERIOD TO CONFIRM]` | Privacy notice | How long enquiry emails are kept, for example 12 months |

## Things to check, even though they're filled in

- **WhatsApp:** the site assumes 016-272 9666 is on WhatsApp. Send it one test message.
- **Hours:** Mon–Fri 6:30 am–7 pm, Sat 8 am–1 pm (from Google). Google also lists Saturday 9 am–1 pm as a second set of hours.
- **Registration window:** "May to November 2026", from Facebook. **This goes out of date after November 2026.** Update it in both language files (`common.registration`, `admissions.lead`, the FAQ) and in `site.ts`.
- **House rules:** the summary on Admissions comes from the 2013 rules. Compare it with the current parent handbook.
- **Founder story:** Ms. Amy, Taska from 1999 and Tadika from 2007, from a 2018 Kiddy123 interview. Check the wording.
- **Languages:** "Children learn English, Bahasa Malaysia and Mandarin".
- **Enrichment:** speech and drama, Mandarin, BM, science in English, and art and music are listed as current. Music Gym, gymnastics, swimming and e-learning appear as "ask us".
- **Montessori materials:** "suppliers in several countries, including India and the Netherlands" (2018).

## Waiting on proof (not on the site by design)

- **KPM registration:** the Tadika is registered as "Tadika Perkembangan Awal Cahaya", code B5A8837 (seen on CariSchools, 19 Oct 2026). Send the certificate to show it.
- **JKM registration for the Taska:** not found online. Send the certificate.
- **Qualifications:** the founder's and teachers' Montessori training and degrees.
- **What PAC stands for:** probably Perkembangan Awal Cahaya. Confirm before using it.

## Media

- **Logo:** a high-resolution or vector file. The site currently uses a redrawn sun mark with the name set in type.
- **Photos:** classroom, materials and garden. Children only with written parental consent. Each "Photo to come" arch describes what it needs.
- **Tour video:** written consent for everyone in it, then switch it on (README, "Turn on the video tour").
- **Parent feedback:** real quotes with permission, if a testimonials section is wanted.

## Translation

- Have a native BM speaker read `src/content/ms.json` before launch.
- Mandarin (`/zh`) is not built yet. The site structure supports adding it.
