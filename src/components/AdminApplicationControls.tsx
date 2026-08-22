"use client";

import { useState } from "react";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

const statusColor: Record<string, string> = {
  new: "bg-ink text-paper",
  reviewing: "bg-navy text-paper",
  accepted: "bg-strike text-paper",
  rejected: "border-2 border-ink text-ink",
};

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

  async function changeStatus(next: string) {
    if (next === status || busy) return;
    const prev = status;
    setStatus(next); // optimistic
    setBusy(true);
    try {
      const res = await fetch("/api/admin/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setStatus(prev); // revert on failure
    } finally {
      setBusy(false);
    }
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
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">
        Status
      </p>
      <div className="mb-5 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            disabled={busy}
            onClick={() => changeStatus(s.value)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 ${
              status === s.value
                ? statusColor[s.value]
                : "border-2 border-ink/30 text-ink/50 hover:border-ink hover:text-ink"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

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