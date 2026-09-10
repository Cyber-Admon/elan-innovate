import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { brandedEmail, escapeHtml } from "@/lib/email-template";

type Recipient = { name: string; email: string };

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
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (!me || me.role !== "superadmin" || me.status !== "approved") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { recipients } = (await request.json()) as { recipients: Recipient[] };

  if (!Array.isArray(recipients) || recipients.length === 0) {
    return NextResponse.json({ error: "No recipients" }, { status: 400 });
  }

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const results: { email: string; ok: boolean }[] = [];

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  for (const person of recipients) {
    if (!person.email) continue;

    const { data: invite, error: inviteError } = await admin
      .from("fellow_invites")
      .insert({
        application_id: null,
        full_name: person.name,
        email: person.email,
      })
      .select("token")
      .single();

    if (inviteError || !invite?.token) {
      console.error("Bulk invite creation failed for", person.email, inviteError);
      results.push({ email: person.email, ok: false });
      continue;
    }

    const link = `https://elan.crelivio.com/portal/register/${invite.token}`;
    const firstName = person.name.trim().split(" ")[0] || "there";

    try {
      await transporter.sendMail({
        from: `"Elan Innovate" <${process.env.GMAIL_USER}>`,
        to: person.email,
        subject: "You're in — Elan Innovate Incubator",
        text: [
          `Hi ${firstName},`,
          "",
          "Congratulations. After reviewing your application, we'd like to welcome you into the Elan Innovate Incubator.",
          "",
          `Create your fellow account here: ${link}`,
          "",
          "We're glad to be building with you.",
          "",
          "Building with Momentum,",
          "Elan Innovate",
        ].join("\n"),
        html: brandedEmail({
          preheader: "You've been accepted into the Elan Innovate Incubator",
          heading: "You're in.",
          bodyHtml: `
            <p style="margin:0 0 16px 0;">Hi ${escapeHtml(firstName)},</p>
            <p style="margin:0 0 16px 0;">Congratulations. After reviewing your application, we'd like to welcome you into the <strong>Elan Innovate Incubator</strong>.</p>
            <p style="margin:0 0 16px 0;">We're glad to be building with you.</p>
          `,
          ctaText: "Create Your Fellow Account",
          ctaLink: link,
        }),
      });
      results.push({ email: person.email, ok: true });
    } catch (e) {
      console.error("Bulk acceptance email failed for", person.email, e);
      results.push({ email: person.email, ok: false });
    }
  }

  return NextResponse.json({ results });
}