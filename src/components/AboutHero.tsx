import Navbar from "@/components/Navbar";
import { site } from "@/lib/site";

export default function AboutHero() {
  return (
    <header className="border-b-4 border-ink">
      <Navbar />

      <div className="relative overflow-hidden px-4 py-24 md:px-8 md:py-32">
        {/* Grid layer, dark lines on paper */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.10) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(0,0,0,0.10) 1.5px, transparent 1.5px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 75% 65% at 50% 50%, #000 45%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 65% at 50% 50%, #000 45%, transparent 80%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-8 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
            About Elan Innovate
          </p>
          <h1 className="text-4xl font-black uppercase leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {site.positioning}
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base font-medium leading-relaxed text-ink/80 md:text-lg">
            A venture-building institution. We transform ideas into scalable
            ventures and help existing businesses grow, through agency services,
            incubation, and acceleration.
          </p>
        </div>
      </div>
    </header>
  );
}