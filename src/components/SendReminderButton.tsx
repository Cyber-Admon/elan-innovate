"use client";

import { useState } from "react";

export default function SendReminderButton({
  type,
  id,
}: {
  type: "incomplete_profile" | "never_registered";
  id: string;
}) {
  const [sending, setSending] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  async function send() {
    setSending(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      if (!res.ok) throw new Error();
      setFlash("Reminder sent.");
      setTimeout(() => setFlash(null), 3000);
    } catch {
      setFlash("Send failed.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={send}
        disabled={sending}
        className="border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send reminder"}
      </button>
      {flash && (
        <span className="text-xs font-bold uppercase tracking-widest text-strike">{flash}</span>
      )}
    </div>
  );
}