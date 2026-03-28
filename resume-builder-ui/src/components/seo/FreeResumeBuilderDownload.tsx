/**
 * Free Resume Builder Download Page
 * URL: /free-resume-builder-download
 * Target keyword: "free resume builder download"
 * Content angle: file formats, offline use, printing tips, download vs online
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

export default function FreeResumeBuilderDownload() {
  const config = SEO_PAGES.freeDownload;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {config.steps && <StepByStep steps={config.steps} />}

      {/* Supported download formats section */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-600">
          <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase text-center mb-4">
            File Formats
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Download in the Format You Need
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-12">
            Different situations call for different file formats. EasyFreeResume lets you download your resume in
            both major formats that employers and{' '}
            <Link to="/blog/ats-resume-optimization" className="text-accent hover:underline">
              applicant tracking systems
            </Link>{' '}
            accept — at no cost.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl">
                  PDF
                </span>
                <h3 className="font-display text-xl font-bold text-ink">PDF Download</h3>
              </div>
              <p className="text-stone-warm font-extralight leading-relaxed mb-4">
                The gold standard for job applications. PDF preserves your resume layout exactly as designed —
                fonts, spacing, and formatting stay intact on every device and operating system.
              </p>
              <ul className="space-y-2">
                {[
                  'Identical appearance on all devices',
                  'Accepted by all ATS platforms',
                  'Cannot be accidentally edited by recruiters',
                  'Smaller file size for email attachments',
                  'Best choice for online job portals',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone-warm">
                    <span className="text-accent font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                  DOC
                </span>
                <h3 className="font-display text-xl font-bold text-ink">DOCX Download</h3>
              </div>
              <p className="text-stone-warm font-extralight leading-relaxed mb-4">
                Ideal when you need to make quick edits or when an employer specifically requests a Word document.
                Open in Microsoft Word, Google Docs, or LibreOffice.
              </p>
              <ul className="space-y-2">
                {[
                  'Editable in Word, Google Docs, LibreOffice',
                  'Easy to customize for each application',
                  'Some recruiters prefer Word format',
                  'Works with track changes and comments',
                  'Good for staffing agencies that reformat resumes',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone-warm">
                    <span className="text-accent font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-sm text-mist mt-6 text-center max-w-2xl mx-auto">
            Not sure which to choose? Use PDF for most online applications. Use DOCX if the job posting
            asks for Word format or if you want to edit the file later.
          </p>
        </div>
      </RevealSection>

      {/* How to download your resume step-by-step */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-600">
          <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase text-center mb-4">
            Step-by-Step
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            How to Download Your Resume in Under 5 Minutes
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-12">
            From first visit to a finished, downloadable resume — no account creation, no payment forms, no hoops to jump through.
          </p>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                step: 1,
                title: 'Browse and select a template',
                desc: 'Visit the templates page and pick from our full library of ATS-optimized designs. Every template is free — there are no locked "premium" options. Preview each layout before committing.',
              },
              {
                step: 2,
                title: 'Fill in your details',
                desc: 'Use our browser-based editor to add your work experience, education, skills, and contact information. Your data stays in your browser — nothing is uploaded to our servers.',
              },
              {
                step: 3,
                title: 'Preview your resume',
                desc: 'See a live preview of your resume as you type. Adjust sections, reorder content, and fine-tune until you are satisfied with the result.',
              },
              {
                step: 4,
                title: 'Choose your download format',
                desc: 'Click the download button and select PDF or DOCX. PDF is recommended for most job applications. DOCX is useful when employers request an editable Word file.',
              },
              {
                step: 5,
                title: 'Save and use offline',
                desc: 'Your resume file is saved to your computer instantly. Use it offline, attach it to emails, upload it to job boards like Indeed or LinkedIn, or print it for career fairs.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-5 items-start">
                <div className="w-10 h-10 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink mb-1">{item.title}</h3>
                  <p className="text-stone-warm font-extralight leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Printing tips section */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-500">
          <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase text-center mb-4">
            Print Guide
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Tips for Printing Your Resume
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-12">
            Heading to a job fair, an in-person interview, or a networking event? A printed resume still makes a strong impression.
            Here is how to get the best results from your downloaded file.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'Use the right paper',
                desc: 'Print on standard US Letter (8.5 x 11 in) or A4 paper. Choose bright white or off-white resume paper with a weight of 24-32 lb for a professional feel.',
              },
              {
                title: 'Check your margins',
                desc: 'Our templates use 0.5-1 inch margins, optimized for print. In your print dialog, make sure "Fit to page" is selected and margins are not cutting off content.',
              },
              {
                title: 'Print from the PDF',
                desc: 'Always print from the PDF version, not the DOCX. PDF guarantees that fonts, spacing, and layout appear exactly as designed regardless of your printer or operating system.',
              },
              {
                title: 'Use high-quality print settings',
                desc: 'Select "Best" or "High Quality" in your printer settings. Avoid draft mode — the lighter ink can make text harder to read and looks unprofessional.',
              },
              {
                title: 'Print a test page first',
                desc: 'Run one test print on regular paper before using your nice resume paper. Check that all text is legible, nothing is cut off, and the overall look matches the on-screen preview.',
              },
              {
                title: 'Bring 3-5 copies',
                desc: 'For interviews or career fairs, bring multiple copies. Store them in a folder or portfolio to prevent creasing. Label copies with the position name if applying to multiple roles.',
              },
            ].map((tip) => (
              <div key={tip.title} className="bg-white rounded-2xl p-6 shadow-premium border border-black/[0.06]">
                <h3 className="font-display text-lg font-bold text-ink mb-2">{tip.title}</h3>
                <p className="text-stone-warm font-extralight leading-relaxed text-sm">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Download vs online builders comparison */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-600">
          <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase text-center mb-4">
            Comparison
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Download Builders vs. Online-Only Builders
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-12">
            Some resume tools keep your resume locked inside their platform. EasyFreeResume gives you a file you own and control.
            See how{' '}
            <Link to="/blog/best-free-resume-builders-2026" className="text-accent hover:underline">
              downloadable resume builders
            </Link>{' '}
            compare to online-only tools.
          </p>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-chalk-dark">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-ink">Feature</th>
                  <th className="px-6 py-4 text-center font-bold text-accent">Download Builder (EasyFreeResume)</th>
                  <th className="px-6 py-4 text-center font-bold text-ink">Online-Only Builder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {[
                  { feature: 'Own your file', download: 'Yes — PDF/DOCX saved locally', online: 'Locked in their platform' },
                  { feature: 'Works offline', download: 'Yes, once downloaded', online: 'Requires internet connection' },
                  { feature: 'Email as attachment', download: 'Attach the file directly', online: 'Must export first (often paid)' },
                  { feature: 'Upload to job boards', download: 'Upload your file anywhere', online: 'Copy-paste or screenshot' },
                  { feature: 'Edit after download', download: 'DOCX editable in Word/Docs', online: 'Must return to their site' },
                  { feature: 'No vendor lock-in', download: 'Your file, your choice', online: 'Cancel and lose access' },
                  { feature: 'Print-ready', download: 'PDF prints perfectly', online: 'Often requires reformatting' },
                ].map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 1 ? 'bg-chalk-dark' : ''}>
                    <td className="px-6 py-4 font-medium text-ink">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-accent font-bold text-sm">{row.download}</td>
                    <td className="px-6 py-4 text-center text-stone-warm text-sm">{row.online}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </RevealSection>

      {/* Best format for ATS section */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-400">
          <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase text-center mb-4">
            ATS Advice
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Which Download Format Works Best for ATS?
          </h2>
          <div className="max-w-3xl mx-auto bg-accent/[0.06] border border-accent/20 rounded-xl p-8">
            <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-6">
              Applicant Tracking Systems (ATS) are software that employers use to scan and filter resumes before a
              human ever sees them. Choosing the right file format is critical to getting past these systems.
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold mt-0.5">&#10003;</span>
                <div>
                  <span className="font-bold text-ink">PDF is the safest choice for most applications.</span>
                  <span className="text-stone-warm font-extralight">
                    {' '}Modern ATS platforms (Workday, Greenhouse, Lever) parse PDF files reliably. Our templates use
                    real text layers, not images, so ATS can read every word.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold mt-0.5">&#10003;</span>
                <div>
                  <span className="font-bold text-ink">DOCX is preferred by some older ATS platforms.</span>
                  <span className="text-stone-warm font-extralight">
                    {' '}If the job posting specifically asks for a Word document, download the DOCX version. A few legacy
                    ATS tools (like older versions of Taleo) handle DOCX slightly better than PDF.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold mt-0.5">&#10003;</span>
                <div>
                  <span className="font-bold text-ink">Include the right keywords regardless of format.</span>
                  <span className="text-stone-warm font-extralight">
                    {' '}Format matters, but{' '}
                    <Link to="/resume-keywords" className="text-accent hover:underline">
                      resume keywords
                    </Link>{' '}
                    matter more. Use our{' '}
                    <Link to="/resume-keyword-scanner" className="text-accent hover:underline">
                      keyword scanner
                    </Link>{' '}
                    to check your resume against a job description before downloading.
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-mist">
              All EasyFreeResume templates are built to be{' '}
              <Link to="/templates/ats-friendly" className="text-accent hover:underline">
                ATS-friendly
              </Link>{' '}
              in both PDF and DOCX formats. Learn more in our{' '}
              <Link to="/blog/ats-resume-optimization" className="text-accent hover:underline">
                ATS optimization guide
              </Link>.
            </p>
          </div>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      <FAQSection faqs={config.faqs} />

      {/* Related Resources */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-400">
          <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase text-center mb-4">
            Related Resources
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Continue Your Job Search
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link
              to="/templates/ats-friendly"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">ATS-Friendly Templates</h3>
              <p className="text-stone-warm font-extralight text-sm">
                Browse templates designed to pass applicant tracking systems used by Fortune 500 companies.
              </p>
            </Link>
            <Link
              to="/blog/how-to-write-a-resume-guide"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">How to Write a Resume</h3>
              <p className="text-stone-warm font-extralight text-sm">
                Step-by-step guide to writing a resume that gets interviews, from structure to content.
              </p>
            </Link>
            <Link
              to="/resume-keywords"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">Resume Keywords</h3>
              <p className="text-stone-warm font-extralight text-sm">
                Find the right keywords for your industry and role to boost your ATS score.
              </p>
            </Link>
            <Link
              to="/examples"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">Resume Examples</h3>
              <p className="text-stone-warm font-extralight text-sm">
                See real resume examples for 25+ job titles with downloadable templates.
              </p>
            </Link>
            <Link
              to="/blog/best-free-resume-builders-2026"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">Best Free Resume Builders 2026</h3>
              <p className="text-stone-warm font-extralight text-sm">
                Independent comparison of the top free resume builders available this year.
              </p>
            </Link>
            <Link
              to="/blog/ats-resume-optimization"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">ATS Optimization Guide</h3>
              <p className="text-stone-warm font-extralight text-sm">
                Learn how to format and optimize your resume so it scores high with automated screening tools.
              </p>
            </Link>
          </div>
        </div>
      </RevealSection>

      <DownloadCTA
        title="Download Your Free Resume Now"
        description="PDF or DOCX. No payment. No sign-up. No watermarks. Just a professional resume file you own."
        primaryText="Build My Free Resume"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
