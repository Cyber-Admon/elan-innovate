"use client";

import { leadership } from "@/lib/site";

export default function Leadership() {
  return (
    <section
      id="leadership"
      className="scroll-mt-4 px-4 pb-16 md:px-8 md:pb-24"
    >
      <p className="mb-4 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
        Leadership
      </p>
      <h2 className="mb-10 max-w-4xl text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl md:mb-14 md:text-6xl">
        The people building it.
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {leadership.map((person) => (
          <div key={person.name} className="flex flex-col border-4 border-ink">
            {/* Portrait slot, ~3:4 */}
            <div className="relative aspect-[3/4] w-full border-b-4 border-ink bg-navy">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 text-center text-xs font-bold uppercase tracking-widest text-paper/40">
                  Photo coming soon
                </span>
              </div>
              <img
                src={person.photo}
                alt={person.name}
                className="relative h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            {/* Name plate */}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="mb-1 text-lg font-black uppercase leading-tight">
                {person.name}
              </h3>
              <p className="mb-4 text-xs font-bold uppercase tracking-wide text-strike">
                {person.role}
              </p>
              <p className="text-sm font-medium leading-relaxed text-ink/70">
                {person.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}