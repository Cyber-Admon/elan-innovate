import { createClient as createAdminClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import RegisterForm from "@/components/portal/RegisterForm";

export const dynamic = "force-dynamic";

async function getInvite(token: string) {
  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await admin
    .from("fellow_invites")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  return data;
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await getInvite(token);

  if (!invite) notFound();

  if (invite.used) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
        <div className="max-w-md border-4 border-paper p-8 text-center md:p-10">
          <p className="mb-3 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest">
            Already registered
          </p>
          <h1 className="mb-4 text-2xl font-black uppercase leading-tight">
            This link&apos;s been used.
          </h1>
          <p className="text-sm font-medium leading-relaxed text-paper/70">
            You&apos;ve already created your fellow account. Head to the login
            page to sign in.
          </p>
        </div>
      </main>
    );
  }

  return (
    <RegisterForm token={token} fullName={invite.full_name} email={invite.email} />
  );
}