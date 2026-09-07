import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/portal/login", request.url));
  }

  const formData = await request.formData();
  const requestId = formData.get("requestId") as string;
  const decision = formData.get("decision") as string;

  if (!requestId || (decision !== "approved" && decision !== "rejected")) {
    return NextResponse.redirect(new URL("/portal/edit-requests", request.url));
  }

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: editRequest } = await admin
    .from("fellow_edit_requests")
    .select("*")
    .eq("id", requestId)
    .eq("lead_fellow_id", user.id)
    .maybeSingle();

  if (!editRequest) {
    return NextResponse.redirect(new URL("/portal/edit-requests", request.url));
  }

  if (decision === "approved") {
    await admin
      .from("fellows")
      .update({
        idea_name: editRequest.proposed_idea_name,
        idea_one_liner: editRequest.proposed_idea_one_liner,
        idea_problem: editRequest.proposed_idea_problem,
        vision_10yr: editRequest.proposed_vision_10yr,
        mission_3_5yr: editRequest.proposed_mission_3_5yr,
        goal_1yr: editRequest.proposed_goal_1yr,
      })
      .eq("id", user.id);
  }

  await admin
    .from("fellow_edit_requests")
    .update({ status: decision })
    .eq("id", requestId);

  return NextResponse.redirect(new URL("/portal/edit-requests", request.url));
}