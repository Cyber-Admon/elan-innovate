import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function logAdminAction({
  adminId,
  adminEmail,
  action,
  target,
  details,
}: {
  adminId: string;
  adminEmail: string;
  action: string;
  target?: string;
  details?: Record<string, unknown>;
}) {
  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await admin.from("admin_audit_log").insert({
    admin_id: adminId,
    admin_email: adminEmail,
    action,
    target: target ?? null,
    details: details ?? null,
  });
}