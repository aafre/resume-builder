import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";
import CopyablePrompt from "../shared/CopyablePrompt";
import ClaudePromptRun from "./ClaudePromptRun";
import runs from "../../data/claudePromptRuns.json";

const RUN_DATE = runs.results.map((r) => r.ran_utc).sort().pop();

export default function ClaudeResumePrompts() {
  return (
    <BlogLayout
      title="Claude Resume Prompts: 25 Tested, Real Outputs (2026)"
      description="25 copy-paste Claude prompts for resume summaries, bullets, cover letters and LinkedIn. Each one run through Claude on a sample resume, with the unedited output shown."
      publishDate="2026-01-21"
      lastUpdated="2026-11-14"
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
        <p className="text-xl leading-relaxed text-ink/60 font-medium">
          These are 25 copy-paste Claude prompts for resume summaries, bullets, cover letters, career changes and LinkedIn. We ran every one through Claude on a sample resume, and you can open the real, unedited output under each prompt to see what you will get before you paste in your own details.
        </p>

        {/* Table of Contents */}
        <nav className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h2 className="font-bold text-ink mb-4 text-lg">
            Table of Contents
          </h2>
          <ol className="space-y-2 text-ink/80 list-decimal list-inside">
            <li><a href="#what-we-found" className="text-accent-text hover:underline">What We Found Running All 25</a></li>
            <li><a href="#professional-summary" className="text-accent-text hover:underline">Professional Summary Prompts (#1-2)</a></li>
            <li><a href="#experience-bullets" className="text-accent-text hover:underline">Experience Bullet Prompts (#3-5)</a></li>
            <li><a href="#job-analysis" className="text-accent-text hover:underline">Job Description Analysis Prompts (#6-7)</a></li>
            <li><a href="#skills-section" className="text-accent-text hover:underline">Skills Section Prompts (#8-9)</a></li>
            <li><a href="#tailoring" className="text-accent-text hover:underline">Tailoring & ATS Optimization (#10-11)</a></li>
            <li><a href="#cover-letters" className="text-accent-text hover:underline">Cover Letter Prompts (#12-14)</a></li>
            <li><a href="#career-change" className="text-accent-text hover:underline">Career Change Prompts (#15-17)</a></li>
            <li><a href="#polish-review" className="text-accent-text hover:underline">Polish & Review Prompts (#18-22)</a></li>
            <li><a href="#linkedin" className="text-accent-text hover:underline">LinkedIn Optimization Prompts (#23-25)</a></li>
            <li><a href="#claude-vs-chatgpt" className="text-accent-text hover:underline">Claude vs ChatGPT for Resumes</a></li>
            <li><a href="#tips" className="text-accent-text hover:underline">Tips for Better Results</a></li>
          </ol>
        </nav>

        {/* Quick Answer Box */}
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h2 className="font-bold text-ink mb-3 text-lg">
            How we tested these prompts
          </h2>
          <ul className="space-y-2 text-ink/80">
            <li><strong>Every prompt, as published:</strong> our test script reads the 25 prompts straight from this page, so the text you copy is the text we ran.</li>
            <li><strong>One sample candidate:</strong> brackets were filled with a made-up backend developer (and, for the career-change prompts, a made-up teacher moving into UX). No real person's resume was used.</li>
            <li><strong>One model, one run each:</strong> Claude Sonnet 5.5 (<code>claude-sonnet-5-5</code>), run on {RUN_DATE} through Anthropic&apos;s Claude Code CLI with no tools and a one-line system prompt. The claude.ai chat app adds its own system prompt, so your output will vary a little, and so will a second run of the same prompt.</li>
            <li><strong>Nothing edited:</strong> open &ldquo;See Claude&apos;s real output&rdquo; under any prompt to read the exact input and the full, unedited reply.</li>
          </ul>
        </div>

        <h2 id="what-we-found" className="text-3xl font-bold text-ink mt-12 mb-6">
          What we found running all 25
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-lg leading-relaxed text-ink/60">
          <li>
            <strong className="text-ink">It asked rather than invented when the prompt allowed it.</strong> Prompt #3 says &ldquo;don&apos;t invent metrics&rdquo;, and Claude returned a template with brackets plus questions instead of a made-up percentage. Where it did use numbers we never gave it (#4, #6, #9), they were labelled as examples.
          </li>
          <li>
            <strong className="text-ink">It still embellished stories.</strong> Given &ldquo;I worked in a warehouse in college&rdquo;, the cover letter (#12) wrote about summers on the warehouse floor and mislabeled pallets. The career-change summary (#16) opened with &ldquo;Designer with six years of experience&rdquo; for a teacher. Read every line as if a recruiter will ask you about it.
          </li>
          <li>
            <strong className="text-ink">It flagged its own stretches, sometimes.</strong> The cover letter upgraded &ldquo;moved 6 services to AWS&rdquo; to &ldquo;led the migration&rdquo;, and then added a note telling you to change it if you only supported the work.
          </li>
          <li>
            <strong className="text-ink">Analysis prompts were blunt.</strong> The resume-vs-job check (#7) scored our deliberately vague sample 4/10 and listed the requirements the resume doesn&apos;t prove. That is more useful than flattery.
          </li>
        </ul>
        {/* Professional Summary Prompts */}
        <h2 id="professional-summary" className="text-3xl font-bold text-ink mt-12 mb-6">
          Professional Summary Prompts for Claude
        </h2>

        <p className="text-lg leading-relaxed text-ink/60 mb-6">
          Your professional summary is the first thing recruiters read. These prompts help Claude write summaries that are specific to your experience without sounding like every other AI-generated resume. For more examples, see our <Link to="/blog/professional-summary-examples" className="text-accent-text hover:underline">professional summary examples guide</Link>.
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
          <ClaudePromptRun n={1} />

          <CopyablePrompt title="Prompt #2: Senior/Executive Summary" bestFor="Directors, VPs, and C-suite candidates">
              Write an executive summary for a [TITLE] with [X]+ years in [INDUSTRY].<br /><br />
              Key achievements:<br />
              - [ACHIEVEMENT 1 with metric]<br />
              - [ACHIEVEMENT 2 with metric]<br /><br />
              The summary should convey strategic thinking and leadership impact without being verbose. Target: 50-60 words. Use language appropriate for board-level communication.
          </CopyablePrompt>
          <ClaudePromptRun n={2} />
        </div>

        {/* Experience Bullets */}
        <h2 id="experience-bullets" className="text-3xl font-bold text-ink mt-12 mb-6">
          Experience Bullet Prompts
        </h2>

        <p className="text-lg leading-relaxed text-ink/60 mb-6">
          The biggest resume mistake is listing responsibilities instead of achievements. These prompts help Claude transform "did X" into "achieved Y by doing X." Check our <Link to="/blog/resume-action-verbs" className="text-accent-text hover:underline">guide to quantifying accomplishments</Link> for the framework behind these prompts.
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
          <ClaudePromptRun n={3} />

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
          <ClaudePromptRun n={4} />

          <CopyablePrompt title="Prompt #5: Role-Specific Bullets" bestFor="Writing bullets from scratch for a specific position">
              Generate 5 resume bullets for a [JOB TITLE] role.<br /><br />
              My key responsibilities included:<br />
              [LIST YOUR MAIN TASKS]<br /><br />
              Results I achieved:<br />
              [LIST ANY OUTCOMES OR METRICS]<br /><br />
              Write bullets that emphasize impact over activity. Each bullet should demonstrate a different skill or competency relevant to [TARGET ROLE].
          </CopyablePrompt>
          <ClaudePromptRun n={5} />
        </div>

        {/* Job Description Analysis */}
        <h2 id="job-analysis" className="text-3xl font-bold text-ink mt-12 mb-6">
          Job Description Analysis Prompts
        </h2>

        <p className="text-lg leading-relaxed text-ink/60 mb-6">
          Claude's long context window makes it ideal for analyzing job descriptions. You can paste the entire JD and your full resume in a single prompt — something most AI tools struggle with. For a deeper dive, read our <Link to="/resume-keyword-scanner" className="text-accent-text hover:underline">AI job description analysis guide</Link>.
        </p>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-5 mb-6">
          <p className="text-ink font-bold mb-1">Want a score, not just a prompt?</p>
          <p className="text-ink/60 text-sm leading-relaxed">
            Paste your resume and the job description into our{' '}
            <Link to="/resume-keyword-scanner" className="text-accent-text hover:underline font-medium">
              free ATS resume checker
            </Link>{' '}
            to see your keyword match score and exactly which terms are missing. No sign-up, and nothing leaves your browser.
          </p>
        </div>

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
          <ClaudePromptRun n={6} />

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
          <ClaudePromptRun n={7} />
        </div>

        {/* Skills Section */}
        <h2 id="skills-section" className="text-3xl font-bold text-ink mt-12 mb-6">
          Skills Section Prompts
        </h2>

        <p className="text-lg leading-relaxed text-ink/60 mb-6">
          A well-organized skills section helps both ATS systems and human recruiters. These prompts help Claude select the right skills and present them strategically. See also: <Link to="/blog/how-to-write-a-resume-guide" className="text-accent-text hover:underline">how to list skills on a resume</Link>.
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
          <ClaudePromptRun n={8} />

          <CopyablePrompt title="Prompt #9: Technical Skills Description" bestFor="Software engineers, data scientists, and other technical roles">
              For each of these technical skills, write a brief phrase showing my proficiency level in a way that's more meaningful than "intermediate" or "advanced":<br /><br />
              Skills: [LIST SKILLS]<br /><br />
              Example format: "Python - built production ETL pipelines" rather than "Python - advanced"
          </CopyablePrompt>
          <ClaudePromptRun n={9} />
        </div>

        <p className="text-lg leading-relaxed text-ink/60">
          Need role-specific keywords to include? Browse our{' '}
          <Link to="/resume-keywords" className="text-accent-text hover:underline">ATS keywords by job title</Link>
          {' '}pages for curated keyword lists, or see a{' '}
          <Link to="/examples/software-engineer" className="text-accent-text hover:underline">software engineer resume example</Link>
          {' '}to see these skills in context.
        </p>

        {/* Tailoring and Optimization */}
        <h2 id="tailoring" className="text-3xl font-bold text-ink mt-12 mb-6">
          Tailoring and ATS Optimization Prompts
        </h2>

        <p className="text-lg leading-relaxed text-ink/60 mb-6">
          Tailoring your resume to each job application is the single most effective way to improve your callback rate. Claude excels here because it can hold your entire resume and the full job description in context simultaneously. Learn more in our <Link to="/resume-keywords" className="text-accent-text hover:underline">ATS keyword optimization guide</Link>, or browse our <Link to="/resume-keywords" className="text-accent-text hover:underline">resume keywords by job title</Link> for role-specific keyword lists.
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
          <ClaudePromptRun n={10} />

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
          <ClaudePromptRun n={11} />
        </div>

        {/* NEW: Cover Letter Prompts */}
        <h2 id="cover-letters" className="text-3xl font-bold text-ink mt-12 mb-6">
          Cover Letter Prompts
        </h2>

        <p className="text-lg leading-relaxed text-ink/60 mb-6">
          Claude writes cover letters that sound human — not like a form letter with your name pasted in. The key is giving Claude enough context about the company and why you're interested. For the full strategy, see our <Link to="/blog/cover-letter-guide" className="text-accent-text hover:underline">cover letter writing guide</Link>.
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
          <ClaudePromptRun n={12} />

          <CopyablePrompt title="Prompt #13: Cold Outreach / Networking Cover Letter" bestFor="Reaching out when there's no posted opening">
              Write a concise email/letter for reaching out to [ROLE/PERSON] at [COMPANY] about potential opportunities.<br /><br />
              My background: [2-3 SENTENCE SUMMARY]<br />
              What I admire about this company: [SPECIFIC DETAIL]<br />
              What I could contribute: [SPECIFIC VALUE]<br /><br />
              Tone: Warm and direct, not salesy. This should read like a confident professional reaching out, not a form letter. Keep it under 150 words.
          </CopyablePrompt>
          <ClaudePromptRun n={13} />

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
          <ClaudePromptRun n={14} />
        </div>

        {/* NEW: Career Change Prompts */}
        <h2 id="career-change" className="text-3xl font-bold text-ink mt-12 mb-6">
          Career Change Prompts
        </h2>

        <p className="text-lg leading-relaxed text-ink/60 mb-6">
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
          <ClaudePromptRun n={15} />

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
          <ClaudePromptRun n={16} />

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
          <ClaudePromptRun n={17} />
        </div>

        {/* Polish and Review */}
        <h2 id="polish-review" className="text-3xl font-bold text-ink mt-12 mb-6">
          Polish and Review Prompts
        </h2>

        <p className="text-lg leading-relaxed text-ink/60 mb-6">
          Before you submit, have Claude do a final review. These prompts cover everything from hiring manager perspective checks to proofreading. For more on using AI for review, see our <Link to="/blog/ai-resume-writing-guide" className="text-accent-text hover:underline">AI resume review guide</Link>.
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
          <ClaudePromptRun n={18} />

          <CopyablePrompt title="Prompt #19: Tone Adjustment" bestFor="Fixing a resume that sounds too humble, too boastful, or too generic">
              The tone of my resume feels [too humble/too boastful/too generic/too casual].<br /><br />
              [PASTE RESUME OR SECTION]<br /><br />
              Rewrite to achieve a tone that is:<br />
              - Confident but not arrogant<br />
              - Professional but not stiff<br />
              - Specific but not verbose<br /><br />
              Show me before/after for key sections.
          </CopyablePrompt>
          <ClaudePromptRun n={19} />

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
          <ClaudePromptRun n={20} />

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
          <ClaudePromptRun n={21} />

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
          <ClaudePromptRun n={22} />
        </div>

        {/* NEW: LinkedIn Optimization */}
        <h2 id="linkedin" className="text-3xl font-bold text-ink mt-12 mb-6">
          LinkedIn Optimization Prompts
        </h2>

        <p className="text-lg leading-relaxed text-ink/60 mb-6">
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
          <ClaudePromptRun n={23} />

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
          <ClaudePromptRun n={24} />

          <CopyablePrompt title="Prompt #25: LinkedIn Experience Adaptation" bestFor="Making resume bullets work on LinkedIn">
              Adapt these resume bullets for my LinkedIn Experience section:<br /><br />
              [PASTE RESUME BULLETS]<br /><br />
              On LinkedIn, I can be slightly more conversational and provide more context than on a resume. For each bullet:<br />
              - Add brief context about why the work mattered<br />
              - Expand acronyms or jargon for a broader audience<br />
              - Keep metrics and achievements front and center<br />
              - Make it readable to people outside my specific field
          </CopyablePrompt>
          <ClaudePromptRun n={25} />
        </div>

        {/* Claude vs ChatGPT */}
        <h2 id="claude-vs-chatgpt" className="text-3xl font-bold text-ink mt-12 mb-6">
          Claude vs ChatGPT for resume writing
        </h2>

        <p className="text-lg leading-relaxed text-ink/60 mb-6">
          We have only run these 25 prompts through Claude so far, so we won&apos;t rank it against ChatGPT or Gemini here. All of these prompts work in any chat assistant. If you test one side by side, give both models the same input and check each answer for details you never gave it. For prompts written for other tools, see the <Link to="/blog/ai-resume-prompts-hub" className="text-accent-text hover:underline font-medium">AI Resume Prompts Hub</Link>.
        </p>

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
              Paste your entire resume and the full job description in one message. In our test, the prompts that had both (#7, #10, #11) gave the most specific advice.
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
              Add "Give me 3 versions" to any prompt, pick the closest one, then ask Claude to refine it. Outputs vary from run to run anyway, so one answer is never the only option.
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

        {/* AI Resume Tools */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-ink mb-2">Explore Other AI Resume Tools</h2>
          <p className="text-ink/60 font-extralight mb-6">Each AI has different strengths for resume writing. Try multiple tools to find what works best for you.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/blog/ai-resume-prompts-hub" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">AI Resume Prompts Hub</h3>
              <p className="text-sm text-ink/60">Compare all AI tools side by side</p>
            </Link>
            <Link to="/blog/ai-cover-letter-prompts" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">AI Cover Letter Prompts</h3>
              <p className="text-sm text-ink/60">Prompts for writing tailored cover letters</p>
            </Link>
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
            className="inline-block bg-white text-accent-text px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Try Free Templates
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Related Resources
        </h2>

        <ul className="list-disc list-inside space-y-2 text-lg text-ink/60">
          <li>
            <Link to="/blog/ai-resume-prompts-hub" className="text-accent-text hover:underline">
              AI Resume Prompts Hub — Compare All Tools
            </Link>
          </li>
          <li>
            <Link to="/blog/ai-resume-writing-guide" className="text-accent-text hover:underline">
              AI Resume Writing: The Complete Guide
            </Link>
          </li>
          <li>
            <Link to="/blog/ai-resume-prompts-hub" className="text-accent-text hover:underline">
              Gemini Prompts for Resume Writing
            </Link>
          </li>
          <li>
            <Link to="/resume-keyword-scanner" className="text-accent-text hover:underline">
              Free ATS Resume Checker
            </Link>
          </li>
        </ul>
      </div>
    </BlogLayout>
  );
}
