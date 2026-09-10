"use client";

import { useState } from "react";

export default function RestoreButton({ id }: { id: string }) {
  const [restoring, setRestoring] = useState(false);

  async function restore() {
    setRestoring(true);
    try {
      const res = await fetch("/api/admin/soft-delete-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, restore: true }),
      });
      if (res.ok) window.location.reload();
    } finally {
      setRestoring(false);
    }
  }

  return (
    <button
      type="button"
      onClick={restore}
      disabled={restoring}
      className="bg-strike px-5 py-3 text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:bg-ink disabled:opacity-50"
    >
      {restoring ? "Restoring..." : "Restore"}
    </button>
  );
}