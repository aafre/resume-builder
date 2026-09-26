import { Menu, X } from "lucide-react";
import UserAvatar from "./UserAvatar";

export interface NavAccount {
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
}

interface NavMenuTriggerProps {
  open: boolean;
  account: NavAccount | null;
  resumeCount: number;
  onClick: () => void;
}

/**
 * The one mobile entry point for navigation and account. Says what it is —
 * MENU / CLOSE in the label face — with the signed-in avatar standing in for
 * the word. Rendered twice, in the header (closed) and in the sheet's own top
 * row (open), so opening reads as the header growing with ≡ turning to ×.
 */
export default function NavMenuTrigger({ open, account, resumeCount, onClick }: NavMenuTriggerProps) {
  const saved = resumeCount > 0 ? `, ${resumeCount} saved resume${resumeCount === 1 ? "" : "s"}` : "";

  return (
    <button
      type="button"
      onClick={onClick}
      data-open={open}
      aria-label={open ? "Close menu" : `Open menu${saved}`}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls="global-nav-drawer"
      className="nav-trigger relative -mr-2 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-2 text-ink transition-colors duration-200 hover:bg-black/5 active:bg-black/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
    >
      {account && !open ? (
        <UserAvatar name={account.name} url={account.avatarUrl} size={28} />
      ) : (
        <span className="font-mono text-[11px] uppercase tracking-[0.15em]" aria-hidden="true">
          {open ? "Close" : "Menu"}
        </span>
      )}
      <span className="relative h-5 w-5" aria-hidden="true">
        <Menu className="nav-trigger-icon nav-trigger-menu absolute inset-0 h-5 w-5" />
        <X className="nav-trigger-icon nav-trigger-x absolute inset-0 h-5 w-5" />
      </span>
      {resumeCount > 0 && !open && (
        <span
          key={resumeCount}
          className="nav-badge-pop absolute right-1 top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-white"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
