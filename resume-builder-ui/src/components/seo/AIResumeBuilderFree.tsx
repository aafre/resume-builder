/**
 * AI Resume Builder Free Page
 * URL: /ai-resume-builder-free
 * Target keyword: "ai resume builder free"
 */

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

export default function AIResumeBuilderFree() {
  const config = SEO_PAGES.aiResumeBuilder;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {config.steps && <StepByStep steps={config.steps} />}

      {/* Why Use AI */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
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
        </div>
      </RevealSection>

      {/* AI Model Sections */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
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
            <Link to="/blog/chatgpt-resume-prompts" className="text-accent hover:underline font-medium">
              See our ChatGPT resume prompts guide →
            </Link>
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
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Pro tips */}
      <RevealSection variant="fade-up">
        <div className="mb-16 max-w-3xl mx-auto">
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
            ].map((item) => (
              <div key={item.tip} className="bg-accent/[0.06] rounded-xl p-5 border border-accent/10">
                <p className="font-bold text-ink mb-1">{item.tip}</p>
                <p className="text-stone-warm font-extralight">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Build Your AI-Powered Resume for Free"
        description="Combine AI intelligence with professional templates. No payment required."
        primaryText="Start Building"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
