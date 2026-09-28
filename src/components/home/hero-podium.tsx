"use client";

import Link from "next/link";
import { LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { AnimatedRupees } from "@/components/animated-rupees";
import { CupMark } from "@/components/logo";
import { Photo } from "@/components/photo";
import { useLiveTicker } from "@/components/use-live-bids";
import { TOP_STEP } from "@/lib/ranking";

export interface PodiumCreator {
  handle: string;
  name: string;
  niche: string;
  photo: number;
  total: number;
}

const spring = { type: "spring", stiffness: 140, damping: 22 } as const;

// Columns left to right show ranks 2, 1, 3, like a real podium.
const SLOTS = [
  { rank: 2, col: "w-[31%]", platform: "h-16 sm:h-20", numeral: "text-3xl sm:text-4xl", sizes: "(min-width: 1024px) 180px, 30vw", delay: 0.12 },
  { rank: 1, col: "w-[38%]", platform: "h-24 sm:h-28", numeral: "text-5xl sm:text-6xl", sizes: "(min-width: 1024px) 220px, 36vw", delay: 0 },
  { rank: 3, col: "w-[31%]", platform: "h-11 sm:h-14", numeral: "text-2xl sm:text-3xl", sizes: "(min-width: 1024px) 180px, 30vw", delay: 0.22 },
];

export function HeroPodium({ initial }: { initial: PodiumCreator[] }) {
  const [top3, setTop3] = useState(() => [...initial].sort((a, b) => b.total - a.total));

  // Sample bid: whoever is #3 or #2 pays enough to take the cup.
  const { ref } = useLiveTicker<HTMLDivElement>(
    () =>
      setTop3((cur) => {
        const challengerIndex = Math.random() < 0.5 ? 1 : 2;
        const leader = cur[0];
        const bump = TOP_STEP + 10 * Math.floor(Math.random() * 9);
        const next = cur.map((c, i) => (i === challengerIndex ? { ...c, total: leader.total + bump } : c));
        return next.sort((a, b) => b.total - a.total);
      }),
    6500,
  );

  const leader = top3[0];

  return (
    <div ref={ref} className="w-full">
      <LayoutGroup>
        <div className="flex items-end gap-2.5 sm:gap-3.5">
          {SLOTS.map((slot) => {
            const c = top3[slot.rank - 1];
            const first = slot.rank === 1;
            return (
              <div key={slot.rank} className={`${slot.col} flex flex-col`}>
                {first && (
                  <motion.div
                    className="mb-3 flex justify-center text-red"
                    initial={{ y: -28, opacity: 0, rotate: -12 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    transition={{ ...spring, delay: 0.75 }}
                  >
                    <CupMark className="size-11 sm:size-12" title="The cup: rank 1" />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 + slot.delay }}
                >
                  <motion.div key={c.handle} layoutId={`podium-${c.handle}`} transition={spring}>
                    <Link href={`/c/${c.handle}`} className="group block rounded-box" aria-label={`${c.name}, rank ${slot.rank}`}>
                      <Photo
                        id={c.photo}
                        ratio={3 / 4}
                        alt={`${c.name}, ${c.niche} creator`}
                        sizes={slot.sizes}
                        priority={first}
                        className={`rounded-box transition-transform duration-500 ease-[var(--ease-snap)] group-hover:-translate-y-1 ${first ? "shadow-[var(--shadow)]" : ""}`}
                      />
                      <div className="px-0.5 pt-3 pb-3">
                        <p className="truncate text-[0.8125rem] font-semibold sm:text-sm">@{c.handle}</p>
                        <p className="truncate text-xs text-muted">{c.niche}</p>
                        <AnimatedRupees
                          value={c.total}
                          className={`num mt-1 block font-bold tracking-tight ${first ? "text-lg text-red-ink sm:text-xl" : "text-base sm:text-lg"}`}
                        />
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div
                  className={`${slot.platform} flex origin-bottom items-start justify-center rounded-t-box pt-2 ${first ? "bg-red text-on-red" : "bg-surface-2 text-muted"}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: slot.delay }}
                  aria-hidden="true"
                >
                  <span className={`${slot.numeral} font-extrabold leading-none tracking-[-0.05em] [font-stretch:120%]`}>{slot.rank}</span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
      <p className="mt-4 text-center text-sm text-muted">
        Sample board. <AnimatedRupees value={leader.total + TOP_STEP} className="num font-semibold text-ink" /> takes the cup right now.
      </p>
    </div>
  );
}
