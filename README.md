# Taska & Tadika PAC website

A one-page site for Taska & Tadika, Pusat Jaga Kanak Kanak PAC (Kota Kemuning, Shah Alam).
Plain HTML, CSS and JavaScript with nothing to compile. Every file sits at the top level, and Cloudflare serves the site from a Worker (see Deploy).

## The idea

The page is set on Montessori classroom materials. A Three.js scene of the pink tower, number rods, golden beads, blue geometric solids, colour tablets and brown stair plays behind the whole page. It rearranges itself as you scroll:

| Section | Ground colour (material) | What the 3D materials do |
| --- | --- | --- |
| Hero | Pink (pink tower) | The tower is placed one cube at a time, largest first |
| Approach | Beech (wooden shelf) | The cubes are laid out by size; golden ten-bars drift in |
| Programmes | Blue (ten-bead blue) | Number rods form a staircase; the rod for the chosen age steps forward |
| Curriculum | Green (unit-bead green) | Everything sits on a long shelf that slides with the horizontal panels |
| Moments | Red (red rods) | One hundred golden beads form a hundred-square |
| Hours | Gold (golden beads) | Colour tablets form a clock; two rods show the live time in Shah Alam |
| Visit | Beech | A few tablets and solids rest at the edge of the desk |
| Footer | Ink | The pink tower is rebuilt with the solids in orbit |

Other moments: the headline is coloured like the Montessori movable alphabet (consonants blue, vowels red), the scroll progress bar is a number rod, the age picker is a number rod, and the enquiry form is an exercise-book page.

## Files

| File | What it is |
| --- | --- |
| `index.html` | All page content, SEO tags and structured data (Google business info) |
| `styles.css` | Colours, type and layout. Colour tokens are at the top in `:root` |
| `main.js` | Smooth scroll (Lenis), scroll animations (GSAP), age picker, menu, form |
| `charts.js` | The interactive charts (Bklit-style, plain SVG) and their data |
| `scene.js` | The Three.js background |
| `favicon.svg`, `apple-touch-icon.png` | Browser and phone icons |
| `og-image.png` | Preview image shown when the link is shared on WhatsApp or Facebook |
| `photo-*.jpg` (20 files) | The centre's own photos, compressed (see Photos below) |
| `site.webmanifest`, `robots.txt`, `sitemap.xml` | Standard site files |
| `404.html` | Page shown for broken links |
| `_headers` | Cloudflare security headers and caching rules |
| `package.json`, `build.mjs` | `npm run build` copies the public files into `dist/` (nothing is compiled) |
| `wrangler.jsonc` | Tells Cloudflare to serve `dist/` from the Worker named `taksapac` |
| `.gitignore` | Keeps the generated `dist/` folder out of Git |

## Deploy

The repository [ContemporaryPossum/TaksaPAC](https://github.com/ContemporaryPossum/TaksaPAC) is connected to the Cloudflare Worker **taksapac**. Every push to `main` builds and deploys automatically with the dashboard's default commands, so there is nothing to change in Cloudflare:

| Setting (Workers & Pages → taksapac → Settings → Builds) | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

`npm run build` copies every public file into `dist/`, leaving out `README.md` and the config files, and `npx wrangler deploy` serves `dist/` as static assets, applying `_headers` and `404.html`. No packages are installed and no secrets are needed.

**Custom domain.** In **Workers & Pages → taksapac → Settings → Domains & Routes → Add → Custom domain**, add `www.taskapac.com` (and `taskapac.com`). The domain's DNS must be on Cloudflare.

**Using Cloudflare Pages instead.** Connect the repository in **Workers & Pages → Create → Pages**, set the build command to `npm run build` and the build output directory to `dist`.

## Photos

The 20 `photo-*.jpg` files are the centre's own pictures, taken from the photo albums on its old WordPress site. Each one was resized to at most 1200 px wide and re-saved as a JPEG, cutting the set from 6.9 MB to about 1.2 MB. Re-saving also removed the camera metadata (dates, device and any location) from the photos of the children. The site no longer depends on the old WordPress server, so you can switch taskapac.com over to Cloudflare whenever you are ready.

| File | Where it appears |
| --- | --- |
| `photo-nursery-water-play.jpg` | Programmes: Montessori Nursery |
| `photo-multiplication-board.jpg` | Programmes: Montessori Kindergarten |
| `photo-science-materials.jpg` | Programmes: Bridging Class |
| `photo-walking-on-the-line.jpg` | Curriculum: Practical Life |
| `photo-sensorial.jpg` | Curriculum: Sensorial |
| `photo-maths-decimals.jpg` | Curriculum: Mathematics |
| `photo-nursery-phonics.jpg` | Curriculum: Literacy |
| `photo-chicks-hatching.jpg` | Curriculum: Culture & Science; Moments |
| `photo-free-drawing.jpg` | Curriculum: Creative Arts |
| `photo-rainforest-science.jpg` | Curriculum: Bridging |
| `photo-bomba-visit.jpg` | Moments |
| `photo-botanic-negara.jpg` | Moments |
| `photo-petrosains.jpg` | Moments |
| `photo-deepavali.jpg` | Moments |
| `photo-chap-goh-meh.jpg` | Moments |
| `photo-kuih-bakul.jpg` | Moments |
| `photo-butterflies.jpg` | Moments |
| `photo-swimming.jpg` | Moments |
| `photo-ostrich-farm.jpg` | Moments |
| `photo-kidzania.jpg` | Moments |

To swap a photo, upload a new file with the same name, or change the file name in `index.html` (and in the `ROOMS` list in `main.js` for the three Programmes photos). Several of the originals are small (450 × 600) WhatsApp pictures, so newer, larger photos from the centre (2023 to 2026) would make the page stronger. The newest public album is from 2020.

## Please confirm with the client

Everything on the page came from the centre's own website, its two Facebook pages, its Google Business listing and a Kiddy123 feature. These points are worth a quick check:

- **Phone and WhatsApp:** 016-272 9666 (from Google and Facebook). Every "WhatsApp" button uses this number.
- **Email:** amypac2008@gmail.com (from Facebook).
- **Address:** 1, Jalan Anggerik Aranda 31/34. One Facebook page says 31/170C.
- **Hours:** Monday to Friday 6:30 am to 7 pm, Saturday 8 am to 1 pm, Sunday closed (from Google). The live "Open now" badge and the week chart use these.
- **Ages:** 18 months to 6 years; Taska nursery 18 months to 4, Tadika kindergarten 4 to 6, Bridging class at 6.
- **Languages:** "Bahasa Melayu, Chinese and English practice" in the Bridging card is based on album names (BM, Chinese and Maths weekly lessons; Scholastic English). Confirm or remove it in `main.js` (`ROOMS.bridging.list`).
- **Inclusion, technology-aided classrooms, women-owned:** from Facebook, Kiddy123 and Google respectively.
- **Logo:** the stacked-blocks mark is a placeholder. Swap in the real logo if there is one (`.nav__mark` in `index.html`, plus `favicon.svg`).
- **Not included on purpose:** fees, parent testimonials, awards and an intake year, because none were published. Add them only with the client's wording and permission.

## Editing guide

- **Text:** all in `index.html`.
- **Colours:** `:root` and the `html[data-theme=...]` rules at the top of `styles.css`.
- **Opening hours:** `HOURS` in `main.js`, the hours text in `index.html` (hero status, Hours section, footer) and `openingHoursSpecification` in the structured data in `index.html`.
- **Programmes shown by the age picker:** `ROOMS` in `main.js`.
- **Chart data:** `YEARS` and `ALBUMS` in `charts.js`.
- **3D arrangements:** the `pose()` function in `scene.js`, one `case` per section.
- **Security headers:** `_headers` allows only the two small inline scripts at the top of `index.html`, by hash. If you change either of them, open the page, read the Content Security Policy error in the browser console (it prints the new `sha256-...` value), and replace the old value in `_headers`.

## Libraries

All loaded from jsDelivr with pinned versions and integrity hashes:

- GSAP 3.15.0 with ScrollTrigger and SplitText
- Lenis 1.3.26 (smooth scroll by darkroom.engineering)
- Three.js r180

Fonts: Lexend (designed to make reading easier) and Playwrite GB S (school handwriting) from Google Fonts.

## Accessibility and performance

- `prefers-reduced-motion` turns off smooth scroll, pinning and the moving 3D scene. The page then shows a still 3D tower and every section in its final state.
- A **Pause motion** button (bottom left) stops everything that moves on its own, and remembers the choice.
- Every chart has a hidden data table for screen readers; the ring segments and bars work with the keyboard.
- Colour pairs meet WCAG AA contrast. Focus outlines are visible on every control.
- The 3D scene caps pixel density, drops resolution on slow devices, and pauses when the tab is hidden.
- The Google map only loads when someone presses **Show the map**, so Google cookies are not set on page load.
