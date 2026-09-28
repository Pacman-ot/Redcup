import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SealCheck } from "@phosphor-icons/react/dist/ssr";
import { CollabButton } from "@/components/creator/collab-dialog";
import { Avatar, Photo } from "@/components/photo";
import { getCreator, POSTS_BY_NICHE } from "@/lib/creators";
import { compact, rupees, shortDate } from "@/lib/format";
import { buildBoard, creatorRanks, paymentHistory, priceToPass } from "@/lib/ranking";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = getCreator((await params).handle);
  if (!c) return { title: "Creator not found" };
  return { title: `${c.name} (@${c.handle})`, description: `${c.niche} creator from ${c.city}. ${c.bio}` };
}

export default async function CreatorPage({ params }: Params) {
  const c = getCreator((await params).handle);
  if (!c) notFound();

  const now = Date.now();
  const ranks = creatorRanks(c, now);
  const history = paymentHistory(c, now);
  const total = history.reduce((s, p) => s + p.amount, 0);
  const overall = ranks.overall;
  const outrank = overall ? priceToPass(overall) : 99;
  const posts = POSTS_BY_NICHE[c.niche].filter((id) => id !== c.photo).slice(0, 6);
  const more = buildBoard({ window: "all", niche: c.niche, now })
    .filter((e) => e.handle !== c.handle)
    .slice(0, 4);
  const fallbackMore = more.length ? more : buildBoard({ window: "all", now }).filter((e) => e.handle !== c.handle).slice(0, 4);

  let running = 0;
  const timeline = history.map((p) => {
    running += p.amount;
    return { ...p, running };
  });

  const chips = [
    overall && { label: `#${overall.rank} overall`, lead: overall.rank === 1 },
    ranks.inNiche && { label: `#${ranks.inNiche.rank} in ${c.niche}`, lead: ranks.inNiche.rank === 1 },
    ranks.inCity && { label: `#${ranks.inCity.rank} in ${c.city}`, lead: ranks.inCity.rank === 1 },
  ].filter(Boolean) as { label: string; lead: boolean }[];

  return (
    <div className="wrap py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/board" className="hover:text-ink">
              The board
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/board?niche=${encodeURIComponent(c.niche)}`} className="hover:text-ink">
              {c.niche}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            @{c.handle}
          </li>
        </ol>
      </nav>

      {/* Profile */}
      <section className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <Photo id={c.photo} ratio={3 / 4} alt={`${c.name}, ${c.niche} creator from ${c.city}`} sizes="(min-width: 1024px) 480px, 100vw" priority className="rounded-box shadow-[var(--shadow)]" />

        <div className="min-w-0 lg:pt-4">
          <ul className="flex flex-wrap gap-2" aria-label="Ranks">
            {chips.map((chip) => (
              <li
                key={chip.label}
                className={`num inline-flex h-9 items-center rounded-full px-4 text-sm font-bold ${chip.lead ? "bg-red text-on-red" : "bg-surface-2"}`}
              >
                {chip.label}
              </li>
            ))}
          </ul>

          <h1 className="display mt-6 text-[clamp(2.75rem,5.4vw,4.5rem)]">{c.name}</h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg">
            <a href={`https://instagram.com/${c.handle}`} className="font-semibold hover:underline" target="_blank" rel="noreferrer">
              @{c.handle}
            </a>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-ink">
              <SealCheck size={18} weight="fill" aria-hidden="true" /> Handle verified by DM
            </span>
          </p>
          <p className="lede mt-5">{c.bio}</p>

          <dl className="mt-8 grid max-w-md grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <dt className="text-sm text-muted">Niche</dt>
              <dd className="mt-1 font-semibold">{c.niche}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">City</dt>
              <dd className="mt-1 font-semibold">{c.city}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Languages</dt>
              <dd className="mt-1 font-semibold">{c.languages.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Followers</dt>
              <dd className="num mt-1 font-semibold">{c.professional ? compact(c.followers) : `${compact(c.followers)} (self-reported)`}</dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <CollabButton handle={c.handle} name={c.name.split(" ")[0]} />
            <Link href={`/claim?outrank=${c.handle}&amount=${outrank}&niche=${encodeURIComponent(c.niche)}`} className="btn btn-ghost btn-lg">
              Claim your rank
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            <span className="num font-semibold text-ink">{rupees(outrank)}</span> puts a new listing above @{c.handle}. Paid ranking: the rank shows what
            they paid, not a review.
          </p>
        </div>
      </section>

      {/* Numbers */}
      <section aria-label="Numbers" className="mt-20 border-y border-line">
        <dl className="grid grid-cols-2 gap-y-8 py-10 lg:grid-cols-4">
          {[
            { k: "Paid all-time", v: rupees(total) },
            { k: "Profile visits from RedCup", v: compact(c.profileVisits) },
            { k: "Brand requests", v: String(c.brandRequests) },
            { k: "On the board since", v: history[0] ? shortDate(history[0].at) : "Today" },
          ].map((s, i) => (
            <div key={s.k} className={`border-line ${i % 2 === 1 ? "border-l pl-6" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""} ${i === 1 || i === 3 ? "lg:pl-8" : ""}`}>
              <dt className="text-sm text-muted">{s.k}</dt>
              <dd className="num mt-2 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none font-extrabold tracking-[-0.035em] [font-stretch:112%]">{s.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Posts */}
      <section className="mt-20" aria-labelledby="posts-h">
        <h2 id="posts-h" className="h2">
          Recent posts
        </h2>
        <p className="mt-3 text-sm text-muted">Sample photos. A live profile shows the latest six posts from Instagram.</p>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
          {posts.map((id) => (
            <li key={id}>
              <Photo id={id} ratio={1} alt={`A recent post by @${c.handle}`} sizes="(min-width: 768px) 30vw, 50vw" className="rounded-box" />
            </li>
          ))}
        </ul>
      </section>

      {/* History + more */}
      <section className="mt-20 grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="min-w-0">
          <h2 className="h2">Rank history</h2>
          <ol className="mt-8 border-l-2 border-line">
            {timeline
              .slice()
              .reverse()
              .map((p, i) => (
                <li key={p.at} className="relative pb-8 pl-7 last:pb-0">
                  <span className={`absolute top-1.5 -left-[7px] size-3 rounded-full ${i === 0 ? "bg-red" : "bg-surface-2 ring-2 ring-bg"}`} aria-hidden="true" />
                  <p className="text-sm text-muted">{shortDate(p.at)}</p>
                  <p className="mt-1">
                    <span className="num font-bold">+{rupees(p.amount)}</span> <span className="text-muted">brought the total to</span>{" "}
                    <span className="num font-semibold">{rupees(p.running)}</span>
                  </p>
                </li>
              ))}
          </ol>
        </div>

        <div className="min-w-0">
          <h2 className="h2">{more.length ? `More in ${c.niche}` : "More on RedCup"}</h2>
          <ul className="mt-8 grid grid-cols-1 gap-2">
            {fallbackMore.map((e) => (
              <li key={e.handle}>
                <Link href={`/c/${e.handle}`} className="flex items-center gap-4 rounded-box p-3 transition-colors hover:bg-surface">
                  <span className="num w-8 text-center text-lg font-extrabold text-muted">{e.rank}</span>
                  <Avatar id={e.photo} name={e.name} size={48} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{e.name}</span>
                    <span className="block truncate text-sm text-muted">
                      @{e.handle}, {e.city}
                    </span>
                  </span>
                  <span className="num font-bold">{rupees(e.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
