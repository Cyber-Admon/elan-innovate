import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import ProfileForm from "@/components/portal/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: fellow } = await admin
    .from("fellows")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!fellow) redirect("/portal/login");

  return (
    <main className="min-h-screen bg-paper px-4 py-10 md:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest">
          Fellow Portal
        </p>
        <h1 className="mb-8 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
          Your profile.
        </h1>
        <ProfileForm
          fullName={fellow.full_name ?? ""}
          phone={fellow.phone ?? ""}
          bio={fellow.bio ?? ""}
          photoUrl={fellow.photo_url ?? ""}
        />
      </div>
    </main>
  );
}