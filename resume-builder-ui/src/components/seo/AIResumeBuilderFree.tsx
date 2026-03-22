/**
 * AI Resume Builder Free Page
 * URL: /ai-resume-builder-free
 * Target keyword: "ai resume builder free"
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import StepByStep from '../shared/StepByStep';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';
import type { FAQConfig } from '../../types/seo';

const EXTRA_FAQS: FAQConfig[] = [
  {
    question: 'Is AI resume writing safe?',
    answer:
      'Yes, using AI to help write your resume is safe and increasingly standard. The key safety practice is never uploading sensitive personal information (Social Security numbers, financial details) to any AI tool. Stick to sharing your work experience, skills, and the job description. AI tools like ChatGPT, Claude, and Gemini do not store your resume data for use by others. Think of AI as a private writing coach — it helps you phrase things better, but you control what goes in.',
  },
  {
    question: 'Will recruiters know I used AI to write my resume?',
    answer:
      'Recruiters can often detect a fully AI-generated resume because it tends to sound overly polished, uses generic phrases, and lacks specific personal details. However, if you use AI as a starting point and then edit heavily — adding real metrics, personal anecdotes, and company-specific language — the result is indistinguishable from a resume written entirely by hand. The goal is AI-assisted, not AI-replaced.',
  },
  {
    question: 'How do I use AI without sounding generic?',
    answer:
      'The number one rule is to give the AI specific context. Instead of "write a bullet point for a marketing manager," try "write a bullet point about how I increased email open rates from 18% to 34% by A/B testing subject lines at [Company Name]." The more specific your input, the more unique the output. Always replace generic phrases like "results-driven professional" with concrete achievements from your actual experience.',
  },
];

export default function AIResumeBuilderFree() {
  const config = SEO_PAGES.aiResumeBuilder;

  const allFaqs = useMemo(
    () => [...config.faqs, ...EXTRA_FAQS],
    [config.faqs],
  );

  const schemas = usePageSchema({
    type: 'software',
    faqs: allFaqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {config.steps && <StepByStep steps={config.steps} />}

      {/* Why Use AI */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-500">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Why Use AI for Your Resume?
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-10">
            AI does not replace you — it amplifies you. Job seekers who use AI to optimize their resumes report getting
            40-60% more interview callbacks. Here is why AI-assisted resume writing is becoming the standard for competitive job markets.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Beat ATS Systems', desc: 'AI identifies the exact keywords from job descriptions that Applicant Tracking Systems scan for, helping your resume pass automated filters.' },
              { title: 'Write Stronger Bullets', desc: 'Transform vague descriptions into quantified achievements. "Managed projects" becomes "Led 8 cross-functional projects delivering $2.3M in annual savings."' },
              { title: 'Tailor to Each Job', desc: 'AI can quickly customize your resume for each application by matching your experience to the specific requirements in the job posting.' },
              { title: 'Eliminate Writer\'s Block', desc: 'Staring at a blank page is the hardest part. AI gives you a strong first draft you can refine into something authentically yours.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-premium border border-black/[0.06]">
                <h3 className="font-display text-lg font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-stone-warm font-extralight leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-stone-warm font-extralight">
            Want to verify your resume hits the right keywords?{' '}
            <Link to="/resume-keyword-scanner" className="text-accent hover:underline font-medium">
              Try our free ATS Keyword Scanner
            </Link>{' '}
            to check your match rate before applying.
          </p>
        </div>
      </RevealSection>

      {/* AI Model Sections */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-800">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-10 text-center">
            Choose Your AI Writing Partner
          </h2>

          {/* ChatGPT */}
          <div className="mb-8 bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="font-display text-2xl font-bold text-ink">ChatGPT (OpenAI)</h3>
            </div>
            <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
              ChatGPT is the most popular AI for resume writing. GPT-4 excels at generating compelling professional summaries,
              quantified bullet points, and tailored cover letters. Its conversational interface makes iterating on content natural —
              ask it to "make this more specific" or "add metrics" and it refines on the spot.
            </p>
            <p className="text-stone-warm font-extralight mb-4">
              <strong className="text-ink">Best for:</strong> Writing bullet points, professional summaries, cover letters, and tailoring content to specific job descriptions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/blog/chatgpt-resume-prompts" className="text-accent hover:underline font-medium">
                ChatGPT resume prompts guide →
              </Link>
              <Link to="/blog/ai-cover-letter-prompts" className="text-accent hover:underline font-medium">
                AI cover letter prompts →
              </Link>
            </div>
          </div>

          {/* Claude */}
          <div className="mb-8 bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🧠</span>
              <h3 className="font-display text-2xl font-bold text-ink">Claude (Anthropic)</h3>
            </div>
            <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
              Claude is exceptionally strong at analytical tasks — making it ideal for job description analysis and keyword extraction.
              Paste a job posting into Claude and ask it to identify every skill, qualification, and keyword the employer is looking for.
              Then use those keywords to optimize your resume for ATS compatibility.
            </p>
            <p className="text-stone-warm font-extralight mb-4">
              <strong className="text-ink">Best for:</strong> Analyzing job descriptions, extracting ATS keywords, comparing your resume to requirements, and identifying gaps.
            </p>
            <Link to="/blog/claude-resume-prompts" className="text-accent hover:underline font-medium">
              See our Claude resume prompts guide →
            </Link>
          </div>

          {/* Gemini */}
          <div className="mb-8 bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">✨</span>
              <h3 className="font-display text-2xl font-bold text-ink">Gemini (Google)</h3>
            </div>
            <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-4">
              Google Gemini brings real-time web access and deep knowledge of industry trends to resume optimization.
              It can research what specific companies look for in candidates, identify trending skills in your field,
              and suggest keywords based on current job market data — not just static training data.
            </p>
            <p className="text-stone-warm font-extralight mb-4">
              <strong className="text-ink">Best for:</strong> Researching industry-specific keywords, company culture alignment, trending skills, and market-aware optimization.
            </p>
            <Link to="/blog/gemini-resume-prompts" className="text-accent hover:underline font-medium">
              See our Gemini resume prompts guide →
            </Link>
          </div>

          <p className="text-center mt-4 text-stone-warm font-extralight">
            Not sure which AI to start with? Read our{' '}
            <Link to="/blog/ai-resume-writing-guide" className="text-accent hover:underline font-medium">
              complete AI resume writing guide
            </Link>{' '}
            for a side-by-side breakdown.
          </p>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Pro tips */}
      <RevealSection variant="fade-up">
        <div className="mb-16 max-w-3xl mx-auto cv-auto cv-h-500">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
            Pro Tips for AI Resume Writing
          </h2>
          <div className="space-y-4">
            {[
              { tip: 'Always provide context', detail: 'Give the AI your real experience, the job description, and the company name. The more context, the better the output.' },
              { tip: 'Edit everything', detail: 'AI gives you a strong first draft, but always personalize. Hiring managers can detect fully AI-written content.' },
              { tip: 'Use multiple AIs', detail: 'ChatGPT for writing, Claude for analysis, Gemini for research. Each has unique strengths — combine them.' },
              { tip: 'Verify accuracy', detail: 'Never let AI fabricate achievements. Every metric, date, and claim on your resume must be truthful and verifiable.' },
              { tip: 'Tailor per application', detail: 'Do not use one generic AI-generated resume for every job. Customize keywords and emphasis for each application.' },
              { tip: 'Scan before you send', detail: 'After AI helps you write, run your resume through a keyword scanner to confirm it matches the job description.' },
            ].map((item) => (
              <div key={item.tip} className="bg-accent/[0.06] rounded-xl p-5 border border-accent/10">
                <p className="font-bold text-ink mb-1">{item.tip}</p>
                <p className="text-stone-warm font-extralight">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-stone-warm font-extralight">
            Pair AI-written content with an{' '}
            <Link to="/templates/ats-friendly" className="text-accent hover:underline font-medium">
              ATS-friendly template
            </Link>{' '}
            for maximum impact.
          </p>
        </div>
      </RevealSection>

      <FAQSection faqs={allFaqs} />

      {/* Related AI Guides */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-400">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4 text-center">
            Related AI Guides
          </h2>
          <p className="text-lg font-extralight text-stone-warm max-w-3xl mx-auto text-center leading-relaxed mb-10">
            Dive deeper into AI-powered resume writing with our detailed guides for every major AI model.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'ChatGPT Resume Prompts',
                desc: '30+ copy-paste prompts to write bullet points, summaries, and cover letters with ChatGPT.',
                href: '/blog/chatgpt-resume-prompts',
              },
              {
                title: 'Claude Resume Prompts',
                desc: 'Use Claude to analyze job descriptions, extract ATS keywords, and identify resume gaps.',
                href: '/blog/claude-resume-prompts',
              },
              {
                title: 'Gemini Resume Prompts',
                desc: 'Leverage Gemini for industry research, trending skills, and company-specific optimization.',
                href: '/blog/gemini-resume-prompts',
              },
              {
                title: 'AI Resume Writing Guide',
                desc: 'The complete guide to using AI for every stage of resume writing — from first draft to final polish.',
                href: '/blog/ai-resume-writing-guide',
              },
              {
                title: 'AI Cover Letter Prompts',
                desc: 'Generate tailored cover letters in minutes with proven AI prompts for every industry.',
                href: '/blog/ai-cover-letter-prompts',
              },
              {
                title: 'ATS Keyword Scanner',
                desc: 'Scan your resume against any job description to check your keyword match rate instantly.',
                href: '/resume-keyword-scanner',
              },
            ].map((guide) => (
              <Link
                key={guide.href}
                to={guide.href}
                className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300 hover:-translate-y-1 block"
              >
                <h3 className="font-display text-lg font-bold text-ink mb-2">{guide.title}</h3>
                <p className="text-stone-warm font-extralight text-sm leading-relaxed">{guide.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>

      <DownloadCTA
        title="Build Your AI-Powered Resume for Free"
        description="Combine AI intelligence with professional templates. No payment required."
        primaryText="Start Building"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
