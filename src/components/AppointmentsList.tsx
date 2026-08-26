"use client";

import { useState } from "react";

type CalendarEvent = {
  id: string;
  summary: string;
  start: string | null;
  end: string | null;
  meetLink: string | null;
  attendeeEmail: string | null;
};

function fmt(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AppointmentsList({
  initialEvents,
}: {
  initialEvents: CalendarEvent[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function handleCancel(id: string) {
    if (!confirm("Cancel this appointment? This removes it from Google Calendar.")) {
      return;
    }
    setCancellingId(id);
    try {
      const res = await fetch("/api/admin/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id }),
      });
      if (res.ok) {
        setEvents((evts) => evts.filter((e) => e.id !== id));
      }
    } finally {
      setCancellingId(null);
    }
  }

  if (events.length === 0) {
    return (
      <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">
        No upcoming appointments. Either nothing&apos;s scheduled, or a
        calendar isn&apos;t connected yet (check Settings).
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {events.map((e) => (
        <div key={e.id} className="flex flex-wrap items-center justify-between gap-4 border-4 border-ink p-5">
          <div>
            <p className="font-black uppercase leading-tight">{e.summary}</p>
            <p className="text-sm text-ink/60">
              {fmt(e.start)}
              {e.attendeeEmail ? ` · ${e.attendeeEmail}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {e.meetLink && (
              <a href={e.meetLink} target="_blank" rel="noopener noreferrer" className="border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper">
                Join Meet
              </a>
            )}
            <button
              type="button"
              onClick={() => handleCancel(e.id)}
              disabled={cancellingId === e.id}
              className="bg-strike px-4 py-2 text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:bg-ink disabled:opacity-50"
            >
              {cancellingId === e.id ? "Cancelling..." : "Cancel"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}