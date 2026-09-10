import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { brandedEmail, escapeHtml } from "@/lib/email-template";

const REQUIRED_FIELDS = [
  "fullName",
  "email",
  "phone",
  "ideaName",
  "oneLiner",
  "problem",
  "stage",
  "why",
] as const;

export async function POST(request: Request) {
  try {
    const application = await request.json();

    for (const field of REQUIRED_FIELDS) {
      if (
        typeof application[field] !== "string" ||
        application[field].trim() === ""
      ) {
        return NextResponse.json(
          { error: `Missing or invalid field: ${field}` },
          { status: 400 }
        );
      }
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: inserted, error: dbError } = await supabase
      .from("applications")
      .insert({
        full_name: application.fullName,
        email: application.email,
        phone: application.phone,
        campus: application.campus ?? null,
        idea_name: application.ideaName,
        one_liner: application.oneLiner,
        problem: application.problem,
        stage: application.stage,
        team: application.team ?? null,
        why: application.why,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Supabase insert failed:", dbError);
      return NextResponse.json(
        { error: "Could not submit your application. Please try again." },
        { status: 500 }
      );
    }

    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        const firstName = application.fullName.trim().split(" ")[0];

        await transporter.sendMail({
          from: `"Elan Innovate" <${process.env.GMAIL_USER}>`,
          to: application.email,
          subject: "Application received | Elan Innovate",
          text: [
            `Hi ${firstName},`,
            "",
            `We've received your application to the Elan Innovate Incubator for "${application.ideaName}". You're officially in the pipeline.`,
            "",
            "What happens next: our team reviews every application, and we'll reach out with next steps as the first cohort takes shape.",
            "",
            "You don't need to do anything else right now. If you have questions in the meantime, just reply to this email.",
            "",
            "Keep building,",
            "The Elan Innovate Team",
            "Building with Momentum",
          ].join("\n"),
          html: brandedEmail({
            preheader: "Your Elan Innovate Incubator application has been received",
            heading: "You're in the pipeline.",
            bodyHtml: `
              <p style="margin:0 0 16px 0;">Hi ${escapeHtml(firstName)},</p>
              <p style="margin:0 0 16px 0;">We've received your application to the Elan Innovate Incubator for <strong>"${escapeHtml(application.ideaName)}"</strong>. You're officially in the pipeline.</p>
              <p style="margin:0 0 16px 0;">Our team reviews every application, and we'll reach out with next steps as the cohort takes shape. You don't need to do anything else right now.</p>
              <p style="margin:0 0 16px 0;">Questions in the meantime? Just reply to this email.</p>
            `,
          }),
        });

        await transporter.sendMail({
          from: `"Elan Innovate Website" <${process.env.GMAIL_USER}>`,
          to: process.env.GMAIL_USER,
          replyTo: application.email,
          subject: `New application: ${application.ideaName} — ${application.fullName}`,
          text: [
            "New incubator application from the website:",
            "",
            `Name: ${application.fullName}`,
            `Email: ${application.email}`,
            `Phone: ${application.phone}`,
            application.campus ? `Campus: ${application.campus}` : "",
            `Idea: ${application.ideaName}`,
            `One-liner: ${application.oneLiner}`,
            `Stage: ${application.stage}`,
            "",
            "Problem:",
            application.problem,
            "",
            "Why they want in:",
            application.why,
            "",
            application.team && application.team.length
              ? `Team members: ${application.team.length}`
              : "Solo applicant",
            "",
            "Review it in the admin dashboard.",
          ]
            .filter(Boolean)
            .join("\n"),
        });
      } catch (emailError) {
        console.error("Application email(s) failed:", emailError);
      }
    } else {
      console.warn("Gmail credentials not set; skipping application emails.");
    }

    return NextResponse.json({ ok: true, id: inserted?.id });
  } catch (err) {
    console.error("Apply route error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}