export interface LegalSection {
  title: string;
  body: string[];
}

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <div className="wrap py-12 lg:py-16">
      <div className="max-w-3xl">
        <h1 className="display text-[clamp(2.5rem,5vw,4rem)]">{title}</h1>
        <p className="mt-5 text-sm text-muted">Last updated {updated}.</p>
        <p className="mt-6 rounded-box bg-red-tint p-5 text-[0.9375rem] leading-relaxed">
          Draft for the prototype. Have a lawyer review it against Indian consumer, IT and data protection law before launch.
        </p>
        {sections.map((s) => (
          <section key={s.title} className="mt-12">
            <h2 className="h3 text-2xl">{s.title}</h2>
            {s.body.map((p) => (
              <p key={p} className="mt-4 max-w-[68ch] leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
