import type { Metadata } from "next";
import { BoardExplorer } from "@/components/board/board-explorer";
import { CITIES, NICHES } from "@/lib/creators";
import { buildBoard, latestBids, type BoardWindow } from "@/lib/ranking";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The board",
  description: "Every Instagram creator on RedCup, ranked by what they paid. Filter by niche, city and board.",
};

const WINDOWS: BoardWindow[] = ["all", "week", "today"];

export default async function BoardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const window = WINDOWS.includes(pick(sp.window) as BoardWindow) ? (pick(sp.window) as BoardWindow) : "all";
  const niche = NICHES.find((n) => n === pick(sp.niche)) ?? null;
  const city = CITIES.find((c) => c === pick(sp.city)) ?? null;
  const now = Date.now();

  return (
    <div className="wrap py-12 lg:py-16">
      <h1 className="display text-[clamp(2.75rem,6vw,5rem)]">The board.</h1>
      <p className="lede mt-5 max-w-[52ch]">
        Every rank here is paid placement. Rank is total rupees paid, and ties go to whoever paid first.
      </p>
      <div className="mt-10">
        <BoardExplorer
          initial={{
            now,
            window,
            niche,
            city,
            entries: buildBoard({ window, niche, city, now }),
            latest: latestBids(now, 6),
          }}
        />
      </div>
    </div>
  );
}
