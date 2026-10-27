import { ImageResponse } from "next/og";

import { site } from "@/content/site";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";

export const alt = `${site.name}, Kota Kemuning`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getDictionary(isLocale(lang) ? lang : "en");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#fcf7f4", padding: 72, color: "#262347" }}>
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 4, textTransform: "uppercase", color: "#5f5a7a" }}>{t.home.eyebrow}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, lineHeight: 1.05 }}>{site.name}</div>
          <div style={{ display: "flex", fontSize: 40, maxWidth: 900, color: "#34307a" }}>{t.home.title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 32 }}>{site.phone.display} · taskapac.com</div>
          <div style={{ display: "flex", width: 220, height: 110, borderTopLeftRadius: 110, borderTopRightRadius: 110, background: "#f0b429" }} />
        </div>
      </div>
    ),
    size,
  );
}
