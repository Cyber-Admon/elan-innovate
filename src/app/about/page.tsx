import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Leadership from "@/components/Leadership";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About | Elan Innovate",
  description:
    "Elan Innovate is a venture-building institution transforming ideas into scalable ventures and helping businesses scale.",
};

const whatsappLink = `https://wa.me/${site.phoneRaw.replace("+", "")}`;

const contactOptions = [
  {
    label: "WhatsApp us",
    detail: "Fastest way to reach us",
    href: whatsappLink,
    external: true,
  },
  {
    label: "Call us",
    detail: site.phone,
    href: `tel:${site.phoneRaw}`,
    external: false,
  },
  {
    label: "Email us",
    detail: site.email,
    href: `mailto:${site.email}`,
    external: false,
  },
];

export default function About() {
  return (
    <main>
      <Navbar />

      {/* Intro */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <p className="mb-4 inline-block bg-ink px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
          About
        </p>
        <h1 className="mb-6 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
          {site.positioning}
        </h1>
        <p className="max-w-xl text-base font-medium leading-relaxed md:text-lg">
          Elan Innovate is a venture-building institution. We transform ideas
          into scalable ventures and help businesses scale, through agency
          services, incubation, and acceleration.
        </p>
      </section>

      {/* Full team */}
      <Leadership />

      {/* Contact */}
      <section
        id="contact"
        className="scroll-mt-4 border-t-4 border-ink bg-navy px-4 py-16 text-paper md:px-8 md:py-24"
      >
        <p className="mb-4 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
          Contact
        </p>
        <h2 className="mb-10 max-w-4xl text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl md:mb-14 md:text-6xl">
          Reach us <span className="text-strike">your way.</span>
        </h2>

        <div className="grid border-4 border-paper md:grid-cols-3">
          {contactOptions.map((option, i) => (
            <a
              key={option.label}
              href={option.href}
              {...(option.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={`group flex flex-col p-6 transition-colors hover:bg-strike md:p-10 ${
                i < contactOptions.length - 1
                  ? "border-b-4 border-paper md:border-b-0 md:border-r-4"
                  : ""
              }`}
            >
              <p className="mb-2 text-xl font-black uppercase leading-tight md:text-2xl">
                {option.label} <span className="text-strike group-hover:text-paper">&rarr;</span>
              </p>
              <p className="text-sm font-medium opacity-80 md:text-base">
                {option.detail}
              </p>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}