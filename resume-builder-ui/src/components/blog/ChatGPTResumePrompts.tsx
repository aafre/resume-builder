import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";
import CopyablePrompt from "../shared/CopyablePrompt";

export default function ChatGPTResumePrompts() {
  return (
    <BlogLayout
      title="25+ ChatGPT Prompts for Resume Writing (Copy & Paste Ready)"
      description="Get the best ChatGPT prompts for writing resume summaries, experience bullets, skills sections, and more. Copy-paste ready prompts that actually work in 2026."
      publishDate="2026-01-21"
      readTime="12 min"
      keywords={[
        "chatgpt resume prompts",
        "chatgpt prompts for resume",
        "ai resume writing",
        "chatgpt resume summary",
        "chatgpt resume bullets",
        "resume prompts ai",
        "how to use chatgpt for resume",
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          ChatGPT can be a powerful tool for writing your resume, but only if you know how to prompt it correctly.
          Generic prompts give generic results. These carefully crafted prompts will help you create compelling,
          personalized resume content that actually stands out.
        </p>

        {/* Quick Answer Box */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-green-800 mb-3">
            🎯 Top 3 ChatGPT Resume Prompts (Quick Start)
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-accent">
            <li>
              <strong>Professional Summary:</strong> "Write a 3-sentence professional summary for a [job title] with [X years] experience in [industry]. Highlight expertise in [skill 1], [skill 2], and [skill 3]. Make it confident but not arrogant."
            </li>
            <li>
              <strong>Experience Bullet:</strong> "Rewrite this job responsibility as an achievement-focused resume bullet using the XYZ formula (Accomplished X by doing Y, resulting in Z): [paste your task]"
            </li>
            <li>
              <strong>Skills Match:</strong> "Based on this job description, list the top 10 hard and soft skills I should emphasize on my resume: [paste job description]"
            </li>
          </ol>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          How to Get the Best Results from ChatGPT
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Before diving into specific prompts, here are the key principles that make ChatGPT prompts work for resume writing:
        </p>

        <ul className="list-disc list-inside space-y-3 text-stone-warm text-lg">
          <li><strong>Be specific:</strong> Include your actual job title, years of experience, and industry</li>
          <li><strong>Provide context:</strong> Paste the job description you're targeting</li>
          <li><strong>Set the tone:</strong> Specify "professional," "confident," or "conversational"</li>
          <li><strong>Request format:</strong> Ask for bullet points, sentences, or specific word counts</li>
          <li><strong>Iterate:</strong> Ask ChatGPT to revise and improve its output</li>
        </ul>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h4 className="font-bold text-ink mb-3">
            💡 Pro Tip: Use These Prompts with EasyFreeResume
          </h4>
          <p className="text-ink/80 mb-4">
            After generating content with ChatGPT, paste it directly into our{" "}
            <Link to="/templates" className="text-accent underline font-medium">
              free resume builder
            </Link>
            . Our ATS-friendly templates ensure your AI-generated content is formatted correctly for applicant tracking systems.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Professional Summary Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt
            title="Prompt #1: Standard Professional Summary"
            bestFor="Most industries, experienced professionals"
          >
            Write a 3-4 sentence professional summary for a [JOB TITLE] with [X] years of experience in [INDUSTRY]. My key strengths are [SKILL 1], [SKILL 2], and [SKILL 3]. I'm applying for a role at [TYPE OF COMPANY]. Make it results-focused and confident without using the word "I" at the beginning of sentences.
          </CopyablePrompt>

          <CopyablePrompt
            title="Prompt #2: Career Changer Summary"
            bestFor="Career changers, industry switchers"
          >
            Write a professional summary for someone transitioning from [CURRENT FIELD] to [TARGET FIELD]. Emphasize transferable skills like [SKILL 1], [SKILL 2], and [SKILL 3]. Frame my [X] years of experience as an asset for this new direction. Keep it under 60 words.
          </CopyablePrompt>

          <CopyablePrompt
            title="Prompt #3: Entry-Level Summary"
            bestFor="New graduates, first-time job seekers"
          >
            Write a professional summary for a recent [DEGREE] graduate seeking an entry-level [JOB TITLE] position. Highlight relevant coursework in [SUBJECT], internship experience at [COMPANY/TYPE], and skills in [SKILL 1] and [SKILL 2]. Emphasize eagerness to learn without sounding inexperienced.
          </CopyablePrompt>

          <CopyablePrompt
            title="Prompt #4: Executive Summary"
            bestFor="Senior leaders, executives, directors"
          >
            Write an executive summary for a [C-SUITE TITLE/VP] with [X]+ years leading [DEPARTMENT/FUNCTION] at [COMPANY SIZE] companies. Key achievements include [ACHIEVEMENT 1], [ACHIEVEMENT 2]. Focus on strategic vision, leadership impact, and business results. Use authoritative but not pompous language.
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Work Experience Bullet Point Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt
            title="Prompt #5: Transform Duty into Achievement"
            bestFor="Converting boring job duties into impactful bullets"
          >
            Rewrite this job responsibility as a quantified achievement using the formula "Accomplished [X] by doing [Y], resulting in [Z]": "[PASTE YOUR TASK/RESPONSIBILITY]"<br /><br />
            If I don't have exact numbers, suggest realistic metrics I could use or ask me clarifying questions.
          </CopyablePrompt>

          <CopyablePrompt
            title="Prompt #6: Batch Bullet Point Generator"
            bestFor="Quickly generating multiple bullet points"
          >
            I worked as a [JOB TITLE] at [COMPANY TYPE]. Here are my main responsibilities:<br />
            1. [TASK 1]<br />
            2. [TASK 2]<br />
            3. [TASK 3]<br /><br />
            For each one, write 2 achievement-focused resume bullet points that:<br />
            - Start with strong action verbs<br />
            - Include quantifiable results where possible<br />
            - Are under 25 words each
          </CopyablePrompt>

          <CopyablePrompt
            title="Prompt #7: Action Verb Upgrade"
            bestFor="Polishing existing resume content"
          >
            Improve these resume bullet points by replacing weak verbs (helped, worked, did, made) with stronger action verbs. Keep the same meaning but make them more impactful:<br /><br />
            [PASTE YOUR CURRENT BULLETS]
          </CopyablePrompt>

          <CopyablePrompt
            title="Prompt #8: Keyword-Optimized Bullets"
            bestFor="Tailoring your resume to specific jobs"
          >
            Here's a job description I'm applying to:<br />
            [PASTE JOB DESCRIPTION]<br /><br />
            And here are my current experience bullets:<br />
            [PASTE YOUR BULLETS]<br /><br />
            Rewrite my bullets to naturally incorporate relevant keywords from the job description while keeping them truthful and achievement-focused.
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Skills Section Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt
            title="Prompt #9: Skills Extraction from Job Description"
            bestFor="Identifying what skills to highlight"
          >
            Analyze this job description and list the top 15 skills (both hard and soft) that would be most important for this role. Categorize them as "Technical Skills," "Soft Skills," and "Tools/Platforms":<br /><br />
            [PASTE JOB DESCRIPTION]
          </CopyablePrompt>

          <CopyablePrompt
            title="Prompt #10: Industry-Specific Skills List"
            bestFor="Discovering relevant skills you may have missed"
          >
            List 20 in-demand skills for a [JOB TITLE] in [INDUSTRY] in 2026. Include:<br />
            - 8 technical/hard skills<br />
            - 6 soft skills<br />
            - 6 tools or platforms<br /><br />
            Only include skills that would appear on actual job descriptions, not generic abilities.
          </CopyablePrompt>

          <CopyablePrompt
            title="Prompt #11: Skills Gap Analysis"
            bestFor="Understanding your fit for a specific role"
          >
            Compare my current skills to this job description:<br /><br />
            My skills: [LIST YOUR SKILLS]<br /><br />
            Job description: [PASTE JOB DESCRIPTION]<br /><br />
            Identify: 1) Skills I have that match, 2) Skills I have that I should emphasize more, 3) Skills gaps I should address or downplay
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Tailoring Your Resume Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt
            title="Prompt #12: Full Resume Tailoring"
            bestFor="Customizing your resume for each application"
          >
            I'm applying for this role:<br />
            [PASTE JOB DESCRIPTION]<br /><br />
            Here's my current resume:<br />
            [PASTE RESUME TEXT]<br /><br />
            Suggest specific changes to better align my resume with this job. Include:<br />
            1. Keywords to add<br />
            2. Bullets to reorder or emphasize<br />
            3. Skills to highlight<br />
            4. Any content to remove or de-emphasize
          </CopyablePrompt>

          <CopyablePrompt
            title="Prompt #13: Company Culture Alignment"
            bestFor="Matching company culture in your messaging"
          >
            Based on this company's careers page and job description, what tone and keywords should I use in my resume? The company appears to value [X, Y, Z based on your research].<br /><br />
            Job description: [PASTE]<br /><br />
            Suggest how to adapt my language and which experiences to highlight.
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Industry-Specific Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #14: Tech/Software Engineering">
            Write 5 resume bullet points for a [LEVEL] software engineer with experience in [TECH STACK]. Each bullet should:<br />
            - Start with an action verb<br />
            - Include a specific technology or methodology<br />
            - Mention scale (users, transactions, team size)<br />
            - Show business impact when possible
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #15: Marketing/Sales">
            Write 5 metrics-driven resume bullets for a [MARKETING/SALES ROLE] that highlight:<br />
            - Revenue or pipeline generated<br />
            - Growth percentages<br />
            - Campaign performance (CTR, conversion, etc.)<br />
            - Team leadership or client relationships<br /><br />
            My experience includes: [BRIEF DESCRIPTION]
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #16: Healthcare">
            Write professional resume bullets for a [HEALTHCARE ROLE] that emphasize:<br />
            - Patient care quality and outcomes<br />
            - Compliance and safety protocols<br />
            - Team collaboration<br />
            - Any certifications or specialized training<br /><br />
            Keep language appropriate for healthcare industry expectations.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #17: Finance/Accounting">
            Write 5 resume bullets for a [FINANCE ROLE] that showcase:<br />
            - Financial analysis and reporting<br />
            - Process improvements and efficiency gains<br />
            - Compliance and accuracy<br />
            - Tools and systems expertise (Excel, SAP, etc.)<br /><br />
            Use precise language appropriate for the finance industry.
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Advanced Optimization Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt
            title="Prompt #18: ATS Keyword Optimization"
            bestFor="Ensuring your resume passes automated screening"
          >
            Analyze my resume for ATS (Applicant Tracking System) optimization against this job description:<br /><br />
            Job Description: [PASTE]<br />
            My Resume: [PASTE]<br /><br />
            List:<br />
            1. Important keywords I'm missing<br />
            2. Keywords I have but should use more frequently<br />
            3. Any formatting issues that might confuse ATS<br />
            4. Suggested revisions for key bullets
          </CopyablePrompt>

          <CopyablePrompt
            title="Prompt #19: Quantification Helper"
            bestFor="Adding impact through quantification"
          >
            Help me add numbers and metrics to these resume bullets. For each one, suggest:<br />
            1. What could be quantified<br />
            2. How to estimate reasonable numbers if I don't have exact figures<br />
            3. A rewritten version with metrics<br /><br />
            My bullets:<br />
            [PASTE YOUR BULLETS]
          </CopyablePrompt>

          <CopyablePrompt
            title="Prompt #20: Conciseness Editor"
            bestFor="Fitting more content on one page"
          >
            These resume bullets are too long. Shorten each one to under 20 words while keeping the most important information and impact:<br /><br />
            [PASTE YOUR LONG BULLETS]
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Revision and Polish Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #21: Grammar and Consistency Check">
            Review my resume for:<br />
            1. Grammar and spelling errors<br />
            2. Tense consistency (past tense for past jobs, present for current)<br />
            3. Parallel structure in bullet points<br />
            4. Consistent formatting (periods, capitalization)<br /><br />
            [PASTE RESUME]
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #22: Tone Adjustment">
            My resume currently sounds too [humble/arrogant/generic/casual]. Rewrite these sections to sound more [confident/professional/achievement-focused/modern] while maintaining accuracy:<br /><br />
            [PASTE SECTIONS]
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #23: Remove Fluff and Clichés">
            Remove clichés, buzzwords, and empty phrases from my resume. Replace vague terms like "results-driven," "team player," "detail-oriented" with specific examples or concrete achievements:<br /><br />
            [PASTE RESUME]
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Special Situations Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #24: Employment Gap Explanation">
            I have a [LENGTH] employment gap from [DATE] to [DATE] because [BRIEF REASON: caregiving, health, education, layoff, etc.].<br /><br />
            Write a brief, professional way to address this that:<br />
            - Doesn't over-explain or apologize<br />
            - Highlights any relevant activities during the gap<br />
            - Positions me as ready and eager to return
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #25: Freelance/Contract Work">
            Format my freelance/contract experience professionally. I worked with:<br />
            [LIST CLIENTS/PROJECTS]<br /><br />
            Create a cohesive "Consulting" or "Freelance" section that:<br />
            - Shows diverse experience as a strength<br />
            - Highlights specific achievements<br />
            - Doesn't look like job-hopping
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #26: Side Projects">
            Write resume entries for my side projects that demonstrate relevant skills:<br /><br />
            Project 1: [DESCRIBE]<br />
            Project 2: [DESCRIBE]<br /><br />
            Make them sound professional and relevant to a [TARGET JOB] role, even though they weren't paid work.
          </CopyablePrompt>
        </div>

        {/* Important Warnings */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-red-800 mb-3">
            ⚠️ Important: Always Review AI-Generated Content
          </h3>
          <ul className="list-disc list-inside space-y-2 text-red-700">
            <li><strong>Fact-check everything:</strong> ChatGPT may hallucinate details. Never include claims you can't back up.</li>
            <li><strong>Personalize the output:</strong> Generic AI text is obvious to recruiters. Add your unique voice.</li>
            <li><strong>Don't over-promise:</strong> Inflated claims will backfire in interviews.</li>
            <li><strong>Verify keywords:</strong> Ensure suggested keywords actually appear in your target job descriptions.</li>
            <li><strong>Keep it truthful:</strong> Your resume is a professional document. Embellishment is risky.</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Next Steps: Put These Prompts to Work
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Now that you have these prompts, here's how to put them into action:
        </p>

        <ol className="list-decimal list-inside space-y-4 text-lg text-stone-warm mt-4">
          <li>
            <strong>Choose 3-5 prompts</strong> that match your current needs (summary, experience, skills)
          </li>
          <li>
            <strong>Customize each prompt</strong> with your specific details before using
          </li>
          <li>
            <strong>Iterate on the output</strong> – ask ChatGPT to revise, shorten, or adjust tone
          </li>
          <li>
            <strong>Review and edit</strong> everything for accuracy and your personal voice
          </li>
          <li>
            <strong>Format properly</strong> using an{" "}
            <Link to="/templates" className="text-accent underline">
              ATS-friendly resume template
            </Link>
          </li>
        </ol>

        <div className="my-12 bg-ink text-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Build Your AI-Powered Resume?
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Use our free resume builder to format your ChatGPT-generated content into a professional, ATS-friendly resume.
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
            <Link to="/blog/resume-action-verbs" className="text-accent hover:underline">
              200+ Action Verbs for Resumes
            </Link>
          </li>
          <li>
            <Link to="/blog/how-to-use-resume-keywords" className="text-accent hover:underline">
              How to Use Resume Keywords to Beat the ATS
            </Link>
          </li>
          <li>
            <Link to="/blog/professional-summary-examples" className="text-accent hover:underline">
              Professional Summary Examples
            </Link>
          </li>
          <li>
            <Link to="/blog/quantify-resume-accomplishments" className="text-accent hover:underline">
              How to Quantify Your Resume Accomplishments
            </Link>
          </li>
        </ul>
      </div>
    </BlogLayout>
  );
}
