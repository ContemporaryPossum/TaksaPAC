"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fades sections up as they scroll into view. Anything already on screen is
 * marked visible before the `js` class goes on, so nothing above the fold
 * flickers. CSS skips the effect entirely under prefers-reduced-motion.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-visible])"));
    const fold = window.innerHeight;
    for (const el of items) {
      if (el.getBoundingClientRect().top < fold) el.dataset.visible = "";
    }
    document.documentElement.classList.add("js");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "";
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    for (const el of items) if (!("visible" in el.dataset)) io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
