import { MarkedList } from "@/components/blocks";
import { ClosingCta } from "@/components/cta";
import { Marked } from "@/components/marked";
import { PageIntro } from "@/components/section";
import { pageMetadata, resolveLang } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/admissions">) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, "admissions");
}

export default async function AdmissionsPage({ params }: PageProps<"/[lang]/admissions">) {
  const { lang, t } = await resolveLang(params);
  const a = t.admissions;

  return (
    <>
      <PageIntro eyebrow={a.eyebrow} title={a.title} lead={a.lead} />

      {/* The steps are a real sequence, so they're numbered */}
      <section className="container-page pb-16">
        <ol className="grid gap-4 md:grid-cols-3">
          {a.steps.map((step, i) => (
            <li key={i} data-reveal className="flex flex-col gap-3 rounded-[1.5rem] bg-white p-6 ring-1 ring-border">
              <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-full bg-gold font-heading text-xl font-bold text-ink">
                {i + 1}
              </span>
              <h2 className="text-2xl">{step.title}</h2>
              <p className="text-base text-muted-foreground">
                <Marked text={step.body} />
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page grid gap-5 pb-16 md:grid-cols-2">
        <div id="fees" data-reveal className="flex flex-col gap-4 rounded-[1.5rem] bg-apricot/70 p-6 md:p-8">
          <h2 className="text-[1.75rem]">{a.fees.title}</h2>
          <p className="text-lg">
            <Marked text={a.fees.body} />
          </p>
          <p className="text-base text-ink/80">{a.fees.ask}</p>
          <MarkedList items={a.fees.items} className="text-base" />
          <p className="border-t border-white pt-4 text-base font-semibold">{a.fees.rules}</p>
        </div>
        <div className="flex flex-col gap-5">
          <div id="transport" data-reveal className="flex flex-col gap-3 rounded-[1.5rem] bg-lilac p-6 md:p-8">
            <h2 className="text-[1.75rem]">{a.transport.title}</h2>
            <p className="text-lg">{a.transport.body}</p>
            <p className="text-base">
              <Marked text={a.transport.areas} />
            </p>
          </div>
          <div id="rules" data-reveal className="flex flex-col gap-4 rounded-[1.5rem] bg-white p-6 ring-1 ring-border md:p-8">
            <h2 className="text-[1.75rem]">{a.rules.title}</h2>
            <MarkedList items={a.rules.items} className="text-base" />
            <p className="text-sm text-muted-foreground">{a.rules.note}</p>
          </div>
        </div>
      </section>

      <ClosingCta lang={lang} t={t} />
    </>
  );
}
