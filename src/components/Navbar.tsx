"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/about#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative border-b-4 border-ink">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link href="/" aria-label="Elan Innovate home" onClick={() => setOpen(false)}>
          <img src="/logo.svg" alt="Elan Innovate" className="h-9 w-auto md:h-11" />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-bold uppercase tracking-wide hover:text-strike"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop apply + mobile hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="/apply"
            className="bg-strike px-4 py-2 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink md:px-6 md:py-3"
          >
            Apply<span className="hidden sm:inline"> to the Incubator</span>
          </Link>

          {/* Hamburger, mobile only */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center border-4 border-ink md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-ink" strokeWidth="2.5" aria-hidden="true">
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
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t-4 border-ink md:hidden">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block border-b-2 border-ink/10 px-4 py-4 text-sm font-bold uppercase tracking-wide hover:bg-strike hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}