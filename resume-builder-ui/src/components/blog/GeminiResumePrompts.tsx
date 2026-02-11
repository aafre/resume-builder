import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";
import CopyablePrompt from "../shared/CopyablePrompt";

export default function GeminiResumePrompts() {
  return (
    <BlogLayout
      title="Best Gemini Resume Prompts (Copy-Paste Ready) 2026"
      description="Top Gemini prompts for resume writing: job description analysis, keyword extraction, bullet optimization. Copy-paste ready for Gemini Advanced and free."
      publishDate="2026-01-21"
      readTime="8 min"
      keywords={[
        "gemini resume prompts",
        "google gemini resume",
        "gemini ai resume",
        "google ai resume writing",
        "gemini prompts job application",
        "bard resume prompts",
        "gemini prompt for cv",
        "cv prompt for gemini",
        "gemini resume prompt",
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Google Gemini excels at research and analysis tasks, making it particularly useful for
          analyzing job descriptions, extracting keywords, and understanding what companies are
          looking for. These prompts leverage Gemini's strengths for resume writing.
        </p>

        {/* Quick Answer Box */}
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h3 className="font-bold text-ink mb-3">
            🎯 Gemini's Strengths for Resume Writing
          </h3>
          <ul className="space-y-2 text-ink/80">
            <li><strong>Research & Analysis:</strong> Excellent at extracting insights from job descriptions</li>
            <li><strong>Long Context:</strong> Can process extensive documents like multi-page resumes</li>
            <li><strong>Web Integration:</strong> Can access current information about companies and roles</li>
            <li><strong>Structured Output:</strong> Good at organizing information in clear formats</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Job Description Analysis Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #1: Comprehensive JD Analysis">
              Analyze this job description in detail:<br /><br />
              [PASTE JOB DESCRIPTION]<br /><br />
              Provide:<br />
              1. **Required Skills** (must-haves vs nice-to-haves)<br />
              2. **Key Responsibilities** (ranked by importance)<br />
              3. **Keywords to Use** (exact phrases for ATS)<br />
              4. **Soft Skills Expected** (read between the lines)<br />
              5. **Company Culture Signals** (what they value)<br />
              6. **Potential Interview Questions** (based on the role)<br /><br />
              Format as a structured breakdown I can use to tailor my resume.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #2: Keyword Extraction">
              Extract all resume-worthy keywords from this job description:<br /><br />
              [PASTE JOB DESCRIPTION]<br /><br />
              Categorize into:<br />
              - Technical skills<br />
              - Tools and platforms<br />
              - Certifications<br />
              - Soft skills<br />
              - Industry terminology<br /><br />
              Show frequency if terms appear multiple times.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #3: Company Research">
              Research [COMPANY NAME] and tell me:<br /><br />
              1. Company values and mission<br />
              2. Recent news or achievements<br />
              3. Industry position and competitors<br />
              4. Culture based on public information<br />
              5. What they likely value in candidates<br /><br />
              I'm applying for a [JOB TITLE] role. What should I emphasize on my resume based on this research?
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Resume Content Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #4: Achievement Bullets">
              Create achievement-focused resume bullets for my role as [JOB TITLE].<br /><br />
              What I did:<br />
              [DESCRIBE YOUR RESPONSIBILITIES]<br /><br />
              Results (if known):<br />
              [ANY METRICS OR OUTCOMES]<br /><br />
              Write 4-5 bullets that:<br />
              - Start with strong action verbs<br />
              - Include quantifiable results where possible<br />
              - Are concise (under 20 words each)<br />
              - Align with [TARGET ROLE] requirements
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #5: Professional Summary">
              Write a professional summary for a [JOB TITLE] with [X] years of experience.<br /><br />
              My background:<br />
              - Industries: [LIST]<br />
              - Key skills: [LIST]<br />
              - Notable achievements: [LIST]<br /><br />
              Target role: [DESCRIBE]<br /><br />
              Write 3 variations:<br />
              1. Achievement-focused (lead with biggest win)<br />
              2. Expertise-focused (lead with specialization)<br />
              3. Value-proposition (lead with what I offer employers)
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #6: Skills Matrix">
              Create a skills matrix for my resume targeting [JOB TITLE]:<br /><br />
              My skills: [LIST ALL SKILLS]<br /><br />
              Job requirements: [PASTE KEY REQUIREMENTS]<br /><br />
              Show me:<br />
              1. Which skills to list first (highest relevance)<br />
              2. How to group them (categories)<br />
              3. Which skills to skip (not relevant)<br />
              4. Any skill gaps I should address
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Optimization Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #7: Resume-JD Match Score">
              Score my resume against this job description:<br /><br />
              Resume: [PASTE]<br /><br />
              Job Description: [PASTE]<br /><br />
              Provide:<br />
              1. Overall match score (0-100%)<br />
              2. Keyword match analysis<br />
              3. Skills alignment<br />
              4. Experience relevance<br />
              5. Specific improvements to increase my score
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #8: Tailor for Industry">
              I'm moving from [CURRENT INDUSTRY] to [TARGET INDUSTRY].<br /><br />
              My resume: [PASTE]<br /><br />
              Help me:<br />
              1. Identify transferable skills to emphasize<br />
              2. Translate industry jargon<br />
              3. Reframe experiences for new industry<br />
              4. Highlight relevant cross-industry knowledge<br />
              5. Suggest what to de-emphasize or remove
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #9: Competitive Analysis">
              For a [JOB TITLE] role in [INDUSTRY], what do strong candidates typically have on their resumes?<br /><br />
              Cover:<br />
              - Common backgrounds and experiences<br />
              - Expected skills and certifications<br />
              - Typical achievements that stand out<br />
              - What differentiates great candidates<br /><br />
              Then analyze my resume against these standards: [PASTE RESUME]
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Review and Polish Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #10: Comprehensive Review">
              Review my resume as a [INDUSTRY] recruiter would:<br /><br />
              [PASTE RESUME]<br /><br />
              Evaluate:<br />
              1. First impression (10-second scan)<br />
              2. Clarity of career progression<br />
              3. Achievement impact<br />
              4. ATS compatibility<br />
              5. Missing elements<br />
              6. Overall competitiveness<br /><br />
              Score each area 1-10 and explain why.
          </CopyablePrompt>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h4 className="font-bold text-green-800 mb-3">
            💡 Gemini Integration Tip
          </h4>
          <p className="text-accent">
            Gemini can access current web information. Ask it to research specific companies,
            industry trends, or salary data to better inform your resume strategy.
          </p>
        </div>

        <div className="my-12 bg-ink text-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Build Your Resume?
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Use Gemini for research, then format with our free ATS-friendly templates.
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
            <Link to="/blog/claude-resume-prompts" className="text-accent hover:underline">
              Claude Prompts for Resume Writing
            </Link>
          </li>
          <li>
            <Link to="/blog/ai-resume-writing-guide" className="text-accent hover:underline">
              AI Resume Writing: The Complete Guide
            </Link>
          </li>
        </ul>
      </div>
    </BlogLayout>
  );
}
