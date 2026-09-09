"use client";

import { useEffect, useRef, useState } from "react";

type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  async function load() {
    try {
      const res = await fetch("/api/portal/notifications");
      const data = await res.json();
      setNotifications(data.notifications ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAllRead() {
    await fetch("/api/portal/mark-notification-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center border-2 border-ink text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 stroke-current"
          strokeWidth="2.5"
          fill="none"
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-strike px-1 text-[10px] font-bold text-paper">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 border-4 border-ink bg-paper shadow-lg">
          <div className="flex items-center justify-between border-b-4 border-ink px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-bold uppercase tracking-widest text-strike hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-xs font-medium text-ink/50">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-xs font-medium text-ink/50">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`border-b-2 border-ink/10 p-4 ${!n.read ? "bg-strike/5" : ""}`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-bold uppercase tracking-wide">{n.title}</p>
                    <span className="text-xs text-ink/40">{fmtDate(n.created_at)}</span>
                  </div>
                  <p className="text-sm text-ink/70">{n.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}