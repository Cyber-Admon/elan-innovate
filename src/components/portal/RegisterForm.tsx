"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterForm({
  token,
  fullName,
  email,
}: {
  token: string;
  fullName: string;
  email: string;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/portal/callback?token=${token}`,
      },
    });
  }

  async function handleEmailRegister(e: React.FormEvent<HTMLFormElement>) {
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

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError || !data.user) {
      setLoading(false);
      setError(signUpError?.message ?? "Something went wrong. Try again.");
      return;
    }

    const res = await fetch("/api/portal/complete-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, userId: data.user.id, fullName, email }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Account created, but something went wrong finishing setup. Contact us.");
      return;
    }

    window.location.href = "/portal";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 py-10 text-paper">
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

        <p className="mb-3 inline-block bg-strike px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper">
          Welcome, fellow
        </p>
        <h1 className="mb-4 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
          Set up your account.
        </h1>
        <p className="mb-8 text-sm font-medium leading-relaxed text-paper/70">
          Hi {fullName.split(" ")[0]}, create your fellow account to access your
          profile and the community.
        </p>

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={googleLoading}
          className="mb-6 flex w-full items-center justify-center gap-3 border-4 border-paper bg-paper px-6 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-strike hover:text-paper disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
          </svg>
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-paper/20" />
          <span className="text-xs font-bold uppercase tracking-widest text-paper/40">or</span>
          <div className="h-px flex-1 bg-paper/20" />
        </div>

        <form onSubmit={handleEmailRegister} className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest">Email</label>
            <input
              value={email}
              disabled
              className="w-full border-4 border-paper/40 bg-ink px-4 py-3 text-base font-medium text-paper/60"
            />
          </div>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password (min 8 characters)"
            className="w-full border-4 border-paper bg-ink px-4 py-3 text-base font-medium text-paper placeholder:text-paper/40"
          />
          <input
            required
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}