import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const { userId, email, fullName } = await request.json();

  if (!userId || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await admin.from("admin_users").insert({
    id: userId,
    email,
    full_name: fullName ?? null,
    role: "admin",
    status: "pending",
  });

  if (error) {
    console.error("Admin row creation failed:", error);
    return NextResponse.json({ error: "Could not complete registration" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}