"use client";

import { useMemo, useState } from "react";
import SendReminderButton from "@/components/SendReminderButton";

type Invite = {
  token: string;
  full_name: string;
  email: string;
  created_at: string;
  last_reminder_sent_at: string | null;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function InvitedBrowser({ invites }: { invites: Invite[] }) {
  const [removedTokens, setRemovedTokens] = useState<Set<string>>(new Set());
  const [busyToken, setBusyToken] = useState<string | null>(null);
  const [confirmingToken, setConfirmingToken] = useState<string | null>(null);

  const visible = invites.filter((i) => !removedTokens.has(i.token));

  const { duplicateEmails } = useMemo(() => {
    const byEmail = new Map<string, Invite[]>();
    for (const inv of visible) {
      const key = inv.email.trim().toLowerCase();
      if (!byEmail.has(key)) byEmail.set(key, []);
      byEmail.get(key)!.push(inv);
    }
    const dupes = new Set<string>();
    for (const [, items] of byEmail) {
      if (items.length > 1) dupes.add(items[0].email.trim().toLowerCase());
    }
    return { duplicateEmails: dupes };
  }, [visible]);

  async function removeInvite(token: string, notify: boolean) {
    setBusyToken(token);
    try {
      const res = await fetch("/api/admin/delete-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, notify }),
      });
      if (res.ok) {
        setRemovedTokens((prev) => new Set(prev).add(token));
      }
    } finally {
      setBusyToken(null);
      setConfirmingToken(null);
    }
  }

  if (visible.length === 0) {
    return (
      <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">
        Everyone with an invite has registered.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {visible.map((inv, i) => {
        const emailKey = inv.email.trim().toLowerCase();
        const isDuplicateGroup = duplicateEmails.has(emailKey);
        const isFirstOfGroup =
          visible.findIndex((x) => x.email.trim().toLowerCase() === emailKey) === i;

        return (
          <div
            key={inv.token}
            className={`border-4 p-4 ${
              isDuplicateGroup && !isFirstOfGroup
                ? "border-strike bg-strike/5"
                : "border-ink"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-bold">
                  {inv.full_name || "Unknown"}
                  {isDuplicateGroup && (
                    <span
                      className={`ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                        isFirstOfGroup
                          ? "border-2 border-ink text-ink/60"
                          : "bg-strike text-paper"
                      }`}
                    >
                      {isFirstOfGroup ? "Keep" : "Duplicate"}
                    </span>
                  )}
                </p>
                <p className="text-sm text-ink/70">{inv.email}</p>
                <p className="text-xs text-ink/40">
                  Invited {fmtDate(inv.created_at)}
                  {inv.last_reminder_sent_at &&
                    ` · Last reminded ${fmtDate(inv.last_reminder_sent_at)}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isDuplicateGroup && !isFirstOfGroup ? (
                  confirmingToken !== inv.token ? (
                    <button
                      type="button"
                      onClick={() => setConfirmingToken(inv.token)}
                      disabled={busyToken === inv.token}
                      className="bg-strike px-4 py-2 text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:bg-ink disabled:opacity-50"
                    >
                      Remove duplicate
                    </button>
                  ) : null
                ) : (
                  <SendReminderButton type="never_registered" id={inv.token} />
                )}
              </div>
            </div>

            {confirmingToken === inv.token && (
              <div className="mt-4 border-2 border-ink/30 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink/60">
                  Notify them by email?
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => removeInvite(inv.token, false)}
                    disabled={busyToken === inv.token}
                    className="border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-ink hover:text-paper disabled:opacity-50"
                  >
                    Remove silently
                  </button>
                  <button
                    type="button"
                    onClick={() => removeInvite(inv.token, true)}
                    disabled={busyToken === inv.token}
                    className="bg-strike px-4 py-2 text-xs font-bold uppercase tracking-widest text-paper hover:bg-ink disabled:opacity-50"
                  >
                    Remove + email them
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingToken(null)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-ink/50 hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}