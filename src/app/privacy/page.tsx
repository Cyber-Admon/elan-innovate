import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Elan Innovate",
  description: "How Elan Innovate collects, uses, and protects your personal data.",
};

const sectionStyles = "mb-10";
const headingStyles = "mb-3 text-xl font-black uppercase tracking-tight md:text-2xl";
const bodyStyles = "max-w-3xl text-base font-medium leading-relaxed text-ink/80";
const listStyles = "ml-6 max-w-3xl list-disc space-y-2 text-base font-medium leading-relaxed text-ink/80";

export default function PrivacyPolicy() {
  return (
    <main>
      <Navbar />

      <section className="border-b-4 border-ink px-4 py-14 md:px-8 md:py-20">
        <p className="mb-4 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
          Legal
        </p>
        <h1 className="mb-4 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
          Privacy Policy
        </h1>
        <p className="text-sm font-medium text-ink/50">Last updated: August 2026</p>
      </section>

      <section className="px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className={sectionStyles}>
            <p className={bodyStyles}>
              Elan Innovate (&quot;Elan&quot;, &quot;we&quot;, &quot;us&quot;) respects your privacy and
              is committed to protecting the personal data you share with us. This
              policy explains what we collect, why, how we use it, and the rights
              you have over it, in line with the Nigeria Data Protection Act
              (NDPA) 2023.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>What we collect</h2>
            <p className={`${bodyStyles} mb-3`}>
              Depending on how you interact with us, we may collect:
            </p>
            <ul className={listStyles}>
              <li>
                Identity and contact details you provide, such as your full name,
                email address, phone number, and institution or business name.
              </li>
              <li>
                Application information, including your business idea, the
                problem it solves, your stage of development, and details about
                any team members you submit on their behalf.
              </li>
              <li>
                Enquiry details when you contact us about our services, including
                what you&apos;re looking for and any message you send.
              </li>
              <li>
                Account information if you register as a fellow or admin,
                including your name, email, and (if you use Google Sign-In) basic
                profile information from your Google account.
              </li>
              <li>
                Communications between you and us, including emails and WhatsApp
                messages you initiate through the site.
              </li>
            </ul>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Why we collect it</h2>
            <ul className={listStyles}>
              <li>To review and respond to incubator and accelerator applications.</li>
              <li>To respond to service enquiries and provide quotes.</li>
              <li>To manage fellow accounts and program participation once accepted.</li>
              <li>To send confirmation emails, status updates, and program communications.</li>
              <li>To notify you when a new cohort opens, if you asked to be notified.</li>
              <li>To improve our services and understand how our programs are used.</li>
              <li>To meet legal and regulatory obligations.</li>
            </ul>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Where your data is stored</h2>
            <p className={bodyStyles}>
              Your data is stored using Supabase, a secure database provider, and
              processed through Google (for authentication and calendar
              scheduling, where applicable) and Gmail (for email communication).
              We take reasonable technical and organizational measures to protect
              your data, including access controls that limit who on our team can
              view your information.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Who sees your data</h2>
            <p className={bodyStyles}>
              Your data is accessible only to authorized Elan team members who
              need it to review applications, respond to enquiries, or manage the
              program you&apos;re part of. We do not sell your personal data. We do
              not share it with third parties except where necessary to operate
              the services above (such as our email and calendar providers), or
              where required by law.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>How long we keep it</h2>
            <p className={bodyStyles}>
              We retain application and enquiry data for as long as reasonably
              necessary to evaluate it, run the relevant cohort, and maintain
              records for reporting and legal purposes. You can ask us to delete
              your data at any time, subject to any records we&apos;re legally
              required to keep.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Your rights</h2>
            <p className={`${bodyStyles} mb-3`}>
              Under the Nigeria Data Protection Act, you have the right to:
            </p>
            <ul className={listStyles}>
              <li>Know what personal data we hold about you.</li>
              <li>Request a copy of your data.</li>
              <li>Ask us to correct inaccurate data.</li>
              <li>Ask us to delete your data, subject to legal exceptions.</li>
              <li>Withdraw consent for communications, such as cohort notifications.</li>
            </ul>
            <p className={`${bodyStyles} mt-3`}>
              To exercise any of these rights, contact us at {site.email}.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Children&apos;s privacy</h2>
            <p className={bodyStyles}>
              Our programs are intended for entrepreneurs generally aged 18 and
              above. We do not knowingly collect data from children under 18
              without appropriate consent.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Changes to this policy</h2>
            <p className={bodyStyles}>
              We may update this policy as our services evolve. Material changes
              will be reflected with an updated date at the top of this page.
            </p>
          </div>

          <div>
            <h2 className={headingStyles}>Contact us</h2>
            <p className={bodyStyles}>
              Questions about this policy or your data? Reach us at{" "}
              <a href={`mailto:${site.email}`} className="font-bold text-strike hover:underline">
                {site.email}
              </a>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}