import { createClient as createAdminClient } from "@supabase/supabase-js";
import SendReminderButton from "@/components/SendReminderButton";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function FellowsPage() {
  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: fellows } = await admin
    .from("fellows")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: teamMembers } = await admin.from("fellow_team_members").select("*");

  const { data: pendingInvites } = await admin
    .from("fellow_invites")
    .select("*")
    .eq("used", false)
    .order("created_at", { ascending: false });

  const list = fellows ?? [];
  const teams = teamMembers ?? [];
  const invites = pendingInvites ?? [];

  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-8 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
        Fellows
      </h1>

      {/* Never registered */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-black uppercase tracking-tight">
          Not Yet Registered ({invites.length})
        </h2>
        {invites.length === 0 ? (
          <p className="border-4 border-ink p-5 text-sm font-bold uppercase tracking-wide text-ink/50">
            Everyone with an invite has registered.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {invites.map((inv) => (
              <div
                key={inv.token}
                className="flex flex-wrap items-center justify-between gap-4 border-4 border-ink p-4"
              >
                <div>
                  <p className="font-bold">{inv.full_name || "Unknown"}</p>
                  <p className="text-sm text-ink/70">{inv.email}</p>
                  <p className="text-xs text-ink/40">
                    Invited {fmtDate(inv.created_at)}
                    {inv.last_reminder_sent_at &&
                      ` · Last reminded ${fmtDate(inv.last_reminder_sent_at)}`}
                  </p>
                </div>
                <SendReminderButton type="never_registered" id={inv.token} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Registered fellows */}
      <section>
        <h2 className="mb-4 text-xl font-black uppercase tracking-tight">
          Registered ({list.length})
        </h2>
        {list.length === 0 ? (
          <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">
            No fellows yet.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {list.map((f) => {
              const complete = !!(f.bio && f.phone);
              const myTeam = teams.filter((t) => t.fellow_id === f.id);
              return (
                <div key={f.id} className="border-4 border-ink">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-navy px-5 py-3 text-paper">
                    <h3 className="text-lg font-black uppercase leading-tight">
                      {f.full_name || f.email}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-bold uppercase tracking-widest ${
                        f.status === "removed"
                          ? "border-2 border-paper text-paper/60"
                          : complete
                          ? "bg-strike text-paper"
                          : "border-2 border-paper text-paper/80"
                      }`}
                    >
                      {f.status === "removed"
                        ? "Removed"
                        : complete
                        ? "Complete"
                        : "Incomplete profile"}
                    </span>
                  </div>
                  <div className="grid gap-4 p-5 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                        Contact
                      </p>
                      <p className="text-sm">{f.email}</p>
                      <p className="text-sm">{f.phone || "No phone yet"}</p>
                      <p className="mt-1 text-xs text-ink/40">
                        Joined {fmtDate(f.created_at)}
                        {f.last_reminder_sent_at &&
                          ` · Last reminded ${fmtDate(f.last_reminder_sent_at)}`}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                        Bio
                      </p>
                      <p className="text-sm">{f.bio || "Not filled yet"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                        Idea
                      </p>
                      <p className="text-sm font-bold">{f.idea_name || "Not filled yet"}</p>
                      <p className="text-sm">{f.idea_one_liner}</p>
                    </div>
                    {f.idea_problem && (
                      <div className="md:col-span-2">
                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                          Problem
                        </p>
                        <p className="text-sm leading-relaxed">{f.idea_problem}</p>
                      </div>
                    )}
                    {f.vision_10yr && (
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                          10-Year Vision
                        </p>
                        <p className="text-sm leading-relaxed">{f.vision_10yr}</p>
                      </div>
                    )}
                    {f.mission_3_5yr && (
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                          3-5 Year Mission
                        </p>
                        <p className="text-sm leading-relaxed">{f.mission_3_5yr}</p>
                      </div>
                    )}
                    {f.goal_1yr && (
                      <div className="md:col-span-2">
                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                          1-Year Goal
                        </p>
                        <p className="text-sm leading-relaxed">{f.goal_1yr}</p>
                      </div>
                    )}
                    {myTeam.length > 0 && (
                      <div className="md:col-span-2">
                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">
                          Team ({myTeam.length})
                        </p>
                        <div className="flex flex-col gap-2">
                          {myTeam.map((m) => (
                            <div key={m.id} className="border-2 border-ink/20 p-3 text-sm">
                              <span className="font-bold">{m.name}</span>
                              {" · "}
                              {m.email}
                              {" · "}
                              {m.invited_to_incubator ? "Invited to incubator" : "Not invited"}
                              {m.invite_sent ? " (sent)" : ""}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {!complete && f.status !== "removed" && (
                      <div className="md:col-span-2">
                        <SendReminderButton type="incomplete_profile" id={f.id} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}