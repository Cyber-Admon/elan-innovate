import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { brandedEmail, escapeHtml } from "@/lib/email-template";
import { site } from "@/lib/site";

const REMINDER_INTERVAL_HOURS = 60;
const REMOVAL_AFTER_DAYS = 7;

function hoursSince(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60);
}

function daysSince(iso: string) {
  return hoursSince(iso) / 24;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: "Email not configured" }, { status: 500 });
  }

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const results = { remindedFellows: 0, removedFellows: 0, remindedInvites: 0 };

  const { data: fellows } = await admin
    .from("fellows")
    .select("*")
    .eq("status", "active");

  for (const fellow of fellows ?? []) {
    const complete = !!(fellow.bio && fellow.phone);
    if (complete) continue;

    const ageDays = daysSince(fellow.created_at);

    if (ageDays >= REMOVAL_AFTER_DAYS) {
      await admin.from("fellows").update({ status: "removed" }).eq("id", fellow.id);
      results.removedFellows++;
      continue;
    }

    const dueForReminder =
      !fellow.last_reminder_sent_at ||
      hoursSince(fellow.last_reminder_sent_at) >= REMINDER_INTERVAL_HOURS;

    if (!dueForReminder) continue;

    const firstName = (fellow.full_name ?? "there").trim().split(" ")[0];

    try {
      await transporter.sendMail({
        from: `"Elan Innovate" <${process.env.GMAIL_USER}>`,
        to: fellow.email,
        subject: "Complete your fellow profile — Elan Innovate",
        text: [
          `Hi ${firstName},`,
          "",
          "Just a reminder to finish setting up your Elan Innovate fellow profile.",
          "",
          "Complete it here: https://elan.crelivio.com/portal/profile",
          "",
          `Also, don't forget to join our fellow community: ${site.fellowCommunity}`,
          "",
          "Incomplete profiles are removed after 7 days.",
          "",
          "Building with Momentum,",
          "Elan Innovate",
        ].join("\n"),
        html: brandedEmail({
          preheader: "Finish setting up your Elan Innovate fellow profile",
          heading: "Finish your profile.",
          bodyHtml: `
            <p style="margin:0 0 16px 0;">Hi ${escapeHtml(firstName)},</p>
            <p style="margin:0 0 16px 0;">Just a reminder to finish setting up your Elan Innovate fellow profile.</p>
            <p style="margin:0 0 16px 0;">Also, don't forget to join our fellow community: <a href="${site.fellowCommunity}" target="_blank" style="color:#FF6A00;">Join here</a>.</p>
            <p style="margin:0 0 16px 0;">Incomplete profiles are removed after 7 days.</p>
          `,
          ctaText: "Complete Your Profile",
          ctaLink: "https://elan.crelivio.com/portal/profile",
        }),
      });

      await admin
        .from("fellows")
        .update({ last_reminder_sent_at: new Date().toISOString() })
        .eq("id", fellow.id);

      await admin.from("fellow_notifications").insert({
        fellow_id: fellow.id,
        title: "Complete your profile",
        body: "You have an incomplete profile. Finish it soon to keep your fellow access.",
      });

      results.remindedFellows++;
    } catch (e) {
      console.error("Cron reminder failed for", fellow.email, e);
    }
  }

  const { data: invites } = await admin
    .from("fellow_invites")
    .select("*")
    .eq("used", false);

  for (const invite of invites ?? []) {
    const ageDays = daysSince(invite.created_at);
    if (ageDays >= REMOVAL_AFTER_DAYS) continue;

    const dueForReminder =
      !invite.last_reminder_sent_at ||
      hoursSince(invite.last_reminder_sent_at) >= REMINDER_INTERVAL_HOURS;

    if (!dueForReminder) continue;

    const firstName = (invite.full_name ?? "there").trim().split(" ")[0];
    const link = `https://elan.crelivio.com/portal/register/${invite.token}`;

    try {
      await transporter.sendMail({
        from: `"Elan Innovate" <${process.env.GMAIL_USER}>`,
        to: invite.email,
        subject: "Reminder: create your Elan Innovate fellow account",
        text: [
          `Hi ${firstName},`,
          "",
          "You were accepted into the Elan Innovate Incubator, but you haven't created your fellow account yet.",
          "",
          `Create it here: ${link}`,
          "",
          "Building with Momentum,",
          "Elan Innovate",
        ].join("\n"),
        html: brandedEmail({
          preheader: "You haven't created your fellow account yet",
          heading: "Still waiting on you.",
          bodyHtml: `
            <p style="margin:0 0 16px 0;">Hi ${escapeHtml(firstName)},</p>
            <p style="margin:0 0 16px 0;">You were accepted into the Elan Innovate Incubator, but you haven't created your fellow account yet.</p>
          `,
          ctaText: "Create Your Fellow Account",
          ctaLink: link,
        }),
      });

      await admin
        .from("fellow_invites")
        .update({ last_reminder_sent_at: new Date().toISOString() })
        .eq("token", invite.token);

      results.remindedInvites++;
    } catch (e) {
      console.error("Cron reminder failed for invite", invite.email, e);
    }
  }

  return NextResponse.json({ ok: true, ...results });
}