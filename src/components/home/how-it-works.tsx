"use client";

import { useEffect, useRef, useState } from "react";
import { Photo } from "@/components/photo";

const STEPS = [
  {
    title: "Verify with one DM",
    body: "Send a six-character code to @redcup.in on Instagram. We match it to your handle. No password, no app, no follower minimum.",
    photo: 816,
    alt: "A phone held up at the beach, camera open",
  },
  {
    title: "Bid for your spot",
    body: "Pay by UPI from ₹99. The #1 spot costs ₹50 more than whoever holds it, and it moves every time someone bids.",
    photo: 63,
    alt: "A cup of coffee on a bright red table",
  },
  {
    title: "Hear from brands",
    body: "Brands filter the board by niche, city and language, then send collab requests. Each one reaches you on WhatsApp.",
    photo: 0,
    alt: "Hands typing on a laptop at a wooden desk",
  },
];

// The picture on the right follows the step you are reading.
export function HowItWorks() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16 lg:grid-cols-[1.1fr_0.9fr]">
      <ol className="flex flex-col">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            className={`flex flex-col justify-center py-10 transition-opacity duration-500 motion-reduce:transition-none md:min-h-[62dvh] md:py-0 ${active === i ? "md:opacity-100" : "md:opacity-35"}`}
          >
            <Photo id={s.photo} ratio={4 / 3} alt={s.alt} sizes="100vw" className="mb-6 rounded-box md:hidden" />
            <h3 className="h3 text-[clamp(1.75rem,3vw,2.5rem)]">{s.title}</h3>
            <p className="lede mt-4 max-w-[44ch]">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="hidden md:block">
        <div className="sticky top-24 flex h-[calc(100dvh-8rem)] max-h-[680px] items-center">
          <div className="relative w-full overflow-hidden rounded-box bg-surface-2" style={{ aspectRatio: "4 / 5" }}>
            {STEPS.map((s, i) => (
              <div
                key={s.photo}
                className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-snap)] motion-reduce:transition-none ${active === i ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
                aria-hidden={active !== i}
              >
                <Photo id={s.photo} ratio={4 / 5} alt={s.alt} sizes="(min-width: 1024px) 520px, 45vw" className="h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
