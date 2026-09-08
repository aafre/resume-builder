import { useEffect, useRef, useState, useCallback, useId } from "react";
import ModalShell from "./shared/ModalShell";
import { ClipboardCheck, ExternalLink, ShieldAlert } from "lucide-react";
import { affiliateConfig, hasAnyAffiliate } from "../config/affiliate";
import { ContactInfo, Section } from "../types";
import { extractJobSearchParams, JobSearchParams } from "../utils/resumeDataExtractor";
import { searchJobs, AdzunaJob } from "../services/jobs";
import { formatSalary } from "../utils/currencyFormat";
import { getSalaryFloor } from "../utils/salaryFloor";
import { ensureTrustpilotLoaded } from "../utils/trustpilot";

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
  const titleId = useId();
  const descriptionId = useId();
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  const [jobs, setJobs] = useState<AdzunaJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobSearchParams, setJobSearchParams] = useState<JobSearchParams | null>(null);


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

  // Ref callback to initialize the TrustBox widget when mounted.
  // The Trustpilot bootstrap script is loaded on-demand here (not globally in
  // index.html) so it never burdens the landing page or other routes.
  const trustboxRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    ensureTrustpilotLoaded().then(() => {
      if (window.Trustpilot) window.Trustpilot.loadFromElement(node);
    });
  }, []);

  if (!isOpen) return null;

  const showAffiliate = hasAnyAffiliate();
  const showJobSection = affiliateConfig.jobSearch.enabled && (jobsLoading || jobs.length > 0);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descriptionId}
      initialFocusRef={primaryButtonRef}
      overlayClassName="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-dcm-fade-in"
      panelClassName="bg-white rounded-2xl shadow-premium max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-dcm-modal-enter"
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
              id={titleId}
              className="text-2xl sm:text-3xl font-bold text-center mb-4 text-ink"
            >
              Resume Downloaded Successfully!
            </h2>
            <p
              id={descriptionId}
              className="text-lg text-ink/60 text-center mb-4"
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
              <p className="text-ink/60 text-center mb-6">
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
                <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
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
                    <ClipboardCheck className="w-5 h-5 text-accent-text flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink">
                        {affiliateConfig.resumeReview.label}
                      </p>
                      <p className="text-sm text-ink/60">
                        {affiliateConfig.resumeReview.description}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-ink/60 flex-shrink-0" />
                  </a>
                )}

              {/* Job Listings Section */}
              {showJobSection && (
                <div className="mt-4">
                  {/* Section header */}
                  {jobSearchParams && (
                    <p className="text-xs font-medium text-ink/60 mb-2">
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
                              <p className="text-xs text-ink/60 truncate">
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
                            <ExternalLink className="w-4 h-4 text-ink/60 flex-shrink-0" />
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
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
                One more thing
              </span>
              <div className="flex-1 h-px bg-black/[0.06]" />
            </div>

            <div className="bg-accent/[0.04] border border-accent/10 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-ink mb-1">
                Did we save you from a paywall?
              </p>
              <p className="text-xs text-ink/60 mb-3">
                Most &ldquo;free&rdquo; resume builders charge you at the last step. We didn&apos;t.
                Help other job seekers find us — leave a quick review on Trustpilot.
              </p>
              {/* TrustBox Review Collector widget */}
              <div
                ref={trustboxRef}
                className="trustpilot-widget"
                data-locale="en-US"
                data-template-id="56278e9abfbbba0bdcd568bc"
                data-businessunit-id="6991965ec479215d80d8e4b7"
                data-style-height="52px"
                data-style-width="100%"
                data-token="71af434a-ffb1-44a9-b616-8f3320d34897"
              >
                <a
                  href="https://www.trustpilot.com/review/easyfreeresume.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Trustpilot
                </a>
              </div>
            </div>
          </div>
    </ModalShell>
  );
};

export default DownloadCelebrationModal;
