/**
 * ATS Resume Keyword Scanner
 * URL: /resume-keyword-scanner
 * Target keyword: "resume keyword scanner", "ATS keyword checker"
 *
 * AI-powered semantic keyword matching using Transformers.js (MiniLM-L6-v2)
 * running in a Web Worker. Extracts keywords from JD, embeds them, and computes
 * cosine similarity against resume chunks for nuanced matching.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';
import { useSemanticMatcher } from '../../hooks/useSemanticMatcher';
import type { EnhancedKeywordResult, EnhancedScanResult } from '../../types/semanticMatcher';

// --- Sub-components ---

type ResultTab = 'missing' | 'partial' | 'matched';

function ScoreRing({ result }: { result: EnhancedScanResult }) {
  const { matchPercentage, matchedCount, partialCount, totalKeywords } = result;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  const matchedFraction = totalKeywords > 0 ? matchedCount / totalKeywords : 0;
  const partialFraction = totalKeywords > 0 ? partialCount / totalKeywords : 0;

  const matchedArc = matchedFraction * circumference;
  const partialArc = partialFraction * circumference;

  // Animate counter on mount
  const [displayPct, setDisplayPct] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 800;
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayPct(Math.round(eased * matchPercentage));
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [matchPercentage]);

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        {/* Background track */}
        <circle
          cx="60" cy="60" r={radius}
          stroke="currentColor" className="text-gray-100"
          strokeWidth="8" fill="none"
        />
        {/* Matched arc (green) */}
        <circle
          cx="60" cy="60" r={radius}
          stroke="#00d47e" strokeWidth="8" fill="none"
          strokeLinecap="round"
          strokeDasharray={`${matchedArc} ${circumference - matchedArc}`}
          strokeDashoffset={0}
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        {/* Partial arc (amber) */}
        {partialArc > 0 && (
          <circle
            cx="60" cy="60" r={radius}
            stroke="#f59e0b" strokeWidth="8" fill="none"
            strokeLinecap="round"
            strokeDasharray={`${partialArc} ${circumference - partialArc}`}
            strokeDashoffset={-matchedArc}
            style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s' }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-ink tabular-nums">{displayPct}%</span>
        <span className="text-xs text-stone-warm">match</span>
      </div>
    </div>
  );
}

function ModelStatusIndicator({
  status,
  progress,
  statusText,
}: {
  status: string;
  progress: number;
  statusText: string;
}) {
  if (status === 'idle') return null;

  if (status === 'ready') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-accent font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        AI-Powered
      </span>
    );
  }

  if (status === 'loading') {
    return (
      <div className="w-64 space-y-1">
        <span className="text-xs text-mist">
          {statusText || 'Loading AI model...'} {progress > 0 ? `${progress}%` : ''}
        </span>
        <div className="w-full h-1 bg-black/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${Math.max(progress, 2)}%` }}
          />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <span className="text-xs text-red-500">
        Model failed to load. Click Scan to retry.
      </span>
    );
  }

  return null;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl p-8 border border-black/[0.06]">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex justify-center">
            <div className="w-36 h-36 rounded-full bg-gray-100" />
          </div>
          <div className="md:col-span-2 space-y-3">
            <div className="h-7 bg-gray-100 rounded-lg w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="flex gap-6">
              <div className="h-4 bg-gray-100 rounded w-24" />
              <div className="h-4 bg-gray-100 rounded w-24" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-black/[0.06]">
        <div className="flex gap-2 mb-6">
          <div className="h-9 bg-gray-100 rounded-lg w-28" />
          <div className="h-9 bg-gray-100 rounded-lg w-28" />
          <div className="h-9 bg-gray-100 rounded-lg w-28" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded-full" style={{ width: `${60 + Math.random() * 40}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function KeywordBadge({ kw, variant, index }: { kw: EnhancedKeywordResult; variant: ResultTab; index: number }) {
  const styles = {
    matched: 'bg-accent/10 text-accent border-accent/20',
    partial: 'bg-amber-50 text-amber-700 border-amber-200/60',
    missing: 'bg-red-50 text-red-600 border-red-200/60',
  };
  const icons = { matched: '\u2713', partial: '\u2248', missing: '\u2717' };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-300 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards] ${styles[variant]}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <span className="text-xs opacity-70">{icons[variant]}</span>
      {kw.keyword}
      {variant !== 'missing' && kw.similarity > 0 && (
        <span className="text-[11px] opacity-50 tabular-nums">{Math.round(kw.similarity * 100)}%</span>
      )}
    </span>
  );
}

function ContextCard({ kw }: { kw: EnhancedKeywordResult }) {
  if (!kw.bestMatchContext) return null;
  return (
    <div className="bg-chalk rounded-lg p-3 text-xs flex-1 min-w-0">
      <span className="text-mist block mb-1">Closest match in your resume:</span>
      <span className="text-stone-warm italic line-clamp-2">&ldquo;{kw.bestMatchContext}&rdquo;</span>
    </div>
  );
}

function KeywordSection({
  keywords,
  variant,
  showContext,
}: {
  keywords: EnhancedKeywordResult[];
  variant: ResultTab;
  showContext?: boolean;
}) {
  if (keywords.length === 0) {
    const messages: Record<ResultTab, string> = {
      missing: 'No missing keywords \u2014 your resume covers all extracted terms.',
      partial: 'No partial matches \u2014 keywords either matched clearly or are missing.',
      matched: 'No matched keywords yet. Consider tailoring your resume to this job description.',
    };
    return <p className="text-stone-warm text-center py-8 font-extralight">{messages[variant]}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, i) => (
          <KeywordBadge key={kw.keyword} kw={kw} variant={variant} index={i} />
        ))}
      </div>

      {/* Context details for partial/missing */}
      {showContext && (variant === 'partial' || variant === 'missing') && (
        <div className="space-y-3 mt-4 pt-4 border-t border-black/[0.06]">
          {variant === 'partial' && (
            <p className="text-xs text-mist mb-2">
              Your resume mentions related concepts. Consider adding these keywords explicitly.
            </p>
          )}
          {keywords.slice(0, 6).map((kw) => (
            <div key={kw.keyword} className="flex items-start gap-3">
              <span className={`font-mono text-xs shrink-0 mt-0.5 min-w-[80px] ${
                variant === 'missing' ? 'text-red-500' : 'text-amber-600'
              }`}>
                {kw.keyword}
              </span>
              {kw.bestMatchContext ? (
                <ContextCard kw={kw} />
              ) : kw.suggestedPlacement ? (
                <span className="text-xs text-stone-warm">
                  <span className="text-mist mr-1">&rarr;</span> {kw.suggestedPlacement}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Placement suggestions table for missing */}
      {variant === 'missing' && keywords.some(kw => kw.suggestedPlacement) && keywords.length > 6 && (
        <div className="border-t border-black/[0.06] pt-4 mt-4">
          <h3 className="font-display text-sm font-bold text-ink mb-3">
            Where to Add Missing Keywords
          </h3>
          <div className="space-y-2">
            {keywords.filter(kw => kw.suggestedPlacement).slice(6, 14).map((kw) => (
              <div key={kw.keyword} className="flex items-start gap-3 text-sm">
                <span className="text-red-500 font-mono shrink-0 min-w-[80px]">{kw.keyword}</span>
                <span className="text-mist">&rarr;</span>
                <span className="text-stone-warm">{kw.suggestedPlacement}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---

export default function ResumeKeywordScanner() {
  const config = SEO_PAGES.keywordScanner;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
    breadcrumbs: config.breadcrumbs,
  });

  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [activeTab, setActiveTab] = useState<ResultTab>('missing');

  const {
    modelStatus,
    modelProgress,
    modelStatusText,
    isMatching,
    result,
    error,
    initModel,
    runMatch,
    clearResults,
  } = useSemanticMatcher();

  // Lazy model init on first textarea focus
  const hasInitRef = useRef(false);
  const handleTextareaFocus = useCallback(() => {
    if (!hasInitRef.current && modelStatus === 'idle') {
      hasInitRef.current = true;
      initModel();
    }
  }, [modelStatus, initModel]);

  // Idle fallback: start loading after 5s if user hasn't interacted
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (modelStatus === 'idle' && !hasInitRef.current) {
        hasInitRef.current = true;
        initModel();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [modelStatus, initModel]);

  const handleScan = useCallback(() => {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    runMatch(resumeText, jobDescription);
  }, [resumeText, jobDescription, runMatch]);

  const handleClear = useCallback(() => {
    setResumeText('');
    setJobDescription('');
    clearResults();
  }, [clearResults]);

  // Auto-switch to the most relevant tab when results arrive
  useEffect(() => {
    if (result) {
      if (result.missingCount > 0) setActiveTab('missing');
      else if (result.partialCount > 0) setActiveTab('partial');
      else setActiveTab('matched');
    }
  }, [result]);

  const canScan = resumeText.trim().length > 0 && jobDescription.trim().length > 0;
  const showLoading = isMatching && !result;

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* Scanner Tool */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          {/* Privacy trust signal */}
          <div className="flex items-center justify-center gap-2 mb-6 text-xs text-mist">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            100% private &mdash; everything runs locally in your browser. Nothing is sent to a server.
          </div>

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
                className="w-full h-56 md:h-64 rounded-xl border border-black/[0.08] bg-white p-4 text-sm text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 resize-none transition-all"
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                onFocus={handleTextareaFocus}
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
                className="w-full h-56 md:h-64 rounded-xl border border-black/[0.08] bg-white p-4 text-sm text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 resize-none transition-all"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                onFocus={handleTextareaFocus}
              />
              <p className="text-xs text-mist mt-1">
                {jobDescription.length > 0
                  ? `${jobDescription.split(/\s+/).filter(Boolean).length} words`
                  : 'Tip: Copy the full job posting including requirements'}
              </p>
            </div>
          </div>

          {/* Action Buttons + Model Status */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex justify-center gap-4">
              <button
                onClick={handleScan}
                disabled={!canScan || isMatching}
                className="btn-primary px-8 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center gap-2"
              >
                {isMatching ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Scan Keywords'
                )}
              </button>
              {(resumeText || jobDescription) && (
                <button onClick={handleClear} className="btn-secondary px-6 py-3.5">
                  Clear
                </button>
              )}
            </div>
            <ModelStatusIndicator
              status={modelStatus}
              progress={modelProgress}
              statusText={modelStatusText}
            />
          </div>
        </div>
      </RevealSection>

      {/* Error state */}
      {error && !isMatching && (
        <RevealSection variant="fade-up">
          <div className="mb-8 bg-red-50 rounded-2xl p-6 border border-red-200 text-center">
            <p className="text-red-600 text-sm font-medium mb-2">Something went wrong</p>
            <p className="text-red-500 text-xs mb-4">{error}</p>
            <button
              onClick={handleScan}
              disabled={!canScan}
              className="btn-secondary px-6 py-2.5 text-sm"
            >
              Retry
            </button>
          </div>
        </RevealSection>
      )}

      {/* Loading skeleton */}
      {showLoading && (
        <RevealSection variant="fade-up">
          <div className="mb-16">
            <LoadingSkeleton />
          </div>
        </RevealSection>
      )}

      {/* Results */}
      {result && (
        <RevealSection variant="fade-up">
          <div className="mb-16">
            {/* Score Overview */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-premium border border-black/[0.06] mb-8">
              <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-center">
                <div className="md:col-span-1">
                  <ScoreRing result={result} />
                </div>
                <div className="md:col-span-2 text-center md:text-left">
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink mb-3">
                    {result.matchPercentage >= 70
                      ? 'Strong Match'
                      : result.matchPercentage >= 40
                        ? 'Moderate Match \u2014 Room for Improvement'
                        : 'Low Match \u2014 Significant Gaps Found'}
                  </h2>
                  <p className="text-stone-warm font-extralight leading-relaxed mb-4 text-sm sm:text-base">
                    Your resume matches <strong className="text-ink font-medium">{result.matchedCount}</strong> of{' '}
                    <strong className="text-ink font-medium">{result.totalKeywords}</strong> keywords
                    extracted from the job description.
                    {result.partialCount > 0 && (
                      <> <strong className="text-ink font-medium">{result.partialCount}</strong>{' '}
                      {result.partialCount === 1 ? 'keyword is a' : 'keywords are'} partial{' '}
                      {result.partialCount === 1 ? 'match' : 'matches'} that could be strengthened.</>
                    )}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-accent" />
                      <span className="text-stone-warm">{result.matchedCount} matched</span>
                    </div>
                    {result.partialCount > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-400" />
                        <span className="text-stone-warm">{result.partialCount} partial</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="text-stone-warm">{result.missingCount} missing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Three-Tab Keyword Section */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-black/[0.06]">
              <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mb-1 scrollbar-none">
                {([
                  { key: 'missing' as const, label: 'Missing', count: result.missingCount, activeClass: 'bg-red-50 text-red-600 border border-red-200' },
                  { key: 'partial' as const, label: 'Partial', count: result.partialCount, activeClass: 'bg-amber-50 text-amber-600 border border-amber-200' },
                  { key: 'matched' as const, label: 'Matched', count: result.matchedCount, activeClass: 'bg-accent/10 text-accent border border-accent/20' },
                ] as const).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.key
                        ? tab.activeClass
                        : 'text-stone-warm hover:bg-chalk-dark border border-transparent'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {activeTab === 'missing' && (
                <KeywordSection keywords={result.missing} variant="missing" showContext />
              )}
              {activeTab === 'partial' && (
                <KeywordSection keywords={result.partial} variant="partial" showContext />
              )}
              {activeTab === 'matched' && (
                <KeywordSection keywords={result.matched} variant="matched" />
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
            How the AI Keyword Scanner Works
          </h2>
          <p className="text-lg font-extralight text-stone-warm max-w-3xl mx-auto text-center leading-relaxed mb-10">
            Powered by an AI language model running entirely in your browser, our scanner understands
            semantic meaning — not just exact text matches. It catches synonyms, related concepts,
            and technical variations that rule-based scanners miss.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Paste Your Resume',
                desc: 'Copy all the text from your resume and paste it into the left panel. Include every section \u2014 summary, experience, skills, education.',
              },
              {
                step: '2',
                title: 'Paste the Job Description',
                desc: 'Copy the full job posting from the company website. Include the requirements, responsibilities, and qualifications sections.',
              },
              {
                step: '3',
                title: 'Get AI-Powered Results',
                desc: 'The AI extracts key terms and scores each one by semantic similarity. See matched, partial, and missing keywords with context and placement tips.',
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
                desc: 'If the job says "project management," use that exact phrase \u2014 not "managing projects" or "PM." ATS systems often match exact strings.',
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
