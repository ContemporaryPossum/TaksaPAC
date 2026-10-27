import Link from "next/link";
import { CalendarDaysIcon, MessageCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/content/site";
import type { Dictionary } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** The two actions every page ends with: WhatsApp, and Book a visit. */
export function CtaButtons({ lang, t, className, size = "lg" }: { lang: Locale; t: Dictionary; className?: string; size?: "default" | "lg" }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Button asChild size={size} className="lift">
        <a href={whatsappUrl(t.common.whatsappPrefill)} target="_blank" rel="noopener noreferrer">
          <MessageCircleIcon data-icon="inline-start" />
          {t.common.whatsapp}
        </a>
      </Button>
      <Button asChild size={size} variant="outline" className="lift border-indigo text-indigo hover:bg-lilac hover:text-indigo">
        <Link href={href(lang, "visit")}>
          <CalendarDaysIcon data-icon="inline-start" />
          {t.common.bookVisit}
        </Link>
      </Button>
    </div>
  );
}

/** Closing invitation used at the end of most pages. */
export function ClosingCta({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <section className="container-page mt-4">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-lilac px-6 py-12 md:px-14 md:py-16">
        <div aria-hidden="true" className="absolute -right-16 -bottom-40 -z-10 size-80 rounded-full bg-gold/80 md:-bottom-48 md:size-96" />
        <div data-reveal className="flex max-w-[36rem] flex-col gap-5">
          <h2 className="text-[1.9rem] md:text-[2.5rem]">{t.home.visit.title}</h2>
          <p className="text-lg text-ink/80">{t.home.visit.lead}</p>
          <CtaButtons lang={lang} t={t} />
        </div>
      </div>
    </section>
  );
}

/** Fixed bar on phones so the two actions are always one tap away. */
export function MobileCtaBar({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-paper/95 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-2.5">
        <Button asChild size="lg" className="w-full">
          <a href={whatsappUrl(t.common.whatsappPrefill)} target="_blank" rel="noopener noreferrer">
            <MessageCircleIcon data-icon="inline-start" />
            {t.common.whatsapp}
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full border-indigo text-indigo">
          <Link href={href(lang, "visit")}>
            <CalendarDaysIcon data-icon="inline-start" />
            {t.common.bookVisit}
          </Link>
        </Button>
      </div>
    </div>
  );
}
