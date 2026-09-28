import Link from "next/link";
import { Photo } from "@/components/photo";

export default function NotFound() {
  return (
    <div className="wrap grid items-center gap-12 py-16 lg:grid-cols-[1fr_0.8fr] lg:py-24">
      <div>
        <p className="num text-sm font-semibold text-muted">404</p>
        <h1 className="display mt-4 text-[clamp(2.75rem,6vw,5rem)]">Wrong cup.</h1>
        <p className="lede mt-6 max-w-[38ch]">There&apos;s no page here. The handle may have changed, or the link has a typo.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/board" className="btn btn-primary btn-lg">
            See the board
          </Link>
          <Link href="/" className="btn btn-ghost btn-lg">
            Go home
          </Link>
        </div>
      </div>
      <Photo id={63} ratio={4 / 5} alt="A cup of coffee on a red table" sizes="(min-width: 1024px) 420px, 100vw" className="mx-auto w-full max-w-[420px] rounded-box" />
    </div>
  );
}
