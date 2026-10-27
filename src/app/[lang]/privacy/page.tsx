import { Marked } from "@/components/marked";
import { PageIntro } from "@/components/section";
import { pageMetadata, resolveLang } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, "privacy");
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { t } = await resolveLang(params);
  const p = t.privacy;

  return (
    <>
      <PageIntro eyebrow={p.eyebrow} title={p.title} lead={p.updated} />
      <article className="container-page flex flex-col gap-8 pb-16">
        <p className="to-confirm self-start text-base">{p.draft}</p>
        {p.sections.map((section) => (
          <section key={section.title} className="prose-page flex flex-col gap-2">
            <h2 className="text-2xl">{section.title}</h2>
            <p className="text-lg leading-relaxed">
              <Marked text={section.body} />
            </p>
          </section>
        ))}
      </article>
    </>
  );
}
