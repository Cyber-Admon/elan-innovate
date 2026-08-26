import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getConnectedCalendarEmail } from "@/lib/google-calendar";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ connected: false });

  const { data: me } = await supabase
    .from("admin_users")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (!me || me.role !== "superadmin" || me.status !== "approved") {
    return NextResponse.json({ connected: false });
  }

  const email = await getConnectedCalendarEmail();
  return NextResponse.json({ connected: !!email, email });
}