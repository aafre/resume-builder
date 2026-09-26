import { Menu, UserRound, X } from "lucide-react";
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
 * The one mobile entry point: menu and account in a single pill, so the
 * avatar is no longer a second, separate menu. Rendered twice — in the header
 * (closed) and in the sheet's own top row (open) — so opening the sheet reads
 * as the header growing, with the glyph turning from ≡ to ×.
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
      className="nav-trigger inline-flex min-h-11 items-center gap-2 rounded-full border border-black/[0.08] bg-white py-1 pl-3 pr-1 text-ink transition-[border-color,box-shadow,transform] duration-200 hover:border-black/15 hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
    >
      <span className="relative h-5 w-5" aria-hidden="true">
        <Menu className="nav-trigger-icon nav-trigger-menu absolute inset-0 h-5 w-5" />
        <X className="nav-trigger-icon nav-trigger-x absolute inset-0 h-5 w-5" />
      </span>
      <span className="relative" aria-hidden="true">
        {account ? (
          <UserAvatar name={account.name} url={account.avatarUrl} size={32} />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-chalk-dark text-ink/60">
            <UserRound className="h-4 w-4" />
          </span>
        )}
        {resumeCount > 0 && (
          <span
            key={resumeCount}
            className="nav-badge-pop absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-white"
          />
        )}
      </span>
    </button>
  );
}
