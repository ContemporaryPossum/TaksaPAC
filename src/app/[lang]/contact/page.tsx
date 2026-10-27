import { MailIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";

import { ClosingCta } from "@/components/cta";
import { MapEmbed } from "@/components/embeds";
import { Marked } from "@/components/marked";
import { PageIntro } from "@/components/section";
import { OrganizationJsonLd } from "@/components/structured-data";
import { HoursList, LocationCards } from "@/components/visit-info";
import { fullAddress, site, whatsappUrl } from "@/content/site";
import { pageMetadata, resolveLang } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, "contact");
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang, t } = await resolveLang(params);
  const c = t.contact;

  const channels = [
    { icon: MessageCircleIcon, label: "WhatsApp", value: site.phone.display, href: whatsappUrl(t.common.whatsappPrefill), external: true },
    { icon: PhoneIcon, label: t.common.call, value: site.phone.display, href: `tel:${site.phone.tel}`, external: false },
    { icon: MailIcon, label: c.emailTitle, value: site.email, href: `mailto:${site.email}`, external: false },
  ];

  return (
    <>
      <PageIntro eyebrow={c.eyebrow} title={c.title} lead={c.lead} />

      <section className="container-page pb-12">
        <ul className="grid gap-4 sm:grid-cols-3">
          {channels.map(({ icon: Icon, label, value, href, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="lift flex h-full flex-col gap-2 rounded-2xl bg-white p-6 ring-1 ring-border hover:ring-indigo"
              >
                <Icon className="size-7 text-indigo" aria-hidden="true" />
                <span className="eyebrow">{label}</span>
                <span className="text-lg font-semibold break-all">{value}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page grid gap-10 pb-12 md:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <HoursList t={t} lang={lang} />
          <p className="text-base">
            <Marked text={c.transport} />
          </p>
          <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center self-start font-semibold text-indigo underline">
            {c.facebook}
          </a>
        </div>
        <LocationCards t={t} className="self-start" />
      </section>

      <section className="container-page flex flex-col gap-4 pb-16" aria-label={c.mapTitle}>
        <MapEmbed query={fullAddress("taska")} title={`${c.mapTitle}: ${t.locations.taska}`} showLabel={c.showMap} notice={c.mapConsent} />
      </section>

      <ClosingCta lang={lang} t={t} />
      <OrganizationJsonLd lang={lang} />
    </>
  );
}
