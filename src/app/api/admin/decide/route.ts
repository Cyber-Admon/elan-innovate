import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  // Only an approved super admin may decide.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/admin/login", request.url));

  const { data: me } = await supabase
    .from("admin_users")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (!me || me.role !== "superadmin" || me.status !== "approved") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const form = await request.formData();
  const id = form.get("id") as string;
  const decision = form.get("decision") as string;

  if (id && (decision === "approved" || decision === "declined")) {
    const admin = createAdminClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    await admin.from("admin_users").update({ status: decision }).eq("id", id);
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}