import type { LucideIcon } from "lucide-react";
import { Briefcase, FileText, FolderOpen, LayoutTemplate, ScanSearch } from "lucide-react";

export interface NavLink {
  path: string;
  label: string;
  /** Marks the entry that should carry the saved-resume count badge. */
  countBadge?: boolean;
  /** Tour anchor, kept because tourSteps.ts targets it by id. */
  id?: string;
  /** Mobile menu only: row icon and one-line purpose. */
  icon?: LucideIcon;
  blurb?: string;
}

/**
 * Header navigation.
 *
 * Product destinations render for everyone: most arrivals are cold and lateral,
 * and an anonymous visitor needs to be able to see Templates and Examples
 * before committing to the funnel. Only account-scoped destinations branch on
 * authentication.
 */
/** jobsAvailable: useJobsAvailable() !== false (optimistic while loading). */
export function getNavLinks(isAuthenticated: boolean, jobsAvailable: boolean): NavLink[] {
  return [
    ...(isAuthenticated
      ? [{ path: "/my-resumes", label: "My Resumes", countBadge: true, id: "tour-my-resumes-link", icon: FolderOpen, blurb: "Your saved resumes" }]
      : []),
    { path: "/templates", label: "Templates", icon: LayoutTemplate, blurb: "ATS-friendly designs, free to download" },
    { path: "/examples", label: "Examples", icon: FileText, blurb: "Resumes written for real roles" },
    { path: "/resume-keyword-scanner", label: "ATS Scanner", icon: ScanSearch, blurb: "Check your resume against a job post" },
    ...(jobsAvailable
      ? [{ path: "/jobs", label: "Jobs", icon: Briefcase, blurb: "Openings that match your resume" }]
      : []),
  ];
}
