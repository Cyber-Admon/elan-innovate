"use client";

import { useState } from "react";

type SharedIdea = {
  ideaName: string;
  ideaOneLiner: string;
  ideaProblem: string;
  vision10yr: string;
  mission3_5yr: string;
  goal1yr: string;
};

export default function TeamIdeaView({
  leadFellowId,
  leadName,
  current,
}: {
  leadFellowId: string;
  leadName: string;
  current: SharedIdea;
}) {
  const [proposing, setProposing] = useState(false);
  const [form, setForm] = useState(current);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  function update(field: keyof SharedIdea, value: string) {
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
        body: JSON.stringify({ leadFellowId, ...form }),
      });
      if (!res.ok) throw new Error();
      setFlash("Proposal sent. It's pending approval from the team lead.");
      setProposing(false);
    } catch {
      setFlash("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border-4 border-ink p-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">
        Team idea, led by {leadName}
      </p>
      <h3 className="mb-4 text-lg font-black uppercase leading-tight">
        {current.ideaName || "Idea not set yet"}
      </h3>

      {!proposing ? (
        <>
          <p className="mb-4 text-sm leading-relaxed text-ink/80">
            {current.ideaOneLiner}
          </p>
          <button
            type="button"
            onClick={() => {
              setForm(current);
              setProposing(true);
              setFlash(null);
            }}
            className="border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper"
          >
            Propose changes
          </button>
          {flash && (
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-strike">
              {flash}
            </p>
          )}
        </>
      ) : (
        <form onSubmit={submitProposal} className="flex flex-col gap-4">
          <input
            value={form.ideaName}
            onChange={(e) => update("ideaName", e.target.value)}
            placeholder="Idea name"
            className="w-full border-4 border-ink bg-paper px-4 py-3 text-sm font-medium"
          />
          <input
            value={form.ideaOneLiner}
            onChange={(e) => update("ideaOneLiner", e.target.value)}
            placeholder="One-liner"
            className="w-full border-4 border-ink bg-paper px-4 py-3 text-sm font-medium"
          />
          <textarea
            rows={3}
            value={form.ideaProblem}
            onChange={(e) => update("ideaProblem", e.target.value)}
            placeholder="Problem"
            className="w-full border-4 border-ink bg-paper px-4 py-3 text-sm font-medium"
          />
          <textarea
            rows={2}
            value={form.vision10yr}
            onChange={(e) => update("vision10yr", e.target.value)}
            placeholder="10-Year Vision"
            className="w-full border-4 border-ink bg-paper px-4 py-3 text-sm font-medium"
          />
          <textarea
            rows={2}
            value={form.mission3_5yr}
            onChange={(e) => update("mission3_5yr", e.target.value)}
            placeholder="3-5 Year Mission"
            className="w-full border-4 border-ink bg-paper px-4 py-3 text-sm font-medium"
          />
          <textarea
            rows={2}
            value={form.goal1yr}
            onChange={(e) => update("goal1yr", e.target.value)}
            placeholder="1-Year Goal"
            className="w-full border-4 border-ink bg-paper px-4 py-3 text-sm font-medium"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-strike px-5 py-2 text-xs font-bold uppercase tracking-widest text-paper hover:bg-ink disabled:opacity-50"
            >
              {saving ? "Sending..." : "Submit for approval"}
            </button>
            <button
              type="button"
              onClick={() => setProposing(false)}
              className="border-2 border-ink px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-ink hover:text-paper"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}