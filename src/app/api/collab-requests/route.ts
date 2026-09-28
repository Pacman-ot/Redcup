import { getCreator } from "@/lib/creators";
import { BUDGETS } from "@/lib/options";
import { emailError, readJson, str } from "@/lib/validate";

// POST /api/collab-requests { handle, brand, email, budget, brief }
// Production: store the request and send the creator a WhatsApp alert.
export async function POST(request: Request) {
  const body = await readJson(request);
  const creator = getCreator(str(body?.handle));
  if (!creator) return Response.json({ errors: { form: "That creator isn't on RedCup." } }, { status: 404 });

  const brand = str(body?.brand).trim();
  const email = str(body?.email).trim();
  const budget = str(body?.budget);
  const brief = str(body?.brief).trim();

  const errors: Record<string, string> = {};
  if (!brand) errors.brand = "Enter your brand name.";
  const e = emailError(email, { workOnly: true });
  if (e) errors.email = e;
  if (!(BUDGETS as readonly string[]).includes(budget)) errors.budget = "Pick a budget range.";
  if (brief.length < 20) errors.brief = "Tell the creator a little more: at least 20 characters.";
  if (brief.length > 600) errors.brief = "Keep the brief under 600 characters.";
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });

  return Response.json({ ok: true, id: `req_${Date.now().toString(36)}`, handle: creator.handle });
}
