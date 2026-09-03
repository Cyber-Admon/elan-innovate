import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token = searchParams.get("token");

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // If this came from a registration link, finish creating the fellow row.
    if (token && data.user) {
      const admin = createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: invite } = await admin
        .from("fellow_invites")
        .select("*")
        .eq("token", token)
        .maybeSingle();

      if (invite && !invite.used) {
        const { error: fellowError } = await admin.from("fellows").insert({
          id: data.user.id,
          application_id: invite.application_id,
          full_name: invite.full_name,
          email: data.user.email ?? invite.email,
          status: "active",
        });

        if (!fellowError) {
          await admin.from("fellow_invites").update({ used: true }).eq("token", token);
        } else {
          console.error("Fellow row creation (Google path) failed:", fellowError);
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/portal`);
}