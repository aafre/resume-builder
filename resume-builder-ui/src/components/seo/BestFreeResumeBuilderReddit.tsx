/**
 * Best Free Resume Builder Reddit Page
 * URL: /best-free-resume-builder-reddit
 * Primary keyword: "free resume builder reddit" (also "reddit free resume builder")
 * Secondary: "best free resume builder reddit"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';
import CompareBuildersCrossLinks from '../blog/CompareBuildersCrossLinks';

export default function BestFreeResumeBuilderReddit() {
  const config = SEO_PAGES.redditRecommended;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* Answer-first intro for AI Overviews / featured snippets */}
      <div className="max-w-3xl mx-auto -mt-8 mb-16">
        <p className="text-lg md:text-xl text-ink font-medium leading-relaxed bg-white rounded-2xl p-6 shadow-premium border-l-4 border-l-accent">
          The free resume builder Reddit most often recommends is <strong>EasyFreeResume</strong>:
          you can build and download a resume for free with no watermark and no sign-up, and the
          output is ATS-friendly. It sidesteps the paywall that frustrates r/resumes users on most
          "free" builders.
        </p>
      </div>

      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
            What Reddit users look for in a free builder
          </h2>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
            <p className="text-lg md:text-xl font-extralight text-stone-warm mb-6 leading-relaxed">
              We analyzed hundreds of comments from r/resumes, r/jobs, and r/cscareerquestions to
              understand what matters most to job seekers. Here's what Reddit consistently values:
            </p>
            <ul className="space-y-3 text-stone-warm">
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3 text-xl">1.</span>
                <span><strong>Actually free</strong> – No hidden paywalls, no "free trial" that requires a credit card</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3 text-xl">2.</span>
                <span><strong>ATS-friendly</strong> – Templates that pass Applicant Tracking Systems</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3 text-xl">3.</span>
                <span><strong>No watermarks</strong> – Professional downloads without branding</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3 text-xl">4.</span>
                <span><strong>Privacy-focused</strong> – No account required, no data collection</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3 text-xl">5.</span>
                <span><strong>No aggressive upselling</strong> – Straightforward tool without constant upgrade prompts</span>
              </li>
            </ul>
          </div>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} columns={3} />}

      {/* What Reddit Complains About section */}
      <RevealSection variant="fade-up">
      <div className="mb-16 cv-auto cv-h-500">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          What Reddit users complain about (avoid these red flags)
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-red-400 p-6">
            <h3 className="font-display text-xl font-bold text-ink mb-4">
              <span aria-hidden="true">🚫</span> Paywall Bait-and-Switch
            </h3>
            <p className="text-stone-warm text-sm">
              The most common complaint on r/resumes: you build a full resume for free, then hit a
              $20+ charge at the download step. Always test the actual export before investing time.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-red-400 p-6">
            <h3 className="font-display text-xl font-bold text-ink mb-4">
              <span aria-hidden="true">🚫</span> Watermarks on "Free" Plans
            </h3>
            <p className="text-stone-warm text-sm">
              Redditors regularly warn that a "free" export can arrive with a builder's logo stamped
              on every page. Open your downloaded file and check every page before applying anywhere.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-red-400 p-6">
            <h3 className="font-display text-xl font-bold text-ink mb-4">
              <span aria-hidden="true">🚫</span> Mandatory Account Creation
            </h3>
            <p className="text-stone-warm text-sm">
              A recurring frustration: having to hand over an email and phone number just to try a
              builder. Look for tools that let you start without an account.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-red-400 p-6">
            <h3 className="font-display text-xl font-bold text-ink mb-4">
              <span aria-hidden="true">🚫</span> Aggressive Upselling
            </h3>
            <p className="text-stone-warm text-sm">
              Threads often flag constant "upgrade to premium" popups as a dark pattern. Choose tools
              that respect your time instead of nagging you toward a subscription.
            </p>
          </div>
        </div>
      </div>
      </RevealSection>

      {/* At-a-glance comparison: free-plan reality across builders Reddit names */}
      <RevealSection variant="fade-up">
      <div className="mb-16 cv-auto cv-h-500">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4 text-center">
          Free-plan reality check: the builders Reddit names
        </h2>
        <p className="text-stone-warm text-center max-w-3xl mx-auto mb-8 font-extralight">
          The tools that come up most in r/resumes threads, compared on the things that actually
          decide whether "free" means free. Where public plans vary, we mark it "Varies."
        </p>
        <div className="max-w-5xl mx-auto overflow-x-auto rounded-2xl shadow-premium border border-black/[0.06]">
          <table className="w-full text-sm text-left border-collapse bg-white">
            <caption className="sr-only">
              Comparison of free-plan features across EasyFreeResume, Zety, Resume.io, Canva, and Novoresume
            </caption>
            <thead>
              <tr className="bg-chalk-dark text-ink">
                <th scope="col" className="p-3 font-bold">Builder</th>
                <th scope="col" className="p-3 font-bold text-center">Download without paying?</th>
                <th scope="col" className="p-3 font-bold text-center">No watermark on free export?</th>
                <th scope="col" className="p-3 font-bold text-center">No signup required?</th>
                <th scope="col" className="p-3 font-bold text-center">DOCX export?</th>
                <th scope="col" className="p-3 font-bold text-center">ATS-friendly output?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr className="bg-accent/[0.06]">
                <th scope="row" className="p-3 font-bold text-ink">EasyFreeResume</th>
                <td className="p-3 text-center text-accent-text font-semibold">Yes</td>
                <td className="p-3 text-center text-accent-text font-semibold">Yes</td>
                <td className="p-3 text-center text-accent-text font-semibold">Yes</td>
                <td className="p-3 text-center text-accent-text font-semibold">Yes</td>
                <td className="p-3 text-center text-accent-text font-semibold">Yes</td>
              </tr>
              <tr>
                <th scope="row" className="p-3 font-medium text-ink">Zety</th>
                <td className="p-3 text-center text-stone-warm">No (pay at download)</td>
                <td className="p-3 text-center text-stone-warm">No</td>
                <td className="p-3 text-center text-stone-warm">No</td>
                <td className="p-3 text-center text-stone-warm">Paid</td>
                <td className="p-3 text-center text-stone-warm">Yes</td>
              </tr>
              <tr>
                <th scope="row" className="p-3 font-medium text-ink">Resume.io</th>
                <td className="p-3 text-center text-stone-warm">No (pay at download)</td>
                <td className="p-3 text-center text-stone-warm">No</td>
                <td className="p-3 text-center text-stone-warm">No</td>
                <td className="p-3 text-center text-stone-warm">Paid</td>
                <td className="p-3 text-center text-stone-warm">Yes</td>
              </tr>
              <tr>
                <th scope="row" className="p-3 font-medium text-ink">Canva</th>
                <td className="p-3 text-center text-stone-warm">Yes (free templates)</td>
                <td className="p-3 text-center text-stone-warm">Varies (Pro elements)</td>
                <td className="p-3 text-center text-stone-warm">No</td>
                <td className="p-3 text-center text-stone-warm">No</td>
                <td className="p-3 text-center text-stone-warm">Often no (design-heavy)</td>
              </tr>
              <tr>
                <th scope="row" className="p-3 font-medium text-ink">Novoresume</th>
                <td className="p-3 text-center text-stone-warm">Limited free tier</td>
                <td className="p-3 text-center text-stone-warm">Varies</td>
                <td className="p-3 text-center text-stone-warm">No</td>
                <td className="p-3 text-center text-stone-warm">Paid</td>
                <td className="p-3 text-center text-stone-warm">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-mist text-center max-w-3xl mx-auto mt-4">
          Based on publicly documented free-plan behavior; specific plans change over time, so verify
          the download step yourself before relying on any tool.
        </p>
      </div>
      </RevealSection>

      {/* Verification Checklist */}
      <RevealSection variant="fade-up">
      <div className="mb-16 cv-auto cv-h-400">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          How to verify a builder is actually free
        </h2>
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-premium border-l-4 border-l-accent p-8">
          <p className="text-lg text-ink font-medium mb-6">
            Before investing time in any resume builder, check these boxes:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-accent mr-3 text-xl">☑</span>
              <span className="text-stone-warm"><strong>Download works without payment</strong> – Test with dummy content first</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-3 text-xl">☑</span>
              <span className="text-stone-warm"><strong>No watermark on exported file</strong> – Open the PDF and check every page</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-3 text-xl">☑</span>
              <span className="text-stone-warm"><strong>No credit card required</strong> – Free means free, not "free trial"</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-3 text-xl">☑</span>
              <span className="text-stone-warm"><strong>All templates accessible</strong> – Not just 1-2 basic options</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-3 text-xl">☑</span>
              <span className="text-stone-warm"><strong>PDF and DOCX both available</strong> – Some lock DOCX behind paywall</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-3 text-xl">☑</span>
              <span className="text-stone-warm"><strong>Works without signup</strong> – Or at least doesn't require payment info</span>
            </li>
          </ul>
          <div className="mt-6 p-4 bg-white rounded-lg">
            <p className="text-sm text-stone-warm">
              <strong>EasyFreeResume passes all six checks.</strong> We're funded by ethical ads,
              not by tricking users into subscriptions.
            </p>
          </div>
        </div>
      </div>
      </RevealSection>

      <RevealSection variant="fade-up">
      <div className="mb-16 cv-auto cv-h-600">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          Evaluation criteria: how we meet Reddit's standards
        </h2>
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
              <h3 className="font-display text-xl font-bold text-ink mb-3">
                ✓ Reddit Criterion: "No paywall"
              </h3>
              <p className="text-stone-warm mb-2">
                <strong>How we meet it:</strong> Every feature is free forever. No premium tiers,
                no locked templates, no download limits. We monetize through ethical ads only —
                so the credit-card wall Reddit warns about simply isn't there.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
              <h3 className="font-display text-xl font-bold text-ink mb-3">
                ✓ Reddit Criterion: "ATS compatibility"
              </h3>
              <p className="text-stone-warm mb-2">
                <strong>How we meet it:</strong> All templates use standard fonts, clear section
                headers, and simple formatting. Tested with major ATS platforms including Workday,
                Taleo, and Greenhouse — the parsers Redditors most often name as make-or-break.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
              <h3 className="font-display text-xl font-bold text-ink mb-3">
                ✓ Reddit Criterion: "Privacy and no signup"
              </h3>
              <p className="text-stone-warm mb-2">
                <strong>How we meet it:</strong> No account required. Your resume data stays in
                your browser. We don't store, track, or sell your information — no "yet another
                account" required, which is exactly what r/jobs threads ask for.
              </p>
            </div>
          </div>
        </div>
      </div>
      </RevealSection>

      <RevealSection variant="fade-up">
      <div className="mb-16 cv-auto cv-h-300">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          When a paid tool makes sense
        </h2>
        <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 rounded-xl p-8">
          <p className="text-lg text-stone-warm leading-relaxed">
            We believe in being honest. Paid resume services can be worth it if you need:
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2 text-stone-warm">
            <li>Professional resume writing (human expert feedback)</li>
            <li>Cover letter writing services</li>
            <li>LinkedIn profile optimization</li>
            <li>Career coaching or interview prep</li>
          </ul>
          <p className="mt-4 text-stone-warm">
            But for <strong>creating and formatting a resume yourself</strong>, free tools like
            ours work just as well as paid options.
          </p>
        </div>
      </div>
      </RevealSection>

      {/* Recurring themes across Reddit resume communities (paraphrased, not verbatim) */}
      <RevealSection variant="fade-up">
      <div className="mb-16 cv-auto cv-h-500">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4 text-center">
          Recurring themes across Reddit resume communities
        </h2>
        <p className="text-stone-warm text-center max-w-3xl mx-auto mb-8 font-extralight">
          These are the patterns we see raised again and again across r/resumes, r/jobs, and
          r/cscareerquestions — paraphrased themes, not quotes from any specific user.
        </p>
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-white rounded-2xl shadow-premium border border-black/[0.06] p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-mist">r/resumes</span>
            </div>
            <p className="text-stone-warm">
              A recurring frustration is building a full resume on a "free" tool only to be asked for
              $20+ at the download step. The advice that follows is almost always the same: use a
              builder that lets you export before you've sunk time into it.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-premium border border-black/[0.06] p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-mist">r/jobs</span>
            </div>
            <p className="text-stone-warm">
              A common warning is that design-first tools (like graphic-design apps) can produce
              resumes ATS software struggles to parse. The consensus leans toward clean, text-based
              output over heavy visual layouts.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-premium border border-black/[0.06] p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-mist">r/cscareerquestions</span>
            </div>
            <p className="text-stone-warm">
              For tech resumes, the repeated guidance is to keep formatting simple and ATS-parseable.
              Elaborate templates tend to be treated as a liability rather than an advantage.
            </p>
          </div>
        </div>
      </div>
      </RevealSection>

      {/* Top Resume Tips From Reddit */}
      <RevealSection variant="fade-up">
      <div className="mb-16 cv-auto cv-h-500">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          Top resume tips from Reddit (2026)
        </h2>
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
            <h3 className="font-display text-lg font-bold text-ink mb-2">Tailor your resume for every application</h3>
            <p className="text-stone-warm text-sm leading-relaxed">
              The #1 tip across all subreddits: customize your resume for each job. Match keywords from the job posting.
              Our <Link to="/resume-keyword-scanner" className="text-accent hover:underline font-medium">ATS keyword scanner</Link> shows exactly which terms to add.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
            <h3 className="font-display text-lg font-bold text-ink mb-2">Use AI to polish, not to write</h3>
            <p className="text-stone-warm text-sm leading-relaxed">
              Reddit is split on AI resumes. The consensus: use <Link to="/blog/ai-resume-prompts-hub" className="text-accent hover:underline">AI tools like ChatGPT or Claude</Link> to refine wording, but write the core content yourself. Recruiters can detect fully AI-generated resumes.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
            <h3 className="font-display text-lg font-bold text-ink mb-2">Quantify everything</h3>
            <p className="text-stone-warm text-sm leading-relaxed">
              "Led team" → "Led team of 8 engineers." "Improved sales" → "Increased Q4 revenue 23% ($1.2M)."
              Numbers stand out and are harder to fake. See our <Link to="/blog/quantify-resume-accomplishments" className="text-accent hover:underline">quantification guide</Link> for help.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
            <h3 className="font-display text-lg font-bold text-ink mb-2">One page unless you have 10+ years</h3>
            <p className="text-stone-warm text-sm leading-relaxed">
              Nearly unanimous Reddit advice: keep it to one page for most roles. Two pages only for senior executives or academics. Check our <Link to="/blog/resume-length-guide" className="text-accent hover:underline">resume length guide</Link> for industry-specific exceptions.
            </p>
          </div>
        </div>
      </div>
      </RevealSection>

      {/* See How Specific Builders Compare */}
      <RevealSection variant="fade-up">
      <div className="mb-16 max-w-4xl mx-auto cv-auto cv-h-300">
        <CompareBuildersCrossLinks
          title="See How Specific Builders Compare"
          description="Want a detailed breakdown of a specific resume builder? We've analyzed pricing, features, and hidden costs:"
          bgColor="bg-accent/[0.06]"
        />
      </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="See Why Reddit Recommends Us"
        description="Join thousands of job seekers who trust our actually free resume builder."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
