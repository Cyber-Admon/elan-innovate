import { Link } from "react-router-dom";
import { site } from "../lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" aria-label={`${site.name} home`}>
          <img src="/logo.svg" alt={site.name} className="h-7 w-auto sm:h-8" />
        </Link>
        <Link
          to="/apply"
          className="border-2 border-ink bg-strike px-4 py-2 text-xs font-extrabold uppercase tracking-wide shadow-[3px_3px_0_0_#000] sm:text-sm"
        >
          Apply to the Incubator
        </Link>
      </div>
    </header>
  );
}