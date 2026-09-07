import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EditRequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: requests } = await admin
    .from("fellow_edit_requests")
    .select("*, proposer:proposed_by(full_name, email)")
    .eq("lead_fellow_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const list = requests ?? [];

  return (
    <main className="min-h-screen bg-paper px-4 py-10 md:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/portal"
            aria-label="Back to dashboard"
            className="flex h-9 w-9 items-center justify-center border-2 border-ink text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 stroke-current"
              strokeWidth="2.5"
              fill="none"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12,19 5,12 12,5" />
            </svg>
          </a>
          <p className="inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest">
            Fellow Portal
          </p>
        </div>

        <h1 className="mb-8 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
          Edit requests.
        </h1>

        {list.length === 0 ? (
          <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">
            No pending requests.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {list.map((r) => {
              const proposer = r.proposer as {
                full_name: string;
                email: string;
              } | null;
              return (
                <div key={r.id} className="border-4 border-ink">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-navy px-5 py-3 text-paper">
                    <p className="text-sm font-bold uppercase tracking-widest">
                      Proposed by {proposer?.full_name ?? "a team member"}
                    </p>
                    <span className="text-xs font-medium text-paper/70">
                      {fmtDate(r.created_at)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4 p-5">
                    {r.proposed_idea_name && (
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                          Idea name
                        </p>
                        <p className="text-sm font-bold">
                          {r.proposed_idea_name}
                        </p>
                      </div>
                    )}
                    {r.proposed_idea_one_liner && (
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                          One-liner
                        </p>
                        <p className="text-sm">{r.proposed_idea_one_liner}</p>
                      </div>
                    )}
                    {r.proposed_idea_problem && (
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                          Problem
                        </p>
                        <p className="text-sm leading-relaxed">
                          {r.proposed_idea_problem}
                        </p>
                      </div>
                    )}
                    {r.proposed_vision_10yr && (
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                          10-Year Vision
                        </p>
                        <p className="text-sm leading-relaxed">
                          {r.proposed_vision_10yr}
                        </p>
                      </div>
                    )}
                    {r.proposed_mission_3_5yr && (
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                          3-5 Year Mission
                        </p>
                        <p className="text-sm leading-relaxed">
                          {r.proposed_mission_3_5yr}
                        </p>
                      </div>
                    )}
                    {r.proposed_goal_1yr && (
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                          1-Year Goal
                        </p>
                        <p className="text-sm leading-relaxed">
                          {r.proposed_goal_1yr}
                        </p>
                      </div>
                    )}
                    <form
                      action="/api/portal/decide-edit"
                      method="post"
                      className="flex gap-2 pt-2"
                    >
                      <input type="hidden" name="requestId" value={r.id} />
                      <button
                        name="decision"
                        value="approved"
                        className="bg-strike px-5 py-3 text-xs font-bold uppercase tracking-widest text-paper hover:bg-ink"
                      >
                        Approve
                      </button>
                      <button
                        name="decision"
                        value="rejected"
                        className="border-2 border-ink px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-ink hover:text-paper"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
