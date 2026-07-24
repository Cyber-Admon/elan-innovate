import { site } from "@/lib/site";

export default function Community() {
  return (
    <section className="border-y-4 border-ink bg-navy px-4 py-16 text-paper md:px-8 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        {/* Text */}
        <div>
          <p className="mb-4 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
            The community
          </p>
          <h2 className="mb-6 text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl md:text-6xl">
            You don't have to <span className="text-strike">build alone.</span>
          </h2>
          <p className="mb-8 max-w-md text-base font-medium leading-relaxed opacity-90 md:text-lg">
            Entrepreneurs at every stage, sharing what they're building,
            learning together, and pushing each other forward. It's free, and
            you don't need to be in a cohort to join.
          </p>
          <a
            href={site.community || site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-strike px-8 py-4 text-base font-bold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-navy"
          >
            Join the community
          </a>
        </div>

        {/* Stat */}
        <div className="border-4 border-paper p-8 md:p-12">
          <p className="text-7xl font-black leading-none text-strike sm:text-8xl md:text-9xl">
            500+
          </p>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest opacity-90 md:text-base">
            Entrepreneurs already inside
          </p>
        </div>
      </div>
    </section>
  );
}