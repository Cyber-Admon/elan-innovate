"use client";

import { useEffect, useRef, useState } from "react";
import StoryImageBand from "@/components/StoryImageBand";

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -15% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function StoryFlow() {
  return (
    <>
      {/* Where it started — black */}
      <section className="relative z-10 bg-ink px-4 py-20 text-paper md:px-8 md:py-32">
        <Reveal className="mx-auto max-w-4xl">
          <p className="mb-6 inline-block border-2 border-paper px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
            Where it started
          </p>
          <h2 className="text-3xl font-black uppercase leading-tight tracking-tight md:text-5xl">
            We know what building <span className="text-strike">alone</span>{" "}
            feels like.
          </h2>
          <p className="ml-auto mt-8 max-w-xl text-base font-medium leading-relaxed text-paper/80 md:mt-10 md:text-right md:text-lg">
            Which is why we&apos;re closing the gap between having an idea and
            building a real business. Support, structure, and momentum should be
            within reach of{" "}
            <span className="font-bold text-paper">
              every serious entrepreneur
            </span>
            , not just the well-connected few.
          </p>
        </Reveal>
      </section>

      {/* Peek-through image band */}
      {/* <StoryImageBand /> */}

      {/* Mission + Vision — ivory, split by a center divider */}
      <section
        className="relative z-10 border-y-4 border-ink px-4 py-20 md:px-8 md:py-28"
        style={{ backgroundColor: "#FFFFF0" }}
      >
        <Reveal className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1fr_auto_1fr] md:gap-14">
          {/* Mission */}
          <div>
            <p className="mb-5 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
              Mission
            </p>
            <h3 className="mb-4 text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">
              Build with entrepreneurs,{" "}
              <span className="text-strike">not just for them.</span>
            </h3>
            <p className="text-base font-medium leading-relaxed text-ink/80 md:text-lg">
              We give entrepreneurs the structure, resources, and support they
              need to build strong businesses and create lasting impact, whether
              they&apos;re starting from an idea or scaling one that already
              exists.
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block md:w-px md:bg-ink" />
          <div className="h-px w-full bg-ink md:hidden" />

          {/* Vision */}
          <div>
            <p className="mb-5 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
              Vision
            </p>
            <h3 className="mb-4 text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">
              A generation of businesses{" "}
              <span className="text-strike">built to last.</span>
            </h3>
            <p className="text-base font-medium leading-relaxed text-ink/80 md:text-lg">
              A future where the next wave of great businesses comes from anyone
              with the drive to build, backed by the structure and community to
              see it through.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}