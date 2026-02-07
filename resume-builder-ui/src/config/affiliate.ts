export const affiliateConfig = {
  resumeReview: {
    enabled: import.meta.env.VITE_AFFILIATE_RESUME_REVIEW_ENABLED === 'true',
    url: import.meta.env.VITE_AFFILIATE_RESUME_REVIEW_URL || '',
    label: 'Get a Free Professional Review',
    description:
      "Expert feedback on your resume's ATS compatibility and impact.",
  },
  // Phase 2: Adzuna job search (dynamic API integration — separate task)
};

export const hasAnyAffiliate = () =>
  affiliateConfig.resumeReview.enabled && !!affiliateConfig.resumeReview.url;
