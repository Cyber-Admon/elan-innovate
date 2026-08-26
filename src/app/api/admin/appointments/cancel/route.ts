import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cancelEvent } from "@/lib/google-calendar";

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
    .select("status")
    .eq("id", user.id)
    .maybeSingle();

  if (!me || me.status !== "approved") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { eventId } = await request.json();
  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  const ok = await cancelEvent(eventId);
  return NextResponse.json({ ok });
}