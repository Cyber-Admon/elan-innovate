import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

function adminClient() {
  return createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const track = searchParams.get("track") ?? "incubator";

  const admin = adminClient();
  const { data } = await admin
    .from("cohort_settings")
    .select("*")
    .eq("track", track)
    .maybeSingle();
  return NextResponse.json({ settings: data });
}

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

  const body = await request.json();
  const { track, is_open, opens_at, closes_at, cohort_label } = body;

  if (!track) {
    return NextResponse.json({ error: "Missing track" }, { status: 400 });
  }

  const admin = adminClient();
  const { error } = await admin
    .from("cohort_settings")
    .update({
      is_open,
      opens_at: opens_at || null,
      closes_at: closes_at || null,
      cohort_label: cohort_label || null,
      updated_at: new Date().toISOString(),
    })
    .eq("track", track);

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}