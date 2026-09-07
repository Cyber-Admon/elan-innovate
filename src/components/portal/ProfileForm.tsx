"use client";

import { useState } from "react";

const inputStyles =
  "w-full border-4 border-ink bg-paper px-4 py-3 text-base font-medium placeholder:text-ink/40";
const labelStyles = "mb-2 block text-xs font-bold uppercase tracking-widest";
const sectionHeadingStyles = "mb-4 text-xl font-black uppercase tracking-tight";

type TeamMember = {
  name: string;
  email: string;
  phone: string;
  skills: string;
  invitedToIncubator: boolean;
};

const emptyMember: TeamMember = {
  name: "",
  email: "",
  phone: "",
  skills: "",
  invitedToIncubator: false,
};

export default function ProfileForm({
  fullName,
  phone,
  bio,
  photoUrl,
  ideaName,
  ideaOneLiner,
  ideaProblem,
  vision10yr,
  mission3_5yr,
  goal1yr,
  initialTeam,
}: {
  fullName: string;
  phone: string;
  bio: string;
  photoUrl: string;
  ideaName: string;
  ideaOneLiner: string;
  ideaProblem: string;
  vision10yr: string;
  mission3_5yr: string;
  goal1yr: string;
  initialTeam: TeamMember[];
}) {
  const [form, setForm] = useState({
    phone,
    bio,
    photoUrl,
    ideaName,
    ideaOneLiner,
    ideaProblem,
    vision10yr,
    mission3_5yr,
    goal1yr,
  });
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addMember() {
    setTeam((t) => [...t, { ...emptyMember }]);
  }

  function removeMember(index: number) {
    setTeam((t) => t.filter((_, i) => i !== index));
  }

  function updateMember(index: number, field: keyof TeamMember, value: string | boolean) {
    setTeam((t) =>
      t.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setFlash(null);
    try {
      const res = await fetch("/api/portal/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, team }),
      });
      if (!res.ok) throw new Error();
      setFlash("Saved. Any newly invited team members will get their own registration email shortly.");
      setTimeout(() => setFlash(null), 5000);
    } catch {
      setFlash("Save failed. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      {/* Basic info */}
      <section>
        <h2 className={sectionHeadingStyles}>Your Info</h2>
        <div className="flex flex-col gap-6">
          <div>
            <label className={labelStyles}>Full name</label>
            <input value={fullName} disabled className={`${inputStyles} opacity-60`} />
          </div>
          <div>
            <label htmlFor="phone" className={labelStyles}>Phone / WhatsApp *</label>
            <input
              id="phone"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+234..."
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="bio" className={labelStyles}>Short bio *</label>
            <textarea
              id="bio"
              required
              rows={3}
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="A couple of sentences about you."
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="photoUrl" className={labelStyles}>Photo URL *</label>
            <input
              id="photoUrl"
              required
              value={form.photoUrl}
              onChange={(e) => update("photoUrl", e.target.value)}
              placeholder="Link to a photo of you"
              className={inputStyles}
            />
          </div>
        </div>
      </section>

      {/* Idea */}
      <section>
        <h2 className={sectionHeadingStyles}>Your Idea</h2>
        <div className="flex flex-col gap-6">
          <div>
            <label htmlFor="ideaName" className={labelStyles}>Idea / business name *</label>
            <input
              id="ideaName"
              required
              value={form.ideaName}
              onChange={(e) => update("ideaName", e.target.value)}
              placeholder="What do you call it?"
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="ideaOneLiner" className={labelStyles}>One-liner *</label>
            <input
              id="ideaOneLiner"
              required
              value={form.ideaOneLiner}
              onChange={(e) => update("ideaOneLiner", e.target.value)}
              placeholder="One sentence, plain words"
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="ideaProblem" className={labelStyles}>What problem does it solve? *</label>
            <textarea
              id="ideaProblem"
              required
              rows={4}
              value={form.ideaProblem}
              onChange={(e) => update("ideaProblem", e.target.value)}
              placeholder="Who has this problem, and how does your idea fix it?"
              className={inputStyles}
            />
          </div>
        </div>
      </section>

      {/* Vision, Mission, Goal */}
      <section>
        <h2 className={sectionHeadingStyles}>Where You&apos;re Headed</h2>
        <div className="flex flex-col gap-6">
          <div>
            <label htmlFor="vision10yr" className={labelStyles}>10-Year Vision *</label>
            <textarea
              id="vision10yr"
              required
              rows={3}
              value={form.vision10yr}
              onChange={(e) => update("vision10yr", e.target.value)}
              placeholder="The big picture — where this goes in a decade."
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="mission3_5yr" className={labelStyles}>3-5 Year Mission *</label>
            <textarea
              id="mission3_5yr"
              required
              rows={3}
              value={form.mission3_5yr}
              onChange={(e) => update("mission3_5yr", e.target.value)}
              placeholder="How you'll get there over the next few years."
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="goal1yr" className={labelStyles}>1-Year Goal *</label>
            <textarea
              id="goal1yr"
              required
              rows={3}
              value={form.goal1yr}
              onChange={(e) => update("goal1yr", e.target.value)}
              placeholder="What you're focused on right now."
              className={inputStyles}
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className={sectionHeadingStyles}>Your Team</h2>
        <p className="mb-4 text-sm font-medium text-ink/60">
          Building alone? Skip this. If you have teammates, add them below and
          decide whether each one should also join the incubator as a fellow.
        </p>
        <div className="flex flex-col gap-4">
          {team.map((member, index) => (
            <div key={index} className="border-4 border-ink p-4 md:p-5">
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
                <input
                  required
                  value={member.name}
                  onChange={(e) => updateMember(index, "name", e.target.value)}
                  placeholder="Full name"
                  className={inputStyles}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    type="email"
                    value={member.email}
                    onChange={(e) => updateMember(index, "email", e.target.value)}
                    placeholder="Email"
                    className={inputStyles}
                  />
                  <input
                    value={member.phone}
                    onChange={(e) => updateMember(index, "phone", e.target.value)}
                    placeholder="Phone / WhatsApp"
                    className={inputStyles}
                  />
                </div>
                <input
                  value={member.skills}
                  onChange={(e) => updateMember(index, "skills", e.target.value)}
                  placeholder="Skills, e.g. design, sales, coding"
                  className={inputStyles}
                />
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={member.invitedToIncubator}
                    onChange={(e) => updateMember(index, "invitedToIncubator", e.target.checked)}
                    className="h-5 w-5 accent-[#ff6a00]"
                  />
                  <span className="text-sm font-bold uppercase tracking-wide">
                    Invite them to the incubator as a fellow
                  </span>
                </label>
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
      </section>

      {flash && (
        <p className="text-sm font-bold uppercase tracking-widest text-strike">{flash}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="self-start bg-strike px-8 py-4 text-base font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}