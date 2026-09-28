"use client";

import Link from "next/link";
import { useRef } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Photo } from "@/components/photo";
import { rupees } from "@/lib/format";

export interface CarouselCreator {
  rank: number;
  handle: string;
  name: string;
  niche: string;
  city: string;
  photo: number;
  total: number;
}

export function TopCarousel({ items, title }: { items: CarouselCreator[]; title: string }) {
  const scroller = useRef<HTMLUListElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : 300;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step * 2, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div>
      <div className="wrap flex items-end justify-between gap-6">
        <h2 className="h2 max-w-[18ch]">{title}</h2>
        <div className="hidden gap-2 sm:flex">
          <button type="button" className="btn btn-quiet btn-sm !px-3" onClick={() => scrollBy(-1)} aria-label="Scroll back">
            <CaretLeft size={20} />
          </button>
          <button type="button" className="btn btn-quiet btn-sm !px-3" onClick={() => scrollBy(1)} aria-label="Scroll forward">
            <CaretRight size={20} />
          </button>
        </div>
      </div>

      <ul
        ref={scroller}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:scroll-px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] md:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
      >
        {items.map((c) => (
          <li key={c.handle} className="w-[68vw] shrink-0 snap-start sm:w-[260px]">
            <Link href={`/c/${c.handle}`} className="group block rounded-box">
              <Photo
                id={c.photo}
                ratio={3 / 4}
                alt={`${c.name}, ${c.niche} creator from ${c.city}`}
                sizes="(min-width: 640px) 260px, 68vw"
                className="rounded-box"
                imgClassName="transition-transform duration-700 ease-[var(--ease-snap)] group-hover:scale-[1.04] motion-reduce:transition-none"
              />
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{c.name}</p>
                  <p className="truncate text-sm text-muted">
                    {c.niche}, {c.city}
                  </p>
                </div>
                <p className={`num shrink-0 text-2xl font-extrabold leading-none tracking-[-0.04em] [font-stretch:118%] ${c.rank === 1 ? "text-red-ink" : ""}`}>
                  #{c.rank}
                </p>
              </div>
              <p className="num mt-2 text-sm">
                <span className="font-semibold">{rupees(c.total)}</span> <span className="text-muted">paid all-time</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
