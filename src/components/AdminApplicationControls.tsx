"use client";

import { useState } from "react";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "internal_review", label: "Internal Review" },
  { value: "external_review", label: "External Review" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

const statusColor: Record<string, string> = {
  new: "bg-ink text-paper",
  internal_review: "bg-navy text-paper",
  accepted: "bg-strike text-paper",
  rejected: "border-2 border-ink text-ink",
};

const ASK_EMAIL = ["external_review"];

export default function AdminApplicationControls({
  id,
  initialStatus,
  initialNotes,
}: {
  id: string;
  initialStatus: string;
  initialNotes: string | null;
}) {
  const [status, setStatus] = useState(initialStatus || "new");
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [savedNotes, setSavedNotes] = useState(initialNotes ?? "");
  const [busy, setBusy] = useState(false);
  const [noteState, setNoteState] = useState<"idle" | "saving" | "saved">("idle");
  const [flash, setFlash] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function applyStatus(next: string, sendEmail: boolean) {
    const prev = status;
    setStatus(next);
    setBusy(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next, sendEmail }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.emailed) {
        setFlash("Applicant emailed");
        setTimeout(() => setFlash(null), 2500);
      }
    } catch {
      setStatus(prev);
      setFlash("Something went wrong");
      setTimeout(() => setFlash(null), 2500);
    } finally {
      setBusy(false);
    }
  }

  function handleStatusClick(next: string) {
    if (next === status || busy) return;
    if (ASK_EMAIL.includes(next)) {
      setConfirming(true);
      return;
    }
    applyStatus(next, false);
  }

  async function saveNotes() {
    setNoteState("saving");
    try {
      const res = await fetch("/api/admin/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes }),
      });
      if (!res.ok) throw new Error();
      setSavedNotes(notes);
      setNoteState("saved");
      setTimeout(() => setNoteState("idle"), 2000);
    } catch {
      setNoteState("idle");
    }
  }

  const noteDirty = notes !== savedNotes;

  return (
    <div className="border-t-4 border-ink bg-paper p-5">
      {/* Status */}
      <div className="mb-2 flex items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
          Status
        </p>
        {flash && (
          <span className="text-xs font-bold uppercase tracking-widest text-strike">
            {flash}
          </span>
        )}
      </div>
      <div className="mb-2 flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const active = status === s.value;
          const isPeri = s.value === "external_review";
          return (
            <button
              key={s.value}
              type="button"
              disabled={busy}
              onClick={() => handleStatusClick(s.value)}
              style={
                active && isPeri
                  ? { backgroundColor: "#6666FF", color: "#FFFFFC" }
                  : undefined
              }
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 ${
                active
                  ? isPeri
                    ? ""
                    : statusColor[s.value]
                  : "border-2 border-ink/30 text-ink/50 hover:border-ink hover:text-ink"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <p className="mb-5 text-xs font-medium text-ink/40">
        Accepted and rejected email the applicant automatically. Internal review
        is silent.
      </p>

      {/* External review confirm prompt */}
      {confirming && (
        <div className="mb-5 border-4 border-ink bg-navy p-4 text-paper">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide">
            Send interview invite email?
          </p>
          <p className="mb-4 text-sm font-medium leading-relaxed text-paper/80">
            Moving this applicant to external review can email them an invite to
            interview and defend their project. Send the email now?
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                applyStatus("external_review", true);
              }}
              className="bg-strike px-4 py-2 text-xs font-bold uppercase tracking-widest text-paper hover:bg-paper hover:text-ink"
            >
              Set + send email
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                applyStatus("external_review", false);
              }}
              className="border-2 border-paper px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-paper hover:text-navy"
            >
              Set without email
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-paper/60 hover:text-paper"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notes */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">
        Notes
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="Your review notes on this applicant..."
        className="w-full border-4 border-ink bg-paper px-4 py-3 text-sm font-medium placeholder:text-ink/40"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={saveNotes}
          disabled={!noteDirty || noteState === "saving"}
          className="bg-strike px-5 py-2 text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:bg-ink disabled:opacity-40"
        >
          {noteState === "saving" ? "Saving..." : "Save note"}
        </button>
        {noteState === "saved" && (
          <span className="text-xs font-bold uppercase tracking-widest text-strike">
            Saved
          </span>
        )}
        {noteDirty && noteState === "idle" && (
          <span className="text-xs font-bold uppercase tracking-widest text-ink/40">
            Unsaved
          </span>
        )}
      </div>
    </div>
  );
}