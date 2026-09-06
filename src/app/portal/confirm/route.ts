import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const invite = searchParams.get("invite") ?? "";
  return NextResponse.redirect(`${origin}/portal${invite ? `?invite=${invite}` : ""}`);
}