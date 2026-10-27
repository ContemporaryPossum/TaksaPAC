import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { href, htmlLang, locales, routes, type RouteKey } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const keys = Object.keys(routes) as RouteKey[];
  return keys.flatMap((key) =>
    locales.map((lang) => ({
      url: `${site.url}${href(lang, key)}`,
      changeFrequency: "monthly" as const,
      priority: key === "home" ? 1 : key === "privacy" ? 0.3 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `${site.url}${href(l, key)}`])),
      },
    })),
  );
}
