"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ConnectCalendar() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  async function refreshStatus() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/google-calendar/status");
      const data = await res.json();
      setConnected(!!data.connected);
      setEmail(data.email ?? null);
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshStatus();
  }, []);

  useEffect(() => {
    const s = params.get("calendar");
    if (s === "connected") setFlash("Connected successfully.");
    if (s === "error") setFlash("Something went wrong connecting. Try again.");
    if (s === "no_refresh_token")
      setFlash(
        "Google didn't return a refresh token. Revoke access at myaccount.google.com/permissions and try again."
      );
    if (s) refreshStatus();
  }, [params]);

  async function handleDisconnect() {
    setDisconnecting(true);
    try {
      await fetch("/api/auth/google-calendar/disconnect", { method: "POST" });
      setConnected(false);
      setEmail(null);
      setFlash("Disconnected. Connect again to link a different account.");
    } finally {
      setDisconnecting(false);
    }
  }

  return (
    <div className="mb-8 border-4 border-ink p-5">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">
        Google Calendar
      </p>
      <p className="mb-4 max-w-lg text-sm font-medium leading-relaxed text-ink/70">
        Connect your Google account so scheduling an interview creates a real
        Calendar event with a Meet link, sent straight to the applicant.
      </p>

      {loading ? (
        <p className="text-xs font-bold uppercase tracking-widest text-ink/40">
          Checking status...
        </p>
      ) : connected ? (
        <div>
          <p className="mb-1 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper">
            Connected
          </p>
          {email && (
            <p className="mb-4 text-sm font-medium text-ink/70">{email}</p>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="border-2 border-ink px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
            >
              {disconnecting ? "Disconnecting..." : "Disconnect"}
            </button>
            <a href="/api/auth/google-calendar/start" className="inline-block border-2 border-ink px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper">
              Connect a different account
            </a>
          </div>
        </div>
      ) : (
        <a href="/api/auth/google-calendar/start" className="inline-block bg-strike px-5 py-3 text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:bg-ink">
          Connect Google Calendar
        </a>
      )}

      {flash && (
        <p className="mt-4 max-w-lg text-xs font-medium text-ink/60">{flash}</p>
      )}
    </div>
  );
}