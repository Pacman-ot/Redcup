import { MAX_TOTAL, MIN_LISTING } from "./ranking";

const HANDLE_RE = /^(?!\.)(?!.*\.\.)(?!.*\.$)[a-z0-9._]{1,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const FREE_MAIL = ["gmail.com", "yahoo.com", "yahoo.in", "outlook.com", "hotmail.com", "rediffmail.com", "icloud.com"];

/** Accepts "@name", "name" or an instagram.com profile link. */
export function normalizeHandle(raw: string) {
  return raw
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0]
    .toLowerCase();
}

export function handleError(handle: string): string | null {
  if (!handle) return "Enter your Instagram handle.";
  if (handle.length > 30) return "Instagram handles are 30 characters or fewer.";
  if (!HANDLE_RE.test(handle)) return "Handles use letters, numbers, dots and underscores, with no dot at the start or end.";
  return null;
}

export function amountError(amount: number, min: number = MIN_LISTING): string | null {
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) return "Enter a whole number of rupees.";
  if (amount < min) return `The minimum is ₹${min}.`;
  if (amount > MAX_TOTAL) return "The maximum is ₹9,99,999.";
  return null;
}

export function emailError(email: string, { workOnly = false } = {}): string | null {
  if (!email) return "Enter your email address.";
  if (!EMAIL_RE.test(email)) return "Check the email address. It should look like name@company.com.";
  if (workOnly && FREE_MAIL.includes(email.split("@")[1].toLowerCase())) return "Use your work email so creators can see which brand is asking.";
  return null;
}

export function gstinError(gstin: string): string | null {
  if (!gstin) return null;
  if (!GSTIN_RE.test(gstin.toUpperCase())) return "A GSTIN has 15 characters, for example 27AAPFU0939F1ZV.";
  return null;
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const str = (v: unknown) => (typeof v === "string" ? v : "");
