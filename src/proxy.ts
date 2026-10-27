import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, internalSlug, isLocale, routes, type Locale } from "@/lib/i18n";
import { legacyTarget } from "@/lib/legacy";

const LANG_COOKIE = "pac-lang";

const GONE_HTML = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Gone</title><body style="font-family:system-ui,sans-serif;max-width:36rem;margin:4rem auto;padding:0 1rem;color:#262347;background:#fcf7f4"><h1>This page has been removed</h1><p>It belonged to the old Taska &amp; Tadika PAC website.</p><p><a href="/" style="color:#34307a">Go to the new website</a></p></body></html>`;

/** Saved choice first, then the browser's language. Malay (and Indonesian) get BM. */
function preferredLocale(req: NextRequest): Locale {
  const saved = req.cookies.get(LANG_COOKIE)?.value;
  if (saved && isLocale(saved)) return saved;
  for (const part of (req.headers.get("accept-language") ?? "").split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase();
    if (tag.startsWith("ms") || tag.startsWith("id")) return "ms";
    if (tag.startsWith("en")) return "en";
  }
  return defaultLocale;
}

function remember(res: NextResponse, req: NextRequest, lang: Locale) {
  if (req.cookies.get(LANG_COOKIE)?.value !== lang) {
    res.cookies.set(LANG_COOKIE, lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }
  return res;
}

export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 1. Old WordPress URLs: 301 to the matching new page, or 410 Gone.
  const legacy = legacyTarget(pathname, searchParams);
  if (legacy?.status === 410) {
    return new NextResponse(GONE_HTML, { status: 410, headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" } });
  }
  if (legacy) return NextResponse.redirect(new URL(legacy.location, req.url), 301);

  // 2. No language in the path: send to the visitor's language.
  const [, first = "", ...restParts] = pathname.split("/");
  if (!isLocale(first)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${preferredLocale(req)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 307);
  }

  const lang = first;
  const rest = restParts.join("/").replace(/\/+$/, "");
  if (!rest) return remember(NextResponse.next(), req, lang);

  if (lang === "ms") {
    // BM slugs are served by the English-named route folders.
    const internal = internalSlug("ms", rest);
    if (internal !== null && internal !== rest) {
      const url = req.nextUrl.clone();
      url.pathname = `/ms/${internal}`;
      return remember(NextResponse.rewrite(url), req, lang);
    }
    // An English slug under /ms: redirect to the BM address so there's one URL per page.
    const route = Object.values(routes).find((r) => r.en === rest && r.ms !== r.en);
    if (internal === null && route) {
      const url = req.nextUrl.clone();
      url.pathname = `/ms/${route.ms}`;
      return NextResponse.redirect(url, 308);
    }
  } else {
    // A BM slug under /en: redirect to the English address.
    const internal = internalSlug("ms", rest);
    if (internal !== null && internal !== rest && internalSlug("en", rest) === null) {
      const url = req.nextUrl.clone();
      url.pathname = `/en/${internal}`;
      return NextResponse.redirect(url, 308);
    }
  }

  return remember(NextResponse.next(), req, lang);
}

export const config = {
  matcher: [
    // Everything except Next.js internals and static files (but keep old .php URLs).
    "/((?!_next/|fonts/|.*\\.(?:ico|png|jpe?g|gif|svg|webp|avif|woff2?|txt|xml|webmanifest|css|js|map)$).*)",
    // Old WordPress media, so it gets a 410 instead of a 404.
    "/wp-content/:path*",
  ],
};
