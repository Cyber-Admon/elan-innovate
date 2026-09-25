import { createClient as createAdminClient } from "@supabase/supabase-js";
import DuplicatesBrowser from "@/components/DuplicatesBrowser";

export const dynamic = "force-dynamic";

export default async function DuplicatesPage() {
  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await admin
    .from("applications")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  const applications = data ?? [];

  // Group by email only
  const byEmail = new Map<string, typeof applications>();
  for (const a of applications) {
    const key = a.email.trim().toLowerCase();
    if (!byEmail.has(key)) byEmail.set(key, []);
    byEmail.get(key)!.push(a);
  }

  const groups = Array.from(byEmail.entries())
    .filter(([, items]) => items.length > 1)
    .map(([email, items]) => ({ label: `Same email: ${email}`, items }));

  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-2 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
        Duplicates
      </h1>
      <p className="mb-8 max-w-lg text-sm font-medium text-ink/60">
        Applications submitted from the same email address. Review each group
        and remove the extras, they go to Trash, not gone for good.
      </p>
      <DuplicatesBrowser groups={groups} />
    </main>
  );
}