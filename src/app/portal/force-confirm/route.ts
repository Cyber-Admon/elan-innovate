import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find the user by email.
  const { data: userList, error: listError } = await admin.auth.admin.listUsers();
  if (listError) {
    return NextResponse.json({ error: "Could not look up user" }, { status: 500 });
  }

  const user = userList.users.find((u) => u.email === email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Force confirm.
  const { error: confirmError } = await admin.auth.admin.updateUserById(user.id, {
    email_confirm: true,
  });

  if (confirmError) {
    return NextResponse.json({ error: "Could not confirm" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}