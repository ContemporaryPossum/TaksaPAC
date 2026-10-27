import Link from "next/link";
import { cacheLife } from "next/cache";
import { MailIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";

import { Lockup } from "@/components/brand";
import { CtaButtons } from "@/components/cta";
import { LanguageSwitch, MobileMenu, NavLinks, type NavItem } from "@/components/nav";
import { HoursList } from "@/components/visit-info";
import { Button } from "@/components/ui/button";
import { fullAddress, site, whatsappUrl } from "@/content/site";
import type { Dictionary } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";

function mainNav(lang: Locale, t: Dictionary): NavItem[] {
  return [
    { href: href(lang, "about"), label: t.nav.about },
    { href: href(lang, "curriculum"), label: t.nav.curriculum },
    { href: href(lang, "programmes"), label: t.nav.programmes },
    { href: href(lang, "day"), label: t.nav.day },
    { href: href(lang, "admissions"), label: t.nav.admissions },
    { href: href(lang, "contact"), label: t.nav.contact },
  ];
}

export function SiteHeader({ lang, t }: { lang: Locale; t: Dictionary }) {
  const items = mainNav(lang, t);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper">
      {/* Solid background on purpose: a backdrop-filter would trap the fixed mobile menu inside the header. */}
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Link href={href(lang, "home")} className="rounded-lg" aria-label={`${site.name}, ${t.common.home}`}>
          <Lockup />
        </Link>
        <nav aria-label={t.common.mainNav} className="hidden lg:block">
          <NavLinks items={items} className="flex items-center gap-0.5 text-[0.95rem]" />
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitch lang={lang} label={t.langShort === "EN" ? "BM" : "EN"} ariaLabel={t.common.switchLanguageLabel} />
          <Button asChild className="hidden md:inline-flex">
            <Link href={href(lang, "visit")}>{t.common.bookVisit}</Link>
          </Button>
          <MobileMenu items={[...items, { href: href(lang, "enrichment"), label: t.nav.enrichment }, { href: href(lang, "faq"), label: t.nav.faq }]} labels={{ menu: t.common.menu, close: t.common.close }}>
            <CtaButtons lang={lang} t={t} className="[&>*]:w-full" />
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}

async function copyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter({ lang, t }: { lang: Locale; t: Dictionary }) {
  const year = await copyrightYear();
  const explore: NavItem[] = [
    ...mainNav(lang, t),
    { href: href(lang, "enrichment"), label: t.nav.enrichment },
    { href: href(lang, "faq"), label: t.nav.faq },
    { href: href(lang, "visit"), label: t.nav.visit },
  ];
  return (
    <footer className="mt-20 border-t border-border bg-lilac/60">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr] md:py-16">
        <div className="flex flex-col gap-4">
          <Lockup size="lg" />
          <p className="max-w-[34ch] text-muted-foreground">{t.footer.about}</p>
          <CtaButtons lang={lang} t={t} size="default" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="font-sans text-lg font-bold">{t.footer.contact}</h2>
            <ul className="flex flex-col gap-1">
              <li>
                <a href={`tel:${site.phone.tel}`} className="inline-flex min-h-11 items-center gap-2 font-semibold hover:underline">
                  <PhoneIcon className="size-5 text-indigo" aria-hidden="true" />
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold hover:underline">
                  <MessageCircleIcon className="size-5 text-indigo" aria-hidden="true" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-2 font-semibold break-all hover:underline">
                  <MailIcon className="size-5 shrink-0 text-indigo" aria-hidden="true" />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
          <HoursList t={t} lang={lang} />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="font-sans text-lg font-bold">{t.footer.visit}</h2>
            <address className="flex flex-col gap-3 not-italic text-base">
              <span>
                <strong>{t.locations.taska}</strong>
                <br />
                {fullAddress("taska")}
              </span>
              <span>
                <strong>{t.locations.tadika}</strong>
                <br />
                {fullAddress("tadika")}
              </span>
            </address>
          </div>
          <nav aria-label={t.footer.explore}>
            <h2 className="font-sans text-lg font-bold">{t.footer.explore}</h2>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 text-base">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-11 items-center hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.since}–{year} {site.name} <span lang="zh-Hans" className="font-zh">{site.nameZh}</span>. {t.footer.rights}
          </p>
          <p className="flex gap-4">
            <Link href={href(lang, "privacy")} className="inline-flex min-h-11 items-center underline">
              {t.nav.privacy}
            </Link>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline">
              Facebook
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
