import { Helmet } from "react-helmet-async";
import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";
import { generateComparisonSchema } from "../../utils/schemaGenerators";
import { EASY_FREE_RESUME_PRODUCT } from "../../data/products";
import CompareBuildersCrossLinks from './CompareBuildersCrossLinks';

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

export default function ResumeGeniusVsEasyFreeResume() {
  const schema = generateComparisonSchema(
    EASY_FREE_RESUME_PRODUCT,
    { name: "Resume Genius", price: "95.40", description: "Resume builder with guided wizard and pre-written content, offering monthly and quarterly subscription plans." },
    "2026-02-04"
  );

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <BlogLayout
      title="Resume Genius Pricing 2026: Is It Free? (+ Alternative)"
      description="Resume Genius costs $7.95-$39.95/mo. Compare Resume Genius vs EasyFreeResume: pricing, ATS templates, privacy, and why a free builder may be all you need."
      publishDate="2026-01-21"
      lastUpdated="2026-02-04"
      readTime="8 min"
      keywords={[
        "resume genius pricing",
        "resume genius free",
        "resume genius cost",
        "resume genius alternative",
        "resume genius vs",
        "is resume genius free",
        "resume genius vs easyfreeresume",
        "free resume builder",
        "resume genius review 2026",
      ]}
    >
      <div className="space-y-8">
        {/* Quick Verdict Box */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 my-8 shadow-lg">
          <h3 className="font-bold text-green-800 text-xl mb-4">
            ⚡ Quick Verdict
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <p className="font-bold text-accent text-lg mb-2">EasyFreeResume</p>
              <StarRating rating={5} />
              <p className="text-3xl font-bold text-accent mt-2">$0</p>
              <p className="text-sm text-stone-warm">Forever free</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <p className="font-bold text-stone-warm text-lg mb-2">Resume Genius</p>
              <StarRating rating={3} />
              <p className="text-3xl font-bold text-red-600 mt-2">$95+</p>
              <p className="text-sm text-stone-warm">Per year</p>
            </div>
          </div>
          <p className="text-green-800 mt-4 text-center font-medium">
            Winner: EasyFreeResume — Same features, zero cost, no subscription traps
          </p>
        </div>

        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Resume Genius promises to help you build a professional resume in minutes. What they
          don't advertise loudly: you can't actually download your resume without paying.
          Let's compare it to a truly free option.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-yellow-800 mb-3">
            ⚠️ Common Complaint on Reddit
          </h3>
          <p className="text-yellow-700 italic">
            "I spent an hour building my resume on Resume Genius, then found out I had to pay
            just to download it. Felt like a bait and switch."
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
                <th className="px-6 py-4 text-center font-bold text-accent">Resume Genius</th>
                <th className="px-6 py-4 text-center font-bold text-stone-warm">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-ink">Cost</td>
                <td className="px-6 py-4 text-center text-accent font-bold">100% Free</td>
                <td className="px-6 py-4 text-center text-red-600">$7.95-$39.95/month</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-ink">PDF Downloads</td>
                <td className="px-6 py-4 text-center text-accent">✅ Unlimited, Free</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Paid only</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
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
                <td className="px-6 py-4 font-medium text-ink">ATS Compatibility</td>
                <td className="px-6 py-4 text-center text-accent">✅ All templates</td>
                <td className="px-6 py-4 text-center text-accent">✅ Yes</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-400 text-white">Tie</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-ink">Privacy</td>
                <td className="px-6 py-4 text-center text-accent">✅ Local storage</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Cloud storage</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-ink">Cover Letter Builder</td>
                <td className="px-6 py-4 text-center text-yellow-600">⚠️ Guides available</td>
                <td className="px-6 py-4 text-center text-accent">✅ Included (paid)</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-accent text-ink">Resume Genius</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-ink">Cancellation Hassle</td>
                <td className="px-6 py-4 text-center text-accent">✅ Nothing to cancel</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Hard to cancel</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
          <p className="font-bold text-green-800">
            Score: EasyFreeResume 5 — Resume Genius 1 — Ties 1
            <WinnerBadge />
          </p>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Resume Genius Pricing Breakdown
        </h2>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-red-800 mb-4">💰 Resume Genius 2026 Pricing</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-red-200">
                  <th className="text-left py-2 font-bold">Plan</th>
                  <th className="text-left py-2 font-bold">Price</th>
                  <th className="text-left py-2 font-bold">Annual Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100 text-red-700">
                <tr>
                  <td className="py-2">14-Day Access</td>
                  <td className="py-2">$1.95</td>
                  <td className="py-2">Auto-renews monthly</td>
                </tr>
                <tr>
                  <td className="py-2">Monthly</td>
                  <td className="py-2">$39.95/month</td>
                  <td className="py-2">$479.40/year</td>
                </tr>
                <tr>
                  <td className="py-2">Quarterly</td>
                  <td className="py-2">$14.95/month</td>
                  <td className="py-2">$179.40/year</td>
                </tr>
                <tr>
                  <td className="py-2">Annual</td>
                  <td className="py-2">$7.95/month</td>
                  <td className="py-2">$95.40/year</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-red-100 rounded-lg">
            <p className="font-medium text-red-800">Known Issues:</p>
            <ul className="text-sm text-red-700 list-disc pl-5 mt-2">
              <li>$1.95 trial auto-renews to $39.95/month</li>
              <li>Many complaints about difficulty canceling</li>
              <li>BBB complaints about unauthorized charges</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-green-800 mb-4">
            💚 EasyFreeResume Cost
            <WinnerBadge />
          </h3>
          <div className="text-accent text-center">
            <p className="text-6xl font-bold mb-2">$0</p>
            <p className="text-xl">No trial traps. No auto-renewals. Ever.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          How to Switch from Resume Genius
        </h2>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <ol className="space-y-4 text-ink/80">
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center font-bold">1</span>
              <div>
                <p className="font-medium">Cancel your Resume Genius subscription first</p>
                <p className="text-sm">Contact support or go to account settings (may require calling)</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <p className="font-medium">Copy your resume content</p>
                <p className="text-sm">Download as PDF if subscribed, or copy text manually</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <p className="font-medium">Go to EasyFreeResume.com</p>
                <p className="text-sm">No signup, no credit card, no trial period</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center font-bold">4</span>
              <div>
                <p className="font-medium">Build and download—completely free</p>
                <p className="text-sm">Professional PDF, no watermark, unlimited downloads</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="my-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Escape the Subscription Trap
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Build professional resumes without monthly fees.
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-accent px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Start Building Free
          </Link>
        </div>

        <CompareBuildersCrossLinks excludePath="/blog/resume-genius-vs-easy-free-resume" />
      </div>

      {/* Spacer for sticky mobile CTA */}
      <div className="h-16 md:hidden" aria-hidden="true" />

      {/* Sticky CTA Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 shadow-lg z-50 md:hidden">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <p className="font-bold text-sm">Switch to Free</p>
            <p className="text-xs opacity-90">Save $95+/year</p>
          </div>
          <Link
            to="/templates"
            className="bg-white text-accent px-4 py-2 rounded-lg font-bold text-sm shadow hover:shadow-md transition-all"
          >
            Try Free
          </Link>
        </div>
      </div>
    </BlogLayout>
    </>
  );
}
