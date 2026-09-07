import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { createInterviewEvent } from "@/lib/google-calendar";
import { brandedEmail } from "@/lib/email-template";

const VALID_STATUS = [
  "new",
  "internal_review",
  "external_review",
  "accepted",
  "rejected",
];

type Interview = { date: string; time: string; place: string };
type TeamMember = { name: string; email: string };

function prettyDateTime(date: string, time: string) {
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
  interview?: Interview,
  meetLink?: string | null,
  registrationLink?: string | null
) {
  switch (status) {
    case "accepted":
      return {
        subject: "You're in — Elan Innovate Incubator",
        text: [
          `Hi ${firstName},`,
          "",
          "Congratulations. After reviewing your application, we'd like to welcome you into the Elan Innovate Incubator.",
          "",
          registrationLink
            ? `Create your fellow account here: ${registrationLink}`
            : "We'll follow up shortly with your registration link and onboarding details.",
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
            <p style="margin:0 0 16px 0;">Hi ${firstName},</p>
            <p style="margin:0 0 16px 0;">Congratulations. After reviewing your application, we'd like to welcome you into the <strong>Elan Innovate Incubator</strong>.</p>
            <p style="margin:0 0 16px 0;">We're glad to be building with you.</p>
          `,
          ctaText: registrationLink ? "Create Your Fellow Account" : undefined,
          ctaLink: registrationLink ?? undefined,
        }),
      };
    case "rejected":
      return {
        subject: "Update on your Elan Innovate application",
        text: [
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
        html: brandedEmail({
          preheader: "An update on your Elan Innovate application",
          heading: "Application update.",
          bodyHtml: `
            <p style="margin:0 0 16px 0;">Hi ${firstName},</p>
            <p style="margin:0 0 16px 0;">Thank you for applying to the Elan Innovate Incubator and for sharing your idea with us.</p>
            <p style="margin:0 0 16px 0;">After careful review, we won't be moving forward with your application for this cohort. This isn't a judgment on your potential. We had limited spots and many strong applicants, and the decision was genuinely difficult.</p>
            <p style="margin:0 0 16px 0;">We'd be glad to see you apply again for a future cohort, and you're welcome to join our community in the meantime.</p>
          `,
        }),
      };
    case "external_review": {
      const when =
        interview && interview.date && interview.time
          ? prettyDateTime(interview.date, interview.time)
          : null;
      const textLines = [
        `Hi ${firstName},`,
        "",
        "Good news. Your application has advanced to the interview stage, where you'll present and defend your idea to our team.",
        "",
      ];
      let htmlExtra = "";
      if (when) {
        textLines.push(`Your interview is scheduled for: ${when}.`);
        htmlExtra += `<p style="margin:0 0 8px 0;"><strong>Scheduled for:</strong> ${when}</p>`;
        if (meetLink) {
          textLines.push(`Join here: ${meetLink}`);
        } else if (interview?.place) {
          textLines.push(`Location / link: ${interview.place}.`);
          htmlExtra += `<p style="margin:0 0 16px 0;"><strong>Where:</strong> ${interview.place}</p>`;
        }
        textLines.push("");
        textLines.push(
          "Please reply to confirm you can make it. If the time doesn't work, let us know and we'll find another slot."
        );
      } else {
        textLines.push(
          "We'll reach out shortly to schedule a time that works for you."
        );
      }
      textLines.push("");
      textLines.push(
        "Come ready to talk through your idea, the problem you're solving, and where you want to take it."
      );
      textLines.push("");
      textLines.push("Talk soon,");
      textLines.push("Elan Innovate");

      return {
        subject: "Your interview is scheduled — Elan Innovate",
        text: textLines.join("\n"),
        html: brandedEmail({
          preheader: "Your interview details for the Elan Innovate Incubator",
          heading: "Interview scheduled.",
          bodyHtml: `
            <p style="margin:0 0 16px 0;">Hi ${firstName},</p>
            <p style="margin:0 0 16px 0;">Good news. Your application has advanced to the interview stage, where you'll present and defend your idea to our team.</p>
            ${htmlExtra}
            <p style="margin:16px 0 16px 0;">Come ready to talk through your idea, the problem you're solving, and where you want to take it.</p>
          `,
          ctaText: meetLink ? "Join the Meeting" : undefined,
          ctaLink: meetLink ?? undefined,
        }),
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
        .select("full_name, email, idea_name")
        .eq("id", id)
        .maybeSingle();

      if (app?.email) {
        const firstName = (app.full_name ?? "there").trim().split(" ")[0];
        const typedInterview = interview as Interview | undefined;

        let meetLink: string | null = null;
        if (
          status === "external_review" &&
          typedInterview?.date &&
          typedInterview?.time
        ) {
          meetLink = await createInterviewEvent({
            applicantName: app.full_name ?? "Applicant",
            applicantEmail: app.email,
            ideaName: app.idea_name ?? "their idea",
            date: typedInterview.date,
            time: typedInterview.time,
          });
        }

        let registrationLink: string | null = null;
        if (status === "accepted") {
          const { data: fullApp } = await admin
            .from("applications")
            .select("full_name, email, team")
            .eq("id", id)
            .maybeSingle();

          const leadEmail = fullApp?.email ?? app.email;
          const recipients: TeamMember[] = [
            { name: fullApp?.full_name ?? "", email: leadEmail },
            ...((fullApp?.team as TeamMember[] | null) ?? []).map((m) => ({
              name: m.name,
              email: m.email,
            })),
          ];

          for (const person of recipients) {
            if (!person.email) continue;

            const { data: invite, error: inviteError } = await admin
              .from("fellow_invites")
              .insert({
                application_id: id,
                full_name: person.name,
                email: person.email,
              })
              .select("token")
              .single();

            if (inviteError || !invite?.token) {
              console.error("Fellow invite creation failed:", inviteError);
              continue;
            }

            const link = `https://elan.crelivio.com/portal/register/${invite.token}`;

            if (person.email === leadEmail) {
              registrationLink = link;
            } else {
              try {
                const transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD,
                  },
                });
                const teamFirstName = person.name.trim().split(" ")[0] || "there";
                await transporter.sendMail({
                  from: `"Elan Innovate" <${process.env.GMAIL_USER}>`,
                  to: person.email,
                  subject: "You're in — Elan Innovate Incubator",
                  text: [
                    `Hi ${teamFirstName},`,
                    "",
                    `Great news — the team behind "${fullApp?.full_name ?? "your team"}"'s application has been accepted into the Elan Innovate Incubator.`,
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
                      <p style="margin:0 0 16px 0;">Hi ${teamFirstName},</p>
                      <p style="margin:0 0 16px 0;">Great news — the team behind <strong>"${fullApp?.full_name ?? "your team"}"</strong>'s application has been accepted into the Elan Innovate Incubator.</p>
                      <p style="margin:0 0 16px 0;">We're glad to be building with you.</p>
                    `,
                    ctaText: "Create Your Fellow Account",
                    ctaLink: link,
                  }),
                });
              } catch (e) {
                console.error("Team member invite email failed:", e);
              }
            }
          }
        }

        const mail = emailForStatus(status, firstName, typedInterview, meetLink, registrationLink);
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
              text: mail.text,
              html: mail.html,
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