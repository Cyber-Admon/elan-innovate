import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-ink/50">{value}</span>
      </div>
      <div className="h-6 w-full border-2 border-ink">
        <div className="h-full bg-strike" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function MetricsPage() {
  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [apps, enq] = await Promise.all([
    admin.from("applications").select("status, stage, created_at"),
    admin.from("enquiries").select("service, created_at"),
  ]);

  const applications = apps.data ?? [];
  const enquiries = enq.data ?? [];

  const statusCount = (s: string) =>
    applications.filter((a) => (a.status ?? "new") === s).length;

  const stageCount = (s: string) =>
    applications.filter((a) => a.stage === s).length;

  const totalApps = applications.length;
  const accepted = statusCount("accepted");
  const acceptanceRate =
    totalApps > 0 ? Math.round((accepted / totalApps) * 100) : 0;

  // Applications in the last 7 days
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentApps = applications.filter(
    (a) => new Date(a.created_at).getTime() > weekAgo
  ).length;

  const maxStatus = Math.max(
    statusCount("new"),
    statusCount("reviewing"),
    statusCount("accepted"),
    statusCount("rejected"),
    1
  );

  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-8 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
        Metrics
      </h1>

      {/* Headline numbers */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <div className="border-4 border-ink p-5">
          <p className="text-4xl font-black leading-none text-strike">{totalApps}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest">Total applications</p>
        </div>
        <div className="border-4 border-ink p-5">
          <p className="text-4xl font-black leading-none text-strike">{recentApps}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest">Last 7 days</p>
        </div>
        <div className="border-4 border-ink p-5">
          <p className="text-4xl font-black leading-none text-strike">{acceptanceRate}%</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest">Acceptance rate</p>
        </div>
        <div className="border-4 border-ink p-5">
          <p className="text-4xl font-black leading-none text-strike">{enquiries.length}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest">Total enquiries</p>
        </div>
      </div>

      {/* Applications by status */}
      <section className="mb-10 max-w-2xl">
        <h2 className="mb-5 text-xl font-black uppercase tracking-tight">
          Applications by status
        </h2>
        <div className="flex flex-col gap-4">
          <Bar label="New" value={statusCount("new")} max={maxStatus} />
          <Bar label="Reviewing" value={statusCount("reviewing")} max={maxStatus} />
          <Bar label="Accepted" value={statusCount("accepted")} max={maxStatus} />
          <Bar label="Rejected" value={statusCount("rejected")} max={maxStatus} />
        </div>
      </section>

      {/* Applications by stage */}
      <section className="max-w-2xl">
        <h2 className="mb-5 text-xl font-black uppercase tracking-tight">
          Applicants by stage
        </h2>
        <div className="flex flex-col gap-4">
          <Bar label="Idea only" value={stageCount("idea only / just starting")} max={Math.max(totalApps, 1)} />
          <Bar label="Started building" value={stageCount("started building")} max={Math.max(totalApps, 1)} />
          <Bar label="Has users" value={stageCount("has users")} max={Math.max(totalApps, 1)} />
        </div>
        <p className="mt-4 text-xs font-medium text-ink/50">
          Stage labels depend on how your form stores them. If a bar reads zero unexpectedly, the stored value differs from the label here and I can adjust it.
        </p>
      </section>
    </main>
  );
}