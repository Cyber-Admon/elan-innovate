import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { brandedEmail, escapeHtml } from "@/lib/email-template";
import { logAdminAction } from "@/lib/audit-log";

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

  const { token, notify } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: invite } = await admin
    .from("fellow_invites")
    .select("used, email, full_name")
    .eq("token", token)
    .maybeSingle();

  if (!invite || invite.used) {
    return NextResponse.json({ error: "Cannot delete a used invite" }, { status: 400 });
  }

  const { error } = await admin.from("fellow_invites").delete().eq("token", token);

  if (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  await logAdminAction({
    adminId: user.id,
    adminEmail: user.email ?? "",
    action: "invite_deleted",
    target: token,
    details: notify ? { notified: true } : undefined,
  });

  if (notify && invite.email && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const firstName = (invite.full_name ?? "there").trim().split(" ")[0];
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
      await transporter.sendMail({
        from: `"Elan Innovate" <${process.env.GMAIL_USER}>`,
        to: invite.email,
        subject: "Update on your Elan Innovate Incubator spot",
        text: [
          `Hi ${firstName},`,
          "",
          "We're writing to let you know that your spot in the Elan Innovate Incubator has been removed, since you hadn't completed your registration after multiple reminders.",
          "If you'd still like to be part of a future cohort, you're welcome to apply again when applications reopen.",
          "",
          "Wishing you the best,",
          "Elan Innovate",
        ].join("\n"),
        html: brandedEmail({
          preheader: "An update on your Elan Innovate Incubator spot",
          heading: "Removed from the program.",
          bodyHtml: `
            <p style="margin:0 0 16px 0;">Hi ${escapeHtml(firstName)},</p>
            <p style="margin:0 0 16px 0;">We're writing to let you know that your spot in the Elan Innovate Incubator has been removed, since you hadn't completed your registration after multiple reminders.</p>
            <p style="margin:0 0 16px 0;">If you'd still like to be part of a future cohort, you're welcome to apply again when applications reopen.</p>
          `,
        }),
      });
    } catch (e) {
      console.error("Removal email failed:", e);
    }
  }

  return NextResponse.json({ ok: true });
}