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

export default function EnhancvVsEasyFreeResume() {
  const schema = generateComparisonSchema(
    EASY_FREE_RESUME_PRODUCT,
    { name: "Enhancv", price: "119.88", description: "Resume builder with modern templates and content suggestions, offering monthly and annual subscription plans." },
    "2026-02-04"
  );

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <BlogLayout
      title="Enhancv Pricing 2026: Plans, Costs & Free Alternative"
      description="Enhancv plans run $9.99-$24.99/mo. Compare Enhancv vs EasyFreeResume feature-by-feature: ATS templates, pricing, export formats, and privacy."
      publishDate="2026-01-21"
      lastUpdated="2026-02-04"
      readTime="7 min"
      keywords={[
        "enhancv pricing",
        "enhancv free",
        "enhancv cost",
        "enhancv alternative",
        "enhancv vs",
        "is enhancv free",
        "enhancv vs easyfreeresume",
        "free resume builder",
        "enhancv review 2026",
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
              <p className="text-sm text-stone-warm">Everything free</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <p className="font-bold text-stone-warm text-lg mb-2">Enhancv</p>
              <StarRating rating={4} />
              <p className="text-3xl font-bold text-red-600 mt-2">$120</p>
              <p className="text-sm text-stone-warm">Per year (Pro)</p>
            </div>
          </div>
          <p className="text-green-800 mt-4 text-center font-medium">
            Winner: EasyFreeResume — Comparable results, zero subscription
          </p>
        </div>

        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Enhancv is known for its modern, visually distinctive templates and content
          coaching features. It's popular among creative professionals and tech workers.
          But does it justify the $120/year price tag?
        </p>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Feature Comparison
        </h2>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-6 py-4 text-left font-bold text-ink">Feature</th>
                <th className="px-6 py-4 text-center font-bold text-accent">EasyFreeResume</th>
                <th className="px-6 py-4 text-center font-bold text-accent">Enhancv</th>
                <th className="px-6 py-4 text-center font-bold text-stone-warm">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-ink">Cost</td>
                <td className="px-6 py-4 text-center text-accent font-bold">100% Free</td>
                <td className="px-6 py-4 text-center text-red-600">$9.99-$24.99/month</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-ink">PDF Downloads</td>
                <td className="px-6 py-4 text-center text-accent">✅ Unlimited, Free</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Paid plans only</td>
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
                <td className="px-6 py-4 text-center text-yellow-600">⚠️ Some templates</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
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
                <td className="px-6 py-4 font-medium text-ink">Content Analyzer</td>
                <td className="px-6 py-4 text-center text-yellow-600">⚠️ Blog guides</td>
                <td className="px-6 py-4 text-center text-accent">✅ Built-in</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-accent text-ink">Enhancv</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-ink">Template Creativity</td>
                <td className="px-6 py-4 text-center text-accent">✅ Professional</td>
                <td className="px-6 py-4 text-center text-accent">✅ More creative options</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-accent text-ink">Enhancv</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
          <p className="font-bold text-green-800">
            Score: EasyFreeResume 5 — Enhancv 2 — Ties 0
            <WinnerBadge />
          </p>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Enhancv Pricing Breakdown
        </h2>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-red-800 mb-4">💰 Enhancv 2026 Pricing</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-red-200">
                  <th className="text-left py-2 font-bold">Plan</th>
                  <th className="text-left py-2 font-bold">Price</th>
                  <th className="text-left py-2 font-bold">Features</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100 text-red-700">
                <tr>
                  <td className="py-2">Free</td>
                  <td className="py-2">$0</td>
                  <td className="py-2">1 resume, no PDF download</td>
                </tr>
                <tr>
                  <td className="py-2">Pro Monthly</td>
                  <td className="py-2">$24.99/month</td>
                  <td className="py-2">$299.88/year</td>
                </tr>
                <tr>
                  <td className="py-2">Pro Quarterly</td>
                  <td className="py-2">$14.99/month</td>
                  <td className="py-2">$179.88/year</td>
                </tr>
                <tr>
                  <td className="py-2">Pro Annual</td>
                  <td className="py-2">$9.99/month</td>
                  <td className="py-2">$119.88/year</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-red-600 text-sm mt-4">
            ⚠️ Free version doesn't allow PDF downloads—only sharing via link.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-green-800 mb-4">
            💚 EasyFreeResume Cost
            <WinnerBadge />
          </h3>
          <div className="text-accent text-center">
            <p className="text-6xl font-bold mb-2">$0</p>
            <p className="text-xl">PDF downloads included. Always.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          When Enhancv Might Make Sense
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-4">
          To be fair, Enhancv could be worth it if:
        </p>

        <ul className="list-disc list-inside space-y-2 text-stone-warm mb-8">
          <li>You're in a creative field where visual design matters more</li>
          <li>You want built-in content coaching and suggestions</li>
          <li>You need multiple creative template options</li>
          <li>Your target companies use modern ATS that handles graphics well</li>
        </ul>

        <p className="text-lg leading-relaxed text-stone-warm">
          However, for most job seekers—especially those applying to corporate jobs
          or through online portals—a clean, ATS-optimized template is what you need.
          And you can get that for free.
        </p>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          How to Switch from Enhancv
        </h2>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <ol className="space-y-4 text-ink/80">
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center font-bold">1</span>
              <div>
                <p className="font-medium">Export your Enhancv content</p>
                <p className="text-sm">Use the share link to view, then copy text (or download PDF if subscribed)</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <p className="font-medium">Cancel your Pro subscription</p>
                <p className="text-sm">Account Settings → Billing → Cancel subscription</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <p className="font-medium">Visit EasyFreeResume.com</p>
                <p className="text-sm">No account needed—start building right away</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center font-bold">4</span>
              <div>
                <p className="font-medium">Build and download your ATS-optimized resume</p>
                <p className="text-sm">Professional PDF, no watermarks, unlimited downloads</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="my-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Professional Resumes Don't Need to Cost $120/Year
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Get ATS-friendly templates that work—for free.
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-accent px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Start Building Free
          </Link>
        </div>

        <CompareBuildersCrossLinks excludePath="/blog/enhancv-vs-easy-free-resume" />
      </div>

      {/* Spacer for sticky mobile CTA */}
      <div className="h-16 md:hidden" aria-hidden="true" />

      {/* Sticky CTA Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 shadow-lg z-50 md:hidden">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <p className="font-bold text-sm">Skip the Subscription</p>
            <p className="text-xs opacity-90">Save $120/year</p>
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
