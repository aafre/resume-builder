import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";
import CopyablePrompt from "../shared/CopyablePrompt";

export default function AIResumeReview() {
  return (
    <BlogLayout
      title="How to Use AI to Review Your Resume (Get Feedback Before Applying)"
      description="Learn to use ChatGPT, Claude, and other AI tools to review your resume for errors, improvements, and ATS optimization before submitting applications."
      publishDate="2026-01-21"
      readTime="8 min"
      keywords={[
        "ai resume review",
        "chatgpt resume review",
        "ai resume feedback",
        "resume review ai",
        "ai resume checker",
        "get resume reviewed by ai",
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Before submitting your resume, get a second opinion. AI can catch errors you've missed,
          suggest improvements, and identify issues that might cause your application to be rejected.
          Here's how to use AI effectively for resume review.
        </p>

        {/* Quick Answer Box */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-green-800 mb-3">
            🎯 What AI Can Check in Your Resume
          </h3>
          <ul className="space-y-2 text-accent">
            <li><strong>Grammar & Spelling:</strong> Catch typos and errors</li>
            <li><strong>Consistency:</strong> Tense, punctuation, formatting</li>
            <li><strong>Impact:</strong> Weak vs. strong language</li>
            <li><strong>ATS Optimization:</strong> Keyword coverage</li>
            <li><strong>Red Flags:</strong> Gaps, job hopping, missing info</li>
            <li><strong>Content Quality:</strong> Achievements vs. duties</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          The Complete Resume Review Prompt
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-4">
          Use this comprehensive prompt for a full review:
        </p>

        <CopyablePrompt title="Master Review Prompt">
            Review my resume thoroughly. I want honest, critical feedback.<br /><br />
            [PASTE YOUR RESUME]<br /><br />
            Check for:<br /><br />
            **1. TECHNICAL ERRORS**<br />
            - Grammar and spelling<br />
            - Punctuation consistency<br />
            - Tense consistency (past vs. present)<br />
            - Date formatting<br />
            - Number formatting<br /><br />
            **2. CONTENT QUALITY**<br />
            - Are bullets achievement-focused or just duties?<br />
            - Is there quantification where possible?<br />
            - Are action verbs strong?<br />
            - Is anything vague or unclear?<br /><br />
            **3. RED FLAGS**<br />
            - Employment gaps<br />
            - Job hopping concerns<br />
            - Missing expected information<br />
            - Anything that might concern recruiters<br /><br />
            **4. IMPROVEMENTS**<br />
            - What would make the biggest impact?<br />
            - What should I add or remove?<br />
            - How can I strengthen weak areas?<br /><br />
            Be specific. For each issue, show me the problem and the fix.
        </CopyablePrompt>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Specific Review Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Grammar & Consistency Check">
              Check this resume for grammar, spelling, and consistency errors:<br /><br />
              [PASTE RESUME]<br /><br />
              Specifically check:<br />
              1. Spelling errors<br />
              2. Grammar issues<br />
              3. Tense consistency (past tense for past jobs, present for current)<br />
              4. Punctuation (do bullets end with periods or not?)<br />
              5. Capitalization consistency<br />
              6. Date format consistency<br />
              7. Number format consistency (%, $, etc.)<br /><br />
              List every issue with exact location and correction.
          </CopyablePrompt>

          <CopyablePrompt title="Impact Assessment">
              Rate each bullet point on my resume for impact (1-5 scale):<br /><br />
              [PASTE RESUME]<br /><br />
              For each bullet, assess:<br />
              - Does it show an achievement or just a duty?<br />
              - Does it include metrics/quantification?<br />
              - Is the action verb strong?<br />
              - Is it specific or vague?<br /><br />
              For bullets rated 3 or below, suggest an improved version.
          </CopyablePrompt>

          <CopyablePrompt title="ATS Compatibility Check">
              Review my resume for ATS (Applicant Tracking System) compatibility:<br /><br />
              [PASTE RESUME]<br /><br />
              I'm applying for: [TARGET JOB OR PASTE JD]<br /><br />
              Check for:<br />
              1. Standard section headers (Experience, Education, Skills)?<br />
              2. Simple formatting that parses correctly?<br />
              3. Keyword coverage for the target role?<br />
              4. Any elements that might confuse ATS?<br />
              5. Contact info complete and correctly placed?<br /><br />
              Score my ATS-readiness 1-10 and suggest fixes.
          </CopyablePrompt>

          <CopyablePrompt title="Recruiter Perspective Review">
              Review this resume as a [INDUSTRY] recruiter doing a 30-second scan:<br /><br />
              [PASTE RESUME]<br /><br />
              Tell me:<br />
              1. First impression (in 10 seconds, what do you notice?)<br />
              2. Would you keep reading or pass?<br />
              3. What stands out positively?<br />
              4. What concerns would you have?<br />
              5. What questions would you want answered in an interview?<br />
              6. Overall impression (hire/maybe/pass)<br /><br />
              Be honest—I need real feedback, not encouragement.
          </CopyablePrompt>

          <CopyablePrompt title="Red Flag Identifier">
              Look at my resume and identify any red flags a recruiter might see:<br /><br />
              [PASTE RESUME]<br /><br />
              Check for:<br />
              1. Employment gaps (list each gap with duration)<br />
              2. Short job tenures that look like job hopping<br />
              3. Unexplained career changes<br />
              4. Missing expected experience for my level<br />
              5. Overqualified or underqualified signals<br />
              6. Any other concerns<br /><br />
              For each red flag, suggest how I might address or mitigate it.
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Review Checklist
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-4">
          Before submitting, make sure you've checked these areas:
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-ink mb-4">Technical Check</h3>
            <ul className="space-y-2 text-stone-warm">
              <li className="flex items-start gap-2">
                <span className="text-gray-400">□</span>
                <span>No spelling errors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">□</span>
                <span>No grammar errors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">□</span>
                <span>Consistent tense usage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">□</span>
                <span>Consistent punctuation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">□</span>
                <span>Consistent date formats</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">□</span>
                <span>Contact info is correct</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-ink mb-4">Content Check</h3>
            <ul className="space-y-2 text-stone-warm">
              <li className="flex items-start gap-2">
                <span className="text-gray-400">□</span>
                <span>Achievements, not just duties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">□</span>
                <span>Quantified where possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">□</span>
                <span>Strong action verbs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">□</span>
                <span>Relevant keywords included</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">□</span>
                <span>No clichés or buzzwords</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">□</span>
                <span>Tailored to target job</span>
              </li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Common Issues AI Catches
        </h2>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-4 py-4 text-left font-bold text-ink">Issue</th>
                <th className="px-4 py-4 text-left font-bold text-ink">Example</th>
                <th className="px-4 py-4 text-left font-bold text-ink">Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr>
                <td className="px-4 py-4 font-medium text-ink">Weak Verbs</td>
                <td className="px-4 py-4 text-stone-warm">"Helped with customer issues"</td>
                <td className="px-4 py-4 text-accent">"Resolved 50+ customer issues daily"</td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 font-medium text-ink">No Metrics</td>
                <td className="px-4 py-4 text-stone-warm">"Increased sales significantly"</td>
                <td className="px-4 py-4 text-accent">"Increased sales by 35% in Q2 2025"</td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-ink">Duty-Focused</td>
                <td className="px-4 py-4 text-stone-warm">"Responsible for managing team"</td>
                <td className="px-4 py-4 text-accent">"Led 8-person team that delivered $2M project on time"</td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 font-medium text-ink">Vague Claims</td>
                <td className="px-4 py-4 text-stone-warm">"Excellent communication skills"</td>
                <td className="px-4 py-4 text-accent">"Presented quarterly results to 200+ stakeholders"</td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-ink">Tense Issues</td>
                <td className="px-4 py-4 text-stone-warm">"Manage team" (past job)</td>
                <td className="px-4 py-4 text-accent">"Managed team" (past tense for past roles)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-yellow-800 mb-3">
            ⚠️ AI Review Limitations
          </h3>
          <p className="text-yellow-700 mb-4">
            Remember that AI review has limits:
          </p>
          <ul className="list-disc list-inside space-y-2 text-yellow-700">
            <li>Can't verify your claims are truthful</li>
            <li>Doesn't know industry-specific expectations deeply</li>
            <li>May miss context-dependent issues</li>
            <li>Can give inconsistent advice across sessions</li>
          </ul>
          <p className="text-yellow-700 mt-4">
            Use AI as one input, not the final word. A human review is still valuable.
          </p>
        </div>

        <div className="my-12 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Create a Polished Resume?
          </h3>
          <p className="text-xl mb-6 opacity-90">
            After your AI review, format with our free ATS-friendly templates.
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-accent px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Start Building Free
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Related Resources
        </h2>

        <ul className="list-disc list-inside space-y-2 text-lg text-stone-warm">
          <li>
            <Link to="/blog/chatgpt-resume-prompts" className="text-accent hover:underline">
              25+ ChatGPT Prompts for Resume Writing
            </Link>
          </li>
          <li>
            <Link to="/blog/ai-resume-writing-guide" className="text-accent hover:underline">
              AI Resume Writing: The Complete Guide
            </Link>
          </li>
          <li>
            <Link to="/blog/resume-mistakes-to-avoid" className="text-accent hover:underline">
              10 Critical Resume Mistakes to Avoid
            </Link>
          </li>
        </ul>
      </div>
    </BlogLayout>
  );
}
