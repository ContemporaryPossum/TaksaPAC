import { ClockIcon, MapPinIcon } from "lucide-react";

import { fullAddress, mapsUrl, site, type LocationKey } from "@/content/site";
import type { Dictionary } from "@/lib/dictionary";
import { cn } from "@/lib/utils";

function to12h(time: string, lang: "en" | "ms") {
  const [h, m] = time.split(":").map(Number);
  const suffix = lang === "en" ? (h < 12 ? "am" : "pm") : h < 12 ? "pagi" : h < 13 ? "tengah hari" : h < 19 ? "petang" : "malam";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}${m ? `:${String(m).padStart(2, "0")}` : ""} ${suffix}`;
}

export function HoursList({ t, lang, className }: { t: Dictionary; lang: "en" | "ms"; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h3 className="flex items-center gap-2 font-sans text-lg font-bold">
        <ClockIcon className="size-5 text-indigo" aria-hidden="true" />
        {t.hours.title}
      </h3>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 tabular-nums">
        {site.hours.map((row) => (
          <div key={row.days} className="contents">
            <dt className="text-muted-foreground">{t.hours[row.days]}</dt>
            <dd className="m-0 font-semibold">
              {row.opens && row.closes ? `${to12h(row.opens, lang)} – ${to12h(row.closes, lang)}` : t.hours.closed}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-base text-muted-foreground">{t.hours.holidays}</p>
    </div>
  );
}

export function LocationCards({ t, className }: { t: Dictionary; className?: string }) {
  const items: { key: LocationKey; name: string; note: string }[] = [
    { key: "taska", name: t.locations.taska, note: t.locations.taskaNote },
    { key: "tadika", name: t.locations.tadika, note: t.locations.tadikaNote },
  ];
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <div key={item.key} className="flex flex-col gap-2 rounded-2xl bg-white p-5 ring-1 ring-border">
          <p className="eyebrow">{item.note}</p>
          <h3 className="text-xl">{item.name}</h3>
          <address className="not-italic text-base leading-relaxed">{fullAddress(item.key)}</address>
          <a
            href={mapsUrl(item.key)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex min-h-11 items-center gap-2 font-semibold text-indigo underline"
          >
            <MapPinIcon className="size-5" aria-hidden="true" />
            {t.common.openInMaps}
          </a>
        </div>
      ))}
    </div>
  );
}
