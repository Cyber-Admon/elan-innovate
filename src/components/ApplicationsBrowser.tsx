"use client";

import { useState, useEffect, useCallback } from "react";
import AdminApplicationControls from "@/components/AdminApplicationControls";

type TeamMember = { name: string; email: string; phone: string; isStudent: boolean; skills: string };

type Application = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  campus: string | null;
  idea_name: string;
  one_liner: string;
  problem: string;
  stage: string;
  why: string;
  status: string;
  notes: string | null;
  team: TeamMember[] | null;
};

const TABS = [
  { value: "all", label: "All", match: () => true },
  { value: "new", label: "New", match: (s: string) => s === "new" },
  { value: "review", label: "Under Review", match: (s: string) => s === "internal_review" || s === "external_review" },
  { value: "approved", label: "Approved", match: (s: string) => s === "accepted" },
  { value: "declined", label: "Declined", match: (s: string) => s === "rejected" },
];

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  internal_review: "Internal Review",
  external_review: "External Review",
  accepted: "Accepted",
  rejected: "Rejected",
};

const STATUS_STYLE: Record<string, string> = {
  new: "bg-ink text-paper",
  internal_review: "bg-navy text-paper",
  external_review: "text-paper",
  accepted: "bg-strike text-paper",
  rejected: "border-2 border-ink text-ink",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function ApplicationsBrowser({
  applications,
}: {
  applications: Application[];
}) {
  const [tab, setTab] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const activeTab = TABS.find((t) => t.value === tab)!;
  const filtered = applications.filter((a) => activeTab.match(a.status ?? "new"));

  const close = useCallback(() => setOpenIndex(null), []);
  const goPrev = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : Math.max(0, i - 1)));
  }, []);
  const goNext = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? null : Math.min(filtered.length - 1, i + 1)
    );
  }, [filtered.length]);

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, goPrev, goNext, close]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX);
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return;
    const delta = e.changedTouches[0].clientX - touchStart;
    if (delta > 60) goPrev();
    else if (delta < -60) goNext();
    setTouchStart(null);
  }

  const open = openIndex !== null ? filtered[openIndex] : null;

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const count = applications.filter((a) => t.match(a.status ?? "new")).length;
          const active = tab === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setTab(t.value);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                active
                  ? "bg-ink text-paper"
                  : "border-2 border-ink/30 text-ink/60 hover:border-ink hover:text-ink"
              }`}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">
          No applications here.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((a, i) => {
            const st = a.status ?? "new";
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setOpenIndex(i)}
                className="flex flex-wrap items-center justify-between gap-3 border-4 border-ink p-4 text-left transition-colors hover:bg-ink hover:text-paper"
              >
                <div className="min-w-0">
                  <p className="truncate font-black uppercase leading-tight">{a.idea_name}</p>
                  <p className="truncate text-sm text-ink/60 group-hover:text-paper/60">{a.full_name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-ink/40">{fmtDate(a.created_at)}</span>
                  <span
                    className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLE[st] ?? ""}`}
                    style={st === "external_review" ? { backgroundColor: "#6666FF" } : undefined}
                  >
                    {STATUS_LABEL[st] ?? st}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Detail overlay */}
      {open && openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/70 p-4 py-10"
          onClick={close}
        >
          <div
            className="relative w-full max-w-3xl border-4 border-ink bg-paper"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Header with nav */}
            <div className="flex items-center justify-between gap-2 border-b-4 border-ink bg-navy px-5 py-3 text-paper">
              <button
                type="button"
                onClick={goPrev}
                disabled={openIndex === 0}
                className="border-2 border-paper px-3 py-1 text-xs font-bold uppercase tracking-widest disabled:opacity-30"
              >
                &larr; Prev
              </button>
              <span className="text-xs font-bold uppercase tracking-widest text-paper/70">
                {openIndex + 1} of {filtered.length}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={goNext}
                  disabled={openIndex === filtered.length - 1}
                  className="border-2 border-paper px-3 py-1 text-xs font-bold uppercase tracking-widest disabled:opacity-30"
                >
                  Next &rarr;
                </button>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="flex h-7 w-7 items-center justify-center border-2 border-paper"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-paper" strokeWidth="2.5" aria-hidden="true">
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="border-b-4 border-ink px-5 py-4">
              <h3 className="text-xl font-black uppercase leading-tight">{open.idea_name}</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
                {fmtDate(open.created_at)} · {open.stage}
              </p>
            </div>

            {/* Body */}
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">Applicant</p>
                <p className="font-bold">{open.full_name}</p>
                <p className="text-sm">{open.email}</p>
                <p className="text-sm">{open.phone}</p>
                {open.campus && <p className="text-sm text-ink/70">{open.campus}</p>}
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">One-liner</p>
                <p className="text-sm">{open.one_liner}</p>
              </div>
              <div className="md:col-span-2">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">Problem</p>
                <p className="text-sm leading-relaxed">{open.problem}</p>
              </div>
              <div className="md:col-span-2">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">Why they want in</p>
                <p className="text-sm leading-relaxed">{open.why}</p>
              </div>
              {open.team && open.team.length > 0 && (
                <div className="md:col-span-2">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">Team ({open.team.length})</p>
                  <div className="flex flex-col gap-2">
                    {open.team.map((m, i) => (
                      <div key={i} className="border-2 border-ink/20 p-3 text-sm">
                        <span className="font-bold">{m.name}</span>{" · "}{m.email}{" · "}{m.phone}{" · "}{m.isStudent ? "Student" : "Not a student"}{" · "}{m.skills}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <AdminApplicationControls
              key={open.id}
              id={open.id}
              applicantName={open.full_name}
              applicantEmail={open.email}
              ideaName={open.idea_name}
              initialStatus={open.status}
              initialNotes={open.notes}
            />
          </div>
        </div>
      )}
    </div>
  );
}