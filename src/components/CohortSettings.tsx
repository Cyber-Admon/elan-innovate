"use client";

import { useEffect, useState } from "react";

type Track = "incubator" | "accelerator";

type Settings = {
  is_open: boolean;
  opens_at: string | null;
  closes_at: string | null;
  cohort_label: string | null;
};

const empty: Settings = { is_open: false, opens_at: null, closes_at: null, cohort_label: "" };

function toDateInputValue(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export default function CohortSettings() {
  const [track, setTrack] = useState<Track>("incubator");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [form, setForm] = useState<Settings>(empty);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/cohort-settings?track=${track}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setForm({
            is_open: data.settings.is_open,
            opens_at: data.settings.opens_at,
            closes_at: data.settings.closes_at,
            cohort_label: data.settings.cohort_label ?? "",
          });
        } else {
          setForm(empty);
        }
      })
      .finally(() => setLoading(false));
  }, [track]);

  async function save() {
    setSaving(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/cohort-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track, ...form }),
      });
      if (!res.ok) throw new Error();
      setFlash("Saved.");
      setTimeout(() => setFlash(null), 2500);
    } catch {
      setFlash("Save failed. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-8 border-4 border-ink p-5">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">
        Program applications
      </p>
      <p className="mb-4 max-w-lg text-sm font-medium leading-relaxed text-ink/70">
        Controls whether the public Apply page shows the application form or a
        closed message, per track. Dates are optional; if set, applications
        auto-close outside that window regardless of the toggle below.
      </p>

      {/* Track switcher */}
      <div className="mb-5 flex gap-2">
        {(["incubator", "accelerator"] as Track[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTrack(t)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
              track === t
                ? "bg-ink text-paper"
                : "border-2 border-ink/30 text-ink/60 hover:border-ink hover:text-ink"
            }`}
          >
            {t === "incubator" ? "Incubator" : "Accelerator"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-xs font-bold uppercase tracking-widest text-ink/40">
          Loading...
        </p>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, is_open: !f.is_open }))}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                form.is_open ? "bg-strike text-paper" : "border-2 border-ink text-ink/60"
              }`}
            >
              {form.is_open ? "Open" : "Closed"}
            </button>
            <span className="text-xs font-medium text-ink/50">
              Click to {form.is_open ? "close" : "open"} {track}
            </span>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-ink/50">
                Opens (optional)
              </label>
              <input
                type="date"
                value={toDateInputValue(form.opens_at)}
                onChange={(e) =>
                  setForm((f) => ({ ...f, opens_at: e.target.value || null }))
                }
                className="w-full border-4 border-ink bg-paper px-3 py-2 text-sm font-medium"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-ink/50">
                Closes (optional)
              </label>
              <input
                type="date"
                value={toDateInputValue(form.closes_at)}
                onChange={(e) =>
                  setForm((f) => ({ ...f, closes_at: e.target.value || null }))
                }
                className="w-full border-4 border-ink bg-paper px-3 py-2 text-sm font-medium"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-ink/50">
              Cohort label (shown to applicants)
            </label>
            <input
              type="text"
              value={form.cohort_label ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, cohort_label: e.target.value }))}
              placeholder="e.g. September 2026 cohort"
              className="w-full border-4 border-ink bg-paper px-3 py-2 text-sm font-medium placeholder:text-ink/40"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="bg-strike px-6 py-3 text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:bg-ink disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {flash && (
              <span className="text-xs font-bold uppercase tracking-widest text-ink/60">
                {flash}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}