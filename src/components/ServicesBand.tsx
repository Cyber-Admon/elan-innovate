import Link from "next/link";
import { site } from "@/lib/site";

const whatsappLink = `https://wa.me/${site.phoneRaw.replace("+", "")}`;

export default function ServicesBand() {
  return (
    <section className="border-y-4 border-ink bg-ink px-4 py-20 text-paper md:px-8 md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-6 inline-block border-2 border-paper px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
          For businesses
        </p>
        <h2 className="mb-10 text-3xl font-black uppercase leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Already building?
          <br />
          <span className="mt-3 inline-block bg-strike px-3 py-1 text-ink">
            Let us handle the rest.
          </span>
        </h2>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
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