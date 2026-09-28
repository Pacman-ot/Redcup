import type { Metadata } from "next";
import Link from "next/link";
import { Faq, type QA } from "@/components/faq";
import { MAX_TOTAL, MIN_LISTING, RAISE_STEP, TOP_STEP } from "@/lib/ranking";

export const metadata: Metadata = {
  title: "Rules",
  description: "How RedCup ranks creators: minimums, the price of #1, the three boards, verification, refunds and what you can list.",
};

const fmt = (n: number) => `₹${new Intl.NumberFormat("en-IN").format(n)}`;

const SECTIONS = [
  {
    id: "ranking",
    title: "How ranking works",
    items: [
      `Rank is the total you have paid for your handle on that board. Nothing else counts: not followers, not likes.`,
      `A new listing starts at ${fmt(MIN_LISTING)}, in whole rupees, up to ${fmt(MAX_TOTAL)}.`,
      `Taking #1 costs ${fmt(TOP_STEP)} more than the current #1. Paying less still puts you on the board at the rank that amount buys.`,
      `Already listed? Raise by at least ${fmt(RAISE_STEP)}. You only pay the difference.`,
      "Equal totals keep their order: whoever reached the total first stays above.",
    ],
  },
  {
    id: "boards",
    title: "The three boards",
    items: [
      "All-time counts everything you have ever paid. It never resets.",
      "This week counts payments since Monday 00:00 IST.",
      "Today counts payments since midnight IST. Past days are kept as a public archive.",
      "Every board also splits by niche and by city, so you can hold #1 in Kochi without holding #1 in India.",
    ],
  },
  {
    id: "verification",
    title: "Verification",
    items: [
      "Before you can pay, you send a six-character code to @redcup.in by Instagram DM. We match it to your handle.",
      "Codes expire after 15 minutes and work once.",
      "Creator and Business accounts get follower counts refreshed daily. Personal accounts show a self-reported count, marked as such.",
    ],
  },
  {
    id: "listing",
    title: "What you can list",
    items: [
      "Your own public Instagram account, or one you manage with the owner's permission.",
      "No betting, real-money gaming, adult content, or accounts that impersonate someone else.",
      "Listings that break these rules are removed. See Payments and refunds for what happens to the money.",
    ],
  },
  {
    id: "payments",
    title: "Payments and refunds",
    items: [
      "Payments run through Razorpay: UPI, cards and netbanking. GST at 18% is added at checkout and invoiced to your email.",
      "Your rank goes live when the payment clears. A payment buys placement, not results: clicks and brand requests are never guaranteed.",
      "Payments are final. If we remove a listing by mistake, the full amount comes back as wallet credit.",
    ],
  },
  {
    id: "paid-label",
    title: "Paid ranking label",
    items: [
      "Every rank on RedCup is paid placement, and the site says so on the board and on every profile.",
      "A rank is not a review or a recommendation from RedCup.",
    ],
  },
];

const FAQ: QA[] = [
  { q: "Can someone else list my handle?", a: "No. A handle can only bid after its owner sends the verification DM from that account." },
  { q: "What happens if someone outbids me?", a: "You get a WhatsApp alert with a link that takes you straight to checkout for the amount that wins the spot back." },
  { q: "Do I need a minimum number of followers?", a: "No. Any public account can list, from a hundred followers to a million." },
  { q: "Why are the boards reset in IST?", a: "Most creators and brands on RedCup are in India, so the day ends at midnight India time." },
];

export default function RulesPage() {
  return (
    <div className="wrap py-12 lg:py-16">
      <h1 className="display text-[clamp(2.75rem,6vw,5rem)]">The rules.</h1>
      <p className="lede mt-5 max-w-[48ch]">Rank is what you pay. Here is exactly how that works.</p>

      <div className="mt-14 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="sticky top-24 grid gap-3 text-[0.9375rem]">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-muted hover:text-ink">
                  {s.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#faq" className="text-muted hover:text-ink">
                Questions
              </a>
            </li>
          </ul>
        </nav>

        <div className="max-w-3xl">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="border-t border-line py-10 first:border-t-0 first:pt-0">
              <h2 className="h3 text-[clamp(1.5rem,2.4vw,2rem)]">{s.title}</h2>
              <ul className="mt-5 grid gap-3">
                {s.items.map((item) => (
                  <li key={item} className="grid grid-cols-[1rem_1fr] gap-2 leading-relaxed">
                    <span className="mt-[0.7em] h-px w-2.5 bg-red-ink" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section id="faq" className="border-t border-line pt-10">
            <h2 className="h3 text-[clamp(1.5rem,2.4vw,2rem)]">Questions</h2>
            <div className="mt-6">
              <Faq items={FAQ} />
            </div>
            <p className="mt-10 text-muted">
              Ready?{" "}
              <Link href="/claim" className="font-semibold text-red-ink hover:underline">
                Claim your rank
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
