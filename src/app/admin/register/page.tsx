"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminRegister() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/login`,
        data: { full_name: form.fullName },
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
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
              Check your email
            </p>
            <h1 className="mb-4 text-2xl font-black uppercase leading-tight">
              Confirm your address.
            </h1>
            <p className="mb-6 text-sm font-medium leading-relaxed text-paper/70">
              We&apos;ve sent a verification link to{" "}
              <span className="font-bold text-paper">{form.email}</span>. Click it
              to confirm, then a super admin will review your access. Check spam
              if it doesn&apos;t arrive in a minute.
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
              Request access
            </p>
            <h1 className="mb-4 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
              Join the team.
            </h1>
            <p className="mb-8 text-sm font-medium leading-relaxed text-paper/70">
              Register below. You&apos;ll confirm your email, then a super admin
              reviews your request before access is granted.
            </p>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <input
                required
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="Full name"
                className="w-full border-4 border-paper bg-ink px-4 py-3 text-base font-medium text-paper placeholder:text-paper/40"
              />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Email"
                className="w-full border-4 border-paper bg-ink px-4 py-3 text-base font-medium text-paper placeholder:text-paper/40"
              />
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Password (min 8 characters)"
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
                {loading ? "Creating..." : "Register"}
              </button>
            </form>

            <p className="mt-6 text-sm font-medium text-paper/60">
              Already have access?{" "}
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