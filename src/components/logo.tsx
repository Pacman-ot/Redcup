// The RedCup mark: a plain geometric cup. Used as the logo and as the
// "cup" that sits on top of the #1 creator.
export function CupMark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d="M6.2 9h19.6l-2.3 17.4A3 3 0 0 1 20.5 29h-9a3 3 0 0 1-3-2.6L6.2 9Z" fill="currentColor" />
      <rect x="4.5" y="4" width="23" height="4.2" rx="2.1" fill="currentColor" />
      <path d="M7.3 15.2h17.4" stroke="var(--cup-band, rgba(255,255,255,.55))" strokeWidth="1.6" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <CupMark className="size-7 text-red" />
      <span className="text-[1.3rem] font-extrabold tracking-[-0.04em] [font-stretch:112%]">RedCup</span>
    </span>
  );
}
