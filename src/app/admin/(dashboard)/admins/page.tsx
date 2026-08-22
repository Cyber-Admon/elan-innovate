import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default async function AdminsPage() {
  const me = await requireAdmin();
  if (me.role !== "superadmin") redirect("/admin");

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await admin
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });

  const users = data ?? [];
  const pending = users.filter((u) => u.status === "pending");
  const active = users.filter((u) => u.status === "approved");
  const declined = users.filter((u) => u.status === "declined");

  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-8 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
        Admins
      </h1>

      {/* Pending */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-black uppercase tracking-tight">
          Pending requests
        </h2>
        {pending.length === 0 ? (
          <p className="border-4 border-ink p-5 text-sm font-bold uppercase tracking-wide text-ink/50">
            No pending requests.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((p) => (
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
        )}
      </section>

      {/* Active */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-black uppercase tracking-tight">
          Active admins
        </h2>
        <div className="flex flex-col gap-3">
          {active.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-4 border-4 border-ink p-4">
              <div>
                <p className="font-bold">
                  {u.full_name ?? "Unknown"}
                  {u.role === "superadmin" && (
                    <span className="ml-2 bg-strike px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-paper">
                      Super
                    </span>
                  )}
                </p>
                <p className="text-sm text-ink/70">{u.email}</p>
                <p className="text-xs text-ink/40">Joined {fmtDate(u.created_at)}</p>
              </div>
              {u.id !== me.id && u.role !== "superadmin" && (
                <form action="/api/admin/decide" method="post">
                  <input type="hidden" name="id" value={u.id} />
                  <button name="decision" value="declined" className="border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-ink hover:text-paper">
                    Remove
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Declined */}
      {declined.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-black uppercase tracking-tight text-ink/50">
            Declined / removed
          </h2>
          <div className="flex flex-col gap-2">
            {declined.map((u) => (
              <div key={u.id} className="flex flex-wrap items-center justify-between gap-4 border-2 border-ink/30 p-3">
                <div>
                  <p className="text-sm font-bold text-ink/60">{u.full_name ?? "Unknown"}</p>
                  <p className="text-xs text-ink/40">{u.email}</p>
                </div>
                <form action="/api/admin/decide" method="post">
                  <input type="hidden" name="id" value={u.id} />
                  <button name="decision" value="approved" className="border-2 border-ink/40 px-4 py-2 text-xs font-bold uppercase tracking-widest text-ink/60 hover:bg-ink hover:text-paper">
                    Reinstate
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}