import { cn } from "@/lib/utils";
import { site } from "@/content/site";

/** The rising-sun mark: a gold sun half above an indigo horizon. */
export function SunMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("size-10 shrink-0", className)}>
      <circle cx="24" cy="30" r="13" fill="var(--gold)" />
      <rect x="0" y="30" width="48" height="18" fill="var(--paper)" />
      <path d="M24 6v6M9.5 12.5l4.2 4.2M38.5 12.5l-4.2 4.2M4 25h5.5M38.5 25H44" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
      <path d="M4 31.5h40" stroke="var(--indigo)" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 38h24" stroke="var(--indigo)" strokeWidth="3" strokeLinecap="round" opacity=".35" />
    </svg>
  );
}

/** Name lock-up: mark, trading name and the Chinese name. */
export function Lockup({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <SunMark className={size === "lg" ? "size-12" : undefined} />
      <span className="flex flex-col leading-none">
        <span className={cn("font-heading font-bold tracking-tight text-ink", size === "lg" ? "text-2xl" : "text-[1.15rem]")}>
          {site.name}
        </span>
        <span lang="zh-Hans" className="mt-1 font-zh text-[0.8rem] tracking-[0.3em] text-muted-foreground">
          {site.nameZh}
        </span>
      </span>
    </span>
  );
}
