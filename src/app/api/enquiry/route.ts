import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const REQUIRED_FIELDS = [
  "name",
  "email",
  "phone",
  "service",
  "details",
] as const;

export async function POST(request: Request) {
  try {
    const enquiry = await request.json();

    for (const field of REQUIRED_FIELDS) {
      if (
        typeof enquiry[field] !== "string" ||
        enquiry[field].trim() === ""
      ) {
        return NextResponse.json(
          { error: `Missing or invalid field: ${field}` },
          { status: 400 }
        );
      }
    }

    // 1. Store the enquiry in Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: dbError } = await supabase.from("enquiries").insert({
      name: enquiry.name,
      business: enquiry.business ?? null,
      email: enquiry.email,
      phone: enquiry.phone,
      service: enquiry.service,
      details: enquiry.details,
    });

    if (dbError) {
      console.error("Supabase insert failed:", dbError);
      return NextResponse.json(
        { error: "Could not send your enquiry. Please try again." },
        { status: 500 }
      );
    }

    // 2. Email, only if Gmail credentials exist.
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        // Notify the Elan inbox with the full enquiry
        await transporter.sendMail({
          from: `"Elan Innovate Website" <${process.env.GMAIL_USER}>`,
          to: process.env.GMAIL_USER,
          replyTo: enquiry.email,
          subject: `New enquiry: ${enquiry.service} — ${enquiry.name}`,
          text: [
            "New service enquiry from the website:",
            "",
            `Name: ${enquiry.name}`,
            enquiry.business ? `Business: ${enquiry.business}` : "",
            `Email: ${enquiry.email}`,
            `Phone: ${enquiry.phone}`,
            `Service: ${enquiry.service}`,
            "",
            "Details:",
            enquiry.details,
          ]
            .filter(Boolean)
            .join("\n"),
        });

        // Acknowledge the enquirer
        const firstName = enquiry.name.trim().split(" ")[0];
        await transporter.sendMail({
          from: `"Elan Innovate" <${process.env.GMAIL_USER}>`,
          to: enquiry.email,
          subject: "We've got your enquiry | Elan Innovate",
          text: [
            `Hi ${firstName},`,
            "",
            `Thanks for reaching out about ${enquiry.service.toLowerCase()}. We've received your enquiry and will come back to you shortly with a quote and next steps.`,
            "",
            "Need it faster? Reply to this email or message us on WhatsApp.",
            "",
            "Elan Innovate",
            "Building with Momentum",
          ].join("\n"),
        });
      } catch (emailError) {
        console.error("Enquiry email failed:", emailError);
      }
    } else {
      console.warn("Gmail credentials not set; skipping enquiry emails.");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Enquiry route error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}