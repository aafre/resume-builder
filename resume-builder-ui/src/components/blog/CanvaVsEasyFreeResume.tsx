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

export default function CanvaVsEasyFreeResume() {
  const schema = generateComparisonSchema(
    EASY_FREE_RESUME_PRODUCT,
    { name: "Canva", price: "0", description: "Free graphic design platform with resume templates, offering a Pro tier for premium features." },
    "2026-02-04"
  );

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
    <BlogLayout
      title="Canva Resume Builder 2026: Limitations & Free Alternative"
      description="Canva resume templates look great but often fail ATS scans. See how EasyFreeResume compares: ATS pass rates, PDF export, and which free builder gets more interviews."
      publishDate="2026-01-21"
      lastUpdated="2026-02-04"
      readTime="8 min"
      keywords={[
        "canva resume template",
        "canva resume ats",
        "canva resume builder",
        "canva resume alternative",
        "canva resume vs",
        "canva vs easyfreeresume",
        "are canva resumes ats friendly",
        "ats friendly resume",
        "canva resume problems",
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
              <p className="text-2xl font-bold text-green-600 mt-2">ATS-Optimized</p>
              <p className="text-sm text-gray-600">Built for job applications</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <p className="font-bold text-gray-700 text-lg mb-2">Canva</p>
              <StarRating rating={3} />
              <p className="text-2xl font-bold text-red-600 mt-2">ATS Problems</p>
              <p className="text-sm text-gray-600">Designed for visuals, not ATS</p>
            </div>
          </div>
          <p className="text-green-800 mt-4 text-center font-medium">
            Winner: EasyFreeResume — For actual job applications, ATS compatibility matters
          </p>
        </div>

        <p className="text-xl leading-relaxed text-gray-700 font-medium">
          Canva is fantastic for graphics, social media posts, and presentations. But for
          resumes that need to pass through Applicant Tracking Systems? That's where
          Canva's beautiful templates often fail.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-red-800 mb-3">
            ⚠️ The Canva Resume Problem
          </h3>
          <p className="text-red-700">
            Over 75% of companies use ATS software to filter resumes before a human sees them.
            Canva templates—with their graphics, columns, and creative layouts—often get
            mangled or rejected by these systems, meaning your application never reaches a recruiter.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Why Canva Resumes Fail ATS
        </h2>

        <div className="space-y-4 my-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">1. Graphics and Icons</h3>
            <p className="text-gray-700">
              Canva templates often use icons for contact info, skill ratings, and section headers.
              ATS can't read images—it just sees blank space where your phone number should be.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">2. Multi-Column Layouts</h3>
            <p className="text-gray-700">
              Those trendy two-column designs look great but confuse ATS. The system reads
              left-to-right, line-by-line, mixing up your skills with your job titles.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">3. Text Boxes</h3>
            <p className="text-gray-700">
              Canva uses text boxes for layout control. Some ATS systems can't extract text
              from these boxes properly, resulting in jumbled or missing content.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">4. Non-Standard Fonts</h3>
            <p className="text-gray-700">
              Canva's creative fonts might not be recognized by ATS, causing text to appear
              as garbled characters or not parse at all.
            </p>
          </div>
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
                <th className="px-6 py-4 text-center font-bold text-blue-600">Canva</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">ATS Compatibility</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">✅ 100% optimized</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Often fails</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Cost</td>
                <td className="px-6 py-4 text-center text-green-600">✅ 100% Free</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Free tier available</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-400 text-white">Tie</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Resume-Specific</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Built for resumes</td>
                <td className="px-6 py-4 text-center text-yellow-600">⚠️ General design tool</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Account Required</td>
                <td className="px-6 py-4 text-center text-green-600">✅ No</td>
                <td className="px-6 py-4 text-center text-red-600">❌ Yes</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
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
                <td className="px-6 py-4 font-medium text-gray-900">Template Variety</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Professional options</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Thousands of designs</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-blue-600 text-white">Canva</span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Learning Curve</td>
                <td className="px-6 py-4 text-center text-green-600">✅ Simple, focused</td>
                <td className="px-6 py-4 text-center text-yellow-600">⚠️ More complex</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
          <p className="font-bold text-green-800">
            Score: EasyFreeResume 5 — Canva 1 — Ties 1
            <WinnerBadge />
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          When to Use Canva vs EasyFreeResume
        </h2>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-4">
              Use Canva When:
            </h3>
            <ul className="space-y-2 text-blue-700">
              <li>✓ Applying to a small company without ATS</li>
              <li>✓ Handing resume directly to someone</li>
              <li>✓ Creative roles where design is evaluated</li>
              <li>✓ Portfolio pieces or personal branding</li>
              <li>✓ Networking events and job fairs</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-800 mb-4">
              Use EasyFreeResume When:
              <WinnerBadge />
            </h3>
            <ul className="space-y-2 text-green-700">
              <li>✓ Applying through job portals (LinkedIn, Indeed)</li>
              <li>✓ Corporate or enterprise companies</li>
              <li>✓ Any online application system</li>
              <li>✓ You want maximum ATS compatibility</li>
              <li>✓ You value privacy and simplicity</li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          How to Switch from Canva
        </h2>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 my-8">
          <ol className="space-y-4 text-indigo-700">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div>
                <p className="font-medium">Copy your content from Canva</p>
                <p className="text-sm">Open your Canva resume and copy all text sections</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <p className="font-medium">Go to EasyFreeResume.com</p>
                <p className="text-sm">No signup needed—start immediately</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <p className="font-medium">Choose an ATS-friendly template</p>
                <p className="text-sm">All our templates are designed for ATS compatibility</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
              <div>
                <p className="font-medium">Paste and format your content</p>
                <p className="text-sm">Download your ATS-ready PDF for free</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-yellow-800 mb-3">
            💡 Pro Tip: Have Both Versions
          </h3>
          <p className="text-yellow-700">
            Keep your Canva version for in-person networking and your EasyFreeResume version
            for online applications. This gives you the best of both worlds.
          </p>
        </div>

        <div className="my-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Get Past the ATS, Get Interviews
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Build an ATS-optimized resume in minutes—completely free.
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Build Your ATS Resume
          </Link>
        </div>

        <CompareBuildersCrossLinks excludePath="/blog/canva-resume-vs-easy-free-resume" />
      </div>

      {/* Sticky CTA Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 shadow-lg z-50 md:hidden">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <p className="font-bold text-sm">ATS-Friendly Templates</p>
            <p className="text-xs opacity-90">100% Free</p>
          </div>
          <Link
            to="/templates"
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-bold text-sm shadow hover:shadow-md transition-all"
          >
            Build Free
          </Link>
        </div>
      </div>
    </BlogLayout>
    </>
  );
}
