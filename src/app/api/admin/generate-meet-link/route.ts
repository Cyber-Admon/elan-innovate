import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createInterviewEvent } from "@/lib/google-calendar";

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

  const { applicantName, applicantEmail, ideaName, date, time } = await request.json();

  if (!date || !time) {
    return NextResponse.json({ error: "Date and time required" }, { status: 400 });
  }

  const meetLink = await createInterviewEvent({
    applicantName: applicantName || "Applicant",
    applicantEmail: applicantEmail || "",
    ideaName: ideaName || "their idea",
    date,
    time,
  });

  return NextResponse.json({ meetLink });
}