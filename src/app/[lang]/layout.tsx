import type { Metadata, Viewport } from "next";
import { Figtree, Petrona } from "next/font/google";

import "../globals.css";
import { MobileCtaBar } from "@/components/cta";
import { RevealObserver } from "@/components/reveal-observer";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { site } from "@/content/site";
import { resolveLang } from "@/lib/dictionary";
import { htmlLang, locales } from "@/lib/i18n";

const petrona = Petrona({ subsets: ["latin"], variable: "--font-petrona", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  applicationName: site.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fcf7f4",
  colorScheme: "light",
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang, t } = await resolveLang(params);
  return (
    <html lang={htmlLang[lang]} className={`${petrona.variable} ${figtree.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-indigo px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t.common.skip}
        </a>
        <SiteHeader lang={lang} t={t} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter lang={lang} t={t} />
        <MobileCtaBar lang={lang} t={t} />
        <RevealObserver />
      </body>
    </html>
  );
}
