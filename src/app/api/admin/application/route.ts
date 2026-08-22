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

type Interview = { date: string; time: string; place: string };

function prettyDateTime(date: string, time: string) {
  // date is YYYY-MM-DD, time is HH:MM (24h). Build a readable line.
  try {
    const dt = new Date(`${date}T${time}`);
    const d = dt.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const t = dt.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${d} at ${t}`;
  } catch {
    return `${date} at ${time}`;
  }
}

function emailForStatus(
  status: string,
  firstName: string,
  interview?: Interview
) {
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
    case "external_review": {
      const when =
        interview && interview.date && interview.time
          ? prettyDateTime(interview.date, interview.time)
          : null;
      const lines = [
        `Hi ${firstName},`,
        "",
        "Good news. Your application has advanced to the interview stage, where you'll present and defend your idea to our team.",
        "",
      ];
      if (when) {
        lines.push(`Your interview is scheduled for: ${when}.`);
        if (interview?.place) {
          lines.push(`Location / link: ${interview.place}.`);
        }
        lines.push("");
        lines.push(
          "Please reply to confirm you can make it. If the time doesn't work, let us know and we'll find another slot."
        );
      } else {
        lines.push(
          "We'll reach out shortly to schedule a time that works for you."
        );
      }
      lines.push("");
      lines.push(
        "Come ready to talk through your idea, the problem you're solving, and where you want to take it."
      );
      lines.push("");
      lines.push("Talk soon,");
      lines.push("Elan Innovate");
      return {
        subject: "Your interview is scheduled — Elan Innovate",
        body: lines.join("\n"),
      };
    }
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
  const { id, status, notes, interview } = body;

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

  const { error } = await admin.from("applications").update(update).eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  let emailed = false;
  if (typeof status === "string") {
    const shouldEmail =
      status === "accepted" ||
      status === "rejected" ||
      (status === "external_review" && body.sendEmail === true);

    if (shouldEmail && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const { data: app } = await admin
        .from("applications")
        .select("full_name, email")
        .eq("id", id)
        .maybeSingle();

      if (app?.email) {
        const firstName = (app.full_name ?? "there").trim().split(" ")[0];
        const mail = emailForStatus(status, firstName, interview as Interview);
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
          }
        }
      }
    }
  }

  return NextResponse.json({ ok: true, emailed });
}