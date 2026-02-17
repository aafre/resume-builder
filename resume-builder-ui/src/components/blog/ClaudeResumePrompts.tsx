import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";
import CopyablePrompt from "../shared/CopyablePrompt";

export default function ClaudeResumePrompts() {
  return (
    <BlogLayout
      title="25+ Claude AI Resume Prompts (Copy-Paste Ready) 2026"
      description="Best Claude prompts for resume writing: professional summary, experience bullets, cover letters, career change, ATS optimization. Copy-paste ready for Claude 3.5 Sonnet and Opus."
      publishDate="2026-01-21"
      lastUpdated="2026-02-17"
      readTime="18 min"
      keywords={[
        "claude resume prompts",
        "claude ai resume",
        "anthropic claude resume",
        "claude for resume writing",
        "best ai for resume",
        "claude prompts job application",
        "claude prompt for resume",
        "claude vs chatgpt resume",
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Claude by Anthropic is one of the best AI tools for resume writing in 2026. Unlike other AI assistants that produce generic, obviously-AI-written text, Claude creates nuanced, professional content that sounds like you — just polished. These 25+ prompts are organized by task so you can jump straight to what you need.
        </p>

        {/* Table of Contents */}
        <nav className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h2 className="font-bold text-ink mb-4 text-lg">
            Table of Contents
          </h2>
          <ol className="space-y-2 text-ink/80 list-decimal list-inside">
            <li><a href="#which-claude-model" className="text-accent hover:underline">Which Claude Model to Use for Resumes</a></li>
            <li><a href="#professional-summary" className="text-accent hover:underline">Professional Summary Prompts (#1-2)</a></li>
            <li><a href="#experience-bullets" className="text-accent hover:underline">Experience Bullet Prompts (#3-5)</a></li>
            <li><a href="#job-analysis" className="text-accent hover:underline">Job Description Analysis Prompts (#6-7)</a></li>
            <li><a href="#skills-section" className="text-accent hover:underline">Skills Section Prompts (#8-9)</a></li>
            <li><a href="#tailoring" className="text-accent hover:underline">Tailoring & ATS Optimization (#10-11)</a></li>
            <li><a href="#cover-letters" className="text-accent hover:underline">Cover Letter Prompts (#12-14)</a></li>
            <li><a href="#career-change" className="text-accent hover:underline">Career Change Prompts (#15-17)</a></li>
            <li><a href="#polish-review" className="text-accent hover:underline">Polish & Review Prompts (#18-22)</a></li>
            <li><a href="#linkedin" className="text-accent hover:underline">LinkedIn Optimization Prompts (#23-25)</a></li>
            <li><a href="#before-after" className="text-accent hover:underline">Before & After Examples</a></li>
            <li><a href="#claude-vs-chatgpt" className="text-accent hover:underline">Claude vs ChatGPT for Resumes</a></li>
            <li><a href="#tips" className="text-accent hover:underline">Tips for Better Results</a></li>
          </ol>
        </nav>

        {/* Quick Answer Box */}
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h3 className="font-bold text-ink mb-3">
            Why Claude for Resume Writing?
          </h3>
          <ul className="space-y-2 text-ink/80">
            <li><strong>Professional Tone:</strong> Naturally produces polished, professional language without sounding robotic</li>
            <li><strong>Instruction Following:</strong> Excellent at following complex, multi-step prompts with specific constraints</li>
            <li><strong>200K Context Window:</strong> Can analyze your entire resume, cover letter, AND job description in one prompt</li>
            <li><strong>Nuance:</strong> Better at subtle distinctions in wording — the difference between "managed" and "spearheaded"</li>
            <li><strong>Honest Output:</strong> Less likely to fabricate achievements or exaggerate your experience</li>
          </ul>
        </div>

        {/* Which Claude Model */}
        <h2 id="which-claude-model" className="text-3xl font-bold text-ink mt-12 mb-6">
          Which Claude Model to Use for Resumes
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Anthropic offers several Claude models. Here's which one to pick for resume writing:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-6 py-4 text-left font-bold text-ink">Model</th>
                <th className="px-6 py-4 text-left font-bold text-ink">Best For</th>
                <th className="px-6 py-4 text-left font-bold text-ink">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Claude 3.5 Sonnet</td>
                <td className="px-6 py-4 text-ink">Most resume tasks — summaries, bullets, tailoring. Best balance of quality and speed.</td>
                <td className="px-6 py-4 text-ink">Free tier available</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Claude 3 Opus</td>
                <td className="px-6 py-4 text-ink">Complex career narratives, executive resumes, nuanced tone adjustments.</td>
                <td className="px-6 py-4 text-ink">Pro plan ($20/mo)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Claude 3.5 Haiku</td>
                <td className="px-6 py-4 text-ink">Quick proofreading, simple formatting fixes, keyword extraction.</td>
                <td className="px-6 py-4 text-ink">Free tier available</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-yellow-800 mb-2">Recommendation</h4>
          <p className="text-yellow-700">
            Start with <strong>Claude 3.5 Sonnet</strong> (free on claude.ai). It handles 90% of resume writing tasks perfectly. Only upgrade to Opus if you need help with complex career transitions or C-suite positioning.
          </p>
        </div>

        {/* Professional Summary Prompts */}
        <h2 id="professional-summary" className="text-3xl font-bold text-ink mt-12 mb-6">
          Professional Summary Prompts for Claude
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Your professional summary is the first thing recruiters read. These prompts help Claude write summaries that are specific to your experience without sounding like every other AI-generated resume. For more examples, see our <Link to="/blog/professional-summary-examples" className="text-accent hover:underline">professional summary examples guide</Link>.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #1: Nuanced Professional Summary" bestFor="Mid-career professionals targeting a specific role">
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

          <CopyablePrompt title="Prompt #2: Senior/Executive Summary" bestFor="Directors, VPs, and C-suite candidates">
              Write an executive summary for a [TITLE] with [X]+ years in [INDUSTRY].<br /><br />
              Key achievements:<br />
              - [ACHIEVEMENT 1 with metric]<br />
              - [ACHIEVEMENT 2 with metric]<br /><br />
              The summary should convey strategic thinking and leadership impact without being verbose. Target: 50-60 words. Use language appropriate for board-level communication.
          </CopyablePrompt>
        </div>

        {/* Experience Bullets */}
        <h2 id="experience-bullets" className="text-3xl font-bold text-ink mt-12 mb-6">
          Experience Bullet Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          The biggest resume mistake is listing responsibilities instead of achievements. These prompts help Claude transform "did X" into "achieved Y by doing X." Check our <Link to="/blog/quantify-resume-accomplishments" className="text-accent hover:underline">guide to quantifying accomplishments</Link> for the framework behind these prompts.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #3: Achievement Transformation" bestFor="Turning job duties into impact statements">
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

          <CopyablePrompt title="Prompt #4: Bullet Point Refinement" bestFor="Polishing existing resume bullets">
              Improve these resume bullet points while maintaining truthfulness:<br /><br />
              [PASTE YOUR BULLETS]<br /><br />
              For each bullet:<br />
              1. Strengthen the opening verb<br />
              2. Add specificity where vague<br />
              3. Improve flow and readability<br />
              4. Ensure parallel structure across all bullets<br /><br />
              Show me the original and revised version side by side.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #5: Role-Specific Bullets" bestFor="Writing bullets from scratch for a specific position">
              Generate 5 resume bullets for a [JOB TITLE] role.<br /><br />
              My key responsibilities included:<br />
              [LIST YOUR MAIN TASKS]<br /><br />
              Results I achieved:<br />
              [LIST ANY OUTCOMES OR METRICS]<br /><br />
              Write bullets that emphasize impact over activity. Each bullet should demonstrate a different skill or competency relevant to [TARGET ROLE].
          </CopyablePrompt>
        </div>

        {/* Job Description Analysis */}
        <h2 id="job-analysis" className="text-3xl font-bold text-ink mt-12 mb-6">
          Job Description Analysis Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Claude's long context window makes it ideal for analyzing job descriptions. You can paste the entire JD and your full resume in a single prompt — something most AI tools struggle with. For a deeper dive, read our <Link to="/blog/ai-job-description-analyzer" className="text-accent hover:underline">AI job description analysis guide</Link>.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #6: Deep Job Analysis" bestFor="Understanding exactly what a company wants before applying">
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

          <CopyablePrompt title="Prompt #7: Resume-Job Fit Analysis" bestFor="Checking how well your resume matches before submitting">
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

        {/* Skills Section */}
        <h2 id="skills-section" className="text-3xl font-bold text-ink mt-12 mb-6">
          Skills Section Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          A well-organized skills section helps both ATS systems and human recruiters. These prompts help Claude select the right skills and present them strategically. See also: <Link to="/blog/how-to-list-skills" className="text-accent hover:underline">how to list skills on a resume</Link>.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #8: Strategic Skills Selection" bestFor="Choosing which skills to include vs. omit">
              I have these skills: [LIST ALL YOUR SKILLS]<br /><br />
              I'm targeting this role: [JOB DESCRIPTION OR TITLE]<br /><br />
              Help me select and organize my skills section:<br />
              1. Which skills to feature prominently<br />
              2. Which skills to include but not emphasize<br />
              3. Which skills to omit entirely<br />
              4. How to group/categorize them effectively
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #9: Technical Skills Description" bestFor="Software engineers, data scientists, and other technical roles">
              For each of these technical skills, write a brief phrase showing my proficiency level in a way that's more meaningful than "intermediate" or "advanced":<br /><br />
              Skills: [LIST SKILLS]<br /><br />
              Example format: "Python - built production ETL pipelines" rather than "Python - advanced"
          </CopyablePrompt>
        </div>

        {/* Tailoring and Optimization */}
        <h2 id="tailoring" className="text-3xl font-bold text-ink mt-12 mb-6">
          Tailoring and ATS Optimization Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Tailoring your resume to each job application is the single most effective way to improve your callback rate. Claude excels here because it can hold your entire resume and the full job description in context simultaneously. Learn more in our <Link to="/blog/how-to-use-resume-keywords" className="text-accent hover:underline">ATS keyword optimization guide</Link>.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #10: Full Resume Tailoring" bestFor="Customizing your resume for a specific application">
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
              Don't rewrite everything — focus on high-impact changes.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #11: ATS Keyword Optimization" bestFor="Ensuring your resume passes automated screening">
              Review my resume for ATS (Applicant Tracking System) compatibility:<br /><br />
              [PASTE RESUME]<br /><br />
              Target job:<br />
              [PASTE JD]<br /><br />
              Check for:<br />
              1. Missing keywords from the JD (list each one)<br />
              2. Formatting issues that might confuse ATS parsers<br />
              3. Section headers that might not be recognized<br />
              4. Acronyms that should also include the full term (or vice versa)<br />
              5. Skills mentioned in the JD but missing from my resume<br /><br />
              For each issue, suggest the exact fix and where to place it.
          </CopyablePrompt>
        </div>

        {/* NEW: Cover Letter Prompts */}
        <h2 id="cover-letters" className="text-3xl font-bold text-ink mt-12 mb-6">
          Cover Letter Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Claude writes cover letters that sound human — not like a form letter with your name pasted in. The key is giving Claude enough context about the company and why you're interested. For the full strategy, see our <Link to="/blog/cover-letter-guide" className="text-accent hover:underline">cover letter writing guide</Link>.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #12: Targeted Cover Letter" bestFor="Standard job applications where you need a custom letter">
              Write a cover letter for this position:<br /><br />
              Job title: [TITLE] at [COMPANY]<br />
              Job description: [PASTE KEY REQUIREMENTS]<br /><br />
              My relevant background:<br />
              - [ACHIEVEMENT/EXPERIENCE 1]<br />
              - [ACHIEVEMENT/EXPERIENCE 2]<br />
              - [ACHIEVEMENT/EXPERIENCE 3]<br /><br />
              Why I'm interested in this company: [GENUINE REASON]<br /><br />
              Requirements:<br />
              - 3 paragraphs maximum (opening hook, value I bring, closing)<br />
              - Connect my experience to their specific needs<br />
              - Sound genuinely enthusiastic, not desperate<br />
              - Do NOT start with "I am writing to apply for..."<br />
              - Do NOT use "I believe I would be a great fit" or similar cliches
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #13: Cold Outreach / Networking Cover Letter" bestFor="Reaching out when there's no posted opening">
              Write a concise email/letter for reaching out to [ROLE/PERSON] at [COMPANY] about potential opportunities.<br /><br />
              My background: [2-3 SENTENCE SUMMARY]<br />
              What I admire about this company: [SPECIFIC DETAIL]<br />
              What I could contribute: [SPECIFIC VALUE]<br /><br />
              Tone: Warm and direct, not salesy. This should read like a confident professional reaching out, not a form letter. Keep it under 150 words.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #14: Thank You / Follow-Up Email" bestFor="Post-interview follow-ups that reinforce your candidacy">
              Write a thank-you email after my interview for [JOB TITLE] at [COMPANY].<br /><br />
              Interviewer name: [NAME]<br />
              Key topics we discussed: [TOPIC 1, TOPIC 2]<br />
              Something specific I learned about the role: [DETAIL]<br />
              A concern they raised about my candidacy: [IF ANY]<br /><br />
              The email should:<br />
              - Thank them for their time (briefly)<br />
              - Reference something specific from our conversation<br />
              - Subtly address any concern they raised<br />
              - Reaffirm my interest without being pushy<br />
              - Be under 100 words
          </CopyablePrompt>
        </div>

        {/* NEW: Career Change Prompts */}
        <h2 id="career-change" className="text-3xl font-bold text-ink mt-12 mb-6">
          Career Change Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Switching industries or roles is one of the hardest resume challenges. Claude is particularly good at finding transferable skills and reframing your experience. These prompts help you tell a compelling "pivot story."
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #15: Transferable Skills Identifier" bestFor="Figuring out what carries over to your new field">
              I'm transitioning from [CURRENT FIELD/ROLE] to [TARGET FIELD/ROLE].<br /><br />
              My current experience includes:<br />
              [PASTE RESUME OR KEY EXPERIENCE BULLETS]<br /><br />
              Target job description:<br />
              [PASTE TARGET JD]<br /><br />
              Identify:<br />
              1. Transferable hard skills (with how they map to the new role)<br />
              2. Transferable soft skills (with concrete examples from my background)<br />
              3. Skills gaps I should acknowledge or address<br />
              4. Experience I should highlight vs. downplay<br /><br />
              Be honest about gaps — don't stretch connections that aren't there.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #16: Career Change Summary" bestFor="Writing a professional summary that explains the pivot">
              Write a professional summary for someone transitioning from [OLD ROLE] to [NEW ROLE].<br /><br />
              Years in current field: [X]<br />
              Key transferable achievements:<br />
              - [ACHIEVEMENT 1]<br />
              - [ACHIEVEMENT 2]<br />
              Relevant training/certifications for new field: [LIST ANY]<br /><br />
              The summary should:<br />
              - Lead with transferable value, not the career change itself<br />
              - Avoid phrases like "seeking to transition" or "looking to pivot"<br />
              - Position me as someone who brings a unique perspective<br />
              - Be 3 sentences, under 60 words
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #17: Reframe Experience Bullets for New Industry" bestFor="Making old experience relevant to your target field">
              Rewrite these experience bullets from my [CURRENT INDUSTRY] role to be relevant for [TARGET INDUSTRY] applications:<br /><br />
              Current bullets:<br />
              [PASTE YOUR BULLETS]<br /><br />
              Target role requirements:<br />
              [KEY REQUIREMENTS FROM TARGET JD]<br /><br />
              For each bullet:<br />
              - Replace industry-specific jargon with target industry equivalents<br />
              - Emphasize the underlying skill, not the domain<br />
              - Keep the metrics and achievements intact<br />
              - Show me original vs. rewritten version
          </CopyablePrompt>
        </div>

        {/* Polish and Review */}
        <h2 id="polish-review" className="text-3xl font-bold text-ink mt-12 mb-6">
          Polish and Review Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Before you submit, have Claude do a final review. These prompts cover everything from hiring manager perspective checks to proofreading. For more on using AI for review, see our <Link to="/blog/ai-resume-review" className="text-accent hover:underline">AI resume review guide</Link>.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #18: Hiring Manager Review" bestFor="Getting honest feedback on overall impression">
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

          <CopyablePrompt title="Prompt #19: Tone Adjustment" bestFor="Fixing a resume that sounds too humble, too boastful, or too generic">
              The tone of my resume feels [too humble/too boastful/too generic/too casual].<br /><br />
              [PASTE RESUME OR SECTION]<br /><br />
              Rewrite to achieve a tone that is:<br />
              - Confident but not arrogant<br />
              - Professional but not stiff<br />
              - Specific but not verbose<br /><br />
              Show me before/after for key sections.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #20: Conciseness Edit" bestFor="Trimming a resume that's too long">
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

          <CopyablePrompt title="Prompt #21: Proofread" bestFor="Final check before submission">
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

          <CopyablePrompt title="Prompt #22: De-AI Your Resume" bestFor="Removing AI-sounding language that recruiters flag">
              Review my resume and flag any phrases that sound obviously AI-generated:<br /><br />
              [PASTE RESUME]<br /><br />
              Look for:<br />
              - Overly formal or stiff phrasing<br />
              - Buzzword stuffing ("leveraged," "synergized," "spearheaded dynamic initiatives")<br />
              - Generic statements that could apply to anyone<br />
              - Suspiciously perfect parallel structure<br />
              - Phrases that no human would naturally write<br /><br />
              For each flagged phrase, suggest a more natural-sounding alternative that still conveys the same point.
          </CopyablePrompt>
        </div>

        {/* NEW: LinkedIn Optimization */}
        <h2 id="linkedin" className="text-3xl font-bold text-ink mt-12 mb-6">
          LinkedIn Optimization Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Your LinkedIn profile should complement your resume, not duplicate it. Claude can help adapt your resume content into LinkedIn's more conversational format.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #23: LinkedIn Headline" bestFor="Creating a headline that gets profile views from recruiters">
              Write 5 LinkedIn headline options for me.<br /><br />
              Current role: [JOB TITLE]<br />
              Key skills: [TOP 3 SKILLS]<br />
              What I want to be found for: [TARGET ROLE/INDUSTRY]<br /><br />
              Requirements:<br />
              - Under 120 characters each<br />
              - Include searchable keywords recruiters use<br />
              - Avoid cliches like "passionate," "guru," "ninja," "rockstar"<br />
              - Mix formats: some with the pipe separator, some narrative style<br />
              - Make at least one option that leads with the value I deliver, not my title
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #24: LinkedIn About Section" bestFor="Converting resume content into a conversational profile summary">
              Convert my resume summary and top achievements into a LinkedIn About section.<br /><br />
              Resume summary:<br />
              [PASTE SUMMARY]<br /><br />
              Top 3 achievements:<br />
              [PASTE ACHIEVEMENTS]<br /><br />
              Requirements:<br />
              - Write in first person (it's LinkedIn, not a resume)<br />
              - 3-4 short paragraphs, under 200 words total<br />
              - Open with a hook, not "I am a..."<br />
              - Include a soft call-to-action at the end (e.g., "reach out if...")<br />
              - Sound like a real person, not a corporate bio
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #25: LinkedIn Experience Adaptation" bestFor="Making resume bullets work on LinkedIn">
              Adapt these resume bullets for my LinkedIn Experience section:<br /><br />
              [PASTE RESUME BULLETS]<br /><br />
              On LinkedIn, I can be slightly more conversational and provide more context than on a resume. For each bullet:<br />
              - Add brief context about why the work mattered<br />
              - Expand acronyms or jargon for a broader audience<br />
              - Keep metrics and achievements front and center<br />
              - Make it readable to people outside my specific field
          </CopyablePrompt>
        </div>

        {/* Before & After Examples */}
        <h2 id="before-after" className="text-3xl font-bold text-ink mt-12 mb-6">
          Before & After: Real Claude Output Examples
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Here's what Claude actually produces when you use these prompts. These are real outputs (with personal details changed) showing the quality difference.
        </p>

        <div className="space-y-8">
          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-4">Example 1: Professional Summary (Prompt #1)</h3>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <p className="font-medium text-red-800 mb-1">Before (user's original):</p>
                <p className="text-red-700 text-sm italic">"I am a marketing professional with 8 years experience. I have worked in digital marketing, content strategy, and brand management. I am looking for a senior marketing role."</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <p className="font-medium text-green-800 mb-1">After (Claude's output):</p>
                <p className="text-green-700 text-sm italic">"Results-driven digital marketing strategist with 8 years of experience scaling content programs that drive measurable revenue growth. Proven track record in brand positioning, demand generation, and cross-channel campaign optimization for B2B SaaS companies. Combines analytical rigor with creative storytelling to build marketing engines that convert."</p>
              </div>
            </div>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-4">Example 2: Achievement Bullet (Prompt #3)</h3>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <p className="font-medium text-red-800 mb-1">Before:</p>
                <p className="text-red-700 text-sm italic">"Responsible for managing the company's social media accounts and posting content regularly."</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <p className="font-medium text-green-800 mb-1">After:</p>
                <p className="text-green-700 text-sm italic">"Grew company social media following from 5K to 28K across three platforms by implementing a data-driven content calendar and engagement strategy."</p>
              </div>
              <p className="text-stone-warm text-sm">Note: Claude asked for the specific metrics before writing the improved version — it didn't invent the numbers.</p>
            </div>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-4">Example 3: Career Change Summary (Prompt #16)</h3>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <p className="font-medium text-red-800 mb-1">Before (teacher transitioning to UX):</p>
                <p className="text-red-700 text-sm italic">"High school teacher looking to transition into UX design. Completed Google UX certificate. Passionate about creating user-friendly experiences."</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <p className="font-medium text-green-800 mb-1">After:</p>
                <p className="text-green-700 text-sm italic">"UX designer with a unique background in education, bringing 6 years of experience designing learning experiences for diverse audiences of 150+ students. Google UX certified with a portfolio of three end-to-end case studies. Applies research-backed instructional design principles to create intuitive digital products."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Claude vs ChatGPT */}
        <h2 id="claude-vs-chatgpt" className="text-3xl font-bold text-ink mt-12 mb-6">
          Claude vs ChatGPT for Resume Writing
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Both are capable resume assistants, but they have different strengths. Here's an honest comparison based on our testing with hundreds of prompts:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-6 py-4 text-left font-bold text-ink">Criteria</th>
                <th className="px-6 py-4 text-left font-bold text-ink">Claude</th>
                <th className="px-6 py-4 text-left font-bold text-ink">ChatGPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Writing quality</td>
                <td className="px-6 py-4 text-ink">More natural, less "AI-sounding." Better at nuanced professional tone.</td>
                <td className="px-6 py-4 text-ink">Good but tends toward buzzwords. Can sound formulaic.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Instruction following</td>
                <td className="px-6 py-4 text-ink">Excellent. Follows multi-step constraints precisely.</td>
                <td className="px-6 py-4 text-ink">Good but sometimes ignores specific constraints in long prompts.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Context window</td>
                <td className="px-6 py-4 text-ink">200K tokens. Easily handles full resume + JD + cover letter.</td>
                <td className="px-6 py-4 text-ink">128K tokens (GPT-4o). Sufficient for most tasks.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Honesty about gaps</td>
                <td className="px-6 py-4 text-ink">Will tell you when something doesn't work. Less likely to fabricate.</td>
                <td className="px-6 py-4 text-ink">More likely to generate plausible-sounding but invented achievements.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Speed</td>
                <td className="px-6 py-4 text-ink">Slightly slower for long outputs.</td>
                <td className="px-6 py-4 text-ink">Faster response generation.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Free access</td>
                <td className="px-6 py-4 text-ink">Free tier on claude.ai (limited messages/day).</td>
                <td className="px-6 py-4 text-ink">Free tier available (GPT-4o mini + limited GPT-4o).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-6">
          <h4 className="font-bold text-ink mb-3">Our recommendation</h4>
          <p className="text-ink/80">
            Use <strong>Claude for writing and tailoring</strong> (summaries, bullets, cover letters, career change narratives) where tone and nuance matter most. Use <strong>ChatGPT for analysis tasks</strong> (keyword extraction, ATS scanning, formatting checks) where speed matters more than prose quality. Or use both — many successful job seekers draft with Claude and verify with ChatGPT.
          </p>
          <p className="text-ink/80 mt-3">
            Want ChatGPT-specific prompts? See our <Link to="/blog/chatgpt-resume-prompts" className="text-accent hover:underline font-medium">25+ ChatGPT prompts for resume writing</Link>.
          </p>
        </div>

        {/* Tips for Better Results */}
        <h2 id="tips" className="text-3xl font-bold text-ink mt-12 mb-6">
          Tips for Getting Better Results from Claude
        </h2>

        <div className="space-y-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              1. Give Claude your full context
            </h3>
            <p className="text-ink/80">
              Claude's 200K context window is its biggest advantage. Paste your entire resume AND the full job description in a single prompt. The more context Claude has, the more tailored its suggestions will be.
            </p>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              2. Tell Claude what NOT to do
            </h3>
            <p className="text-ink/80">
              Claude responds well to negative constraints. Include lines like "Don't invent metrics," "Don't use buzzwords like 'synergy' or 'leverage,'" or "Don't start with 'I am.'" This prevents the most common AI resume pitfalls.
            </p>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              3. Ask for multiple versions
            </h3>
            <p className="text-ink/80">
              Add "Give me 3 versions" to any prompt. Claude will produce meaningfully different options (not just slight rewording). Pick your favorite, then ask Claude to refine it further.
            </p>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              4. Iterate in the same conversation
            </h3>
            <p className="text-ink/80">
              Don't start a new chat for each revision. Claude remembers the full conversation, so say "Make the tone more confident" or "Shorten bullet #3" instead of repasting everything. This produces better results because Claude understands the full context of your resume.
            </p>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              5. Specify your audience
            </h3>
            <p className="text-ink/80">
              A resume for a startup reads differently than one for a Fortune 500 company. Tell Claude your target company type, industry, and the seniority of the person reading your resume. This dramatically improves tone accuracy.
            </p>
          </div>
        </div>

        <div className="my-12 bg-ink text-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center">
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
          <li>
            <Link to="/blog/grok-resume-prompts" className="text-accent hover:underline">
              Grok AI Prompts for Resume Writing
            </Link>
          </li>
          <li>
            <Link to="/resume-keyword-scanner" className="text-accent hover:underline">
              Free ATS Keyword Scanner
            </Link>
          </li>
        </ul>
      </div>
    </BlogLayout>
  );
}
