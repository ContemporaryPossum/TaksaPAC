// Old WordPress URLs from www.taskapac.com and where they go now.
// The full audited list is docs/phase-1/redirects.csv.
import { href, type RouteKey } from "@/lib/i18n";

const PAGE_IDS: Record<number, [RouteKey, string?]> = {
  2: ["home"],
  5: ["about"],
  26: ["about"],
  415: ["admissions"],
  856: ["day"],
  470: ["curriculum"],
  7: ["curriculum"],
  65: ["curriculum", "practical-life"],
  67: ["curriculum", "sensorial"],
  70: ["curriculum", "mathematics"],
  91: ["curriculum", "language"],
  98: ["curriculum", "cultural"],
  192: ["curriculum", "creative-arts"],
  201: ["kindergarten"],
  53: ["programmes"],
  42: ["day"],
  9: ["contact"],
  178: ["visit"],
  215: ["admissions", "rules"],
};

// Gallery albums. Their photos are not migrated, so they go to "A day at PAC".
const GALLERY_IDS = new Set([
  44, 49, 51, 116, 279, 280, 286, 287, 288, 289, 292, 307, 311, 315, 327, 328, 338, 345, 372, 373, 374, 375, 376, 379, 380, 381,
  386, 390, 391, 393, 394, 397, 399, 400, 401, 402, 405, 406, 407, 409, 411, 412, 413, 430, 462, 467, 468, 590, 591, 592, 594,
  596, 598, 599, 600, 601, 602, 603, 604, 606, 607, 608, 610, 612, 614, 615, 616, 617, 618, 619, 621, 622, 624, 625, 626, 627,
  628, 629, 650, 651, 652, 653,
]);

// WordPress internals and old media (including the children's photos): gone for good.
const GONE_PREFIXES = ["/wp-content", "/wp-admin", "/wp-includes", "/wp-json", "/wp-login.php", "/xmlrpc.php", "/feed"];

export type LegacyResult = { status: 301; location: string } | { status: 410 } | null;

export function legacyTarget(pathname: string, search: URLSearchParams): LegacyResult {
  const lower = pathname.toLowerCase();
  if (GONE_PREFIXES.some((p) => lower === p || lower.startsWith(`${p}/`))) return { status: 410 };
  if (lower.startsWith("/index.php/nggallery")) return { status: 301, location: href("en", "day") };

  if (lower !== "/" && lower !== "/index.php") return null;

  if (search.has("feed") || search.has("rest_route")) return { status: 410 };

  const pageId = search.get("page_id");
  if (pageId !== null) {
    const id = Number(pageId);
    const target = PAGE_IDS[id];
    if (target) return { status: 301, location: href("en", target[0], target[1]) };
    if (GALLERY_IDS.has(id)) return { status: 301, location: href("en", "day") };
    return { status: 301, location: href("en", "home") };
  }

  const postId = search.get("p");
  if (postId !== null) return { status: 301, location: postId === "344" ? href("en", "day") : href("en", "home") };

  if (lower === "/index.php") return { status: 301, location: href("en", "home") };
  return null;
}
