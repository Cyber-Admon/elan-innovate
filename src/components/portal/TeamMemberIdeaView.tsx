"use client";

import { useState } from "react";

const inputStyles =
  "w-full border-4 border-ink bg-paper px-4 py-3 text-base font-medium placeholder:text-ink/40";
const labelStyles = "mb-2 block text-xs font-bold uppercase tracking-widest";

type LeadIdea = {
  ideaName: string;
  ideaOneLiner: string;
  ideaProblem: string;
  vision10yr: string;
  mission3_5yr: string;
  goal1yr: string;
};

export default function TeamMemberIdeaView({ lead }: { lead: LeadIdea }) {
  const [proposing, setProposing] = useState(false);
  const [form, setForm] = useState(lead);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  function update(field: keyof LeadIdea, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submitProposal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setFlash(null);
    try {
      const res = await fetch("/api/portal/propose-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setFlash("Proposal sent. The team lead will review it.");
      setProposing(false);
    } catch {
      setFlash("Could not send proposal. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-black uppercase tracking-tight">
        Team Idea
      </h2>
      <p className="mb-6 text-sm font-medium text-ink/60">
        This is the shared idea, vision, mission, and goal for your team. You
        can propose changes below, but your team lead has to approve them.
      </p>

      {!proposing ? (
        <div className="flex flex-col gap-6">
          <div className="border-4 border-ink p-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">Idea</p>
            <p className="font-bold">{lead.ideaName || "Not set yet"}</p>
            <p className="text-sm">{lead.ideaOneLiner}</p>
          </div>
          {lead.ideaProblem && (
            <div className="border-4 border-ink p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">Problem</p>
              <p className="text-sm leading-relaxed">{lead.ideaProblem}</p>
            </div>
          )}
          {lead.vision10yr && (
            <div className="border-4 border-ink p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">10-Year Vision</p>
              <p className="text-sm leading-relaxed">{lead.vision10yr}</p>
            </div>
          )}
          {lead.mission3_5yr && (
            <div className="border-4 border-ink p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">3-5 Year Mission</p>
              <p className="text-sm leading-relaxed">{lead.mission3_5yr}</p>
            </div>
          )}
          {lead.goal1yr && (
            <div className="border-4 border-ink p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">1-Year Goal</p>
              <p className="text-sm leading-relaxed">{lead.goal1yr}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setProposing(true)}
            className="self-start bg-strike px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink"
          >
            Propose changes
          </button>

          {flash && (
            <p className="text-sm font-bold uppercase tracking-widest text-strike">{flash}</p>
          )}
        </div>
      ) : (
        <form onSubmit={submitProposal} className="flex flex-col gap-6">
          <div>
            <label className={labelStyles}>Idea / business name</label>
            <input
              value={form.ideaName}
              onChange={(e) => update("ideaName", e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>One-liner</label>
            <input
              value={form.ideaOneLiner}
              onChange={(e) => update("ideaOneLiner", e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>Problem</label>
            <textarea
              rows={3}
              value={form.ideaProblem}
              onChange={(e) => update("ideaProblem", e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>10-Year Vision</label>
            <textarea
              rows={3}
              value={form.vision10yr}
              onChange={(e) => update("vision10yr", e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>3-5 Year Mission</label>
            <textarea
              rows={3}
              value={form.mission3_5yr}
              onChange={(e) => update("mission3_5yr", e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>1-Year Goal</label>
            <textarea
              rows={3}
              value={form.goal1yr}
              onChange={(e) => update("goal1yr", e.target.value)}
              className={inputStyles}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-strike px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink disabled:opacity-60"
            >
              {saving ? "Sending..." : "Send proposal"}
            </button>
            <button
              type="button"
              onClick={() => setProposing(false)}
              className="border-2 border-ink px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}