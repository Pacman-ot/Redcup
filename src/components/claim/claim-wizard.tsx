"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowSquareOut, Check, CheckCircle, Copy, InstagramLogo, Minus, Plus, WarningCircle } from "@phosphor-icons/react";
import { CupMark } from "@/components/logo";
import { CITIES, LANGUAGES, NICHES } from "@/lib/creators";
import { rupees } from "@/lib/format";
import { GST_RATE, gstFor, MAX_TOTAL, MIN_LISTING, priceForTop, RAISE_STEP, rankForAmount, type BoardEntry } from "@/lib/ranking";
import { amountError, handleError, normalizeHandle } from "@/lib/validate";

const STEPS = ["Handle", "Boards", "Amount", "Verify", "Pay"] as const;

interface Props {
  board: BoardEntry[];
  initial: { amount: number | null; niche: string | null; city: string | null; outrank: string | null };
}

export function ClaimWizard({ board, initial }: Props) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<null | { orderId: string; total: number }>(null);
  const [handle, setHandle] = useState("");
  const [handleErr, setHandleErr] = useState<string | null>(null);
  const [niche, setNiche] = useState<string | null>(initial.niche);
  const [city, setCity] = useState<string>(initial.city ?? "");
  const [langs, setLangs] = useState<string[]>([]);
  const [boardsErr, setBoardsErr] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(initial.amount ?? MIN_LISTING);
  const [amountErr, setAmountErr] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const existing = board.find((e) => e.handle === handle);
  const others = board.filter((e) => e.handle !== handle);
  const minAmount = existing ? RAISE_STEP : MIN_LISTING;
  const newTotal = (existing?.total ?? 0) + amount;
  const nicheBoard = others.filter((e) => e.niche === niche);
  const cityBoard = others.filter((e) => e.city === city);
  const outrankEntry = initial.outrank ? board.find((e) => e.handle === initial.outrank) : undefined;

  const ranks = {
    overall: rankForAmount(others, newTotal),
    niche: niche ? rankForAmount(nicheBoard, newTotal) : null,
    city: city ? rankForAmount(cityBoard, newTotal) : null,
  };

  const picks = useMemo(() => {
    const need = (target: number) => Math.max(minAmount, target - (existing?.total ?? 0));
    const list: { label: string; amount: number }[] = [];
    if (!existing) list.push({ label: "Get on the board", amount: MIN_LISTING });
    if (niche && nicheBoard.length >= 3) list.push({ label: `Top 3 in ${niche}`, amount: need(nicheBoard[2].total + 1) });
    if (niche) list.push({ label: `#1 in ${niche}`, amount: need(priceForTop(nicheBoard)) });
    list.push({ label: "#1 overall", amount: need(priceForTop(others)) });
    return list.filter((p, i, arr) => arr.findIndex((q) => q.amount === p.amount) === i);
  }, [niche, nicheBoard, others, existing, minAmount]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step, done]);

  function next() {
    if (step === 0) {
      const h = normalizeHandle(handle);
      const err = handleError(h);
      setHandle(h);
      setHandleErr(err);
      if (err) return;
    }
    if (step === 1 && !niche) {
      setBoardsErr("Pick the niche your audience would search for.");
      return;
    }
    if (step === 2) {
      const err = amountError(amount, minAmount);
      setAmountErr(err);
      if (err) return;
    }
    setStep((s) => s + 1);
  }

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
      <div className="min-w-0">
        {!done && (
          <ol className="grid grid-cols-5 gap-2" aria-label="Progress">
            {STEPS.map((label, i) => (
              <li key={label} aria-current={i === step ? "step" : undefined}>
                <span className={`block h-1.5 rounded-full transition-colors duration-500 ${i <= step ? "bg-red" : "bg-surface-2"}`} />
                <span className={`mt-2 block text-xs font-semibold sm:text-sm ${i === step ? "text-ink" : "text-muted"}`}>{label}</span>
              </li>
            ))}
          </ol>
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={done ? "done" : step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            {done ? (
              <Done handle={handle} niche={niche} rank={ranks.niche} overall={ranks.overall} total={done.total} headingRef={headingRef} />
            ) : step === 0 ? (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  next();
                }}
              >
                <h2 ref={headingRef} tabIndex={-1} className="h2 outline-none">
                  What&apos;s your Instagram handle?
                </h2>
                {outrankEntry && (
                  <p className="mt-4 text-muted">
                    You&apos;re bidding to pass <span className="font-semibold text-ink">@{outrankEntry.handle}</span>, #{outrankEntry.rank} with{" "}
                    {rupees(outrankEntry.total)}.
                  </p>
                )}
                <div className="mt-8 grid max-w-md gap-2">
                  <label htmlFor="handle" className="field-label">
                    Instagram handle
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 font-semibold text-muted">@</span>
                    <input
                      id="handle"
                      className="input !pl-10"
                      value={handle}
                      onChange={(e) => {
                        setHandle(e.target.value.replace(/^@/, ""));
                        setHandleErr(null);
                      }}
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      autoComplete="username"
                      aria-invalid={!!handleErr}
                      aria-describedby={`handle-help${handleErr ? " handle-err" : ""}`}
                    />
                  </div>
                  <p id="handle-help" className="field-help">
                    Your handle or a link to your profile. Any public account works.
                  </p>
                  {handleErr && <FieldError id="handle-err">{handleErr}</FieldError>}
                </div>
                <Nav onBack={null} nextLabel="Continue" />
              </form>
            ) : step === 1 ? (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  next();
                }}
              >
                <h2 ref={headingRef} tabIndex={-1} className="h2 outline-none">
                  Where should you rank?
                </h2>
                <fieldset className="mt-8">
                  <legend className="field-label">Niche</legend>
                  <p className="field-help mt-1">You compete on this board. Pick the one your audience would search for.</p>
                  <div role="radiogroup" aria-label="Niche" className="mt-3 flex flex-wrap gap-2">
                    {NICHES.map((n) => (
                      <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={niche === n}
                        className="chip"
                        onClick={() => {
                          setNiche(n);
                          setBoardsErr(null);
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  {boardsErr && (
                    <div className="mt-3">
                      <FieldError id="niche-err">{boardsErr}</FieldError>
                    </div>
                  )}
                </fieldset>

                <div className="mt-8 grid max-w-sm gap-2">
                  <label htmlFor="city" className="field-label">
                    City
                  </label>
                  <select id="city" className="input" value={city} onChange={(e) => setCity(e.target.value)} aria-describedby="city-help">
                    <option value="">Not on a city board</option>
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <p id="city-help" className="field-help">
                    City boards are smaller, so #1 costs less.
                  </p>
                </div>

                <fieldset className="mt-8">
                  <legend className="field-label">Languages</legend>
                  <p className="field-help mt-1">Pick up to two. Brands filter by language.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {LANGUAGES.map((l) => {
                      const on = langs.includes(l);
                      const full = !on && langs.length >= 2;
                      return (
                        <button
                          key={l}
                          type="button"
                          role="checkbox"
                          aria-checked={on}
                          aria-disabled={full}
                          className={`chip ${full ? "opacity-45" : ""}`}
                          onClick={() => !full && setLangs((cur) => (on ? cur.filter((x) => x !== l) : [...cur, l]))}
                        >
                          {on && <Check size={14} weight="bold" aria-hidden="true" />}
                          {l}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                <Nav onBack={back} nextLabel="Continue" />
              </form>
            ) : step === 2 ? (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  next();
                }}
              >
                <h2 ref={headingRef} tabIndex={-1} className="h2 outline-none">
                  {existing ? "How much do you want to add?" : "How much do you want to pay?"}
                </h2>
                {existing && (
                  <p className="mt-4 text-muted">
                    You&apos;re already #{existing.rank} with {rupees(existing.total)}. This payment adds to your total.
                  </p>
                )}

                <div className="mt-8 grid max-w-md gap-2">
                  <label htmlFor="amount" className="field-label">
                    Amount in rupees
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-quiet !size-14 !p-0"
                      aria-label={`Lower by ₹${RAISE_STEP}`}
                      onClick={() => {
                        setAmount((a) => Math.max(minAmount, a - RAISE_STEP));
                        setAmountErr(null);
                      }}
                    >
                      <Minus size={20} />
                    </button>
                    <div className="relative flex-1">
                      <span className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-xl font-bold text-muted">₹</span>
                      <input
                        id="amount"
                        inputMode="numeric"
                        className="input num !h-14 !pl-10 text-center !text-2xl font-extrabold tracking-tight"
                        value={amount ? String(amount) : ""}
                        onChange={(e) => {
                          const v = Number(e.target.value.replace(/[^0-9]/g, "").slice(0, 6));
                          setAmount(v);
                          setAmountErr(null);
                        }}
                        aria-invalid={!!amountErr}
                        aria-describedby={`amount-help${amountErr ? " amount-err" : ""}`}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-quiet !size-14 !p-0"
                      aria-label={`Raise by ₹${RAISE_STEP}`}
                      onClick={() => {
                        setAmount((a) => Math.min(MAX_TOTAL, a + RAISE_STEP));
                        setAmountErr(null);
                      }}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <p id="amount-help" className="field-help">
                    Whole rupees, from ₹{minAmount}. GST is added at checkout.
                  </p>
                  {amountErr && <FieldError id="amount-err">{amountErr}</FieldError>}
                </div>

                <div className="mt-6 flex flex-wrap gap-2" aria-label="Quick amounts">
                  {picks.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      className="chip !h-auto flex-col !items-start !gap-0 !rounded-box py-2.5"
                      aria-pressed={amount === p.amount}
                      onClick={() => {
                        setAmount(p.amount);
                        setAmountErr(null);
                      }}
                    >
                      <span className="text-xs">{p.label}</span>
                      <span className="num text-[0.9375rem] font-bold">{rupees(p.amount)}</span>
                    </button>
                  ))}
                </div>

                <dl className="mt-8 grid max-w-md grid-cols-[1fr_auto] gap-y-2 border-t border-line pt-6 text-[0.9375rem]">
                  <dt className="text-muted">Amount</dt>
                  <dd className="num text-right">{rupees(amount)}</dd>
                  <dt className="text-muted">GST ({Math.round(GST_RATE * 100)}%)</dt>
                  <dd className="num text-right">{rupees(gstFor(amount))}</dd>
                  <dt className="font-semibold">You pay</dt>
                  <dd className="num text-right font-bold">{rupees(amount + gstFor(amount))}</dd>
                </dl>
                <Nav onBack={back} nextLabel="Continue" />
              </form>
            ) : step === 3 ? (
              <Verify handle={handle} headingRef={headingRef} onBack={back} onVerified={() => setStep(4)} />
            ) : (
              <Pay
                handle={handle}
                amount={amount}
                niche={niche}
                city={city}
                headingRef={headingRef}
                onBack={back}
                onPaid={(o) => setDone(o)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live preview of the listing */}
      <aside className="order-first rounded-box bg-surface p-6 lg:sticky lg:top-24 lg:order-none lg:p-7" aria-label="Your listing">
        <p className="text-sm font-semibold text-muted">Your listing</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-red text-2xl font-extrabold text-on-red uppercase">
            {handle ? handle[0] : <CupMark className="size-7 text-on-red [--cup-band:var(--red)]" />}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold">{handle ? `@${handle}` : "@yourhandle"}</p>
            <p className="truncate text-sm text-muted">{[niche, city].filter(Boolean).join(", ") || "Pick your boards"}</p>
          </div>
        </div>
        <p className="num mt-6 text-[2.5rem] leading-none font-extrabold tracking-[-0.04em] [font-stretch:115%]">{rupees(newTotal)}</p>
        <p className="mt-1 text-sm text-muted">{existing ? "new all-time total" : "all-time total"}</p>

        <dl className="mt-6 grid gap-3 border-t border-line pt-5">
          <RankLine label="Overall" rank={ranks.overall} />
          {ranks.niche && <RankLine label={niche!} rank={ranks.niche} />}
          {ranks.city && <RankLine label={city} rank={ranks.city} />}
        </dl>
        <p className="mt-5 text-xs leading-relaxed text-muted">Paid ranking. Ranks can change the moment someone else bids.</p>
      </aside>
    </div>
  );
}

function RankLine({ label, rank }: { label: string; rank: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[0.9375rem] text-muted">{label}</dt>
      <dd className={`num text-xl font-extrabold [font-stretch:112%] ${rank === 1 ? "text-red-ink" : ""}`}>#{rank}</dd>
    </div>
  );
}

function Nav({ onBack, nextLabel, busy = false }: { onBack: (() => void) | null; nextLabel: string; busy?: boolean }) {
  return (
    <div className="mt-10 flex gap-3">
      {onBack && (
        <button type="button" className="btn btn-quiet btn-lg" onClick={onBack}>
          Back
        </button>
      )}
      <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
        {nextLabel}
      </button>
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="field-error">
      <WarningCircle size={16} aria-hidden="true" />
      {children}
    </p>
  );
}

function Verify({
  handle,
  headingRef,
  onBack,
  onVerified,
}: {
  handle: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onVerified: () => void;
}) {
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [state, setState] = useState<"loading" | "ready" | "checking" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function start() {
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/claim/start", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ handle }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCode(json.code);
      setExpiresAt(json.expiresAt);
      setState("ready");
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "We couldn't create a code. Try again.");
      setState("error");
    }
  }

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  async function confirm() {
    setState("checking");
    setError(null);
    await new Promise((r) => setTimeout(r, 1100));
    try {
      const res = await fetch("/api/claim/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ handle, code }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onVerified();
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "We couldn't find your DM yet. Send it, then try again.");
      setState("ready");
    }
  }

  async function copy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const left = Math.max(0, expiresAt - now);
  const mm = String(Math.floor(left / 60000)).padStart(2, "0");
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");

  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="h2 outline-none">
        Prove it&apos;s you.
      </h2>
      <p className="lede mt-4">Send one DM from @{handle}. No password, and we never post for you.</p>

      <ol className="mt-8 grid max-w-lg gap-6">
        <li>
          <p className="field-label">Copy this code</p>
          <div className="mt-3 flex items-center gap-3">
            {state === "loading" ? (
              <span className="skeleton block h-16 w-56 rounded-box" aria-label="Creating your code" />
            ) : (
              <span className="num rounded-box bg-surface-2 px-5 py-3 text-[2rem] font-extrabold tracking-[0.18em] [font-stretch:110%]">{code ?? "------"}</span>
            )}
            <button type="button" className="btn btn-quiet" onClick={copy} disabled={!code}>
              {copied ? <Check size={18} weight="bold" /> : <Copy size={18} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          {state !== "loading" && code && (
            <p className="field-help mt-2">
              {left > 0 ? (
                <>
                  Expires in <span className="num">{mm}:{ss}</span>.
                </>
              ) : (
                "This code expired."
              )}
            </p>
          )}
        </li>
        <li>
          <p className="field-label">Send it to @redcup.in on Instagram</p>
          <a href="https://ig.me/m/redcup.in" target="_blank" rel="noreferrer" className="btn btn-ghost mt-3">
            <InstagramLogo size={20} aria-hidden="true" />
            Open Instagram DM
            <ArrowSquareOut size={16} aria-hidden="true" />
          </a>
        </li>
        <li>
          <p className="field-label">Come back and confirm</p>
          <p className="field-help mt-1">Prototype: any issued code is accepted without a real DM.</p>
        </li>
      </ol>

      {error && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <FieldError id="verify-err">{error}</FieldError>
          {state === "error" || left === 0 ? (
            <button type="button" className="btn btn-quiet btn-sm" onClick={start}>
              Get a new code
            </button>
          ) : null}
        </div>
      )}

      <div className="mt-10 flex gap-3">
        <button type="button" className="btn btn-quiet btn-lg" onClick={onBack}>
          Back
        </button>
        {left === 0 && code ? (
          <button type="button" className="btn btn-primary btn-lg" onClick={start}>
            Get a new code
          </button>
        ) : (
          <button type="button" className="btn btn-primary btn-lg" onClick={confirm} disabled={state !== "ready"}>
            {state === "checking" ? "Checking for your DM" : "I've sent it"}
          </button>
        )}
      </div>
    </div>
  );
}

function Pay({
  handle,
  amount,
  niche,
  city,
  headingRef,
  onBack,
  onPaid,
}: {
  handle: string;
  amount: number;
  niche: string | null;
  city: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onPaid: (o: { orderId: string; total: number }) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const gst = gstFor(amount);

  async function pay() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ handle, amount }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      await new Promise((r) => setTimeout(r, 700));
      onPaid({ orderId: json.orderId, total: json.total });
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Checkout didn't open. Try again.");
      setBusy(false);
    }
  }

  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="h2 outline-none">
        Pay and take your spot.
      </h2>
      <p className="mt-4 inline-flex items-center gap-2 font-semibold text-red-ink">
        <CheckCircle size={20} weight="fill" aria-hidden="true" /> @{handle} is verified.
      </p>

      <dl className="mt-8 grid max-w-md grid-cols-[1fr_auto] gap-x-6 gap-y-3 text-[0.9375rem]">
        <dt className="text-muted">Handle</dt>
        <dd className="text-right font-semibold">@{handle}</dd>
        <dt className="text-muted">Boards</dt>
        <dd className="text-right">{[niche, city].filter(Boolean).join(", ")}</dd>
        <dt className="text-muted">Amount</dt>
        <dd className="num text-right">{rupees(amount)}</dd>
        <dt className="text-muted">GST ({Math.round(GST_RATE * 100)}%)</dt>
        <dd className="num text-right">{rupees(gst)}</dd>
        <dt className="border-t border-line pt-3 font-semibold">You pay</dt>
        <dd className="num border-t border-line pt-3 text-right text-xl font-extrabold">{rupees(amount + gst)}</dd>
      </dl>
      <p className="field-help mt-4 max-w-md">UPI, cards and netbanking through Razorpay. Payments are final. Your rank goes live the moment the payment clears.</p>

      {error && (
        <div className="mt-5">
          <FieldError id="pay-err">{error}</FieldError>
        </div>
      )}

      <div className="mt-10 flex gap-3">
        <button type="button" className="btn btn-quiet btn-lg" onClick={onBack} disabled={busy}>
          Back
        </button>
        <button type="button" className="btn btn-primary btn-lg" onClick={pay} disabled={busy}>
          {busy ? "Opening checkout" : `Pay ${rupees(amount + gst)}`}
        </button>
      </div>
    </div>
  );
}

function Done({
  handle,
  niche,
  rank,
  overall,
  total,
  headingRef,
}: {
  handle: string;
  niche: string | null;
  rank: number | null;
  overall: number;
  total: number;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const [copied, setCopied] = useState(false);
  const link = `redcup.in/c/${handle}`;
  return (
    <div>
      <CupMark className="size-14 text-red" />
      <h2 ref={headingRef} tabIndex={-1} className="display mt-6 text-[clamp(2.5rem,5vw,4rem)] outline-none">
        You&apos;re #{rank ?? overall}
        {niche ? ` in ${niche}.` : "."}
      </h2>
      <p className="lede mt-5">
        #{overall} overall. On the live site, this is when @{handle} appears on the board for brands, and you get a WhatsApp alert whenever someone outbids you.
      </p>
      <div className="mt-8 flex max-w-md items-center gap-3 rounded-full bg-surface-2 py-2 pr-2 pl-5">
        <span className="min-w-0 flex-1 truncate font-semibold">{link}</span>
        <button
          type="button"
          className="btn btn-quiet btn-sm bg-surface"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(`https://${link}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? <Check size={16} weight="bold" /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
      <p className="mt-4 text-sm text-muted">Demo checkout: {rupees(total)} would have been charged. No money moved.</p>
      <Link href="/board" className="btn btn-primary btn-lg mt-10">
        See the board
      </Link>
    </div>
  );
}
