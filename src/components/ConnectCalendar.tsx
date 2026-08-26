"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ConnectCalendar() {
  const params = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const s = params.get("calendar");
    if (s) setStatus(s);
  }, [params]);

  return (
    <div className="mb-8 border-4 border-ink p-5">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">
        Google Calendar
      </p>
      <p className="mb-4 max-w-lg text-sm font-medium leading-relaxed text-ink/70">
        Connect your Google account so scheduling an interview creates a real
        Calendar event with a Meet link, sent straight to the applicant.
      </p>
      {status === "connected" && (
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-strike">
          Connected successfully.
        </p>
      )}
      {status === "error" && (
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-strike">
          Something went wrong connecting. Try again.
        </p>
      )}
      {status === "no_refresh_token" && (
        <p className="mb-3 max-w-lg text-xs font-medium text-ink/60">
          Google didn&apos;t return a refresh token. This can happen if you&apos;ve
          connected before; revoke Elan&apos;s access at
          myaccount.google.com/permissions and try again.
        </p>
      )}
      
      <a  href="/api/auth/google-calendar/start"
        className="inline-block bg-strike px-5 py-3 text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:bg-ink"
      >
        Connect Google Calendar
      </a>
    </div>
  );
}