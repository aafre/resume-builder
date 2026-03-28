import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";

const FAQS = [
  {
    question: "What is the STAR method for behavioral interview questions?",
    answer: "The STAR method is a structured framework for answering behavioral questions: Situation (set the context), Task (explain the challenge), Action (describe the specific steps you took), and Result (share the outcomes with quantifiable data). It helps you give clear, concise, and compelling answers.",
  },
  {
    question: "How long should a STAR response be?",
    answer: "Aim for 1-2 minutes per answer. Keep your response concise by spending about 10% on the Situation, 10% on the Task, 60% on the Action, and 20% on the Result. Focus on your specific contributions and quantify results whenever possible.",
  },
  {
    question: "How many STAR stories should I prepare before an interview?",
    answer: "Prepare at least 8-10 STAR stories covering different competencies such as leadership, teamwork, problem-solving, conflict resolution, and handling pressure. Each story can often be adapted to answer multiple types of behavioral questions.",
  },
  {
    question: "What if I don't have work experience for behavioral questions?",
    answer: "You can draw from academic projects, volunteer work, internships, extracurricular activities, or personal challenges. Interviewers care about how you approach situations, not just where the experience comes from. Focus on transferable skills and lessons learned.",
  },
  {
    question: "How do I answer 'Tell me about a time you failed'?",
    answer: "Choose a genuine but not catastrophic failure. Briefly describe the situation and what went wrong, then focus most of your answer on what you learned, the changes you made going forward, and how the experience made you a better professional. Always end on a positive, growth-oriented note.",
  },
];

export default function BehavioralInterviewQuestions() {
  return (
    <BlogLayout
      title="15+ Behavioral Interview Questions (and How to Answer with the STAR Method)"
      description="Prepare for tough behavioral questions by mastering the STAR method with these common examples, full STAR answer walkthrough, and category-by-category question bank."
      publishDate="2026-01-02"
      lastUpdated="2026-03-22"
      readTime="12 min"
      keywords={[
        "behavioral interview questions",
        "STAR method",
        "interview examples",
        "behavioral questions examples",
        "job interview preparation",
        "interview answers",
        "STAR method examples",
        "behavioral interview tips",
      ]}
      ctaType="interview"
      faqs={FAQS}
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Behavioral interview questions are designed to reveal how you've
          handled real situations in the past, giving employers concrete insight
          into how you'll perform on the job. Updated for 2026, this guide
          breaks down the STAR method with a full walkthrough example, organizes
          15+ questions by category, and gives you a practice framework so you
          walk into every interview ready. If you're also preparing your
          resume, our{" "}
          <Link to="/blog/job-interview-guide" className="text-accent hover:underline">
            comprehensive interview guide
          </Link>{" "}
          covers the full preparation process from application to offer.
        </p>

        {/* Table of Contents */}
        <nav className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h2 className="font-bold text-ink mb-4 text-lg">
            Table of Contents
          </h2>
          <ol className="space-y-2 text-ink/80 list-decimal list-inside">
            <li><a href="#what-are-behavioral-questions" className="text-accent hover:underline">What Are Behavioral Interview Questions?</a></li>
            <li><a href="#star-method" className="text-accent hover:underline">The STAR Method (with Full Example)</a></li>
            <li><a href="#leadership" className="text-accent hover:underline">Leadership & Management Questions</a></li>
            <li><a href="#problem-solving" className="text-accent hover:underline">Problem-Solving & Critical Thinking</a></li>
            <li><a href="#teamwork" className="text-accent hover:underline">Teamwork & Collaboration</a></li>
            <li><a href="#pressure" className="text-accent hover:underline">Handling Pressure & Challenges</a></li>
            <li><a href="#communication" className="text-accent hover:underline">Communication & Influence</a></li>
            <li><a href="#conflict" className="text-accent hover:underline">Conflict Resolution Questions</a></li>
            <li><a href="#virtual-interviews" className="text-accent hover:underline">Tips for Virtual & Video Interviews</a></li>
            <li><a href="#how-to-practice" className="text-accent hover:underline">How to Practice Behavioral Answers</a></li>
            <li><a href="#pro-tips" className="text-accent hover:underline">Pro Tips for STAR Responses</a></li>
            <li><a href="#faq" className="text-accent hover:underline">FAQ</a></li>
            <li><a href="#related-guides" className="text-accent hover:underline">Related Guides</a></li>
          </ol>
        </nav>

        {/* ─── What Are Behavioral Questions ─── */}
        <h2 id="what-are-behavioral-questions" className="text-3xl font-bold text-ink mt-12 mb-6">
          What Are Behavioral Interview Questions?
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Behavioral questions typically start with phrases like "Tell me about
          a time when..." or "Give me an example of..." They're based on the
          premise that past behavior is the best predictor of future
          performance. Instead of asking what you <em>would</em> do in a
          hypothetical scenario, interviewers want to hear what you{" "}
          <em>actually did</em>.
        </p>

        <p className="text-lg leading-relaxed text-stone-warm">
          According to a 2025 SHRM survey, over 80% of Fortune 500 companies
          use behavioral interviewing as their primary screening method. You
          can expect anywhere from 3 to 8 behavioral questions in a typical
          45-minute interview. For technical roles, they're often paired with
          situational or coding questions; for management roles, they may
          dominate the entire session.
        </p>

        <p className="text-lg leading-relaxed text-stone-warm">
          The key to answering well is preparation. Before your interview,
          review the job description and identify which competencies the role
          requires. Our{" "}
          <Link to="/resume-keywords" className="text-accent hover:underline">
            resume keywords tool
          </Link>{" "}
          can help you pinpoint the exact skills and phrases that matter most
          for a given role — the same keywords that show up in behavioral
          questions.
        </p>

        {/* ─── STAR Method Deep Dive ─── */}
        <h2 id="star-method" className="text-3xl font-bold text-ink mt-12 mb-6">
          The STAR Method: A Complete Breakdown
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          The STAR method is the gold standard framework for structuring
          behavioral interview answers. Each letter stands for a component of
          your story:
        </p>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-6">
          <h3 className="font-bold text-ink mb-3">
            The STAR Method Breakdown:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-ink/80">
            <li>
              <strong>Situation:</strong> Set the context with specific details
              about when, where, and the business circumstances. Keep this to
              2-3 sentences.
            </li>
            <li>
              <strong>Task:</strong> Explain what you needed to accomplish,
              what challenge you faced, or what responsibility fell to you
              specifically.
            </li>
            <li>
              <strong>Action:</strong> Describe the specific steps YOU took to
              address the situation. This should be the longest part — 60% of
              your answer. Use "I" not "we."
            </li>
            <li>
              <strong>Result:</strong> Share the outcomes, preferably with
              quantifiable data (percentages, dollar amounts, time saved).
              Include what you learned.
            </li>
          </ul>
        </div>

        <h3 className="text-xl font-bold text-ink mb-3">
          Full STAR Example: "Tell me about a time you improved a process."
        </h3>

        <div className="space-y-4 my-6">
          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-5">
            <p className="text-sm font-bold text-accent uppercase tracking-wide mb-2">Situation</p>
            <p className="text-ink/80">
              "At my previous company, a mid-size SaaS startup, our customer
              onboarding process was taking an average of 14 days from signup
              to first value. The sales team was closing deals, but churn at
              30 days was 22% because new users weren't getting set up fast
              enough."
            </p>
          </div>
          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-5">
            <p className="text-sm font-bold text-accent uppercase tracking-wide mb-2">Task</p>
            <p className="text-ink/80">
              "As the customer success lead, I was asked to reduce onboarding
              time and cut 30-day churn by at least 5 percentage points before
              Q3."
            </p>
          </div>
          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-5">
            <p className="text-sm font-bold text-accent uppercase tracking-wide mb-2">Action</p>
            <p className="text-ink/80">
              "I mapped the entire onboarding journey and found three
              bottlenecks: manual data import, a confusing permission setup
              screen, and delayed scheduling of kickoff calls. I partnered
              with engineering to build a CSV import wizard, redesigned the
              permissions UI with our product designer, and created an
              automated scheduling flow that booked kickoff calls within 24
              hours of signup. I also built a library of short tutorial videos
              for the five most common setup tasks."
            </p>
          </div>
          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-5">
            <p className="text-sm font-bold text-accent uppercase tracking-wide mb-2">Result</p>
            <p className="text-ink/80">
              "Onboarding time dropped from 14 days to 5 days. Thirty-day
              churn fell from 22% to 11%, beating the target by 6 points.
              Customer satisfaction scores for onboarding went from 3.2 to
              4.6 out of 5. The framework I built was later adopted by two
              other product teams."
            </p>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm">
          Notice how the answer is specific, quantified, and focused on
          personal actions. This is exactly the kind of story that makes
          interviewers take notes. You can use the same approach when writing
          accomplishment bullets on your resume — see our{" "}
          <Link to="/blog/how-to-write-a-resume-guide" className="text-accent hover:underline">
            complete resume writing guide
          </Link>{" "}
          for more on translating STAR stories into resume bullets.
        </p>

        {/* ─── Leadership Questions ─── */}
        <h2 id="leadership" className="text-3xl font-bold text-ink mt-12 mb-6">
          Leadership & Management Questions
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          These questions assess your ability to guide teams, make decisions,
          and drive results. If you're targeting a management role, expect 2-3
          of these. For examples of how to present leadership experience on
          paper, check our{" "}
          <Link to="/examples/project-manager" className="text-accent hover:underline">
            project manager resume example
          </Link>{" "}
          for strong leadership bullet points.
        </p>

        <div className="space-y-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">
              1. "Tell me about a time when you had to lead a team through a
              difficult situation."
            </h4>
            <p className="text-ink/80">
              <strong>Focus on:</strong> Your leadership style, how you
              motivated others, and the positive outcome you achieved together.
              Mention the team size and the stakes involved.
            </p>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">
              2. "Describe a time when you had to motivate an underperforming
              team member."
            </h4>
            <p className="text-ink/80">
              <strong>Focus on:</strong> Your coaching approach, how you
              identified the root cause (skills gap, motivation, personal
              issues), and the measurable improvement you helped achieve.
            </p>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">
              3. "Give me an example of when you had to make a difficult
              decision that affected your team."
            </h4>
            <p className="text-ink/80">
              <strong>Focus on:</strong> Your decision-making process (data
              gathering, stakeholder input), how you communicated the decision,
              and how you managed the aftermath.
            </p>
          </div>
        </div>

        {/* ─── Problem-Solving Questions ─── */}
        <h2 id="problem-solving" className="text-3xl font-bold text-ink mt-12 mb-6">
          Problem-Solving & Critical Thinking
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          These questions test your analytical mindset and resourcefulness.
          Interviewers want to see structured thinking, not just lucky outcomes.
        </p>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 mb-2">
              4. "Tell me about a time when you solved a complex problem at
              work."
            </h4>
            <p className="text-green-700">
              <strong>Focus on:</strong> Your analytical approach — how you
              broke the problem into parts, what data you gathered, and the
              creative solution you implemented.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 mb-2">
              5. "Describe a situation where you had to think outside the box."
            </h4>
            <p className="text-green-700">
              <strong>Focus on:</strong> The constraints you faced (budget,
              time, resources), your creative thinking process, and the
              innovative solution you developed.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 mb-2">
              6. "Give me an example of when you had to learn something new
              quickly to solve a problem."
            </h4>
            <p className="text-green-700">
              <strong>Focus on:</strong> Your learning strategy,
              resourcefulness, and how you successfully applied new knowledge
              under time pressure.
            </p>
          </div>
        </div>

        {/* ─── Teamwork Questions ─── */}
        <h2 id="teamwork" className="text-3xl font-bold text-ink mt-12 mb-6">
          Teamwork & Collaboration
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Nearly every role involves working with others. These questions
          reveal your interpersonal skills and adaptability.
        </p>

        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-bold text-yellow-800 mb-2">
              7. "Tell me about a time when you had to work with a difficult
              colleague."
            </h4>
            <p className="text-yellow-700">
              <strong>Focus on:</strong> Your professionalism, how you found
              common ground, and the successful collaboration that resulted.
              Never badmouth the other person.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-bold text-yellow-800 mb-2">
              8. "Describe a time when you had to collaborate with someone whose
              working style was very different from yours."
            </h4>
            <p className="text-yellow-700">
              <strong>Focus on:</strong> Your adaptability, communication
              skills, and how you leveraged different strengths for better
              results.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-bold text-yellow-800 mb-2">
              9. "Give me an example of when you went above and beyond for a
              team project."
            </h4>
            <p className="text-yellow-700">
              <strong>Focus on:</strong> Your initiative, the extra effort you
              made, and the positive impact on the team's success. Quantify
              the result if possible.
            </p>
          </div>
        </div>

        {/* ─── Pressure Questions ─── */}
        <h2 id="pressure" className="text-3xl font-bold text-ink mt-12 mb-6">
          Handling Pressure & Challenges
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Employers need to know you can perform when stakes are high. These
          are some of the hardest behavioral questions because they ask about
          failure and stress — topics most candidates stumble on.
        </p>

        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-bold text-red-800 mb-2">
              10. "Tell me about a time when you failed at something."
            </h4>
            <p className="text-red-700">
              <strong>Focus on:</strong> What you learned from the failure, how
              you took responsibility (no blame-shifting), and the concrete
              changes you made going forward. Pick a real failure — not a
              humble brag.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-bold text-red-800 mb-2">
              11. "Describe a time when you were under significant pressure and
              how you handled it."
            </h4>
            <p className="text-red-700">
              <strong>Focus on:</strong> Your stress management techniques
              (prioritization, delegation, timeboxing), and how you delivered
              successfully despite the pressure. Include the deadline or scope.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-bold text-red-800 mb-2">
              12. "Give me an example of when you had to deal with an angry
              customer or client."
            </h4>
            <p className="text-red-700">
              <strong>Focus on:</strong> Your emotional intelligence,
              de-escalation techniques, and how you turned a negative situation
              into a positive outcome or long-term relationship.
            </p>
          </div>
        </div>

        {/* ─── Communication Questions ─── */}
        <h2 id="communication" className="text-3xl font-bold text-ink mt-12 mb-6">
          Communication & Influence
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          These questions evaluate how effectively you convey ideas, persuade
          stakeholders, and navigate difficult conversations.
        </p>

        <div className="space-y-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">
              13. "Tell me about a time when you had to present to senior
              leadership."
            </h4>
            <p className="text-ink/80">
              <strong>Focus on:</strong> Your preparation process, how you
              tailored your message for the audience, and the outcome of your
              presentation.
            </p>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">
              14. "Describe a time when you had to persuade someone to see your
              point of view."
            </h4>
            <p className="text-ink/80">
              <strong>Focus on:</strong> Your persuasion strategy — data,
              empathy, finding shared goals — and the successful outcome of
              your influence.
            </p>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">
              15. "Give me an example of when you had to deliver bad news to a
              team or stakeholder."
            </h4>
            <p className="text-ink/80">
              <strong>Focus on:</strong> Your communication approach (direct but
              empathetic), how you managed reactions, and the constructive path
              forward you provided.
            </p>
          </div>
        </div>

        {/* ─── Conflict Resolution Questions (NEW) ─── */}
        <h2 id="conflict" className="text-3xl font-bold text-ink mt-12 mb-6">
          Conflict Resolution Questions
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Conflict questions are among the most commonly asked across all
          industries. They reveal your maturity, emotional intelligence, and
          ability to maintain productive relationships even under tension.
        </p>

        <div className="space-y-6">
          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">
              16. "Tell me about a time you disagreed with your manager."
            </h4>
            <p className="text-stone-warm">
              <strong>Focus on:</strong> How you raised your concern
              respectfully, the evidence you presented, and whether the outcome
              was a compromise, a change of course, or graceful acceptance of
              the final decision.
            </p>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">
              17. "Describe a situation where two teams you worked with had
              conflicting priorities."
            </h4>
            <p className="text-stone-warm">
              <strong>Focus on:</strong> How you facilitated alignment — did you
              propose a shared metric, escalate with data, or find a creative
              solution that addressed both teams' needs?
            </p>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">
              18. "Give an example of when you received critical feedback and
              how you responded."
            </h4>
            <p className="text-stone-warm">
              <strong>Focus on:</strong> Your openness to feedback, the specific
              changes you made, and how those changes improved your performance
              or a relationship.
            </p>
          </div>
        </div>

        {/* ─── Virtual Interview Tips (NEW) ─── */}
        <h2 id="virtual-interviews" className="text-3xl font-bold text-ink mt-12 mb-6">
          Tips for Virtual & Video Behavioral Interviews
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          With remote and hybrid work now standard in 2026, many behavioral
          interviews happen over Zoom, Teams, or Google Meet. The STAR method
          works the same way, but the delivery needs adjusting.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-ink mb-3">Camera & Audio Setup</h4>
            <ul className="list-disc pl-5 space-y-2 text-stone-warm">
              <li>Position your camera at eye level and look into the lens (not the screen) when answering</li>
              <li>Use a headset or external mic to avoid echo and background noise</li>
              <li>Test your setup 30 minutes before the interview, not 30 seconds</li>
            </ul>
          </div>
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-ink mb-3">Delivery Adjustments</h4>
            <ul className="list-disc pl-5 space-y-2 text-stone-warm">
              <li>Pause slightly longer between STAR sections — video lag can make you sound like you're rushing</li>
              <li>Use brief hand gestures to stay engaging on camera</li>
              <li>Keep a bullet-point cheat sheet just below your camera (never read full answers)</li>
            </ul>
          </div>
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-ink mb-3">Environment</h4>
            <ul className="list-disc pl-5 space-y-2 text-stone-warm">
              <li>Use a clean, well-lit background — a plain wall or bookshelf works best</li>
              <li>Close all other apps to prevent notification sounds and slowdowns</li>
              <li>Have a glass of water nearby (it's normal to sip between answers)</li>
            </ul>
          </div>
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-ink mb-3">One-Way Video Interviews</h4>
            <ul className="list-disc pl-5 space-y-2 text-stone-warm">
              <li>Record a practice run first — you'll catch filler words and pacing issues</li>
              <li>Look directly at the camera since there's no face to focus on</li>
              <li>Use the full allotted time — short answers signal lack of depth</li>
            </ul>
          </div>
        </div>

        {/* ─── How to Practice (NEW) ─── */}
        <h2 id="how-to-practice" className="text-3xl font-bold text-ink mt-12 mb-6">
          How to Practice Behavioral Answers
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Reading about the STAR method is step one. Actually practicing it
          out loud is what separates prepared candidates from everyone else.
          Here's a structured approach:
        </p>

        <div className="space-y-6 my-6">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
            <div>
              <h4 className="font-bold text-ink mb-1">Build a Story Bank (5-8 Stories)</h4>
              <p className="text-stone-warm">
                Write out 5-8 detailed stories from your career that cover
                different competencies: leadership, conflict, failure,
                collaboration, and innovation. Each story should be versatile
                enough to answer 2-3 different questions. If you're early in
                your career, our{" "}
                <Link to="/blog/resume-no-experience" className="text-accent hover:underline">
                  guide for candidates without experience
                </Link>{" "}
                shows how to draw from academic projects, volunteer work, and
                internships.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
            <div>
              <h4 className="font-bold text-ink mb-1">Write STAR Outlines, Not Scripts</h4>
              <p className="text-stone-warm">
                For each story, jot down 2-3 bullet points per STAR section.
                A script sounds rehearsed; bullet points keep you natural while
                ensuring you hit every component. Aim for answers that run
                60-90 seconds when spoken aloud.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
            <div>
              <h4 className="font-bold text-ink mb-1">Practice with a Timer</h4>
              <p className="text-stone-warm">
                Set a 90-second timer and answer a random question from the
                list above. If you go over two minutes, trim the Situation
                section first — that's where most people over-explain. Record
                yourself on your phone and review the playback for filler
                words ("um," "like," "you know").
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
            <div>
              <h4 className="font-bold text-ink mb-1">Use AI for Mock Interviews</h4>
              <p className="text-stone-warm">
                AI tools can simulate an interviewer and give you feedback on
                your answers. Try using{" "}
                <Link to="/blog/claude-resume-prompts" className="text-accent hover:underline">
                  Claude AI prompts
                </Link>{" "}
                to generate follow-up questions based on your STAR stories.
                Paste your story and ask Claude to poke holes in it — that's
                exactly what a tough interviewer will do.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
            <div>
              <h4 className="font-bold text-ink mb-1">Do a Full Mock Session</h4>
              <p className="text-stone-warm">
                Ask a friend or mentor to pick 5 questions at random and
                interview you for 30 minutes. The goal is to practice
                transitioning between stories and handling curveball follow-ups
                without losing your structure.
              </p>
            </div>
          </div>
        </div>

        <div className="my-12 bg-gradient-to-r bg-chalk p-8 rounded-2xl border border-black/[0.06] text-center">
          <h3 className="text-2xl font-bold text-ink mb-4">
            Practice Makes Perfect
          </h3>
          <p className="text-lg text-stone-warm max-w-2xl mx-auto mb-6">
            Don't just memorize these questions — practice your STAR responses
            out loud. Try using <strong>PrepAI</strong> for realistic mock
            interviews that help you refine your answers and build confidence.
          </p>
          <a
            href="https://prepai.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent text-ink px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Practice with AI Mock Interviews
          </a>
        </div>

        {/* ─── Pro Tips ─── */}
        <h2 id="pro-tips" className="text-3xl font-bold text-ink mt-12 mb-6">
          Pro Tips for STAR Responses
        </h2>

        <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-6">
          <ul className="list-disc pl-6 space-y-3 text-stone-warm">
            <li>
              <strong>Keep it concise:</strong> Aim for 60-90 seconds per
              answer. Two minutes is the absolute maximum before interviewers
              lose focus.
            </li>
            <li>
              <strong>Use specific numbers:</strong> "Increased revenue by 18%"
              is stronger than "significantly improved revenue." Quantify your
              results whenever possible.
            </li>
            <li>
              <strong>Focus on YOUR actions:</strong> Use "I" not "we" when
              describing your contributions. It's fine to acknowledge the team,
              but the interviewer needs to know what <em>you</em> did.
            </li>
            <li>
              <strong>Prepare multiple examples:</strong> Have backup stories
              for similar question types. If your first story gets used for an
              earlier question, you need a second option ready.
            </li>
            <li>
              <strong>Match stories to the job description:</strong> Review the
              required competencies and map each one to a story. Use our{" "}
              <Link to="/templates/ats-friendly" className="text-accent hover:underline">
                ATS-friendly templates
              </Link>{" "}
              to structure your resume around the same competencies you'll
              discuss in the interview.
            </li>
            <li>
              <strong>Practice out loud:</strong> Rehearse your stories until
              they feel natural, not robotic. Speaking aloud exposes weak
              transitions and overly long setups.
            </li>
            <li>
              <strong>End positively:</strong> Even when discussing failures,
              close with lessons learned and the growth that followed. The
              result should always point forward.
            </li>
          </ul>
        </div>

        {/* ─── FAQ Section (NEW) ─── */}
        <h2 id="faq" className="text-3xl font-bold text-ink mt-12 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6 my-6">
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-3">
              What is the STAR method for interviews?
            </h3>
            <p className="text-lg leading-relaxed text-stone-warm">
              The STAR method is a structured framework for answering
              behavioral interview questions. STAR stands for Situation, Task,
              Action, and Result. You describe a specific past experience by
              setting the scene (Situation), explaining your responsibility
              (Task), detailing the steps you took (Action), and sharing the
              measurable outcome (Result). It keeps your answers focused,
              concrete, and easy for interviewers to follow.
            </p>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-3">
              How many behavioral questions should I prepare for?
            </h3>
            <p className="text-lg leading-relaxed text-stone-warm">
              Prepare 5-8 detailed STAR stories that cover different
              competencies (leadership, teamwork, problem-solving, conflict,
              failure, communication). Most interviews include 3-8 behavioral
              questions depending on the role and interview length. With 5-8
              versatile stories, you can adapt to nearly any question by
              shifting which aspect of the story you emphasize.
            </p>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-3">
              What are the hardest behavioral interview questions?
            </h3>
            <p className="text-lg leading-relaxed text-stone-warm">
              The hardest questions are the ones that ask about negative
              experiences: "Tell me about a time you failed," "Describe a
              conflict with your manager," and "Give an example of when you
              made a mistake that cost the company money." These are difficult
              because candidates either pick a trivial example (which seems
              dishonest) or overshare without demonstrating growth. The key is
              choosing a genuine failure, owning it without excuses, and
              spending most of your answer on what you learned and changed.
            </p>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-3">
              How to answer "Tell me about a time you failed"?
            </h3>
            <p className="text-lg leading-relaxed text-stone-warm">
              Choose a real professional failure — not "I work too hard" or a
              disguised success. Briefly describe the situation and what went
              wrong (2-3 sentences). Take clear ownership without blaming
              others. Then spend 60% of your answer on the lessons learned and
              the specific changes you made afterward. End with evidence that
              the change stuck: "Since then, I've never missed a deadline on
              that type of project" or "I now build a 20% buffer into every
              timeline, and my on-time delivery rate went from 70% to 95%."
            </p>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-3">
              How long should behavioral interview answers be?
            </h3>
            <p className="text-lg leading-relaxed text-stone-warm">
              Aim for 60-90 seconds per answer, which translates to roughly
              150-250 words when spoken. Two minutes is the absolute ceiling —
              longer answers lose the interviewer's attention and suggest you
              can't communicate concisely. If you're going long, trim the
              Situation section first (keep it to 2-3 sentences) and make sure
              you're not narrating every minor detail in the Action section.
            </p>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-3">
              Should I use the same examples for multiple questions?
            </h3>
            <p className="text-lg leading-relaxed text-stone-warm">
              It's fine to draw from the same overall experience, but
              emphasize different aspects for each question. For example, one
              project launch could answer a teamwork question (focusing on
              cross-functional collaboration), a pressure question (focusing on
              the tight deadline), and a communication question (focusing on
              the stakeholder presentation). However, avoid using the exact
              same story twice in the same interview — it signals limited
              experience. That's why a bank of 5-8 stories is the sweet spot.
            </p>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-3">
              Do behavioral questions differ by industry?
            </h3>
            <p className="text-lg leading-relaxed text-stone-warm">
              The core questions (leadership, teamwork, conflict, failure) are
              universal. However, industries add their own flavor. Tech
              companies often ask about ambiguity and fast-paced change.
              Healthcare interviews focus on patient safety and ethical
              dilemmas. Finance roles emphasize risk management and
              attention to detail. Consulting firms ask about client
              relationships and influencing without authority. Research the
              company and industry to anticipate which categories will be
              emphasized.
            </p>
          </div>
        </div>

        {/* ─── Related Guides (NEW) ─── */}
        <h2 id="related-guides" className="text-3xl font-bold text-ink mt-12 mb-6">
          Related Guides
        </h2>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          <Link
            to="/blog/job-interview-guide"
            className="block bg-chalk-dark rounded-xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
          >
            <h4 className="font-bold text-ink mb-2">Complete Job Interview Guide</h4>
            <p className="text-stone-warm text-sm">
              End-to-end preparation: research, common questions, follow-up
              emails, and salary negotiation.
            </p>
          </Link>

          <Link
            to="/blog/resume-no-experience"
            className="block bg-chalk-dark rounded-xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
          >
            <h4 className="font-bold text-ink mb-2">Resume with No Experience</h4>
            <p className="text-stone-warm text-sm">
              How to build strong STAR stories from internships, academic
              projects, and volunteer work.
            </p>
          </Link>

          <Link
            to="/blog/how-to-write-a-resume-guide"
            className="block bg-chalk-dark rounded-xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
          >
            <h4 className="font-bold text-ink mb-2">How to Write a Resume (2026)</h4>
            <p className="text-stone-warm text-sm">
              Step-by-step guide to writing accomplishment-driven resume
              bullets that mirror your interview stories.
            </p>
          </Link>

          <Link
            to="/blog/claude-resume-prompts"
            className="block bg-chalk-dark rounded-xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
          >
            <h4 className="font-bold text-ink mb-2">Claude AI Resume Prompts</h4>
            <p className="text-stone-warm text-sm">
              Use AI to draft STAR stories, generate follow-up questions, and
              stress-test your behavioral answers.
            </p>
          </Link>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm mt-8">
          Behavioral interview questions are your opportunity to showcase real
          experience and demonstrate your potential with concrete evidence. By
          building a story bank, practicing the STAR structure, and tailoring
          your examples to each role, you'll walk into every interview with
          confidence and compelling stories that set you apart from other
          candidates.
        </p>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-2">{faq.question}</h3>
              <p className="text-stone-warm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
}
