import type { Metadata } from "next";
import Link from "next/link";
import { CurrencyInr, Funnel, SealCheck } from "@phosphor-icons/react/dist/ssr";
import { BrandSignup } from "@/components/brands/brand-signup";
import { Faq, type QA } from "@/components/faq";
import { Photo } from "@/components/photo";

export const metadata: Metadata = {
  title: "For brands",
  description: "Find Instagram creators who paid to be seen. Filter by niche, city and language and send collab requests for free.",
};

const REASONS = [
  {
    icon: SealCheck,
    title: "Every handle is verified",
    body: "A creator proves they own the account by DM before they can bid. You never brief a fan page.",
  },
  {
    icon: Funnel,
    title: "Filters that match your brief",
    body: "Niche, city, language and follower range. Creator and Business accounts show numbers refreshed daily.",
  },
  {
    icon: CurrencyInr,
    title: "Free for brands",
    body: "Creators pay to rank. You browse, shortlist and send requests without paying anything.",
  },
];

const STEPS = [
  { title: "Filter", body: "Open the board and narrow it to the niche, city and language you're hiring for." },
  { title: "Shortlist", body: "Save creators as you go. Their rank, spend history and recent posts sit on one page." },
  { title: "Request", body: "Send a brief with a budget range. The creator gets it on WhatsApp and replies to your email." },
];

const FAQ: QA[] = [
  { q: "Does a higher rank mean a better creator?", a: "No. Rank shows what a creator paid, which tells you how much they want brand work. Judge fit on their posts, audience and brief." },
  { q: "Are the follower counts real?", a: "For Creator and Business accounts, we read them from Instagram every day. Personal accounts show a self-reported count, marked as such." },
  { q: "What does a collab request cost?", a: "Nothing. Requests, shortlists and browsing are free. You agree fees directly with the creator." },
  { q: "Can I see what a creator paid?", a: "Yes. Every profile shows the creator's total and each raise with its date. It is public on purpose." },
];

export default function BrandsPage() {
  return (
    <>
      {/* Hero: copy left, photo collage right */}
      <section className="wrap grid items-center gap-12 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <h1 className="display text-[clamp(2.75rem,5vw,4.5rem)]">
            <span className="block">Creators who</span>
            <span className="block">want the work.</span>
          </h1>
          <p className="lede mt-7 max-w-[40ch] text-[clamp(1.0625rem,1.4vw,1.25rem)]">
            Every creator paid to be seen and verified their handle. Filter by niche, city and language, then send a request.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="#signup" className="btn btn-primary btn-lg">
              Create brand account
            </Link>
            <Link href="/board" className="btn btn-ghost btn-lg">
              See the board
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-3 sm:gap-4">
          <Photo id={822} ratio={3 / 4} alt="A parenting creator with her daughter on a city street" sizes="(min-width: 1024px) 330px, 52vw" priority className="rounded-box" />
          <div className="grid gap-3 pt-10 sm:gap-4 sm:pt-16">
            <Photo id={1027} ratio={4 / 5} alt="A beauty creator portrait" sizes="(min-width: 1024px) 270px, 42vw" className="rounded-box" />
            <Photo id={836} ratio={1} alt="A music creator playing a red guitar" sizes="(min-width: 1024px) 270px, 42vw" className="rounded-box" />
          </div>
        </div>
      </section>

      {/* Why: statement plus reasons */}
      <section className="border-t border-line py-20 lg:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <p className="h2 max-w-[16ch]">A creator who pays to rank is a creator who wants your brief.</p>
          <ul className="grid gap-10">
            {REASONS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="grid grid-cols-[auto_1fr] gap-5">
                <span className="grid size-12 place-items-center rounded-full bg-red-tint text-red-ink">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="h3 text-xl">{title}</h2>
                  <p className="mt-2 max-w-[46ch] leading-relaxed text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Steps: a real sequence, so it is numbered */}
      <section className="bg-surface py-20 lg:py-28" aria-labelledby="steps-h">
        <div className="wrap">
          <h2 id="steps-h" className="h2 max-w-[18ch]">
            From brief to booked in three steps.
          </h2>
          <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            <span className="absolute top-6 right-[16%] left-6 hidden h-px bg-line md:block" aria-hidden="true" />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="num relative grid size-12 place-items-center rounded-full bg-red text-lg font-extrabold text-on-red">{i + 1}</span>
                <h3 className="h3 mt-6 text-2xl">{s.title}</h3>
                <p className="mt-3 max-w-[34ch] leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Sign up */}
      <section id="signup" className="scroll-mt-20 py-20 lg:py-28" aria-labelledby="signup-h">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 id="signup-h" className="h2 max-w-[12ch]">
              Create your brand account.
            </h2>
            <p className="lede mt-5 max-w-[36ch]">Brand accounts open with the public launch. Sign up now and yours is ready on day one.</p>
          </div>
          <BrandSignup />
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24 lg:pb-32" aria-labelledby="bfaq-h">
        <div className="wrap">
          <div className="max-w-4xl">
            <h2 id="bfaq-h" className="h2">
              Questions brands ask.
            </h2>
            <div className="mt-10">
              <Faq items={FAQ} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
