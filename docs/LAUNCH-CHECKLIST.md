# Launch checklist

## Before launch

- [ ] Fill in the markers in `docs/CONTENT-CHECKLIST.md`, or accept them showing as "to confirm".
- [ ] Have a native BM speaker review `src/content/ms.json`.
- [ ] Have the centre review the privacy notice (`privacy` in both language files) and remove the "Draft" line.
- [ ] Create a free **Resend** account in the centre's name and verify `taskapac.com`. Set `RESEND_API_KEY`, `RESEND_FROM` and `ENQUIRY_TO` on the Cloudflare Worker (README, "Deploy to Cloudflare").
- [ ] Optional: create a free **Cloudflare Turnstile** widget and set both Turnstile keys.
- [ ] Check that the latest build of the **taksapac** Worker succeeded (Workers & Pages → taksapac → Deployments).
- [ ] On the Worker's `taksapac.<account>.workers.dev` address:
  - [ ] Send a test visit request and confirm the email arrives.
  - [ ] Tap the WhatsApp button on a phone.
- [ ] Old WordPress site:
  - [ ] Find out where old enquiry and admission form submissions went (WordPress database or email). They contain children's names, birth dates and medical details.
  - [ ] Export what the centre must keep and store it securely.
  - [ ] Delete the rest (PDPA).

## Going live

- [ ] **DNS:** add `taskapac.com` to Cloudflare (**Domains → Onboard a domain**), then change the nameservers at the domain registrar to the two Cloudflare shows.
- [ ] On the Worker, add the custom domain `www.taskapac.com` (Settings → Domains & Routes). Cloudflare issues the HTTPS certificate automatically.
- [ ] Redirect the bare domain: add a Redirect Rule from `taskapac.com/*` to `https://www.taskapac.com/${1}` (301), and turn on **SSL/TLS → Edge Certificates → Always Use HTTPS**.
- [ ] **Redirect spot-checks on the live domain:**
  - [ ] `https://www.taskapac.com/?page_id=5` goes to `/en/about` (301).
  - [ ] `https://www.taskapac.com/?page_id=42` goes to `/en/a-day-at-pac` (301).
  - [ ] `https://www.taskapac.com/wp-content/uploads/2020/02/Home1.jpg` returns 410.
  - [ ] `http://taskapac.com/` ends up at `https://www.taskapac.com/en` or `/ms`.
- [ ] Shut down the old WordPress hosting only after the export above.

## Search engines and listings

- [ ] **Google Search Console:**
  - [ ] Verify the domain.
  - [ ] Submit `https://www.taskapac.com/sitemap.xml`.
  - [ ] Use "Removals" for any old child-photo URLs still showing in Google Images.
- [ ] **Google Business Profile:**
  - [ ] Rename the listing to "Taska & Tadika PAC". The current name "Taska & Tadika, Pusat Jaga Kanak Kanak PAC, Kota Kemuning" breaks Google's naming rules.
  - [ ] Check the hours and phone number, set the website to `https://www.taskapac.com/`, and consider a second location for the Tadika (31/170C).
- [ ] **Facebook page:**
  - [ ] Add the Taska address (31/34) alongside the Tadika address.
  - [ ] Remove "Dine in · Outdoor seating" from Services.
  - [ ] List the website once, with `https://www.taskapac.com/`.

## After launch

- [ ] Analytics: none is installed. If wanted, choose a cookie-free option (for example Plausible) or add a consent banner first. Either way, update the privacy notice.
- [ ] Backups: the whole site is this Git repository. Keep it on GitHub. Cloudflare keeps past versions of the Worker, which can be rolled back under Deployments.
- [ ] Every November: update the registration window text.
