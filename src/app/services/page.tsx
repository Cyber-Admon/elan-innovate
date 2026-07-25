import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Agency Services | Elan Innovate",
  description:
    "Design, branding, strategy, advisory, legal, and business setup for businesses ready to build for scale. Tell us what you need and we'll take it from there.",
};

const groups = [
  {
    name: "Design and Branding",
    body: "The look and feel that makes people take your business seriously.",
    items: ["Graphics design", "Brand design", "Flyer design"],
    dark: false,
    icon: (
      <svg viewBox="0 0 32 32" fill="none" strokeWidth="2.5" aria-hidden="true" className="h-9 w-9 stroke-ink">
        <circle cx="11" cy="11" r="6" />
        <path d="M17 17 L28 28" />
        <path d="M22 6 L26 10 L18 18 L14 14 Z" />
      </svg>
    ),
  },
  {
    name: "Strategy and Growth",
    body: "The plan and the reach to move your business forward, not just look busy.",
    items: [
      "Business strategy",
      "Branding and marketing strategy",
      "Social media optimization",
      "Google Business Profile setup",
    ],
    dark: true,
    icon: (
      <svg viewBox="0 0 32 32" fill="none" strokeWidth="2.5" aria-hidden="true" className="h-9 w-9 stroke-strike">
        <circle cx="16" cy="16" r="12" />
        <circle cx="16" cy="16" r="5" />
        <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Advisory and Legal",
    body: "Guidance and legal cover so you build on solid ground.",
    items: [
      "Business consultation and advisory",
      "Legal consultation and advisory",
      "Contract drafting with legal oversight",
    ],
    dark: true,
    icon: (
      <svg viewBox="0 0 32 32" fill="none" strokeWidth="2.5" aria-hidden="true" className="h-9 w-9 stroke-strike">
        <line x1="16" y1="4" x2="16" y2="27" />
        <line x1="7" y1="9" x2="25" y2="9" />
        <path d="M7 9 L3 18 L11 18 Z" />
        <path d="M25 9 L21 18 L29 18 Z" />
        <line x1="10" y1="27" x2="22" y2="27" />
      </svg>
    ),
  },
  {
    name: "Business Setup",
    body: "Get registered and compliant, done right the first time.",
    items: ["CAC registration", "SCUML registration"],
    dark: false,
    icon: (
      <svg viewBox="0 0 32 32" fill="none" strokeWidth="2.5" aria-hidden="true" className="h-9 w-9 stroke-ink">
        <path d="M8 28 V6 L20 6 L20 28" />
        <line x1="4" y1="28" x2="28" y2="28" />
        <line x1="12" y1="11" x2="16" y2="11" />
        <line x1="12" y1="16" x2="16" y2="16" />
        <line x1="20" y1="14" x2="26" y2="14" />
        <line x1="26" y1="14" x2="26" y2="28" />
      </svg>
    ),
  },
  {
    name: "Pitch and Web",
    body: "The deck that wins the room and the site that closes the deal.",
    items: ["Pitch deck and proposal development", "Website development"],
    dark: false,
    icon: (
      <svg viewBox="0 0 32 32" fill="none" strokeWidth="2.5" aria-hidden="true" className="h-9 w-9 stroke-ink">
        <rect x="4" y="6" width="24" height="16" />
        <line x1="4" y1="22" x2="28" y2="22" />
        <line x1="16" y1="22" x2="16" y2="27" />
        <line x1="11" y1="27" x2="21" y2="27" />
        <polyline points="9,17 14,12 18,15 23,10" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <main>
      <Navbar />

    {/* Hero */}
      <header className="relative overflow-hidden border-b-4 border-ink bg-ink px-4 py-24 text-paper md:px-8 md:py-32">
        {/* Grid layer, light lines on black */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,252,0.10) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(255,255,252,0.10) 1.5px, transparent 1.5px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 45%, #000 40%, transparent 82%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 45%, #000 40%, transparent 82%)",
          }}
        />

        <div className="relative mx-auto max-w-5xl">
          <p className="mb-8 inline-block border-2 border-paper px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
            Agency Services
          </p>

          <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            The work behind
            <br />
            <span className="mt-3 inline-block bg-strike px-3 py-1 text-ink">
              businesses that scale.
            </span>
          </h1>

          <p className="ml-auto mt-8 max-w-xl text-base font-semibold leading-relaxed text-paper/90 md:mt-10 md:text-right md:text-lg">
            Design, strategy, legal, and setup, handled by a team that asks
            whether it actually solves your problem, not just whether it looks
            the part.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row md:mt-12">
            <a href="#enquire" className="bg-strike px-8 py-4 text-center text-base font-bold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink">
              Tell us what you need
            </a>
            <a href="#services" className="border-4 border-paper px-8 py-4 text-center text-base font-bold uppercase tracking-wide transition-colors hover:bg-paper hover:text-ink">
              See what we do
            </a>
          </div>
        </div>
      </header>

      {/* Service groups */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {groups.map((group, i) => (
            <div
              key={group.name}
              className={`flex flex-col border-4 border-ink p-6 md:p-8 ${
                group.dark ? "bg-ink text-paper" : "bg-paper text-ink"
              } ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                {group.icon}
                <span
                  className={`text-sm font-bold uppercase tracking-widest ${
                    group.dark ? "text-paper/30" : "text-ink/30"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="mb-2 text-2xl font-black uppercase leading-tight md:text-3xl">
                {group.name}
              </h2>
              <p
                className={`mb-6 text-sm font-medium leading-relaxed md:text-base ${
                  group.dark ? "text-paper/80" : "text-ink/70"
                }`}
              >
                {group.body}
              </p>
              <ul className="mt-auto flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className={`border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      group.dark ? "border-paper/60" : "border-ink/60"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Enquiry */}
      <section
        id="enquire"
        className="scroll-mt-4 border-t-4 border-ink px-4 py-16 md:px-8 md:py-24"
        style={{ backgroundColor: "#FFFFF0" }}
      >
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
            Start here
          </p>
          <h2 className="mb-6 text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl md:text-6xl">
            Tell us what you need.
          </h2>
          <p className="mb-10 max-w-xl text-base font-medium leading-relaxed text-ink/80 md:text-lg">
            No commitment, no upfront pricing. Describe what you&apos;re after
            and we&apos;ll come back with a quote and a plan. Prefer to talk?
            Send it straight to our WhatsApp in one tap.
          </p>
          <EnquiryForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}