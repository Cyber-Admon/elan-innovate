import Link from "next/link";
import Navbar from "@/components/Navbar";

const TICKER_ITEMS = Array.from({ length: 10 });

export default function Hero() {
  return (
    <header className="border-b-4 border-ink">
      <Navbar />

      {/* Statement — black with a radial grid that peaks in the middle */}
      <div className="relative overflow-hidden bg-ink px-4 py-28 text-paper md:px-8 md:py-40">
        {/* Grid layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,252,0.22) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(255,255,252,0.22) 1.5px, transparent 1.5px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 75% 65% at 50% 50%, #000 45%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 65% at 50% 50%, #000 45%, transparent 80%)",
          }}
        />

        {/* Content, centered */}
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-8 inline-block border-2 border-paper px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
            A venture-building institution
          </p>
          <h1 className="text-4xl font-black uppercase leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Building businesses for scale,
            <br />
            <span className="mt-3 inline-block bg-strike px-3 py-1 text-ink">
              with momentum.
            </span>
          </h1>
          <p className="mx-auto mt-10 max-w-xl text-base font-medium leading-relaxed text-paper/80 md:text-lg">
            Whether you&apos;re starting with an idea or growing a business that
            already exists, Elan Innovate builds with you. Structure, support,
            and the push to keep moving.
          </p>
          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/apply"
              className="bg-strike px-8 py-4 text-center text-base font-bold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              Apply to the Incubator
            </Link>
            
            <a  href="#pillars"
              className="border-4 border-paper px-8 py-4 text-center text-base font-bold uppercase tracking-wide transition-colors hover:bg-paper hover:text-ink"
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