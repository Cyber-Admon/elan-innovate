import Link from "next/link";

const pillars = [
  {
    number: "01",
    name: "Agency Services",
    body: "Legal, branding, marketing, and consultation for businesses that already exist. Real work, delivered by our team, priced by the value it creates.",
    status: "Available now",
    open: false,
    icon: (
      <svg viewBox="0 0 32 32" fill="none" strokeWidth="2.5" aria-hidden="true" className="h-8 w-8 stroke-paper">
        <rect x="5" y="5" width="22" height="22" />
        <line x1="5" y1="13" x2="27" y2="13" />
        <line x1="13" y1="13" x2="13" y2="27" />
      </svg>
    ),
  },
  {
    number: "02",
    name: "Incubation",
    body: "For entrepreneurs starting with an idea. We help you turn it into a real business with structure, guidance, and a community building alongside you.",
    status: "Applications open",
    open: true,
    icon: (
      <svg viewBox="0 0 32 32" fill="none" strokeWidth="2.5" aria-hidden="true" className="h-8 w-8 stroke-strike">
        <path d="M16 4 L28 16 L16 28 L4 16 Z" />
        <circle cx="16" cy="16" r="5" />
      </svg>
    ),
  },
  {
    number: "03",
    name: "Acceleration",
    body: "For businesses ready for their next stage. Training, strategy, and consultative sessions that push what you've built toward scale.",
    status: "Opening later",
    open: false,
    icon: (
      <svg viewBox="0 0 32 32" fill="none" strokeWidth="2.5" aria-hidden="true" className="h-8 w-8 stroke-paper">
        <polyline points="4,24 12,16 18,20 28,8" />
        <polyline points="21,8 28,8 28,15" />
      </svg>
    ),
  },
];

export default function Pillars() {
  return (
    <section
      id="pillars"
      className="scroll-mt-4 bg-ink px-4 py-16 text-paper md:px-8 md:py-24"
    >
      <p className="mb-4 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
        What we do
      </p>
      <h2 className="mb-10 max-w-4xl text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl md:mb-14 md:text-6xl">
        Three pillars. One job: scale.
      </h2>

      <div className="grid border-4 border-paper md:grid-cols-3">
        {pillars.map((pillar, i) => (
          <div
            key={pillar.number}
            className={`flex flex-col p-6 md:p-8 ${
              i < pillars.length - 1
                ? "border-b-4 border-paper md:border-b-0 md:border-r-4"
                : ""
            }`}
          >
            <div className="mb-6 flex items-center justify-between">
              {pillar.icon}
              <span className="text-sm font-bold uppercase tracking-widest text-paper/40">
                {pillar.number}
              </span>
            </div>
            <h3 className="mb-4 text-xl font-black uppercase leading-tight md:text-2xl">
              {pillar.name}
            </h3>
            <p className="mb-8 text-sm font-medium leading-relaxed text-paper/80 md:text-base">
              {pillar.body}
            </p>
            {pillar.open ? (
              <Link
                href="/apply"
                className="mt-auto self-start bg-strike px-5 py-3 text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:bg-paper hover:text-ink md:text-sm"
              >
                {pillar.status} &rarr;
              </Link>
            ) : (
              <p className="mt-auto self-start border-2 border-paper px-5 py-3 text-xs font-bold uppercase tracking-widest text-paper/70 md:text-sm">
                {pillar.status}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}