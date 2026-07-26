import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import StoryFlow from "@/components/StoryFlow";
import Leadership from "@/components/Leadership";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import WhatWeBuild from "@/components/WhatWeBuild";

export const metadata: Metadata = {
  title: "About | Elan Innovate",
  description:
    "Elan Innovate is a venture-building institution transforming ideas into scalable ventures and helping businesses scale. This is why we exist.",
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
      <AboutHero />

      <StoryFlow />

      <WhatWeBuild />

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
          Reach us your way.
        </h2>

        <div className="grid border-4 border-paper md:grid-cols-3">
          {contactOptions.map((option, i) => (
            
            <a  key={option.label}
              href={option.href}
              target={option.external ? "_blank" : undefined}
              rel={option.external ? "noopener noreferrer" : undefined}
              className={`group flex flex-col p-6 transition-colors hover:bg-strike md:p-10 ${
                i < contactOptions.length - 1
                  ? "border-b-4 border-paper md:border-b-0 md:border-r-4"
                  : ""
              }`}
            >
              <p className="mb-2 text-xl font-black uppercase leading-tight md:text-2xl">
                {option.label}{" "}
                <span className="text-strike group-hover:text-paper">
                  &rarr;
                </span>
              </p>
              <p className="text-sm font-medium text-paper/80 md:text-base">
                {option.detail}
              </p>
            </a>
          ))}
        </div>

        {/* Follow us */}
        <div className="mt-12 flex flex-col gap-4 border-4 border-paper p-6 sm:flex-row sm:items-center sm:justify-between md:mt-16 md:p-8">
          <div>
            <h3 className="text-xl font-black uppercase leading-tight md:text-2xl">
              Follow the journey.
            </h3>
            <p className="mt-1 text-sm font-medium text-paper/80 md:text-base">
              See what we&apos;re building, and who we&apos;re building with.
            </p>
          </div>
          <div className="flex gap-3">
            
            <a  href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-paper px-5 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-paper hover:text-navy"
            >
              Instagram
            </a>
            
            <a  href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-paper px-5 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-paper hover:text-navy"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}