"use client";

import { useMemo, useState } from "react";
import SendReminderButton from "@/components/SendReminderButton";

type Fellow = {
  id: string;
  team_id: string | null;
  lead_fellow_id: string | null;
  full_name: string | null;
  email: string;
  phone: string | null;
  bio: string | null;
  idea_name: string | null;
  idea_one_liner: string | null;
  idea_problem: string | null;
  vision_10yr: string | null;
  mission_3_5yr: string | null;
  goal_1yr: string | null;
  status: string;
  created_at: string;
  last_reminder_sent_at: string | null;
};

type TeamMember = {
  id: string;
  fellow_id: string;
  name: string;
  email: string;
  invited_to_incubator: boolean;
  invite_sent: boolean;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function FellowsBrowser({
  fellows,
  teamMembers,
}: {
  fellows: Fellow[];
  teamMembers: TeamMember[];
}) {
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [openFellow, setOpenFellow] = useState<Fellow | null>(null);

  const teamOptions = useMemo(() => {
    const teams = new Map<string, string>(); // team_id -> label (lead name)
    for (const f of fellows) {
      if (f.team_id && !f.lead_fellow_id) {
        teams.set(f.team_id, f.full_name || f.email);
      }
    }
    return Array.from(teams.entries());
  }, [fellows]);

  const filtered =
    teamFilter === "all"
      ? fellows
      : fellows.filter((f) => f.team_id === teamFilter);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-black uppercase tracking-tight">
          Registered ({filtered.length})
        </h2>
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="border-4 border-ink bg-paper px-4 py-2 text-xs font-bold uppercase tracking-widest"
        >
          <option value="all">All teams</option>
          {teamOptions.map(([teamId, label]) => (
            <option key={teamId} value={teamId}>
              {label}&apos;s team
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">
          No fellows here.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((f) => {
            const complete = !!(f.bio && f.phone);
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setOpenFellow(f)}
                className="flex flex-wrap items-center justify-between gap-3 border-4 border-ink p-4 text-left transition-colors hover:bg-ink hover:text-paper"
              >
                <div className="min-w-0">
                  <p className="truncate font-black uppercase leading-tight">
                    {f.full_name || f.email}
                  </p>
                  <p className="truncate text-sm opacity-60">
                    {f.idea_name || "No idea set"}
                    {f.lead_fellow_id ? " · Team member" : " · Lead"}
                  </p>
                </div>
                <span
                  className={`shrink-0 px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                    f.status === "removed"
                      ? "border-2 border-current opacity-60"
                      : complete
                      ? "bg-strike text-paper"
                      : "border-2 border-current opacity-80"
                  }`}
                >
                  {f.status === "removed"
                    ? "Removed"
                    : complete
                    ? "Complete"
                    : "Incomplete"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Detail popup */}
      {openFellow && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/70 p-4 py-10"
          onClick={() => setOpenFellow(null)}
        >
          <div
            className="relative w-full max-w-2xl border-4 border-ink bg-paper"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-4 border-ink bg-navy px-5 py-3 text-paper">
              <h3 className="text-lg font-black uppercase leading-tight">
                {openFellow.full_name || openFellow.email}
              </h3>
              <button
                type="button"
                onClick={() => setOpenFellow(null)}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center border-2 border-paper"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 stroke-paper"
                  strokeWidth="2.5"
                  fill="none"
                  aria-hidden="true"
                >
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              </button>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                  Contact
                </p>
                <p className="text-sm">{openFellow.email}</p>
                <p className="text-sm">{openFellow.phone || "No phone yet"}</p>
                <p className="mt-1 text-xs text-ink/40">
                  Joined {fmtDate(openFellow.created_at)}
                  {openFellow.last_reminder_sent_at &&
                    ` · Last reminded ${fmtDate(openFellow.last_reminder_sent_at)}`}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                  Bio
                </p>
                <p className="text-sm">{openFellow.bio || "Not filled yet"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                  Idea
                </p>
                <p className="text-sm font-bold">{openFellow.idea_name || "Not filled yet"}</p>
                <p className="text-sm">{openFellow.idea_one_liner}</p>
              </div>
              {openFellow.idea_problem && (
                <div className="md:col-span-2">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                    Problem
                  </p>
                  <p className="text-sm leading-relaxed">{openFellow.idea_problem}</p>
                </div>
              )}
              {openFellow.vision_10yr && (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                    10-Year Vision
                  </p>
                  <p className="text-sm leading-relaxed">{openFellow.vision_10yr}</p>
                </div>
              )}
              {openFellow.mission_3_5yr && (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                    3-5 Year Mission
                  </p>
                  <p className="text-sm leading-relaxed">{openFellow.mission_3_5yr}</p>
                </div>
              )}
              {openFellow.goal_1yr && (
                <div className="md:col-span-2">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                    1-Year Goal
                  </p>
                  <p className="text-sm leading-relaxed">{openFellow.goal_1yr}</p>
                </div>
              )}
              {!openFellow.lead_fellow_id &&
                teamMembers.filter((t) => t.fellow_id === openFellow.id).length > 0 && (
                  <div className="md:col-span-2">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">
                      Team
                    </p>
                    <div className="flex flex-col gap-2">
                      {teamMembers
                        .filter((t) => t.fellow_id === openFellow.id)
                        .map((m) => (
                          <div key={m.id} className="border-2 border-ink/20 p-3 text-sm">
                            <span className="font-bold">{m.name}</span>
                            {" · "}
                            {m.email}
                            {" · "}
                            {m.invited_to_incubator ? "Invited" : "Not invited"}
                            {m.invite_sent ? " (sent)" : ""}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              {!openFellow.lead_fellow_id && openFellow.status !== "removed" && !openFellow.bio && (
                <div className="md:col-span-2 pt-2">
                  <SendReminderButton type="incomplete_profile" id={openFellow.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}