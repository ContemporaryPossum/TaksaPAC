import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { MarkedList } from "@/components/blocks";
import { ClosingCta, CtaButtons } from "@/components/cta";
import { Marked } from "@/components/marked";
import { pageMetadata, resolveLang } from "@/lib/dictionary";
import { href, isLocale, programmeKeys, type ProgrammeKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Params = Promise<{ lang: string }>;

export async function programmeMetadata(params: Params, key: ProgrammeKey) {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, key) : {};
}

/** One programme page. Each programme has its own route folder that renders this. */
export async function ProgrammeDetail({ params, programme }: { params: Params; programme: ProgrammeKey }) {
  const { lang, t } = await resolveLang(params);
  const p = t.programmes.items[programme];
  const others = programmeKeys.filter((k) => k !== programme);

  return (
    <>
      <section className="container-page flex flex-col gap-6 pt-8 pb-12 md:pt-12 md:pb-16">
        <Link href={href(lang, "programmes")} className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-indigo hover:underline">
          <ArrowLeftIcon className="size-5" aria-hidden="true" />
          {t.common.back}
        </Link>
        <div data-reveal className="flex max-w-[44rem] flex-col gap-4">
          <p className="eyebrow border-t border-lilac pt-3">
            {t.common.ages} <Marked text={p.ages} /> · {p.building}
          </p>
          <h1 className="text-[2.25rem] md:text-[3.25rem]">{p.name}</h1>
          <p className="text-lg text-muted-foreground md:text-xl">{p.intro}</p>
          <CtaButtons lang={lang} t={t} className="pt-2" />
        </div>
      </section>

      <div className="container-page grid gap-5 md:grid-cols-2">
        {p.sections.map((section, i) => (
          <section
            key={i}
            data-reveal
            className={cn(
              "flex flex-col gap-4 rounded-[1.5rem] p-6 md:p-8",
              i === 0 ? "bg-apricot/70 md:col-span-2" : "bg-white ring-1 ring-border",
            )}
          >
            <h2 className="text-2xl">{section.title}</h2>
            <MarkedList items={section.items} className="text-lg" />
          </section>
        ))}
      </div>

      <nav aria-label={t.programmes.title} className="container-page py-16">
        <h2 className="font-sans text-lg font-bold">{t.programmes.title}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {others.map((k) => (
            <li key={k}>
              <Link href={href(lang, k)} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-lilac px-4 font-semibold hover:bg-apricot">
                {t.programmes.items[k].name}
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ClosingCta lang={lang} t={t} />
    </>
  );
}
