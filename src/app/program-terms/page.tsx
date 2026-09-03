import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Program Terms | Elan Innovate",
  description: "Terms governing participation in Elan Innovate's incubator and accelerator programs.",
};

const sectionStyles = "mb-10";
const headingStyles = "mb-3 text-xl font-black uppercase tracking-tight md:text-2xl";
const bodyStyles = "max-w-3xl text-base font-medium leading-relaxed text-ink/80";
const listStyles = "ml-6 max-w-3xl list-disc space-y-2 text-base font-medium leading-relaxed text-ink/80";

export default function ProgramTerms() {
  return (
    <main>
      <Navbar />
      <section className="border-b-4 border-ink px-4 py-14 md:px-8 md:py-20">
        <p className="mb-4 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">Legal</p>
        <h1 className="mb-4 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">Program Terms</h1>
        <p className="text-sm font-medium text-ink/50">Last updated: August 2026</p>
      </section>
      <section className="px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className={sectionStyles}>
            <p className={bodyStyles}>
              These Program Terms apply to anyone who applies to, is accepted into, or participates in an Elan Innovate incubator or accelerator cohort ("Program"), in addition to our general Terms of Use.
            </p>
          </div>
          <div className={sectionStyles}>
            <h2 className={headingStyles}>Acceptance is not guaranteed</h2>
            <p className={bodyStyles}>Applying does not guarantee a place in the Program. We select participants at our discretion based on our review process.</p>
          </div>
          <div className={sectionStyles}>
            <h2 className={headingStyles}>No employment relationship</h2>
            <p className={bodyStyles}>Participation in the Program does not create an employment, agency, or partnership relationship between you and Elan Innovate.</p>
          </div>
          <div className={sectionStyles}>
            <h2 className={headingStyles}>Intellectual property</h2>
            <p className={bodyStyles}>
              Ownership of intellectual property, equity, or any stake in a business developed during or as a result of the Program is not determined by these Program Terms. It is addressed separately in a written agreement between you and Elan Innovate, agreed at the time of your acceptance into a specific cohort. Until such an agreement is signed, no assumption should be made by either party about IP or equity arrangements.
            </p>
          </div>
          <div className={sectionStyles}>
            <h2 className={headingStyles}>Conduct and removal</h2>
            <ul className={listStyles}>
              <li>You agree to participate honestly and respectfully with our team and fellow participants.</li>
              <li>We may remove a participant from the Program for conduct that is dishonest, disruptive, or harmful to Elan Innovate or other participants.</li>
              <li>We may also remove a participant who fails to meaningfully engage with Program requirements.</li>
            </ul>
          </div>
          <div className={sectionStyles}>
            <h2 className={headingStyles}>Community and communication</h2>
            <p className={bodyStyles}>Accepted fellows may be added to a community (such as a WhatsApp group) and receive Program communications. You&apos;re expected to engage respectfully and can request removal from communications at any time.</p>
          </div>
          <div className={sectionStyles}>
            <h2 className={headingStyles}>No guarantee of outcomes</h2>
            <p className={bodyStyles}>Elan Innovate provides structure, guidance, and support in good faith, but does not guarantee funding, revenue, business success, or any specific outcome from participation in the Program.</p>
          </div>
          <div>
            <h2 className={headingStyles}>Contact us</h2>
            <p className={bodyStyles}>Questions about these Program Terms? Reach us at{" "}<a href={`mailto:${site.email}`} className="font-bold text-strike hover:underline">{site.email}</a>.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}