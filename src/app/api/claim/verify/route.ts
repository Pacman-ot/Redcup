import { claims } from "@/lib/claims-store";
import { normalizeHandle, readJson, str } from "@/lib/validate";

// POST /api/claim/verify { handle, code }
// Prototype: accepts the code that /api/claim/start issued, as if the DM arrived.
export async function POST(request: Request) {
  const body = await readJson(request);
  const handle = normalizeHandle(str(body?.handle));
  const code = str(body?.code).toUpperCase();
  const claim = claims.get(handle);

  if (!claim) {
    return Response.json({ error: "Start again: we don't have a code for this handle." }, { status: 404 });
  }
  if (Date.now() > claim.expiresAt) {
    claims.delete(handle);
    return Response.json({ error: "This code expired after 15 minutes. Get a new one." }, { status: 410 });
  }
  if (claim.code !== code) {
    return Response.json({ error: "That code doesn't match the one we sent." }, { status: 400 });
  }

  claim.verified = true;
  return Response.json({ handle, verified: true });
}
