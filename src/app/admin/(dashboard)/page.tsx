import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-4 border-ink p-6">
      <p className="text-4xl font-black leading-none text-strike md:text-5xl">
        {value}
      </p>
      <p className="mt-2 text-xs font-bold uppercase tracking-widest">{label}</p>
    </div>
  );
}

export default async function DashboardHome() {
  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [apps, enq] = await Promise.all([
    admin.from("applications").select("status"),
    admin.from("enquiries").select("id"),
  ]);

  const applications = apps.data ?? [];
  const enquiries = enq.data ?? [];

  const byStatus = (s: string) =>
    applications.filter((a) => (a.status ?? "new") === s).length;

  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-8 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
        Overview
      </h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <StatCard label="Total applications" value={applications.length} />
        <StatCard label="New" value={byStatus("new")} />
        <StatCard label="Reviewing" value={byStatus("reviewing")} />
        <StatCard label="Accepted" value={byStatus("accepted")} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:max-w-md md:gap-6">
        <StatCard label="Rejected" value={byStatus("rejected")} />
        <StatCard label="Enquiries" value={enquiries.length} />
      </div>

      <p className="mt-10 max-w-xl text-sm font-medium leading-relaxed text-ink/60">
        Use the sidebar to review applications, read enquiries, and manage
        access. This overview updates live as new submissions arrive.
      </p>
    </main>
  );
}