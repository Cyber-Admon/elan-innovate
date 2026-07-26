"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const whatsappLink = `https://wa.me/${site.phoneRaw.replace("+", "")}`;

const inputStyles =
  "w-full border-4 border-ink bg-paper px-4 py-3 text-base font-medium placeholder:text-ink/40";
const labelStyles = "mb-2 block text-xs font-bold uppercase tracking-widest";

export default function EnquiryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function buildWhatsApp() {
    const lines = [
      "Hello Elan Innovate, I'd like to talk about working with you.",
      "",
      `Name: ${form.name}`,
      form.business ? `Business: ${form.business}` : "",
      form.details ? `Details: ${form.details}` : "",
    ].filter(Boolean);
    return `${whatsappLink}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          service: "General enquiry",
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("failed");
      setSubmitted(true);
    } catch {
      setError("Couldn't send. Try again, or reach us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto border-4 border-ink bg-paper"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-ink px-6 py-4">
          <p className="text-sm font-black uppercase tracking-widest">
            Talk to us
          </p>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border-2 border-ink hover:bg-ink hover:text-paper"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" strokeWidth="2.5" aria-hidden="true">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div>
              <h3 className="mb-3 text-2xl font-black uppercase leading-tight">
                We&apos;ll be in touch.
              </h3>
              <p className="mb-6 text-base font-medium leading-relaxed text-ink/70">
                Thanks for reaching out. We&apos;ve got your message and will get
                back to you shortly.
              </p>
              <a href={buildWhatsApp()} target="_blank" rel="noopener noreferrer" className="inline-block bg-strike px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink">
                Continue on WhatsApp &rarr;
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="m-name" className={labelStyles}>Your name *</label>
                <input id="m-name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" className={inputStyles} />
              </div>
              <div>
                <label htmlFor="m-business" className={labelStyles}>Business name</label>
                <input id="m-business" value={form.business} onChange={(e) => update("business", e.target.value)} placeholder="If you have one" className={inputStyles} />
              </div>
              <div>
                <label htmlFor="m-email" className={labelStyles}>Email *</label>
                <input id="m-email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className={inputStyles} />
              </div>
              <div>
                <label htmlFor="m-phone" className={labelStyles}>Phone / WhatsApp *</label>
                <input id="m-phone" type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+234..." className={inputStyles} />
              </div>
              <div>
                <label htmlFor="m-details" className={labelStyles}>What do you need? *</label>
                <textarea id="m-details" required rows={3} value={form.details} onChange={(e) => update("details", e.target.value)} placeholder="Tell us what you're after." className={inputStyles} />
              </div>

              {error && (
                <p className="border-4 border-strike p-3 text-sm font-bold uppercase tracking-wide text-strike">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-3">
                <button type="submit" disabled={submitting} className="bg-strike px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink disabled:opacity-60">
                  {submitting ? "Sending..." : "Send enquiry"}
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <a href={buildWhatsApp()} target="_blank" rel="noopener noreferrer" className="border-4 border-ink px-4 py-3 text-center text-sm font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper">
                    WhatsApp
                  </a>
                  <a href={`tel:${site.phoneRaw}`} className="border-4 border-ink px-4 py-3 text-center text-sm font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper">
                    Call us
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}