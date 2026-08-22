import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminMe = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  status: string;
};

// Verifies the visitor is logged in and an approved admin.
// Redirects to login if not signed in. Returns the admin row otherwise
// (including pending/declined, so the caller can show the right screen).
export async function requireAdmin(): Promise<AdminMe> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: me } = await supabase
    .from("admin_users")
    .select("id, email, full_name, role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (!me) {
    // No row yet: treat as pending shell so layout can show the queue screen.
    return {
      id: user.id,
      email: user.email ?? "",
      full_name: null,
      role: "admin",
      status: "pending",
    };
  }

  return me as AdminMe;
}