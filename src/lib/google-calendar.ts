import { google } from "googleapis";
import { createClient as createAdminClient } from "@supabase/supabase-js";

function adminClient() {
  return createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Returns an authorized Calendar client using the stored refresh token,
// or null if no admin has connected a calendar yet.
export async function getCalendarClient() {
  const supabase = adminClient();
  const { data } = await supabase
    .from("google_calendar_tokens")
    .select("refresh_token")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.refresh_token) return null;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: data.refresh_token });

  return google.calendar({ version: "v3", auth: oauth2Client });
}

export async function getConnectedCalendarEmail() {
  const supabase = adminClient();
  const { data } = await supabase
    .from("google_calendar_tokens")
    .select("connected_email")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.connected_email ?? null;
}

// Creates a Calendar event with a Google Meet link for an interview.
// Returns the Meet join URL, or null if calendar isn't connected or creation failed.
export async function createInterviewEvent({
  applicantName,
  applicantEmail,
  ideaName,
  date, // "YYYY-MM-DD"
  time, // "HH:MM"
  durationMinutes = 30,
}: {
  applicantName: string;
  applicantEmail: string;
  ideaName: string;
  date: string;
  time: string;
  durationMinutes?: number;
}): Promise<string | null> {
  const calendar = await getCalendarClient();
  if (!calendar) return null;

  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  try {
    const res = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: `Elan Innovate interview — ${applicantName} (${ideaName})`,
        description: `Incubator application interview for "${ideaName}".`,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
        attendees: [{ email: applicantEmail }],
        conferenceData: {
          createRequest: {
            requestId: `elan-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    return res.data.hangoutLink ?? null;
  } catch (e) {
    console.error("Calendar event creation failed:", e);
    return null;
  }
}