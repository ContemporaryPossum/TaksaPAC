import { DayTimeline } from "@/components/blocks";
import { ClosingCta, CtaButtons } from "@/components/cta";
import { VideoEmbed } from "@/components/embeds";
import { Marked } from "@/components/marked";
import { PageIntro, SectionHeading } from "@/components/section";
import { site } from "@/content/site";
import { pageMetadata, resolveLang } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/a-day-at-pac">) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, "day");
}

export default async function DayPage({ params }: PageProps<"/[lang]/a-day-at-pac">) {
  const { lang, t } = await resolveLang(params);
  const d = t.day;

  return (
    <>
      <PageIntro eyebrow={d.eyebrow} title={d.title} lead={d.lead} />

      <section className="container-page grid gap-10 pb-16 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:pb-24">
        <div className="flex flex-col gap-6">
          <DayTimeline t={t} />
          <p className="text-base text-muted-foreground">
            <Marked text={d.timesNote} />
          </p>
        </div>
        <aside className="flex flex-col gap-5 self-start rounded-[1.75rem] bg-lilac p-6 md:sticky md:top-28 md:p-8">
          <h2 className="text-2xl">{d.cycle.title}</h2>
          <ol className="flex flex-col gap-4">
            {d.cycle.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white font-heading text-lg font-bold text-indigo">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-sans text-lg font-bold">{step.title}</h3>
                  <p className="text-base text-ink/80">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="border-t border-white pt-4 text-base text-ink/80">{d.cycle.note}</p>
        </aside>
      </section>

      <section className="container-page flex flex-col gap-6 pb-16">
        <SectionHeading title={d.video.title} lead={site.tourVideo.enabled ? d.video.body : d.video.unavailable} />
        {site.tourVideo.enabled ? (
          <div className="max-w-[56rem]">
            <VideoEmbed youtubeId={site.tourVideo.youtubeId} title={d.video.title} playLabel={d.video.play} notice={d.video.consent} />
          </div>
        ) : (
          <CtaButtons lang={lang} t={t} />
        )}
      </section>

      <ClosingCta lang={lang} t={t} />
    </>
  );
}
