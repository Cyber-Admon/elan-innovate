import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

type TeamMemberInput = {
  name: string;
  email: string;
  phone: string;
  skills: string;
  invitedToIncubator: boolean;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await request.json();
  const {
    phone,
    bio,
    photoUrl,
    ideaName,
    ideaOneLiner,
    ideaProblem,
    vision10yr,
    mission3_5yr,
    goal1yr,
    team,
  } = body;

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Save the main profile fields.
  const { data: fellow, error: fellowError } = await admin
    .from("fellows")
    .update({
      phone,
      bio,
      photo_url: photoUrl,
      idea_name: ideaName,
      idea_one_liner: ideaOneLiner,
      idea_problem: ideaProblem,
      vision_10yr: vision10yr,
      mission_3_5yr: mission3_5yr,
      goal_1yr: goal1yr,
    })
    .eq("id", user.id)
    .select("team_id")
    .single();

  if (fellowError) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  const teamId = fellow.team_id;

  // Replace this fellow's team member rows with the submitted list.
  await admin.from("fellow_team_members").delete().eq("fellow_id", user.id);

  const members = (team as TeamMemberInput[]) ?? [];

  for (const member of members) {
    if (!member.name || !member.email) continue;

    const { data: inserted } = await admin
      .from("fellow_team_members")
      .insert({
        fellow_id: user.id,
        team_id: teamId,
        name: member.name,
        email: member.email,
        phone: member.phone || null,
        skills: member.skills || null,
        invited_to_incubator: member.invitedToIncubator,
        invite_sent: false,
      })
      .select("id")
      .single();

    // Fire an invite email if they're marked for it and haven't gotten one.
    if (
      member.invitedToIncubator &&
      inserted?.id &&
      process.env.GMAIL_USER &&
      process.env.GMAIL_APP_PASSWORD
    ) {
      const { data: invite, error: inviteError } = await admin
        .from("fellow_invites")
        .insert({
          application_id: null,
          full_name: member.name,
          email: member.email,
        })
        .select("token")
        .single();

      if (!inviteError && invite?.token) {
        const link = `https://elan.crelivio.com/portal/register/${invite.token}`;
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_APP_PASSWORD,
            },
          });
          const firstName = member.name.trim().split(" ")[0] || "there";
          await transporter.sendMail({
            from: `"Elan Innovate" <${process.env.GMAIL_USER}>`,
            to: member.email,
            subject: "You're invited — Elan Innovate Incubator",
            text: [
              `Hi ${firstName},`,
              "",
              "You've been added as a team member on an Elan Innovate Incubator fellow's profile, and they'd like you to join as a fellow too.",
              "",
              `Create your fellow account here: ${link}`,
              "",
              "We're glad to be building with you.",
              "",
              "Building with Momentum,",
              "Elan Innovate",
            ].join("\n"),
          });

          await admin
            .from("fellow_team_members")
            .update({ invite_sent: true })
            .eq("id", inserted.id);
        } catch (e) {
          console.error("Team member invite email failed:", e);
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}