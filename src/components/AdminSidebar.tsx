"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Applications", href: "/admin/applications" },
  { label: "Enquiries", href: "/admin/enquiries" },
  { label: "Appointments", href: "/admin/appointments" },
  { label: "Metrics", href: "/admin/metrics" },
];

export default function AdminSidebar({
  role,
  email,
}: {
  role: string;
  email: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const allLinks =
    role === "superadmin"
      ? [
          ...links,
          { label: "Admins", href: "/admin/admins" },
          { label: "Settings", href: "/admin/settings" },
        ]
      : links;

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b-4 border-ink bg-ink px-4 py-3 text-paper md:hidden">
        <span className="text-sm font-black uppercase tracking-widest">
          Elan Admin
        </span>
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center border-2 border-paper"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-paper" strokeWidth="2.5" aria-hidden="true">
            {open ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          open ? "block" : "hidden"
        } border-b-4 border-ink bg-ink text-paper md:sticky md:top-0 md:block md:h-screen md:w-64 md:border-b-0 md:border-r-4`}
      >
        <div className="flex h-full flex-col p-5">
          <div className="mb-8 hidden md:block">
            <span className="text-lg font-black uppercase leading-none tracking-tight">
              Elan Admin
            </span>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-strike">
              {role === "superadmin" ? "Super Admin" : "Admin"}
            </p>
          </div>

          <nav className="flex flex-col gap-1">
            {allLinks.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                    active
                      ? "bg-strike text-paper"
                      : "text-paper/70 hover:bg-paper/10 hover:text-paper"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6">
            <p className="mb-3 truncate text-xs font-medium text-paper/50">
              {email}
            </p>
            <button
              type="button"
              onClick={signOut}
              className="w-full border-2 border-paper px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-paper hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}