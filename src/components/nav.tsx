"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { href, internalSlug, isLocale, keyForInternalSlug, otherLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string };

function isActive(pathname: string, itemHref: string) {
  return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
}

export function NavLinks({ items, className, onNavigate }: { items: NavItem[]; className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full px-3 font-semibold text-ink/85 transition-colors hover:bg-lilac hover:text-ink",
                active && "bg-lilac text-ink",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Link to the same page in the other language. */
export function LanguageSwitch({ lang, label, ariaLabel, className }: { lang: Locale; label: string; ariaLabel: string; className?: string }) {
  const pathname = usePathname();
  const target = otherLocale(lang);
  const [, first, ...rest] = pathname.split("/");
  const slug = rest.join("/");
  let to = href(target, "home");
  if (first && isLocale(first) && slug) {
    const internal = internalSlug(first, slug) ?? slug;
    const key = keyForInternalSlug(internal);
    if (key) to = href(target, key);
  }
  return (
    <Link
      href={to}
      hrefLang={target === "ms" ? "ms-MY" : "en-MY"}
      lang={target === "ms" ? "ms" : "en"}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-semibold text-ink hover:bg-lilac",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export function MobileMenu({
  items,
  labels,
  children,
}: {
  items: NavItem[];
  labels: { menu: string; close: string };
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the menu after any navigation, including back and forward.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <Button
        ref={buttonRef}
        variant="outline"
        size="icon"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.menu}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <XIcon /> : <MenuIcon />}
      </Button>
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto border-t border-border bg-paper px-4 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))]"
      >
        <NavLinks
          items={items}
          onNavigate={() => setOpen(false)}
          className="flex flex-col gap-1 text-xl [&_a]:min-h-12 [&_a]:w-full [&_a]:px-4"
        />
        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">{children}</div>
      </div>
    </div>
  );
}
