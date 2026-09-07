import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import ProfileForm from "@/components/portal/ProfileForm";
import TeamMemberIdeaView from "@/components/portal/TeamMemberIdeaView";

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

  const backLink = (
    
    <a  href="/portal"
      aria-label="Back to dashboard"
      className="flex h-9 w-9 items-center justify-center border-2 border-ink text-ink transition-colors hover:bg-ink hover:text-paper"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 stroke-current"
        strokeWidth="2.5"
        fill="none"
        aria-hidden="true"
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12,19 5,12 12,5" />
      </svg>
    </a>
  );

  // Team member: show the lead's shared idea, read-only, with propose-edit.
  if (fellow.lead_fellow_id) {
    const { data: lead } = await admin
      .from("fellows")
      .select("*")
      .eq("id", fellow.lead_fellow_id)
      .maybeSingle();

    return (
      <main className="min-h-screen bg-paper px-4 py-10 md:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            {backLink}
            <p className="inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest">
              Fellow Portal
            </p>
          </div>
          <h1 className="mb-8 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
            Your profile.
          </h1>

          {/* Personal info, editable directly */}
          <div className="mb-12 flex flex-col gap-6">
            <h2 className="text-xl font-black uppercase tracking-tight">Your Info</h2>
            <PersonalInfoForm phone={fellow.phone ?? ""} bio={fellow.bio ?? ""} />
          </div>

          {/* Shared idea, read-only + propose edit */}
          <TeamMemberIdeaView
            lead={{
              ideaName: lead?.idea_name ?? "",
              ideaOneLiner: lead?.idea_one_liner ?? "",
              ideaProblem: lead?.idea_problem ?? "",
              vision10yr: lead?.vision_10yr ?? "",
              mission3_5yr: lead?.mission_3_5yr ?? "",
              goal1yr: lead?.goal_1yr ?? "",
            }}
          />
        </div>
      </main>
    );
  }

  // Lead: full editable profile form as before.
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
        <div className="mb-6 flex items-center justify-between">
          {backLink}
          <p className="inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest">
            Fellow Portal
          </p>
        </div>
        <h1 className="mb-8 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
          Your profile.
        </h1>
        <ProfileForm
          fullName={fellow.full_name ?? ""}
          phone={fellow.phone ?? ""}
          bio={fellow.bio ?? ""}
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

// Minimal inline form for a team member's own phone/bio.
function PersonalInfoForm({ phone, bio }: { phone: string; bio: string }) {
  return (
    <form
      action="/api/portal/update-personal-info"
      method="post"
      className="flex flex-col gap-4"
    >
      <input
        name="phone"
        defaultValue={phone}
        placeholder="Phone / WhatsApp"
        className="w-full border-4 border-ink bg-paper px-4 py-3 text-base font-medium placeholder:text-ink/40"
      />
      <textarea
        name="bio"
        defaultValue={bio}
        rows={3}
        placeholder="A couple of sentences about you."
        className="w-full border-4 border-ink bg-paper px-4 py-3 text-base font-medium placeholder:text-ink/40"
      />
      <button
        type="submit"
        className="self-start bg-strike px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink"
      >
        Save
      </button>
    </form>
  );
}