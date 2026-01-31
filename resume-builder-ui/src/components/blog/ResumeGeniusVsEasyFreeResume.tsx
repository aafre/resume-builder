import { Helmet } from "react-helmet-async";
import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";
import { generateComparisonSchema } from "../../utils/schemaGenerators";

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

export default function ResumeGeniusVsEasyFreeResume() {
  const schema = generateComparisonSchema(
    { name: "EasyFreeResume", price: "0" },
    { name: "Resume Genius", price: "95.40" },
    "2026-01-21"
  );

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <BlogLayout
      title="Resume Genius Pricing 2026: Is $7.95/Month Worth It? (Free Alternative)"
      description="Resume Genius charges $7.95-$39.95/month for PDF downloads. See how EasyFreeResume offers the same ATS templates completely free with better privacy."
      publishDate="2026-01-21"
      readTime="8 min"
      keywords={[
        "resume genius pricing",
        "resume genius free",
        "resume genius cost",
        "resume genius alternative",
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
              <p className="font-bold text-green-700 text-lg mb-2">EasyFreeResume</p>
              <StarRating rating={5} />
              <p className="text-3xl font-bold text-green-600 mt-2">$0</p>
              <p className="text-sm text-gray-600">Forever free</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <p className="font-bold text-gray-700 text-lg mb-2">Resume Genius</p>
              <StarRating rating={3} />
              <p className="text-3xl font-bold text-red-600 mt-2">$95+</p>
              <p className="text-sm text-gray-600">Per year</p>
            </div>
          </div>
          <p className="text-green-800 mt-4 text-center font-medium">
            Winner: EasyFreeResume — Same features, zero cost, no subscription traps
          </p>
        </div>

        <p className="text-xl leading-relaxed text-gray-700 font-medium">
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

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Feature Comparison
        </h2>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-gray-200 rounded-xl shadow-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left font-bold text-gray-900">Feature</th>
                <th className="px-6 py-4 text-center font-bold text-green-600">EasyFreeResume</th>
                <th className="px-6 py-4 text-center font-bold text-blue-600">Resume Genius</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Cost</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">100% Free</td>
                <td className="px-6 py-4 text-center text-red-600">$7.95-$39.95/month</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">PDF Downloads</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Unlimited, Free</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Paid only</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Account Required</td>
                <td className="px-6 py-4 text-center text-green-600">✅ No</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Yes</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">ATS Compatibility</td>
                <td className="px-6 py-4 text-center text-green-600">✅ All templates</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Yes</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-400 text-white">Tie</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Privacy</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Local storage</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Cloud storage</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Cover Letter Builder</td>
                <td className="px-6 py-4 text-center text-yellow-600">⚠️ Guides available</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Included (paid)</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-blue-600 text-white">Resume Genius</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Cancellation Hassle</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Nothing to cancel</td>
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

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
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
          <div className="text-green-700 text-center">
            <p className="text-6xl font-bold mb-2">$0</p>
            <p className="text-xl">No trial traps. No auto-renewals. Ever.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          How to Switch from Resume Genius
        </h2>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 my-8">
          <ol className="space-y-4 text-indigo-700">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div>
                <p className="font-medium">Cancel your Resume Genius subscription first</p>
                <p className="text-sm">Contact support or go to account settings (may require calling)</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <p className="font-medium">Copy your resume content</p>
                <p className="text-sm">Download as PDF if subscribed, or copy text manually</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <p className="font-medium">Go to EasyFreeResume.com</p>
                <p className="text-sm">No signup, no credit card, no trial period</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
              <div>
                <p className="font-medium">Build and download—completely free</p>
                <p className="text-sm">Professional PDF, no watermark, unlimited downloads</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="my-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Escape the Subscription Trap
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Build professional resumes without monthly fees.
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Start Building Free
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Related Comparisons
        </h2>

        <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
          <li>
            <Link to="/blog/zety-vs-easy-free-resume" className="text-blue-600 hover:underline">
              Zety vs EasyFreeResume
            </Link>
          </li>
          <li>
            <Link to="/blog/resume-io-vs-easy-free-resume" className="text-blue-600 hover:underline">
              Resume.io vs EasyFreeResume
            </Link>
          </li>
          <li>
            <Link to="/blog/novoresume-vs-easy-free-resume" className="text-blue-600 hover:underline">
              NovoResume vs EasyFreeResume
            </Link>
          </li>
        </ul>
      </div>

      {/* Sticky CTA Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 shadow-lg z-50 md:hidden">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <p className="font-bold text-sm">Switch to Free</p>
            <p className="text-xs opacity-90">Save $95+/year</p>
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
