import { createClient as createAdminClient } from "@supabase/supabase-js";
import Link from "next/link";
import AdminApplicationControls from "@/components/AdminApplicationControls";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

const FILTERS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "internal_review", label: "Internal Review" },
  { value: "external_review", label: "External Review" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filter = "all" } = await searchParams;

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let query = admin
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data } = await query;
  const applications = data ?? [];

  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-6 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
        Applications
      </h1>

      {/* Filter tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <Link
              key={f.value}
              href={f.value === "all" ? "/admin/applications" : `/admin/applications?status=${f.value}`}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                active
                  ? "bg-ink text-paper"
                  : "border-2 border-ink/30 text-ink/60 hover:border-ink hover:text-ink"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {applications.length === 0 ? (
        <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">
          No applications{filter !== "all" ? " in this stage" : ""} yet.
        </p>
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
              <AdminApplicationControls
                id={a.id}
                initialStatus={a.status}
                initialNotes={a.notes}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}