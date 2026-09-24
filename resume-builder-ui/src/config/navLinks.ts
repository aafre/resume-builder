import { affiliateConfig } from "./affiliate";

export interface NavLink {
  path: string;
  label: string;
  /** Marks the entry that should carry the saved-resume count badge. */
  countBadge?: boolean;
  /** Tour anchor, kept because tourSteps.ts targets it by id. */
  id?: string;
}

/**
 * Header navigation.
 *
 * Product destinations render for everyone: most arrivals are cold and lateral,
 * and an anonymous visitor needs to be able to see Templates and Examples
 * before committing to the funnel. Only account-scoped destinations branch on
 * authentication.
 */
export function getNavLinks(isAuthenticated: boolean): NavLink[] {
  return [
    ...(isAuthenticated
      ? [{ path: "/my-resumes", label: "My Resumes", countBadge: true, id: "tour-my-resumes-link" }]
      : []),
    { path: "/templates", label: "Templates" },
    { path: "/examples", label: "Examples" },
    { path: "/resume-keyword-scanner", label: "ATS Scanner" },
    ...(isAuthenticated && affiliateConfig.jobSearch.enabled
      ? [{ path: "/jobs", label: "Jobs" }]
      : []),
  ];
}
