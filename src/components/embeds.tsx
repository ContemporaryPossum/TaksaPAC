"use client";

import { useState } from "react";
import { MapIcon, PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Google Maps only loads after the visitor asks for it, so no Google cookies
 * are set by default.
 */
export function MapEmbed({ query, title, showLabel, notice }: { query: string; title: string; showLabel: string; notice: string }) {
  const [shown, setShown] = useState(false);
  if (shown) {
    return (
      <iframe
        title={title}
        src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
        className="aspect-[4/3] w-full rounded-2xl border-0 md:aspect-[16/9]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }
  return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-4 rounded-2xl bg-lilac p-6 text-center md:aspect-[16/9]">
      <MapIcon className="size-10 text-indigo" aria-hidden="true" />
      <Button onClick={() => setShown(true)}>{showLabel}</Button>
      <p className="max-w-[40ch] text-sm text-muted-foreground">{notice}</p>
    </div>
  );
}

/** Privacy-enhanced YouTube player that loads on click, with captions on. */
export function VideoEmbed({ youtubeId, title, playLabel, notice }: { youtubeId: string; title: string; playLabel: string; notice: string }) {
  const [shown, setShown] = useState(false);
  if (shown) {
    return (
      <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&cc_load_policy=1&rel=0`}
        className="aspect-video w-full rounded-2xl border-0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-2xl bg-[radial-gradient(circle_at_50%_120%,var(--gold)_0_22%,var(--apricot)_22.5%_55%,var(--lilac)_55.5%)] p-6 text-center">
      <Button size="lg" onClick={() => setShown(true)}>
        <PlayIcon data-icon="inline-start" />
        {playLabel}
      </Button>
      <p className="max-w-[40ch] rounded-lg bg-paper/90 px-3 py-1 text-sm text-ink">{notice}</p>
    </div>
  );
}
