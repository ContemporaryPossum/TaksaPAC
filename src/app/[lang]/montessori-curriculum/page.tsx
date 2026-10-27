import { MarkedList } from "@/components/blocks";
import { ClosingCta } from "@/components/cta";
import { PageIntro } from "@/components/section";
import { pageMetadata, resolveLang } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[lang]/montessori-curriculum">) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, "curriculum");
}

export default async function CurriculumPage({ params }: PageProps<"/[lang]/montessori-curriculum">) {
  const { lang, t } = await resolveLang(params);
  const c = t.curriculum;

  return (
    <>
      <PageIntro eyebrow={c.eyebrow} title={c.title} lead={c.lead} />

      <nav aria-label={c.title} className="container-page pb-10">
        <ul className="flex flex-wrap gap-2">
          {c.areas.map((area) => (
            <li key={area.id}>
              <a
                href={`#${area.id}`}
                className="inline-flex min-h-11 items-center rounded-full bg-lilac px-4 font-semibold text-ink hover:bg-apricot"
              >
                {area.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-page flex flex-col gap-6">
        {c.areas.map((area, i) => (
          <section
            key={area.id}
            id={area.id}
            aria-labelledby={`${area.id}-title`}
            data-reveal
            className={cn(
              "grid gap-6 rounded-[1.75rem] p-6 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:p-10",
              i % 2 === 0 ? "bg-white ring-1 ring-border" : "bg-apricot/60",
            )}
          >
            <div className="flex flex-col gap-3">
              <h2 id={`${area.id}-title`} className="text-[1.75rem] md:text-[2.25rem]">
                {area.title}
              </h2>
              <p className="text-lg text-muted-foreground">{area.body}</p>
            </div>
            <MarkedList items={area.examples} className="self-center text-lg" />
          </section>
        ))}
        <p className="max-w-[60ch] pt-4 text-base text-muted-foreground">{t.about.materials}</p>
      </div>

      <div className="mt-16">
        <ClosingCta lang={lang} t={t} />
      </div>
    </>
  );
}
