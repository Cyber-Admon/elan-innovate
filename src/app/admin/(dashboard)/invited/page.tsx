import { createClient as createAdminClient } from "@supabase/supabase-js";
import InvitedBrowser from "@/components/InvitedBrowser";

export const dynamic = "force-dynamic";

export default async function InvitedPage() {
  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: pendingInvites } = await admin
    .from("fellow_invites")
    .select("*")
    .eq("used", false)
    .order("created_at", { ascending: true });

  const invites = pendingInvites ?? [];

  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-1 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
        Invited
      </h1>
      <p className="mb-8 max-w-lg text-sm font-medium text-ink/60">
        People with a registration link who haven&apos;t created an account
        yet. They aren&apos;t fellows until they register.
      </p>
      <InvitedBrowser invites={invites} />
    </main>
  );
}