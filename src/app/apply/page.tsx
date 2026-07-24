"use client";

import { useState } from "react";
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

const emptyMember: TeamMember = {
  name: "",
  email: "",
  phone: "",
  isStudent: "",
  skills: "",
};

const inputStyles =
  "w-full border-4 border-ink bg-paper px-4 py-3 text-base font-medium placeholder:text-ink/40";
const labelStyles =
  "mb-2 block text-xs font-bold uppercase tracking-widest";

export default function Apply() {
  const [submitted, setSubmitted] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);

  function addMember() {
    setTeam((current) => [...current, { ...emptyMember }]);
  }

  function removeMember(index: number) {
    setTeam((current) => current.filter((_, i) => i !== index));
  }

  function updateMember(
    index: number,
    field: keyof TeamMember,
    value: string
  ) {
    setTeam((current) =>
      current.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // The whole application as one object, ready to POST to a backend
    // that stores it and triggers the confirmation email.
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

    // TODO: replace with the real backend call, e.g.
    // await fetch("/api/apply", { method: "POST", body: JSON.stringify(application) })
    console.log("Application submitted:", application);

    setSubmitted(true);
    window.scrollTo(0, 0);
  }

  return (
    <main>
      <Navbar />

      {submitted ? (
        /* Confirmation state */
        <section className="px-4 py-20 md:px-8 md:py-32">
          <p className="mb-4 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper md:text-sm">
            Application received
          </p>
          <h1 className="mb-6 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            You're in <span className="text-strike">the pipeline.</span>
          </h1>
          <p className="max-w-xl text-base font-medium leading-relaxed md:text-lg">
            We've received your application. A confirmation email is on its way
            to your inbox, so keep an eye out (check spam too, just in case).
            We'll be in touch about next steps.
          </p>
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
              It's free, it takes a few minutes, and your idea doesn't need to
              be perfect. Tell us where you are honestly and we take it from
              there. The program runs Q4 2026.
            </p>
          </section>

          {/* Form */}
          <section className="px-4 py-12 md:px-8 md:py-16">
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-2xl flex-col gap-8"
            >
              {/* Track choice */}
              <fieldset>
                <legend className={labelStyles}>Choose your track</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center justify-between gap-3 border-4 border-ink bg-navy p-4 text-paper">
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="track"
                        value="incubator"
                        defaultChecked
                        className="h-5 w-5 accent-[#ff6a00]"
                      />
                      <span className="text-sm font-bold uppercase tracking-wide">
                        The Incubator
                      </span>
                    </span>
                    <span className="bg-strike px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                      Open
                    </span>
                  </label>
                  <label className="flex cursor-not-allowed items-center justify-between gap-3 border-4 border-ink p-4 opacity-50">
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="track"
                        value="accelerator"
                        disabled
                        className="h-5 w-5"
                      />
                      <span className="text-sm font-bold uppercase tracking-wide">
                        The Accelerator
                      </span>
                    </span>
                    <span className="border-2 border-ink px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                      Opening later
                    </span>
                  </label>
                </div>
              </fieldset>

              {/* About you */}
              <div>
                <label htmlFor="fullName" className={labelStyles}>
                  Full name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                  className={inputStyles}
                />
              </div>

              <div className="grid gap-8 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label htmlFor="email" className={labelStyles}>
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
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
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+234..."
                    className={inputStyles}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="campus" className={labelStyles}>
                  Campus / Institution (optional)
                </label>
                <input
                  id="campus"
                  name="campus"
                  type="text"
                  placeholder="Where you study, if you're a student"
                  className={inputStyles}
                />
              </div>

              {/* The idea */}
              <div>
                <label htmlFor="ideaName" className={labelStyles}>
                  Business idea name *
                </label>
                <input
                  id="ideaName"
                  name="ideaName"
                  type="text"
                  required
                  placeholder="What do you call it?"
                  className={inputStyles}
                />
              </div>

              <div>
                <label htmlFor="oneLiner" className={labelStyles}>
                  Describe it in one line *
                </label>
                <input
                  id="oneLiner"
                  name="oneLiner"
                  type="text"
                  required
                  maxLength={120}
                  placeholder="One sentence, plain words"
                  className={inputStyles}
                />
              </div>

              <div>
                <label htmlFor="problem" className={labelStyles}>
                  What problem does it solve? *
                </label>
                <textarea
                  id="problem"
                  name="problem"
                  required
                  rows={4}
                  placeholder="Who has this problem, and how does your idea fix it?"
                  className={inputStyles}
                />
              </div>

              {/* Stage */}
              <fieldset>
                <legend className={labelStyles}>
                  Where is it right now? *
                </legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {stages.map((stage) => (
                    <label
                      key={stage.value}
                      className="flex cursor-pointer items-center gap-3 border-4 border-ink p-4"
                    >
                      <input
                        type="radio"
                        name="stage"
                        value={stage.value}
                        required
                        className="h-5 w-5 accent-[#ff6a00]"
                      />
                      <span className="text-sm font-bold uppercase tracking-wide">
                        {stage.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Their team */}
              <fieldset>
                <legend className={labelStyles}>Your team (optional)</legend>
                <p className="mb-4 text-sm font-medium opacity-70">
                  Building alone? Skip this, that's fine. If you have people
                  building with you, add each of them.
                </p>

                <div className="flex flex-col gap-4">
                  {team.map((member, index) => (
                    <div
                      key={index}
                      className="border-4 border-ink p-4 md:p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-widest text-strike">
                          Team member {String(index + 1).padStart(2, "0")}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeMember(index)}
                          className="border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div>
                          <label
                            htmlFor={`member-name-${index}`}
                            className={labelStyles}
                          >
                            Name *
                          </label>
                          <input
                            id={`member-name-${index}`}
                            type="text"
                            required
                            value={member.name}
                            onChange={(e) =>
                              updateMember(index, "name", e.target.value)
                            }
                            placeholder="Their full name"
                            className={inputStyles}
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor={`member-email-${index}`}
                              className={labelStyles}
                            >
                              Email *
                            </label>
                            <input
                              id={`member-email-${index}`}
                              type="email"
                              required
                              value={member.email}
                              onChange={(e) =>
                                updateMember(index, "email", e.target.value)
                              }
                              placeholder="their@email.com"
                              className={inputStyles}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`member-phone-${index}`}
                              className={labelStyles}
                            >
                              Phone / WhatsApp *
                            </label>
                            <input
                              id={`member-phone-${index}`}
                              type="tel"
                              required
                              value={member.phone}
                              onChange={(e) =>
                                updateMember(index, "phone", e.target.value)
                              }
                              placeholder="+234..."
                              className={inputStyles}
                            />
                          </div>
                        </div>

                        <div>
                          <p className={labelStyles}>Are they a student? *</p>
                          <div className="grid grid-cols-2 gap-3">
                            {(["yes", "no"] as const).map((option) => (
                              <label
                                key={option}
                                className="flex cursor-pointer items-center gap-3 border-4 border-ink p-3"
                              >
                                <input
                                  type="radio"
                                  name={`member-student-${index}`}
                                  required
                                  checked={member.isStudent === option}
                                  onChange={() =>
                                    updateMember(index, "isStudent", option)
                                  }
                                  className="h-5 w-5 accent-[#ff6a00]"
                                />
                                <span className="text-sm font-bold uppercase tracking-wide">
                                  {option === "yes" ? "Student" : "Not a student"}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor={`member-skills-${index}`}
                            className={labelStyles}
                          >
                            Skills *
                          </label>
                          <input
                            id={`member-skills-${index}`}
                            type="text"
                            required
                            value={member.skills}
                            onChange={(e) =>
                              updateMember(index, "skills", e.target.value)
                            }
                            placeholder="What they bring, e.g. design, sales, coding"
                            className={inputStyles}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addMember}
                    className="self-start border-4 border-ink px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
                  >
                    + Add a team member
                  </button>
                </div>
              </fieldset>

              <div>
                <label htmlFor="why" className={labelStyles}>
                  Why do you want in? *
                </label>
                <textarea
                  id="why"
                  name="why"
                  required
                  rows={3}
                  placeholder="Short and honest beats long and polished"
                  className={inputStyles}
                />
              </div>

              <button
                type="submit"
                className="bg-strike px-8 py-4 text-base font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink"
              >
                Submit application
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