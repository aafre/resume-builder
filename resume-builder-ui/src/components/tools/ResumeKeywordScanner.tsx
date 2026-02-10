/**
 * ATS Resume Keyword Scanner
 * URL: /resume-keyword-scanner
 * Target keyword: "resume keyword scanner", "ATS keyword checker"
 *
 * Client-side tool: paste resume + job description → match score, matched/missing keywords, placement suggestions
 */

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';
import { scanResume, type ScanResult } from '../../utils/keywordMatcher';

function ScoreRing({ percentage }: { percentage: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color =
    percentage >= 70 ? '#00d47e' : percentage >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r={radius}
          stroke="#e5e5e5" strokeWidth="8" fill="none"
        />
        <circle
          cx="60" cy="60" r={radius}
          stroke={color} strokeWidth="8" fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-ink">{percentage}%</span>
        <span className="text-xs text-stone-warm">match</span>
      </div>
    </div>
  );
}

function KeywordBadge({
  keyword,
  found,
  count,
}: {
  keyword: string;
  found: boolean;
  count: number;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        found
          ? 'bg-accent/10 text-accent border border-accent/20'
          : 'bg-red-50 text-red-600 border border-red-200'
      }`}
    >
      {found ? '✓' : '✗'} {keyword}
      {found && count > 1 && (
        <span className="text-xs opacity-70">×{count}</span>
      )}
    </span>
  );
}

export default function ResumeKeywordScanner() {
  const config = SEO_PAGES.keywordScanner;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
    breadcrumbs: config.breadcrumbs,
  });

  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showMissing, setShowMissing] = useState(true);

  const handleScan = useCallback(() => {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    const scanResult = scanResume(resumeText, jobDescription);
    setResult(scanResult);
  }, [resumeText, jobDescription]);

  const handleClear = useCallback(() => {
    setResumeText('');
    setJobDescription('');
    setResult(null);
  }, []);

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* Scanner Tool */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Resume Input */}
            <div>
              <label
                htmlFor="resume-text"
                className="block font-display text-sm font-bold text-ink mb-2"
              >
                Your Resume Text
              </label>
              <textarea
                id="resume-text"
                className="w-full h-64 rounded-xl border border-black/[0.08] bg-white p-4 text-sm text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 resize-none transition-all"
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <p className="text-xs text-mist mt-1">
                {resumeText.length > 0
                  ? `${resumeText.split(/\s+/).filter(Boolean).length} words`
                  : 'Tip: Copy all text from your resume and paste it here'}
              </p>
            </div>

            {/* Job Description Input */}
            <div>
              <label
                htmlFor="job-description"
                className="block font-display text-sm font-bold text-ink mb-2"
              >
                Job Description
              </label>
              <textarea
                id="job-description"
                className="w-full h-64 rounded-xl border border-black/[0.08] bg-white p-4 text-sm text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 resize-none transition-all"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <p className="text-xs text-mist mt-1">
                {jobDescription.length > 0
                  ? `${jobDescription.split(/\s+/).filter(Boolean).length} words`
                  : 'Tip: Copy the full job posting including requirements'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleScan}
              disabled={!resumeText.trim() || !jobDescription.trim()}
              className="btn-primary px-8 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              Scan Keywords
            </button>
            {(resumeText || jobDescription) && (
              <button onClick={handleClear} className="btn-secondary px-6 py-3.5">
                Clear
              </button>
            )}
          </div>
        </div>
      </RevealSection>

      {/* Results */}
      {result && (
        <RevealSection variant="fade-up">
          <div className="mb-16">
            {/* Score Overview */}
            <div className="bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06] mb-8">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1">
                  <ScoreRing percentage={result.matchPercentage} />
                </div>
                <div className="md:col-span-2">
                  <h2 className="font-display text-2xl font-extrabold text-ink mb-3">
                    {result.matchPercentage >= 70
                      ? 'Strong Match'
                      : result.matchPercentage >= 40
                        ? 'Moderate Match — Room for Improvement'
                        : 'Low Match — Significant Gaps Found'}
                  </h2>
                  <p className="text-stone-warm font-extralight leading-relaxed mb-4">
                    Your resume matches <strong className="text-ink font-medium">{result.matchedCount}</strong> of{' '}
                    <strong className="text-ink font-medium">{result.totalKeywords}</strong> keywords
                    extracted from the job description.
                    {result.missingCount > 0 && (
                      <> You are missing <strong className="text-ink font-medium">{result.missingCount}</strong> keywords
                      that could improve your ATS score.</>
                    )}
                  </p>
                  <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-accent" />
                      <span className="text-stone-warm">{result.matchedCount} matched</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="text-stone-warm">{result.missingCount} missing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyword Tabs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06]">
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setShowMissing(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showMissing
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'text-stone-warm hover:bg-chalk-dark'
                  }`}
                >
                  Missing ({result.missingCount})
                </button>
                <button
                  onClick={() => setShowMissing(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !showMissing
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'text-stone-warm hover:bg-chalk-dark'
                  }`}
                >
                  Matched ({result.matchedCount})
                </button>
              </div>

              {showMissing ? (
                <div>
                  {result.missing.length === 0 ? (
                    <p className="text-stone-warm text-center py-8">
                      No missing keywords — your resume covers all extracted terms.
                    </p>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {result.missing.map((kw) => (
                          <KeywordBadge
                            key={kw.keyword}
                            keyword={kw.keyword}
                            found={false}
                            count={0}
                          />
                        ))}
                      </div>
                      {/* Placement suggestions */}
                      <div className="border-t border-black/[0.06] pt-4">
                        <h3 className="font-display text-sm font-bold text-ink mb-3">
                          Where to Add Missing Keywords
                        </h3>
                        <div className="space-y-2">
                          {result.missing.slice(0, 8).map((kw) => (
                            <div
                              key={kw.keyword}
                              className="flex items-start gap-3 text-sm"
                            >
                              <span className="text-red-500 font-mono shrink-0">
                                {kw.keyword}
                              </span>
                              <span className="text-mist">→</span>
                              <span className="text-stone-warm">
                                {kw.suggestedPlacement}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div>
                  {result.matched.length === 0 ? (
                    <p className="text-stone-warm text-center py-8">
                      No matched keywords yet. Consider tailoring your resume to this job description.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {result.matched.map((kw) => (
                        <KeywordBadge
                          key={kw.keyword}
                          keyword={kw.keyword}
                          found={true}
                          count={kw.count}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </RevealSection>
      )}

      {/* How It Works */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            HOW IT WORKS
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            How the ATS Keyword Scanner Works
          </h2>
          <p className="text-lg font-extralight text-stone-warm max-w-3xl mx-auto text-center leading-relaxed mb-10">
            Applicant Tracking Systems (ATS) filter resumes by scanning for specific keywords from the job description.
            If your resume does not contain enough matching terms, it may never reach a human recruiter — regardless
            of your qualifications.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Paste Your Resume',
                desc: 'Copy all the text from your resume and paste it into the left panel. Include every section — summary, experience, skills, education.',
              },
              {
                step: '2',
                title: 'Paste the Job Description',
                desc: 'Copy the full job posting from the company website. Include the requirements, responsibilities, and qualifications sections.',
              },
              {
                step: '3',
                title: 'Review Your Score',
                desc: 'The scanner extracts key terms from the job description and checks your resume for matches. Aim for 70%+ keyword coverage.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06] text-center"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-lg font-bold text-ink mb-2">
                  {item.title}
                </h3>
                <p className="text-stone-warm font-extralight leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Tips for improving match */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            PRO TIPS
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            How to Improve Your ATS Score
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                title: 'Mirror the Exact Phrasing',
                desc: 'If the job says "project management," use that exact phrase — not "managing projects" or "PM." ATS systems often match exact strings.',
              },
              {
                title: 'Include Both Acronyms and Full Forms',
                desc: 'Write "Search Engine Optimization (SEO)" the first time, then use "SEO" afterward. This catches both search variants.',
              },
              {
                title: 'Add a Dedicated Skills Section',
                desc: 'A skills section near the top of your resume is the easiest place to add missing keywords without restructuring your experience bullets.',
              },
              {
                title: 'Tailor for Every Application',
                desc: 'One-size-fits-all resumes score poorly. Spend 10 minutes customizing keywords for each job posting to dramatically improve your match rate.',
              },
            ].map((tip) => (
              <div
                key={tip.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06] border-l-4 border-l-accent"
              >
                <h3 className="font-display text-lg font-bold text-ink mb-2">
                  {tip.title}
                </h3>
                <p className="text-stone-warm font-extralight leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Related resources */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
            More Keyword Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/resume-keywords"
              className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]"
            >
              <h3 className="font-bold text-ink mb-1">Resume Keywords by Industry</h3>
              <p className="text-stone-warm text-sm">
                Browse curated keyword lists for your target role
              </p>
            </Link>
            <Link
              to="/blog/how-to-use-resume-keywords"
              className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]"
            >
              <h3 className="font-bold text-ink mb-1">How to Use Resume Keywords</h3>
              <p className="text-stone-warm text-sm">
                Complete guide to strategic keyword placement
              </p>
            </Link>
            <Link
              to="/templates/ats-friendly"
              className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]"
            >
              <h3 className="font-bold text-ink mb-1">ATS-Friendly Templates</h3>
              <p className="text-stone-warm text-sm">
                Templates designed to pass ATS screening
              </p>
            </Link>
            <Link
              to="/blog/ats-resume-optimization"
              className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]"
            >
              <h3 className="font-bold text-ink mb-1">ATS Optimization Guide</h3>
              <p className="text-stone-warm text-sm">
                Formatting tips that help your resume pass ATS
              </p>
            </Link>
          </div>
        </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Build an ATS-Optimized Resume"
        description="Use our free templates with built-in ATS optimization. No sign-up, no payment."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
