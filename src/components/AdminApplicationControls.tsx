"use client";

import { useState } from "react";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "internal_review", label: "Internal Review" },
  { value: "external_review", label: "External Review" },
  { value: "interviewed", label: "Interviewed" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

const statusColor: Record<string, string> = {
  new: "bg-ink text-paper",
  internal_review: "bg-navy text-paper",
  interviewed: "bg-navy text-paper",
  accepted: "bg-strike text-paper",
  rejected: "border-2 border-ink text-ink",
};

const ASK_EMAIL = ["external_review"];
const ASK_INTERVIEW_NOTES = ["interviewed"];

export default function AdminApplicationControls({
  id,
  applicantName,
  applicantEmail,
  ideaName,
  initialStatus,
  initialNotes,
  initialInterviewRemarks,
  initialInterviewNextSteps,
}: {
  id: string;
  applicantName?: string;
  applicantEmail?: string;
  ideaName?: string;
  initialStatus: string;
  initialNotes: string | null;
  initialInterviewRemarks?: string | null;
  initialInterviewNextSteps?: string | null;
}) {
  const [status, setStatus] = useState(initialStatus || "new");
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [savedNotes, setSavedNotes] = useState(initialNotes ?? "");
  const [busy, setBusy] = useState(false);
  const [noteState, setNoteState] = useState<"idle" | "saving" | "saved">("idle");
  const [flash, setFlash] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [intDate, setIntDate] = useState("");
  const [intTime, setIntTime] = useState("");
  const [intPlace, setIntPlace] = useState("");

  // Interviewed-stage remarks/next-steps
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [interviewRemarks, setInterviewRemarks] = useState(initialInterviewRemarks ?? "");
  const [interviewNextSteps, setInterviewNextSteps] = useState(initialInterviewNextSteps ?? "");
  const [savingInterviewNotes, setSavingInterviewNotes] = useState(false);

  async function applyStatus(
    next: string,
    sendEmail: boolean,
    interview?: { date: string; time: string; place: string },
    extra?: { interviewRemarks?: string; interviewNextSteps?: string }
  ) {
    const prev = status;
    setStatus(next);
    setBusy(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next, sendEmail, interview, ...extra }),
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
    if (busy) return;
    if (ASK_EMAIL.includes(next)) {
      setConfirming(true);
      return;
    }
    if (ASK_INTERVIEW_NOTES.includes(next)) {
      setShowInterviewForm(true);
      return;
    }
    if (next === status) return;
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

  async function saveInterviewNotes() {
    setSavingInterviewNotes(true);
    await applyStatus("interviewed", false, undefined, {
      interviewRemarks,
      interviewNextSteps,
    });
    setSavingInterviewNotes(false);
    setShowInterviewForm(false);
  }

  async function generateMeetLink() {
    if (!intDate || !intTime) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/generate-meet-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName,
          applicantEmail,
          ideaName,
          date: intDate,
          time: intTime,
        }),
      });
      const data = await res.json();
      if (data.meetLink) {
        setIntPlace(data.meetLink);
      } else {
        setFlash("Couldn't generate a link. Is Calendar connected?");
        setTimeout(() => setFlash(null), 3000);
      }
    } finally {
      setGenerating(false);
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
          const active =
            status === s.value || (confirming && s.value === "external_review");
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
        Accepted and rejected email the applicant automatically. Internal
        review and Interviewed are silent.
      </p>

      {/* Interviewed remarks/next-steps form */}
      {showInterviewForm && (
        <div className="mb-5 border-4 border-ink bg-navy p-4 text-paper">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide">
            Interview notes
          </p>
          <div className="mb-4">
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-paper/60">
              Remarks
            </label>
            <textarea
              rows={3}
              value={interviewRemarks}
              onChange={(e) => setInterviewRemarks(e.target.value)}
              placeholder="How did the interview go?"
              className="w-full border-4 border-paper bg-navy px-3 py-2 text-sm font-medium text-paper placeholder:text-paper/40"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-paper/60">
              Next steps
            </label>
            <textarea
              rows={2}
              value={interviewNextSteps}
              onChange={(e) => setInterviewNextSteps(e.target.value)}
              placeholder="What happens next for this applicant?"
              className="w-full border-4 border-paper bg-navy px-3 py-2 text-sm font-medium text-paper placeholder:text-paper/40"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveInterviewNotes}
              disabled={savingInterviewNotes}
              className="bg-strike px-4 py-2 text-xs font-bold uppercase tracking-widest text-paper hover:bg-paper hover:text-ink disabled:opacity-50"
            >
              {savingInterviewNotes ? "Saving..." : "Save + mark interviewed"}
            </button>
            <button
              type="button"
              onClick={() => setShowInterviewForm(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-paper/60 hover:text-paper"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* External review confirm prompt with interview schedule */}
      {confirming && (
        <div className="mb-5 border-4 border-ink bg-navy p-4 text-paper">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide">
            Schedule the interview
          </p>
          <p className="mb-4 text-sm font-medium leading-relaxed text-paper/80">
            Set the date and time, then generate a Meet link or paste your own.
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
              Meet link / location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={intPlace}
                onChange={(e) => setIntPlace(e.target.value)}
                placeholder="Paste a link, or generate one"
                className="w-full border-4 border-paper bg-navy px-3 py-2 text-sm font-medium text-paper placeholder:text-paper/40"
              />
              <button
                type="button"
                onClick={generateMeetLink}
                disabled={!canSend || generating}
                className="shrink-0 border-4 border-paper px-4 text-sm font-bold uppercase tracking-widest transition-colors hover:bg-paper hover:text-navy disabled:opacity-40"
                title="Generate a Google Meet link"
              >
                {generating ? "..." : "+"}
              </button>
            </div>
            {!canSend && (
              <p className="mt-1 text-xs font-medium text-paper/40">
                Set date and time first to generate a link.
              </p>
            )}
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

      {/* Show saved interview notes when not editing */}
      {!showInterviewForm && (interviewRemarks || interviewNextSteps) && (
        <div className="mb-5 border-4 border-ink/20 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
              Interview notes
            </p>
            <button
              type="button"
              onClick={() => setShowInterviewForm(true)}
              className="text-xs font-bold uppercase tracking-widest text-strike hover:underline"
            >
              Edit
            </button>
          </div>
          {interviewRemarks && (
            <p className="mb-2 text-sm">
              <span className="font-bold">Remarks:</span> {interviewRemarks}
            </p>
          )}
          {interviewNextSteps && (
            <p className="text-sm">
              <span className="font-bold">Next steps:</span> {interviewNextSteps}
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