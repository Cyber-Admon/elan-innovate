"use client";

import Link from "next/link";
import { leadership } from "@/lib/site";

export default function LeadershipTeaser() {
  const lead = leadership[0];

  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        {/* Text */}
        <div>
          <p className="mb-4 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
            Leadership
          </p>
          <h2 className="mb-6 text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl md:text-6xl">
            Built by people who&apos;ve been there.
          </h2>
          <p className="mb-8 max-w-md text-base font-medium leading-relaxed text-ink/80 md:text-lg">
            Elan Innovate is built by a small team who know what starting from
            nothing feels like. Get to know the people behind the firm.
          </p>
          <Link
            href="/about#leadership"
            className="inline-block bg-strike px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink"
          >
            Meet the team &rarr;
          </Link>
        </div>

        {/* Feature card: portrait slot + name plate */}
        <div className="border-4 border-ink">
          <div className="relative aspect-[3/4] w-full border-b-4 border-ink bg-navy">
            {/* Placeholder sits underneath; the image covers it once the file exists */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-6 text-center text-xs font-bold uppercase tracking-widest text-paper/40">
                Photo coming soon
              </span>
            </div>
            <img
              src={lead.photo}
              alt={lead.name}
              className="relative h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className="p-6">
            <p className="text-xl font-black uppercase leading-tight md:text-2xl">
              {lead.name}
            </p>
            <p className="mt-1 text-sm font-bold uppercase tracking-wide text-strike">
              {lead.role}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}