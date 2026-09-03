import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const { token, userId, fullName, email } = await request.json();

  if (!token || !userId || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Confirm the invite is real and unused before doing anything.
  const { data: invite } = await admin
    .from("fellow_invites")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (!invite || invite.used) {
    return NextResponse.json({ error: "Invalid or used invite" }, { status: 400 });
  }

  // Create the fellow row.
  const { error: fellowError } = await admin.from("fellows").insert({
    id: userId,
    application_id: invite.application_id,
    full_name: fullName || invite.full_name,
    email,
    status: "active",
  });

  if (fellowError) {
    console.error("Fellow row creation failed:", fellowError);
    return NextResponse.json({ error: "Could not create fellow account" }, { status: 500 });
  }

  // Mark the invite used so the link can't be reused.
  await admin.from("fellow_invites").update({ used: true }).eq("token", token);

  return NextResponse.json({ ok: true });
}