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

export default function IndeedVsEasyFreeResume() {
  const schema = generateComparisonSchema(
    EASY_FREE_RESUME_PRODUCT,
    { name: "Indeed Resume Builder", price: "0", description: "Free resume builder integrated into the Indeed job search platform." },
    "2026-02-10"
  );

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <BlogLayout
        title="Indeed Resume Builder vs EasyFreeResume (2026) — Which Is Better?"
        description="Indeed's resume builder is free but limited. Compare Indeed vs EasyFreeResume on templates, ATS optimization, privacy, and download options."
        publishDate="2026-02-10"
        lastUpdated="2026-02-10"
        readTime="8 min"
        keywords={[
          "indeed resume builder",
          "indeed resume",
          "indeed resume builder review",
          "indeed resume alternative",
          "indeed resume builder vs",
          "indeed resume download",
          "indeed resume builder free",
          "free resume builder",
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
                <p className="text-2xl font-bold text-accent mt-2">Full Control</p>
                <p className="text-sm text-stone-warm">Templates, PDF, privacy</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <p className="font-bold text-stone-warm text-lg mb-2">Indeed</p>
                <StarRating rating={3} />
                <p className="text-2xl font-bold text-yellow-600 mt-2">Limited</p>
                <p className="text-sm text-stone-warm">Basic builder, Indeed-only focus</p>
              </div>
            </div>
            <p className="text-green-800 mt-4 text-center font-medium">
              Winner: EasyFreeResume — More templates, better privacy, ATS-optimized PDFs
            </p>
          </div>

          <p className="text-xl leading-relaxed text-stone-warm font-medium">
            Indeed is the world's largest job search engine, and it offers a built-in resume builder.
            But "built-in" doesn't mean "best." Indeed's resume tool is designed to keep you on their
            platform — not to give you the most professional, flexible resume possible.
          </p>

          <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
            Indeed Resume Builder: What You Get
          </h2>

          <p className="text-lg leading-relaxed text-stone-warm mb-6">
            Indeed's resume builder is free and built into their job search platform. You fill in
            your details, and Indeed generates a simple resume you can use when applying to jobs
            on Indeed. Here's the catch:
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-2">1. Limited Template Options</h3>
              <p className="text-stone-warm">
                Indeed offers a single, basic resume format. You can't choose between modern, classic,
                or creative layouts. Your resume looks the same as millions of other Indeed applicants.
              </p>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-2">2. Platform Lock-In</h3>
              <p className="text-stone-warm">
                Indeed resumes are optimized for applying through Indeed. While you can download a PDF,
                the formatting may not be ideal for applications on other platforms like LinkedIn,
                company career pages, or email submissions.
              </p>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-2">3. Privacy Concerns</h3>
              <p className="text-stone-warm">
                Your Indeed resume is stored on Indeed's servers and can be made visible to recruiters.
                Indeed may use your data for advertising and job matching purposes. You have limited
                control over who sees your information.
              </p>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-2">4. Basic Customization</h3>
              <p className="text-stone-warm">
                Indeed's editor offers minimal formatting control. You can't adjust fonts, colors,
                spacing, or section order the way you can with a dedicated resume builder.
              </p>
            </div>
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
                  <th className="px-6 py-4 text-center font-bold text-accent">Indeed</th>
                  <th className="px-6 py-4 text-center font-bold text-stone-warm">Winner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                <tr>
                  <td className="px-6 py-4 font-medium text-ink">Cost</td>
                  <td className="px-6 py-4 text-center text-accent">✅ Free</td>
                  <td className="px-6 py-4 text-center text-accent">✅ Free</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-400 text-white">Tie</span>
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-6 py-4 font-medium text-ink">Template Variety</td>
                  <td className="px-6 py-4 text-center text-accent font-bold">✅ Multiple ATS templates</td>
                  <td className="px-6 py-4 text-center text-red-600">❌ Single format</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-ink">ATS Optimization</td>
                  <td className="px-6 py-4 text-center text-accent">✅ All templates ATS-ready</td>
                  <td className="px-6 py-4 text-center text-accent">✅ Basic ATS compatibility</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-6 py-4 font-medium text-ink">Account Required</td>
                  <td className="px-6 py-4 text-center text-accent">✅ No</td>
                  <td className="px-6 py-4 text-center text-red-600">❌ Yes (Indeed account)</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-ink">Privacy</td>
                  <td className="px-6 py-4 text-center text-accent">✅ Local storage</td>
                  <td className="px-6 py-4 text-center text-red-600">❌ Indeed stores data</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-6 py-4 font-medium text-ink">PDF Download</td>
                  <td className="px-6 py-4 text-center text-accent">✅ Instant, no watermarks</td>
                  <td className="px-6 py-4 text-center text-yellow-600">⚠️ Available but basic</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-ink">Customization</td>
                  <td className="px-6 py-4 text-center text-accent">✅ Full control</td>
                  <td className="px-6 py-4 text-center text-red-600">❌ Minimal</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-6 py-4 font-medium text-ink">AI Features</td>
                  <td className="px-6 py-4 text-center text-accent">✅ ChatGPT, Claude, Gemini</td>
                  <td className="px-6 py-4 text-center text-yellow-600">⚠️ Basic suggestions</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">EasyFreeResume</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
            <p className="font-bold text-green-800">
              Score: EasyFreeResume 7 — Indeed 0 — Ties 1
              <WinnerBadge />
            </p>
          </div>

          <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
            When to Use Indeed's Resume Builder
          </h2>

          <p className="text-lg leading-relaxed text-stone-warm mb-4">
            Indeed's builder has one clear advantage: convenience. If you're exclusively applying
            through Indeed and want the fastest possible setup, it works. But for serious job
            seekers applying across multiple platforms, a dedicated resume builder is the better choice.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-ink mb-4">
                Use Indeed When:
              </h3>
              <ul className="space-y-2 text-ink/80">
                <li>✓ Only applying through Indeed</li>
                <li>✓ Need a resume in under 2 minutes</li>
                <li>✓ Don't care about design options</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-800 mb-4">
                Use EasyFreeResume When:
                <WinnerBadge />
              </h3>
              <ul className="space-y-2 text-accent">
                <li>✓ Applying to multiple platforms</li>
                <li>✓ Want professional, unique templates</li>
                <li>✓ Need maximum ATS compatibility</li>
                <li>✓ Value privacy and data control</li>
                <li>✓ Want AI writing assistance</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
            FAQ: Indeed Resume Builder
          </h2>

          <div className="space-y-4 my-8">
            <div className="bg-chalk-dark border border-black/[0.06] rounded-lg p-4">
              <h4 className="font-bold text-ink mb-2">Is Indeed resume builder free?</h4>
              <p className="text-stone-warm text-sm">
                Yes, Indeed's resume builder is completely free. However, it requires an Indeed account, stores your data on their servers, and offers only one basic template format.
              </p>
            </div>
            <div className="bg-chalk-dark border border-black/[0.06] rounded-lg p-4">
              <h4 className="font-bold text-ink mb-2">Can I download my Indeed resume as a PDF?</h4>
              <p className="text-stone-warm text-sm">
                Yes, Indeed allows PDF downloads of your resume. However, the formatting is basic and may not stand out compared to resumes built with dedicated resume builders that offer multiple professional templates.
              </p>
            </div>
            <div className="bg-chalk-dark border border-black/[0.06] rounded-lg p-4">
              <h4 className="font-bold text-ink mb-2">Is an Indeed resume ATS-friendly?</h4>
              <p className="text-stone-warm text-sm">
                Indeed resumes have basic ATS compatibility since they use simple text formatting. However, they lack the ATS-specific optimizations (proper heading hierarchy, keyword placement, clean HTML structure) that dedicated resume builders provide.
              </p>
            </div>
            <div className="bg-chalk-dark border border-black/[0.06] rounded-lg p-4">
              <h4 className="font-bold text-ink mb-2">Can employers see my Indeed resume?</h4>
              <p className="text-stone-warm text-sm">
                If you make your Indeed resume public, any employer on Indeed can search for and view it. This is a privacy consideration — with EasyFreeResume, your resume data stays in your browser (or private cloud account) and is never visible to third parties.
              </p>
            </div>
          </div>

          <div className="my-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Build a Better Resume Than Indeed Offers
            </h3>
            <p className="text-xl mb-6 opacity-90">
              Professional templates, ATS optimization, and full privacy — completely free.
            </p>
            <Link
              to="/templates"
              className="inline-block bg-white text-accent px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Build Your Free Resume
            </Link>
          </div>

          <CompareBuildersCrossLinks excludePath="/easyfreeresume-vs-indeed-resume-builder" />
        </div>

        {/* Spacer for sticky mobile CTA */}
        <div className="h-16 md:hidden" aria-hidden="true" />

        {/* Sticky CTA Banner */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 shadow-lg z-50 md:hidden">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div>
              <p className="font-bold text-sm">Better Than Indeed</p>
              <p className="text-xs opacity-90">100% Free</p>
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
