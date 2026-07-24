import Link from "next/link";
import { leadership } from "@/lib/site";

export default function LeadershipTeaser() {
  const lead = leadership[0];

  return (
    <section className="px-4 pb-16 md:px-8 md:pb-24">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        {/* Text */}
        <div>
          <p className="mb-4 inline-block bg-ink px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
            Leadership
          </p>
          <h2 className="mb-6 text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl md:text-6xl">
            Meet the <span className="text-strike">leadership.</span>
          </h2>
          <p className="mb-8 max-w-md text-base font-medium leading-relaxed md:text-lg">
            Elan Innovate is built by a small team of builders who know what
            starting from nothing feels like. Get to know the people behind
            the firm.
          </p>
          <Link
            href="/about#leadership"
            className="inline-block bg-strike px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink"
          >
            Get to know the team &rarr;
          </Link>
        </div>

        {/* Feature card */}
        <div className="border-4 border-ink bg-navy p-8 text-paper md:p-12">
          <p className="mb-8 text-xs font-bold uppercase tracking-widest text-strike md:text-sm">
            {lead.role}
          </p>
          <p className="text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl md:text-5xl">
            {lead.name}
          </p>
        </div>
      </div>
    </section>
  );
}