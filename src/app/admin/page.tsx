import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type Application = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  campus: string | null;
  idea_name: string;
  one_liner: string;
  problem: string;
  stage: string;
  team: { name: string; email: string; phone: string; isStudent: boolean; skills: string }[] | null;
  why: string;
};

type Enquiry = {
  id: string;
  created_at: string;
  name: string;
  business: string | null;
  email: string;
  phone: string;
  service: string;
  details: string;
};

async function getData() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [apps, enq] = await Promise.all([
    supabase.from("applications").select("*").order("created_at", { ascending: false }),
    supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
  ]);

  return {
    applications: (apps.data ?? []) as Application[],
    enquiries: (enq.data ?? []) as Enquiry[],
  };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminDashboard() {
  const { applications, enquiries } = await getData();

  return (
    <main className="min-h-screen bg-paper px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b-4 border-ink pb-6">
          <div>
            <p className="mb-2 inline-block bg-ink px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper">
              Admin
            </p>
            <h1 className="text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
              Elan control
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="border-4 border-ink px-5 py-3 text-center">
              <p className="text-3xl font-black leading-none text-strike">
                {applications.length}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest">
                Applications
              </p>
            </div>
            <div className="border-4 border-ink px-5 py-3 text-center">
              <p className="text-3xl font-black leading-none text-strike">
                {enquiries.length}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest">
                Enquiries
              </p>
            </div>
          </div>
        </div>

        {/* Applications */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-black uppercase tracking-tight">
            Applications
          </h2>
          {applications.length === 0 ? (
            <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">
              No applications yet.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {applications.map((a) => (
                <div key={a.id} className="border-4 border-ink">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-navy px-5 py-3 text-paper">
                    <h3 className="text-lg font-black uppercase leading-tight">
                      {a.idea_name}
                    </h3>
                    <span className="text-xs font-bold uppercase tracking-widest text-paper/70">
                      {fmtDate(a.created_at)} · {a.stage}
                    </span>
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
                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">
                          Team ({a.team.length})
                        </p>
                        <div className="flex flex-col gap-2">
                          {a.team.map((m, i) => (
                            <div key={i} className="border-2 border-ink/20 p-3 text-sm">
                              <span className="font-bold">{m.name}</span>
                              {" · "}{m.email}{" · "}{m.phone}
                              {" · "}{m.isStudent ? "Student" : "Not a student"}
                              {" · "}{m.skills}
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
          <h2 className="mb-6 text-2xl font-black uppercase tracking-tight">
            Service Enquiries
          </h2>
          {enquiries.length === 0 ? (
            <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">
              No enquiries yet.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {enquiries.map((e) => (
                <div key={e.id} className="border-4 border-ink">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-ink px-5 py-3 text-paper">
                    <h3 className="text-lg font-black uppercase leading-tight">
                      {e.service}
                    </h3>
                    <span className="text-xs font-bold uppercase tracking-widest text-paper/70">
                      {fmtDate(e.created_at)}
                    </span>
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