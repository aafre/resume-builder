import BlogLayout from '../BlogLayout';
import { Link } from 'react-router-dom';
import CopyablePrompt from '../shared/CopyablePrompt';

export default function DeepSeekResumePrompts() {
  return (
    <BlogLayout
      title="20+ DeepSeek Prompts for Resume Writing (Copy & Paste Ready) 2026"
      description="Best DeepSeek prompts for resume writing: professional summaries, experience bullets, ATS keywords, skills optimization, and cover letters. Copy-paste ready for DeepSeek V3 and R1."
      publishDate="2026-03-05"
      readTime="15 min"
      keywords={[
        'deepseek resume prompts',
        'deepseek for resume writing',
        'deepseek resume',
        'deepseek ai resume',
        'best ai resume prompts',
        'deepseek r1 resume',
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          DeepSeek has emerged as one of the most capable AI models in 2026, rivaling GPT-4 and Claude
          for structured writing tasks. Its reasoning model (DeepSeek-R1) is particularly strong at
          analyzing job descriptions and tailoring resume content. These 20+ prompts are organized by
          task so you can copy, paste, and customize immediately.
        </p>

        {/* Table of Contents */}
        <nav className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h2 className="font-bold text-ink mb-4 text-lg">Table of Contents</h2>
          <ol className="space-y-2 text-ink/80 list-decimal list-inside">
            <li><a href="#why-deepseek" className="text-accent hover:underline">Why DeepSeek for Resume Writing</a></li>
            <li><a href="#professional-summary" className="text-accent hover:underline">Professional Summary Prompts (#1-3)</a></li>
            <li><a href="#experience-bullets" className="text-accent hover:underline">Experience Bullet Prompts (#4-7)</a></li>
            <li><a href="#ats-keywords" className="text-accent hover:underline">ATS Keyword Extraction (#8-10)</a></li>
            <li><a href="#skills-section" className="text-accent hover:underline">Skills Section Prompts (#11-13)</a></li>
            <li><a href="#cover-letters" className="text-accent hover:underline">Cover Letter Prompts (#14-16)</a></li>
            <li><a href="#review-polish" className="text-accent hover:underline">Review &amp; Polish Prompts (#17-20)</a></li>
            <li><a href="#deepseek-vs-others" className="text-accent hover:underline">DeepSeek vs Claude vs ChatGPT</a></li>
            <li><a href="#tips" className="text-accent hover:underline">Tips for Better Results</a></li>
          </ol>
        </nav>

        {/* Why DeepSeek */}
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h3 id="why-deepseek" className="font-bold text-ink mb-3">Why DeepSeek for Resume Writing?</h3>
          <ul className="space-y-2 text-ink/80">
            <li><strong>Reasoning Mode (R1):</strong> DeepSeek-R1 can think step-by-step through job description analysis, making it excellent at identifying what employers actually want</li>
            <li><strong>Long Context:</strong> Handles your full resume + job description + company research in a single prompt</li>
            <li><strong>Free Tier:</strong> DeepSeek offers a generous free API and chat interface, making it accessible without a subscription</li>
            <li><strong>Structured Output:</strong> Produces clean, well-formatted text that translates directly to resume content</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-yellow-800 mb-3">Which Model to Use</h3>
          <p className="text-yellow-800">
            <strong>DeepSeek-V3:</strong> Best for general resume writing, bullet generation, and summaries. Fast and reliable.
            <br /><br />
            <strong>DeepSeek-R1 (Reasoning):</strong> Best for job description analysis, keyword extraction, and tailoring your resume to specific roles. Slower but more thorough.
            <br /><br />
            Use V3 for writing tasks and R1 for analysis tasks. Both are available at{' '}
            <a href="https://chat.deepseek.com" className="text-yellow-900 underline" rel="noopener noreferrer" target="_blank">chat.deepseek.com</a>.
          </p>
        </div>

        {/* Professional Summary */}
        <h2 id="professional-summary" className="text-3xl font-bold text-ink mt-12 mb-6">
          Professional Summary Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Your professional summary is the first thing recruiters read. These prompts produce focused,
          specific summaries without the generic filler that AI tools sometimes generate. For more
          examples, see our{' '}
          <Link to="/blog/professional-summary-examples" className="text-accent hover:underline">
            professional summary examples guide
          </Link>.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #1: Targeted Professional Summary" bestFor="Mid-career professionals applying to a specific role">
            Write a professional summary for my resume. Here is my context:<br /><br />
            - Current role: [JOB TITLE] at [COMPANY TYPE, e.g., &ldquo;mid-size SaaS company&rdquo;]<br />
            - Years of experience: [X] years in [INDUSTRY/FIELD]<br />
            - Top 3 skills: [SKILL 1], [SKILL 2], [SKILL 3]<br />
            - Biggest achievement: [ONE KEY ACCOMPLISHMENT with a number/metric]<br />
            - Target role: [JOB TITLE I&rsquo;M APPLYING FOR]<br /><br />
            Write a 3-sentence summary that:<br />
            1. Opens with my professional identity and experience level (do not start with &ldquo;I&rdquo;)<br />
            2. Highlights my most relevant skills and that key achievement<br />
            3. Connects my background to what the target role needs<br /><br />
            Keep it under 60 words. No buzzwords like &ldquo;passionate&rdquo; or &ldquo;driven.&rdquo;
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #2: Career Starter Summary" bestFor="Recent graduates and entry-level candidates">
            Write a professional summary for a recent [DEGREE] graduate from [UNIVERSITY].<br /><br />
            - Major: [MAJOR]<br />
            - Relevant coursework: [COURSE 1], [COURSE 2]<br />
            - Internship/project: [BRIEF DESCRIPTION]<br />
            - Target role: [ENTRY-LEVEL POSITION]<br /><br />
            Write 2-3 sentences that emphasize transferable skills and academic achievements without
            overstating my experience. Do not use the phrase &ldquo;eager to learn&rdquo; or &ldquo;fast learner.&rdquo;
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #3: Executive Summary" bestFor="Senior leaders and directors">
            Write a concise executive summary for a [TITLE] with [X]+ years leading [FUNCTION] at [COMPANY SIZE/TYPE] companies.<br /><br />
            Key results:<br />
            - [REVENUE/GROWTH METRIC]<br />
            - [TEAM/ORG METRIC]<br />
            - [STRATEGIC INITIATIVE]<br /><br />
            The summary should convey strategic impact and leadership scope. Target: 50 words max.
            Use language suitable for board-level audiences.
          </CopyablePrompt>
        </div>

        {/* Experience Bullets */}
        <h2 id="experience-bullets" className="text-3xl font-bold text-ink mt-12 mb-6">
          Experience Bullet Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          The most common resume mistake is listing responsibilities instead of achievements. These prompts
          help DeepSeek transform &ldquo;managed X&rdquo; into &ldquo;achieved Y by doing X.&rdquo; For
          the framework behind this, read our{' '}
          <Link to="/blog/quantify-resume-accomplishments" className="text-accent hover:underline">
            guide to quantifying accomplishments
          </Link>.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #4: Achievement Transformer" bestFor="Turning duties into impact statements">
            Transform this job responsibility into an achievement-focused resume bullet:<br /><br />
            Original: &ldquo;[PASTE YOUR RESPONSIBILITY]&rdquo;<br /><br />
            Rules:<br />
            - Start with a strong action verb (not &ldquo;Responsible for&rdquo; or &ldquo;Helped&rdquo;)<br />
            - Include scope if applicable (team size, budget, user count)<br />
            - End with the business impact or measurable result<br />
            - Keep it under 25 words<br />
            - Do NOT invent metrics I did not provide. If you need a number, ask me.<br /><br />
            Give me 2 versions: one concise, one detailed.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #5: Batch Bullet Rewrite" bestFor="Rewriting multiple bullets at once">
            Rewrite these resume bullets to be achievement-focused. Each bullet should start with a
            different action verb and include measurable impact where the data exists.<br /><br />
            Current bullets:<br />
            1. [BULLET 1]<br />
            2. [BULLET 2]<br />
            3. [BULLET 3]<br />
            4. [BULLET 4]<br /><br />
            For any bullet where I have not included a metric, flag it and suggest what type of metric
            I should add (percentage, dollar amount, time saved, etc.) rather than making one up.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #6: STAR Method Bullets" bestFor="Behavioral-interview-ready resume content">
            I want to write resume bullets using the STAR method (Situation, Task, Action, Result)
            compressed into single lines.<br /><br />
            Here is my raw experience at [COMPANY] as [ROLE]:<br />
            [PASTE 2-3 PARAGRAPHS ABOUT WHAT YOU DID]<br /><br />
            Generate 4-5 resume bullets that each contain:<br />
            - An action verb<br />
            - The context/scope<br />
            - The specific result<br /><br />
            Keep each bullet under 30 words. Vary the action verbs.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #7: Quantify Vague Achievements" bestFor="Adding numbers to qualitative work">
            I have these resume bullets that lack specific metrics:<br /><br />
            1. [VAGUE BULLET 1]<br />
            2. [VAGUE BULLET 2]<br />
            3. [VAGUE BULLET 3]<br /><br />
            For each bullet, suggest 2-3 questions I should ask myself to find a real metric.
            Then rewrite each bullet with a placeholder metric format (e.g., &ldquo;Reduced processing
            time by [X]%&rdquo;) so I can fill in the real number.
          </CopyablePrompt>
        </div>

        {/* ATS Keywords */}
        <h2 id="ats-keywords" className="text-3xl font-bold text-ink mt-12 mb-6">
          ATS Keyword Extraction Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          DeepSeek-R1&rsquo;s reasoning mode excels at extracting keywords from job descriptions. Use
          these prompts to identify exactly what an ATS is scanning for. You can also use our{' '}
          <Link to="/resume-keyword-scanner" className="text-accent hover:underline">
            free ATS keyword scanner
          </Link>{' '}
          to check your match score against a specific job posting.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #8: Job Description Keyword Extraction (Use R1)" bestFor="Identifying ATS keywords from a specific job posting">
            Analyze this job description and extract the keywords an ATS would scan for.<br /><br />
            Job Description:<br />
            [PASTE THE FULL JOB DESCRIPTION]<br /><br />
            Organize the keywords into these categories:<br />
            1. Hard skills (technical tools, software, languages)<br />
            2. Soft skills (leadership, communication, etc.)<br />
            3. Certifications or credentials mentioned<br />
            4. Industry-specific terminology<br />
            5. Action verbs used repeatedly<br /><br />
            For each keyword, note whether it appears in the requirements (must-have) or
            preferred qualifications (nice-to-have).
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #9: Resume vs Job Description Gap Analysis (Use R1)" bestFor="Finding missing keywords before you apply">
            Compare my resume against this job description and identify gaps.<br /><br />
            My resume:<br />
            [PASTE YOUR FULL RESUME TEXT]<br /><br />
            Job description:<br />
            [PASTE THE JOB DESCRIPTION]<br /><br />
            Tell me:<br />
            1. Keywords in the JD that are MISSING from my resume<br />
            2. Keywords I have that match well<br />
            3. Suggested rewrites to naturally incorporate missing keywords<br />
            4. An estimated ATS match percentage<br /><br />
            Be specific about WHERE in my resume each keyword should be added.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #10: Industry Keyword Research" bestFor="Building a keyword bank for your field">
            I am a [JOB TITLE] in the [INDUSTRY] field looking for [TARGET ROLE] positions.<br /><br />
            Generate a keyword bank I should draw from when writing my resume. Organize into:<br />
            1. Technical skills (10-15 keywords)<br />
            2. Tools and platforms (10-15)<br />
            3. Methodologies and frameworks (5-10)<br />
            4. Soft skills valued in this field (5-8)<br />
            5. Metrics and KPIs typical for this role (5-8)<br /><br />
            For a deeper list, see our{' '}
            <Link to="/resume-keywords" className="text-accent hover:underline">resume keywords by job title</Link> pages.
          </CopyablePrompt>
        </div>

        {/* Skills Section */}
        <h2 id="skills-section" className="text-3xl font-bold text-ink mt-12 mb-6">
          Skills Section Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          A well-organized skills section helps both ATS parsers and recruiters quickly assess your
          qualifications. These prompts help categorize and prioritize your skills. For more guidance,
          read our{' '}
          <Link to="/blog/how-to-list-skills" className="text-accent hover:underline">
            guide to listing skills on your resume
          </Link>.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #11: Skills Categorization" bestFor="Organizing a messy list of skills">
            Here are my skills (unorganized):<br />
            [PASTE ALL YOUR SKILLS AS A COMMA-SEPARATED LIST]<br /><br />
            Target role: [JOB TITLE]<br /><br />
            Organize these into 3-4 categories that make sense for my target role.
            Within each category, order skills by relevance to the role (most relevant first).
            Remove any skills that would be assumed or add no value (e.g., &ldquo;Microsoft Word&rdquo;
            for a software engineer).
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #12: Skills Gap Identifier (Use R1)" bestFor="Finding skills you should add or learn">
            My current skills: [LIST YOUR SKILLS]<br /><br />
            Target role: [JOB TITLE] at [COMPANY TYPE]<br /><br />
            Based on current job market trends for this role:<br />
            1. Which of my skills are most valuable? (keep these prominent)<br />
            2. Which are outdated or less relevant? (consider removing)<br />
            3. What skills am I missing that most candidates have? (gap)<br />
            4. What emerging skills would set me apart? (differentiator)
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #13: Technical Proficiency Levels" bestFor="Adding context to technical skills">
            For each of these technical skills, suggest how to indicate proficiency level on a resume
            without using subjective scales like &ldquo;beginner/intermediate/expert.&rdquo;<br /><br />
            Skills: [SKILL 1], [SKILL 2], [SKILL 3], [SKILL 4]<br /><br />
            Instead of proficiency labels, suggest brief context phrases (e.g., &ldquo;Python — built
            production data pipelines processing 10M+ records&rdquo;).
          </CopyablePrompt>
        </div>

        {/* Cover Letters */}
        <h2 id="cover-letters" className="text-3xl font-bold text-ink mt-12 mb-6">
          Cover Letter Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          DeepSeek writes natural-sounding cover letters when given enough context about the role and
          your background. The key is specificity &mdash; generic inputs produce generic output.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #14: Tailored Cover Letter" bestFor="Applications where the cover letter matters">
            Write a cover letter for [JOB TITLE] at [COMPANY NAME].<br /><br />
            My background:<br />
            - Current role: [ROLE] at [COMPANY]<br />
            - Key achievement: [YOUR BEST ACHIEVEMENT WITH METRICS]<br />
            - Why this company: [SPECIFIC REASON — a product, mission, or recent news]<br /><br />
            Job description highlights:<br />
            [PASTE 3-5 KEY REQUIREMENTS FROM THE JOB DESCRIPTION]<br /><br />
            Rules:<br />
            - 3 paragraphs max (opening hook, value proposition, closing)<br />
            - Do not repeat my resume verbatim. Add context and personality.<br />
            - Reference something specific about the company (not generic praise)<br />
            - End with a specific call to action<br />
            - Keep under 300 words total
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #15: Cover Letter Opening Hook" bestFor="Getting past the first sentence">
            Write 3 different opening lines for a cover letter applying to [JOB TITLE] at [COMPANY].<br /><br />
            My strongest qualification for this role: [YOUR TOP SELLING POINT]<br /><br />
            Rules for each opening:<br />
            - Do NOT start with &ldquo;I am writing to apply for...&rdquo;<br />
            - Lead with value, not with a request<br />
            - Make the reader want to continue to the next sentence<br />
            - Keep each option under 30 words
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #16: Cover Letter for Career Change" bestFor="Explaining a non-obvious career transition">
            I am transitioning from [CURRENT FIELD] to [TARGET FIELD].<br /><br />
            My transferable skills: [SKILL 1], [SKILL 2], [SKILL 3]<br />
            Why I am making this change: [HONEST REASON]<br />
            What I have done to prepare: [COURSES, PROJECTS, CERTIFICATIONS]<br /><br />
            Write a cover letter paragraph that addresses the career change directly and
            frames it as a strength rather than a weakness. Do not be apologetic about the switch.
          </CopyablePrompt>
        </div>

        {/* Review & Polish */}
        <h2 id="review-polish" className="text-3xl font-bold text-ink mt-12 mb-6">
          Review &amp; Polish Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Use DeepSeek-R1 for review tasks &mdash; the reasoning model catches issues that
          faster models miss.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #17: Resume Audit (Use R1)" bestFor="Comprehensive resume review before applying">
            Review my resume and provide specific, actionable feedback.<br /><br />
            [PASTE YOUR FULL RESUME]<br /><br />
            Evaluate on these criteria:<br />
            1. Impact: Do bullets show results, not just duties?<br />
            2. Specificity: Are there vague claims that need numbers?<br />
            3. Consistency: Are tenses, formatting, and punctuation consistent?<br />
            4. Length: Is anything too long or redundant?<br />
            5. ATS readiness: Any formatting issues that might confuse a parser?<br /><br />
            For each issue found, provide the original text AND the suggested fix.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #18: Remove AI-Sounding Language" bestFor="Making AI-generated content sound natural">
            Review these resume bullets and remove any language that sounds AI-generated:<br /><br />
            [PASTE YOUR BULLETS]<br /><br />
            Common AI tells to fix:<br />
            - &ldquo;Spearheaded&rdquo; (overused by AI)<br />
            - &ldquo;Leveraged&rdquo; (corporate jargon)<br />
            - &ldquo;Cutting-edge&rdquo; or &ldquo;innovative&rdquo; (vague)<br />
            - Overly long sentences<br /><br />
            Replace with natural, specific language that a real person would use.
            Keep the same meaning and metrics.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #19: Shorten Resume to One Page" bestFor="When your resume is too long">
            My resume is currently [X] pages and needs to be 1 page.<br /><br />
            [PASTE YOUR FULL RESUME]<br /><br />
            Help me cut it down by:<br />
            1. Identifying the least impactful bullets to remove<br />
            2. Combining redundant bullets<br />
            3. Tightening wordy sentences<br />
            4. Suggesting which sections can be shortened<br /><br />
            Preserve my strongest achievements. Show me exactly what to cut and why.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #20: Tailor Resume to Specific Job (Use R1)" bestFor="Customizing your resume for each application">
            I need to tailor my resume for this specific job.<br /><br />
            My current resume:<br />
            [PASTE RESUME]<br /><br />
            Target job description:<br />
            [PASTE JOB DESCRIPTION]<br /><br />
            Do NOT rewrite the entire resume. Instead:<br />
            1. Identify which bullets to keep as-is (they already match)<br />
            2. Identify which bullets to reword (to better align with JD language)<br />
            3. Suggest 1-2 new bullets I should add based on the JD requirements<br />
            4. Flag any keywords from the JD that are completely missing from my resume<br /><br />
            Show changes as &ldquo;Original → Revised&rdquo; format.
          </CopyablePrompt>
        </div>

        {/* Comparison */}
        <h2 id="deepseek-vs-others" className="text-3xl font-bold text-ink mt-12 mb-6">
          DeepSeek vs Claude vs ChatGPT for Resumes
        </h2>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-4 py-4 text-left font-bold text-ink">Feature</th>
                <th className="px-4 py-4 text-center font-bold text-ink">DeepSeek</th>
                <th className="px-4 py-4 text-center font-bold text-ink">Claude</th>
                <th className="px-4 py-4 text-center font-bold text-ink">ChatGPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr>
                <td className="px-4 py-4 font-medium text-ink">Free tier</td>
                <td className="px-4 py-4 text-center text-green-600">Generous</td>
                <td className="px-4 py-4 text-center text-yellow-600">Limited</td>
                <td className="px-4 py-4 text-center text-yellow-600">Limited</td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 font-medium text-ink">Reasoning/analysis</td>
                <td className="px-4 py-4 text-center text-green-600">Excellent (R1)</td>
                <td className="px-4 py-4 text-center text-green-600">Excellent</td>
                <td className="px-4 py-4 text-center text-green-600">Good (o1)</td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-ink">Writing quality</td>
                <td className="px-4 py-4 text-center text-green-600">Strong</td>
                <td className="px-4 py-4 text-center text-green-600">Best</td>
                <td className="px-4 py-4 text-center text-green-600">Strong</td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 font-medium text-ink">Instruction following</td>
                <td className="px-4 py-4 text-center text-green-600">Strong</td>
                <td className="px-4 py-4 text-center text-green-600">Best</td>
                <td className="px-4 py-4 text-center text-green-600">Good</td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-ink">JD keyword extraction</td>
                <td className="px-4 py-4 text-center text-green-600">Excellent</td>
                <td className="px-4 py-4 text-center text-green-600">Excellent</td>
                <td className="px-4 py-4 text-center text-green-600">Good</td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 font-medium text-ink">Best for</td>
                <td className="px-4 py-4 text-center text-stone-warm text-sm">Analysis + free access</td>
                <td className="px-4 py-4 text-center text-stone-warm text-sm">Professional writing</td>
                <td className="px-4 py-4 text-center text-stone-warm text-sm">General purpose</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm">
          <strong>Our take:</strong> Use DeepSeek-R1 for job description analysis and keyword extraction
          (it&rsquo;s free and its reasoning is thorough), then use whichever model writes best for
          your style. Many people get the best results by using one AI for analysis and another for writing.
          See our guides for{' '}
          <Link to="/blog/claude-resume-prompts" className="text-accent hover:underline">Claude resume prompts</Link>
          {' '}and{' '}
          <Link to="/blog/gemini-resume-prompts" className="text-accent hover:underline">Gemini resume prompts</Link>
          {' '}for model-specific techniques. For a broader overview, read our{' '}
          <Link to="/blog/ai-resume-writing-guide" className="text-accent hover:underline">complete AI resume writing guide</Link>.
        </p>

        {/* Tips */}
        <h2 id="tips" className="text-3xl font-bold text-ink mt-12 mb-6">
          Tips for Better Results with DeepSeek
        </h2>

        <div className="space-y-4">
          {[
            {
              num: 1,
              title: 'Use R1 for analysis, V3 for writing',
              desc: 'DeepSeek-R1 is slower but catches nuances in job descriptions that V3 misses. Use R1 for keyword extraction and gap analysis, then switch to V3 for generating resume content.',
            },
            {
              num: 2,
              title: 'Give context before asking for output',
              desc: 'Always paste your full resume and the job description before asking DeepSeek to write. The more context it has, the better the output.',
            },
            {
              num: 3,
              title: 'Tell it what NOT to do',
              desc: 'DeepSeek responds well to constraints: "Do not invent metrics," "Do not use the word passionate," "Keep under 25 words." Negative constraints produce tighter output.',
            },
            {
              num: 4,
              title: 'Ask for multiple versions',
              desc: 'Request 2-3 versions of each bullet or summary. Pick the best parts from each and combine them into your final version.',
            },
            {
              num: 5,
              title: 'Always edit the output',
              desc: 'No AI gets it perfect on the first try. Use DeepSeek as a starting point, then edit for accuracy, tone, and your personal voice. Your resume should sound like you, not like an AI.',
            },
          ].map((tip) => (
            <div key={tip.num} className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {tip.num}
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">{tip.title}</h3>
                <p className="text-stone-warm">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: 'Is DeepSeek free to use for resume writing?',
              a: 'Yes. DeepSeek offers a free chat interface at chat.deepseek.com with access to both V3 and R1 models. There are usage limits on the free tier, but they are generous enough for resume writing tasks.',
            },
            {
              q: 'Is DeepSeek safe for personal resume data?',
              a: 'DeepSeek processes prompts on their servers, so your resume data is sent to their systems. If privacy is a concern, consider removing sensitive details (exact addresses, phone numbers) before pasting your resume. Alternatively, use their API with explicit data handling terms.',
            },
            {
              q: 'Can employers tell if I used AI to write my resume?',
              a: 'Not if you edit the output properly. Always review AI-generated content for accuracy, add your personal details and metrics, and adjust the tone to sound like you. The prompts above include instructions to avoid common AI-sounding phrases.',
            },
            {
              q: 'Should I use DeepSeek or ChatGPT for my resume?',
              a: "DeepSeek-R1 is particularly strong at job description analysis and keyword extraction due to its reasoning capabilities. ChatGPT is more general-purpose. For best results, try both with the same prompt and use whichever output sounds more natural for your situation.",
            },
            {
              q: 'How do I pair AI-written content with a resume builder?',
              a: 'Use AI tools like DeepSeek to generate and refine your content, then paste the polished text into a resume builder for professional formatting. Our free resume builder at EasyFreeResume lets you do this without creating an account.',
            },
          ].map((faq, i) => (
            <div key={i} className="bg-chalk-dark rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">{faq.q}</h3>
              <p className="text-stone-warm">{faq.a}</p>
            </div>
          ))}
        </div>

      </div>
    </BlogLayout>
  );
}
