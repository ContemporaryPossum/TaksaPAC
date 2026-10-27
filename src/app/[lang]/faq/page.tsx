import { FaqList } from "@/components/blocks";
import { ClosingCta } from "@/components/cta";
import { PageIntro } from "@/components/section";
import { pageMetadata, resolveLang } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, "faq");
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang, t } = await resolveLang(params);
  return (
    <>
      <PageIntro eyebrow={t.faq.eyebrow} title={t.faq.title} />
      <section className="container-page pb-16 md:pb-24">
        <FaqList items={t.faq.items} className="max-w-[52rem]" />
      </section>
      <ClosingCta lang={lang} t={t} />
    </>
  );
}
