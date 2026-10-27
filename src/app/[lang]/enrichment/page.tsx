import { ClosingCta } from "@/components/cta";
import { PageIntro, SectionHeading } from "@/components/section";
import { pageMetadata, resolveLang } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/enrichment">) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, "enrichment");
}

export default async function EnrichmentPage({ params }: PageProps<"/[lang]/enrichment">) {
  const { lang, t } = await resolveLang(params);
  const e = t.enrichment;

  return (
    <>
      <PageIntro eyebrow={e.eyebrow} title={e.title} lead={e.lead} />

      <section className="container-page flex flex-col gap-6 pb-16">
        <h2 className="text-[1.75rem] md:text-[2.25rem]">{e.current.title}</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {e.current.items.map((item) => (
            <li key={item.name} data-reveal className="flex flex-col gap-2 rounded-2xl bg-white p-6 ring-1 ring-border">
              <h3 className="text-xl">{item.name}</h3>
              <p className="text-base text-muted-foreground">{item.body}</p>
            </li>
          ))}
          <li data-reveal className="flex flex-col gap-3 rounded-2xl bg-lilac p-6">
            <h3 className="text-xl">{e.ask.title}</h3>
            <p className="text-base text-ink/80">{e.ask.body}</p>
            <ul className="flex flex-wrap gap-2">
              {e.ask.items.map((item) => (
                <li key={item} className="rounded-full bg-white px-3 py-1 text-base font-semibold">
                  {item}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </section>

      <section className="bg-apricot/60 py-16 md:py-20">
        <div className="container-page flex flex-col gap-4">
          <SectionHeading title={e.projects.title} lead={e.projects.body} />
          <p className="max-w-[60ch] text-base text-muted-foreground">{e.projects.note}</p>
        </div>
      </section>

      <div className="mt-16">
        <ClosingCta lang={lang} t={t} />
      </div>
    </>
  );
}
