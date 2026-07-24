import Link from "next/link";
import { site } from "@/lib/site";

export default function WhoItsFor() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <p className="mb-4 inline-block bg-ink px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
        Who it's for
      </p>
      <h2 className="mb-10 max-w-4xl text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl md:mb-14 md:text-6xl">
        Start where <span className="text-strike">you are.</span>
      </h2>

      <div className="grid border-4 border-ink md:grid-cols-2">
        {/* Entry point 1: idea stage */}
        <div className="flex flex-col border-b-4 border-ink p-6 md:border-b-0 md:border-r-4 md:p-10">
          <p className="mb-6 text-xs font-bold uppercase tracking-widest text-strike">
            Entry point 01
          </p>
          <h3 className="mb-4 text-2xl font-black uppercase leading-tight md:text-4xl">
            You have an idea.
          </h3>
          <p className="mb-6 max-w-md text-base font-medium leading-relaxed">
            It doesn't need to be polished, and it doesn't need a pitch deck.
            If you have an idea you believe in and you're ready to work on it,
            this is where it becomes a real business.
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
        <div className="flex flex-col bg-navy p-6 text-paper md:p-10">
          <p className="mb-6 text-xs font-bold uppercase tracking-widest text-strike">
            Entry point 02
          </p>
          <h3 className="mb-4 text-2xl font-black uppercase leading-tight md:text-4xl">
            You run a business.
          </h3>
          <p className="mb-6 max-w-md text-base font-medium leading-relaxed">
            You've already started. Now you want structure, strategy, and the
            next stage of growth. We meet your business where it is and push it
            forward.
          </p>
          <p className="mb-2 text-sm font-bold uppercase tracking-wide">
            Your path <span className="text-strike">&rarr;</span> Acceleration
            + Agency Services
          </p>
          <p className="mb-8 text-sm font-medium leading-relaxed opacity-80">
            Accelerator applications open later. Agency services are available
            now.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-auto self-start border-4 border-paper px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-paper hover:text-navy"
          >
            Talk to us
          </a>
        </div>
      </div>
    </section>
  );
}