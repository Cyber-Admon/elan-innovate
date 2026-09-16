import { createClient as createAdminClient } from "@supabase/supabase-js";
import FellowsBrowser from "@/components/FellowsBrowser";

export const dynamic = "force-dynamic";

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

  const list = fellows ?? [];
  const teams = teamMembers ?? [];

  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-8 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
        Fellows
      </h1>
      <FellowsBrowser fellows={list} teamMembers={teams} pendingInvites={[]} />
    </main>
  );
}