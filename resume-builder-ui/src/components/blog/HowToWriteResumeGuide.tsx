import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";

export default function HowToWriteResumeGuide() {
  return (
    <BlogLayout
      title="How to Write a Resume in 2026: The Complete Step-by-Step Guide"
      description="From a blank page to a finished, professional resume, this guide covers every section, formatting rule, and writing tip you need to know."
      publishDate="2026-01-25"
      lastUpdated="2026-03-22"
      readTime="14 min"
      keywords={[
        "how to write a resume",
        "resume writing guide",
        "resume format 2026",
        "professional resume",
        "resume tips",
        "career advice",
        "resume sections",
        "ATS resume",
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Writing a resume from scratch can feel overwhelming, but it doesn't
          have to be. Updated for 2026, this comprehensive guide will walk you
          through every step of creating a professional resume that gets results,
          from choosing the right format to crafting compelling content that
          catches recruiters' attention. Whether you are writing your first
          resume or refreshing an existing one, each section below covers
          exactly what hiring managers and applicant tracking systems (ATS) look
          for.
        </p>

        {/* Table of Contents */}
        <nav className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h2 className="font-bold text-ink mb-4 text-lg">
            Table of Contents
          </h2>
          <ol className="space-y-2 text-ink/80 list-decimal list-inside">
            <li><a href="#choose-format" className="text-accent hover:underline">Choose the Right Resume Format</a></li>
            <li><a href="#essential-sections" className="text-accent hover:underline">Essential Resume Sections (In Order)</a></li>
            <li><a href="#writing-content" className="text-accent hover:underline">Writing Powerful Content</a></li>
            <li><a href="#action-verbs" className="text-accent hover:underline">Power Words That Make an Impact</a></li>
            <li><a href="#formatting" className="text-accent hover:underline">Formatting Best Practices</a></li>
            <li><a href="#tailoring" className="text-accent hover:underline">Tailoring for Each Application</a></li>
            <li><a href="#ats-optimization" className="text-accent hover:underline">ATS Optimization</a></li>
            <li><a href="#final-review" className="text-accent hover:underline">Final Review and Optimization</a></li>
            <li><a href="#common-mistakes" className="text-accent hover:underline">Common Resume Mistakes to Avoid</a></li>
            <li><a href="#ai-assistance" className="text-accent hover:underline">Using AI to Speed Up Resume Writing</a></li>
            <li><a href="#faq" className="text-accent hover:underline">Frequently Asked Questions</a></li>
            <li><a href="#next-steps" className="text-accent hover:underline">Your Next Steps</a></li>
          </ol>
        </nav>

        {/* Quick Answer Box */}
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h3 className="font-bold text-ink mb-3">
            The 5-Minute Resume Writing Summary
          </h3>
          <p className="text-ink/80 mb-3">
            Short on time? Here is the condensed version of this entire guide:
          </p>
          <ol className="space-y-2 text-ink/80 list-decimal list-inside">
            <li><strong>Format:</strong> Use reverse-chronological unless you are changing careers</li>
            <li><strong>Length:</strong> One page for under 10 years of experience, two pages maximum (<Link to="/blog/resume-length-guide" className="text-accent hover:underline">full length guide</Link>)</li>
            <li><strong>Summary:</strong> 2-3 sentences with your title, years, top skills, and target</li>
            <li><strong>Experience:</strong> Lead every bullet with an action verb and a measurable result</li>
            <li><strong>Keywords:</strong> Mirror the exact language from the job description (<Link to="/blog/resume-keywords-guide" className="text-accent hover:underline">keyword guide</Link>)</li>
            <li><strong>Save as PDF</strong> and name the file <code className="bg-chalk-dark px-1.5 py-0.5 rounded text-sm">FirstName_LastName_Resume.pdf</code></li>
          </ol>
        </div>

        <h2 id="choose-format" className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 1: Choose the Right Resume Format
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Your resume format sets the foundation for everything else. Choose the
          wrong format, and even excellent content might not get the attention
          it deserves. Not sure how long your resume should be? Our{' '}
          <Link to="/blog/resume-length-guide" className="text-accent hover:underline">
            resume length guide
          </Link>{' '}
          covers when one page is enough and when two pages make sense.
        </p>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-800 mb-3">
              Chronological Format (Recommended for Most)
            </h3>
            <p className="text-accent mb-3">
              Lists your work experience in reverse chronological order. Best
              for candidates with consistent work history and career
              progression. This is also the format ATS software parses most
              reliably.
            </p>
            <div className="text-accent">
              <strong>Use when:</strong> You have relevant work experience and
              no major employment gaps
            </div>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              Functional Format
            </h3>
            <p className="text-ink/80 mb-3">
              Focuses on skills and qualifications rather than work history.
              Organized by skill categories instead of job titles.
            </p>
            <div className="text-ink/80">
              <strong>Use when:</strong> You're changing careers, have
              employment gaps, or are a recent graduate
            </div>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              Combination Format
            </h3>
            <p className="text-ink/80 mb-3">
              Blends chronological and functional formats, highlighting both
              skills and work history.
            </p>
            <div className="text-ink/80">
              <strong>Use when:</strong> You have strong skills and solid work
              experience, or are targeting a specific role
            </div>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm mt-6">
          Want to see how these formats look on paper? Browse our{' '}
          <Link to="/templates/ats-friendly" className="text-accent hover:underline">
            ATS-friendly resume templates
          </Link>{' '}
          to pick a layout that matches your career stage and industry.
        </p>

        <h2 id="essential-sections" className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 2: Essential Resume Sections (In Order)
        </h2>

        <div className="space-y-6">
          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              1. Header & Contact Information
            </h3>
            <p className="text-stone-warm mb-3">
              Your header should be clean, professional, and easy to find.
              Include your full name, professional title, email, phone number,
              city/state, and LinkedIn URL. Leave out your full mailing address
              — recruiters do not need it, and it wastes space.
            </p>
            <div className="bg-white border border-black/[0.06] rounded p-4 text-sm">
              <div className="font-bold">John Smith</div>
              <div className="text-stone-warm">Software Engineer</div>
              <div className="mt-1">
                john.smith@email.com | (555) 123-4567 | LinkedIn: /in/johnsmith
                | New York, NY
              </div>
            </div>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              2. Professional Summary
            </h3>
            <p className="text-stone-warm mb-3">
              A 2-3 line snapshot of your experience, skills, and career goals.
              Think of it as your elevator pitch. The summary is where you
              distill your entire career into a few compelling sentences — get
              this right and the recruiter will keep reading. For inspiration,
              check out our{' '}
              <Link to="/blog/professional-summary-examples" className="text-accent hover:underline">
                professional summary examples
              </Link>{' '}
              with 25+ ready-to-customize templates for every career level.
            </p>
            <div className="bg-white border border-black/[0.06] rounded p-4 text-sm text-stone-warm">
              "Results-driven Software Engineer with 5+ years developing
              scalable web applications. Expert in React, Python, and cloud
              technologies. Seeking to leverage full-stack expertise to drive
              innovation at a growth-stage tech company."
            </div>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              3. Work Experience
            </h3>
            <p className="text-stone-warm mb-3">
              The heart of your resume. Use the CAR method (Context, Action,
              Result) and lead every bullet point with a strong{' '}
              <Link to="/blog/resume-action-verbs" className="text-accent hover:underline">
                action verb
              </Link>. Quantify your impact wherever possible — numbers are what
              separate a forgettable resume from one that lands interviews. Our
              guide on{' '}
              <Link to="/blog/quantify-resume-accomplishments" className="text-accent hover:underline">
                quantifying resume accomplishments
              </Link>{' '}
              covers exactly how to turn vague duties into measurable achievements.
            </p>
            <div className="bg-white border border-black/[0.06] rounded p-4 text-sm">
              <div className="font-bold">Senior Software Engineer</div>
              <div className="text-stone-warm">
                TechCorp Inc. | 2021 - Present
              </div>
              <ul className="list-disc list-inside mt-2 text-stone-warm space-y-1">
                <li>
                  Developed and maintained 3 customer-facing web applications
                  using React and Node.js, serving 50K+ daily users
                </li>
                <li>
                  Optimized database queries and API endpoints, reducing page
                  load times by 40%
                </li>
                <li>
                  Mentored 2 junior developers and led code review sessions,
                  improving team code quality by 25%
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              4. Education
            </h3>
            <p className="text-stone-warm mb-3">
              Include degree, institution, graduation year, and relevant
              achievements. If you graduated more than 5 years ago, keep this
              section brief — your work experience carries more weight at that
              point.
            </p>
            <div className="bg-white border border-black/[0.06] rounded p-4 text-sm">
              <div className="font-bold">
                Bachelor of Science in Computer Science
              </div>
              <div className="text-stone-warm">
                University of Technology | 2019
              </div>
              <div className="text-stone-warm">Magna Cum Laude, GPA: 3.8/4.0</div>
            </div>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">5. Skills</h3>
            <p className="text-stone-warm mb-3">
              Organize by categories and include both technical and soft skills.
              This section is critical for ATS screening — applicant tracking
              systems scan for exact keyword matches, so use the same terms the
              job posting uses. Read our{' '}
              <Link to="/blog/how-to-list-skills" className="text-accent hover:underline">
                guide to listing skills on your resume
              </Link>{' '}
              for formatting strategies that work for both humans and machines.
            </p>
            <div className="bg-white border border-black/[0.06] rounded p-4 text-sm">
              <div className="mb-2">
                <strong>Programming:</strong> JavaScript, Python, Java, SQL
              </div>
              <div className="mb-2">
                <strong>Frameworks:</strong> React, Node.js, Django, Spring Boot
              </div>
              <div>
                <strong>Tools:</strong> Git, Docker, AWS, Jenkins
              </div>
            </div>
            <p className="text-stone-warm text-sm mt-3">
              See a complete{' '}
              <Link to="/examples/software-engineer" className="text-accent hover:underline">software engineer resume example</Link>
              {' '}or browse{' '}
              <Link to="/resume-keywords/software-engineer" className="text-accent hover:underline">software engineer ATS keywords</Link>
              {' '}for more role-specific guidance.
            </p>
          </div>
        </div>

        <h2 id="writing-content" className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 3: Writing Powerful Content
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          The difference between a resume that gets interviews and one that
          disappears into a black hole usually comes down to how you describe
          your experience. The goal is to show impact, not just activity.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-6">
          <h3 className="font-bold text-yellow-800 mb-3">
            The CAR Method for Experience Bullets:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-yellow-700">
            <li>
              <strong>Context:</strong> What was the situation or challenge?
            </li>
            <li>
              <strong>Action:</strong> What specific actions did you take?
            </li>
            <li>
              <strong>Result:</strong> What was the measurable outcome?
            </li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-bold text-red-800 mb-2">Weak Example:</h4>
            <p className="text-red-700 text-sm">
              "Responsible for managing social media accounts and creating
              content for marketing campaigns."
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 mb-2">
              Strong Example:
            </h4>
            <p className="text-accent text-sm">
              "Managed 5 social media accounts and created 50+ pieces of content
              monthly, increasing engagement by 35% and generating 200+
              qualified leads."
            </p>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm mt-6">
          For a deeper walkthrough with more before-and-after examples, see our{' '}
          <Link to="/blog/quantify-resume-accomplishments" className="text-accent hover:underline">
            guide to quantifying resume accomplishments
          </Link>.
        </p>

        <h2 id="action-verbs" className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 4: Power Words That Make an Impact
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Start your bullet points with strong action verbs to create impact and
          show your contributions clearly. The verb you choose sets the tone for
          the entire bullet — "Directed a team of 12" lands harder than
          "Was responsible for a team of 12."
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-4">
            <h4 className="font-bold text-ink mb-2">Leadership</h4>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>Directed</li>
              <li>Supervised</li>
              <li>Mentored</li>
              <li>Coordinated</li>
              <li>Facilitated</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-green-800 mb-2">Achievement</h4>
            <ul className="list-disc pl-5 text-accent text-sm space-y-1">
              <li>Achieved</li>
              <li>Exceeded</li>
              <li>Delivered</li>
              <li>Improved</li>
              <li>Optimized</li>
            </ul>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-4">
            <h4 className="font-bold text-ink mb-2">Innovation</h4>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>Developed</li>
              <li>Created</li>
              <li>Designed</li>
              <li>Implemented</li>
              <li>Pioneered</li>
            </ul>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm mt-6">
          For a comprehensive list of 200+ action verbs organized by category,
          check out our detailed guide on{' '}
          <Link to="/blog/resume-action-verbs" className="text-accent hover:underline">
            resume action verbs
          </Link>.
        </p>

        <h2 id="formatting" className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 5: Formatting Best Practices
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Even the best content gets overlooked if the formatting is sloppy.
          Recruiters spend an average of 7 seconds on an initial resume scan —
          clean formatting ensures they can find your key qualifications
          instantly.
        </p>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-6">
          <h3 className="font-bold text-ink mb-3">
            Professional Formatting Rules:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-ink/80">
            <li>
              Use a clean, professional font (Calibri, Arial, Garamond, or
              Helvetica) at 10-12 points for body text
            </li>
            <li>Set margins between 0.5 and 1 inch on all sides</li>
            <li>Maintain consistent spacing and alignment throughout</li>
            <li>Use bullet points for easy scanning — no dense paragraphs</li>
            <li>
              Keep it to 1 page for under 10 years of experience, 2 pages maximum
              (<Link to="/blog/resume-length-guide" className="text-accent hover:underline">when to use 2 pages</Link>)
            </li>
            <li>Save as PDF to preserve formatting across devices</li>
            <li>
              Use white space effectively — don't cram everything together
            </li>
            <li>
              Avoid headers, footers, tables, and text boxes — many ATS systems
              cannot read content inside these elements
            </li>
          </ul>
        </div>

        <h2 id="tailoring" className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 6: Tailoring for Each Application
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          A generic resume won't cut it in today's highly competitive job market.
          The single most impactful thing you can do is customize your resume for
          each position. It takes 15-20 minutes per application and dramatically
          increases your callback rate.
        </p>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-bold text-yellow-800 mb-2">
              1. Analyze the Job Description
            </h4>
            <p className="text-yellow-700">
              Identify key requirements, skills, and qualifications. Note the
              exact language they use — mirror it in your resume. If the job
              says "project management," don't write "managing projects."
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 mb-2">
              2. Adjust Your Professional Summary
            </h4>
            <p className="text-accent">
              Modify your summary to highlight the most relevant experience and
              skills for that specific role. Your summary should read as if it
              were written for this exact job.
            </p>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">
              3. Prioritize Relevant Experience
            </h4>
            <p className="text-ink/80">
              Lead with the most relevant bullet points and experiences. You can
              even reorder sections if it makes sense. If the role emphasizes
              leadership, move your mentoring and team-lead bullets to the top.
            </p>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">
              4. Include Relevant Keywords
            </h4>
            <p className="text-ink/80">
              Incorporate industry-specific terms and skills mentioned in the
              job posting to pass ATS screening. Our{' '}
              <Link to="/resume-keywords" className="text-accent hover:underline">
                resume keywords hub
              </Link>{' '}
              has role-specific keyword lists for 25+ job titles, and
              our{' '}
              <Link to="/blog/resume-keywords-guide" className="text-accent hover:underline">
                resume keywords guide
              </Link>{' '}
              explains how ATS scoring actually works behind the scenes.
            </p>
          </div>
        </div>

        {/* NEW SECTION: ATS Optimization */}
        <h2 id="ats-optimization" className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 7: ATS Optimization
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Over 97% of Fortune 500 companies use Applicant Tracking Systems to
          screen resumes before a human ever sees them. If your resume is not
          ATS-optimized, it may never reach a recruiter — regardless of how
          qualified you are.
        </p>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-6 py-4 text-left font-bold text-ink">ATS-Friendly</th>
                <th className="px-6 py-4 text-left font-bold text-ink">ATS-Hostile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr>
                <td className="px-6 py-4 text-ink">Simple, single-column layout</td>
                <td className="px-6 py-4 text-ink">Multi-column or sidebar designs</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink">Standard section headings (Experience, Education, Skills)</td>
                <td className="px-6 py-4 text-ink">Creative headings (My Journey, Toolbox, Superpowers)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink">Plain text with simple formatting</td>
                <td className="px-6 py-4 text-ink">Text inside images, charts, or graphics</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink">Standard bullet points</td>
                <td className="px-6 py-4 text-ink">Custom icons or symbols as bullets</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink">Job description keywords used naturally</td>
                <td className="px-6 py-4 text-ink">Keyword stuffing or invisible white text</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm">
          For a complete ATS strategy including keyword density, formatting
          rules, and testing methods, read our{' '}
          <Link to="/blog/resume-keywords-guide" className="text-accent hover:underline">
            complete resume keywords guide
          </Link>. You can also use our{' '}
          <Link to="/resume-keywords" className="text-accent hover:underline">
            resume keywords tool
          </Link>{' '}
          to find the exact terms hiring managers search for in your industry.
        </p>

        <div className="my-12 bg-ink text-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Build Your Professional Resume?
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Skip the formatting hassle with our ATS-friendly templates
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-accent px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Choose Your Template
          </Link>
        </div>

        <h2 id="final-review" className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 8: Final Review and Optimization
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Before you hit send, run through this checklist. Typos and
          inconsistencies are the fastest way to get disqualified — they signal
          carelessness to hiring managers.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-6">
          <h3 className="font-bold text-red-800 mb-3">
            Resume Review Checklist:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-red-700">
            <li>Proofread for spelling and grammar errors (read it aloud)</li>
            <li>Ensure consistent formatting — font sizes, bullet styles, date formats</li>
            <li>Verify all contact information is current and clickable</li>
            <li>Check that all dates are accurate and in a consistent format</li>
            <li>Confirm the resume is 1-2 pages maximum</li>
            <li>Test ATS compatibility by copy-pasting into a plain text editor</li>
            <li>Have someone else review it for clarity and typos you missed</li>
            <li>Save as PDF with your name in the filename (e.g., <code className="bg-red-100 px-1.5 py-0.5 rounded text-xs">Jane_Doe_Resume.pdf</code>)</li>
          </ul>
        </div>

        <h2 id="common-mistakes" className="text-3xl font-bold text-ink mt-12 mb-6">
          Common Resume Mistakes to Avoid
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Even strong candidates sabotage themselves with avoidable errors. Here
          are the most common ones we see — and how to fix them. For a deeper
          dive, read our dedicated{' '}
          <Link to="/blog/resume-mistakes-to-avoid" className="text-accent hover:underline">
            resume mistakes guide
          </Link>{' '}
          with 10 critical errors that cost people interviews.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-bold text-red-800 mb-3">Content Mistakes</h4>
            <ul className="list-disc pl-6 space-y-1 text-red-700 text-sm">
              <li>Using generic, one-size-fits-all content</li>
              <li>Including irrelevant work experience</li>
              <li>Focusing on duties instead of achievements</li>
              <li>Forgetting to quantify results with numbers</li>
              <li>Using outdated or unprofessional email addresses</li>
              <li>Listing "References available upon request"</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-bold text-red-800 mb-3">Formatting Mistakes</h4>
            <ul className="list-disc pl-6 space-y-1 text-red-700 text-sm">
              <li>Using unprofessional or decorative fonts</li>
              <li>Making the resume too long (3+ pages)</li>
              <li>Inconsistent formatting and spacing</li>
              <li>Including photos (for US/UK resumes)</li>
              <li>Submitting in .docx instead of PDF</li>
              <li>Using tables or text boxes that ATS cannot parse</li>
            </ul>
          </div>
        </div>

        {/* NEW SECTION: AI Assistance */}
        <h2 id="ai-assistance" className="text-3xl font-bold text-ink mt-12 mb-6">
          Using AI to Speed Up Resume Writing
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          AI tools can cut your resume writing time in half — if you use them
          correctly. The key is treating AI as a drafting partner, not a
          replacement for your own judgment. Here is how to use AI effectively
          at each stage:
        </p>

        <div className="space-y-4">
          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              Best AI Use Cases for Resumes
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-stone-warm">
              <li>
                <strong>Rewriting weak bullets:</strong> Paste a duty-based bullet and ask AI to reframe it as an achievement with metrics
              </li>
              <li>
                <strong>Extracting keywords:</strong> Feed the AI a job description and ask it to identify the must-have keywords your resume should include
              </li>
              <li>
                <strong>Drafting summaries:</strong> Provide your experience and target role, and let AI create 2-3 summary options to choose from
              </li>
              <li>
                <strong>Proofreading:</strong> AI catches grammatical errors, inconsistent tense, and awkward phrasing
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-bold text-yellow-800 mb-2">
              Important: Always Edit AI Output
            </h4>
            <p className="text-yellow-700">
              Never paste AI-generated text directly onto your resume without
              editing. Verify all facts, remove generic phrases, and make sure
              the language sounds like you. Hiring managers can spot unedited
              AI writing, and it raises red flags about attention to detail.
            </p>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm mt-6">
          For copy-paste ready prompts you can use right now, see our{' '}
          <Link to="/blog/claude-resume-prompts" className="text-accent hover:underline">
            25+ Claude AI resume prompts
          </Link>{' '}
          guide — it covers professional summaries, experience bullets, ATS
          optimization, and more.
        </p>

        {/* FAQ Section */}
        <h2 id="faq" className="text-3xl font-bold text-ink mt-12 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: 'How do I write a resume with no experience?',
              a: 'Focus on education, coursework, volunteer work, internships, personal projects, and transferable skills from part-time jobs. Use the functional or combination format to lead with skills instead of work history. Even retail or food service experience demonstrates communication, teamwork, and time management. Our resume builder has templates designed specifically for entry-level candidates.',
            },
            {
              q: 'What format is best for a resume in 2026?',
              a: 'Reverse-chronological is still the gold standard for most candidates — it is what recruiters expect, and it is the format ATS software parses most reliably. Use functional only if you are making a major career change or have significant gaps. The combination format works well for senior professionals with both deep expertise and a strong work history.',
            },
            {
              q: 'Should I include references on my resume?',
              a: 'No. "References available upon request" is outdated and wastes valuable space. Employers will ask for references later in the process if they need them. Use that space for another achievement bullet or a relevant skill instead.',
            },
            {
              q: 'How far back should my work history go?',
              a: 'Generally 10-15 years. Anything older is usually irrelevant and may invite age bias. If you have early-career experience that is directly relevant to your target role, you can include it under an "Additional Experience" heading with just the title, company, and dates — no bullet points.',
            },
            {
              q: 'What font and size should I use for a resume?',
              a: 'Use a clean, professional sans-serif font like Calibri, Arial, or Helvetica at 10-12 points for body text and 14-16 points for your name. Avoid decorative fonts, script fonts, or anything below 10pt. The goal is maximum readability in a 7-second scan.',
            },
            {
              q: 'How do I tailor a resume for each job?',
              a: 'Read the job description carefully and identify the top 5-8 requirements. Mirror the exact language in your summary and skills section. Reorder your experience bullets so the most relevant ones come first. This takes 15-20 minutes per application but dramatically increases your callback rate.',
            },
            {
              q: 'Should I include a photo on my resume?',
              a: 'In the US, UK, and Canada — no. Photos can trigger unconscious bias and many ATS systems cannot process them, which can cause parsing errors. In some European and Asian countries, photos are still expected, so follow local conventions if applying internationally.',
            },
            {
              q: 'How do I make my resume ATS-friendly?',
              a: 'Use a single-column layout, standard section headings, and a simple PDF format. Avoid tables, text boxes, headers/footers, and images with text. Include keywords from the job description naturally in your content. Test by pasting your resume into a plain text editor — if it reads cleanly, an ATS can parse it.',
            },
          ].map((faq, i) => (
            <div key={i} className="bg-chalk-dark rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">{faq.q}</h3>
              <p className="text-stone-warm">{faq.a}</p>
            </div>
          ))}
        </div>

        <h2 id="next-steps" className="text-3xl font-bold text-ink mt-12 mb-6">
          Your Next Steps
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Writing a great resume takes time and effort, but it's one of the most
          important investments you can make in your career. Start with the
          basics outlined in this guide, then refine and customize for each
          opportunity.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-green-800 mb-3">
            Action Items for This Week:
          </h3>
          <ol className="list-decimal pl-6 space-y-2 text-accent">
            <li>Gather all your career information and achievements</li>
            <li>Choose the right format for your situation</li>
            <li>Write your first draft following this guide</li>
            <li>Have 2-3 people review and provide feedback</li>
            <li>
              Pick an{' '}
              <Link to="/templates/ats-friendly" className="text-accent hover:underline">
                ATS-friendly template
              </Link>{' '}
              and build your final version
            </li>
            <li>Start applying to your target roles with confidence</li>
          </ol>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm">
          Remember, your resume is just the first step in your job search
          journey. Once you land those interviews, make sure you're prepared to
          showcase your skills and experience in person. Good luck!
        </p>

        {/* Related Guides */}
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 mt-12">
          <h3 className="font-bold text-ink mb-4">
            Related Guides From the Resume Writing Series
          </h3>
          <ul className="space-y-2 text-ink/80">
            <li>
              <Link to="/blog/resume-length-guide" className="text-accent hover:underline">
                How Long Should a Resume Be?
              </Link>{' '}
              &mdash; when one page is enough and when two pages make sense
            </li>
            <li>
              <Link to="/blog/professional-summary-examples" className="text-accent hover:underline">
                25+ Professional Summary Examples
              </Link>{' '}
              &mdash; ready-to-customize summaries for every career level
            </li>
            <li>
              <Link to="/blog/resume-action-verbs" className="text-accent hover:underline">
                200+ Resume Action Verbs
              </Link>{' '}
              &mdash; the strongest verbs organized by category
            </li>
            <li>
              <Link to="/blog/quantify-resume-accomplishments" className="text-accent hover:underline">
                How to Quantify Resume Accomplishments
              </Link>{' '}
              &mdash; turn vague duties into measurable achievements
            </li>
            <li>
              <Link to="/blog/how-to-list-skills" className="text-accent hover:underline">
                How to List Skills on Your Resume
              </Link>{' '}
              &mdash; formatting that works for humans and ATS
            </li>
            <li>
              <Link to="/blog/resume-keywords-guide" className="text-accent hover:underline">
                The Complete Resume Keywords Guide
              </Link>{' '}
              &mdash; how ATS scoring works and which keywords matter
            </li>
            <li>
              <Link to="/blog/resume-mistakes-to-avoid" className="text-accent hover:underline">
                10 Resume Mistakes That Kill Your Job Prospects
              </Link>{' '}
              &mdash; the most common errors and how to fix them
            </li>
            <li>
              <Link to="/blog/claude-resume-prompts" className="text-accent hover:underline">
                25+ Claude AI Resume Prompts
              </Link>{' '}
              &mdash; copy-paste prompts for AI-assisted resume writing
            </li>
            <li>
              <Link to="/resume-keywords" className="text-accent hover:underline">
                Resume Keywords Hub
              </Link>{' '}
              &mdash; role-specific keyword lists for 25+ job titles
            </li>
            <li>
              <Link to="/templates/ats-friendly" className="text-accent hover:underline">
                ATS-Friendly Resume Templates
              </Link>{' '}
              &mdash; professionally designed templates that pass ATS screening
            </li>
          </ul>
        </div>

      </div>
    </BlogLayout>
  );
}
