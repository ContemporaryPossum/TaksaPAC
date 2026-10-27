import Link from "next/link";
import { lang as rootLang } from "next/root-params";

import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionary";
import { defaultLocale, href, isLocale } from "@/lib/i18n";

export default async function NotFound() {
  const raw = await rootLang();
  const lang = raw && isLocale(raw) ? raw : defaultLocale;
  const t = getDictionary(lang);
  return (
    <section className="container-page flex flex-col items-start gap-5 py-20 md:py-28">
      <p className="eyebrow border-t border-lilac pt-3">404</p>
      <h1 className="text-[2.25rem] md:text-[3rem]">{t.notFound.title}</h1>
      <p className="text-lg text-muted-foreground">{t.notFound.body}</p>
      <Button asChild size="lg">
        <Link href={href(lang, "home")}>{t.notFound.home}</Link>
      </Button>
    </section>
  );
}
