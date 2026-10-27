import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { ArchPhoto } from "@/components/arch-photo";
import { DayTimeline, FaqList, ProgrammeCards } from "@/components/blocks";
import { ClosingCta, CtaButtons } from "@/components/cta";
import { SectionHeading } from "@/components/section";
import { OrganizationJsonLd } from "@/components/structured-data";
import { HoursList, LocationCards } from "@/components/visit-info";
import { pageMetadata, resolveLang } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, "home");
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang, t } = await resolveLang(params);
  const h = t.home;

  return (
    <>
      {/* Hero: the promise, both actions, and the arch window */}
      <section className="container-page grid items-center gap-10 pt-8 pb-14 md:grid-cols-[1.1fr_0.9fr] md:gap-14 md:pt-16 md:pb-20">
        <div className="flex flex-col gap-6">
          <p className="eyebrow border-t border-lilac pt-3">{h.eyebrow}</p>
          <h1 className="text-[2.5rem] leading-[1.08] md:text-[3.75rem]">{h.title}</h1>
          <p className="max-w-[38rem] text-lg text-muted-foreground md:text-xl">{h.lead}</p>
          <CtaButtons lang={lang} t={t} />
          <p className="text-base font-semibold text-indigo">{t.common.registration}</p>
        </div>
        <div className="mx-auto w-full max-w-[19rem] md:max-w-[26rem]">
          <ArchPhoto caption={h.photo} placeholderLabel={t.common.photoToCome} priority />
        </div>
      </section>

      {/* Montessori in plain words */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-page flex flex-col gap-10">
          <SectionHeading eyebrow={h.montessori.eyebrow} title={h.montessori.title} lead={h.montessori.lead} />
          <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {h.montessori.points.map((point, i) => (
              <li key={i} data-reveal className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-apricot font-heading text-xl font-bold text-indigo"
                >
                  {i + 1}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xl">{point.title}</h3>
                  <p className="text-base text-muted-foreground">{point.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href={href(lang, "curriculum")} className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-indigo underline">
            {t.meta.curriculum.title}
            <ArrowRightIcon className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Programmes by age */}
      <section className="container-page flex flex-col gap-10 py-16 md:py-24">
        <SectionHeading eyebrow={h.programmes.eyebrow} title={h.programmes.title} lead={h.programmes.lead} />
        <ProgrammeCards lang={lang} t={t} />
      </section>

      {/* Enrichment strip */}
      <section className="bg-indigo py-12 text-white md:py-16">
        <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="eyebrow text-white/75">{h.enrichment.eyebrow}</p>
            <h2 className="text-[1.75rem] md:text-[2.25rem]">{h.enrichment.title}</h2>
          </div>
          <ul className="flex flex-wrap gap-2 md:max-w-[34rem] md:justify-end">
            {h.enrichment.items.map((item) => (
              <li key={item} className="rounded-full bg-white/10 px-4 py-2 font-semibold ring-1 ring-white/25">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="container-page mt-6">
          <Link href={href(lang, "enrichment")} className="inline-flex min-h-11 items-center gap-2 font-semibold text-gold underline">
            {t.common.learnMore}
            <ArrowRightIcon className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* A day at PAC */}
      <section className="container-page grid gap-10 py-16 md:grid-cols-[0.9fr_1.1fr] md:py-24">
        <div className="flex flex-col gap-6">
          <SectionHeading eyebrow={h.day.eyebrow} title={h.day.title} lead={h.day.lead} />
          <Link href={href(lang, "day")} className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-indigo underline">
            {t.nav.day}
            <ArrowRightIcon className="size-5" aria-hidden="true" />
          </Link>
        </div>
        <DayTimeline t={t} />
      </section>

      {/* Hours and locations */}
      <section className="bg-apricot/50 py-16 md:py-24">
        <div className="container-page grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow={h.visit.eyebrow} title={t.locations.title} />
            <HoursList t={t} lang={lang} />
          </div>
          <LocationCards t={t} className="self-start" />
        </div>
      </section>

      {/* FAQ preview */}
      <section className="container-page flex flex-col gap-8 py-16 md:py-24">
        <SectionHeading eyebrow={h.faq.eyebrow} title={h.faq.title} />
        <FaqList items={t.faq.items.slice(0, 5)} />
        <Link href={href(lang, "faq")} className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-indigo underline">
          {t.common.seeAll}
          <ArrowRightIcon className="size-5" aria-hidden="true" />
        </Link>
      </section>

      <ClosingCta lang={lang} t={t} />
      <OrganizationJsonLd lang={lang} />
    </>
  );
}
