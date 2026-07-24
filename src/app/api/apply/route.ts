import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

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

    // Basic validation: every required field must be a non-empty string
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

    // 1. Store the application in Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: dbError } = await supabase.from("applications").insert({
      track: application.track ?? "incubator",
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
    });

    if (dbError) {
      console.error("Supabase insert failed:", dbError);
      return NextResponse.json(
        { error: "Could not save your application. Please try again." },
        { status: 500 }
      );
    }

    // 2. Send the confirmation email, only if Gmail credentials exist.
    // If they're absent or sending fails, the application is already
    // saved, so we log it and still report success to the applicant.
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
            "What happens next: our team reviews every application, and we'll reach out with next steps as the first cohort takes shape. The program officially runs Q4 2026.",
            "",
            "You don't need to do anything else right now. If you have questions in the meantime, just reply to this email.",
            "",
            "Keep building,",
            "The Elan Innovate Team",
            "Building with Momentum",
          ].join("\n"),
          html: `
            <div style="font-family: Arial, Helvetica, sans-serif; color: #000000; max-width: 560px; margin: 0 auto;">
              <div style="border-bottom: 4px solid #000000; padding: 16px 0;">
                <strong style="font-size: 18px; text-transform: uppercase; letter-spacing: 2px;">Elan Innovate</strong>
              </div>
              <div style="padding: 24px 0;">
                <p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>
                <p style="font-size: 16px; line-height: 1.6;">
                  We've received your application to the <strong>Elan Innovate Incubator</strong>
                  for "<strong>${application.ideaName}</strong>". You're officially in the pipeline.
                </p>
                <p style="font-size: 16px; line-height: 1.6;">
                  <strong>What happens next:</strong> our team reviews every application, and we'll
                  reach out with next steps as the first cohort takes shape. The program officially
                  runs Q4 2026.
                </p>
                <p style="font-size: 16px; line-height: 1.6;">
                  You don't need to do anything else right now. If you have questions in the
                  meantime, just reply to this email.
                </p>
                <p style="font-size: 16px; line-height: 1.6;">
                  Keep building,<br />
                  <strong>The Elan Innovate Team</strong>
                </p>
              </div>
              <div style="border-top: 4px solid #000000; padding: 16px 0;">
                <span style="background: #FF6A00; color: #FFFFFC; padding: 4px 10px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
                  Building with Momentum
                </span>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Confirmation email failed:", emailError);
      }
    } else {
      console.warn(
        "Gmail credentials not set; skipping confirmation email for",
        application.email
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Apply route error:", err);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 500 }
    );
  }
}