"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const services = [
  "Design and Branding",
  "Strategy and Growth",
  "Advisory and Legal",
  "Business Setup (CAC / SCUML)",
  "Pitch Deck or Website",
  "Not sure yet",
];

const inputStyles =
  "w-full border-4 border-ink bg-paper px-4 py-3 text-base font-medium placeholder:text-ink/40";
const labelStyles = "mb-2 block text-xs font-bold uppercase tracking-widest";

export default function EnquiryForm() {
  const [form, setForm] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    service: "",
    details: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function buildWhatsAppMessage() {
    const lines = [
      "Hello Elan Innovate, I'd like to enquire about your services.",
      "",
      `Name: ${form.name}`,
      form.business ? `Business: ${form.business}` : "",
      form.service ? `Service needed: ${form.service}` : "",
      form.details ? `Details: ${form.details}` : "",
    ].filter(Boolean);
    return encodeURIComponent(lines.join("\n"));
  }

  function sendWhatsApp() {
    const url = `https://wa.me/${site.phoneRaw.replace("+", "")}?text=${buildWhatsAppMessage()}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const enquiry = { ...form, submittedAt: new Date().toISOString() };

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiry),
      });
      if (!res.ok) throw new Error("failed");
      setSubmitted(true);
      window.scrollTo({ top: document.getElementById("enquire")?.offsetTop ?? 0 });
    } catch {
      setError(
        "Couldn't send your enquiry. Try again, or reach us on WhatsApp instead."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border-4 border-ink bg-navy p-8 text-paper md:p-12">
        <p className="mb-4 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest">
          Enquiry received
        </p>
        <h3 className="mb-4 text-2xl font-black uppercase leading-tight md:text-3xl">
          We&apos;ll be in touch.
        </h3>
        <p className="max-w-xl text-base font-medium leading-relaxed text-paper/80">
          Thanks for reaching out. We&apos;ve got your enquiry and will get back
          to you shortly with next steps. Need it faster? Message us on WhatsApp.
        </p>
        <button
          type="button"
          onClick={sendWhatsApp}
          className="mt-6 bg-strike px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-navy"
        >
          Continue on WhatsApp &rarr;
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelStyles}>
            Your name *
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Full name"
            className={inputStyles}
          />
        </div>
        <div>
          <label htmlFor="business" className={labelStyles}>
            Business name
          </label>
          <input
            id="business"
            value={form.business}
            onChange={(e) => update("business", e.target.value)}
            placeholder="If you have one"
            className={inputStyles}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelStyles}>
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            className={inputStyles}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelStyles}>
            Phone / WhatsApp *
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+234..."
            className={inputStyles}
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className={labelStyles}>
          What do you need? *
        </label>
        <select
          id="service"
          required
          value={form.service}
          onChange={(e) => update("service", e.target.value)}
          className={inputStyles}
        >
          <option value="" disabled>
            Choose a service
          </option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="details" className={labelStyles}>
          Tell us more *
        </label>
        <textarea
          id="details"
          required
          rows={4}
          value={form.details}
          onChange={(e) => update("details", e.target.value)}
          placeholder="What are you trying to get done? The more detail, the better we can help."
          className={inputStyles}
        />
      </div>

      {error && (
        <p className="border-4 border-strike p-4 text-sm font-bold uppercase tracking-wide text-strike">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={submitting}
          className="bg-strike px-8 py-4 text-base font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send enquiry"}
        </button>
        <button
          type="button"
          onClick={sendWhatsApp}
          className="border-4 border-ink px-8 py-4 text-base font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
        >
          Send on WhatsApp
        </button>
      </div>
    </form>
  );
}