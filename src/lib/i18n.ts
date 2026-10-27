// Locales and the route table. Shared by the proxy and the app, so no
// server-only imports here.

export const locales = ["en", "ms"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// Each page has one internal path (the folder under app/[lang]) and a public
// slug per language. BM visitors see BM slugs; the proxy rewrites them.
export const routes = {
  home: { en: "", ms: "" },
  about: { en: "about", ms: "tentang-kami" },
  curriculum: { en: "montessori-curriculum", ms: "kurikulum-montessori" },
  programmes: { en: "programmes", ms: "program" },
  nursery: { en: "programmes/nursery", ms: "program/nurseri" },
  kindergarten: { en: "programmes/kindergarten", ms: "program/tadika" },
  fullMontessori: { en: "programmes/full-montessori", ms: "program/montessori-penuh" },
  childcare: { en: "programmes/childcare", ms: "program/jagaan-harian" },
  enrichment: { en: "enrichment", ms: "aktiviti-tambahan" },
  day: { en: "a-day-at-pac", ms: "sehari-di-pac" },
  admissions: { en: "admissions", ms: "kemasukan" },
  visit: { en: "book-a-visit", ms: "lawatan" },
  faq: { en: "faq", ms: "soalan-lazim" },
  contact: { en: "contact", ms: "hubungi" },
  privacy: { en: "privacy", ms: "privasi" },
} as const;

export type RouteKey = keyof typeof routes;

export const programmeKeys = ["nursery", "kindergarten", "fullMontessori", "childcare"] as const;
export type ProgrammeKey = (typeof programmeKeys)[number];

/** Public URL path for a page in a language, e.g. href("ms", "about") -> "/ms/tentang-kami". */
export function href(lang: Locale, key: RouteKey, hash?: string) {
  const slug = routes[key][lang];
  return `/${lang}${slug ? `/${slug}` : ""}${hash ? `#${hash}` : ""}`;
}

/** Internal path segment for a public slug, or null if the slug is unknown. */
export function internalSlug(lang: Locale, publicSlug: string): string | null {
  for (const r of Object.values(routes)) {
    if (r[lang] === publicSlug) return r.en;
  }
  return null;
}

/** The route key for an internal (English) slug. */
export function keyForInternalSlug(slug: string): RouteKey | null {
  for (const [key, r] of Object.entries(routes)) {
    if (r.en === slug) return key as RouteKey;
  }
  return null;
}

export const otherLocale = (lang: Locale): Locale => (lang === "en" ? "ms" : "en");

export const htmlLang: Record<Locale, string> = { en: "en-MY", ms: "ms-MY" };
