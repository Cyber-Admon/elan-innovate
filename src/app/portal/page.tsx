import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function isProfileComplete(fellow: {
  bio: string | null;
  phone: string | null;
  photo_url: string | null;
}) {
  return !!(fellow.bio && fellow.phone && fellow.photo_url);
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

  // No fellow row yet, but we have a real session: create it now,
  // using the invite token if one was passed (from registration).
  if (!fellow) {
    let inviteData: {
      application_id: string;
      full_name: string;
      email: string;
      used: boolean;
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
              Add your phone number, a short bio, and a photo to finish setting
              up your fellow profile. Incomplete profiles are removed after 7
              days.
            </p>
            
            <a  href="/portal/profile"
              className="inline-block border-2 border-paper bg-paper px-5 py-3 text-xs font-bold uppercase tracking-widest text-strike transition-colors hover:bg-ink hover:text-paper"
            >
              Complete now
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
          <div className="border-4 border-ink bg-navy p-6 text-paper">
            <p className="text-lg font-black uppercase leading-tight">Community</p>
            <p className="mt-1 text-sm font-medium text-paper/70">
              WhatsApp link coming here
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}