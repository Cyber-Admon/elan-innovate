import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/portal/login", request.url));
  }

  const formData = await request.formData();
  const phone = formData.get("phone") as string;
  const bio = formData.get("bio") as string;

  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await admin.from("fellows").update({ phone, bio }).eq("id", user.id);

  return NextResponse.redirect(new URL("/portal/profile", request.url));
}