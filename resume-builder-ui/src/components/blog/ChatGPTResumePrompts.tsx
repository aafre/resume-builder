import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";

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
        <p className="text-xl leading-relaxed text-gray-700 font-medium">
          ChatGPT can be a powerful tool for writing your resume, but only if you know how to prompt it correctly.
          Generic prompts give generic results. These carefully crafted prompts will help you create compelling,
          personalized resume content that actually stands out.
        </p>

        {/* Quick Answer Box */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-green-800 mb-3">
            🎯 Top 3 ChatGPT Resume Prompts (Quick Start)
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-green-700">
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

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          How to Get the Best Results from ChatGPT
        </h2>

        <p className="text-lg leading-relaxed text-gray-700">
          Before diving into specific prompts, here are the key principles that make ChatGPT prompts work for resume writing:
        </p>

        <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg">
          <li><strong>Be specific:</strong> Include your actual job title, years of experience, and industry</li>
          <li><strong>Provide context:</strong> Paste the job description you're targeting</li>
          <li><strong>Set the tone:</strong> Specify "professional," "confident," or "conversational"</li>
          <li><strong>Request format:</strong> Ask for bullet points, sentences, or specific word counts</li>
          <li><strong>Iterate:</strong> Ask ChatGPT to revise and improve its output</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-8">
          <h4 className="font-bold text-blue-800 mb-3">
            💡 Pro Tip: Use These Prompts with EasyFreeResume
          </h4>
          <p className="text-blue-700 mb-4">
            After generating content with ChatGPT, paste it directly into our{" "}
            <Link to="/templates" className="text-blue-600 underline font-medium">
              free resume builder
            </Link>
            . Our ATS-friendly templates ensure your AI-generated content is formatted correctly for applicant tracking systems.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Professional Summary Prompts
        </h2>

        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #1: Standard Professional Summary</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Write a 3-4 sentence professional summary for a [JOB TITLE] with [X] years of experience in [INDUSTRY]. My key strengths are [SKILL 1], [SKILL 2], and [SKILL 3]. I'm applying for a role at [TYPE OF COMPANY]. Make it results-focused and confident without using the word "I" at the beginning of sentences.
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Most industries, experienced professionals
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #2: Career Changer Summary</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Write a professional summary for someone transitioning from [CURRENT FIELD] to [TARGET FIELD]. Emphasize transferable skills like [SKILL 1], [SKILL 2], and [SKILL 3]. Frame my [X] years of experience as an asset for this new direction. Keep it under 60 words.
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Career changers, industry switchers
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #3: Entry-Level Summary</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Write a professional summary for a recent [DEGREE] graduate seeking an entry-level [JOB TITLE] position. Highlight relevant coursework in [SUBJECT], internship experience at [COMPANY/TYPE], and skills in [SKILL 1] and [SKILL 2]. Emphasize eagerness to learn without sounding inexperienced.
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> New graduates, first-time job seekers
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #4: Executive Summary</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Write an executive summary for a [C-SUITE TITLE/VP] with [X]+ years leading [DEPARTMENT/FUNCTION] at [COMPANY SIZE] companies. Key achievements include [ACHIEVEMENT 1], [ACHIEVEMENT 2]. Focus on strategic vision, leadership impact, and business results. Use authoritative but not pompous language.
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Senior leaders, executives, directors
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Work Experience Bullet Point Prompts
        </h2>

        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #5: Transform Duty into Achievement</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Rewrite this job responsibility as a quantified achievement using the formula "Accomplished [X] by doing [Y], resulting in [Z]": "[PASTE YOUR TASK/RESPONSIBILITY]"

              If I don't have exact numbers, suggest realistic metrics I could use or ask me clarifying questions.
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Converting boring job duties into impactful bullets
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #6: Batch Bullet Point Generator</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              I worked as a [JOB TITLE] at [COMPANY TYPE]. Here are my main responsibilities:
              1. [TASK 1]
              2. [TASK 2]
              3. [TASK 3]

              For each one, write 2 achievement-focused resume bullet points that:
              - Start with strong action verbs
              - Include quantifiable results where possible
              - Are under 25 words each
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Quickly generating multiple bullet points
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #7: Action Verb Upgrade</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Improve these resume bullet points by replacing weak verbs (helped, worked, did, made) with stronger action verbs. Keep the same meaning but make them more impactful:

              [PASTE YOUR CURRENT BULLETS]
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Polishing existing resume content
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #8: Keyword-Optimized Bullets</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Here's a job description I'm applying to:
              [PASTE JOB DESCRIPTION]

              And here are my current experience bullets:
              [PASTE YOUR BULLETS]

              Rewrite my bullets to naturally incorporate relevant keywords from the job description while keeping them truthful and achievement-focused.
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Tailoring your resume to specific jobs
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Skills Section Prompts
        </h2>

        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #9: Skills Extraction from Job Description</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Analyze this job description and list the top 15 skills (both hard and soft) that would be most important for this role. Categorize them as "Technical Skills," "Soft Skills," and "Tools/Platforms":

              [PASTE JOB DESCRIPTION]
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Identifying what skills to highlight
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #10: Industry-Specific Skills List</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              List 20 in-demand skills for a [JOB TITLE] in [INDUSTRY] in 2026. Include:
              - 8 technical/hard skills
              - 6 soft skills
              - 6 tools or platforms

              Only include skills that would appear on actual job descriptions, not generic abilities.
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Discovering relevant skills you may have missed
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #11: Skills Gap Analysis</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Compare my current skills to this job description:

              My skills: [LIST YOUR SKILLS]

              Job description: [PASTE JOB DESCRIPTION]

              Identify: 1) Skills I have that match, 2) Skills I have that I should emphasize more, 3) Skills gaps I should address or downplay
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Understanding your fit for a specific role
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Tailoring Your Resume Prompts
        </h2>

        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #12: Full Resume Tailoring</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              I'm applying for this role:
              [PASTE JOB DESCRIPTION]

              Here's my current resume:
              [PASTE RESUME TEXT]

              Suggest specific changes to better align my resume with this job. Include:
              1. Keywords to add
              2. Bullets to reorder or emphasize
              3. Skills to highlight
              4. Any content to remove or de-emphasize
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Customizing your resume for each application
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #13: Company Culture Alignment</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Based on this company's careers page and job description, what tone and keywords should I use in my resume? The company appears to value [X, Y, Z based on your research].

              Job description: [PASTE]

              Suggest how to adapt my language and which experiences to highlight.
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Matching company culture in your messaging
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Industry-Specific Prompts
        </h2>

        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #14: Tech/Software Engineering</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Write 5 resume bullet points for a [LEVEL] software engineer with experience in [TECH STACK]. Each bullet should:
              - Start with an action verb
              - Include a specific technology or methodology
              - Mention scale (users, transactions, team size)
              - Show business impact when possible
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #15: Marketing/Sales</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Write 5 metrics-driven resume bullets for a [MARKETING/SALES ROLE] that highlight:
              - Revenue or pipeline generated
              - Growth percentages
              - Campaign performance (CTR, conversion, etc.)
              - Team leadership or client relationships

              My experience includes: [BRIEF DESCRIPTION]
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #16: Healthcare</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Write professional resume bullets for a [HEALTHCARE ROLE] that emphasize:
              - Patient care quality and outcomes
              - Compliance and safety protocols
              - Team collaboration
              - Any certifications or specialized training

              Keep language appropriate for healthcare industry expectations.
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #17: Finance/Accounting</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Write 5 resume bullets for a [FINANCE ROLE] that showcase:
              - Financial analysis and reporting
              - Process improvements and efficiency gains
              - Compliance and accuracy
              - Tools and systems expertise (Excel, SAP, etc.)

              Use precise language appropriate for the finance industry.
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Advanced Optimization Prompts
        </h2>

        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #18: ATS Keyword Optimization</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Analyze my resume for ATS (Applicant Tracking System) optimization against this job description:

              Job Description: [PASTE]
              My Resume: [PASTE]

              List:
              1. Important keywords I'm missing
              2. Keywords I have but should use more frequently
              3. Any formatting issues that might confuse ATS
              4. Suggested revisions for key bullets
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Ensuring your resume passes automated screening
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #19: Quantification Helper</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Help me add numbers and metrics to these resume bullets. For each one, suggest:
              1. What could be quantified
              2. How to estimate reasonable numbers if I don't have exact figures
              3. A rewritten version with metrics

              My bullets:
              [PASTE YOUR BULLETS]
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Adding impact through quantification
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #20: Conciseness Editor</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              These resume bullets are too long. Shorten each one to under 20 words while keeping the most important information and impact:

              [PASTE YOUR LONG BULLETS]
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              <strong>Best for:</strong> Fitting more content on one page
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Revision and Polish Prompts
        </h2>

        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #21: Grammar and Consistency Check</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Review my resume for:
              1. Grammar and spelling errors
              2. Tense consistency (past tense for past jobs, present for current)
              3. Parallel structure in bullet points
              4. Consistent formatting (periods, capitalization)

              [PASTE RESUME]
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #22: Tone Adjustment</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              My resume currently sounds too [humble/arrogant/generic/casual]. Rewrite these sections to sound more [confident/professional/achievement-focused/modern] while maintaining accuracy:

              [PASTE SECTIONS]
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #23: Remove Fluff and Clichés</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Remove clichés, buzzwords, and empty phrases from my resume. Replace vague terms like "results-driven," "team player," "detail-oriented" with specific examples or concrete achievements:

              [PASTE RESUME]
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Special Situations Prompts
        </h2>

        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #24: Employment Gap Explanation</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              I have a [LENGTH] employment gap from [DATE] to [DATE] because [BRIEF REASON: caregiving, health, education, layoff, etc.].

              Write a brief, professional way to address this that:
              - Doesn't over-explain or apologize
              - Highlights any relevant activities during the gap
              - Positions me as ready and eager to return
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #25: Freelance/Contract Work</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Format my freelance/contract experience professionally. I worked with:
              [LIST CLIENTS/PROJECTS]

              Create a cohesive "Consulting" or "Freelance" section that:
              - Shows diverse experience as a strength
              - Highlights specific achievements
              - Doesn't look like job-hopping
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Prompt #26: Side Projects</h4>
            <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
              Write resume entries for my side projects that demonstrate relevant skills:

              Project 1: [DESCRIBE]
              Project 2: [DESCRIBE]

              Make them sound professional and relevant to a [TARGET JOB] role, even though they weren't paid work.
            </div>
          </div>
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

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Next Steps: Put These Prompts to Work
        </h2>

        <p className="text-lg leading-relaxed text-gray-700">
          Now that you have these prompts, here's how to put them into action:
        </p>

        <ol className="list-decimal list-inside space-y-4 text-lg text-gray-700 mt-4">
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
            <Link to="/templates" className="text-blue-600 underline">
              ATS-friendly resume template
            </Link>
          </li>
        </ol>

        <div className="my-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Build Your AI-Powered Resume?
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Use our free resume builder to format your ChatGPT-generated content into a professional, ATS-friendly resume.
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Start Building Free
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Related Resources
        </h2>

        <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
          <li>
            <Link to="/blog/resume-action-verbs" className="text-blue-600 hover:underline">
              200+ Action Verbs for Resumes
            </Link>
          </li>
          <li>
            <Link to="/blog/how-to-use-resume-keywords" className="text-blue-600 hover:underline">
              How to Use Resume Keywords to Beat the ATS
            </Link>
          </li>
          <li>
            <Link to="/blog/professional-summary-examples" className="text-blue-600 hover:underline">
              Professional Summary Examples
            </Link>
          </li>
          <li>
            <Link to="/blog/quantify-resume-accomplishments" className="text-blue-600 hover:underline">
              How to Quantify Your Resume Accomplishments
            </Link>
          </li>
        </ul>
      </div>
    </BlogLayout>
  );
}
