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
import { InContentAd, AD_CONFIG } from '../ads';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

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

      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
            What makes a resume ATS-friendly
          </h2>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
            <p className="text-lg md:text-xl font-extralight text-stone-warm mb-6 leading-relaxed">
              Applicant Tracking Systems (ATS) scan resumes for specific formatting and content.
              Over 75% of large employers use ATS software like Workday, Taleo, iCIMS, and Greenhouse
              to filter applications before a human recruiter ever sees them.
              An ATS-friendly template uses:
            </p>
            <ul className="space-y-3 text-stone-warm">
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3">1</span>
                <span><strong>Standard fonts</strong> like Arial, Calibri, or Times New Roman — decorative fonts get misread</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3">2</span>
                <span><strong>Clear section headers</strong> (Experience, Education, Skills) — non-standard headers like "My Journey" get ignored</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3">3</span>
                <span><strong>Simple formatting</strong> without complex tables, text boxes, or graphics — these create parsing errors</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3">4</span>
                <span><strong>Standard bullet points</strong> — avoid special characters, arrows, or custom symbols</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3">5</span>
                <span><strong>Consistent date formats</strong> (e.g., "Jan 2024 - Present") — inconsistent dates confuse parsers</span>
              </li>
            </ul>
          </div>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* ATS vs Non-ATS Comparison */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
            ATS-friendly vs. non-ATS templates: what happens
          </h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-premium border-2 border-accent/30">
              <div className="text-accent font-bold text-sm uppercase tracking-wider mb-3">ATS-Friendly Template</div>
              <h3 className="font-display text-xl font-bold text-ink mb-4">What the ATS sees:</h3>
              <div className="bg-chalk-dark rounded-lg p-4 text-sm text-stone-warm font-mono space-y-2">
                <p><strong>Name:</strong> John Smith</p>
                <p><strong>Title:</strong> Software Engineer</p>
                <p><strong>Experience:</strong></p>
                <p className="pl-4">Senior Developer, Acme Corp</p>
                <p className="pl-4">Jan 2022 - Present</p>
                <p className="pl-4">- Led team of 5 engineers...</p>
                <p><strong>Skills:</strong> Python, React, AWS</p>
              </div>
              <p className="text-accent text-sm font-medium mt-3">Result: Correctly parsed, ranked by keywords</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-premium border-2 border-red-200">
              <div className="text-red-500 font-bold text-sm uppercase tracking-wider mb-3">Graphic-Heavy Template</div>
              <h3 className="font-display text-xl font-bold text-ink mb-4">What the ATS sees:</h3>
              <div className="bg-chalk-dark rounded-lg p-4 text-sm text-stone-warm font-mono space-y-2">
                <p>John SmithSoftware Engineer</p>
                <p>Senior Developer Acme CorpJan</p>
                <p>2022PresentLed team of 5</p>
                <p>engineersPythonReactAWS</p>
                <p className="text-red-500">[image] [image] [table error]</p>
              </div>
              <p className="text-red-500 text-sm font-medium mt-3">Result: Garbled text, low keyword score, auto-rejected</p>
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
            Free ATS-friendly templates
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/templates/ats-friendly"
              className="bg-white rounded-2xl p-6 shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300 border-2 border-accent/20 hover:border-accent/70"
            >
              <div className="aspect-[8.5/11] bg-gradient-to-br from-chalk to-chalk-dark rounded-xl mb-4 flex items-center justify-center border border-black/[0.06]">
                <div className="text-center p-4">
                  <div className="text-4xl mb-2">📄</div>
                  <div className="text-sm font-bold text-stone-warm">ATS-Friendly</div>
                  <div className="text-xs text-mist">Modern Template</div>
                </div>
              </div>
              <h3 className="font-display text-lg font-bold text-ink mb-2">
                Professional ATS Template
              </h3>
              <p className="text-stone-warm text-sm mb-3">
                Clean, modern design that passes all ATS systems. Perfect for any industry.
              </p>
              <div className="text-accent font-semibold text-sm">
                View Template →
              </div>
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* Which ATS Systems */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
            Tested on the ATS systems employers actually use
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl font-extralight text-stone-warm text-center leading-relaxed mb-8">
              Different companies use different ATS platforms. Our templates are tested against the most common ones to ensure your resume parses correctly regardless of which system the employer uses.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-premium border border-black/[0.06] text-center">
                <div className="font-display font-bold text-ink text-lg">Workday</div>
                <p className="text-mist text-xs mt-1">Fortune 500 standard</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-premium border border-black/[0.06] text-center">
                <div className="font-display font-bold text-ink text-lg">Taleo (Oracle)</div>
                <p className="text-mist text-xs mt-1">Enterprise & government</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-premium border border-black/[0.06] text-center">
                <div className="font-display font-bold text-ink text-lg">iCIMS</div>
                <p className="text-mist text-xs mt-1">Large employers</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-premium border border-black/[0.06] text-center">
                <div className="font-display font-bold text-ink text-lg">Greenhouse</div>
                <p className="text-mist text-xs mt-1">Tech & startups</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-premium border border-black/[0.06] text-center">
                <div className="font-display font-bold text-ink text-lg">Lever</div>
                <p className="text-mist text-xs mt-1">Mid-size tech</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-premium border border-black/[0.06] text-center">
                <div className="font-display font-bold text-ink text-lg">BambooHR</div>
                <p className="text-mist text-xs mt-1">Small to mid-size</p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* How to Use ATS Templates */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
            How to use an ATS template effectively
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
              <h3 className="font-display text-lg font-bold text-ink mb-2">1. Match keywords from the job description</h3>
              <p className="text-stone-warm text-sm leading-relaxed">
                ATS systems rank resumes by keyword match. Read the job posting, identify required
                skills and qualifications, and mirror that exact language in your resume. Use our{' '}
                <Link to="/resume-keyword-scanner" className="text-accent hover:underline font-medium">free ATS keyword scanner</Link> to
                check your match rate before applying.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
              <h3 className="font-display text-lg font-bold text-ink mb-2">2. Use both acronyms and full terms</h3>
              <p className="text-stone-warm text-sm leading-relaxed">
                Write "Search Engine Optimization (SEO)" or "Amazon Web Services (AWS)" the first time you mention
                a term. Some ATS systems search for the acronym, others for the full phrase. Including both ensures
                you're matched. See our{' '}
                <Link to="/blog/how-to-use-resume-keywords" className="text-accent hover:underline font-medium">keyword optimization guide</Link> for
                more tips.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
              <h3 className="font-display text-lg font-bold text-ink mb-2">3. Don't sacrifice readability for keywords</h3>
              <p className="text-stone-warm text-sm leading-relaxed">
                After passing the ATS, your resume will be read by a human. Keyword-stuffed bullets
                that read awkwardly will get rejected at the human review stage. Write naturally and
                weave keywords into achievement-focused statements.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
              <h3 className="font-display text-lg font-bold text-ink mb-2">4. Submit in the right format</h3>
              <p className="text-stone-warm text-sm leading-relaxed">
                When in doubt, submit as DOCX — it's the safest format for ATS parsing. If the application
                specifically asks for PDF, use our PDF export which produces clean, parseable files.
                Never submit as JPG, PNG, or other image formats.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Common ATS Mistakes */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
            Common mistakes that get resumes rejected by ATS
          </h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-red-400 p-6">
              <h3 className="font-display text-lg font-bold text-ink mb-2">Using headers and footers for contact info</h3>
              <p className="text-stone-warm text-sm">
                Many ATS systems cannot read content in headers/footers. Put your name, email, and phone
                in the main body of the document.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-red-400 p-6">
              <h3 className="font-display text-lg font-bold text-ink mb-2">Saving from Canva or design tools</h3>
              <p className="text-stone-warm text-sm">
                PDFs exported from graphic design tools often contain images of text rather than actual
                text. The ATS sees a blank page. Always use a proper resume builder or word processor.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-red-400 p-6">
              <h3 className="font-display text-lg font-bold text-ink mb-2">Creative section titles</h3>
              <p className="text-stone-warm text-sm">
                "Where I've Been" instead of "Experience" or "What I Know" instead of "Skills" — the
                ATS won't recognize these. Stick to standard section names.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-red-400 p-6">
              <h3 className="font-display text-lg font-bold text-ink mb-2">Using text boxes or columns</h3>
              <p className="text-stone-warm text-sm">
                Text boxes and multi-column layouts created in Word can cause content to be read out of
                order or skipped entirely. Use a single-column layout for maximum compatibility.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Related Resources */}
      <RevealSection variant="fade-up">
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
            Resume resources
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/blog/ats-resume-optimization" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">ATS Resume Optimization Guide</h3>
              <p className="text-stone-warm text-xs">Beat the bots and land interviews</p>
            </Link>
            <Link to="/blog/how-to-use-resume-keywords" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">How to Use Resume Keywords</h3>
              <p className="text-stone-warm text-xs">The ultimate keyword optimization guide</p>
            </Link>
            <Link to="/resume-keyword-scanner" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Free ATS Keyword Scanner</h3>
              <p className="text-stone-warm text-xs">Check your resume against any job description</p>
            </Link>
            <Link to="/blog/resume-mistakes-to-avoid" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">10 Resume Mistakes to Avoid</h3>
              <p className="text-stone-warm text-xs">Critical errors that kill your chances</p>
            </Link>
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
