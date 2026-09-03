import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Notice | Elan Innovate",
  description: "How Elan Innovate uses cookies and similar technologies.",
};

const sectionStyles = "mb-10";
const headingStyles = "mb-3 text-xl font-black uppercase tracking-tight md:text-2xl";
const bodyStyles = "max-w-3xl text-base font-medium leading-relaxed text-ink/80";

export default function CookieNotice() {
  return (
    <main>
      <Navbar />
      <section className="border-b-4 border-ink px-4 py-14 md:px-8 md:py-20">
        <p className="mb-4 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">Legal</p>
        <h1 className="mb-4 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">Cookie Notice</h1>
        <p className="text-sm font-medium text-ink/50">Last updated: August 2026</p>
      </section>
      <section className="px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className={sectionStyles}>
            <p className={bodyStyles}>
              Elan Innovate uses a limited number of cookies and similar technologies, mainly to keep you signed in (for admin and fellow accounts) and to remember basic preferences. We do not use cookies for third-party advertising.
            </p>
          </div>
          <div className={sectionStyles}>
            <h2 className={headingStyles}>What we use</h2>
            <p className={bodyStyles}>
              Authentication cookies set by Supabase to keep you logged in securely. These are essential to using the admin dashboard and fellow portal, and can&apos;t be disabled without logging out.
            </p>
          </div>
          <div>
            <h2 className={headingStyles}>Contact us</h2>
            <p className={bodyStyles}>Questions? Reach us at{" "}<a href={`mailto:${site.email}`} className="font-bold text-strike hover:underline">{site.email}</a>.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}