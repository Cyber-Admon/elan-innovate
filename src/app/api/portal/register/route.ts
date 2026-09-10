import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const { email, password, fullName, token } = await request.json();

  if (!email || !password || !token) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Verify the invite is real, unused, and matches the email being registered.
  const { data: invite, error: inviteError } = await admin
    .from("fellow_invites")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (inviteError || !invite) {
    return NextResponse.json({ error: "Invalid invite" }, { status: 403 });
  }

  if (invite.used) {
    return NextResponse.json({ error: "This invite has already been used" }, { status: 403 });
  }

  if (invite.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ error: "Email does not match this invite" }, { status: 403 });
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Mark the invite used now that the account genuinely exists.
  await admin.from("fellow_invites").update({ used: true }).eq("token", token);

  return NextResponse.json({ ok: true, userId: data.user?.id });
}