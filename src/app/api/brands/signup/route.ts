import { emailError, gstinError, readJson, str } from "@/lib/validate";

// POST /api/brands/signup { company, email, gstin?, niches[] }
export async function POST(request: Request) {
  const body = await readJson(request);
  const company = str(body?.company).trim();
  const email = str(body?.email).trim();
  const gstin = str(body?.gstin).trim();

  const errors: Record<string, string> = {};
  if (!company) errors.company = "Enter your brand or agency name.";
  const e = emailError(email, { workOnly: true });
  if (e) errors.email = e;
  const g = gstinError(gstin);
  if (g) errors.gstin = g;
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });

  return Response.json({ ok: true, company, email });
}
