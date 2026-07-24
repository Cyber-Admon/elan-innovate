import Link from "next/link";
import Navbar from "@/components/Navbar";

const TICKER_ITEMS = Array.from({ length: 10 });

export default function Hero() {
  return (
    <header className="border-b-4 border-ink">
      <Navbar />

      {/* Statement */}
      <div className="relative overflow-hidden px-4 py-16 md:px-8 md:py-24">
        <div className="relative max-w-5xl">
          <p className="mb-4 inline-block bg-ink px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
            A venture-building institution
          </p>
          <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Building businesses for scale,{" "}
            <span className="text-strike">with momentum.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base font-medium leading-relaxed md:mt-8 md:text-lg">
            Whether you're starting with an idea or growing a business that
            already exists, Elan Innovate builds with you. Structure, support,
            and the push to keep moving.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
            <Link
              href="/apply"
              className="bg-strike px-8 py-4 text-center text-base font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink"
            >
              Apply to the Incubator
            </Link>
            <a
              href="#pillars"
              className="border-4 border-ink px-8 py-4 text-center text-base font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
            >
              See how we build
            </a>
          </div>
        </div>
      </div>

      {/* Momentum ticker */}
      <div
        aria-hidden="true"
        className="overflow-hidden border-t-4 border-ink bg-ink py-3"
      >
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {TICKER_ITEMS.map((_, i) => (
            <span
              key={i}
              className="mr-8 text-sm font-bold uppercase tracking-widest text-paper"
            >
              Building with Momentum <span className="text-strike">●</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}