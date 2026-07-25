import { leadership } from "@/lib/site";

// Border logic per cell so the grid stays sealed at every breakpoint:
// 1 column on mobile, 2 columns on sm, 4 columns on lg.
const cellBorders = [
  "border-b-4 sm:border-r-4 lg:border-b-0",
  "border-b-4 lg:border-b-0 lg:border-r-4",
  "border-b-4 sm:border-b-0 sm:border-r-4",
  "",
];

export default function Leadership() {
  return (
    <section
      id="leadership"
      className="scroll-mt-4 px-4 pb-16 md:px-8 md:pb-24"
    >
      <p className="mb-4 inline-block bg-ink px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
        Leadership
      </p>
      <h2 className="mb-10 max-w-4xl text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl md:mb-14 md:text-6xl">
        The people <span className="text-strike">building it.</span>
      </h2>

      <div className="grid border-4 border-ink sm:grid-cols-2 lg:grid-cols-4">
        {leadership.map((person, i) => (
          <div
            key={person.name}
            className={`border-ink p-6 md:p-8 ${cellBorders[i] ?? ""}`}
          >
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-strike">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mb-2 text-xl font-black uppercase leading-tight md:text-2xl">
              {person.name}
            </h3>
            <p className="text-sm font-bold uppercase tracking-wide opacity-70">
              {person.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}