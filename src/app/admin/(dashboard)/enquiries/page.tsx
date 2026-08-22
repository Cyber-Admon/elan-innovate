import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export default async function EnquiriesPage() {
  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await admin
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const enquiries = data ?? [];

  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-8 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
        Service Enquiries
      </h1>

      {enquiries.length === 0 ? (
        <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">
          No enquiries yet.
        </p>
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
    </main>
  );
}