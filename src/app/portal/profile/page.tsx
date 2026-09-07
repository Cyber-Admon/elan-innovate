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

  const { data: teamMembers } = await admin
    .from("fellow_team_members")
    .select("*")
    .eq("fellow_id", user.id);

  const initialTeam = (teamMembers ?? []).map((m) => ({
    name: m.name,
    email: m.email,
    phone: m.phone ?? "",
    skills: m.skills ?? "",
    invitedToIncubator: m.invited_to_incubator,
  }));

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
          ideaName={fellow.idea_name ?? ""}
          ideaOneLiner={fellow.idea_one_liner ?? ""}
          ideaProblem={fellow.idea_problem ?? ""}
          vision10yr={fellow.vision_10yr ?? ""}
          mission3_5yr={fellow.mission_3_5yr ?? ""}
          goal1yr={fellow.goal_1yr ?? ""}
          initialTeam={initialTeam}
        />
      </div>
    </main>
  );
}