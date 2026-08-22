"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin/callback`,
      },
    });
    // Browser redirects to Google; no code runs after this.
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
      {/* Grid backdrop */}
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
          Admin access
        </p>
        <h1 className="mb-4 text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
          Control room.
        </h1>
        <p className="mb-8 text-sm font-medium leading-relaxed text-paper/70">
          Sign in with your Google account. New requests are reviewed before
          access is granted.
        </p>

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 border-4 border-paper bg-paper px-6 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-strike hover:text-paper disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
          </svg>
          {loading ? "Redirecting..." : "Continue with Google"}
        </button>
      </div>
    </main>
  );
}