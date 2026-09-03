import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { fullName, email } = await request.json();

    if (!fullName || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("cohort_interest")
      .insert({ full_name: fullName, email });

    if (error) {
      console.error("Cohort interest insert failed:", error);
      return NextResponse.json({ error: "Could not save" }, { status: 500 });
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
        const firstName = fullName.trim().split(" ")[0];
        await transporter.sendMail({
          from: `"Elan Innovate" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: "You're on the list — Elan Innovate",
          text: [
            `Hi ${firstName},`,
            "",
            "Thanks for your interest in Elan Innovate's incubator. Applications for the current cohort are closed, but we've added you to the list and will email you the moment the next cohort opens.",
            "",
            "In the meantime, follow us for updates and community events.",
            "",
            "Building with Momentum,",
            "Elan Innovate",
          ].join("\n"),
        });
      } catch (e) {
        console.error("Cohort interest email failed:", e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Cohort interest route error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}