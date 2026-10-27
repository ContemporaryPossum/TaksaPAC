import { site } from "@/content/site";
import { getDictionary } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";

function postalAddress(key: "taska" | "tadika") {
  const l = site.locations[key];
  return {
    "@type": "PostalAddress",
    streetAddress: l.street,
    addressLocality: `${l.area}, ${l.city}`,
    postalCode: l.postcode,
    addressRegion: l.state,
    addressCountry: "MY",
  };
}

/** schema.org data for Google: the Taska as a ChildCare business, the Tadika as its preschool. */
export function OrganizationJsonLd({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const geo = site.locations.taska.geo;
  const data = {
    "@context": "https://schema.org",
    "@type": ["ChildCare", "Preschool"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: [site.nameZh, "Taska PAC", "Tadika PAC"],
    url: `${site.url}${href(lang, "home")}`,
    description: t.meta.home.description,
    telephone: site.phone.tel,
    email: site.email,
    foundingDate: String(site.since),
    address: postalAddress("taska"),
    geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng },
    openingHoursSpecification: site.hours
      .filter((h) => h.opens && h.closes)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days === "mon-fri" ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] : ["Saturday"],
        opens: h.opens,
        closes: h.closes,
      })),
    sameAs: [site.facebook, site.youtube],
    department: [
      {
        "@type": "Preschool",
        name: "Tadika PAC",
        address: postalAddress("tadika"),
        telephone: site.phone.tel,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
