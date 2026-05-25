import { Helmet } from "react-helmet-async";
import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";
import { generateComparisonSchema } from "../../utils/schemaGenerators";
import { EASY_FREE_RESUME_PRODUCT } from "../../data/products";
import CompareBuildersCrossLinks from './CompareBuildersCrossLinks';

const FLOWCV_FAQS = [
  {
    question: "Is FlowCV free?",
    answer: "Yes — FlowCV offers genuinely free PDF downloads on its free tier. Account creation is required (email or Google sign-up). A paid Pro plan adds features like analytics and custom branding but is not needed for a working resume.",
  },
  {
    question: "Is FlowCV legit?",
    answer: "Yes. FlowCV is a real, established resume builder used by a large international user base. It's owned by FlowCV Inc. and has a working free tier with PDF export. The main caveat is that resumes are stored in their cloud, not on your device.",
  },
  {
    question: "Do I need to sign up to use FlowCV?",
    answer: "Yes. FlowCV requires you to create an account (email or Google) before you can build or download a resume. If you'd prefer to skip sign-up entirely, EasyFreeResume works in your browser with no account.",
  },
  {
    question: "What's the difference between FlowCV and EasyFreeResume?",
    answer: "Both are genuinely free PDF resume builders. FlowCV requires sign-up and stores your resume in the cloud across devices, with more template variety. EasyFreeResume requires no sign-up, keeps your data in your browser only, and has no upsells — at the cost of fewer templates and no cross-device sync.",
  },
  {
    question: "Are FlowCV resumes ATS-friendly?",
    answer: "FlowCV's templates are designed to pass Applicant Tracking Systems (ATS). For best ATS results — on any builder — use a single-column layout, standard section headings (Experience, Education, Skills), and avoid heavy graphics or icons that ATS parsers can mangle.",
  },
  {
    question: "Can I download my FlowCV resume as a PDF for free?",
    answer: "Yes. FlowCV's free tier includes unlimited PDF downloads without watermarks — one of the few free builders that doesn't charge at the download step. The free tier limits some advanced features (analytics, custom domains) but not PDF export itself.",
  },
  {
    question: "What's the best free alternative to FlowCV?",
    answer: "If FlowCV's sign-up requirement or cloud storage is a dealbreaker, EasyFreeResume is the closest alternative — also genuinely free PDF, but no account needed and data stays local. Google Docs is another free option if you want full document control. Avoid Zety, Resume.io, and Resume Genius — they charge at the download step.",
  },
];

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`text-xl ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
      <span className="ml-2 text-sm font-medium text-stone-warm">
        {rating}/{max}
      </span>
    </div>
  );
}

function WinnerBadge() {
  return (
    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">
      WINNER
    </span>
  );
}

export default function FlowCVVsEasyFreeResume() {
  const comparisonSchema = generateComparisonSchema(
    EASY_FREE_RESUME_PRODUCT,
    { name: "FlowCV", price: "0", description: "Free online resume builder with customizable templates and a Pro plan for additional features." },
    "2026-05-11"
  );

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(comparisonSchema)}</script>
      </Helmet>
      <BlogLayout
      title="FlowCV vs EasyFreeResume (2026): Features, Pricing & Privacy Compared"
      description="FlowCV requires sign-up and limits free exports. Compare FlowCV and EasyFreeResume side-by-side on templates, ATS compatibility, pricing, and privacy."
      publishDate="2026-01-21"
      lastUpdated="2026-05-11"
      readTime="7 min"
      keywords={[
        "flowcv review",
        "flowcv free",
        "flowcv vs easyfreeresume",
        "best free resume builder",
        "flowcv alternative",
        "free resume builder comparison",
        "flowcv 2026",
      ]}
      faqs={FLOWCV_FAQS}
    >
      <div className="space-y-8">
        {/* Answer-first block — GEO citation hook */}
        <div className="bg-chalk-dark/60 border-l-4 border-accent rounded-r-xl px-6 py-5 my-4">
          <p className="text-base leading-relaxed text-ink/90">
            <strong>Short answer:</strong> Both FlowCV and EasyFreeResume offer truly free PDF
            downloads with no paywalls. FlowCV requires account sign-up and stores data in the
            cloud; EasyFreeResume requires no account and keeps data in your browser. Choose
            FlowCV for cloud sync and template variety; choose EasyFreeResume for privacy and
            simplicity. <em>Last tested 2026-05-11.</em>
          </p>
        </div>

        {/* Quick Verdict Box */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 my-8 shadow-lg">
          <h3 className="font-bold text-green-800 text-xl mb-4">
            ⚡ Quick Verdict
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <p className="font-bold text-accent text-lg mb-2">EasyFreeResume</p>
              <StarRating rating={5} />
              <p className="text-2xl font-bold text-accent mt-2">No Account</p>
              <p className="text-sm text-stone-warm">Better privacy, simpler</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <p className="font-bold text-stone-warm text-lg mb-2">FlowCV</p>
              <StarRating rating={4} />
              <p className="text-2xl font-bold text-accent mt-2">Free + Pro</p>
              <p className="text-sm text-stone-warm">Account required</p>
            </div>
          </div>
          <p className="text-green-800 mt-4 text-center font-medium">
            Winner: EasyFreeResume — True no-signup experience with better privacy
          </p>
        </div>

        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          FlowCV is one of the few resume builders that actually offers free PDF downloads.
          So how does it compare to EasyFreeResume, another genuinely free option?
          Let's break down the differences.
        </p>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h3 className="font-bold text-ink mb-3">
            🎯 Both Are Actually Free
          </h3>
          <p className="text-ink/80">
            Unlike most "free" resume builders that lock PDF downloads behind paywalls,
            both FlowCV and EasyFreeResume let you download your resume for free.
            The differences come down to privacy, simplicity, and user experience.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Feature Comparison
        </h2>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-6 py-4 text-left font-bold text-ink">Feature</th>
                <th className="px-6 py-4 text-center font-bold text-accent">EasyFreeResume</th>
                <th className="px-6 py-4 text-center font-bold text-accent">FlowCV</th>
                <th className="px-6 py-4 text-center font-bold text-stone-warm">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr>
                <td className="px-6 py-4 font-medium text-ink">Free PDF Downloads</td>
                <td className="px-6 py-4 text-center text-accent font-bold">✅ Yes</td>
                <td className="px-6 py-4 text-center text-accent font-bold">✅ Yes</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-400 text-white">Tie</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-ink">Account Required</td>
                <td className="px-6 py-4 text-center text-accent">✅ No</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Yes</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-ink">Privacy</td>
                <td className="px-6 py-4 text-center text-accent">✅ Local storage only</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Cloud storage</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-ink">ATS-Friendly</td>
                <td className="px-6 py-4 text-center text-accent">✅ All templates</td>
                <td className="px-6 py-4 text-center text-accent">✅ Yes</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-400 text-white">Tie</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-ink">Template Options</td>
                <td className="px-6 py-4 text-center text-accent">✅ Professional</td>
                <td className="px-6 py-4 text-center text-accent">✅ More variety</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-accent text-ink">FlowCV</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-ink">Interface Simplicity</td>
                <td className="px-6 py-4 text-center text-accent">✅ Clean, focused</td>
                <td className="px-6 py-4 text-center text-yellow-600">⚠️ More features</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-ink">Cover Letter</td>
                <td className="px-6 py-4 text-center text-yellow-600">⚠️ Guides available</td>
                <td className="px-6 py-4 text-center text-accent">✅ Built-in</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-accent text-ink">FlowCV</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-ink">No Upselling</td>
                <td className="px-6 py-4 text-center text-accent">✅ None</td>
                <td className="px-6 py-4 text-center text-yellow-600">⚠️ Pro features promoted</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
          <p className="font-bold text-green-800">
            Score: EasyFreeResume 4 — FlowCV 2 — Ties 2
            <WinnerBadge />
          </p>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          The Privacy Difference
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          This is the biggest distinction between the two platforms:
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-800 mb-4">
              🔒 EasyFreeResume
              <WinnerBadge />
            </h3>
            <ul className="space-y-2 text-accent">
              <li>✓ No account creation needed</li>
              <li>✓ Data stored locally in your browser</li>
              <li>✓ We never see your personal info</li>
              <li>✓ No email required</li>
              <li>✓ Complete privacy by design</li>
            </ul>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-ink mb-4">
              📧 FlowCV
            </h3>
            <ul className="space-y-2 text-ink/80">
              <li>✓ Account required (email or Google)</li>
              <li>✓ Data stored in the cloud</li>
              <li>✓ Accessible from any device</li>
              <li>✓ Resume sharing via link</li>
              <li>⚠️ Your data on their servers</li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          When to Choose Each
        </h2>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-800 mb-4">
              Choose EasyFreeResume If:
            </h3>
            <ul className="space-y-2 text-accent">
              <li>✓ You value privacy above all</li>
              <li>✓ You don't want to create accounts</li>
              <li>✓ You prefer simplicity over features</li>
              <li>✓ You work on one device</li>
              <li>✓ You hate promotional emails</li>
            </ul>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-ink mb-4">
              Choose FlowCV If:
            </h3>
            <ul className="space-y-2 text-ink/80">
              <li>✓ You need cloud sync across devices</li>
              <li>✓ You want more template variety</li>
              <li>✓ You need cover letter builder</li>
              <li>✓ You want shareable resume links</li>
              <li>✓ Account creation doesn't bother you</li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          What FlowCV Does Well
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-4">
          To be fair, FlowCV has genuine strengths:
        </p>

        <ul className="list-disc list-inside space-y-2 text-stone-warm mb-8">
          <li>Actually free PDF downloads (rare in this space)</li>
          <li>More template designs to choose from</li>
          <li>Built-in cover letter builder</li>
          <li>Shareable online resume links</li>
          <li>Cloud sync across devices</li>
        </ul>

        <p className="text-lg leading-relaxed text-stone-warm">
          If these features matter to you and you're okay with creating an account,
          FlowCV is a solid choice. But if privacy and simplicity are priorities,
          EasyFreeResume is the better option.
        </p>

        {/* FAQ section — text matches FAQPage JSON-LD schema in Helmet */}
        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {FLOWCV_FAQS.map((faq, i) => (
            <div key={i} className="bg-chalk-dark rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">{faq.question}</h3>
              <p className="text-stone-warm">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="my-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Build Your Resume Without Creating an Account
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Start immediately. No email. No signup. Just results.
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-accent px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Start Building Free
          </Link>
        </div>

        <CompareBuildersCrossLinks excludePath="/blog/flowcv-vs-easy-free-resume" />
      </div>

      {/* Spacer for sticky mobile CTA */}
      <div className="h-16 md:hidden" aria-hidden="true" />

      {/* Sticky CTA Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 shadow-lg z-50 md:hidden">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <p className="font-bold text-sm">No Account Needed</p>
            <p className="text-xs opacity-90">Start building now</p>
          </div>
          <Link
            to="/templates"
            className="bg-white text-accent px-4 py-2 rounded-lg font-bold text-sm shadow hover:shadow-md transition-all"
          >
            Build Free
          </Link>
        </div>
      </div>
    </BlogLayout>
    </>
  );
}
