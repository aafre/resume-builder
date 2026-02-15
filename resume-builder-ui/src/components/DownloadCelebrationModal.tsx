import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ClipboardCheck, ExternalLink, ShieldAlert } from "lucide-react";
import { affiliateConfig, hasAnyAffiliate } from "../config/affiliate";
import { ContactInfo, Section } from "../types";
import { extractJobSearchParams, JobSearchParams } from "../utils/resumeDataExtractor";
import { searchJobs, AdzunaJob } from "../services/jobs";
import { formatSalary } from "../utils/currencyFormat";
import { getSalaryFloor } from "../utils/salaryFloor";

interface DownloadCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
  isAnonymous: boolean;
  contactInfo: ContactInfo | null;
  sections: Section[];
}

const DownloadCelebrationModal: React.FC<DownloadCelebrationModalProps> = ({
  isOpen,
  onClose,
  onSignUp,
  isAnonymous,
  contactInfo,
  sections,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  const [jobs, setJobs] = useState<AdzunaJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobSearchParams, setJobSearchParams] = useState<JobSearchParams | null>(null);

  // Focus management - auto-focus primary button when modal opens
  useEffect(() => {
    if (isOpen && primaryButtonRef.current) {
      primaryButtonRef.current.focus();
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Focus trap - keep focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleTab);
    return () => modal.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  // Fetch jobs when modal opens
  useEffect(() => {
    if (!isOpen || !affiliateConfig.jobSearch.enabled) return;

    const params = extractJobSearchParams(contactInfo, sections);
    if (!params) return;

    setJobSearchParams(params);
    setJobsLoading(true);
    searchJobs({
      query: params.query,
      location: params.location,
      country: params.country,
      category: params.category,
      skills: params.skills,
      titleOnly: true,
      maxDaysOld: 30,
      salaryMin: getSalaryFloor(params.country, params.seniorityLevel),
    })
      .then((result) => setJobs(result.jobs))
      .catch(() => {
        // Silently fail — hide section on error
      })
      .finally(() => setJobsLoading(false));
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const showAffiliate = hasAnyAffiliate();
  const showJobSection = affiliateConfig.jobSearch.enabled && (jobsLoading || jobs.length > 0);

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm animate-dcm-fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="celebration-modal-title"
          aria-describedby="celebration-modal-description"
          className="bg-white rounded-2xl shadow-premium max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-dcm-modal-enter"
        >
          {/* Celebration Icon */}
          <div className="w-20 h-20 mx-auto mb-6 relative">
            {/* Main checkmark circle with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center animate-dcm-scale-in shadow-lg">
              {/* Checkmark SVG */}
              <svg
                className="w-12 h-12 text-white animate-dcm-checkmark-draw"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline
                  points="20 6 9 17 4 12"
                  style={{
                    strokeDasharray: "24",
                    strokeDashoffset: "0",
                  }}
                />
              </svg>
            </div>

            {/* Pulsing ring effect - runs once */}
            <div className="absolute inset-0 bg-green-400 rounded-full animate-dcm-ping-once opacity-20" />

            {/* Celebration particles */}
            <div className="dcm-particle dcm-particle-1" />
            <div className="dcm-particle dcm-particle-2" />
            <div className="dcm-particle dcm-particle-3" />
            <div className="dcm-particle dcm-particle-4" />
          </div>

          {/* Title + Subtitle */}
          <div className="animate-dcm-content-fade-up" style={{ animationDelay: '75ms' }}>
            <h2
              id="celebration-modal-title"
              className="text-2xl sm:text-3xl font-bold text-center mb-4 text-ink"
            >
              Resume Downloaded Successfully!
            </h2>
            <p
              id="celebration-modal-description"
              className="text-lg text-stone-warm text-center mb-4"
            >
              Your PDF has been saved to your device.
            </p>
          </div>

          {/* Anonymous-only: Warning + Sign-up CTA */}
          {isAnonymous && (
            <div className="animate-dcm-content-fade-up" style={{ animationDelay: '150ms' }}>
              {/* Warning Box */}
              <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-4 mb-4">
                <p className="text-sm text-amber-800 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="font-semibold">Warning:</span> Since you are a
                    guest, this resume is only saved in your browser&apos;s temporary
                    cache. If you clear your cache, you will lose this data.
                  </span>
                </p>
              </div>

              {/* Value Proposition */}
              <p className="text-stone-warm text-center mb-6">
                Create a free account to save this version securely to the cloud and
                edit it anytime.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="btn-secondary px-8 py-3.5"
                >
                  No thanks, I&apos;ll risk it
                </button>
                <button
                  ref={primaryButtonRef}
                  onClick={onSignUp}
                  className="btn-primary px-8 py-3.5"
                >
                  Save to Cloud (Free)
                </button>
              </div>
            </div>
          )}

          {/* Authenticated users: Close button */}
          {!isAnonymous && !showAffiliate && (
            <div className="animate-dcm-content-fade-up flex justify-center" style={{ animationDelay: '150ms' }}>
              <button
                ref={primaryButtonRef}
                onClick={onClose}
                className="btn-secondary px-8 py-3.5"
              >
                Close
              </button>
            </div>
          )}

          {/* Affiliate "What's Next?" Section */}
          {showAffiliate && (
            <div className="mt-6 animate-dcm-content-fade-up" style={{ animationDelay: '225ms' }}>
              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-black/[0.06]" />
                <span className="text-xs font-semibold text-mist uppercase tracking-wider">
                  What&apos;s Next?
                </span>
                <div className="flex-1 h-px bg-black/[0.06]" />
              </div>

              {/* Resume Review Card */}
              {affiliateConfig.resumeReview.enabled &&
                affiliateConfig.resumeReview.url && (
                  <a
                    href={affiliateConfig.resumeReview.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center gap-4 bg-chalk-dark border border-black/[0.06] rounded-xl p-4 cursor-pointer hover:bg-white hover:shadow-lg hover:border-accent/20 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <ClipboardCheck className="w-5 h-5 text-accent flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink">
                        {affiliateConfig.resumeReview.label}
                      </p>
                      <p className="text-sm text-stone-warm">
                        {affiliateConfig.resumeReview.description}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-mist flex-shrink-0" />
                  </a>
                )}

              {/* Job Listings Section */}
              {showJobSection && (
                <div className="mt-4">
                  {/* Section header */}
                  {jobSearchParams && (
                    <p className="text-xs font-medium text-stone-warm mb-2">
                      Jobs matching &ldquo;{jobSearchParams.displayTitle}&rdquo;
                      {jobSearchParams.location && ` near ${jobSearchParams.location}`}
                    </p>
                  )}

                  {/* Loading skeleton */}
                  {jobsLoading && (
                    <div className="space-y-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="bg-chalk-dark border border-black/[0.06] rounded-xl p-3 animate-pulse"
                        >
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Job cards */}
                  {!jobsLoading && jobs.length > 0 && (
                    <div className="space-y-2">
                      {jobs.map((job, i) => {
                        const salary = formatSalary(job.salary_min, job.salary_max, jobSearchParams?.country);
                        return (
                          <a
                            key={i}
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="flex items-center gap-3 bg-chalk-dark border border-black/[0.06] rounded-xl p-3 cursor-pointer hover:bg-white hover:shadow-lg hover:border-accent/20 hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-ink truncate">
                                {job.title}
                              </p>
                              <p className="text-xs text-stone-warm truncate">
                                {[job.company, job.location]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                              {salary && (
                                <p className={`text-xs font-medium mt-0.5 ${
                                  job.salary_is_predicted ? 'text-amber-600' : 'text-emerald-600'
                                }`}>
                                  {salary}{job.salary_is_predicted ? ' (est.)' : ''}
                                </p>
                              )}
                            </div>
                            <ExternalLink className="w-4 h-4 text-mist flex-shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Close button for authenticated users when affiliate is shown */}
              {!isAnonymous && (
                <div className="flex justify-center mt-4">
                  <button
                    ref={!isAnonymous ? primaryButtonRef : undefined}
                    onClick={onClose}
                    className="btn-secondary px-8 py-3.5"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Trustpilot Review Prompt */}
          <div className="mt-6 animate-dcm-content-fade-up" style={{ animationDelay: '225ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-black/[0.06]" />
              <span className="text-xs font-semibold text-mist uppercase tracking-wider">
                One more thing
              </span>
              <div className="flex-1 h-px bg-black/[0.06]" />
            </div>

            <div className="bg-accent/[0.04] border border-accent/10 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-ink mb-1">
                Did we save you from a paywall? 🎉
              </p>
              <p className="text-xs text-stone-warm mb-3">
                Most &ldquo;free&rdquo; resume builders charge you at the last step. We didn&apos;t.
                Help other job seekers find us — leave a quick review on Trustpilot.
              </p>
              <a
                href="https://www.trustpilot.com/evaluate/easyfreeresume.com?utm_source=modal_download"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-accent/20 transition-all duration-200"
              >
                ⭐ Leave a Review
              </a>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default DownloadCelebrationModal;
