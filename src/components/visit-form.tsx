"use client";

import Link from "next/link";
import Script from "next/script";
import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2Icon, MessageCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { whatsappUrl } from "@/content/site";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { submitVisit, type VisitField, type VisitState } from "@/lib/visit-action";

type Copy = Dictionary["visit"];

const selectClass =
  "h-12 w-full min-w-0 appearance-none rounded-xl border border-input bg-white bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2334307a%22%20stroke-width=%222%22%3E%3Cpath%20d=%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_0.9rem_center] bg-no-repeat px-4 pr-11 text-lg outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20";

export function VisitForm({ lang, copy, privacyHref, turnstileSiteKey }: { lang: Locale; copy: Copy; privacyHref: string; turnstileSiteKey?: string }) {
  const [round, setRound] = useState(0);
  return <VisitFormInner key={round} lang={lang} copy={copy} privacyHref={privacyHref} turnstileSiteKey={turnstileSiteKey} onReset={() => setRound((r) => r + 1)} />;
}

function VisitFormInner({
  lang,
  copy,
  privacyHref,
  turnstileSiteKey,
  onReset,
}: {
  lang: Locale;
  copy: Copy;
  privacyHref: string;
  turnstileSiteKey?: string;
  onReset: () => void;
}) {
  const [state, formAction, pending] = useActionState<VisitState, FormData>(submitVisit.bind(null, lang), { status: "idle" });
  const dateRef = useRef<HTMLInputElement>(null);
  const startedRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const f = copy.form;

  // The page is prerendered, so "tomorrow" and the start time are set in the browser.
  useEffect(() => {
    const tomorrow = new Date(Date.now() + 86_400_000);
    dateRef.current?.setAttribute("min", new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kuala_Lumpur" }).format(tomorrow));
    if (startedRef.current) startedRef.current.value = String(Date.now());
  }, [state]);

  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} className="flex flex-col items-start gap-4 rounded-[1.5rem] bg-white p-6 ring-1 ring-border outline-none md:p-8" role="status">
        <CheckCircle2Icon className="size-10 text-whatsapp" aria-hidden="true" />
        <h2 className="text-2xl">{copy.success.title}</h2>
        <p className="text-lg text-muted-foreground">{copy.success.body}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href={whatsappUrl(copy.whatsappPrefill)} target="_blank" rel="noopener noreferrer">
              <MessageCircleIcon data-icon="inline-start" />
              WhatsApp
            </a>
          </Button>
          <Button size="lg" variant="outline" onClick={onReset}>
            {copy.success.again}
          </Button>
        </div>
      </div>
    );
  }

  const err = (name: VisitField) => state.errors?.[name];
  const v = state.values ?? {};
  const describe = (name: VisitField, hint?: boolean) =>
    [hint ? `${name}-hint` : null, err(name) ? `${name}-error` : null].filter(Boolean).join(" ") || undefined;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6 rounded-[1.5rem] bg-white p-5 ring-1 ring-border md:p-8">
      {state.status === "error" && state.formError ? (
        <div ref={summaryRef} tabIndex={-1} className="outline-none">
          <Alert variant="destructive">
            <AlertTitle>{state.formError}</AlertTitle>
            {state.errors ? (
              <AlertDescription>
                <ul className="list-disc pl-5">
                  {Object.entries(state.errors).map(([name, message]) => (
                    <li key={name}>
                      <a href={`#${name}`} className="underline">
                        {message}
                      </a>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            ) : null}
          </Alert>
        </div>
      ) : null}

      {/* Spam traps: hidden from people, filled by bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedRef} type="hidden" name="startedAt" defaultValue="" />

      <FieldGroup>
        <div className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={!!err("parentName")}>
            <FieldLabel htmlFor="parentName">{f.parentName}</FieldLabel>
            <Input id="parentName" name="parentName" autoComplete="name" required maxLength={80} defaultValue={v.parentName} aria-invalid={!!err("parentName")} aria-describedby={describe("parentName")} />
            {err("parentName") ? <FieldError id="parentName-error">{err("parentName")}</FieldError> : null}
          </Field>
          <Field data-invalid={!!err("phone")}>
            <FieldLabel htmlFor="phone">{f.phone}</FieldLabel>
            <Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required defaultValue={v.phone} aria-invalid={!!err("phone")} aria-describedby={describe("phone", true)} />
            <FieldDescription id="phone-hint">{f.phoneHint}</FieldDescription>
            {err("phone") ? <FieldError id="phone-error">{err("phone")}</FieldError> : null}
          </Field>
        </div>

        <Field data-invalid={!!err("email")}>
          <FieldLabel htmlFor="email">{f.email}</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="email" maxLength={120} defaultValue={v.email} aria-invalid={!!err("email")} aria-describedby={describe("email")} />
          {err("email") ? <FieldError id="email-error">{err("email")}</FieldError> : null}
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={!!err("ageBand")}>
            <FieldLabel htmlFor="ageBand">{f.ageBand}</FieldLabel>
            <select key={`ageBand-${v.ageBand ?? ""}`} id="ageBand" name="ageBand" required defaultValue={v.ageBand ?? ""} className={selectClass} aria-invalid={!!err("ageBand")} aria-describedby={describe("ageBand")}>
              <option value="" disabled>
                {f.select}
              </option>
              {Object.entries(f.ageOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {err("ageBand") ? <FieldError id="ageBand-error">{err("ageBand")}</FieldError> : null}
          </Field>
          <Field data-invalid={!!err("language")}>
            <FieldLabel htmlFor="language">{f.language}</FieldLabel>
            <select key={`language-${v.language ?? lang}`} id="language" name="language" required defaultValue={v.language ?? lang} className={selectClass} aria-invalid={!!err("language")} aria-describedby={describe("language")}>
              {Object.entries(f.languageOptions).map(([value, label]) => (
                <option key={value} value={value} lang={value === "zh" ? "zh-Hans" : value}>
                  {label}
                </option>
              ))}
            </select>
            {err("language") ? <FieldError id="language-error">{err("language")}</FieldError> : null}
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={!!err("date")}>
            <FieldLabel htmlFor="date">{f.date}</FieldLabel>
            <Input ref={dateRef} id="date" name="date" type="date" required defaultValue={v.date} aria-invalid={!!err("date")} aria-describedby={describe("date")} />
            {err("date") ? <FieldError id="date-error">{err("date")}</FieldError> : null}
          </Field>
          <Field data-invalid={!!err("time")}>
            <FieldLabel htmlFor="time">{f.time}</FieldLabel>
            <select key={`time-${v.time ?? ""}`} id="time" name="time" required defaultValue={v.time ?? ""} className={selectClass} aria-invalid={!!err("time")} aria-describedby={describe("time")}>
              <option value="" disabled>
                {f.select}
              </option>
              {Object.entries(f.timeOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {err("time") ? <FieldError id="time-error">{err("time")}</FieldError> : null}
          </Field>
        </div>

        <Field data-invalid={!!err("message")}>
          <FieldLabel htmlFor="message">{f.message}</FieldLabel>
          <Textarea id="message" name="message" maxLength={1000} rows={4} defaultValue={v.message} aria-invalid={!!err("message")} aria-describedby={describe("message", true)} />
          <FieldDescription id="message-hint">{f.messageHint}</FieldDescription>
          {err("message") ? <FieldError id="message-error">{err("message")}</FieldError> : null}
        </Field>

        <Field orientation="horizontal" data-invalid={!!err("consent")}>
          <Checkbox key={`consent-${v.consent ?? ""}`} defaultChecked={v.consent === "on"} id="consent" name="consent" required aria-invalid={!!err("consent")} aria-describedby={describe("consent")} />
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="consent" className="text-base leading-snug font-normal">
              {f.consent}
            </FieldLabel>
            <Link href={privacyHref} className="inline-flex min-h-11 items-center self-start text-base font-semibold text-indigo underline">
              {f.privacyLink}
            </Link>
            {err("consent") ? <FieldError id="consent-error">{err("consent")}</FieldError> : null}
          </div>
        </Field>
      </FieldGroup>

      {turnstileSiteKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-language={lang} />
        </>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className={cn("self-start", pending && "cursor-progress")}>
        {pending ? f.sending : f.submit}
      </Button>
    </form>
  );
}
