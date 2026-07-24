import Link from "next/link";
import { site } from "@/lib/site";

export default function Navbar() {
  return (
    <nav className="grid grid-cols-[auto_1fr_auto] items-center border-b-4 border-ink px-4 py-3 md:px-8">
      {/* Left: logo */}
      <Link href="/" aria-label="Elan Innovate home">
        <img
          src="/logo.svg"
          alt="Elan Innovate"
          className="h-9 w-auto md:h-11"
        />
      </Link>

      {/* Center: links */}
      <div className="flex items-center justify-center gap-5 md:gap-8">
        <Link
          href="/about"
          className="text-sm font-bold uppercase tracking-wide hover:text-strike"
        >
          About
        </Link>
        <a
          href={`mailto:${site.email}`}
          className="text-sm font-bold uppercase tracking-wide hover:text-strike"
        >
          Contact
        </a>
      </div>

      {/* Right: apply */}
      <Link
        href="/apply"
        className="bg-strike px-4 py-2 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink md:px-6 md:py-3"
      >
        Apply<span className="hidden sm:inline"> to the Incubator</span>
      </Link>
    </nav>
  );
}