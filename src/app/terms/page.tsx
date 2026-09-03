import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use | Elan Innovate",
  description: "The terms governing your use of the Elan Innovate website.",
};

const sectionStyles = "mb-10";
const headingStyles = "mb-3 text-xl font-black uppercase tracking-tight md:text-2xl";
const bodyStyles = "max-w-3xl text-base font-medium leading-relaxed text-ink/80";
const listStyles = "ml-6 max-w-3xl list-disc space-y-2 text-base font-medium leading-relaxed text-ink/80";

export default function TermsOfUse() {
  return (
    <main>
      <Navbar />

      <section className="border-b-4 border-ink px-4 py-14 md:px-8 md:py-20">
        <p className="mb-4 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
          Legal
        </p>
        <h1 className="mb-4 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
          Terms of Use
        </h1>
        <p className="text-sm font-medium text-ink/50">Last updated: August 2026</p>
      </section>

      <section className="px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className={sectionStyles}>
            <p className={bodyStyles}>
              These Terms of Use (&quot;Terms&quot;) govern your access to and use of the
              Elan Innovate website (&quot;the Site&quot;). By using the Site, you agree to
              these Terms. If you don&apos;t agree, please don&apos;t use the Site.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Who we are</h2>
            <p className={bodyStyles}>
              Elan Innovate is a venture-building institution operated under
              Elan Innovates Limited, offering agency services, an incubation
              program, and (in future) an acceleration program.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Using the Site</h2>
            <ul className={listStyles}>
              <li>You must provide accurate information when applying, enquiring, or registering.</li>
              <li>You won&apos;t use the Site for any unlawful purpose or to submit false, misleading, or harmful content.</li>
              <li>You won&apos;t attempt to gain unauthorized access to any part of the Site, including the admin or fellow portal areas.</li>
              <li>You&apos;re responsible for keeping any account credentials you create secure.</li>
            </ul>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Applications and enquiries</h2>
            <p className={bodyStyles}>
              Submitting an application or enquiry through the Site does not
              guarantee acceptance into any program or engagement of our
              services. We review submissions at our discretion and will
              communicate outcomes directly.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Intellectual property</h2>
            <p className={bodyStyles}>
              The Site&apos;s content, design, branding, and materials belong to
              Elan Innovate unless otherwise stated, and may not be copied,
              reproduced, or used without our written permission. This does not
              affect ownership of the ideas or businesses you submit to us; see
              our separate Program Terms for how that&apos;s handled for accepted
              fellows.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Third-party services</h2>
            <p className={bodyStyles}>
              The Site uses third-party services including Google (for
              sign-in and calendar scheduling), Supabase (for data storage), and
              WhatsApp (for direct messaging). Your use of those services is also
              subject to their own terms.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>No warranty</h2>
            <p className={bodyStyles}>
              The Site is provided &quot;as is&quot;. We do our best to keep it accurate
              and available, but we don&apos;t guarantee it will be error-free,
              uninterrupted, or fit for any particular purpose.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Limitation of liability</h2>
            <p className={bodyStyles}>
              To the extent permitted by law, Elan Innovate is not liable for any
              indirect, incidental, or consequential loss arising from your use
              of the Site or reliance on its content.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Changes to these Terms</h2>
            <p className={bodyStyles}>
              We may update these Terms from time to time. Continued use of the
              Site after changes are posted means you accept the updated Terms.
            </p>
          </div>

          <div className={sectionStyles}>
            <h2 className={headingStyles}>Governing law</h2>
            <p className={bodyStyles}>
              These Terms are governed by the laws of the Federal Republic of
              Nigeria.
            </p>
          </div>

          <div>
            <h2 className={headingStyles}>Contact us</h2>
            <p className={bodyStyles}>
              Questions about these Terms? Reach us at{" "}
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