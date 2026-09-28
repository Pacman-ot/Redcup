import { NICHES } from "@/lib/creators";
import { buildBoard, latestBids, priceForTop, type BoardWindow } from "@/lib/ranking";

export const dynamic = "force-dynamic";

const WINDOWS: BoardWindow[] = ["all", "week", "today"];

// GET /api/board?window=all|week|today&niche=Travel&city=Kochi&q=tara
export async function GET(request: Request) {
  const url = new URL(request.url);
  const window = (url.searchParams.get("window") ?? "all") as BoardWindow;
  if (!WINDOWS.includes(window)) {
    return Response.json({ error: "window must be all, week or today" }, { status: 400 });
  }
  const niche = url.searchParams.get("niche");
  if (niche && !NICHES.includes(niche as (typeof NICHES)[number])) {
    return Response.json({ error: "Unknown niche" }, { status: 400 });
  }
  const now = Date.now();
  const entries = buildBoard({
    window,
    niche,
    city: url.searchParams.get("city"),
    query: url.searchParams.get("q"),
    now,
  });
  return Response.json({
    now,
    window,
    entries,
    priceForTop: priceForTop(entries),
    latest: latestBids(now, 6),
  });
}
