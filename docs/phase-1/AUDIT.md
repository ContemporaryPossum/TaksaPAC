# Phase 1 audit: taskapac.com

Crawled 26 October 2026. Audit only: nothing from the old design is reused.

Files in this folder:

| File | What it holds |
|---|---|
| `AUDIT.md` | This report: findings, copy fixes, conflicts, questions |
| `pages.csv` | All 107 public URLs (101 pages, 2 posts, 4 album-only galleries) with a keep/rewrite/drop call and a proposed new URL |
| `redirects.csv` | 110-row 301/410 map from every old URL |
| `gallery-albums.csv` | 86 gallery entries with year, photo count, duplicates |
| `images.csv` | 2,343 images: 2,296 gallery photos, 38 media-library files, 9 theme files |

## 1. Summary

- The site is WordPress 5.8.18 with a 2012 custom theme. It has **101 pages, but only 19 carry real content**. The other 82 are gallery albums from 2012 to 2021.
- **No address, phone or email shows anywhere.** The Contact Us page crashes (PHP fatal error) straight after the map, so it shows a map and nothing else.
- About **2,300 photos of identifiable children** are publicly indexed. Many of those children are now teenagers, and there is no record of consent. I recommend not migrating them, and taking them down with 410 at launch.
- The SOP video is **on YouTube, not Google Drive**. The Google Drive link on the home page is a different video, "Taska PAC Full Montessori.mp4".
- The facts on the site contradict each other: three different age bands and two sets of hours. The questions in section 9 settle this.

## 2. How it was crawled

The `web-clone` Playwright scripts need Node, which this machine doesn't have. I read the site's own WordPress REST API instead (`/index.php?rest_route=/wp/v2/...`), fetched every page's rendered HTML, and followed every NextGEN gallery's pagination (24 photos a page). This is more complete than link-following: it also found test pages, duplicates and 4 albums that have no WordPress page. There is no `robots.txt` and no sitemap (both return 404).

## 3. Page list

The 19 pages that carry content (all URLs are `https://www.taskapac.com/` + path):

| Old URL | Title | What's on it | Call | Proposed new URL |
|---|---|---|---|---|
| `/` | Home | 4 learning objectives, PAC's commitment line, programme overview sidebar, Google Drive video link, Facebook widget | rewrite | `/` |
| `?page_id=5` | About Us (child of Home) | Taska, Kindergarten and Childcare descriptions, languages, tuition | rewrite | `/en/about` |
| `?page_id=26` | Philosophy (child of Home) | Long Montessori philosophy essay | rewrite | `/en/about#philosophy` |
| `?page_id=415` | 2017 Promotion (child of Home) | March 2017 lesson-plan image, classroom layout image | drop | `/en/admissions` |
| `?page_id=856` | PAC SOP Video 2020 | YouTube embed only | keep video | `/en/a-day-at-pac#sop-video` |
| `?page_id=470` | Montessori Curriculum | "Magic Hat" story video, plus the full text of a published picture book | rewrite | `/en/montessori-curriculum` |
| `?page_id=7` | Curriculum | 7 curriculum areas, 1–2 lines each | keep | `/en/montessori-curriculum` |
| `?page_id=65` | Practical Life | Essay: movement and thinking, prepared environment, cycle of activity | condense | `…#practical-life` |
| `?page_id=67` | Sensorial | Essay: the senses trained, 6 aims | condense | `…#sensorial` |
| `?page_id=70` | Mathematics | Essay: concrete materials, number concepts | condense | `…#mathematics` |
| `?page_id=91` | Language and Literacy | Essay: Pink/Blue/Green phonics series, writing before reading | condense | `…#language` |
| `?page_id=98` | Cultural (Thematic) | Thematic learning, plus a concrete syllabus list | keep | `…#cultural` |
| `?page_id=192` | Creative Arts | Essay: art, music, movement, craft | condense | `…#creative-arts` |
| `?page_id=201` | Bridging Class (6 yrs) | Essay: preparing for Primary One | condense | `/en/programmes/kindergarten#bridging` |
| `?page_id=53` | Program List | Empty | drop | `/en/programmes` |
| `?page_id=42` | Gallery | Index of 74 albums | rewrite | `/en/gallery` |
| `?page_id=9` | Contact Us | Map embed, then the page crashes | rewrite | `/en/contact` |
| `?page_id=178` | Enquiry Form (child of Contact) | Shows "Thank you! … successfully sent" on load, without sending anything | replace | `/en/book-a-visit` |
| `?page_id=215` | Conditions, Rules & Regulation | 17 parent rules, including an hours table | rewrite | `/en/admissions#policies` |

The rest are in `pages.csv`: 82 gallery pages, the 2 posts ("Hello world!" and a single photo) and 4 album-only galleries. That includes 3 public test pages ("Test", "test", "teating"), 4 empty pages and 5 duplicate albums. The new URLs are proposals: the BM paths (`/ms/...`) and final slugs get fixed with the Phase 2 sitemap.

## 4. Text worth keeping (facts and ideas, to be rewritten in plain words)

The best material is the **Curriculum overview** (page 7) and the **Cultural syllabus list** (page 98). Everything else is either an academic essay or a list of rules. I'll rewrite it into short, parent-friendly copy rather than move it across word for word.

- **Home:** four objectives. (1) The child builds themselves through the senses and finds joy in finishing work. (2) The child respects peers and matures socially. (3) The child gains self-discipline in a prepared environment guided by a Montessori teacher. (4) The child's creativity is valued, with freedom to play with symbols. Also the commitment line "Child's Whole Personality Development".
- **About:** Montessori nursery, kindergarten and childcare. Small-group Montessori class, a thematic approach and individual reading. Bridging class for Primary One under the National Preschool Curriculum (KSPK). Emphasis on Mandarin-medium classes. Hands-on computer lessons. Extra support in English (phonics, grammar, vocabulary), Mandarin (word recognition) and Bahasa Malaysia.
- **Philosophy:** the teacher guides and observes rather than commands. Children work with a material for as long as they need. Academic goals sit alongside "making sense of the world" goals. Misbehaviour is read as an unmet need. Contact with nature. Concentration, confidence and independence.
- **Curriculum areas:** Practical Life, Sensorial, Mathematics, Literacy, Cultural/Thematic, Creative Arts, Bridging Class.
- **Practical Life:** the three-step cycle of activity: choose from the shelf, work, put it back. This is good material for "A day at PAC".
- **Sensorial:** the senses trained (touch, taste, hearing, smell, sight, shape, temperature, weight). Aims: finer discrimination, longer concentration, fine-motor control that prepares for writing, judgement, independence, creativity.
- **Mathematics:** concrete apparatus such as number rods, plus number songs, rhymes and bead threading. Covers sorting, sequencing and early geometry.
- **Language:** a clear sequence. Insets for design, sandpaper letters and the moveable alphabet come first. Then Pink series (3-letter words), Blue (blends) and Green (phonograms), with grammar alongside. Writing often comes before reading. Daily reading aloud.
- **Cultural syllabus:** biology, botany, zoology, geography (globes, puzzle maps, Malaysia maps), history (calendar, timelines, clocks, prehistoric eras) and science (body, push and pull, magnetism, cooking). Festivals such as CNY, Deepavali and Mooncake, from the gallery.
- **Creative Arts:** process over product, non-toxic paints, percussion, walking on the line, rhythm games, craft tied to the current topic.
- **Rules (facts to re-confirm):**
  - Fees are due by the 7th, and fees and deposits are non-refundable.
  - One month's notice to withdraw.
  - Collect within 30 minutes of dismissal, or an overtime charge may apply.
  - Uniform from age 4, sports attire on gymnastics day (Wednesday).
  - Gazetted public holidays observed, and fees still payable over holidays.
  - What to bring (towel, spare clothes; childcare also bath towel, milk, water). No toys, gadgets, jewellery, money or phones.
  - Temperature check on arrival; 38 °C or above means parents are called. Sick children stay home.
  - No outside food except special diets; lunch and dinner for full-day childcare (extra charge).
  - Birthday cake at snack time.
  - Outings at the parents' cost.
- **2017 fee sheets** (media library): useful only as a checklist of fee line items to ask you about: registration, monthly fee, materials and curriculum, computer or gymnastics, Mandarin, science, uniform, sports suit, insurance, photos, graduation, outing. The amounts are from 2017 and will not be used.

**Drop:**
- The full text of the picture book on page 470. It's someone else's copyrighted work.
- Long quotations from Montessori books and the secondary research citations.
- Claims that need proof ("the first fully equipped Montessori class", "research evidence shows…", the brain-science claims).

## 5. Images and video

**Photos.** 2,296 unique gallery photos, all JPG and all of children. By year: 2012: 4 albums, 2013: 8, 2014: 6, 2015: 11, 2016: 18, 2017: 2, 2018: 15, 2019: 18, 2020: 1 (three albums have no date). The media library has 38 public files (WordPress reports 46, so 8 are private or attached to drafts). Key files:

| File | What it is | Call |
|---|---|---|
| `2020/02/Home1.jpg` (1716×952) | Current home hero: graduation group photo, about 26 identifiable children and 4 staff | Can't reuse without written consent from every family |
| `2022/04/WhatsApp-Image-*.jpeg` (9) | Newest photos, April 2022 dragon-fruit egg activity. Some carry a phone-camera watermark with a photographer's name | One shows only food (usable). Others show a child |
| `2016/06/mot-fees-*.jpg` | 2017 fee sheets | Never publish |
| theme `logo237110.png` | The only logo: 237×110 PNG, "TADIKA & TASKA PAC" plus Chinese name 日昇幼儿园 | Need a high-res or vector logo |

**Video.**

| Video | Where | Status |
|---|---|---|
| "Taska PAC SOP Video 2020" (YouTube `NlSDx4HmwKE`, channel "Taska Pac") | SOP page | Public, embeddable, 2:24 long. Not a COVID SOP: it's a centre tour that shows identifiable children (see `ANSWERS.md` #22) |
| "The Magic Hat FM Production Oct 2020" (YouTube `bgFG5QUHPUs`) | Montessori Curriculum page | Public |
| Graduation & Family Day 2013 Pt 1 and Pt 2 (YouTube `_N2aBAfwjmM`, `bgIK0x_rAkQ`) | Gallery album | Public, but the old Flash embeds on the site are broken |
| Kidzania outing (YouTube `2aDaZDu7z9I`) | Gallery album | Private or embedding disabled |
| "Taska PAC Full Montessori.mp4" (Google Drive) | Home sidebar | Public Drive link |

## 6. Redirect map

`redirects.csv` has every old URL. In short:

- Every `?page_id=` maps to its new page (all 82 gallery pages go to `/en/gallery`).
- `/index.php/nggallery/*` goes to `/en/gallery`.
- Any unknown `?page_id=` goes to `/`.
- `http://` and the bare domain go to `https://www.taskapac.com`.
- **410 Gone** for `/wp-content/gallery/*`, `/wp-content/uploads/*`, feeds and the WordPress admin and API endpoints. This tells Google to drop the old children's photos instead of keeping them indexed.

How it gets built: the old URLs are query strings on `/`, so path-only redirects can't match them. Next.js config redirects can match a query, but they pass the old `?page_id=` through to the new URL. I'll do the redirects in middleware instead, which gives clean URLs on Vercel or Netlify alike.

## 7. Copy fixes found

| Where | Old | Fix |
|---|---|---|
| Home | "The Child succeed" | "The child succeeds" |
| Home | "The Child respect" | "The child respects" |
| Home | "a discipline individual" | "a disciplined individual" |
| Home | "At PAC, We are" | "At PAC, we are" |
| Home | Commitment line credited to "Dr. Maria Montessori" | It's PAC's own commitment, so remove the attribution |
| About, Philosophy, Maths, Bridging | Stray "no images were found" (5 places) | Remove (broken gallery shortcode) |
| Maths | Stray `&gt;/p&gt;` | Remove |
| About | "Teacher become" | "becomes" |
| Philosophy | "positively rate with" (unclosed quote) | "rated", close the quote |
| Philosophy | "intent possibilities" | Probably "innate possibilities": confirm |
| Philosophy | "is usually indicates" | "usually indicates" |
| Curriculum, Language | "diagraphs" | "digraphs" |
| Maths | "Enchidean Geometry" | "Euclidean geometry" |
| Sensorial | "arithmetric" | "arithmetic" |
| Language | "Tuitors Influencing" (reference list) | "Factors Influencing" |
| Language | "National Association of Young Children" | "…for the Education of Young Children" |
| Language | "Woods (2004)" vs "Wood, T. (2004)" | One spelling |
| Cultural | "Hibernation/Immigration" | "Hibernation/Migration" |
| Bridging | "Cognition are founded", "each pieces" | "is founded", "each piece" |
| Rules | "overtime harge" | "charge" |
| Rules | "arrangements has been made" | "have been made" |
| Rules | "38°c", "such providence" | "38 °C", "such provision" |
| Gallery | "Chicks\'", "Class\'", "\'Nien Gao\'" | Backslash escapes showing, so fix the apostrophes |
| Gallery | "Montesori" (3), "Shusi King" | "Montessori", "Sushi King" |
| Footer | "© 2012 Tadika & Taska Pac." | Current year and the one agreed name |

About the `&amp;` in the title: the source `<title>Tadika &amp; Taska PAC</title>` is valid HTML and browsers show "&". The encoding bugs people actually see are the gallery backslashes above. The new site writes the name once in config, so the encoding can't go wrong.

## 8. Technical, SEO and safety problems on the old site

1. **Child photos and data.**
   - About 2,300 identifiable child photos are public and indexed.
   - The old enquiry form asked for the child's name, birth date and gender. The full admission version also asked for medical details, guardians, emergency contacts and authorised pick-up people.
   - We need to know where those submissions went (email or WordPress database) so they can be exported and deleted safely when the old site is switched off (PDPA).
2. **Contact page crashes:** a missing PHP `mbstring` extension. The REST page listing fails for the same reason.
3. **Not mobile-friendly:** the viewport meta tag is commented out.
4. **Broken features:**
   - The Shadowbox lightbox loads over `http://` on an `https://` page, so browsers block it.
   - The YouTube embeds use the dead Flash `/v/` format.
   - The enquiry page shows a fake success message.
5. **Outdated stack:**
   - WordPress 5.8.18.
   - Plugins: NextGEN Gallery 3.3.6, Events Made Easy 2.1.88, Shadowbox JS 3.0.3.10, Easy Table.
   - jQuery loads twice.
   - `xmlrpc.php` and the REST API are open.
6. **SEO:**
   - No robots.txt, sitemap, meta descriptions, Open Graph, schema or hreflang.
   - Plain `?page_id=` URLs.
   - Page titles are `h3` with no `h1`.
   - Public test, duplicate and "Hello world!" pages.
7. **Privacy:** the Facebook page widget loads Facebook's SDK without consent.
8. **The map** is an old Google "My Maps" embed. Its pin is at 2.994534, 101.54824, which OpenStreetMap places near Jalan Anggerik Aranda 31/170, Kota Kemuning, Seksyen 31, Shah Alam 40460. **This is a hint for you to confirm, not an address I will publish.**

## 9. Conflicts, unverified facts and questions

**Conflicts on the old site:**
- **Ages:** the overview says Nursery 2–3 and Kindergarten 4–6. About says Taska 1½–4 and Kindergarten 5–6. The rules say 2½–6.
- **Hours:**
  - The rules table gives Kindergarten 8.00–12.00 (K2 to 12.05), Nursery 8.30–11.30 and afternoon 1.00–4.30.
  - The same table gives Childcare Mon–Fri 7.00am–7.00pm and Saturday 8.00am–1.00pm.
  - The 2017 fee sheet instead gives a "full programme" of 8.00–3.30.
- **Name:**
  - "Tadika & Taska PAC" (title, logo, footer).
  - "Taska & Tadika PAC" (Facebook link text).
  - "TASTADIKAPAC" (Facebook URL).
  - "Taska Pac" and "Taska PAC" (YouTube).
  - "Tadika PAC" and "Taska PAC" used separately in the gallery.
  - Chinese name 日昇幼儿园 in the logo.
- **Extra programmes only seen in the gallery or rules:**
  - Scholastic World of English (2020/21).
  - Swimming (2019).
  - Gymnastics on Wednesdays.
  - Holiday programmes.
  - After-school enrichment and tuition.

**Questions.** These have since been answered by online research (26 Oct 2026). See `ANSWERS.md` for each answer, its source and what is still open.

*Identity*
1. Which exact name: "Taska & Tadika PAC", "Tadika & Taska PAC" or "TAS TADIKA PAC"? And what is the legal name on the registration certificates? Note that standard BM writes "Kanak-Kanak" with a hyphen, and "Pusat Jagaan" is the usual form, not "Pusat Jaga".
2. Keep the Chinese name 日昇幼儿园 on the site and in the logo?
3. Can you send a high-res or vector logo? (Optional: what does PAC stand for?)

*Contact*
4. Full address. Is the Kota Kemuning pin above correct? Please also send a Google Maps link.
5. Phone, WhatsApp number, and the email that enquiries should go to.
6. Current opening hours for each programme, Saturdays, and holiday closures.

*Programmes*
7. Correct age bands for Nursery, Kindergarten, Childcare and Day Care.
8. Which programmes run today (full-day childcare, morning and afternoon day care, bridging class, after-school, holiday programme)?
9. Which enrichment classes still run (Music Gym, gymnastics, swimming, science, e-learning, project, excursions, Scholastic English, Mandarin, tuition), and are any run by outside providers?
10. Languages of instruction. Are classes still Mandarin-medium?
11. Teacher-to-child ratio and class sizes.
12. Meals: what's provided, halal status, and how special diets are handled.
13. Transport: areas covered, own van or a third party, cost.
14. A typical daily timetable (for "A day at PAC").

*Admissions*
15. Current fee sheet and what it includes. Until then the site shows `[FEE TO CONFIRM]`.
16. Term dates or the 2027 calendar, intake months, waitlist.
17. Are the rules and regulations still current? A current parent handbook would be ideal.
18. Which documents parents need to register.

*Credentials*
19. JKM registration (Taska) and Ministry of Education registration (Tadika): which apply, plus numbers or certificates if you want them shown.
20. Teacher and principal Montessori training, first aid or CPR, and any other credentials you can prove. Otherwise I state none.

*Media and consent*
21. OK not to migrate the old gallery and to 410 it at launch? Can you supply new photos with written parental consent (or photos with no identifiable children)?
22. The SOP video: is it still current (Aug 2020)? Do you have the original file and a script for captions? Keep the Drive "Full Montessori" video and the Magic Hat video?
23. Any real parent feedback you have permission to quote?

*Tech and data*
24. Languages: confirm BM and English. Add Mandarin (the logo and the Mandarin-medium classes suggest it would help)?
25. Hosting: Vercel or Netlify? Who controls the domain registrar and DNS for taskapac.com?
26. Do you have WordPress admin access? Where did old form submissions go (email or database)?
27. Enquiries by email only, or also stored in Supabase (that stores personal data, so it needs your approval)?
28. Who manages the Facebook page, so its name and details can match the site?
