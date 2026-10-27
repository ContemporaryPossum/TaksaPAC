import { ArchPhoto } from "@/components/arch-photo";
import { ClosingCta } from "@/components/cta";
import { PageIntro, SectionHeading } from "@/components/section";
import { LocationCards } from "@/components/visit-info";
import { pageMetadata, resolveLang } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, "about");
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang, t } = await resolveLang(params);
  const a = t.about;

  return (
    <>
      <PageIntro eyebrow={a.eyebrow} title={a.title} />

      <section className="container-page grid items-start gap-10 pb-16 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:pb-24">
        <div className="mx-auto w-full max-w-[24rem]">
          <ArchPhoto caption={a.photo} placeholderLabel={t.common.photoToCome} />
        </div>
        <div data-reveal className="prose-page flex flex-col gap-5">
          <h2 className="text-[1.75rem] md:text-[2.25rem]">{a.story.title}</h2>
          {a.story.paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-page flex flex-col gap-8">
          <SectionHeading title={a.buildings.title} lead={a.buildings.body} />
          <LocationCards t={t} />
        </div>
      </section>

      <section className="container-page flex flex-col gap-10 py-16 md:py-24">
        <SectionHeading eyebrow={a.philosophy.eyebrow} title={a.philosophy.title} />
        <p data-reveal className="max-w-[40rem] border-l-4 border-gold pl-5 font-heading text-2xl leading-snug text-indigo md:text-3xl">
          {a.philosophy.commitment}
        </p>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {a.philosophy.points.map((point, i) => (
            <li key={i} data-reveal className="flex flex-col gap-2 rounded-2xl bg-white p-6 ring-1 ring-border">
              <h3 className="text-xl">{point.title}</h3>
              <p className="text-base text-muted-foreground">{point.body}</p>
            </li>
          ))}
        </ul>
        <p className="max-w-[60ch] text-base text-muted-foreground">{a.materials}</p>
      </section>

      <ClosingCta lang={lang} t={t} />
    </>
  );
}
