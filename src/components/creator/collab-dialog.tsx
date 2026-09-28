"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle, PaperPlaneTilt, WarningCircle, X } from "@phosphor-icons/react";
import { BUDGETS } from "@/lib/options";

type Errors = Partial<Record<"brand" | "email" | "budget" | "brief" | "form", string>>;

export function CollabButton({ handle, name }: { handle: string; name: string }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button ref={trigger} type="button" className="btn btn-primary btn-lg" onClick={() => setOpen(true)}>
        <PaperPlaneTilt size={20} aria-hidden="true" />
        Send collab request
      </button>
      <AnimatePresence>
        {open && (
          <CollabDialog
            handle={handle}
            name={name}
            onClose={() => {
              setOpen(false);
              trigger.current?.focus();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function CollabDialog({ handle, name, onClose }: { handle: string; name: string; onClose: () => void }) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [brief, setBrief] = useState("");

  useEffect(() => {
    panel.current?.querySelector<HTMLInputElement>("input")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("button, input, select, textarea, a[href]");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/collab-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, handle }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors ?? { form: "Something went wrong. Try again." });
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setErrors({ form: "You look offline. Check your connection and try again." });
      setStatus("idle");
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgb(17_15_14/0.62)] p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-box bg-bg p-6 shadow-[var(--shadow)] sm:rounded-box sm:p-8"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="h3 text-2xl">
            {status === "sent" ? "Request sent." : `Work with ${name}`}
          </h2>
          <button type="button" onClick={onClose} className="btn btn-quiet btn-sm !px-2.5" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {status === "sent" ? (
          <div className="mt-6">
            <CheckCircle size={40} className="text-red-ink" aria-hidden="true" />
            <p className="mt-4 leading-relaxed">
              @{handle} gets your brief on WhatsApp. Replies come to your email. Most creators answer within two days.
            </p>
            <p className="mt-3 text-sm text-muted">Prototype: nothing was actually sent.</p>
            <button type="button" className="btn btn-quiet mt-8" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-6 grid gap-5">
            <Field id="brand" label="Brand name" error={errors.brand}>
              <input id="brand" name="brand" className="input" autoComplete="organization" aria-invalid={!!errors.brand} aria-describedby={errors.brand ? "brand-err" : undefined} />
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
            <Field id="budget" label="Budget for this collab" error={errors.budget}>
              <select id="budget" name="budget" className="input" defaultValue="" aria-invalid={!!errors.budget} aria-describedby={errors.budget ? "budget-err" : undefined}>
                <option value="" disabled>
                  Pick a range
                </option>
                {BUDGETS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field id="brief" label="Brief" help={`${brief.length} of 600 characters. Say what you want made and when.`} error={errors.brief}>
              <textarea
                id="brief"
                name="brief"
                className="input"
                maxLength={600}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                aria-invalid={!!errors.brief}
                aria-describedby={`brief-help${errors.brief ? " brief-err" : ""}`}
              />
            </Field>
            {errors.form && (
              <p className="field-error" role="alert">
                <WarningCircle size={16} aria-hidden="true" />
                {errors.form}
              </p>
            )}
            <button type="submit" className="btn btn-primary btn-lg" disabled={status === "sending"}>
              {status === "sending" ? "Sending your request" : "Send collab request"}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

function Field({ id, label, help, error, children }: { id: string; label: string; help?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
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
