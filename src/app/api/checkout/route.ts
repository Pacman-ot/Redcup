import { claims } from "@/lib/claims-store";
import { getCreator } from "@/lib/creators";
import { gstFor, MIN_LISTING, RAISE_STEP } from "@/lib/ranking";
import { amountError, normalizeHandle, readJson, str } from "@/lib/validate";

// POST /api/checkout { handle, amount }
// Prototype: returns a demo order. Production: create a Razorpay order here,
// and write the rank only when the signed payment webhook confirms it.
export async function POST(request: Request) {
  const body = await readJson(request);
  const handle = normalizeHandle(str(body?.handle));
  const amount = Number(body?.amount);

  const claim = claims.get(handle);
  if (!claim?.verified) {
    return Response.json({ error: "Verify your handle before paying." }, { status: 403 });
  }
  // Creators already on the board can raise by as little as ₹10.
  const error = amountError(amount, getCreator(handle) ? RAISE_STEP : MIN_LISTING);
  if (error) return Response.json({ error }, { status: 400 });

  const gst = gstFor(amount);
  return Response.json({
    orderId: `demo_${Date.now().toString(36)}`,
    handle,
    amount,
    gst,
    total: amount + gst,
    currency: "INR",
    demo: true,
  });
}
