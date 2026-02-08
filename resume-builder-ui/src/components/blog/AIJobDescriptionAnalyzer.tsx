import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";
import CopyablePrompt from "../shared/CopyablePrompt";

export default function AIJobDescriptionAnalyzer() {
  return (
    <BlogLayout
      title="How to Use AI to Analyze Job Descriptions (Extract Keywords & Requirements)"
      description="Learn to use AI tools like ChatGPT and Claude to extract keywords, identify requirements, and decode what employers really want from job descriptions."
      publishDate="2026-01-21"
      readTime="9 min"
      keywords={[
        "ai job description analyzer",
        "analyze job description ai",
        "extract keywords from job description",
        "job description keywords",
        "chatgpt job description",
        "ai job analysis",
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Job descriptions contain more information than meets the eye. Between the lines are
          clues about company culture, real priorities, and exactly what keywords your resume needs.
          AI can help you decode all of this in minutes.
        </p>

        {/* Quick Answer Box */}
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h3 className="font-bold text-ink mb-3">
            🎯 What AI Can Extract from Job Descriptions
          </h3>
          <ul className="space-y-2 text-ink/80">
            <li><strong>Hard Skills:</strong> Technical requirements and tools</li>
            <li><strong>Soft Skills:</strong> Communication, leadership, teamwork expectations</li>
            <li><strong>Keywords:</strong> Exact phrases for ATS optimization</li>
            <li><strong>Culture Signals:</strong> Values and work environment clues</li>
            <li><strong>Priority Ranking:</strong> What matters most to the employer</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 1: Initial Analysis Prompt
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-4">
          Start with this comprehensive prompt to get a full breakdown:
        </p>

        <CopyablePrompt title="Master Analysis Prompt">
            Analyze this job description thoroughly:<br /><br />
            [PASTE FULL JOB DESCRIPTION]<br /><br />
            Provide:<br /><br />
            **1. MUST-HAVE Requirements** (deal-breakers)<br />
            - List each requirement with confidence level (explicit vs implied)<br /><br />
            **2. NICE-TO-HAVE Qualifications** (bonus points)<br />
            - Items that would strengthen candidacy but aren't required<br /><br />
            **3. KEYWORDS FOR RESUME** (exact phrases)<br />
            - Technical skills<br />
            - Tools/platforms/software<br />
            - Certifications<br />
            - Industry terminology<br />
            - Action verbs they use<br /><br />
            **4. SOFT SKILLS EXPECTED**<br />
            - Read between the lines<br /><br />
            **5. COMPANY CULTURE SIGNALS**<br />
            - What values seem important?<br />
            - What work environment does this suggest?<br /><br />
            **6. RED FLAGS OR CONCERNS**<br />
            - Anything unusual or potentially concerning
        </CopyablePrompt>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 2: Keyword Extraction
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-4">
          For ATS optimization, you need exact keyword matches. Use this prompt:
        </p>

        <CopyablePrompt title="Keyword Extraction Prompt">
            Extract every keyword and phrase from this job description that should appear on a tailored resume:<br /><br />
            [PASTE JOB DESCRIPTION]<br /><br />
            Organize into categories:<br />
            1. **Technical Skills** (programming languages, frameworks, etc.)<br />
            2. **Tools & Platforms** (software, systems)<br />
            3. **Certifications** (any mentioned or implied)<br />
            4. **Methodologies** (Agile, Scrum, Six Sigma, etc.)<br />
            5. **Soft Skills** (communication, leadership, etc.)<br />
            6. **Industry Terms** (jargon specific to this field)<br />
            7. **Action Verbs** (verbs they use repeatedly)<br /><br />
            Include frequency count if terms appear multiple times.
        </CopyablePrompt>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 3: Decode Hidden Expectations
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-4">
          What they write isn't always what they mean. This prompt helps decode the subtext:
        </p>

        <CopyablePrompt title="Hidden Meaning Decoder">
            What do these phrases in this job description REALLY mean?<br /><br />
            [PASTE JOB DESCRIPTION]<br /><br />
            Decode common euphemisms like:<br />
            - "Fast-paced environment"<br />
            - "Self-starter"<br />
            - "Wear many hats"<br />
            - "Competitive salary"<br />
            - "Work hard, play hard"<br />
            - "Looking for a rockstar"<br /><br />
            What is this employer really looking for? What's the work culture likely to be?
        </CopyablePrompt>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 4: Match Analysis
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-4">
          Once you've analyzed the JD, compare it against your background:
        </p>

        <CopyablePrompt title="Fit Analysis Prompt">
            Compare my background to this job description:<br /><br />
            **Job Description:**<br />
            [PASTE JD]<br /><br />
            **My Background:**<br />
            [PASTE RESUME OR SUMMARY]<br /><br />
            Assess:<br />
            1. **Match Score** (0-100%) with explanation<br />
            2. **Strong Matches** - requirements I clearly meet<br />
            3. **Partial Matches** - requirements I meet with translation<br />
            4. **Gaps** - requirements I don't obviously meet<br />
            5. **Unique Value** - things I bring that aren't listed but could be valuable<br /><br />
            For each gap, suggest how I might address it on my resume.
        </CopyablePrompt>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 5: Create Tailored Content
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-4">
          Now turn your analysis into resume content:
        </p>

        <CopyablePrompt title="Resume Tailoring Prompt">
            Based on this job description analysis:<br /><br />
            Keywords: [LIST TOP 15 KEYWORDS]<br />
            Key requirements: [LIST MAIN REQUIREMENTS]<br />
            My experience: [BRIEF SUMMARY]<br /><br />
            Write:<br />
            1. A tailored professional summary (3 sentences)<br />
            2. 3-4 experience bullets that incorporate the key keywords<br />
            3. A skills section organized by relevance to this role<br /><br />
            Make sure keywords appear naturally, not forced.
        </CopyablePrompt>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Example Analysis Walkthrough
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-4">
          Here's what a sample analysis might reveal from a typical JD phrase:
        </p>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-4 py-4 text-left font-bold text-ink">JD Says</th>
                <th className="px-4 py-4 text-left font-bold text-ink">What It Means</th>
                <th className="px-4 py-4 text-left font-bold text-ink">Keywords to Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr>
                <td className="px-4 py-4 text-stone-warm">"Drive cross-functional initiatives"</td>
                <td className="px-4 py-4 text-stone-warm">Lead projects involving multiple teams</td>
                <td className="px-4 py-4 text-stone-warm">Cross-functional, stakeholder management, collaboration</td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 text-stone-warm">"Experience with Agile methodologies"</td>
                <td className="px-4 py-4 text-stone-warm">Worked on Scrum/Kanban teams</td>
                <td className="px-4 py-4 text-stone-warm">Agile, Scrum, sprints, standups, retrospectives</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-stone-warm">"Data-driven decision making"</td>
                <td className="px-4 py-4 text-stone-warm">Uses metrics to inform choices</td>
                <td className="px-4 py-4 text-stone-warm">Analytics, KPIs, data analysis, insights</td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 text-stone-warm">"Own end-to-end delivery"</td>
                <td className="px-4 py-4 text-stone-warm">Full responsibility from start to finish</td>
                <td className="px-4 py-4 text-stone-warm">End-to-end, ownership, delivery, accountability</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-green-800 mb-3">
            ✅ Best Practices
          </h3>
          <ul className="list-disc list-inside space-y-2 text-accent">
            <li>Analyze 3-5 similar job descriptions to find common patterns</li>
            <li>Use exact keyword phrases, not synonyms (ATS matches exactly)</li>
            <li>Prioritize keywords that appear multiple times in the JD</li>
            <li>Don't just list keywords – incorporate them into achievements</li>
            <li>Update your analysis for each new application</li>
          </ul>
        </div>

        <div className="my-12 bg-ink text-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Apply Your Analysis?
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Use our free ATS-friendly templates to format your tailored resume.
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
            <Link to="/blog/how-to-use-resume-keywords" className="text-accent hover:underline">
              How to Use Resume Keywords to Beat the ATS
            </Link>
          </li>
          <li>
            <Link to="/blog/ats-resume-optimization" className="text-accent hover:underline">
              ATS Resume Optimization Guide
            </Link>
          </li>
          <li>
            <Link to="/blog/chatgpt-resume-prompts" className="text-accent hover:underline">
              25+ ChatGPT Prompts for Resume Writing
            </Link>
          </li>
        </ul>
      </div>
    </BlogLayout>
  );
}
