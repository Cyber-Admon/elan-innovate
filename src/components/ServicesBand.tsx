import Link from "next/link";
import { site } from "@/lib/site";

const whatsappLink = `https://wa.me/${site.phoneRaw.replace("+", "")}`;

export default function ServicesBand() {
  return (
    <section className="border-y-4 border-ink bg-ink px-4 py-16 text-paper md:px-8 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
        <div>
          <p className="mb-4 inline-block border-2 border-paper px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
            For businesses
          </p>
          <h2 className="mb-5 text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl md:text-5xl">
            Already building?{" "}
            <span className="box-decoration-clone bg-strike px-2 text-ink">
              Let us handle the rest.
            </span>
          </h2>
          <p className="max-w-xl text-base font-medium leading-relaxed text-paper/80 md:text-lg">
            Design, strategy, legal, and setup, delivered by our team so you can
            focus on running the business. Tell us what you need and we&apos;ll
            send a quote.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/services"
            className="bg-strike px-8 py-4 text-center text-base font-bold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            See our services
          </Link>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="border-4 border-paper px-8 py-4 text-center text-base font-bold uppercase tracking-wide transition-colors hover:bg-paper hover:text-ink">
            Message us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}