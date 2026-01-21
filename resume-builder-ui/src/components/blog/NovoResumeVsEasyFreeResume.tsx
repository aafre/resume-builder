import { useEffect } from "react";
import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";
import { generateComparisonSchema } from "../../utils/schemaGenerators";

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
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

export default function NovoResumeVsEasyFreeResume() {
  useEffect(() => {
    const schema = generateComparisonSchema(
      { name: "EasyFreeResume", rating: 4.8, price: "0" },
      { name: "NovoResume", rating: 3.8, price: "99.00" },
      "2026-01-21"
    );

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    script.id = "comparison-schema";
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById("comparison-schema");
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <BlogLayout
      title="NovoResume Pricing 2026: Premium Templates Free Alternative"
      description="NovoResume's premium plans cost $16-$99/year. Compare features with EasyFreeResume, a 100% free alternative with ATS-friendly templates and better privacy."
      publishDate="2026-01-21"
      readTime="7 min"
      keywords={[
        "novoresume pricing",
        "novoresume free",
        "novoresume premium",
        "novoresume alternative",
        "novoresume vs easyfreeresume",
        "free resume builder",
        "novoresume review",
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
              <p className="text-sm text-gray-600">All features free</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <p className="font-bold text-gray-700 text-lg mb-2">NovoResume</p>
              <StarRating rating={4} />
              <p className="text-3xl font-bold text-red-600 mt-2">$99</p>
              <p className="text-sm text-gray-600">Per year (Premium)</p>
            </div>
          </div>
          <p className="text-green-800 mt-4 text-center font-medium">
            Winner: EasyFreeResume — Professional templates without the premium price
          </p>
        </div>

        <p className="text-xl leading-relaxed text-gray-700 font-medium">
          NovoResume has gained popularity for its clean, modern templates—especially among
          European job seekers. But the best templates require a premium subscription.
          Here's how it compares to a completely free alternative.
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
                <th className="px-6 py-4 text-center font-bold text-blue-600">NovoResume</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Cost</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">100% Free</td>
                <td className="px-6 py-4 text-center text-red-600">Free tier / $16-$99/yr premium</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">PDF Downloads</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Unlimited, Free</td>
                <td className="px-6 py-4 text-center text-yellow-600">⚠️ Limited free, unlimited premium</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Premium Templates</td>
                <td className="px-6 py-4 text-center text-green-600">✅ All templates free</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Best locked behind paywall</td>
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
                <td className="px-6 py-4 font-medium text-gray-900">Account Required</td>
                <td className="px-6 py-4 text-center text-green-600">✅ No</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Yes</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Privacy</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Local storage</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Cloud storage</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">European CV Format</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Supported</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Specialized</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-400 text-white">Tie</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
          <p className="font-bold text-green-800">
            Score: EasyFreeResume 5 — NovoResume 0 — Ties 2
            <WinnerBadge />
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          NovoResume Pricing Breakdown
        </h2>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-red-800 mb-4">💰 NovoResume 2026 Pricing</h3>
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
                  <td className="py-2">Basic templates, limited downloads</td>
                </tr>
                <tr>
                  <td className="py-2">Monthly Premium</td>
                  <td className="py-2">$16/month</td>
                  <td className="py-2">All templates, unlimited downloads</td>
                </tr>
                <tr>
                  <td className="py-2">Quarterly</td>
                  <td className="py-2">$12/month</td>
                  <td className="py-2">$36 billed quarterly</td>
                </tr>
                <tr>
                  <td className="py-2">Annual</td>
                  <td className="py-2">$8.25/month</td>
                  <td className="py-2">$99 billed annually</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-red-600 text-sm mt-4">
            ⚠️ Free tier has NovoResume branding on PDF and limits customization options.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-green-800 mb-4">
            💚 EasyFreeResume Cost
            <WinnerBadge />
          </h3>
          <div className="text-green-700 text-center">
            <p className="text-6xl font-bold mb-2">$0</p>
            <p className="text-xl">All templates. No branding. No limits.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          What NovoResume Does Well
        </h2>

        <p className="text-lg leading-relaxed text-gray-700 mb-4">
          To be fair, NovoResume has some strengths:
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-8">
          <li>Clean, modern template designs</li>
          <li>Good support for European CV formats (Europass)</li>
          <li>Cover letter builder included</li>
          <li>Website builder for online portfolios</li>
        </ul>

        <p className="text-lg leading-relaxed text-gray-700">
          However, these extra features come at a cost. If you just need a professional,
          ATS-friendly resume, you can get that for free elsewhere.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          How to Switch from NovoResume
        </h2>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 my-8">
          <ol className="space-y-4 text-indigo-700">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div>
                <p className="font-medium">Export your NovoResume content</p>
                <p className="text-sm">Download as PDF or copy the text from each section</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <p className="font-medium">Cancel premium if subscribed</p>
                <p className="text-sm">Account Settings → Subscription → Cancel</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <p className="font-medium">Visit EasyFreeResume.com</p>
                <p className="text-sm">Start immediately—no signup required</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
              <div>
                <p className="font-medium">Choose a template and recreate your resume</p>
                <p className="text-sm">Download unlimited PDFs with no watermarks</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="my-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Premium Templates Without the Premium Price
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Professional, ATS-optimized resumes—completely free.
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
            <Link to="/blog/enhancv-vs-easy-free-resume" className="text-blue-600 hover:underline">
              Enhancv vs EasyFreeResume
            </Link>
          </li>
          <li>
            <Link to="/blog/flowcv-vs-easy-free-resume" className="text-blue-600 hover:underline">
              FlowCV vs EasyFreeResume
            </Link>
          </li>
        </ul>
      </div>

      {/* Sticky CTA Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 shadow-lg z-50 md:hidden">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <p className="font-bold text-sm">Skip the Premium</p>
            <p className="text-xs opacity-90">Save $99/year</p>
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
  );
}
