import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

function isProfileComplete(fellow: { bio: string | null; phone: string | null }) {
  return !!(fellow.bio && fellow.phone);
}

export default async function PortalDashboard({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite: inviteToken } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let fellow: {
    id: string;
    application_id: string | null;
    lead_fellow_id: string | null;
    full_name: string | null;
    email: string;
    phone: string | null;
    bio: string | null;
    photo_url: string | null;
    status: string;
  } | null = null;

  const { data: existingFellow } = await admin
    .from("fellows")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  fellow = existingFellow;

  if (!fellow) {
    let inviteData: {
      application_id: string | null;
      full_name: string;
      email: string;
      used: boolean;
      lead_fellow_id: string | null;
    } | null = null;

    if (inviteToken) {
      const { data } = await admin
        .from("fellow_invites")
        .select("*")
        .eq("token", inviteToken)
        .maybeSingle();
      inviteData = data;
    }

    const { data: created, error: createError } = await admin
      .from("fellows")
      .insert({
        id: user.id,
        application_id: inviteData?.application_id ?? null,
        lead_fellow_id: inviteData?.lead_fellow_id ?? null,
        full_name:
          inviteData?.full_name ??
          (user.user_metadata?.full_name as string | undefined) ??
          "",
        email: user.email ?? inviteData?.email ?? "",
        status: "active",
      })
      .select("*")
      .single();

    if (createError) {
      console.error("Fellow row creation (portal fallback) failed:", createError);
      redirect("/portal/login");
    }

    if (inviteToken && inviteData && !inviteData.used) {
      await admin
        .from("fellow_invites")
        .update({ used: true })
        .eq("token", inviteToken);
    }

    fellow = created;
  }

  if (!fellow) redirect("/portal/login");

  if (fellow.status === "removed") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
        <div className="max-w-md border-4 border-paper p-8 text-center md:p-10">
          <h1 className="mb-4 text-2xl font-black uppercase leading-tight">
            Access removed.
          </h1>
          <p className="text-sm font-medium leading-relaxed text-paper/70">
            Your fellow access was removed after your profile wasn&apos;t
            completed in time. Reach out to us if you&apos;d like to be
            reinstated.
          </p>
        </div>
      </main>
    );
  }

  const complete = isProfileComplete(fellow);

  // If this fellow was invited by a lead, fetch pending edit requests they
  // may have submitted (shown for the lead's own review below), and load
  // the lead's shared idea info for display if this fellow IS a team member.
  let pendingRequests: {
    id: string;
    proposed_idea_name: string | null;
    proposed_idea_one_liner: string | null;
    proposed_idea_problem: string | null;
    proposed_vision_10yr: string | null;
    proposed_mission_3_5yr: string | null;
    proposed_goal_1yr: string | null;
    created_at: string;
    proposer_name: string | null;
  }[] = [];

  if (!fellow.lead_fellow_id) {
    // This fellow IS a lead. Check for pending edit requests from their team.
    const { data: requests } = await admin
      .from("fellow_edit_requests")
      .select("*, proposer:proposed_by(full_name)")
      .eq("lead_fellow_id", fellow.id)
      .eq("status", "pending");

    pendingRequests = (requests ?? []).map((r) => ({
      id: r.id,
      proposed_idea_name: r.proposed_idea_name,
      proposed_idea_one_liner: r.proposed_idea_one_liner,
      proposed_idea_problem: r.proposed_idea_problem,
      proposed_vision_10yr: r.proposed_vision_10yr,
      proposed_mission_3_5yr: r.proposed_mission_3_5yr,
      proposed_goal_1yr: r.proposed_goal_1yr,
      created_at: r.created_at,
      proposer_name: (r.proposer as { full_name: string } | null)?.full_name ?? "A team member",
    }));
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-10 md:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 inline-block border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest">
          Fellow Portal
        </p>
        <h1 className="mb-8 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
          Welcome, {fellow.full_name?.split(" ")[0] ?? "there"}.
        </h1>

        {!complete && (
          <div className="mb-8 border-4 border-ink bg-strike p-5 text-paper">
            <p className="mb-1 text-sm font-black uppercase tracking-widest">
              Complete your profile
            </p>
            <p className="mb-4 text-sm font-medium leading-relaxed">
              Add your phone number and a short bio to finish setting up your
              fellow profile. Incomplete profiles are removed after 7 days.
            </p>
            
            <a  href="/portal/profile"
              className="inline-block border-2 border-paper bg-paper px-5 py-3 text-xs font-bold uppercase tracking-widest text-strike transition-colors hover:bg-ink hover:text-paper"
            >
              Complete now
            </a>
          </div>
        )}

        {pendingRequests.length > 0 && (
          <div className="mb-8 border-4 border-ink bg-navy p-5 text-paper">
            <p className="mb-3 text-sm font-black uppercase tracking-widest">
              Pending edit requests ({pendingRequests.length})
            </p>
            <p className="mb-4 text-sm font-medium leading-relaxed text-paper/80">
              A team member has proposed changes to your shared idea info.
            </p>
            
            <a  href="/portal/edit-requests"
              className="inline-block bg-strike px-5 py-3 text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:bg-paper hover:text-navy"
            >
              Review requests
            </a>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          
          <a  href="/portal/profile"
            className="border-4 border-ink p-6 transition-colors hover:bg-ink hover:text-paper"
          >
            <p className="text-lg font-black uppercase leading-tight">Your Profile</p>
            <p className="mt-1 text-sm font-medium opacity-70">Update your info</p>
          </a>
          
          <a  href={site.fellowCommunity}
            target="_blank"
            rel="noopener noreferrer"
            className="border-4 border-ink bg-navy p-6 text-paper transition-colors hover:bg-ink"
          >
            <p className="text-lg font-black uppercase leading-tight">Community</p>
            <p className="mt-1 text-sm font-medium text-paper/70">
              Join the fellow WhatsApp group
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}