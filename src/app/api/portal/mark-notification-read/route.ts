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

  const { notificationId, markAll } = await request.json();

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (markAll) {
    await admin
      .from("fellow_notifications")
      .update({ read: true })
      .eq("fellow_id", user.id)
      .eq("read", false);
  } else if (notificationId) {
    await admin
      .from("fellow_notifications")
      .update({ read: true })
      .eq("id", notificationId)
      .eq("fellow_id", user.id);
  }

  return NextResponse.json({ ok: true });
}