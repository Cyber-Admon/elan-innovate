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

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: fellow } = await admin
    .from("fellows")
    .select("lead_fellow_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!fellow?.lead_fellow_id) {
    return NextResponse.json(
      { error: "Only team members can propose edits" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { ideaName, ideaOneLiner, ideaProblem, vision10yr, mission3_5yr, goal1yr } = body;

  const { error } = await admin.from("fellow_edit_requests").insert({
    lead_fellow_id: fellow.lead_fellow_id,
    proposed_by: user.id,
    proposed_idea_name: ideaName,
    proposed_idea_one_liner: ideaOneLiner,
    proposed_idea_problem: ideaProblem,
    proposed_vision_10yr: vision10yr,
    proposed_mission_3_5yr: mission3_5yr,
    proposed_goal_1yr: goal1yr,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: "Could not submit proposal" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}