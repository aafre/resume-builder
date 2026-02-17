/**
 * Free Resume Builder No Sign Up Page
 * URL: /free-resume-builder-no-sign-up
 * Target keyword: "free resume builder no sign up"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import StepByStep from '../shared/StepByStep';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import { InContentAd, AD_CONFIG } from '../ads';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

export default function FreeResumeBuilderNoSignUp() {
  const config = SEO_PAGES.noSignUp;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* In-content Ad - Below hero */}
      <InContentAd adSlot={AD_CONFIG.slots.freepageIncontent} marginY={32} />

      {config.steps && <StepByStep steps={config.steps} />}

      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          Edit instantly: open the builder
        </h2>
        <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-8">
          Start building immediately. The editor opens in seconds with no barriers. No email
          verification, no password creation, no waiting. Just click and start creating your
          professional resume right now.
        </p>
      </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Why No-Sign-Up Matters */}
      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          Why no-sign-up matters for job seekers
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-premium border border-black/[0.06]">
            <div className="text-3xl mb-3">1.</div>
            <h3 className="font-display text-lg font-bold text-ink mb-2">You're applying to dozens of jobs</h3>
            <p className="text-stone-warm text-sm leading-relaxed">
              Most job seekers apply to 20-50+ positions. Creating yet another account just to build
              a resume adds friction when you need speed. Open the editor, fill in your details, download PDF —
              that's it.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-premium border border-black/[0.06]">
            <div className="text-3xl mb-3">2.</div>
            <h3 className="font-display text-lg font-bold text-ink mb-2">No spam or marketing emails</h3>
            <p className="text-stone-warm text-sm leading-relaxed">
              When you give a resume builder your email, you'll get "Complete your resume!" reminders,
              premium upsell emails, and promotional offers for months. With no account, there's zero
              chance of that happening.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-premium border border-black/[0.06]">
            <div className="text-3xl mb-3">3.</div>
            <h3 className="font-display text-lg font-bold text-ink mb-2">Your data stays yours</h3>
            <p className="text-stone-warm text-sm leading-relaxed">
              Resumes contain sensitive information — your full name, address, phone number, work
              history. When you don't create an account, none of that data is stored on someone
              else's servers.
            </p>
          </div>
        </div>
      </div>
      </RevealSection>

      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          Privacy-first mode: what is and isn't logged
        </h2>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-xl font-bold text-accent mb-4">We DO NOT store:</h3>
              <ul className="space-y-2 text-stone-warm">
                <li>• Your resume content</li>
                <li>• Your personal information</li>
                <li>• Your email address</li>
                <li>• Your browsing history</li>
                <li>• Any identifying data</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink/80 mb-4">We only track:</h3>
              <ul className="space-y-2 text-stone-warm">
                <li>• Anonymous page views (for analytics)</li>
                <li>• Error reports (to fix bugs)</li>
                <li>• Nothing that identifies you personally</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </RevealSection>

      {/* Comparison with Paid Builders */}
      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          Free no-sign-up vs. paid builders: what you actually get
        </h2>
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-5 py-4 text-left font-bold text-ink">Feature</th>
                <th className="px-5 py-4 text-left font-bold text-accent">EasyFreeResume</th>
                <th className="px-5 py-4 text-left font-bold text-stone-warm">Paid Builders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr>
                <td className="px-5 py-3 text-ink font-medium">Account required</td>
                <td className="px-5 py-3 text-accent font-medium">No</td>
                <td className="px-5 py-3 text-stone-warm">Yes (email + password)</td>
              </tr>
              <tr>
                <td className="px-5 py-3 text-ink font-medium">PDF download</td>
                <td className="px-5 py-3 text-accent font-medium">Free, unlimited</td>
                <td className="px-5 py-3 text-stone-warm">$5-$25/month</td>
              </tr>
              <tr>
                <td className="px-5 py-3 text-ink font-medium">Watermarks</td>
                <td className="px-5 py-3 text-accent font-medium">Never</td>
                <td className="px-5 py-3 text-stone-warm">On free tier</td>
              </tr>
              <tr>
                <td className="px-5 py-3 text-ink font-medium">ATS-friendly templates</td>
                <td className="px-5 py-3 text-accent font-medium">All included</td>
                <td className="px-5 py-3 text-stone-warm">Premium only</td>
              </tr>
              <tr>
                <td className="px-5 py-3 text-ink font-medium">DOCX export</td>
                <td className="px-5 py-3 text-accent font-medium">Free</td>
                <td className="px-5 py-3 text-stone-warm">Often locked</td>
              </tr>
              <tr>
                <td className="px-5 py-3 text-ink font-medium">Marketing emails</td>
                <td className="px-5 py-3 text-accent font-medium">Impossible (no email)</td>
                <td className="px-5 py-3 text-stone-warm">Yes, often aggressive</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-center text-sm text-mist mt-4 max-w-2xl mx-auto">
          Pricing based on published rates for Zety, Resume.io, and Resume Genius as of February 2026.
          See our detailed <Link to="/best-free-resume-builder-reddit" className="text-accent hover:underline">Reddit-recommended builders comparison</Link>.
        </p>
      </div>
      </RevealSection>

      {/* What's Included */}
      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          Everything included, no paywall
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-premium border border-black/[0.06]">
            <h3 className="font-display text-lg font-bold text-ink mb-3">Resume Sections</h3>
            <ul className="space-y-2 text-stone-warm text-sm">
              <li className="flex items-start"><span className="text-accent mr-2">+</span> Professional summary / objective</li>
              <li className="flex items-start"><span className="text-accent mr-2">+</span> Work experience with bullet points</li>
              <li className="flex items-start"><span className="text-accent mr-2">+</span> Education and certifications</li>
              <li className="flex items-start"><span className="text-accent mr-2">+</span> Technical and soft skills</li>
              <li className="flex items-start"><span className="text-accent mr-2">+</span> Projects, volunteering, awards</li>
              <li className="flex items-start"><span className="text-accent mr-2">+</span> Custom sections (name them anything)</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-premium border border-black/[0.06]">
            <h3 className="font-display text-lg font-bold text-ink mb-3">Formatting Options</h3>
            <ul className="space-y-2 text-stone-warm text-sm">
              <li className="flex items-start"><span className="text-accent mr-2">+</span> Multiple professional templates</li>
              <li className="flex items-start"><span className="text-accent mr-2">+</span> Font and color customization</li>
              <li className="flex items-start"><span className="text-accent mr-2">+</span> Adjustable margins and spacing</li>
              <li className="flex items-start"><span className="text-accent mr-2">+</span> Section reordering (drag & drop)</li>
              <li className="flex items-start"><span className="text-accent mr-2">+</span> Live PDF preview</li>
              <li className="flex items-start"><span className="text-accent mr-2">+</span> One-click PDF and DOCX download</li>
            </ul>
          </div>
        </div>
      </div>
      </RevealSection>

      {/* ATS Keyword Scanner */}
      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          Built-in ATS keyword scanner
        </h2>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
          <p className="text-lg md:text-xl font-extralight text-stone-warm leading-relaxed mb-6">
            Over 75% of large employers use Applicant Tracking Systems to filter resumes before a human ever sees them.
            Our <Link to="/resume-keyword-scanner" className="text-accent hover:underline font-medium">free ATS keyword scanner</Link> analyzes
            your resume against any job description and shows you exactly which keywords are missing — so you can
            tailor your resume for every application.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-chalk-dark rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-ink">Match %</div>
              <div className="text-stone-warm text-sm mt-1">See your keyword score</div>
            </div>
            <div className="bg-chalk-dark rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-ink">Missing</div>
              <div className="text-stone-warm text-sm mt-1">Keywords to add</div>
            </div>
            <div className="bg-chalk-dark rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-ink">Free</div>
              <div className="text-stone-warm text-sm mt-1">No sign-up needed</div>
            </div>
          </div>
        </div>
      </div>
      </RevealSection>

      {/* Audience links */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Built for Every Career Stage
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/free-resume-builder-for-students" className="bg-chalk-dark rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] text-center">
              <h3 className="font-bold text-ink mb-1">Students</h3>
              <p className="text-stone-warm text-xs">No experience? No problem.</p>
            </Link>
            <Link to="/free-resume-builder-for-veterans" className="bg-chalk-dark rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] text-center">
              <h3 className="font-bold text-ink mb-1">Veterans</h3>
              <p className="text-stone-warm text-xs">Military-to-civilian translation.</p>
            </Link>
            <Link to="/free-resume-builder-for-it-professionals" className="bg-chalk-dark rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] text-center">
              <h3 className="font-bold text-ink mb-1">IT Professionals</h3>
              <p className="text-stone-warm text-xs">Tech stack, scale, impact.</p>
            </Link>
            <Link to="/free-resume-builder-for-nurses" className="bg-chalk-dark rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] text-center">
              <h3 className="font-bold text-ink mb-1">Nurses</h3>
              <p className="text-stone-warm text-xs">Certifications, EHR, clinical skills.</p>
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* Resume Tips Quick Guide */}
      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          Quick resume tips before you start
        </h2>
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
            <h3 className="font-display text-lg font-bold text-ink mb-2">Tailor for each application</h3>
            <p className="text-stone-warm text-sm leading-relaxed">
              Don't use one generic resume for every job. Read the job description, identify the key skills and
              keywords, and adjust your resume to match. Our <Link to="/blog/how-to-use-resume-keywords" className="text-accent hover:underline">keyword optimization guide</Link> shows
              you exactly how.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
            <h3 className="font-display text-lg font-bold text-ink mb-2">Lead with achievements, not duties</h3>
            <p className="text-stone-warm text-sm leading-relaxed">
              Instead of "Responsible for managing social media," write "Grew social media engagement 40% in
              6 months by implementing a data-driven content strategy." Learn more in our <Link to="/blog/quantify-resume-accomplishments" className="text-accent hover:underline">guide to quantifying accomplishments</Link>.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
            <h3 className="font-display text-lg font-bold text-ink mb-2">Keep it to one page (usually)</h3>
            <p className="text-stone-warm text-sm leading-relaxed">
              Unless you have 10+ years of highly relevant experience, a one-page resume is ideal. Recruiters spend
              an average of 7 seconds on initial review — a concise resume respects their time. Read our <Link to="/blog/resume-length-guide" className="text-accent hover:underline">resume length guide</Link> for exceptions.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
            <h3 className="font-display text-lg font-bold text-ink mb-2">Use AI to polish, not to write from scratch</h3>
            <p className="text-stone-warm text-sm leading-relaxed">
              AI tools like <Link to="/blog/chatgpt-resume-prompts" className="text-accent hover:underline">ChatGPT</Link> and <Link to="/blog/claude-resume-prompts" className="text-accent hover:underline">Claude</Link> are
              great for refining your resume language, but start with your own content. Recruiters can spot entirely AI-generated resumes.
            </p>
          </div>
        </div>
      </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Build Your Resume Without Signing Up"
        description="No account required. Start creating your resume immediately."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
