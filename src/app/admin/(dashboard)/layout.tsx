import { requireAdmin } from "@/lib/admin-auth";
import AdminSidebar from "@/components/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await requireAdmin();

  // Not yet approved: show gate screens instead of the app shell.
  if (me.status === "pending") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
        <div className="max-w-md border-4 border-paper p-8 text-center md:p-10">
          <p className="mb-3 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest">
            Pending approval
          </p>
          <h1 className="mb-4 text-2xl font-black uppercase leading-tight">
            You&apos;re in the queue.
          </h1>
          <p className="text-sm font-medium leading-relaxed text-paper/70">
            Your access request has been received. A super admin will review it.
            Check back once you&apos;ve been approved.
          </p>
        </div>
      </main>
    );
  }

  if (me.status === "declined") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
        <div className="max-w-md border-4 border-paper p-8 text-center md:p-10">
          <h1 className="text-2xl font-black uppercase leading-tight">
            Access denied.
          </h1>
        </div>
      </main>
    );
  }

  // Approved: full shell with sidebar.
  return (
    <div className="min-h-screen bg-paper md:flex">
      <AdminSidebar role={me.role} email={me.email} />
      <div className="flex-1 md:overflow-x-hidden">{children}</div>
    </div>
  );
}