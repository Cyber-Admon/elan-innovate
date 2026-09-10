import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import RestoreButton from "@/components/RestoreButton";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function TrashPage() {
  const me = await requireAdmin();
  if (me.role !== "superadmin") redirect("/admin");

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: deletedApps } = await admin
    .from("applications")
    .select("id, full_name, idea_name, email, deleted_at")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });

  const list = deletedApps ?? [];

  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-2 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
        Trash
      </h1>
      <p className="mb-8 max-w-lg text-sm font-medium text-ink/60">
        Deleted applications are kept here, not permanently removed. Restore
        anything that was removed by mistake.
      </p>

      {list.length === 0 ? (
        <p className="border-4 border-ink p-6 text-sm font-bold uppercase tracking-wide text-ink/50">
          Trash is empty.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-4 border-4 border-ink p-5"
            >
              <div>
                <p className="font-black uppercase leading-tight">{a.idea_name}</p>
                <p className="text-sm text-ink/60">
                  {a.full_name} · {a.email}
                </p>
                <p className="text-xs text-ink/40">
                  Deleted {a.deleted_at ? fmtDate(a.deleted_at) : ""}
                </p>
              </div>
              <RestoreButton id={a.id} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}