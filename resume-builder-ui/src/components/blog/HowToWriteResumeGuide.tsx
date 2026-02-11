import BlogLayout from "../BlogLayout";

export default function HowToWriteResumeGuide() {
  return (
    <BlogLayout
      title="How to Write a Resume in 2026: The Complete Step-by-Step Guide"
      description="From a blank page to a finished, professional resume, this guide covers every section, formatting rule, and writing tip you need to know."
      publishDate="2026-01-25"
      readTime="8 min"
      keywords={[
        "how to write a resume",
        "resume writing guide",
        "resume format 2026",
        "professional resume",
        "resume tips",
        "career advice",
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Writing a resume from scratch can feel overwhelming, but it doesn't
          have to be. Updated for 2026, this comprehensive guide will walk you
          through every step of creating a professional resume that gets results,
          from choosing the right format to crafting compelling content that
          catches recruiters' attention.
        </p>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 1: Choose the Right Resume Format
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Your resume format sets the foundation for everything else. Choose the
          wrong format, and even excellent content might not get the attention
          it deserves.
        </p>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-800 mb-3">
              Chronological Format (Recommended for Most)
            </h3>
            <p className="text-accent mb-3">
              Lists your work experience in reverse chronological order. Best
              for candidates with consistent work history and career
              progression.
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

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 2: Essential Resume Sections (In Order)
        </h2>

        <div className="space-y-6">
          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              1. Header & Contact Information
            </h3>
            <p className="text-stone-warm mb-3">
              Your header should be clean, professional, and easy to find.
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
              Think of it as your elevator pitch.
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
              The heart of your resume. Use the CAR method: Context, Action,
              Result.
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
              achievements.
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
          </div>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 3: Writing Powerful Content
        </h2>

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
            <h4 className="font-bold text-red-800 mb-2">❌ Weak Example:</h4>
            <p className="text-red-700 text-sm">
              "Responsible for managing social media accounts and creating
              content for marketing campaigns."
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 mb-2">
              ✅ Strong Example:
            </h4>
            <p className="text-accent text-sm">
              "Managed 5 social media accounts and created 50+ pieces of content
              monthly, increasing engagement by 35% and generating 200+
              qualified leads."
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 4: Power Words That Make an Impact
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Start your bullet points with strong action verbs to create impact and
          show your contributions clearly.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-4">
            <h4 className="font-bold text-ink mb-2">Leadership</h4>
            <ul className="text-ink/80 text-sm space-y-1">
              <li>• Directed</li>
              <li>• Supervised</li>
              <li>• Mentored</li>
              <li>• Coordinated</li>
              <li>• Facilitated</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-green-800 mb-2">Achievement</h4>
            <ul className="text-accent text-sm space-y-1">
              <li>• Achieved</li>
              <li>• Exceeded</li>
              <li>• Delivered</li>
              <li>• Improved</li>
              <li>• Optimized</li>
            </ul>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-4">
            <h4 className="font-bold text-ink mb-2">Innovation</h4>
            <ul className="text-ink/80 text-sm space-y-1">
              <li>• Developed</li>
              <li>• Created</li>
              <li>• Designed</li>
              <li>• Implemented</li>
              <li>• Pioneered</li>
            </ul>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm mt-6">
          For a comprehensive list of 200+ action verbs organized by category,
          check out our detailed guide on{" "}
          <a
            href="/blog/resume-action-verbs"
            className="text-accent hover:text-ink underline"
          >
            Action Verbs for Resumes
          </a>
          .
        </p>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 5: Formatting Best Practices
        </h2>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-6">
          <h3 className="font-bold text-ink mb-3">
            Professional Formatting Rules:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-ink/80">
            <li>
              Use a clean, professional font (Arial, Calibri, or Times New
              Roman)
            </li>
            <li>Keep font size between 10-12 points for body text</li>
            <li>Maintain consistent spacing and margins</li>
            <li>Use bullet points for easy scanning</li>
            <li>Keep it to 1-2 pages maximum</li>
            <li>Save as PDF to preserve formatting</li>
            <li>
              Use white space effectively - don't cram everything together
            </li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 6: Tailoring for Each Application
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          A generic resume won't cut it in today's highly competitive job market.
          Here's how to customize your resume for each position:
        </p>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-bold text-yellow-800 mb-2">
              1. Analyze the Job Description
            </h4>
            <p className="text-yellow-700">
              Identify key requirements, skills, and qualifications. Note the
              language they use - mirror it in your resume.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 mb-2">
              2. Adjust Your Professional Summary
            </h4>
            <p className="text-accent">
              Modify your summary to highlight the most relevant experience and
              skills for that specific role.
            </p>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">
              3. Prioritize Relevant Experience
            </h4>
            <p className="text-ink/80">
              Lead with the most relevant bullet points and experiences. You can
              even reorder sections if it makes sense.
            </p>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">
              4. Include Relevant Keywords
            </h4>
            <p className="text-ink/80">
              Incorporate industry-specific terms and skills mentioned in the
              job posting to pass ATS screening.
            </p>
          </div>
        </div>

        <div className="my-12 bg-ink text-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Build Your Professional Resume?
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Skip the formatting hassle with our ATS-friendly templates
          </p>
          <a
            href="/templates"
            className="inline-block bg-white text-accent px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Choose Your Template
          </a>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 7: Final Review and Optimization
        </h2>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-6">
          <h3 className="font-bold text-red-800 mb-3">
            Resume Review Checklist:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-red-700">
            <li>Proofread for spelling and grammar errors</li>
            <li>Ensure consistent formatting throughout</li>
            <li>Verify all contact information is current</li>
            <li>Check that all dates are accurate</li>
            <li>Confirm the resume is 1-2 pages maximum</li>
            <li>Test ATS compatibility by saving as plain text</li>
            <li>Have someone else review it for clarity</li>
            <li>Ensure it's saved as a PDF with your name in the filename</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Common Resume Mistakes to Avoid
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-bold text-red-800 mb-3">Content Mistakes</h4>
            <ul className="list-disc pl-6 space-y-1 text-red-700 text-sm">
              <li>Using generic, one-size-fits-all content</li>
              <li>Including irrelevant work experience</li>
              <li>Focusing on duties instead of achievements</li>
              <li>Forgetting to quantify results</li>
              <li>Using outdated or unprofessional email addresses</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-bold text-red-800 mb-3">Formatting Mistakes</h4>
            <ul className="list-disc pl-6 space-y-1 text-red-700 text-sm">
              <li>Using unprofessional fonts or colors</li>
              <li>Making the resume too long (3+ pages)</li>
              <li>Inconsistent formatting and spacing</li>
              <li>Including photos or graphics (for most industries)</li>
              <li>Submitting in formats other than PDF</li>
            </ul>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm mt-8">
          For a detailed breakdown of what NOT to include on your resume, read
          our comprehensive guide on{" "}
          <a
            href="/blog/resume-mistakes-to-avoid"
            className="text-accent hover:text-ink underline"
          >
            10 Critical Resume Mistakes That Kill Your Job Prospects
          </a>
          .
        </p>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
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
            <li>Create a professional template you can customize</li>
            <li>Start applying to your target roles with confidence</li>
          </ol>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm">
          Remember, your resume is just the first step in your job search
          journey. Once you land those interviews, make sure you're prepared to
          showcase your skills and experience in person. Good luck!
        </p>
      </div>
    </BlogLayout>
  );
}
