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

  const { id, restore, notifyReason } = await request.json();
  // notifyReason: "incomplete_profile" | "no_response" | null (no email)

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: app } = await admin
    .from("applications")
    .select("full_name, email")
    .eq("id", id)
    .maybeSingle();

  const { error } = await admin
    .from("applications")
    .update({ deleted_at: restore ? null : new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  await logAdminAction({
    adminId: user.id,
    adminEmail: user.email ?? "",
    action: restore ? "application_restored" : "application_soft_deleted",
    target: id,
    details: notifyReason ? { notifyReason } : undefined,
  });

  // Send a removal email if requested and not restoring.
  if (
    !restore &&
    notifyReason &&
    app?.email &&
    process.env.GMAIL_USER &&
    process.env.GMAIL_APP_PASSWORD
  ) {
    const firstName = (app.full_name ?? "there").trim().split(" ")[0];

    const bodyByReason: Record<string, { heading: string; lines: string[] }> = {
      incomplete_profile: {
        heading: "Removed from the program.",
        lines: [
          "We're writing to let you know that your spot in the Elan Innovate Incubator has been removed, since your profile was never completed after multiple reminders.",
          "We understand things come up. If you'd still like to be part of a future cohort, you're welcome to apply again when applications reopen.",
        ],
      },
      no_response: {
        heading: "Removed from the program.",
        lines: [
          "We're writing to let you know that your spot in the Elan Innovate Incubator has been removed, as we weren't able to follow up with you after your acceptance.",
          "If you'd still like to be part of a future cohort, you're welcome to apply again when applications reopen.",
        ],
      },
    };

    const content = bodyByReason[notifyReason] ?? bodyByReason.no_response;

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
        to: app.email,
        subject: "Update on your Elan Innovate Incubator spot",
        text: [
          `Hi ${firstName},`,
          "",
          ...content.lines,
          "",
          "Wishing you the best,",
          "Elan Innovate",
        ].join("\n"),
        html: brandedEmail({
          preheader: "An update on your Elan Innovate Incubator spot",
          heading: content.heading,
          bodyHtml: `
            <p style="margin:0 0 16px 0;">Hi ${escapeHtml(firstName)},</p>
            ${content.lines.map((l) => `<p style="margin:0 0 16px 0;">${escapeHtml(l)}</p>`).join("")}
          `,
        }),
      });
    } catch (e) {
      console.error("Removal email failed:", e);
      // Deletion already succeeded; email failure is non-fatal.
    }
  }

  return NextResponse.json({ ok: true });
}