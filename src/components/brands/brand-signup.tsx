"use client";

import { useState } from "react";
import { Check, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { NICHES } from "@/lib/creators";

type Errors = Partial<Record<"company" | "email" | "gstin" | "form", string>>;

export function BrandSignup() {
  const [niches, setNiches] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [email, setEmail] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/brands/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, niches }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors ?? { form: "Something went wrong. Try again." });
        setStatus("idle");
        return;
      }
      setEmail(json.email);
      setStatus("done");
    } catch {
      setErrors({ form: "You look offline. Check your connection and try again." });
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-box bg-surface p-8 sm:p-10" role="status">
        <CheckCircle size={40} className="text-red-ink" aria-hidden="true" />
        <p className="h3 mt-5 text-2xl">You&apos;re on the list.</p>
        <p className="mt-3 max-w-[46ch] leading-relaxed text-muted">
          We&apos;ll email {email} when brand accounts open, with your shortlist tools ready. Until then, the whole board is open to browse.
        </p>
        <p className="mt-3 text-sm text-muted">Prototype: nothing was stored.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 rounded-box bg-surface p-6 sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="company" label="Brand or agency" error={errors.company}>
          <input id="company" name="company" className="input" autoComplete="organization" aria-invalid={!!errors.company} aria-describedby={errors.company ? "company-err" : undefined} />
        </Field>
        <Field id="email" label="Work email" help="Creators see which brand is asking." error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={`email-help${errors.email ? " email-err" : ""}`}
          />
        </Field>
      </div>
      <Field id="gstin" label="GSTIN (optional)" help="Add it now for GST invoices on paid features later." error={errors.gstin}>
        <input
          id="gstin"
          name="gstin"
          className="input sm:max-w-sm"
          autoCapitalize="characters"
          maxLength={15}
          aria-invalid={!!errors.gstin}
          aria-describedby={`gstin-help${errors.gstin ? " gstin-err" : ""}`}
        />
      </Field>
      <fieldset>
        <legend className="field-label">Niches you hire in</legend>
        <p className="field-help mt-1">Pick any. We&apos;ll start your shortlist with them.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {NICHES.map((n) => {
            const on = niches.includes(n);
            return (
              <button
                key={n}
                type="button"
                role="checkbox"
                aria-checked={on}
                className="chip"
                onClick={() => setNiches((cur) => (on ? cur.filter((x) => x !== n) : [...cur, n]))}
              >
                {on && <Check size={14} weight="bold" aria-hidden="true" />}
                {n}
              </button>
            );
          })}
        </div>
      </fieldset>
      {errors.form && (
        <p className="field-error" role="alert">
          <WarningCircle size={16} aria-hidden="true" />
          {errors.form}
        </p>
      )}
      <div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={status === "sending"}>
          {status === "sending" ? "Creating your account" : "Create brand account"}
        </button>
      </div>
    </form>
  );
}

function Field({ id, label, help, error, children }: { id: string; label: string; help?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid content-start gap-2">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {help && (
        <p id={`${id}-help`} className="field-help">
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="field-error">
          <WarningCircle size={16} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
