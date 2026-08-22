import { createClient as createAdminClient } from "@supabase/supabase-js";
import ApplicationsBrowser from "@/components/ApplicationsBrowser";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await admin
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-6 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
        Applications
      </h1>
      <ApplicationsBrowser applications={data ?? []} />
    </main>
  );
}