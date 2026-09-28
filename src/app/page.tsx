import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Funnel, PaperPlaneTilt, SealCheck } from "@phosphor-icons/react/dist/ssr";
import { Faq, type QA } from "@/components/faq";
import { HeroPodium } from "@/components/home/hero-podium";
import { HowItWorks } from "@/components/home/how-it-works";
import { TopCarousel } from "@/components/home/top-carousel";
import { Photo } from "@/components/photo";
import { photoSrc } from "@/lib/creators";
import { buildBoard, MIN_LISTING, TOP_STEP } from "@/lib/ranking";

export const dynamic = "force-dynamic";

const FAQ: QA[] = [
  {
    q: "Do I need a Creator or Business account?",
    a: "No. Any public Instagram account can verify by sending us one DM. Creator and Business accounts also show a live follower count on their card.",
  },
  {
    q: "What does the #1 spot cost?",
    a: `₹${TOP_STEP} more than whoever holds it right now. The price is always shown live on the board, and it changes every time someone bids.`,
  },
  {
    q: "Is my payment refundable?",
    a: "No. A payment buys placement the moment it clears. If we remove a listing by mistake, you get the full amount back as wallet credit.",
  },
  {
    q: "When do the boards reset?",
    a: "Today's board resets at midnight IST and the weekly board every Monday. Your all-time total never resets.",
  },
  {
    q: "What do brands pay?",
    a: "Nothing. Browsing the board, saving shortlists and sending collab requests are free for brands.",
  },
];

export default function HomePage() {
  const now = Date.now();
  const allTime = buildBoard({ window: "all", now });
  // The podium shows ranks 1 to 3; the carousel shows who is chasing them.
  const chasing = allTime.slice(3, 11);

  return (
    <>
      {/* Hero: copy left, live podium right */}
      <section className="lg:flex lg:min-h-[calc(100dvh-4rem)] lg:items-center">
        <div className="wrap grid items-center gap-14 py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-14">
          <div>
            <h1 className="display text-[clamp(3rem,6.4vw,5.75rem)]">
              <span className="block">Pay for #1.</span>
              <span className="block text-red-ink">Get booked.</span>
            </h1>
            <p className="lede mt-7 max-w-[34ch] text-[clamp(1.0625rem,1.4vw,1.25rem)]">
              RedCup is a public board of Instagram creators, ranked by what they pay. Brands browse it free to hire.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/claim" className="btn btn-primary btn-lg">
                Claim your rank
              </Link>
              <Link href="/board" className="btn btn-ghost btn-lg">
                See the board
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[600px] lg:mr-0">
            <HeroPodium initial={allTime.slice(0, 3)} />
          </div>
        </div>
      </section>

      {/* The rules in four numbers */}
      <section aria-label="The rules in numbers" className="border-y border-line">
        <dl className="wrap grid grid-cols-2 gap-y-10 py-14 lg:grid-cols-4 lg:py-16">
          {[
            { n: `₹${MIN_LISTING}`, d: "gets you on any board", lead: true },
            { n: `+₹${TOP_STEP}`, d: "over the leader takes the cup" },
            { n: "3", d: "boards count every payment: all-time, this week and today" },
            { n: "₹0", d: "for brands to browse, shortlist and hire" },
          ].map((item, i) => (
            <div
              key={item.n}
              className={`border-line pr-6 ${i % 2 === 1 ? "border-l pl-6" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""} ${i === 1 || i === 3 ? "lg:pl-8" : ""}`}
            >
              <dt className={`num font-extrabold leading-none tracking-[-0.05em] [font-stretch:118%] text-[clamp(2.25rem,4.6vw,4rem)] ${item.lead ? "text-red-ink" : ""}`}>
                {item.n}
              </dt>
              <dd className="mt-3 max-w-[22ch] text-[0.9375rem] leading-snug text-muted">{item.d}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* How it works: sticky picture follows the step */}
      <section className="py-24 lg:py-32" aria-labelledby="how-h">
        <div className="wrap">
          <h2 id="how-h" className="h2 max-w-[16ch]">
            Three moves from handle to the top.
          </h2>
          <div className="mt-6 md:mt-0">
            <HowItWorks />
          </div>
        </div>
      </section>

      {/* Ranks 4 to 11: horizontal scroll */}
      <section className="pb-24 lg:pb-32" aria-label="Creators chasing the cup">
        <TopCarousel items={chasing} title="Chasing the cup." />
        <div className="wrap mt-10">
          <Link href="/board" className="btn btn-ghost">
            See the board
          </Link>
        </div>
      </section>

      {/* For brands: bento */}
      <section className="pb-24 lg:pb-32" aria-labelledby="brands-h">
        <div className="wrap">
          <p className="eyebrow">For brands</p>
          <h2 id="brands-h" className="h2 mt-4 max-w-[17ch]">
            Hire creators who already want the work.
          </h2>
          <p className="lede mt-5">Paying to rank is a signal. Filter the board, save a shortlist and send a request in one tap.</p>

          <div className="mt-12 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
            <article className="flex flex-col overflow-hidden rounded-box bg-surface lg:row-span-2">
              <Photo id={26} ratio={16 / 10} alt="A creator's kit laid out: sunglasses, watch, phone and headphones" sizes="(min-width: 1024px) 700px, 100vw" />
              <div className="p-7 lg:p-9">
                <Funnel size={26} className="text-red-ink" aria-hidden="true" />
                <h3 className="h3 mt-4 text-2xl">Filter by niche, city and language</h3>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-muted">
                  Add a follower range too. Creator and Business accounts show numbers refreshed daily from Instagram.
                </p>
              </div>
            </article>
            <article className="flex flex-col justify-center rounded-box bg-red-tint p-7 lg:p-9">
              <SealCheck size={28} className="text-red-ink" aria-hidden="true" />
              <h3 className="h3 mt-4 text-2xl">Every handle is verified</h3>
              <p className="mt-3 max-w-[40ch] leading-relaxed">Creators prove they own the account by DM before they can bid. No fan pages, no impersonators.</p>
            </article>
            <article className="flex flex-col overflow-hidden rounded-box bg-surface">
              <Photo id={628} ratio={16 / 7} alt="A creator holding a film camera" sizes="(min-width: 1024px) 560px, 100vw" />
              <div className="p-7">
                <PaperPlaneTilt size={26} className="text-red-ink" aria-hidden="true" />
                <h3 className="h3 mt-4 text-2xl">Send a collab request</h3>
                <p className="mt-3 max-w-[40ch] leading-relaxed text-muted">Pick a budget range, add a short brief. The creator gets it on WhatsApp.</p>
              </div>
            </article>
            <article className="flex flex-col items-start justify-between gap-6 rounded-box bg-surface-2 p-7 sm:flex-row sm:items-center lg:col-span-2 lg:p-9">
              <div>
                <h3 className="h3 text-2xl">Free for brands. Always.</h3>
                <p className="mt-2 text-muted">Search, shortlist and send requests without paying anything.</p>
              </div>
              <Link href="/brands#signup" className="btn btn-primary">
                Create brand account
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24 lg:pb-32" aria-labelledby="faq-h">
        <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 id="faq-h" className="h2 max-w-[12ch]">
              Questions creators ask first.
            </h2>
            <Link href="/rules" className="mt-6 inline-flex items-center gap-2 font-semibold text-red-ink hover:underline">
              Read the full rules <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <Faq items={FAQ} />
        </div>
      </section>

      {/* Closing call to action over a full-bleed photo */}
      <section className="relative isolate flex min-h-[560px] items-end overflow-hidden md:items-center" aria-labelledby="cta-h">
        <Image src={photoSrc(859, 16 / 9)} alt="" fill sizes="100vw" className="-z-20 object-cover object-[70%_50%]" />
        <div className="absolute inset-0 -z-10 hidden [background:var(--scrim)] md:block" />
        <div className="absolute inset-0 -z-10 [background:var(--scrim-mobile)] md:hidden" />
        <div className="wrap py-20">
          <h2 id="cta-h" className="display text-[clamp(2.5rem,5.4vw,4.75rem)]">
            <span className="block">Your handle.</span>
            <span className="block">Your rank.</span>
            <span className="block text-red-ink">From ₹{MIN_LISTING}.</span>
          </h2>
          <p className="mt-6 max-w-[36ch] text-lg leading-relaxed">No follower minimum. No algorithm. Every listing carries a Paid ranking label.</p>
          <Link href="/claim" className="btn btn-primary btn-lg mt-9">
            Claim your rank
          </Link>
        </div>
      </section>
    </>
  );
}
