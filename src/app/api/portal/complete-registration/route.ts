import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { token, fullName, email } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: invite } = await admin
    .from("fellow_invites")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (!invite || invite.used) {
    return NextResponse.json({ error: "Invalid or used invite" }, { status: 400 });
  }

  const { error: fellowError } = await admin.from("fellows").insert({
    id: user.id,
    application_id: invite.application_id,
    full_name: fullName || invite.full_name,
    email: user.email ?? email,
    status: "active",
  });

  if (fellowError) {
    console.error("Fellow row creation failed:", fellowError);
    return NextResponse.json({ error: "Could not create fellow account" }, { status: 500 });
  }

  await admin.from("fellow_invites").update({ used: true }).eq("token", token);

  return NextResponse.json({ ok: true });
}