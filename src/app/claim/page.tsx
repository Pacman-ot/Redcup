import type { Metadata } from "next";
import { ClaimWizard } from "@/components/claim/claim-wizard";
import { CITIES, NICHES } from "@/lib/creators";
import { buildBoard } from "@/lib/ranking";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Claim your rank",
  description: "Verify your Instagram handle with one DM, pick your boards and bid from ₹99.",
};

export default async function ClaimPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const amount = Number(pick(sp.amount));

  return (
    <div className="wrap py-12 lg:py-16">
      <h1 className="display text-[clamp(2.5rem,5.5vw,4.5rem)]">Claim your rank.</h1>
      <p className="lede mt-5 max-w-[46ch]">Five short steps. You only pay after we know the handle is yours.</p>
      <div className="mt-12">
        <ClaimWizard
          board={buildBoard({ window: "all", now: Date.now() })}
          initial={{
            amount: Number.isInteger(amount) && amount > 0 ? amount : null,
            niche: NICHES.find((n) => n === pick(sp.niche)) ?? null,
            city: CITIES.find((c) => c === pick(sp.city)) ?? null,
            outrank: pick(sp.outrank) ?? null,
          }}
        />
      </div>
    </div>
  );
}
