import { creators as allCreators, type Creator, type Payment } from "./creators";

// Rules (see /rules). Amounts are whole rupees, before GST.
export const MIN_LISTING = 99;
export const TOP_STEP = 50; // #1 costs the current #1 plus this
export const RAISE_STEP = 10; // smallest raise on your own listing
export const MAX_TOTAL = 999_999;
export const GST_RATE = 0.18;

export type BoardWindow = "all" | "week" | "today";
export const WINDOW_LABEL: Record<BoardWindow, string> = {
  all: "All-time",
  week: "This week",
  today: "Today",
};

export interface BoardEntry {
  rank: number;
  handle: string;
  name: string;
  niche: Creator["niche"];
  city: string;
  photo: number;
  followers: number;
  professional: boolean;
  total: number;
  firstPaidAt: number;
}

export interface BoardQuery {
  window: BoardWindow;
  niche?: string | null;
  city?: string | null;
  query?: string | null;
  now: number;
}

const DAY = 86_400_000;
const IST_OFFSET = 5.5 * 3_600_000;

/** Midnight IST today, as a UTC timestamp. */
export function startOfTodayIST(now: number) {
  return Math.floor((now + IST_OFFSET) / DAY) * DAY - IST_OFFSET;
}

/** Monday 00:00 IST of the current week. */
export function startOfWeekIST(now: number) {
  const today = startOfTodayIST(now);
  const weekday = new Date(today + IST_OFFSET).getUTCDay(); // 0 = Sunday
  return today - ((weekday + 6) % 7) * DAY;
}

export function windowStart(window: BoardWindow, now: number) {
  if (window === "today") return startOfTodayIST(now);
  if (window === "week") return startOfWeekIST(now);
  return Number.NEGATIVE_INFINITY;
}

/** Sample payments are stored relative to "today" so every board has data. */
export function paymentTime(p: Payment, now: number) {
  const today = startOfTodayIST(now);
  if (p.d === 0) return today + p.f * (now - today);
  return today - p.d * DAY + p.f * DAY;
}

export function buildBoard({ window, niche, city, query, now }: BoardQuery, list: Creator[] = allCreators): BoardEntry[] {
  const from = windowStart(window, now);
  const q = query?.trim().toLowerCase().replace(/^@/, "") ?? "";
  const rows: Omit<BoardEntry, "rank">[] = [];

  for (const c of list) {
    if (niche && c.niche !== niche) continue;
    if (city && c.city !== city) continue;
    if (q && !c.handle.includes(q) && !c.name.toLowerCase().includes(q)) continue;
    let total = 0;
    let firstPaidAt = Number.POSITIVE_INFINITY;
    for (const p of c.payments) {
      const at = paymentTime(p, now);
      if (at < from || at > now) continue;
      total += p.amount;
      firstPaidAt = Math.min(firstPaidAt, at);
    }
    if (total <= 0) continue;
    rows.push({
      handle: c.handle,
      name: c.name,
      niche: c.niche,
      city: c.city,
      photo: c.photo,
      followers: c.followers,
      professional: c.professional,
      total,
      firstPaidAt,
    });
  }

  return sortAndRank(rows);
}

/** Highest total first. Equal totals keep the older listing above. */
export function sortAndRank<T extends { total: number; firstPaidAt: number }>(rows: T[]): (T & { rank: number })[] {
  return [...rows]
    .sort((a, b) => b.total - a.total || a.firstPaidAt - b.firstPaidAt)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

/** What a new listing must pay to hold #1 on this board. */
export function priceForTop(board: { total: number }[]) {
  return board.length ? board[0].total + TOP_STEP : MIN_LISTING;
}

/** What a new listing must pay to sit above this entry. */
export function priceToPass(entry: { rank: number; total: number }) {
  return entry.rank === 1 ? entry.total + TOP_STEP : entry.total + 1;
}

/** Rank a new listing would get with this amount (ties lose to older listings). */
export function rankForAmount(board: { total: number }[], amount: number) {
  let rank = board.filter((e) => e.total >= amount).length + 1;
  if (rank === 1 && board.length && amount < board[0].total + TOP_STEP) rank = 2;
  return rank;
}

export function gstFor(amount: number) {
  return Math.round(amount * GST_RATE);
}

export interface BidEvent {
  handle: string;
  name: string;
  niche: Creator["niche"];
  photo: number;
  amount: number;
  at: number;
}

export function latestBids(now: number, limit = 6, list: Creator[] = allCreators): BidEvent[] {
  const events: BidEvent[] = [];
  for (const c of list) {
    for (const p of c.payments) {
      const at = paymentTime(p, now);
      if (at <= now) events.push({ handle: c.handle, name: c.name, niche: c.niche, photo: c.photo, amount: p.amount, at });
    }
  }
  return events.sort((a, b) => b.at - a.at).slice(0, limit);
}

export function paymentHistory(c: Creator, now: number) {
  return c.payments
    .map((p) => ({ amount: p.amount, at: paymentTime(p, now) }))
    .filter((p) => p.at <= now)
    .sort((a, b) => a.at - b.at);
}

export function creatorRanks(c: Creator, now: number) {
  const find = (board: BoardEntry[]) => board.find((e) => e.handle === c.handle);
  const overall = find(buildBoard({ window: "all", now }));
  const inNiche = find(buildBoard({ window: "all", niche: c.niche, now }));
  const inCity = find(buildBoard({ window: "all", city: c.city, now }));
  const week = find(buildBoard({ window: "week", now }));
  return { overall, inNiche, inCity, week };
}
