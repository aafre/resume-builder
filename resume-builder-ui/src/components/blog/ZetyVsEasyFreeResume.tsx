import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import BlogLayout from "../BlogLayout";
import { generateComparisonSchema } from "../../utils/schemaGenerators";
import { EASY_FREE_RESUME_PRODUCT } from "../../data/products";

// Star rating component
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

// Winner badge component
function WinnerBadge() {
  return (
    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">
      WINNER
    </span>
  );
}

export default function ZetyVsEasyFreeResume() {
  const schema = generateComparisonSchema(
    EASY_FREE_RESUME_PRODUCT,
    { name: "Zety", price: "71.40", description: "Online resume builder with templates and cover letters, offering monthly and quarterly subscription plans." },
    "2026-02-03"
  );

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
    <BlogLayout
      title="Zety Pricing 2026: Is It Free? (Real Costs Revealed)"
      description="Zety charges $5.95-$23.95/month with auto-renewing plans. Full 2026 pricing breakdown, hidden costs, and a 100% free alternative. No tricks, no paywalls."
      publishDate="2026-01-28"
      lastUpdated="2026-02-02"
      readTime="9 min"
      keywords={[
        "zety pricing",
        "is zety free",
        "zety cost",
        "zety pricing 2026",
        "zety alternative free",
        "zety alternative",
        "zety vs",
        "zety vs easyfreeresume",
        "free resume builder vs paid",
        "best resume builder reddit",
        "zety resume builder pricing",
        "zety subscription cost",
        "zety plans",
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
              <p className="font-bold text-gray-700 text-lg mb-2">Zety</p>
              <StarRating rating={3} />
              <p className="text-3xl font-bold text-red-600 mt-2">$71+</p>
              <p className="text-sm text-gray-600">Per year</p>
            </div>
          </div>
          <p className="text-green-800 mt-4 text-center font-medium">
            Winner: EasyFreeResume — Same quality templates, zero cost, better privacy
          </p>
        </div>

        <p className="text-xl leading-relaxed text-gray-700 font-medium">
          When it comes to online resume builders, Zety is one of the biggest
          names in the game. It has a slick interface and lots of features. But
          it also comes with a price tag.
        </p>

        <p className="text-lg leading-relaxed text-gray-700">
          So, is it worth paying for a resume builder like Zety when a
          completely free alternative like EasyFreeResume exists? Let's break it
          down in a head-to-head comparison.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-blue-800 mb-3">
            🎯 Bottom Line Up Front
          </h3>
          <p className="text-blue-700">
            After testing both platforms extensively, we found that
            EasyFreeResume provides all the essential features you need to
            create a professional, ATS-friendly resume - without the monthly
            subscription fees.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          The Core Features: What Do You Get?
        </h2>

        <p className="text-lg leading-relaxed text-gray-700">
          Let's compare the essential features that matter most when building a
          resume.
        </p>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-gray-200 rounded-xl shadow-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left font-bold text-gray-900">
                  Feature
                </th>
                <th className="px-6 py-4 text-center font-bold text-green-600">
                  EasyFreeResume
                </th>
                <th className="px-6 py-4 text-center font-bold text-blue-600">
                  Zety
                </th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">
                  Winner
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Cost</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">
                  100% Free
                </td>
                <td className="px-6 py-4 text-center text-red-600">
                  $5.95 - $23.95/month
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">
                    EasyFreeResume
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">
                  PDF Downloads
                </td>
                <td className="px-6 py-4 text-center text-green-600">
                  ✅ Unlimited, No Watermark
                </td>
                <td className="px-6 py-4 text-center text-red-600">
                  ❌ Requires paid plan
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">
                    EasyFreeResume
                  </span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  Sign-Up Required
                </td>
                <td className="px-6 py-4 text-center text-green-600">✅ No</td>
                <td className="px-6 py-4 text-center text-red-600">
                  ❌ Yes, mandatory
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">
                    EasyFreeResume
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ATS-Friendly Templates
                </td>
                <td className="px-6 py-4 text-center text-green-600">
                  ✅ All templates optimized
                </td>
                <td className="px-6 py-4 text-center text-green-600">✅ Yes</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-400 text-white">
                    Tie
                  </span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">Privacy</td>
                <td className="px-6 py-4 text-center text-green-600">
                  ✅ Local storage only
                </td>
                <td className="px-6 py-4 text-center text-red-600">
                  ❌ Data stored on servers
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">
                    EasyFreeResume
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">
                  Ease of Use
                </td>
                <td className="px-6 py-4 text-center text-green-600">
                  ✅ Simple, intuitive editor
                </td>
                <td className="px-6 py-4 text-center text-green-600">
                  ✅ User-friendly interface
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-400 text-white">
                    Tie
                  </span>
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  Multiple Resume Versions
                </td>
                <td className="px-6 py-4 text-center text-green-600">
                  ✅ Unlimited
                </td>
                <td className="px-6 py-4 text-center text-yellow-600">
                  ⚠️ Limited on free plan
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">
                    EasyFreeResume
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
          <p className="font-bold text-green-800">
            Score: EasyFreeResume 5 — Zety 0 — Ties 2
            <WinnerBadge />
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          The "Premium" Features: What Are You Paying For?
        </h2>

        <p className="text-lg leading-relaxed text-gray-700">
          Zety justifies its cost with a few "premium" features that
          EasyFreeResume doesn't have. Let's look at them honestly.
        </p>

        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-purple-800 mb-4">
              🤖 AI-Powered Content Suggestions
            </h3>
            <div className="text-purple-700">
              <p className="mb-3">
                <strong>Zety offers:</strong> Pre-written bullet points and
                suggestions for your experience.
              </p>
              <p className="mb-3">
                <strong>Our take:</strong> While this can be helpful for
                inspiration, it often leads to generic, uninspired resumes. We
                believe the best resume is one that uses <em>your</em> unique
                voice to describe <em>your</em> specific accomplishments.
              </p>
              <div className="bg-white p-4 rounded-lg text-sm">
                <p className="font-medium mb-2">
                  💡 EasyFreeResume Alternative:
                </p>
                <p>
                  Use our comprehensive blog guides (like{" "}
                  <Link
                    to="/blog/resume-action-verbs"
                    className="text-blue-600 underline"
                  >
                    Action Verbs for Resumes
                  </Link>{" "}
                  or{" "}
                  <Link
                    to="/blog/chatgpt-resume-prompts"
                    className="text-blue-600 underline"
                  >
                    ChatGPT Resume Prompts
                  </Link>
                  ) to write compelling, personalized content.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              📄 Cover Letter Builder
            </h3>
            <div className="text-blue-700">
              <p className="mb-3">
                <strong>Zety offers:</strong> A matching cover letter builder
                with their resume templates.
              </p>
              <p className="mb-3">
                <strong>Our take:</strong> This is a nice feature, but there are
                many excellent, free cover letter templates and guides available
                online (including on our blog!).
              </p>
              <div className="bg-white p-4 rounded-lg text-sm">
                <p className="font-medium mb-2">
                  💡 EasyFreeResume Alternative:
                </p>
                <p>
                  Check out our{" "}
                  <Link
                    to="/blog/cover-letter-guide"
                    className="text-blue-600 underline"
                  >
                    Cover Letter Writing Guide
                  </Link>{" "}
                  for templates and tips.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-yellow-800 mb-4">
              📊 Resume Score
            </h3>
            <div className="text-yellow-700">
              <p className="mb-3">
                <strong>Zety offers:</strong> A "score" to rate your resume's
                strength with suggestions for improvement.
              </p>
              <p className="mb-3">
                <strong>Our take:</strong> These scores can be arbitrary and are
                often designed to encourage you to use more of their paid
                features. A better measure of your resume's strength is whether
                it's getting you interviews.
              </p>
              <div className="bg-white p-4 rounded-lg text-sm">
                <p className="font-medium mb-2">
                  💡 EasyFreeResume Alternative:
                </p>
                <p>
                  Use our{" "}
                  <Link
                    to="/blog/ats-resume-optimization"
                    className="text-blue-600 underline"
                  >
                    ATS Optimization Guide
                  </Link>{" "}
                  or{" "}
                  <Link
                    to="/blog/ai-resume-review"
                    className="text-blue-600 underline"
                  >
                    AI Resume Review Guide
                  </Link>{" "}
                  for real-world resume improvement strategies.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          The Privacy Factor: A Major Difference
        </h2>

        <p className="text-lg leading-relaxed text-gray-700">
          This is one of the most important distinctions between the two
          platforms.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-800 mb-4">
              🔒 EasyFreeResume Privacy
              <WinnerBadge />
            </h3>
            <ul className="space-y-3 text-green-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Your resume data never leaves your computer</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Saved in your browser's local storage</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>We have no access to your personal information</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>No account creation required</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Complete control over your data</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-red-800 mb-4">
              🚨 Zety Privacy Concerns
            </h3>
            <ul className="space-y-3 text-red-700">
              <li className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">×</span>
                <span>Mandatory account creation</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">×</span>
                <span>All data stored on their servers</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">×</span>
                <span>Personal information collected and stored</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">×</span>
                <span>Subject to data breaches and privacy policies</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">×</span>
                <span>Limited control over your personal data</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-gray-800 mb-3">
            🔍 Privacy Reality Check
          </h3>
          <p className="text-gray-700">
            For users who value privacy, EasyFreeResume's approach is a clear
            winner. In an age of data breaches and privacy concerns, keeping
            your sensitive career information on your own device is a
            significant advantage.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Cost Analysis: The Real Price of Zety
        </h2>

        <p className="text-lg leading-relaxed text-gray-700">
          Let's break down what you're actually paying for with Zety's
          subscription model.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-red-800 mb-4">
            💰 Zety Pricing 2026 Breakdown
          </h3>
          <div className="space-y-4 text-red-700">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-red-200">
                    <th className="text-left py-2 font-bold">Plan</th>
                    <th className="text-left py-2 font-bold">Price</th>
                    <th className="text-left py-2 font-bold">Annual Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  <tr>
                    <td className="py-2">Monthly</td>
                    <td className="py-2">$23.95/month</td>
                    <td className="py-2">$287.40/year</td>
                  </tr>
                  <tr>
                    <td className="py-2">Quarterly</td>
                    <td className="py-2">$11.95/month</td>
                    <td className="py-2">$143.40/year</td>
                  </tr>
                  <tr>
                    <td className="py-2">Annual (Most Popular)</td>
                    <td className="py-2">$5.95/month</td>
                    <td className="py-2">$71.40/year (billed upfront)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <p className="font-medium">Watch out for:</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Automatic renewal (easy to forget to cancel)</li>
                <li>Limited access if you stop paying</li>
                <li>No access to your resumes without subscription</li>
                <li>Free tier only lets you build - downloading requires payment</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-green-800 mb-4">
            💚 EasyFreeResume Cost
            <WinnerBadge />
          </h3>
          <div className="text-green-700 text-center">
            <p className="text-6xl font-bold mb-2">$0</p>
            <p className="text-xl">Forever. No tricks.</p>
            <p className="text-sm mt-4">
              What could you do with that extra $71-$287 per year? Professional
              development courses, interview clothes, networking events, or
              interview coaching with tools like PrepAI.
            </p>
          </div>
        </div>

        {/* How to Switch Section */}
        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          How to Switch from Zety to EasyFreeResume
        </h2>

        <p className="text-lg leading-relaxed text-gray-700 mb-6">
          Already using Zety? Here's how to migrate your resume:
        </p>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 my-8">
          <ol className="space-y-4 text-indigo-700">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div>
                <p className="font-medium">Export your content from Zety</p>
                <p className="text-sm">Download your resume as PDF or copy your text content</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <p className="font-medium">Go to EasyFreeResume.com</p>
                <p className="text-sm">No sign-up needed — start building immediately</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <p className="font-medium">Choose an ATS-friendly template</p>
                <p className="text-sm">All our templates are optimized for applicant tracking systems</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
              <div>
                <p className="font-medium">Paste your content and customize</p>
                <p className="text-sm">Our editor makes it easy to format your resume</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
              <div>
                <p className="font-medium">Download free PDF — no watermark</p>
                <p className="text-sm">Cancel your Zety subscription and save $71+/year</p>
              </div>
            </li>
          </ol>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          User Experience: How Do They Actually Feel to Use?
        </h2>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-4">
              EasyFreeResume Experience
            </h3>
            <div className="space-y-3 text-blue-700">
              <div>
                <p className="font-medium">✅ Pros:</p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Instant access - no signup required</li>
                  <li>Clean, distraction-free interface</li>
                  <li>Fast loading and responsive</li>
                  <li>No pressure or upselling</li>
                  <li>Focus purely on resume building</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">⚠️ Considerations:</p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Fewer bells and whistles</li>
                  <li>No built-in AI content suggestions</li>
                  <li>Relies on your own writing skills</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-4">
              Zety Experience
            </h3>
            <div className="space-y-3 text-purple-700">
              <div>
                <p className="font-medium">✅ Pros:</p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Polished, professional interface</li>
                  <li>Helpful content suggestions</li>
                  <li>Comprehensive feature set</li>
                  <li>Cover letter integration</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">❌ Cons:</p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Constant upselling and upgrade prompts</li>
                  <li>Can't download without paying</li>
                  <li>Account creation barrier</li>
                  <li>Subscription pressure</li>
                  <li>Feature limitations on free version</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          The Verdict: When Should You Pay for a Resume Builder?
        </h2>

        <p className="text-lg leading-relaxed text-gray-700">
          After thorough testing and analysis, here's our honest assessment:
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-yellow-800 mb-4">
            🎯 Zety Might Be Worth It If:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-yellow-700">
            <li>
              You're completely new to resume writing and need extensive
              hand-holding
            </li>
            <li>You have significant budget and prefer all-in-one solutions</li>
            <li>You value AI content suggestions over personalized writing</li>
            <li>
              You need cover letters and other documents in matching designs
            </li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-green-800 mb-4">
            ✅ EasyFreeResume is Perfect If:
            <WinnerBadge />
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-green-700">
            <li>You want complete control over your resume content and data</li>
            <li>
              You prefer to invest money in other career development areas
            </li>
            <li>
              You value privacy and don't want to share personal information
            </li>
            <li>
              You need a straightforward, no-nonsense resume building tool
            </li>
            <li>You're comfortable writing your own content with guidance</li>
            <li>You want unlimited access without subscription worries</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Beyond Resume Building: The Complete Job Search Strategy
        </h2>

        <p className="text-lg leading-relaxed text-gray-700">
          Whether you choose a free or paid resume builder, remember that your
          resume is just one piece of your job search puzzle. Here's how to
          maximize your success:
        </p>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-indigo-800 mb-4">
            🚀 Complete Job Search Stack:
          </h3>
          <div className="space-y-4 text-indigo-700">
            <div>
              <p className="font-medium">
                1. Professional Resume (EasyFreeResume)
              </p>
              <p className="text-sm">
                ATS-optimized, keyword-rich, and tailored to each application
              </p>
            </div>
            <div>
              <p className="font-medium">2. Interview Preparation (PrepAI)</p>
              <p className="text-sm">
                Practice with AI-powered mock interviews based on your actual CV
              </p>
            </div>
            <div>
              <p className="font-medium">3. Knowledge & Strategy (Our Blog)</p>
              <p className="text-sm">
                Stay current with guides like our{" "}
                <Link
                  to="/blog/how-to-write-a-resume-guide"
                  className="underline"
                >
                  Complete Resume Writing Guide
                </Link>
              </p>
            </div>
            <div>
              <p className="font-medium">4. Networking & Applications</p>
              <p className="text-sm">
                Combine online applications with direct outreach
              </p>
            </div>
          </div>
        </div>

        <div className="my-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Save $71+ Per Year?
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Start with EasyFreeResume — it's actually free, no tricks
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Build Your Free Resume Now
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Final Recommendation
        </h2>

        <p className="text-lg leading-relaxed text-gray-700">
          For the vast majority of job seekers - especially those who value
          privacy, hate hidden fees, and want a straightforward tool to create a
          professional document -{" "}
          <strong>a free builder is more than enough.</strong>
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-6">
          EasyFreeResume provides all the essential tools you need to create a
          high-quality, ATS-friendly resume without the cost. We believe that
          with a little guidance from our comprehensive blog guides, you can
          write far more compelling content than any AI suggestion.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <h4 className="font-bold text-blue-800 mb-3">💡 Our Philosophy</h4>
          <p className="text-blue-700">
            Your career success shouldn't depend on your ability to pay for
            basic tools. Invest your money in skills development, professional
            certifications, networking events, or interview coaching. Save the
            subscription fees and put that money toward your professional growth
            instead.
          </p>
        </div>

        <p className="text-lg leading-relaxed text-gray-700 mt-8">
          Ready to see the difference? Try our free builder and see for yourself
          why thousands of job seekers choose EasyFreeResume over paid
          alternatives. You have nothing to lose - except maybe a monthly
          subscription fee.
        </p>

        {/* Compare Other Resume Builders */}
        <div className="bg-gray-50 rounded-xl p-6 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Compare Other Resume Builders</h2>
          <p className="text-gray-600 mb-4">See how other popular resume builders compare on pricing, features, and hidden costs:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <li><Link to="/blog/resume-io-vs-easy-free-resume" className="text-blue-600 hover:underline">Resume.io Pricing Breakdown</Link></li>
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
            <p className="text-xs opacity-90">Save $71+/year</p>
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
