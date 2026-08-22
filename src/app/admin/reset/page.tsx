"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/admin/reset/update` }
    );
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
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

        {sent ? (
          <div>
            <p className="mb-3 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper">
              Check your email
            </p>
            <h1 className="mb-4 text-2xl font-black uppercase leading-tight">
              Reset link sent.
            </h1>
            <p className="mb-6 text-sm font-medium leading-relaxed text-paper/70">
              If an account exists for{" "}
              <span className="font-bold text-paper">{email}</span>, a password
              reset link is on its way. Check spam if it doesn&apos;t arrive
              shortly.
            </p>
            <Link
              href="/admin/login"
              className="inline-block border-2 border-paper px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-paper hover:text-ink"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-3 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper">
              Password reset
            </p>
            <h1 className="mb-4 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
              Forgot it?
            </h1>
            <p className="mb-8 text-sm font-medium leading-relaxed text-paper/70">
              Enter your email and we&apos;ll send you a link to set a new
              password.
            </p>

            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
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
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>

            <p className="mt-6 text-sm font-medium text-paper/60">
              Remembered it?{" "}
              <Link href="/admin/login" className="font-bold text-strike hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}