import Link from "next/link";
import { site } from "@/lib/site";

const facts = [
  { label: "Cost", value: "Free" },
  { label: "Applications", value: "Open now" },
  { label: "Program runs", value: "Q4 2026" },
];

export default function Program() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <p className="mb-4 inline-block bg-ink px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
        The program
      </p>
      <h2 className="mb-6 max-w-4xl text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl md:text-6xl">
        {site.program.cohort}.{" "}
        <span className="text-strike">It costs you nothing.</span>
      </h2>
      <p className="mb-10 max-w-xl text-base font-medium leading-relaxed md:mb-14 md:text-lg">
        Our first cohort is completely free. Bring the idea and the commitment,
        we bring the structure, the guidance, and the community. Applications
        are open now, and the program officially runs in Q4 2026.
      </p>

      {/* Facts strip */}
      <div className="mb-10 grid grid-cols-1 border-4 border-ink sm:grid-cols-3 md:mb-14">
        {facts.map((fact, i) => (
          <div
            key={fact.label}
            className={`p-5 md:p-6 ${
              i < facts.length - 1
                ? "border-b-4 border-ink sm:border-b-0 sm:border-r-4"
                : ""
            }`}
          >
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-strike">
              {fact.label}
            </p>
            <p className="text-2xl font-black uppercase leading-none md:text-3xl">
              {fact.value}
            </p>
          </div>
        ))}
      </div>

      {/* Track choice */}
      <p className="mb-4 text-sm font-bold uppercase tracking-widest">
        Two tracks. One is open.
      </p>
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {/* Incubator: open */}
        <div className="flex flex-col border-4 border-ink bg-navy p-6 text-paper md:p-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-xl font-black uppercase leading-tight md:text-2xl">
              The Incubator
            </h3>
            <span className="bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper">
              Open
            </span>
          </div>
          <p className="mb-8 text-sm font-medium leading-relaxed opacity-90 md:text-base">
            For entrepreneurs with an idea. This is the track applications are
            open for right now.
          </p>
          <Link
            href="/apply"
            className="mt-auto self-start bg-strike px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            Apply to the Incubator
          </Link>
        </div>

        {/* Accelerator: locked */}
        <div className="flex flex-col border-4 border-ink p-6 md:p-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-xl font-black uppercase leading-tight opacity-60 md:text-2xl">
              The Accelerator
            </h3>
            <span className="border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest">
              Opening later
            </span>
          </div>
          <p className="mb-8 max-w-md text-sm font-medium leading-relaxed opacity-70 md:text-base">
            For existing businesses ready to scale. Applications for this track
            are not open yet. Until then, our agency services are available if
            your business needs support now.
          </p>
          <p className="mt-auto text-sm font-bold uppercase tracking-wide opacity-70">
            Not accepting applications yet
          </p>
        </div>
      </div>
    </section>
  );
}