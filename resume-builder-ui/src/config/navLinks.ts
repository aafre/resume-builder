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
/** jobsAvailable: from useJobsAvailable() — master flag on and the visitor's country is served. */
export function getNavLinks(isAuthenticated: boolean, jobsAvailable: boolean): NavLink[] {
  return [
    ...(isAuthenticated
      ? [{ path: "/my-resumes", label: "My Resumes", countBadge: true, id: "tour-my-resumes-link" }]
      : []),
    { path: "/templates", label: "Templates" },
    { path: "/examples", label: "Examples" },
    { path: "/resume-keyword-scanner", label: "ATS Scanner" },
    ...(jobsAvailable ? [{ path: "/jobs", label: "Jobs" }] : []),
  ];
}
