import Link from "next/link";

export default function Story() {
  return (
    <section className="border-b-4 border-ink">
      {/* The problem — ivory, calm */}
      <div
        className="px-4 py-20 md:px-8 md:py-28"
        style={{ backgroundColor: "#FFFFF0" }}
      >
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest">
            The problem
          </p>
          <h2 className="text-3xl font-black uppercase leading-[1.1] tracking-tight md:text-5xl">
            Great ideas don&apos;t fail because they&apos;re not good. They fail
            because{" "}
            <span className="text-strike">
              no one helps entrepreneurs build for scale.
            </span>
          </h2>
        </div>
      </div>

      {/* The mission — black block, image on the left, text right-aligned */}
      <div className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-16 md:px-8 md:py-20">
          {/* Left: stock image opposite the mission */}
          <div className="aspect-[4/5] w-full border-4 border-paper">
            {/*
              When you have the stock image, drop it in public/ and replace
              the placeholder div below with:
              <img
                src="/mission-image.jpg"
                alt="Entrepreneurs building together"
                className="h-full w-full object-cover"
              />
            */}
            <div className="flex h-full w-full items-center justify-center">
              <span className="px-6 text-center text-xs font-bold uppercase tracking-widest text-paper/40">
                Image coming soon
              </span>
            </div>
          </div>

          {/* Right: the mission, right-aligned */}
          <div className="text-right">
            <p className="mb-6 inline-block border-2 border-paper px-3 py-1 text-xs font-bold uppercase tracking-widest">
              Our mission
            </p>
            <h3 className="mb-5 text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">
              Elan exists to <span className="text-strike">change that.</span>
            </h3>
            <p className="mb-10 ml-auto max-w-md text-base font-medium leading-relaxed text-paper/80 md:text-lg">
              We give entrepreneurs the structure, resources, and support they
              need to build strong businesses and create lasting impact, whether
              you&apos;re starting from an idea or scaling one that already
              exists.
            </p>
            <Link
              href="/apply"
              className="inline-block bg-strike px-8 py-4 text-base font-bold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              Start building with us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}