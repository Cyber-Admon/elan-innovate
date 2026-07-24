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

      <Footer />
    </main>
  );
}