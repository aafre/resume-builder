/**
 * Templates Hub Page
 * URL: /ats-resume-templates
 * Target keyword: "ats friendly resume templates"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import Band from '../shared/Band';
import AtsParseDemo from '../shared/AtsParseDemo';
import { InContentAd, AD_CONFIG } from '../ads';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

const ATS_RULES = [
  {
    term: 'Standard fonts',
    body: 'like Arial, Calibri, or Times New Roman — decorative fonts get misread',
  },
  {
    term: 'Clear section headers',
    body: '(Experience, Education, Skills) — non-standard headers like "My Journey" get ignored',
  },
  {
    term: 'Simple formatting',
    body: 'without complex tables, text boxes, or graphics — these create parsing errors',
  },
  {
    term: 'Standard bullet points',
    body: '— avoid special characters, arrows, or custom symbols',
  },
  {
    term: 'Consistent date formats',
    body: '(e.g., "Jan 2024 - Present") — inconsistent dates confuse parsers',
  },
];

const ATS_SYSTEMS = [
  { name: 'Workday', note: 'Fortune 500 standard' },
  { name: 'Taleo (Oracle)', note: 'Enterprise & government' },
  { name: 'iCIMS', note: 'Large employers' },
  { name: 'Greenhouse', note: 'Tech & startups' },
  { name: 'Lever', note: 'Mid-size tech' },
  { name: 'BambooHR', note: 'Small to mid-size' },
];

const MISTAKES = [
  {
    title: 'Using headers and footers for contact info',
    body: 'Many ATS systems cannot read content in headers/footers. Put your name, email, and phone in the main body of the document.',
  },
  {
    title: 'Saving from Canva or design tools',
    body: 'PDFs exported from graphic design tools often contain images of text rather than actual text. The ATS sees a blank page. Always use a proper resume builder or word processor.',
  },
  {
    title: 'Creative section titles',
    body: '"Where I’ve Been" instead of "Experience" or "What I Know" instead of "Skills" — the ATS won’t recognize these. Stick to standard section names.',
  },
  {
    title: 'Using text boxes or columns',
    body: 'Text boxes and multi-column layouts created in Word can cause content to be read out of order or skipped entirely. Use a single-column layout for maximum compatibility.',
  },
];

const RESOURCES = [
  {
    to: '/blog/ats-resume-optimization',
    title: 'ATS Resume Optimization Guide',
    note: 'Beat the bots and land interviews',
  },
  {
    to: '/blog/how-to-use-resume-keywords',
    title: 'How to Use Resume Keywords',
    note: 'The ultimate keyword optimization guide',
  },
  {
    to: '/resume-keyword-scanner',
    title: 'Free ATS Keyword Scanner',
    note: 'Check your resume against any job description',
  },
  {
    to: '/blog/resume-mistakes-to-avoid',
    title: '10 Resume Mistakes to Avoid',
    note: 'Critical errors that kill your chances',
  },
];

export default function TemplatesHub() {
  const config = SEO_PAGES.templatesHub;
  const schemas = usePageSchema({
    type: 'itemList',
    items: [
      {
        name: 'ATS-Friendly Resume Template',
        url: '/templates/ats-friendly',
        description: 'Professional template optimized for Applicant Tracking Systems',
      },
    ],
    faqs: config.faqs,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'ATS Resume Templates', href: '/ats-resume-templates' },
    ],
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* In-content Ad - Below hero */}
      <InContentAd adSlot={AD_CONFIG.slots.templatesIncontent} marginY={32} />

      {/* Not reveal-wrapped: on desktop the intro <p> below is the LCP element.
          RevealSection starts children at opacity:0 until hydration adds
          .revealed (IntersectionObserver), which stalled desktop LCP at ~4.7s.
          Rendering it plainly lets it paint from the prerendered HTML. */}
      <div className="mb-16 cv-auto cv-h-500">
        <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
          The five rules
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
          What makes a resume ATS-friendly
        </h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg md:text-xl font-extralight text-ink/60 mb-10 leading-relaxed">
            Applicant Tracking Systems (ATS) scan resumes for specific formatting and content.
            Over 75% of large employers use ATS software like Workday, Taleo, iCIMS, and Greenhouse
            to filter applications before a human recruiter ever sees them.
            An ATS-friendly template uses:
          </p>
          {/* Numbered as a filed list rather than a card stack: the numeral is
              the mono label the system already uses for position in a
              sequence, and the hairline carries the grouping a border-left
              was doing. */}
          <ol className="border-t border-ink/10">
            {ATS_RULES.map((rule, i) => (
              <li
                key={rule.term}
                className="flex items-baseline gap-5 py-5 border-b border-ink/10"
              >
                <span className="font-mono text-xs text-accent-text tabular-nums flex-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-extralight text-ink/60 leading-relaxed">
                  <strong className="font-bold text-ink">{rule.term}</strong> {rule.body}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {config.features && <FeatureGrid features={config.features} />}

      {/* The page's one authored moment: the parse itself, on ink. */}
      <AtsParseDemo />

      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-600">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            Ready to use
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            Free ATS-friendly templates
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/templates/ats-friendly"
              className="group bg-white rounded-2xl p-6 card-gradient-border spot-card shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[8.5/11] rounded-xl mb-4 overflow-clip border border-black/[0.06]">
                <img
                  src="/docs/templates/modern-no-icons.png"
                  alt="ATS-friendly resume template preview"
                  className="w-full h-full object-contain bg-chalk-dark p-2"
                  width={400}
                  height={566}
                  loading="lazy"
                />
              </div>
              <h3 className="font-display text-lg font-bold text-ink mb-2">
                Professional ATS Template
              </h3>
              <p className="text-ink/60 text-sm mb-3">
                Clean, modern design that passes all ATS systems. Perfect for any industry.
              </p>
              <div className="text-accent-text font-semibold text-sm">
                View Template <span aria-hidden="true">&rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* Which ATS Systems.
          Six one-word names do not each need a lifted white card — that is six
          claims of importance for a list of vendors. They read as a filed
          index instead: hairline grid, tonal ground, no shadow. */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-400">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            Coverage
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Tested on the ATS systems employers actually use
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl font-extralight text-ink/60 text-center leading-relaxed mb-12 md:mb-16">
              Different companies use different ATS platforms. Our templates are tested against the most common ones to ensure your resume parses correctly regardless of which system the employer uses.
            </p>
            <ul className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 border border-ink/10 rounded-2xl overflow-clip">
              {ATS_SYSTEMS.map((sys) => (
                <li key={sys.name} className="bg-chalk px-5 py-6 text-center">
                  <div className="font-display font-bold text-ink text-lg">{sys.name}</div>
                  <p className="text-ink/60 text-xs mt-1">{sys.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </RevealSection>

      {/* How to Use ATS Templates */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-500">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            In practice
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            How to use an ATS template effectively
          </h2>
          <ol className="max-w-4xl mx-auto space-y-10">
            <li className="grid grid-cols-[auto_1fr] gap-5 sm:gap-8">
              <span className="font-mono text-sm text-accent-text tabular-nums pt-1">01</span>
              <div>
                <h3 className="font-display text-lg font-bold text-ink mb-2">Match keywords from the job description</h3>
                <p className="text-ink/60 font-extralight leading-relaxed">
                  ATS systems rank resumes by keyword match. Read the job posting, identify required
                  skills and qualifications, and mirror that exact language in your resume. Use our{' '}
                  <Link to="/resume-keyword-scanner" className="text-accent-text font-medium underline underline-offset-4 decoration-accent-text/30 hover:decoration-accent-text">free ATS keyword scanner</Link> to
                  check your match rate before applying.
                </p>
              </div>
            </li>
            <li className="grid grid-cols-[auto_1fr] gap-5 sm:gap-8">
              <span className="font-mono text-sm text-accent-text tabular-nums pt-1">02</span>
              <div>
                <h3 className="font-display text-lg font-bold text-ink mb-2">Use both acronyms and full terms</h3>
                <p className="text-ink/60 font-extralight leading-relaxed">
                  Write "Search Engine Optimization (SEO)" or "Amazon Web Services (AWS)" the first time you mention
                  a term. Some ATS systems search for the acronym, others for the full phrase. Including both ensures
                  you're matched. See our{' '}
                  <Link to="/blog/how-to-use-resume-keywords" className="text-accent-text font-medium underline underline-offset-4 decoration-accent-text/30 hover:decoration-accent-text">keyword optimization guide</Link> for
                  more tips.
                </p>
              </div>
            </li>
            <li className="grid grid-cols-[auto_1fr] gap-5 sm:gap-8">
              <span className="font-mono text-sm text-accent-text tabular-nums pt-1">03</span>
              <div>
                <h3 className="font-display text-lg font-bold text-ink mb-2">Don't sacrifice readability for keywords</h3>
                <p className="text-ink/60 font-extralight leading-relaxed">
                  After passing the ATS, your resume will be read by a human. Keyword-stuffed bullets
                  that read awkwardly will get rejected at the human review stage. Write naturally and
                  weave keywords into achievement-focused statements.
                </p>
              </div>
            </li>
            <li className="grid grid-cols-[auto_1fr] gap-5 sm:gap-8">
              <span className="font-mono text-sm text-accent-text tabular-nums pt-1">04</span>
              <div>
                <h3 className="font-display text-lg font-bold text-ink mb-2">Submit in the right format</h3>
                <p className="text-ink/60 font-extralight leading-relaxed">
                  When in doubt, submit as DOCX — it's the safest format for ATS parsing. If the application
                  specifically asks for PDF, use our PDF export which produces clean, parseable files.
                  Never submit as JPG, PNG, or other image formats.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </RevealSection>

      {/* Common ATS Mistakes. A chalk-dark band so the run of chalk sections
          between the parse demo and the FAQ has a second tonal beat. */}
      <Band tone="chalk-dark" reserve="cv-h-500">
        <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
          What goes wrong
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
          Common mistakes that get resumes rejected by ATS
        </h2>
        <ul className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {MISTAKES.map((m) => (
            <li key={m.title} className="bg-white rounded-2xl border border-black/[0.06] p-6">
              <h3 className="font-display text-lg font-bold text-ink mb-2">{m.title}</h3>
              <p className="text-ink/60 font-extralight text-sm leading-relaxed">{m.body}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* Related Resources */}
      <RevealSection variant="fade-up">
        <div className="mb-16 max-w-4xl mx-auto cv-auto cv-h-300">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            Keep going
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            Resume resources
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {RESOURCES.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]"
              >
                <h3 className="font-bold text-ink mb-1">{r.title}</h3>
                <p className="text-ink/60 text-xs">{r.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Ready to Use an ATS-Friendly Template?"
        description="Start with our optimized templates and create your professional resume today."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
