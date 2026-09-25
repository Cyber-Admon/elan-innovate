"use client";

import { useState } from "react";

type Application = {
  id: string;
  full_name: string;
  email: string;
  idea_name: string;
  status: string;
  created_at: string;
};

type Group = {
  label: string;
  items: Application[];
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DuplicatesBrowser({ groups }: { groups: Group[] }) {
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function removeOne(id: string, notifyReason: string | null) {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/soft-delete-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notifyReason }),
      });
      if (res.ok) {
        setRemovedIds((prev) => new Set(prev).add(id));
      }
    } finally {
      setBusyId(null);
      setConfirmingId(null);
    }
  }

  if (groups.length === 0) {
    return (
      <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">
        No duplicates found.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {groups.map((g, gi) => {
        const visible = g.items.filter((i) => !removedIds.has(i.id));
        if (visible.length <= 1) return null;
        return (
          <div key={gi} className="border-4 border-ink">
            <div className="border-b-4 border-ink bg-navy px-5 py-3 text-paper">
              <p className="text-sm font-bold uppercase tracking-widest">{g.label}</p>
            </div>
            <div className="flex flex-col divide-y-2 divide-ink/10">
              {visible.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-bold">{item.full_name}</p>
                      <p className="text-sm text-ink/70">
                        {item.email} · {item.idea_name}
                      </p>
                      <p className="text-xs text-ink/40">
                        Submitted {fmtDate(item.created_at)} · Status: {item.status}
                      </p>
                    </div>
                    {confirmingId !== item.id && (
                      <button
                        type="button"
                        onClick={() => setConfirmingId(item.id)}
                        disabled={busyId === item.id}
                        className="border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
                      >
                        Move to Trash
                      </button>
                    )}
                  </div>

                  {confirmingId === item.id && (
                    <div className="mt-4 border-2 border-ink/30 p-4">
                      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink/60">
                        Notify them by email?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => removeOne(item.id, null)}
                          disabled={busyId === item.id}
                          className="border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-ink hover:text-paper disabled:opacity-50"
                        >
                          Remove silently
                        </button>
                        <button
                          type="button"
                          onClick={() => removeOne(item.id, "no_response")}
                          disabled={busyId === item.id}
                          className="bg-strike px-4 py-2 text-xs font-bold uppercase tracking-widest text-paper hover:bg-ink disabled:opacity-50"
                        >
                          Remove + email them
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingId(null)}
                          className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-ink/50 hover:text-ink"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}