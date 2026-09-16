import { createClient as createAdminClient } from "@supabase/supabase-js";
import FellowsBrowser from "@/components/FellowsBrowser";
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

      {/* Invited, but not yet fellows (no account created) */}
      <section className="mb-10 border-4 border-ink/30 p-5">
        <h2 className="mb-1 text-xl font-black uppercase tracking-tight text-ink/70">
          Invited — Not Fellows Yet ({invites.length})
        </h2>
        <p className="mb-4 text-xs font-medium text-ink/50">
          These people have an invite link but haven&apos;t created an account.
          They don&apos;t count as fellows until they register.
        </p>
        {invites.length === 0 ? (
          <p className="border-2 border-ink/30 p-5 text-sm font-bold uppercase tracking-wide text-ink/50">
            Everyone with an invite has registered.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {invites.map((inv) => (
              <div
                key={inv.token}
                className="flex flex-wrap items-center justify-between gap-4 border-2 border-ink/30 p-4"
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

      {/* Actual fellows: registered accounts, overview + team grouping + popup */}
      <FellowsBrowser fellows={list} teamMembers={teams} pendingInvites={invites} />
    </main>
  );
}