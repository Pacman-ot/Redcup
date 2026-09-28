import Link from "next/link";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Creators",
    links: [
      { href: "/claim", label: "Claim your rank" },
      { href: "/board", label: "The board" },
      { href: "/rules", label: "Rules" },
    ],
  },
  {
    title: "Brands",
    links: [
      { href: "/brands", label: "For brands" },
      { href: "/brands#signup", label: "Create brand account" },
    ],
  },
  {
    title: "RedCup",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Link href="/" aria-label="RedCup home" className="inline-block rounded-full">
            <Logo />
          </Link>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
            A public board of Instagram creators, ranked by what they pay. Brands browse it free.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-sm font-bold">{col.title}</p>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.9375rem] text-muted transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-line py-6 text-[0.8125rem] text-muted md:flex-row md:justify-between">
        <p>Prototype. Every creator, handle, photo and amount shown is sample data.</p>
        <p>© 2026 RedCup.in</p>
      </div>
    </footer>
  );
}
