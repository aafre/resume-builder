import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";
import CopyablePrompt from "../shared/CopyablePrompt";

export default function GrokResumePrompts() {
  return (
    <BlogLayout
      title="Grok AI Prompts for Resume Writing (2026)"
      description="Use Grok AI (xAI) for fast resume writing with a conversational approach. Best prompts for quick iterations and real-time resume feedback."
      publishDate="2026-01-21"
      readTime="7 min"
      keywords={[
        "grok resume prompts",
        "grok ai resume",
        "xai resume writing",
        "grok prompts job application",
        "grok for resume",
        "x grok resume",
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-gray-700 font-medium">
          Grok, developed by xAI, brings a conversational and fast approach to AI interactions.
          Its speed and willingness to iterate quickly make it useful for brainstorming and
          rapid resume refinement.
        </p>

        {/* Quick Answer Box */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-orange-800 mb-3">
            🎯 Grok's Strengths for Resume Writing
          </h3>
          <ul className="space-y-2 text-orange-700">
            <li><strong>Speed:</strong> Fast responses for quick iterations</li>
            <li><strong>Conversational:</strong> Natural back-and-forth refinement</li>
            <li><strong>Direct:</strong> Tends to give straightforward feedback</li>
            <li><strong>Current:</strong> Access to recent information via X integration</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Quick Iteration Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #1: Rapid Bullet Improvement">
              Make this resume bullet more impactful in 3 different ways:<br /><br />
              "[YOUR BULLET]"<br /><br />
              Give me:<br />
              1. More action-oriented version<br />
              2. More metrics-focused version<br />
              3. More concise version
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #2: Quick Summary Generator">
              Write a punchy 2-sentence professional summary for a [JOB TITLE] with [X] years experience. Key skills: [LIST 3]. Make it memorable, not generic.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #3: Verb Swap">
              These bullets start with weak verbs. Give me stronger alternatives:<br /><br />
              [PASTE BULLETS]<br /><br />
              Just show me the improved verbs, I'll handle the rest.
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Brainstorming Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #4: Achievement Mining">
              I was a [JOB TITLE] at a [COMPANY TYPE]. My main job was [BRIEF DESCRIPTION].<br /><br />
              Help me identify 5 potential achievements I might have had that would look good on a resume. Ask me questions to dig deeper.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #5: Skills Brainstorm">
              I'm a [JOB TITLE] applying for [TARGET ROLE].<br /><br />
              What skills should I definitely include? What skills would make me stand out? What skills should I skip? Be direct.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #6: Unique Value Proposition">
              Here's my background: [BRIEF SUMMARY]<br /><br />
              What makes me different from other [JOB TITLE] candidates? Help me find my unique angle for my resume.
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Honest Feedback Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #7: Brutal Review">
              Be honest and direct about this resume. What's weak? What's missing? What would make a recruiter pass?<br /><br />
              [PASTE RESUME]<br /><br />
              I can take criticism. Don't hold back.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #8: Red Flag Check">
              Look at my resume and tell me any red flags a recruiter might see:<br /><br />
              [PASTE RESUME]<br /><br />
              - Employment gaps?<br />
              - Job hopping?<br />
              - Missing information?<br />
              - Anything else concerning?
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #9: Competitive Reality Check">
              Realistically, how competitive am I for this role?<br /><br />
              My resume: [PASTE]<br /><br />
              Target job: [PASTE JD]<br /><br />
              Give me the honest truth and what I'd need to change.
          </CopyablePrompt>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Quick Fix Prompts
        </h2>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #10: Cut the Fluff">
              Remove all the fluff, buzzwords, and clichés from this text. Keep only what's concrete and meaningful:<br /><br />
              [PASTE TEXT]
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #11: Quick Keyword Inject">
              Add these keywords naturally into my bullets without making them sound forced:<br /><br />
              Keywords: [LIST]<br /><br />
              Bullets: [PASTE]
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #12: Tone Shift">
              This sounds too [humble/boring/aggressive]. Make it sound more [confident/interesting/professional]:<br /><br />
              [PASTE TEXT]
          </CopyablePrompt>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-8">
          <h4 className="font-bold text-yellow-800 mb-3">
            ⚡ Speed Tip
          </h4>
          <p className="text-yellow-700">
            Grok's strength is rapid iteration. Use short prompts, get quick responses,
            and keep refining. It's great for brainstorming sessions where you want to
            explore multiple directions quickly.
          </p>
        </div>

        <div className="my-12 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Format Your Resume Properly
          </h3>
          <p className="text-xl mb-6 opacity-90">
            After brainstorming with Grok, use our free ATS-friendly templates.
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-gray-800 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Try Free Templates
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Related Resources
        </h2>

        <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
          <li>
            <Link to="/blog/chatgpt-resume-prompts" className="text-blue-600 hover:underline">
              25+ ChatGPT Prompts for Resume Writing
            </Link>
          </li>
          <li>
            <Link to="/blog/ai-resume-writing-guide" className="text-blue-600 hover:underline">
              AI Resume Writing: The Complete Guide
            </Link>
          </li>
        </ul>
      </div>
    </BlogLayout>
  );
}
