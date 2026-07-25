import Link from "next/link";

const offerings = [
  {
    name: "Network",
    stat: "550+",
    richBody: true,
    status: "Community members",
    cta: "Become a Fellow",
    ctaHref: "/apply",
    dark: true,
    icon: (
      <svg viewBox="0 0 32 32" fill="none" strokeWidth="2.5" aria-hidden="true" className="h-8 w-8 stroke-strike">
        <circle cx="16" cy="8" r="4" />
        <circle cx="7" cy="23" r="4" />
        <circle cx="25" cy="23" r="4" />
        <line x1="16" y1="12" x2="8" y2="19" />
        <line x1="16" y1="12" x2="24" y2="19" />
        <line x1="11" y1="23" x2="21" y2="23" />
      </svg>
    ),
  },
  {
    name: "Agency Services",
    body: "Legal, branding, marketing, and consultation for businesses that already exist. Delivered by our team, priced by the value it creates.",
    cta: "Work with us",
    ctaHref: "/services",
    dark: false,
    icon: (
      <svg viewBox="0 0 32 32" fill="none" strokeWidth="2.5" aria-hidden="true" className="h-8 w-8 stroke-ink">
        <rect x="5" y="5" width="22" height="22" />
        <line x1="5" y1="13" x2="27" y2="13" />
        <line x1="13" y1="13" x2="13" y2="27" />
      </svg>
    ),
  },
  {
    name: "Incubation",
    body: "For entrepreneurs starting with an idea. We turn it into a real business with structure, guidance, and community.",
    cta: "Apply to the Incubator",
    ctaHref: "/apply",
    dark: false,
    icon: (
      <svg viewBox="0 0 32 32" fill="none" strokeWidth="2.5" aria-hidden="true" className="h-8 w-8 stroke-strike">
        <path d="M16 4 L28 16 L16 28 L4 16 Z" />
        <circle cx="16" cy="16" r="5" />
      </svg>
    ),
  },
  {
    name: "Acceleration",
    body: "For businesses ready for their next stage. Training, strategy, and consultative sessions that push toward scale.",
    status: "Opening later",
    dark: true,
    icon: (
      <svg viewBox="0 0 32 32" fill="none" strokeWidth="2.5" aria-hidden="true" className="h-8 w-8 stroke-paper">
        <polyline points="4,24 12,16 18,20 28,8" />
        <polyline points="21,8 28,8 28,15" />
      </svg>
    ),
  },
];

export default function WhatWeBuild() {
  return (
    <section className="border-t-4 border-ink px-4 py-16 md:px-8 md:py-24">
      <p className="mb-4 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
        What we&apos;re building
      </p>
      <h2 className="mb-10 max-w-4xl text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl md:mb-14 md:text-6xl">
        Four ways we build.
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 md:gap-8">
        {offerings.map((item) => (
          <div
            key={item.name}
            className={`flex flex-col border-4 border-ink p-6 md:p-8 ${
              item.dark ? "bg-ink text-paper" : "bg-paper text-ink"
            }`}
          >
            <div className="mb-6 flex items-start justify-between">
              {item.icon}
              {item.stat && (
                <span className="text-4xl font-black leading-none text-strike md:text-5xl">
                  {item.stat}
                </span>
              )}
            </div>

            <h3 className="mb-3 text-xl font-black uppercase leading-tight md:text-2xl">
              {item.name}
            </h3>

            {item.richBody ? (
              <p
                className={`mb-8 text-sm font-medium leading-relaxed md:text-base ${
                  item.dark ? "text-paper/80" : "text-ink/70"
                }`}
              >
                A growing community of entrepreneurs at every stage, building
                alongside each other, with{" "}
                <span className="box-decoration-clone bg-strike px-1.5 text-ink">
                  Momentum.
                </span>
              </p>
            ) : (
              <p
                className={`mb-8 text-sm font-medium leading-relaxed md:text-base ${
                  item.dark ? "text-paper/80" : "text-ink/70"
                }`}
              >
                {item.body}
              </p>
            )}

            {item.cta ? (
              <Link
                href={item.ctaHref}
                className="mt-auto self-start bg-strike px-5 py-3 text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:bg-paper hover:text-ink md:text-sm"
              >
                {item.cta} &rarr;
              </Link>
            ) : item.status ? (
              <p
                className={`mt-auto self-start border-2 px-5 py-3 text-xs font-bold uppercase tracking-widest md:text-sm ${
                  item.dark ? "border-paper text-paper/70" : "border-ink text-ink/60"
                }`}
              >
                {item.status}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}