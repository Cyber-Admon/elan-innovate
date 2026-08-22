"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminResetUpdate() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    // The reset link put a temporary session in place; this updates the password.
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    // Sign out so they re-enter with the new password (and hit the approval gate).
    await supabase.auth.signOut();
    setDone(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,252,0.08) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(255,255,252,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, #000 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, #000 40%, transparent 80%)",
        }}
      />

      <div className="relative w-full max-w-md border-4 border-paper bg-ink p-8 md:p-10">
        <img src="/logo.svg" alt="Elan Innovate" className="mb-8 h-10 w-auto" />

        {done ? (
          <div>
            <p className="mb-3 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper">
              Password updated
            </p>
            <h1 className="mb-4 text-2xl font-black uppercase leading-tight">
              All set.
            </h1>
            <p className="mb-6 text-sm font-medium leading-relaxed text-paper/70">
              Your password has been changed. Sign in with it. If your access was
              previously removed, a super admin will need to reinstate you.
            </p>
            <Link
              href="/admin/login"
              className="inline-block bg-strike px-5 py-3 text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              Go to sign in
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-3 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper">
              New password
            </p>
            <h1 className="mb-4 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
              Set it fresh.
            </h1>
            <p className="mb-8 text-sm font-medium leading-relaxed text-paper/70">
              Choose a new password for your account.
            </p>

            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (min 8 characters)"
                className="w-full border-4 border-paper bg-ink px-4 py-3 text-base font-medium text-paper placeholder:text-paper/40"
              />
              <input
                required
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
                className="w-full border-4 border-paper bg-ink px-4 py-3 text-base font-medium text-paper placeholder:text-paper/40"
              />

              {error && (
                <p className="border-2 border-strike p-3 text-xs font-bold uppercase tracking-wide text-strike">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-strike px-6 py-4 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink disabled:opacity-60"
              >
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}