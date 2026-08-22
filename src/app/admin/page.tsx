import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export default async function AdminDashboard() {
  // 1. Who's logged in?
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // 2. Are they an approved admin?
  const { data: me } = await supabase
    .from("admin_users")
    .select("role, status, full_name")
    .eq("id", user.id)
    .single();

  if (!me || me.status === "pending") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
        <div className="max-w-md border-4 border-paper p-8 text-center md:p-10">
          <p className="mb-3 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest">
            Pending approval
          </p>
          <h1 className="mb-4 text-2xl font-black uppercase leading-tight">
            You&apos;re in the queue.
          </h1>
          <p className="text-sm font-medium leading-relaxed text-paper/70">
            Your access request has been received. A super admin will review it.
            Check back once you&apos;ve been approved.
          </p>
        </div>
      </main>
    );
  }

  if (me.status === "declined") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
        <div className="max-w-md border-4 border-paper p-8 text-center md:p-10">
          <h1 className="text-2xl font-black uppercase leading-tight">
            Access denied.
          </h1>
        </div>
      </main>
    );
  }

  // 3. Approved. Load the data with the service key (bypasses RLS).
  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const [apps, enq, pending] = await Promise.all([
    admin.from("applications").select("*").order("created_at", { ascending: false }),
    admin.from("enquiries").select("*").order("created_at", { ascending: false }),
    me.role === "superadmin"
      ? admin.from("admin_users").select("*").eq("status", "pending").order("created_at")
      : Promise.resolve({ data: [] }),
  ]);

  const applications = apps.data ?? [];
  const enquiries = enq.data ?? [];
  const pendingAdmins = pending.data ?? [];

  return (
    <main className="min-h-screen bg-paper px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b-4 border-ink pb-6">
          <div>
            <p className="mb-2 inline-block bg-ink px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper">
              {me.role === "superadmin" ? "Super Admin" : "Admin"}
            </p>
            <h1 className="text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
              Elan control
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="border-4 border-ink px-5 py-3 text-center">
              <p className="text-3xl font-black leading-none text-strike">{applications.length}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest">Applications</p>
            </div>
            <div className="border-4 border-ink px-5 py-3 text-center">
              <p className="text-3xl font-black leading-none text-strike">{enquiries.length}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest">Enquiries</p>
            </div>
          </div>
        </div>

        {/* Pending admin requests, super admin only */}
        {me.role === "superadmin" && pendingAdmins.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-black uppercase tracking-tight">
              Pending admin requests
            </h2>
            <div className="flex flex-col gap-3">
              {pendingAdmins.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-4 border-4 border-ink p-4">
                  <div>
                    <p className="font-bold">{p.full_name ?? "Unknown"}</p>
                    <p className="text-sm text-ink/70">{p.email}</p>
                  </div>
                  <form action="/api/admin/decide" method="post" className="flex gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <button name="decision" value="approved" className="bg-strike px-4 py-2 text-xs font-bold uppercase tracking-widest text-paper hover:bg-ink">
                      Approve
                    </button>
                    <button name="decision" value="declined" className="border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-ink hover:text-paper">
                      Decline
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Applications */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-black uppercase tracking-tight">Applications</h2>
          {applications.length === 0 ? (
            <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">No applications yet.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {applications.map((a) => (
                <div key={a.id} className="border-4 border-ink">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-navy px-5 py-3 text-paper">
                    <h3 className="text-lg font-black uppercase leading-tight">{a.idea_name}</h3>
                    <span className="text-xs font-bold uppercase tracking-widest text-paper/70">{fmtDate(a.created_at)} · {a.stage}</span>
                  </div>
                  <div className="grid gap-4 p-5 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">Applicant</p>
                      <p className="font-bold">{a.full_name}</p>
                      <p className="text-sm">{a.email}</p>
                      <p className="text-sm">{a.phone}</p>
                      {a.campus && <p className="text-sm text-ink/70">{a.campus}</p>}
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">One-liner</p>
                      <p className="text-sm">{a.one_liner}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">Problem</p>
                      <p className="text-sm leading-relaxed">{a.problem}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">Why they want in</p>
                      <p className="text-sm leading-relaxed">{a.why}</p>
                    </div>
                    {a.team && a.team.length > 0 && (
                      <div className="md:col-span-2">
                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">Team ({a.team.length})</p>
                        <div className="flex flex-col gap-2">
                          {a.team.map((m: { name: string; email: string; phone: string; isStudent: boolean; skills: string }, i: number) => (
                            <div key={i} className="border-2 border-ink/20 p-3 text-sm">
                              <span className="font-bold">{m.name}</span>{" · "}{m.email}{" · "}{m.phone}{" · "}{m.isStudent ? "Student" : "Not a student"}{" · "}{m.skills}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Enquiries */}
        <section>
          <h2 className="mb-6 text-2xl font-black uppercase tracking-tight">Service Enquiries</h2>
          {enquiries.length === 0 ? (
            <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">No enquiries yet.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {enquiries.map((e) => (
                <div key={e.id} className="border-4 border-ink">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-ink px-5 py-3 text-paper">
                    <h3 className="text-lg font-black uppercase leading-tight">{e.service}</h3>
                    <span className="text-xs font-bold uppercase tracking-widest text-paper/70">{fmtDate(e.created_at)}</span>
                  </div>
                  <div className="grid gap-4 p-5 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">From</p>
                      <p className="font-bold">{e.name}</p>
                      {e.business && <p className="text-sm text-ink/70">{e.business}</p>}
                      <p className="text-sm">{e.email}</p>
                      <p className="text-sm">{e.phone}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">Details</p>
                      <p className="text-sm leading-relaxed">{e.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}