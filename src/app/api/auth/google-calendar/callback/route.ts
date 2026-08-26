import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const adminId = searchParams.get("state");

  if (!code || !adminId) {
    return NextResponse.redirect(`${origin}/admin/admins?calendar=error`);
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    `${origin}/api/auth/google-calendar/callback`
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      // Google only sends a refresh token on first consent (or with prompt=consent).
      return NextResponse.redirect(`${origin}/admin/admins?calendar=no_refresh_token`);
    }

    // Fetch the connected Google account's email for display.
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data: profile } = await oauth2.userinfo.get();

    const admin = createAdminClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // One connection per admin: remove any existing row, then insert fresh.
    await admin.from("google_calendar_tokens").delete().eq("admin_id", adminId);
    await admin.from("google_calendar_tokens").insert({
      admin_id: adminId,
      refresh_token: tokens.refresh_token,
      connected_email: profile.email ?? null,
    });

    return NextResponse.redirect(`${origin}/admin/admins?calendar=connected`);
  } catch (e) {
    console.error("Calendar OAuth callback failed:", e);
    return NextResponse.redirect(`${origin}/admin/admins?calendar=error`);
  }
}