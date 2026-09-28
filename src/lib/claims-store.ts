// In-memory store for the prototype. It resets when the server restarts.
// Production: Postgres tables `verifications` and `payments` (see README).

export interface PendingClaim {
  handle: string;
  code: string;
  expiresAt: number;
  verified: boolean;
}

const globalStore = globalThis as unknown as { __redcupClaims?: Map<string, PendingClaim> };
export const claims = (globalStore.__redcupClaims ??= new Map<string, PendingClaim>());

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I/L

export function newCode() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export const CODE_TTL_MS = 15 * 60 * 1000;
