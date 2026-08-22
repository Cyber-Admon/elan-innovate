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

  // Interview schedule for the external-review invite.
  const [intDate, setIntDate] = useState("");
  const [intTime, setIntTime] = useState("");
  const [intPlace, setIntPlace] = useState("");

  async function applyStatus(
    next: string,
    sendEmail: boolean,
    interview?: { date: string; time: string; place: string }
  ) {
    const prev = status;
    setStatus(next);
    setBusy(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next, sendEmail, interview }),
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

  function sendInterview() {
    setConfirming(false);
    applyStatus("external_review", true, {
      date: intDate,
      time: intTime,
      place: intPlace,
    });
    setIntDate("");
    setIntTime("");
    setIntPlace("");
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
  const canSend = intDate !== "" && intTime !== "";

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

      {/* External review confirm prompt with interview schedule */}
      {confirming && (
        <div className="mb-5 border-4 border-ink bg-navy p-4 text-paper">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide">
            Schedule the interview
          </p>
          <p className="mb-4 text-sm font-medium leading-relaxed text-paper/80">
            Set the interview date and time. When you send, the applicant gets an
            invite to defend their project at this slot.
          </p>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-paper/60">
                Date
              </label>
              <input
                type="date"
                value={intDate}
                onChange={(e) => setIntDate(e.target.value)}
                className="w-full border-4 border-paper bg-navy px-3 py-2 text-sm font-medium text-paper"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-paper/60">
                Time
              </label>
              <input
                type="time"
                value={intTime}
                onChange={(e) => setIntTime(e.target.value)}
                className="w-full border-4 border-paper bg-navy px-3 py-2 text-sm font-medium text-paper"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-paper/60">
              Location / link (optional)
            </label>
            <input
              type="text"
              value={intPlace}
              onChange={(e) => setIntPlace(e.target.value)}
              placeholder="e.g. Google Meet link, or office address"
              className="w-full border-4 border-paper bg-navy px-3 py-2 text-sm font-medium text-paper placeholder:text-paper/40"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!canSend}
              onClick={sendInterview}
              className="bg-strike px-4 py-2 text-xs font-bold uppercase tracking-widest text-paper hover:bg-paper hover:text-ink disabled:opacity-40"
            >
              Set + send invite
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
          {!canSend && (
            <p className="mt-2 text-xs font-medium text-paper/50">
              Date and time are required to send the invite.
            </p>
          )}
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