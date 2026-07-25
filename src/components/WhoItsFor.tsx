import Link from "next/link";
import { site } from "@/lib/site";

export default function WhoItsFor() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <p className="mb-4 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
        Who it&apos;s for
      </p>
      <h2 className="mb-10 max-w-4xl text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl md:mb-14 md:text-6xl">
        Start where you are.
      </h2>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {/* Entry point 1: idea stage */}
        <div className="flex flex-col border-4 border-ink p-6 md:p-10">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            strokeWidth="2.5"
            aria-hidden="true"
            className="mb-6 h-9 w-9 stroke-ink"
          >
            <circle cx="16" cy="12" r="7" />
            <line x1="16" y1="19" x2="16" y2="28" />
            <line x1="11" y1="24" x2="21" y2="24" />
          </svg>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">
            Entry point 01
          </p>
          <h3 className="mb-4 text-2xl font-black uppercase leading-tight md:text-4xl">
            You have an idea.
          </h3>
          <p className="mb-8 max-w-md text-base font-medium leading-relaxed text-ink/80">
            It doesn&apos;t need to be polished, and it doesn&apos;t need a pitch
            deck. If you have an idea you believe in and you&apos;re ready to
            work on it, this is where it becomes a real business.
          </p>
          <p className="mb-8 text-sm font-bold uppercase tracking-wide">
            Your path <span className="text-strike">&rarr;</span> Incubation
          </p>
          <Link
            href="/apply"
            className="mt-auto self-start bg-strike px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink"
          >
            Apply to the Incubator
          </Link>
        </div>

        {/* Entry point 2: existing business */}
        <div className="flex flex-col border-4 border-ink bg-navy p-6 text-paper md:p-10">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            strokeWidth="2.5"
            aria-hidden="true"
            className="mb-6 h-9 w-9 stroke-paper"
          >
            <polyline points="4,26 4,18 10,18 10,26" />
            <polyline points="13,26 13,10 19,10 19,26" />
            <polyline points="22,26 22,14 28,14 28,26" />
          </svg>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-paper/50">
            Entry point 02
          </p>
          <h3 className="mb-4 text-2xl font-black uppercase leading-tight md:text-4xl">
            You run a business.
          </h3>
          <p className="mb-6 max-w-md text-base font-medium leading-relaxed text-paper/80">
            You&apos;ve already started. Now you want structure, strategy, and
            the next stage of growth. We meet your business where it is and push
            it forward.
          </p>
          <p className="mb-2 text-sm font-bold uppercase tracking-wide">
            Your path <span className="text-strike">&rarr;</span> Acceleration +
            Agency Services
          </p>
          <p className="mb-8 text-sm font-medium leading-relaxed text-paper/70">
            Accelerator applications open later. Agency services are available
            now.
          </p>
          
          <a href={`mailto:${site.email}`}
            className="mt-auto self-start border-4 border-paper px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-paper hover:text-navy"
          >
            Talk to us
          </a>
        </div>
      </div>
    </section>
  );
}