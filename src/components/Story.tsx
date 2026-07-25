import Link from "next/link";

export default function Story() {
  return (
    <section
      className="border-b-4 border-ink px-4 py-20 md:px-8 md:py-28"
      style={{ backgroundColor: "#FFFFF0" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Left: problem, then mission stacked under it */}
        <div>
          <p className="mb-6 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest">
            The problem
          </p>
          <h2 className="text-3xl font-black uppercase leading-[1.1] tracking-tight md:text-4xl">
            Great ideas don&apos;t fail because they&apos;re not good. They fail
            because{" "}
            <span className="text-strike">
              no one helps entrepreneurs build for scale.
            </span>
          </h2>

          <div className="mt-12">
            <p className="mb-6 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest">
              Our mission
            </p>
            <h3 className="mb-5 text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">
              Elan exists to change that.
            </h3>
            <p className="mb-10 max-w-md text-base font-medium leading-relaxed text-ink/80 md:text-lg">
              We give entrepreneurs the structure, resources, and support they
              need to build strong businesses and create lasting impact, whether
              you&apos;re starting from an idea or scaling one that already
              exists.
            </p>
            <Link
              href="/apply"
              className="inline-block bg-strike px-8 py-4 text-base font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink"
            >
              Start building with us
            </Link>
          </div>
        </div>

        {/* Right: stock image opposite the text */}
        <div className="aspect-[4/5] w-full border-4 border-ink bg-navy">
          {/*
            When you have the stock image, drop it in public/ and replace
            the placeholder div below with:
            <img
              src="/story-image.jpg"
              alt="Entrepreneurs building together"
              className="h-full w-full object-cover"
            />
          */}
          <div className="flex h-full w-full items-center justify-center">
            <img
              src="/mission-image.jpg"
              alt="Entrepreneurs building together"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}