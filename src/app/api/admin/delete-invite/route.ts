import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { logAdminAction } from "@/lib/audit-log";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: me } = await supabase
    .from("admin_users")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (!me || me.role !== "superadmin" || me.status !== "approved") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Only allow deleting invites that haven't been used, never a real
  // registered fellow's completed invite.
  const { data: invite } = await admin
    .from("fellow_invites")
    .select("used")
    .eq("token", token)
    .maybeSingle();

  if (!invite || invite.used) {
    return NextResponse.json({ error: "Cannot delete a used invite" }, { status: 400 });
  }

  const { error } = await admin.from("fellow_invites").delete().eq("token", token);

  if (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  await logAdminAction({
    adminId: user.id,
    adminEmail: user.email ?? "",
    action: "invite_deleted",
    target: token,
  });

  return NextResponse.json({ ok: true });
}