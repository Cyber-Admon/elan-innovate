import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const VALID_STATUS = [
  "new",
  "internal_review",
  "external_review",
  "accepted",
  "rejected",
];

// Which statuses trigger an applicant email, and the copy for each.
function emailForStatus(status: string, firstName: string) {
  switch (status) {
    case "accepted":
      return {
        subject: "You're in — Elan Innovate Incubator",
        body: [
          `Hi ${firstName},`,
          "",
          "Congratulations. After reviewing your application, we'd like to welcome you into the Elan Innovate Incubator.",
          "",
          "We'll follow up shortly with the next steps, your onboarding details, and how to join the community. We're glad to be building with you.",
          "",
          "Building with Momentum,",
          "Elan Innovate",
        ].join("\n"),
      };
    case "rejected":
      return {
        subject: "Update on your Elan Innovate application",
        body: [
          `Hi ${firstName},`,
          "",
          "Thank you for applying to the Elan Innovate Incubator and for sharing your idea with us.",
          "",
          "After careful review, we won't be moving forward with your application for this cohort. This isn't a judgment on your potential. We had limited spots and many strong applicants, and the decision was genuinely difficult.",
          "",
          "We'd be glad to see you apply again for a future cohort, and you're welcome to join our community in the meantime.",
          "",
          "Wishing you the best,",
          "Elan Innovate",
        ].join("\n"),
      };
    case "external_review":
      return {
        subject: "Next step: interview invite — Elan Innovate",
        body: [
          `Hi ${firstName},`,
          "",
          "Good news. Your application has advanced to the interview stage, where you'll have the chance to present and defend your idea to our team.",
          "",
          "We'll reach out shortly to schedule a time that works for you. Come ready to talk through your idea, the problem you're solving, and where you want to take it.",
          "",
          "Talk soon,",
          "Elan Innovate",
        ].join("\n"),
      };
    default:
      return null;
  }
}

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

  const body = await request.json();
  const { id, status, notes } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const update: { status?: string; notes?: string } = {};
  if (typeof status === "string") {
    if (!VALID_STATUS.includes(status)) {
      return NextResponse.json({ error: "Bad status" }, { status: 400 });
    }
    update.status = status;
  }
  if (typeof notes === "string") {
    update.notes = notes;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Apply the update.
  const { error } = await admin.from("applications").update(update).eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  // If the status change warrants an applicant email, send it.
  // accepted/rejected always email. external_review only emails when the
  // caller explicitly confirmed (body.sendEmail === true).
  let emailed = false;
  if (typeof status === "string") {
    const shouldEmail =
      status === "accepted" ||
      status === "rejected" ||
      (status === "external_review" && body.sendEmail === true);

    if (shouldEmail && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      // Fetch the applicant's email + name.
      const { data: app } = await admin
        .from("applications")
        .select("full_name, email")
        .eq("id", id)
        .maybeSingle();

      if (app?.email) {
        const firstName = (app.full_name ?? "there").trim().split(" ")[0];
        const mail = emailForStatus(status, firstName);
        if (mail) {
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
              subject: mail.subject,
              text: mail.body,
            });
            emailed = true;
          } catch (e) {
            console.error("Status email failed:", e);
            // The status change already saved; email failure is non-fatal.
          }
        }
      }
    }
  }

  return NextResponse.json({ ok: true, emailed });
}