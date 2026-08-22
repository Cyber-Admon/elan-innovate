import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const VALID_STATUS = ["new", "reviewing", "accepted", "rejected"];

export async function POST(request: Request) {
  // Only an approved admin (any role) may update applications.
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

  const body = await request.json();
  const { id, status, notes } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Build the update from whatever was sent.
  const update: { status?: string; notes?: string } = {};
  if (typeof status === "string") {
    if (!VALID_STATUS.includes(status)) {
      return NextResponse.json({ error: "Bad status" }, { status: 400 });
    }
    update.status = status;
  }
  if (typeof notes === "string") {
    update.notes = notes;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { error } = await admin
    .from("applications")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}