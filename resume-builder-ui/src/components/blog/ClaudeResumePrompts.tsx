import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";
import CopyablePrompt from "../shared/CopyablePrompt";

export default function ClaudeResumePrompts() {
  return (
    <BlogLayout
      title="15+ Claude AI Resume Prompts (Copy-Paste Ready) 2026"
      description="Best Claude prompts for resume writing: professional summary, experience bullets, skills optimization, cover letters. Copy-paste ready. Works with Claude 3.5 and Opus."
      publishDate="2026-01-21"
      readTime="10 min"
      keywords={[
        "claude resume prompts",
        "claude ai resume",
        "anthropic claude resume",
        "claude for resume writing",
        "best ai for resume",
        "claude prompts job application",
        "claude prompt for resume",
        "claude prompts for resume",
        "resume prompt for claude",
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Claude by Anthropic is known for nuanced, professional writing that avoids the "AI sound"
          many other tools produce. Its ability to follow detailed instructions makes it excellent
          for resume writing tasks that require precision.
        </p>

        {/* Quick Answer Box */}
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h3 className="font-bold text-ink mb-3">
            🎯 Why Claude for Resume Writing?
          </h3>
          <ul className="space-y-2 text-ink/80">
            <li><strong>Professional Tone:</strong> Naturally produces polished, professional language</li>
            <li><strong>Instruction Following:</strong> Excellent at following complex, multi-step prompts</li>
            <li><strong>Long Context:</strong> Can analyze entire resumes and job descriptions together</li>
            <li><strong>Nuance:</strong> Better at subtle distinctions in wording and tone</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Professional Summary Prompts for Claude
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #1: Nuanced Professional Summary">
              I need a professional summary for my resume. Here's my context:<br /><br />
              - Current role: [JOB TITLE] at [COMPANY TYPE]<br />
              - Years of experience: [X] years<br />
              - Key expertise: [SKILL 1], [SKILL 2], [SKILL 3]<br />
              - Target role: [TARGET JOB TITLE]<br /><br />
              Write a 3-sentence summary that:<br />
              1. Opens with my professional identity (without using "I")<br />
              2. Highlights my most relevant expertise<br />
              3. Ends with what I bring to potential employers<br /><br />
              Tone: Confident but not boastful. Professional but not stiff.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #2: Senior/Executive Summary">
              Write an executive summary for a [TITLE] with [X]+ years in [INDUSTRY].<br /><br />
              Key achievements:<br />
              - [ACHIEVEMENT 1 with metric]<br />
              - [ACHIEVEMENT 2 with metric]<br /><br />
              The summary should convey strategic thinking and leadership impact without being verbose. Target: 50-60 words. Use language appropriate for board-level communication.
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Experience Bullet Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #3: Achievement Transformation">
              Transform this job responsibility into an achievement-focused resume bullet:<br /><br />
              Original: "[PASTE YOUR RESPONSIBILITY]"<br /><br />
              Requirements:<br />
              - Start with a strong action verb<br />
              - Include scope (team size, budget, or scale) if applicable<br />
              - End with business impact or result<br />
              - Keep under 25 words<br />
              - Don't invent metrics I didn't provide<br /><br />
              If you need more information to quantify the achievement, ask me.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #4: Bullet Point Refinement">
              Improve these resume bullet points while maintaining truthfulness:<br /><br />
              [PASTE YOUR BULLETS]<br /><br />
              For each bullet:<br />
              1. Strengthen the opening verb<br />
              2. Add specificity where vague<br />
              3. Improve flow and readability<br />
              4. Ensure parallel structure across all bullets<br /><br />
              Show me the original and revised version side by side.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #5: Role-Specific Bullets">
              Generate 5 resume bullets for a [JOB TITLE] role.<br /><br />
              My key responsibilities included:<br />
              [LIST YOUR MAIN TASKS]<br /><br />
              Results I achieved:<br />
              [LIST ANY OUTCOMES OR METRICS]<br /><br />
              Write bullets that emphasize impact over activity. Each bullet should demonstrate a different skill or competency relevant to [TARGET ROLE].
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Job Description Analysis Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #6: Deep Job Analysis">
              Analyze this job description thoroughly:<br /><br />
              [PASTE JOB DESCRIPTION]<br /><br />
              Provide:<br />
              1. **Must-have skills** (explicitly required)<br />
              2. **Nice-to-have skills** (preferred but not required)<br />
              3. **Implicit expectations** (read between the lines)<br />
              4. **Keywords to include** (exact phrases from the JD)<br />
              5. **Company culture signals** (what values do they seem to prioritize?)<br />
              6. **Red flags or concerns** (anything unusual in the posting)
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #7: Resume-Job Fit Analysis">
              Compare my resume against this job description:<br /><br />
              My resume:<br />
              [PASTE RESUME]<br /><br />
              Job description:<br />
              [PASTE JD]<br /><br />
              Assess:<br />
              1. Alignment score (1-10) with explanation<br />
              2. Strengths to emphasize<br />
              3. Gaps to address or minimize<br />
              4. Specific changes to make my resume more competitive
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Skills Section Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #8: Strategic Skills Selection">
              I have these skills: [LIST ALL YOUR SKILLS]<br /><br />
              I'm targeting this role: [JOB DESCRIPTION OR TITLE]<br /><br />
              Help me select and organize my skills section:<br />
              1. Which skills to feature prominently<br />
              2. Which skills to include but not emphasize<br />
              3. Which skills to omit entirely<br />
              4. How to group/categorize them effectively
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #9: Technical Skills Description">
              For each of these technical skills, write a brief phrase showing my proficiency level in a way that's more meaningful than "intermediate" or "advanced":<br /><br />
              Skills: [LIST SKILLS]<br /><br />
              Example format: "Python - built production ETL pipelines" rather than "Python - advanced"
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Tailoring and Optimization Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #10: Full Resume Tailoring">
              Tailor my resume for this specific role:<br /><br />
              Current resume:<br />
              [PASTE RESUME]<br /><br />
              Target job:<br />
              [PASTE JD]<br /><br />
              Provide specific, actionable edits:<br />
              1. Summary changes<br />
              2. Experience bullets to revise (with new versions)<br />
              3. Skills to add or reorder<br />
              4. Keywords to incorporate naturally<br /><br />
              Don't rewrite everything—focus on high-impact changes.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #11: ATS Optimization">
              Review my resume for ATS (Applicant Tracking System) compatibility:<br /><br />
              [PASTE RESUME]<br /><br />
              Target job:<br />
              [PASTE JD]<br /><br />
              Check for:<br />
              1. Missing keywords from the JD<br />
              2. Formatting issues that might confuse ATS<br />
              3. Section headers that might not be recognized<br />
              4. Any content that needs standardization<br /><br />
              Suggest fixes for each issue found.
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Polish and Review Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #12: Final Review">
              Review this resume as a [INDUSTRY] hiring manager would:<br /><br />
              [PASTE RESUME]<br /><br />
              Evaluate:<br />
              1. First impression (would you keep reading?)<br />
              2. Clarity of career narrative<br />
              3. Strength of achievements<br />
              4. Professional presentation<br />
              5. Any red flags or concerns<br /><br />
              Be honest and specific. I want to improve, not just hear positives.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #13: Tone Adjustment">
              The tone of my resume feels [too humble/too boastful/too generic/too casual].<br /><br />
              [PASTE RESUME OR SECTION]<br /><br />
              Rewrite to achieve a tone that is:<br />
              - Confident but not arrogant<br />
              - Professional but not stiff<br />
              - Specific but not verbose<br /><br />
              Show me before/after for key sections.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #14: Conciseness Edit">
              My resume is too long. Help me cut it down:<br /><br />
              [PASTE RESUME]<br /><br />
              I need to reach [1 page / 2 pages].<br /><br />
              Identify:<br />
              1. Content that can be removed entirely<br />
              2. Bullets that can be combined<br />
              3. Wordy phrases that can be tightened<br />
              4. Sections that could be shortened<br /><br />
              Prioritize keeping my strongest achievements and most relevant experience.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #15: Proofread">
              Proofread my resume carefully for:<br /><br />
              [PASTE RESUME]<br /><br />
              Check:<br />
              1. Grammar and spelling<br />
              2. Punctuation consistency (periods, semicolons)<br />
              3. Tense consistency (past vs. present)<br />
              4. Number formatting (%, $, dates)<br />
              5. Capitalization consistency<br /><br />
              List every issue found with the exact location and correction.
          </CopyablePrompt>
        </div>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h4 className="font-bold text-ink mb-3">
            💡 Pro Tip: Use Claude's Long Context
          </h4>
          <p className="text-ink/80">
            Claude can process very long documents. Take advantage of this by pasting your
            entire resume AND the full job description in a single prompt. This allows Claude
            to make more intelligent, contextual suggestions.
          </p>
        </div>

        <div className="my-12 bg-ink text-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Format Your Claude-Generated Content
          </h3>
          <p className="text-xl mb-6 opacity-90">
            After generating content with Claude, use our free ATS-friendly templates for perfect formatting.
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-accent px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Try Free Templates
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
            <Link to="/blog/gemini-resume-prompts" className="text-accent hover:underline">
              Gemini Prompts for Resume Writing
            </Link>
          </li>
        </ul>
      </div>
    </BlogLayout>
  );
}
