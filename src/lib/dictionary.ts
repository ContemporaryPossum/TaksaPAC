import "server-only";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import en from "@/content/en.json";
import ms from "@/content/ms.json";
import { site } from "@/content/site";
import { href, htmlLang, isLocale, locales, type Locale, type RouteKey } from "@/lib/i18n";

export type Dictionary = typeof en;

// Assigning through the type makes the build fail if the BM file is missing a key.
const msChecked: Dictionary = ms;
const dictionaries: Record<Locale, Dictionary> = { en, ms: msChecked };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

/** Resolve the [lang] param for a page, or 404. */
export async function resolveLang(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return { lang, t: getDictionary(lang) };
}

type MetaKey = keyof Dictionary["meta"];

/** Title, description, canonical URL and hreflang alternates for one page. */
export function pageMetadata(lang: Locale, key: RouteKey & MetaKey): Metadata {
  const meta = getDictionary(lang).meta[key];
  const languages: Record<string, string> = { "x-default": "/" };
  for (const l of locales) languages[htmlLang[l]] = href(l, key);
  return {
    title: key === "home" ? { absolute: `${site.name} · ${site.nameZh} | ${meta.title}` } : meta.title,
    description: meta.description,
    alternates: { canonical: href(lang, key), languages },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: href(lang, key),
      siteName: site.name,
      locale: htmlLang[lang].replace("-", "_"),
      type: "website",
    },
  };
}
