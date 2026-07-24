import Link from "next/link";

const pillars = [
  {
    number: "01",
    name: "Agency Services",
    body: "Legal, branding, marketing, and consultation for businesses that already exist. Real work, delivered by our team, priced by the value it creates.",
    status: "Available now",
    open: false,
  },
  {
    number: "02",
    name: "Incubation",
    body: "For entrepreneurs starting with an idea. We help you turn it into a real business with structure, guidance, and a community building alongside you.",
    status: "Applications open",
    open: true,
  },
  {
    number: "03",
    name: "Acceleration",
    body: "For businesses ready for their next stage. Training, strategy, and consultative sessions that push what you've built toward scale.",
    status: "Opening later",
    open: false,
  },
];

export default function Pillars() {
  return (
    <section id="pillars" className="scroll-mt-4 bg-ink px-4 py-16 text-paper md:px-8 md:py-24">
      <p className="mb-4 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
        What we do
      </p>
      <h2 className="mb-10 max-w-4xl text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl md:mb-14 md:text-6xl">
        Three pillars. <span className="text-strike">One job: scale.</span>
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
            <p className="mb-6 text-6xl font-black leading-none text-strike md:text-7xl">
              {pillar.number}
            </p>
            <h3 className="mb-4 text-xl font-black uppercase leading-tight md:text-2xl">
              {pillar.name}
            </h3>
            <p className="mb-8 text-sm font-medium leading-relaxed opacity-90 md:text-base">
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
              <p className="mt-auto self-start border-2 border-paper px-5 py-3 text-xs font-bold uppercase tracking-widest opacity-80 md:text-sm">
                {pillar.status}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}