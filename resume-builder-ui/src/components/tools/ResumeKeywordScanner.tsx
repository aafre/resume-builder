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

const NLP_WORDS = ['PARSING', 'TOKENIZING', 'EMBEDDING', 'CALIBRATING'] as const;
const NODE_THRESHOLDS = [0, 17, 33, 50, 67, 83] as const;

function ModelStatusIndicator({
  status,
  progress,
}: {
  status: string;
  progress: number;
  statusText: string;
}) {
  const prevStatusRef = useRef(status);
  const [showCascade, setShowCascade] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  // Rotate NLP words during loading
  useEffect(() => {
    if (status !== 'loading') return;
    const id = setInterval(() => setWordIndex((i) => (i + 1) % NLP_WORDS.length), 2500);
    return () => clearInterval(id);
  }, [status]);

  // Detect loading→ready transition for cascade
  useEffect(() => {
    if (prevStatusRef.current === 'loading' && status === 'ready') {
      setShowCascade(true);
      const timer = setTimeout(() => setShowCascade(false), 600);
      return () => clearTimeout(timer);
    }
    prevStatusRef.current = status;
  }, [status]);

  const litCount = NODE_THRESHOLDS.filter((t) => progress >= t).length;

  // idle
  if (status === 'idle') {
    return (
      <div className="min-h-[32px] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-mist/40" />
        <span className="font-mono text-xs tracking-[0.15em] text-mist uppercase">
          AI Engine
        </span>
      </div>
    );
  }

  // loading
  if (status === 'loading') {
    return (
      <div className="min-h-[32px] flex items-center gap-3">
        <span
          className="w-2 h-2 rounded-full bg-accent"
          style={{ animation: 'ks-breathe 2s ease-in-out infinite' }}
        />
        <span
          key={wordIndex}
          className="font-mono text-xs tracking-[0.15em] text-accent uppercase"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          {NLP_WORDS[wordIndex]}...
        </span>
        <span className="flex items-center gap-0.5">
          {NODE_THRESHOLDS.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i < litCount ? 'bg-accent' : 'bg-mist/30'
              }`}
              style={
                i === litCount - 1 && litCount > 0
                  ? { animation: 'pulse-accent 1.5s ease-in-out infinite' }
                  : undefined
              }
            />
          ))}
        </span>
        {progress > 0 && (
          <span className="font-mono text-[10px] text-mist tabular-nums">
            {progress}%
          </span>
        )}
      </div>
    );
  }

  // ready — cascade then badge
  if (status === 'ready') {
    if (showCascade) {
      return (
        <div className="min-h-[32px] flex items-center gap-2">
          <span className="flex items-center gap-0.5">
            {NODE_THRESHOLDS.map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent"
                style={{
                  animation: `ks-node-lit 0.35s ease-out ${i * 30}ms both`,
                }}
              />
            ))}
          </span>
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase">
            Ready
          </span>
        </div>
      );
    }
    return (
      <div className="min-h-[32px] flex items-center" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <span className="inline-flex items-center gap-1.5 text-xs text-accent font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          AI-Powered
        </span>
      </div>
    );
  }

  // error
  if (status === 'error') {
    return (
      <div className="min-h-[32px] flex items-center">
        <span className="text-xs text-red-500">
          Model failed to load. Click Scan to retry.
        </span>
      </div>
    );
  }

  return <div className="min-h-[32px]" />;
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

  // Viewport-triggered model init
  const scannerSectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scannerSectionRef.current;
    if (!el || modelStatus !== 'idle') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasInitRef.current && modelStatus === 'idle') {
          hasInitRef.current = true;
          initModel();
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
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
        <div ref={scannerSectionRef} className="mb-16">
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

      {/* Step-by-Step Guide to Using the Scanner */}
      <RevealSection variant="fade-up">
        <div className="mb-16 max-w-4xl mx-auto">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            STEP-BY-STEP GUIDE
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            How to Use the Resume Keyword Scanner
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-3xl mx-auto text-center leading-relaxed mb-12">
            Follow these five steps to maximize your keyword match score and give your resume the best chance of passing ATS screening. The entire process takes less than ten minutes and can dramatically improve your callback rate.
          </p>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-black/[0.06]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink mb-3">
                    Paste Your Current Resume Text
                  </h3>
                  <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
                    Open your resume in whatever format you have it &mdash; PDF, Word, Google Docs &mdash; and select all the text. Copy everything, then paste it into the &ldquo;Your Resume Text&rdquo; box on the left. Include every section: your professional summary, work experience, skills, education, and certifications.
                  </p>
                  <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-4">
                    <p className="text-sm text-ink font-medium mb-2">Tips for this step:</p>
                    <ul className="text-sm text-stone-warm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>Don&rsquo;t worry about formatting &mdash; plain text works best for keyword matching.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>Include your <Link to="/blog/how-to-list-skills" className="text-accent hover:underline">skills section</Link> even if it feels repetitive. ATS systems scan the entire document.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>If your resume is in PDF format, open it in a PDF reader and use Ctrl+A (Cmd+A on Mac) to select all text before copying.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-black/[0.06]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink mb-3">
                    Paste the Job Description You&rsquo;re Targeting
                  </h3>
                  <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
                    Go to the job posting and copy the full description. Paste it into the &ldquo;Job Description&rdquo; box on the right. The more complete the description, the better &mdash; include the responsibilities, requirements, qualifications, and any &ldquo;nice to have&rdquo; sections.
                  </p>
                  <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-4">
                    <p className="text-sm text-ink font-medium mb-2">Tips for this step:</p>
                    <ul className="text-sm text-stone-warm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>Copy from the original job posting page, not a summary or shortened version from a job board.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>Include the &ldquo;About Us&rdquo; section &mdash; it often contains industry-specific terms that ATS systems look for.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>Skip the legal boilerplate (equal opportunity statement, etc.) &mdash; it adds noise without useful keywords.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-black/[0.06]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink mb-3">
                    Review Your Keyword Match Score
                  </h3>
                  <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
                    Click &ldquo;Scan Keywords&rdquo; and wait a few seconds for the AI analysis to complete. The scanner uses semantic matching to understand meaning, not just exact text. You&rsquo;ll see your overall match percentage along with three categories: matched keywords (green), partial matches (amber), and missing keywords (red). A score above 70% is strong; below 40% means significant tailoring is needed.
                  </p>
                  <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-4">
                    <p className="text-sm text-ink font-medium mb-2">Tips for this step:</p>
                    <ul className="text-sm text-stone-warm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>Pay close attention to &ldquo;partial matches&rdquo; &mdash; these are the easiest wins because your resume already touches on the concept.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>Click through the Missing and Partial tabs to see context about where the scanner found (or didn&rsquo;t find) each keyword.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-black/[0.06]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center flex-shrink-0 mt-1">
                  4
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink mb-3">
                    Add Missing Keywords Naturally to Your Resume
                  </h3>
                  <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
                    Now comes the critical step. Open your resume and start incorporating the missing keywords. The scanner provides placement suggestions for each term &mdash; use these as a guide. The goal is to integrate keywords in a way that reads naturally to a human recruiter while satisfying ATS requirements. For detailed strategies, see our <Link to="/blog/how-to-use-resume-keywords" className="text-accent hover:underline">complete guide to using resume keywords</Link>.
                  </p>
                  <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-4">
                    <p className="text-sm text-ink font-medium mb-2">Tips for this step:</p>
                    <ul className="text-sm text-stone-warm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>Add technical skills and tools to a dedicated Skills section &mdash; this is the fastest way to boost your score.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>Weave softer keywords (like &ldquo;cross-functional collaboration&rdquo;) into your experience bullet points with specific examples.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>Never add keywords you can&rsquo;t back up in an interview. Authenticity matters more than a perfect score.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>Use an <Link to="/templates/ats-friendly" className="text-accent hover:underline">ATS-friendly template</Link> so your formatting doesn&rsquo;t undermine your keyword optimization.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-black/[0.06]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center flex-shrink-0 mt-1">
                  5
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink mb-3">
                    Re-Scan to Verify Your Improvement
                  </h3>
                  <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
                    After updating your resume, come back and run the scan again. Paste your revised resume text and the same job description to see how your score has improved. Most candidates see a 15&ndash;30 percentage point improvement after their first round of keyword optimization. If you&rsquo;re still below 70%, focus on the remaining missing keywords and repeat. For role-specific keyword lists to check against, browse our <Link to="/resume-keywords" className="text-accent hover:underline">resume keywords hub</Link>.
                  </p>
                  <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-4">
                    <p className="text-sm text-ink font-medium mb-2">Tips for this step:</p>
                    <ul className="text-sm text-stone-warm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>Track your progress &mdash; screenshot your score before and after so you can see the improvement.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>Aim for at least 70%, but don&rsquo;t obsess over reaching 100%. Some keywords may not apply to your background, and that&rsquo;s okay.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Why Keywords Matter for ATS */}
      <RevealSection variant="fade-up">
        <div className="mb-16 max-w-4xl mx-auto">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            UNDERSTANDING ATS
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Why Keywords Matter for ATS
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-3xl mx-auto text-center leading-relaxed mb-12">
            Over 97% of Fortune 500 companies use Applicant Tracking Systems to filter resumes before a human ever sees them. Understanding how these systems work is the first step to beating them.
          </p>

          <div className="space-y-8">
            {/* How ATS Systems Scan */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-black/[0.06]">
              <h3 className="font-display text-xl font-bold text-ink mb-4">
                How ATS Systems Scan for Keywords
              </h3>
              <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
                When you submit a resume through an online application portal, the ATS parses your document into structured data. It extracts your contact information, work history, education, and skills, then compares this data against the job requirements set by the hiring manager. The system assigns a relevancy score based on how many required and preferred qualifications your resume matches.
              </p>
              <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
                Most ATS platforms &mdash; including Workday, Greenhouse, Lever, and iCIMS &mdash; use a combination of keyword matching and section analysis. They look for specific terms in specific contexts. For example, &ldquo;Python&rdquo; in your skills section carries more weight than &ldquo;Python&rdquo; mentioned offhandedly in a project description. This is why a well-structured resume with clear section headings is essential. Our <Link to="/blog/ats-resume-optimization" className="text-accent hover:underline">ATS optimization guide</Link> covers the formatting details.
              </p>
              <p className="text-lg font-extralight text-stone-warm leading-relaxed">
                Resumes that score below the threshold &mdash; typically around 60&ndash;75% match depending on the company &mdash; are automatically filtered out. The recruiter never sees them. That means your resume could be perfect in every other way, but without the right keywords, it disappears into a digital void.
              </p>
            </div>

            {/* Exact Match vs Semantic Match */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-black/[0.06]">
              <h3 className="font-display text-xl font-bold text-ink mb-4">
                Exact Match vs. Semantic Match
              </h3>
              <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
                Traditional ATS systems rely on <strong className="text-ink font-medium">exact match</strong>: the keyword in the job description must appear verbatim in your resume. If the posting asks for &ldquo;project management&rdquo; and your resume says &ldquo;managed projects,&rdquo; a basic ATS might not recognize the connection. This is why mirroring exact phrasing from job descriptions has been standard advice for years.
              </p>
              <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
                <strong className="text-ink font-medium">Semantic matching</strong> is more sophisticated. It understands that &ldquo;managed projects&rdquo; and &ldquo;project management&rdquo; mean essentially the same thing. Newer ATS platforms and AI-powered screening tools increasingly use semantic analysis. Our scanner uses this approach &mdash; powered by the MiniLM AI model running in your browser &mdash; to give you a more realistic picture of how modern hiring systems evaluate your resume.
              </p>
              <p className="text-lg font-extralight text-stone-warm leading-relaxed">
                The safest strategy is to optimize for both. Use the exact phrases from the job description where they fit naturally, but also include related terms and variations. For example, if a job requires &ldquo;data analysis,&rdquo; your resume should contain that exact phrase <em>and</em> related terms like &ldquo;data-driven insights,&rdquo; &ldquo;analytics,&rdquo; or &ldquo;statistical analysis.&rdquo; Check our <Link to="/resume-keywords/software-engineer" className="text-accent hover:underline">software engineer keyword page</Link> for an example of how to map keywords for a specific role.
              </p>
            </div>

            {/* Keyword Density */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-black/[0.06]">
              <h3 className="font-display text-xl font-bold text-ink mb-4">
                Why Keyword Density Matters (But Stuffing Doesn&rsquo;t)
              </h3>
              <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
                Keyword density refers to how frequently a keyword appears relative to your total resume content. A certain level of repetition signals to the ATS that a skill is genuinely central to your experience &mdash; not just mentioned in passing. If &ldquo;project management&rdquo; appears three times across your summary, experience bullets, and skills section, that&rsquo;s a stronger signal than a single mention.
              </p>
              <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
                However, keyword stuffing &mdash; cramming the same term dozens of times or hiding white text filled with keywords &mdash; backfires badly. Modern ATS platforms have anti-spam algorithms that flag unnatural repetition. Worse, even if the ATS lets it through, a human recruiter will immediately reject a resume that reads like a keyword dump. Our <Link to="/blog/resume-keywords-guide" className="text-accent hover:underline">comprehensive keyword guide</Link> walks through the right balance.
              </p>
              <p className="text-lg font-extralight text-stone-warm leading-relaxed">
                The sweet spot is 2&ndash;4 mentions of your most important keywords distributed across different sections, with each mention providing genuine context. Mention &ldquo;project management&rdquo; in your summary, demonstrate it in an experience bullet with a specific achievement, and list it in your skills section. That pattern satisfies both algorithms and human readers.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Related resources */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            RESOURCES
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Related Keyword &amp; ATS Resources
          </h2>
          <p className="text-lg font-extralight text-stone-warm max-w-3xl mx-auto text-center leading-relaxed mb-10">
            Deepen your keyword strategy with these guides, tools, and templates designed to help you pass ATS screening and land interviews.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/resume-keywords"
              className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] hover:-translate-y-0.5"
            >
              <h3 className="font-bold text-ink mb-1">Resume Keywords by Industry</h3>
              <p className="text-stone-warm text-sm">
                Browse curated keyword lists for 26+ job titles across every major industry
              </p>
            </Link>
            <Link
              to="/resume-keywords/software-engineer"
              className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] hover:-translate-y-0.5"
            >
              <h3 className="font-bold text-ink mb-1">Software Engineer Keywords</h3>
              <p className="text-stone-warm text-sm">
                Top ATS keywords for software engineering roles with usage examples
              </p>
            </Link>
            <Link
              to="/blog/resume-keywords-guide"
              className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] hover:-translate-y-0.5"
            >
              <h3 className="font-bold text-ink mb-1">The Complete Keywords Guide</h3>
              <p className="text-stone-warm text-sm">
                Everything you need to know about finding, choosing, and placing resume keywords
              </p>
            </Link>
            <Link
              to="/blog/how-to-use-resume-keywords"
              className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] hover:-translate-y-0.5"
            >
              <h3 className="font-bold text-ink mb-1">How to Use Resume Keywords</h3>
              <p className="text-stone-warm text-sm">
                Step-by-step guide to strategic keyword placement in every resume section
              </p>
            </Link>
            <Link
              to="/blog/ats-resume-optimization"
              className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] hover:-translate-y-0.5"
            >
              <h3 className="font-bold text-ink mb-1">ATS Optimization Guide</h3>
              <p className="text-stone-warm text-sm">
                Formatting and structure tips that help your resume pass automated screening
              </p>
            </Link>
            <Link
              to="/templates/ats-friendly"
              className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] hover:-translate-y-0.5"
            >
              <h3 className="font-bold text-ink mb-1">ATS-Friendly Templates</h3>
              <p className="text-stone-warm text-sm">
                Free resume templates designed from the ground up to pass ATS screening
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
