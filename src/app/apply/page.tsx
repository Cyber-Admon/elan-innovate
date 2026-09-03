"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

const stages = [
  { value: "idea", label: "Idea only" },
  { value: "building", label: "Started building" },
  { value: "users", label: "Has users" },
];

type TeamMember = {
  name: string;
  email: string;
  phone: string;
  isStudent: "yes" | "no" | "";
  skills: string;
};

const emptyMember: TeamMember = { name: "", email: "", phone: "", isStudent: "", skills: "" };

const inputStyles =
  "w-full border-4 border-ink bg-paper px-4 py-3 text-base font-medium placeholder:text-ink/40";
const labelStyles = "mb-2 block text-xs font-bold uppercase tracking-widest";

type CohortSettings = {
  is_open: boolean;
  opens_at: string | null;
  closes_at: string | null;
  cohort_label: string | null;
};

function isActuallyOpen(s: CohortSettings | null): boolean {
  if (!s) return true; // fail open if settings fail to load, so applying is never silently blocked
  if (!s.is_open) return false;
  const now = new Date();
  if (s.opens_at && now < new Date(s.opens_at)) return false;
  if (s.closes_at && now > new Date(s.closes_at)) return false;
  return true;
}

function InterestForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/cohort-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="border-4 border-ink bg-navy p-6 text-paper md:p-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-strike">
          You&apos;re on the list
        </p>
        <p className="text-base font-medium leading-relaxed text-paper/80">
          We&apos;ll email you the moment the next cohort opens.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="int-name" className={labelStyles}>Full name *</label>
        <input
          id="int-name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          className={inputStyles}
        />
      </div>
      <div>
        <label htmlFor="int-email" className={labelStyles}>Email *</label>
        <input
          id="int-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputStyles}
        />
      </div>
      {error && (
        <p className="border-4 border-strike p-3 text-sm font-bold uppercase tracking-wide text-strike">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="self-start bg-strike px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Notify me"}
      </button>
    </form>
  );
}

export default function Apply() {
  const [settings, setSettings] = useState<CohortSettings | null>(null);
  const [checkingSettings, setCheckingSettings] = useState(true);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("/api/admin/cohort-settings?track=incubator")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings ?? null))
      .catch(() => setSettings(null))
      .finally(() => setCheckingSettings(false));
  }, []);

  function addMember() {
    setTeam((current) => [...current, { ...emptyMember }]);
  }

  function removeMember(index: number) {
    setTeam((current) => current.filter((_, i) => i !== index));
  }

  function updateMember(index: number, field: keyof TeamMember, value: string) {
    setTeam((current) =>
      current.map((member, i) => (i === index ? { ...member, [field]: value } : member))
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData(event.currentTarget);

    const application = {
      track: "incubator",
      fullName: data.get("fullName") as string,
      email: data.get("email") as string,
      phone: data.get("phone") as string,
      campus: (data.get("campus") as string) || null,
      ideaName: data.get("ideaName") as string,
      oneLiner: data.get("oneLiner") as string,
      problem: data.get("problem") as string,
      stage: data.get("stage") as string,
      team: team.length
        ? team.map((member) => ({
            name: member.name,
            email: member.email,
            phone: member.phone,
            isStudent: member.isStudent === "yes",
            skills: member.skills,
          }))
        : null,
      why: data.get("why") as string,
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(application),
      });
      if (!response.ok) throw new Error("Request failed");
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch {
      setError("Something went wrong sending your application. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const open = isActuallyOpen(settings);

  return (
    <main>
      <Navbar />

      {checkingSettings ? (
        <section className="px-4 py-20 md:px-8 md:py-32">
          <p className="text-sm font-bold uppercase tracking-widest text-ink/40">
            Loading...
          </p>
        </section>
      ) : submitted ? (
        <section className="px-4 py-20 md:px-8 md:py-32">
          <p className="mb-4 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
            Application received
          </p>
          <h1 className="mb-6 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            You&apos;re in <span className="text-strike">the pipeline.</span>
          </h1>
          <p className="max-w-xl text-base font-medium leading-relaxed md:text-lg">
            We&apos;ve received your application. A confirmation email is on its
            way to your inbox, so keep an eye out (check spam too, just in
            case). We&apos;ll be in touch about next steps.
          </p>
        </section>
      ) : !open ? (
        /* Closed state */
        <section className="px-4 py-20 md:px-8 md:py-32">
          <p className="mb-4 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest md:text-sm">
            Applications closed
          </p>
          <h1 className="mb-6 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            {settings?.cohort_label ?? "This cohort"}{" "}
            <span className="text-strike">is full.</span>
          </h1>
          <p className="mb-10 max-w-xl text-base font-medium leading-relaxed md:text-lg">
            We&apos;re not taking new applications right now. Leave your email
            and we&apos;ll notify you the moment the next cohort opens.
          </p>
          <div className="max-w-md">
            <InterestForm />
          </div>
        </section>
      ) : (
        <>
          {/* Header */}
          <section className="border-b-4 border-ink px-4 py-14 md:px-8 md:py-20">
            <p className="mb-4 inline-block bg-ink px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
              The application
            </p>
            <h1 className="mb-6 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              Apply to <span className="text-strike">the Incubator.</span>
            </h1>
            <p className="max-w-xl text-base font-medium leading-relaxed md:text-lg">
              It&apos;s free, it takes a few minutes, and your idea doesn&apos;t
              need to be perfect. Tell us where you are honestly and we take it
              from there.
              {settings?.cohort_label ? ` ${settings.cohort_label}.` : ""}
            </p>
          </section>

          {/* Form */}
          <section className="px-4 py-12 md:px-8 md:py-16">
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-8">
              <fieldset>
                <legend className={labelStyles}>Choose your track</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center justify-between gap-3 border-4 border-ink bg-navy p-4 text-paper">
                    <span className="flex items-center gap-3">
                      <input type="radio" name="track" value="incubator" defaultChecked className="h-5 w-5 accent-[#ff6a00]" />
                      <span className="text-sm font-bold uppercase tracking-wide">The Incubator</span>
                    </span>
                    <span className="bg-strike px-2 py-1 text-[10px] font-bold uppercase tracking-widest">Open</span>
                  </label>
                  <label className="flex cursor-not-allowed items-center justify-between gap-3 border-4 border-ink p-4 opacity-50">
                    <span className="flex items-center gap-3">
                      <input type="radio" name="track" value="accelerator" disabled className="h-5 w-5" />
                      <span className="text-sm font-bold uppercase tracking-wide">The Accelerator</span>
                    </span>
                    <span className="border-2 border-ink px-2 py-1 text-[10px] font-bold uppercase tracking-widest">Opening later</span>
                  </label>
                </div>
              </fieldset>

              <div>
                <label htmlFor="fullName" className={labelStyles}>Full name *</label>
                <input id="fullName" name="fullName" type="text" required autoComplete="name" placeholder="Your full name" className={inputStyles} />
              </div>

              <div className="grid gap-8 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label htmlFor="email" className={labelStyles}>Email *</label>
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputStyles} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelStyles}>Phone / WhatsApp *</label>
                  <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+234..." className={inputStyles} />
                </div>
              </div>

              <div>
                <label htmlFor="campus" className={labelStyles}>Campus / Institution (optional)</label>
                <input id="campus" name="campus" type="text" placeholder="Where you study, if you're a student" className={inputStyles} />
              </div>

              <div>
                <label htmlFor="ideaName" className={labelStyles}>Business idea name *</label>
                <input id="ideaName" name="ideaName" type="text" required placeholder="What do you call it?" className={inputStyles} />
              </div>

              <div>
                <label htmlFor="oneLiner" className={labelStyles}>Describe it in one line *</label>
                <input id="oneLiner" name="oneLiner" type="text" required maxLength={120} placeholder="One sentence, plain words" className={inputStyles} />
              </div>

              <div>
                <label htmlFor="problem" className={labelStyles}>What problem does it solve? *</label>
                <textarea id="problem" name="problem" required rows={4} placeholder="Who has this problem, and how does your idea fix it?" className={inputStyles} />
              </div>

              <fieldset>
                <legend className={labelStyles}>Where is it right now? *</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {stages.map((stage) => (
                    <label key={stage.value} className="flex cursor-pointer items-center gap-3 border-4 border-ink p-4">
                      <input type="radio" name="stage" value={stage.value} required className="h-5 w-5 accent-[#ff6a00]" />
                      <span className="text-sm font-bold uppercase tracking-wide">{stage.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className={labelStyles}>Your team (optional)</legend>
                <p className="mb-4 text-sm font-medium opacity-70">
                  Building alone? Skip this, that&apos;s fine. If you have people building with you, add each of them.
                </p>

                <div className="flex flex-col gap-4">
                  {team.map((member, index) => (
                    <div key={index} className="border-4 border-ink p-4 md:p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-widest text-strike">
                          Team member {String(index + 1).padStart(2, "0")}
                        </p>
                        <button type="button" onClick={() => removeMember(index)} className="border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper">
                          Remove
                        </button>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div>
                          <label htmlFor={`member-name-${index}`} className={labelStyles}>Name *</label>
                          <input id={`member-name-${index}`} type="text" required value={member.name} onChange={(e) => updateMember(index, "name", e.target.value)} placeholder="Their full name" className={inputStyles} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor={`member-email-${index}`} className={labelStyles}>Email *</label>
                            <input id={`member-email-${index}`} type="email" required value={member.email} onChange={(e) => updateMember(index, "email", e.target.value)} placeholder="their@email.com" className={inputStyles} />
                          </div>
                          <div>
                            <label htmlFor={`member-phone-${index}`} className={labelStyles}>Phone / WhatsApp *</label>
                            <input id={`member-phone-${index}`} type="tel" required value={member.phone} onChange={(e) => updateMember(index, "phone", e.target.value)} placeholder="+234..." className={inputStyles} />
                          </div>
                        </div>

                        <div>
                          <p className={labelStyles}>Are they a student? *</p>
                          <div className="grid grid-cols-2 gap-3">
                            {(["yes", "no"] as const).map((option) => (
                              <label key={option} className="flex cursor-pointer items-center gap-3 border-4 border-ink p-3">
                                <input type="radio" name={`member-student-${index}`} required checked={member.isStudent === option} onChange={() => updateMember(index, "isStudent", option)} className="h-5 w-5 accent-[#ff6a00]" />
                                <span className="text-sm font-bold uppercase tracking-wide">
                                  {option === "yes" ? "Student" : "Not a student"}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label htmlFor={`member-skills-${index}`} className={labelStyles}>Skills *</label>
                          <input id={`member-skills-${index}`} type="text" required value={member.skills} onChange={(e) => updateMember(index, "skills", e.target.value)} placeholder="What they bring, e.g. design, sales, coding" className={inputStyles} />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={addMember} className="self-start border-4 border-ink px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper">
                    + Add a team member
                  </button>
                </div>
              </fieldset>

              <div>
                <label htmlFor="why" className={labelStyles}>Why do you want in? *</label>
                <textarea id="why" name="why" required rows={3} placeholder="Short and honest beats long and polished" className={inputStyles} />
              </div>

              {error && (
                <p className="border-4 border-strike p-4 text-sm font-bold uppercase tracking-wide text-strike">
                  {error}
                </p>
              )}

              <button type="submit" disabled={submitting} className="bg-strike px-8 py-4 text-base font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60">
                {submitting ? "Submitting..." : "Submit application"}
              </button>
              <p className="text-sm font-medium opacity-70">
                Questions before you apply? Reach us at {site.email}.
              </p>
            </form>
          </section>
        </>
      )}

      <Footer />
    </main>
  );
}