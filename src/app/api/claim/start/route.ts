import { CODE_TTL_MS, claims, newCode } from "@/lib/claims-store";
import { handleError, normalizeHandle, readJson, str } from "@/lib/validate";

// POST /api/claim/start { handle } -> a one-time code the creator DMs to @redcup.in.
// Production: the Instagram messaging webhook receives the DM, reads the
// sender's username through the User Profile API and marks the claim verified.
export async function POST(request: Request) {
  const body = await readJson(request);
  const handle = normalizeHandle(str(body?.handle));
  const error = handleError(handle);
  if (error) return Response.json({ error }, { status: 400 });

  const code = newCode();
  const expiresAt = Date.now() + CODE_TTL_MS;
  claims.set(handle, { handle, code, expiresAt, verified: false });
  return Response.json({ handle, code, expiresAt, dmTo: "redcup.in" });
}
