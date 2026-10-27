import { ProgrammeCards } from "@/components/blocks";
import { ClosingCta } from "@/components/cta";
import { PageIntro } from "@/components/section";
import { HoursList } from "@/components/visit-info";
import { pageMetadata, resolveLang } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/programmes">) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, "programmes");
}

export default async function ProgrammesPage({ params }: PageProps<"/[lang]/programmes">) {
  const { lang, t } = await resolveLang(params);

  return (
    <>
      <PageIntro eyebrow={t.programmes.eyebrow} title={t.programmes.title} lead={t.programmes.lead} />
      <section className="container-page pb-16 md:pb-24">
        <ProgrammeCards lang={lang} t={t} headingLevel="h2" />
      </section>
      <section className="container-page pb-16">
        <div className="max-w-[28rem] rounded-2xl bg-white p-6 ring-1 ring-border">
          <HoursList t={t} lang={lang} />
        </div>
      </section>
      <ClosingCta lang={lang} t={t} />
    </>
  );
}
