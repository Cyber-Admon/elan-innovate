import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { Suspense } from "react";
import ConnectCalendar from "@/components/ConnectCalendar";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const me = await requireAdmin();
  if (me.role !== "superadmin") redirect("/admin");

  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-8 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
        Settings
      </h1>

      <Suspense fallback={null}>
        <ConnectCalendar />
      </Suspense>
    </main>
  );
}