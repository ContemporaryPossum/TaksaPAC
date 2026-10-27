import { MessageCircleIcon } from "lucide-react";

import { PageIntro } from "@/components/section";
import { Button } from "@/components/ui/button";
import { VisitForm } from "@/components/visit-form";
import { HoursList, LocationCards } from "@/components/visit-info";
import { whatsappUrl } from "@/content/site";
import { pageMetadata, resolveLang } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/book-a-visit">) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, "visit");
}

export default async function BookVisitPage({ params }: PageProps<"/[lang]/book-a-visit">) {
  const { lang, t } = await resolveLang(params);
  const v = t.visit;

  return (
    <>
      <PageIntro eyebrow={v.eyebrow} title={v.title} lead={v.lead} />
      <section className="container-page grid items-start gap-8 pb-16 lg:grid-cols-[1.4fr_0.6fr]">
        <VisitForm
          lang={lang}
          copy={v}
          privacyHref={href(lang, "privacy")}
          turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined}
        />
        <aside className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 rounded-[1.5rem] bg-lilac p-6">
            <h2 className="text-2xl">{v.whatsappTitle}</h2>
            <p className="text-base text-ink/80">{v.whatsappBody}</p>
            <Button asChild size="lg" className="self-start">
              <a href={whatsappUrl(v.whatsappPrefill)} target="_blank" rel="noopener noreferrer">
                <MessageCircleIcon data-icon="inline-start" />
                {t.common.whatsapp}
              </a>
            </Button>
          </div>
          <div className="rounded-[1.5rem] bg-white p-6 ring-1 ring-border">
            <HoursList t={t} lang={lang} />
          </div>
        </aside>
      </section>
      <section className="container-page pb-8">
        <LocationCards t={t} />
      </section>
    </>
  );
}
