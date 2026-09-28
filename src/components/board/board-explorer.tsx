"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lightning, MagnifyingGlass, UsersThree, WarningCircle } from "@phosphor-icons/react";
import { AnimatedRupees } from "@/components/animated-rupees";
import { CupMark } from "@/components/logo";
import { Avatar } from "@/components/photo";
import { useLiveTicker } from "@/components/use-live-bids";
import { CITIES, NICHES } from "@/lib/creators";
import { compact, rupees, timeAgo } from "@/lib/format";
import { priceForTop, priceToPass, sortAndRank, TOP_STEP, WINDOW_LABEL, type BidEvent, type BoardEntry, type BoardWindow } from "@/lib/ranking";

interface Props {
  initial: {
    now: number;
    window: BoardWindow;
    niche: string | null;
    city: string | null;
    entries: BoardEntry[];
    latest: BidEvent[];
  };
}

type Status = "ready" | "loading" | "error";
const spring = { type: "spring", stiffness: 260, damping: 30 } as const;

export function BoardExplorer({ initial }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [window_, setWindow] = useState<BoardWindow>(initial.window);
  const [niche, setNiche] = useState<string | null>(initial.niche);
  const [city, setCity] = useState<string | null>(initial.city);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState(initial.entries);
  const [latest, setLatest] = useState(initial.latest);
  const [now, setNow] = useState(initial.now);
  const [status, setStatus] = useState<Status>("ready");
  const [bumped, setBumped] = useState<string | null>(null);
  const [live, setLive] = useState(true);
  const first = useRef(true);

  const load = useCallback(async () => {
    setStatus("loading");
    const params = new URLSearchParams({ window: window_ });
    if (niche) params.set("niche", niche);
    if (city) params.set("city", city);
    if (query.trim()) params.set("q", query.trim());
    try {
      const res = await fetch(`/api/board?${params}`);
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setEntries(data.entries);
      setLatest(data.latest);
      setNow(data.now);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [window_, niche, city, query]);

  // Refetch when a filter changes (search waits for a pause in typing).
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(load, query ? 280 : 0);
    const params = new URLSearchParams();
    if (window_ !== "all") params.set("window", window_);
    if (niche) params.set("niche", niche);
    if (city) params.set("city", city);
    router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
    return () => clearTimeout(t);
  }, [window_, niche, city, query, load, pathname, router]);

  // Sample bids, so you can watch the board move. Never sent anywhere.
  const { ref: liveRef, reduce } = useLiveTicker<HTMLDivElement>(
    () => {
      if (entries.length < 4 || status !== "ready") return;
      const i = 2 + Math.floor(Math.random() * Math.min(entries.length - 2, 8));
      const jump = 1 + Math.floor(Math.random() * 2);
      const target = entries[Math.max(0, i - jump)];
      const mover = entries[i];
      const extra = target.rank === 1 ? TOP_STEP : 10;
      const total = target.total + extra + 10 * Math.floor(Math.random() * 12);
      const added = total - mover.total;
      setEntries(sortAndRank(entries.map((e) => (e.handle === mover.handle ? { ...e, total } : e))));
      setBumped(mover.handle);
      const t = Date.now();
      setNow(t);
      setLatest((l) => [{ handle: mover.handle, name: mover.name, niche: mover.niche, photo: mover.photo, amount: added, at: t }, ...l].slice(0, 6));
    },
    7000,
    live,
  );

  // The on/off switch only makes sense once we know motion is allowed (client only).
  const [canAnimate, setCanAnimate] = useState(false);
  useEffect(() => setCanAnimate(!reduce), [reduce]);

  // Clear the highlight on a row that just moved.
  useEffect(() => {
    if (!bumped) return;
    const t = setTimeout(() => setBumped(null), 1800);
    return () => clearTimeout(t);
  }, [bumped]);

  const topPrice = priceForTop(entries);
  const scope = [niche ? `in ${niche}` : null, city ? `in ${city}` : null].filter(Boolean).join(" ");
  const claimHref = useMemo(() => {
    const p = new URLSearchParams({ amount: String(topPrice) });
    if (niche) p.set("niche", niche);
    if (city) p.set("city", city);
    return `/claim?${p}`;
  }, [topPrice, niche, city]);

  return (
    <div ref={liveRef} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-14">
      <div className="min-w-0">
        {/* Controls */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
            <div>
              <p id="window-label" className="field-label mb-2">
                Board
              </p>
              <div role="group" aria-labelledby="window-label" className="inline-flex gap-1 rounded-full bg-surface-2 p-1">
                {(Object.keys(WINDOW_LABEL) as BoardWindow[]).map((w) => (
                  <button
                    key={w}
                    type="button"
                    aria-pressed={window_ === w}
                    onClick={() => setWindow(w)}
                    className={`h-10 rounded-full px-4 text-[0.9375rem] font-semibold transition-colors ${window_ === w ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
                  >
                    {WINDOW_LABEL[w]}
                  </button>
                ))}
              </div>
            </div>
            <div className="min-w-[180px] flex-1 sm:max-w-[220px]">
              <label htmlFor="city" className="field-label mb-2 block">
                City
              </label>
              <select id="city" className="input !h-12" value={city ?? ""} onChange={(e) => setCity(e.target.value || null)}>
                <option value="">All cities</option>
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[200px] flex-1">
              <label htmlFor="search" className="field-label mb-2 block">
                Search
              </label>
              <div className="relative">
                <MagnifyingGlass size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  id="search"
                  type="search"
                  className="input !h-12 !pl-11"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Handle or name"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <div>
            <p id="niche-label" className="field-label mb-2">
              Niche
            </p>
            <div role="group" aria-labelledby="niche-label" className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
              <button type="button" className="chip snap-start" aria-pressed={!niche} onClick={() => setNiche(null)}>
                All niches
              </button>
              {NICHES.map((n) => (
                <button key={n} type="button" className="chip snap-start" aria-pressed={niche === n} onClick={() => setNiche(niche === n ? null : n)}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* On small screens the price of #1 sits above the list, not after it. */}
        <div className="mt-8 flex items-center justify-between gap-4 rounded-box bg-red p-4 pl-5 text-on-red lg:hidden">
          <p className="text-sm leading-snug">
            #1 {scope ? scope : "on this board"} costs
            <AnimatedRupees value={topPrice} className="num block text-2xl font-extrabold tracking-[-0.03em]" />
          </p>
          <Link href={claimHref} className="btn btn-sm shrink-0 bg-on-red text-red">
            Claim your rank
          </Link>
        </div>

        {/* List */}
        <div className="mt-8" aria-live="polite" aria-busy={status === "loading"}>
          {status === "loading" && (
            <ul className="grid gap-2" aria-label="Loading the board">
              {Array.from({ length: 6 }, (_, i) => (
                <li key={i} className="skeleton h-[76px] rounded-box" />
              ))}
            </ul>
          )}

          {status === "error" && (
            <div className="flex flex-col items-start gap-3 rounded-box bg-surface p-8">
              <WarningCircle size={30} className="text-red-ink" aria-hidden="true" />
              <p className="text-xl font-bold">The board didn&apos;t load.</p>
              <p className="text-muted">Check your connection, then try again.</p>
              <button type="button" className="btn btn-quiet btn-sm mt-2" onClick={load}>
                Try again
              </button>
            </div>
          )}

          {status === "ready" && entries.length === 0 && (
            <div className="flex flex-col items-start gap-3 rounded-box bg-surface p-8 sm:p-10">
              <UsersThree size={34} className="text-red-ink" aria-hidden="true" />
              <p className="text-2xl font-bold tracking-tight">
                {query
                  ? `No one matches “${query}”.`
                  : `No one ranks ${[scope || "here", window_ === "today" ? "today" : window_ === "week" ? "this week" : ""].filter(Boolean).join(" ")} yet.`}
              </p>
              <p className="max-w-[48ch] text-muted">
                {query ? "Try a shorter search, or clear the filters." : `₹99 makes you the first name brands see ${scope || "on this board"}.`}
              </p>
              {!query && (
                <Link href={claimHref} className="btn btn-primary btn-sm mt-2">
                  Claim your rank
                </Link>
              )}
            </div>
          )}

          {status === "ready" && entries.length > 0 && (
            <LayoutGroup>
              <ol className="grid grid-cols-1 gap-2">
                <AnimatePresence initial={false}>
                  {entries.map((e) => (
                    <motion.li
                      key={e.handle}
                      layout="position"
                      transition={spring}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Row entry={e} bumped={bumped === e.handle} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ol>
            </LayoutGroup>
          )}
        </div>
      </div>

      {/* Side column */}
      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <div className="hidden rounded-box bg-red p-7 lg:block text-on-red [--cup-band:var(--red)]">
          <CupMark className="size-9 text-on-red" />
          <p className="mt-4 text-[0.9375rem]">
            #1 on the {WINDOW_LABEL[window_].toLowerCase()} board {scope}
          </p>
          <p className="mt-1 text-[2.5rem] leading-none font-extrabold tracking-[-0.04em] [font-stretch:115%]">
            <AnimatedRupees value={topPrice} className="num" />
          </p>
          <p className="mt-3 text-sm">
            {entries.length ? `₹${TOP_STEP} over the current leader. The price moves with every bid.` : "Nobody holds it yet."}
          </p>
          <Link href={claimHref} className="btn mt-6 w-full bg-on-red text-red hover:-translate-y-0.5">
            Claim your rank
          </Link>
        </div>

        <div className="rounded-box bg-surface p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold">Latest bids</p>
            {canAnimate && (
              <button
                type="button"
                aria-pressed={live}
                onClick={() => setLive((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-muted hover:text-ink"
              >
                <Lightning size={14} weight={live ? "fill" : "regular"} className={live ? "text-red-ink" : ""} aria-hidden="true" />
                {live ? "Sample bids on" : "Sample bids off"}
              </button>
            )}
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-4">
            {latest.map((b) => (
              <li key={`${b.handle}-${b.at}`} className="flex items-center gap-3">
                <Avatar id={b.photo} name={b.name} size={36} />
                <div className="min-w-0 text-sm leading-snug">
                  <p className="truncate">
                    <Link href={`/c/${b.handle}`} className="font-semibold hover:underline">
                      @{b.handle}
                    </Link>{" "}
                    <span className="text-muted">added</span> <span className="num font-semibold">{rupees(b.amount)}</span>
                  </p>
                  <p className="text-xs text-muted">
                    {b.niche}, {timeAgo(b.at, now)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Row({ entry: e, bumped }: { entry: BoardEntry; bumped: boolean }) {
  const top = e.rank <= 3;
  return (
    <Link
      href={`/c/${e.handle}`}
      className={`grid items-center gap-3 rounded-box px-3 transition-colors duration-500 sm:gap-4 sm:px-4 ${
        top ? "bg-surface py-4" : "py-3 hover:bg-surface"
      } grid-cols-[1.75rem_auto_minmax(0,1fr)_auto] md:grid-cols-[2.5rem_auto_minmax(0,1.5fr)_minmax(0,1fr)_5rem_9rem] ${
        bumped ? "!bg-red-tint" : ""
      }`}
    >
      <span className={`num text-center font-extrabold tracking-[-0.04em] [font-stretch:115%] ${top ? "text-2xl" : "text-lg text-muted"} ${e.rank === 1 ? "text-red-ink" : ""}`}>
        {e.rank}
      </span>
      <Avatar id={e.photo} name={e.name} size={top ? 56 : 44} className={e.rank === 1 ? "ring-2 ring-red ring-offset-2 ring-offset-surface" : ""} />
      <div className="min-w-0">
        <p className="truncate font-semibold">{e.name}</p>
        <p className="truncate text-sm text-muted">
          @{e.handle}
          <span className="md:hidden">, {e.niche}</span>
        </p>
      </div>
      <p className="hidden truncate text-sm text-muted md:block">
        {e.niche}, {e.city}
      </p>
      <p className="num hidden text-right text-sm text-muted md:block">{compact(e.followers)}</p>
      <div className="text-right">
        <AnimatedRupees value={e.total} className={`num block font-bold ${top ? "text-lg" : ""}`} />
        <p className="num hidden text-xs text-muted sm:block">{rupees(priceToPass(e))} takes it</p>
      </div>
    </Link>
  );
}
