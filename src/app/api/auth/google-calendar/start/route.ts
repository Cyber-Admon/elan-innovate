import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { data: me } = await supabase
    .from("admin_users")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (!me || me.role !== "superadmin" || me.status !== "approved") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const { origin } = new URL(request.url);
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    `${origin}/api/auth/google-calendar/callback`
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // forces a refresh token every time, useful while testing
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    state: user.id, // so the callback knows which admin is connecting
  });

  return NextResponse.redirect(url);
}