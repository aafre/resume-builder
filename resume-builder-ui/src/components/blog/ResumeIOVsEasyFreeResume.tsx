import { Helmet } from "react-helmet-async";
import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";
import { generateComparisonSchema } from "../../utils/schemaGenerators";
import { EASY_FREE_RESUME_PRODUCT } from "../../data/products";

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
      <span className="ml-2 text-sm font-medium text-gray-600">
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

export default function ResumeIOVsEasyFreeResume() {
  const schema = generateComparisonSchema(
    EASY_FREE_RESUME_PRODUCT,
    { name: "Resume.io", price: "44.95", description: "Resume builder with professional templates and a step-by-step editor, offering tiered subscription plans." },
    "2026-02-04"
  );

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <BlogLayout
      title="Resume.io Pricing 2026: Plans, Costs & Free Alternative"
      description="Resume.io charges $2.95-$24.95/mo for PDF downloads. See how EasyFreeResume compares: free ATS templates, no sign-up, and full privacy. Side-by-side review."
      publishDate="2026-01-21"
      lastUpdated="2026-02-04"
      readTime="8 min"
      keywords={[
        "resume.io pricing",
        "resume.io free",
        "resume.io cost",
        "resume.io alternative",
        "resume io vs",
        "resume.io vs easyfreeresume",
        "is resume.io free",
        "free resume builder",
        "resume.io review",
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
              <p className="font-bold text-green-700 text-lg mb-2">EasyFreeResume</p>
              <StarRating rating={5} />
              <p className="text-3xl font-bold text-green-600 mt-2">$0</p>
              <p className="text-sm text-gray-600">Forever free</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <p className="font-bold text-gray-700 text-lg mb-2">Resume.io</p>
              <StarRating rating={4} />
              <p className="text-3xl font-bold text-red-600 mt-2">$45+</p>
              <p className="text-sm text-gray-600">Per year</p>
            </div>
          </div>
          <p className="text-green-800 mt-4 text-center font-medium">
            Winner: EasyFreeResume — Equal quality, zero cost, better privacy
          </p>
        </div>

        <p className="text-xl leading-relaxed text-gray-700 font-medium">
          Resume.io is a popular resume builder with sleek templates and a modern interface.
          But like most "freemium" builders, the free part only gets you so far—downloading
          requires a subscription. Let's see how it stacks up against a truly free alternative.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Feature Comparison
        </h2>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-gray-200 rounded-xl shadow-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left font-bold text-gray-900">Feature</th>
                <th className="px-6 py-4 text-center font-bold text-green-600">EasyFreeResume</th>
                <th className="px-6 py-4 text-center font-bold text-blue-600">Resume.io</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Cost</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">100% Free</td>
                <td className="px-6 py-4 text-center text-red-600">$2.95-$24.95/month</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">PDF Downloads</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Unlimited, No Watermark</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Paid only</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Sign-Up Required</td>
                <td className="px-6 py-4 text-center text-green-600">✅ No</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Yes</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">ATS-Friendly Templates</td>
                <td className="px-6 py-4 text-center text-green-600">✅ All optimized</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Yes</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-400 text-white">Tie</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Privacy</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Local storage only</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Server storage</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Template Variety</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Professional options</td>
                <td className="px-6 py-4 text-center text-green-600">✅ 20+ templates</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-400 text-white">Tie</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Multiple Resumes</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Unlimited</td>
                <td className="px-6 py-4 text-center text-yellow-600">⚠️ Limited free</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
          <p className="font-bold text-green-800">
            Score: EasyFreeResume 5 — Resume.io 0 — Ties 2
            <WinnerBadge />
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Resume.io Pricing Breakdown
        </h2>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-red-800 mb-4">💰 Resume.io 2026 Pricing</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-red-200">
                  <th className="text-left py-2 font-bold">Plan</th>
                  <th className="text-left py-2 font-bold">Price</th>
                  <th className="text-left py-2 font-bold">What You Get</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100 text-red-700">
                <tr>
                  <td className="py-2">7-Day Trial</td>
                  <td className="py-2">$2.95</td>
                  <td className="py-2">Auto-renews at full price</td>
                </tr>
                <tr>
                  <td className="py-2">Monthly</td>
                  <td className="py-2">$24.95/month</td>
                  <td className="py-2">$299.40/year</td>
                </tr>
                <tr>
                  <td className="py-2">6 Months</td>
                  <td className="py-2">$7.95/month</td>
                  <td className="py-2">$47.70 billed upfront</td>
                </tr>
                <tr>
                  <td className="py-2">12 Months</td>
                  <td className="py-2">$3.75/month</td>
                  <td className="py-2">$44.95 billed upfront</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-red-600 text-sm mt-4">
            ⚠️ The $2.95 "trial" is a common trap—it auto-renews to a full subscription if you forget to cancel.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-green-800 mb-4">
            💚 EasyFreeResume Cost
            <WinnerBadge />
          </h3>
          <div className="text-green-700 text-center">
            <p className="text-6xl font-bold mb-2">$0</p>
            <p className="text-xl">Forever. No trials. No auto-renewals.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          The Privacy Difference
        </h2>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-800 mb-4">
              🔒 EasyFreeResume
              <WinnerBadge />
            </h3>
            <ul className="space-y-2 text-green-700">
              <li>✓ Data stays on your device</li>
              <li>✓ No account required</li>
              <li>✓ No data collection</li>
              <li>✓ Complete privacy control</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-red-800 mb-4">
              🚨 Resume.io
            </h3>
            <ul className="space-y-2 text-red-700">
              <li>× Requires email signup</li>
              <li>× Data stored on servers</li>
              <li>× Personal info collected</li>
              <li>× Marketing communications</li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          How to Switch from Resume.io
        </h2>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 my-8">
          <ol className="space-y-4 text-indigo-700">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div>
                <p className="font-medium">Export your Resume.io content</p>
                <p className="text-sm">Download as PDF or copy text from your resume</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <p className="font-medium">Cancel your subscription</p>
                <p className="text-sm">Go to Resume.io account settings → Cancel subscription</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <p className="font-medium">Visit EasyFreeResume.com</p>
                <p className="text-sm">No signup needed—start building immediately</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
              <div>
                <p className="font-medium">Recreate your resume with our templates</p>
                <p className="text-sm">Download unlimited PDFs—no watermarks, no payment</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="my-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Stop Paying for Resume Downloads
          </h3>
          <p className="text-xl mb-6 opacity-90">
            EasyFreeResume gives you everything Resume.io charges for—free.
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Build Your Free Resume
          </Link>
        </div>

        {/* Compare Other Resume Builders */}
        <div className="bg-gray-50 rounded-xl p-6 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Compare Other Resume Builders</h2>
          <p className="text-gray-600 mb-4">See how other popular resume builders compare on pricing, features, and hidden costs:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <li><Link to="/blog/zety-vs-easy-free-resume" className="text-blue-600 hover:underline">Zety Pricing Breakdown</Link></li>
            <li><Link to="/blog/resume-genius-vs-easy-free-resume" className="text-blue-600 hover:underline">Resume Genius Pricing</Link></li>
            <li><Link to="/blog/novoresume-vs-easy-free-resume" className="text-blue-600 hover:underline">Novoresume Pricing</Link></li>
            <li><Link to="/blog/enhancv-vs-easy-free-resume" className="text-blue-600 hover:underline">Enhancv Pricing</Link></li>
            <li><Link to="/blog/canva-resume-vs-easy-free-resume" className="text-blue-600 hover:underline">Canva Resume Builder Review</Link></li>
            <li><Link to="/blog/flowcv-vs-easy-free-resume" className="text-blue-600 hover:underline">FlowCV Review</Link></li>
          </ul>
        </div>
      </div>

      {/* Sticky CTA Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 shadow-lg z-50 md:hidden">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <p className="font-bold text-sm">Switch to Free</p>
            <p className="text-xs opacity-90">Save $45+/year</p>
          </div>
          <Link
            to="/templates"
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-bold text-sm shadow hover:shadow-md transition-all"
          >
            Try Free
          </Link>
        </div>
      </div>
    </BlogLayout>
    </>
  );
}
