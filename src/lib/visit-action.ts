"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

import { site } from "@/content/site";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, type Locale } from "@/lib/i18n";

export type VisitField = "parentName" | "phone" | "email" | "ageBand" | "date" | "time" | "language" | "message" | "consent";

export type VisitState = {
  status: "idle" | "error" | "success";
  errors?: Partial<Record<VisitField, string>>;
  formError?: string;
  values?: Partial<Record<VisitField, string>>;
};

const AGE_BANDS = ["under2", "2-3", "4-6", "unsure"] as const;
const TIMES = ["morning", "afternoon", "saturday"] as const;
const LANGS = ["en", "ms", "zh"] as const;

// Best-effort limit per server instance: 5 requests per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

function malaysiaDate(offsetDays: number) {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kuala_Lumpur", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

function schema() {
  const tomorrow = malaysiaDate(1);
  const latest = malaysiaDate(180);
  return z.object({
    parentName: z.string().trim().min(2).max(80),
    phone: z
      .string()
      .trim()
      .transform((s) => s.replace(/[\s()-]/g, ""))
      .pipe(z.string().regex(/^(\+?60|0)\d{8,10}$/)),
    email: z.union([z.literal(""), z.email().max(120)]),
    ageBand: z.enum(AGE_BANDS),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine((d) => d >= tomorrow && d <= latest),
    time: z.enum(TIMES),
    language: z.enum(LANGS),
    message: z.string().trim().max(1000),
    consent: z.literal("on"),
  });
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function submitVisit(lang: Locale, _prev: VisitState, formData: FormData): Promise<VisitState> {
  const t = getDictionary(isLocale(lang) ? lang : "en").visit;
  const field = (name: VisitField) => String(formData.get(name) ?? "");
  const values = Object.fromEntries(
    (["parentName", "phone", "email", "ageBand", "date", "time", "language", "message", "consent"] as const).map((k) => [k, field(k)]),
  ) as Partial<Record<VisitField, string>>;

  // Bots fill the hidden field or submit within a couple of seconds. Pretend it worked.
  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (String(formData.get("company") ?? "") !== "" || (startedAt && Date.now() - startedAt < 2500)) {
    return { status: "success" };
  }

  const h = await headers();
  const ip = h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return { status: "error", formError: t.errors.rate, values };

  if (!(await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""), ip))) {
    return { status: "error", formError: t.errors.spam, values };
  }

  const parsed = schema().safeParse(values);
  if (!parsed.success) {
    const errors: Partial<Record<VisitField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as VisitField;
      if (key && !errors[key]) errors[key] = t.errors[key];
    }
    return { status: "error", errors, formError: t.errors.summary, values };
  }

  const data = parsed.data;
  const en = getDictionary("en").visit.form;
  const text = [
    "New visit request from the website",
    "",
    `Parent: ${data.parentName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email || "(not given)"}`,
    `Child's age: ${en.ageOptions[data.ageBand]}`,
    `Preferred date: ${data.date}`,
    `Preferred time: ${en.timeOptions[data.time]}`,
    `Reply in: ${en.languageOptions[data.language]}`,
    `Page language: ${lang}`,
    "",
    "Message:",
    data.message || "(none)",
    "",
    "This person agreed to the privacy notice. Please don't forward this email outside PAC.",
  ].join("\n");

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[visit] RESEND_API_KEY is not set, so the email was not sent (${text.length} characters).`);
      return { status: "success" };
    }
    console.error("[visit] RESEND_API_KEY is not set in production.");
    return { status: "error", formError: t.errors.server, values };
  }

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? "PAC website <onboarding@resend.dev>",
      to: process.env.ENQUIRY_TO ?? site.email,
      replyTo: data.email || undefined,
      subject: `Visit request: age ${en.ageOptions[data.ageBand]}, ${data.date}`,
      text,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("[visit] Email failed:", err instanceof Error ? err.message : "unknown error");
    return { status: "error", formError: t.errors.server, values };
  }

  return { status: "success" };
}
