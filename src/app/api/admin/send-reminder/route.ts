import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { brandedEmail, escapeHtml } from "@/lib/email-template";
import { site } from "@/lib/site";

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

  const { type, id } = await request.json();

  if (!type || !id) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
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

  if (type === "incomplete_profile") {
    const { data: fellow } = await admin
      .from("fellows")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!fellow) {
      return NextResponse.json({ error: "Fellow not found" }, { status: 404 });
    }

    const firstName = (fellow.full_name ?? "there").trim().split(" ")[0];

    try {
      await transporter.sendMail({
        from: `"Elan Innovate" <${process.env.GMAIL_USER}>`,
        to: fellow.email,
        subject: "Complete your fellow profile — Elan Innovate",
        text: [
          `Hi ${firstName},`,
          "",
          "Just a reminder to finish setting up your Elan Innovate fellow profile. It only takes a couple of minutes.",
          "",
          `Complete it here: https://elan.crelivio.com/portal/profile`,
          "",
          `Also, don't forget to join our fellow community for updates: ${site.fellowCommunity}`,
          "",
          "Incomplete profiles are removed after 7 days, so this won't take long.",
          "",
          "Building with Momentum,",
          "Elan Innovate",
        ].join("\n"),
        html: brandedEmail({
          preheader: "Finish setting up your Elan Innovate fellow profile",
          heading: "Finish your profile.",
          bodyHtml: `
            <p style="margin:0 0 16px 0;">Hi ${escapeHtml(firstName)},</p>
            <p style="margin:0 0 16px 0;">Just a reminder to finish setting up your Elan Innovate fellow profile. It only takes a couple of minutes.</p>
            <p style="margin:0 0 16px 0;">Also, don't forget to join our fellow community for updates: <a href="${site.fellowCommunity}" target="_blank" style="color:#FF6A00;">Join here</a>.</p>
            <p style="margin:0 0 16px 0;">Incomplete profiles are removed after 7 days.</p>
          `,
          ctaText: "Complete Your Profile",
          ctaLink: "https://elan.crelivio.com/portal/profile",
        }),
      });

      await admin
        .from("fellows")
        .update({ last_reminder_sent_at: new Date().toISOString() })
        .eq("id", id);

      await admin.from("fellow_notifications").insert({
        fellow_id: id,
        title: "Complete your profile",
        body: "You have an incomplete profile. Finish it soon to keep your fellow access.",
      });
    } catch (e) {
      console.error("Reminder email failed:", e);
      return NextResponse.json({ error: "Send failed" }, { status: 500 });
    }
  } else if (type === "never_registered") {
    const { data: invite } = await admin
      .from("fellow_invites")
      .select("*")
      .eq("token", id)
      .maybeSingle();

    if (!invite || invite.used) {
      return NextResponse.json({ error: "Invite not found or already used" }, { status: 404 });
    }

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
        .eq("token", id);
    } catch (e) {
      console.error("Reminder email failed:", e);
      return NextResponse.json({ error: "Send failed" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}