import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Marked } from "@/components/marked";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Dictionary } from "@/lib/dictionary";
import { href, programmeKeys, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const cardTints = ["bg-apricot", "bg-lilac", "bg-white ring-1 ring-border", "bg-apricot/60"] as const;

export function ProgrammeCards({ lang, t, headingLevel = "h3" }: { lang: Locale; t: Dictionary; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {programmeKeys.map((key, i) => {
        const p = t.programmes.items[key];
        return (
          <li key={key} data-reveal className="flex">
            <Link
              href={href(lang, key)}
              className={cn("lift group flex w-full flex-col gap-3 rounded-[1.5rem] p-6 hover:shadow-[0_10px_30px_-12px_rgba(38,35,71,.25)]", cardTints[i])}
            >
              <span className="eyebrow text-indigo">
                {t.common.ages} <Marked text={p.ages} />
              </span>
              <Heading className="text-2xl">{p.name}</Heading>
              <p className="text-base text-ink/80">{p.summary}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-semibold text-indigo">
                {t.common.learnMore}
                <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** The shape of a day, as a vertical timeline. */
export function DayTimeline({ t, limit }: { t: Dictionary; limit?: number }) {
  const steps = limit ? t.day.steps.slice(0, limit) : t.day.steps;
  return (
    <ol className="relative flex flex-col gap-0 border-l-2 border-lilac pl-6 md:pl-8">
      {steps.map((step, i) => (
        <li key={i} data-reveal className="relative pb-7 last:pb-0">
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-1.5 -left-[calc(1.5rem+7px)] size-3 rounded-full ring-4 ring-paper md:-left-[calc(2rem+7px)]",
              i === 0 || i === steps.length - 1 ? "bg-gold" : "bg-indigo",
            )}
          />
          <p className="eyebrow">{step.time}</p>
          <h3 className="mt-1 text-xl">{step.title}</h3>
          <p className="mt-1 text-base text-muted-foreground">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function FaqList({ items, className }: { items: Dictionary["faq"]["items"]; className?: string }) {
  return (
    <Accordion type="single" collapsible className={cn("rounded-2xl bg-white px-5 ring-1 ring-border md:px-7", className)}>
      {items.map((item, i) => (
        <AccordionItem key={i} value={`q${i}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>
            <p className="max-w-[65ch] pb-2 text-lg leading-relaxed text-ink/85">
              <Marked text={item.a} />
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** A bulleted list where items may carry [TO CONFIRM] markers. */
export function MarkedList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-2.5", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.6em] size-2 shrink-0 rounded-full bg-gold" />
          <span>
            <Marked text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}
