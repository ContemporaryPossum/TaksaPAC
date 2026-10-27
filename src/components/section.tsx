import { cn } from "@/lib/utils";

/** Small uppercase label, then a sentence-style heading and an optional lead. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
  className,
  id,
}: {
  eyebrow?: string;
  title: string;
  lead?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
  id?: string;
}) {
  return (
    <div data-reveal className={cn("flex max-w-[42rem] flex-col gap-3", className)}>
      {eyebrow ? <p className="eyebrow border-t border-lilac pt-3">{eyebrow}</p> : null}
      <Tag id={id} className={Tag === "h1" ? "text-[2.25rem] md:text-[3.25rem]" : "text-[1.75rem] md:text-[2.25rem]"}>
        {title}
      </Tag>
      {lead ? <p className="text-lg text-muted-foreground md:text-xl">{lead}</p> : null}
    </div>
  );
}

/** Page-level opening used on inner pages. */
export function PageIntro({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: React.ReactNode }) {
  return (
    <section className="container-page pt-10 pb-8 md:pt-16 md:pb-12">
      <SectionHeading as="h1" eyebrow={eyebrow} title={title} lead={lead} />
    </section>
  );
}
