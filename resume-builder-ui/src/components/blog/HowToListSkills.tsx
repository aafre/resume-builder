import BlogLayout from "../BlogLayout";

export default function HowToListSkills() {
  return (
    <BlogLayout
      title="How to List Skills on a Resume: A Step-by-Step Guide (100+ Examples)"
      description="Master the art of creating a powerful skills section. Learn what to include, how to format it, and get inspired with over 100 examples for any industry."
      publishDate="2026-01-23"
      lastUpdated="2026-01-25"
      readTime="12 min"
      keywords={[
        "how to list skills on resume",
        "resume skills section",
        "hard skills vs soft skills",
        "technical skills resume",
        "resume examples",
      ]}
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Updated for 2026: The skills section remains one of the most important
          parts of your resume. It's a quick snapshot that tells recruiters and
          Applicant Tracking Systems (ATS) whether you have the qualifications
          for the job.
        </p>

        <p className="text-lg leading-relaxed text-stone-warm">
          But many job seekers struggle with it. What skills should you include?
          How should you format them? This guide will walk you through
          everything you need to know to create a skills section that gets
          results.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-yellow-800 mb-3">⚡ Quick Impact Check</h3>
          <p className="text-yellow-700">
            A well-crafted skills section can be the difference between your
            resume being filtered out by ATS or making it to a human recruiter.
            Studies show that over 75% of resumes are rejected by ATS before a
            human ever sees them.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 1: Understand Hard Skills vs. Soft Skills
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Your skills section should include a strategic mix of both hard and
          soft skills to give recruiters a complete picture of your
          capabilities.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-4">
              🔧 Hard Skills (Technical Skills)
            </h3>
            <div className="text-ink/80">
              <p className="mb-3">
                Teachable, technical abilities that are easy to quantify. Often
                specific to a job or industry.
              </p>
              <h4 className="font-medium mb-2">Examples:</h4>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Programming Languages (Python, Java)</li>
                <li>Software Proficiency (Salesforce, Adobe Suite)</li>
                <li>Data Analysis & Visualization</li>
                <li>Foreign Languages (Spanish, Mandarin)</li>
                <li>Digital Marketing (SEO, Google Ads)</li>
                <li>Project Management (Agile, Scrum)</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              🤝 Soft Skills (Interpersonal Skills)
            </h3>
            <div className="text-accent">
              <p className="mb-3">
                Personal attributes that describe your work style and how you
                interact with others. Harder to quantify but equally important.
              </p>
              <h4 className="font-medium mb-2">Examples:</h4>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Communication & Presentation</li>
                <li>Leadership & Team Management</li>
                <li>Problem-Solving & Critical Thinking</li>
                <li>Time Management & Organization</li>
                <li>Adaptability & Flexibility</li>
                <li>Emotional Intelligence</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-6">
          <h4 className="font-bold text-ink mb-3">📊 The Right Balance</h4>
          <p className="text-stone-warm">
            <strong>Ideal ratio:</strong> 60-70% hard skills, 30-40% soft skills.
            Hard skills get you past ATS filters, while soft skills show you'll
            fit well with the team and company culture.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 2: Brainstorm a Master List of Your Skills
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Before you start writing, create a comprehensive inventory of every
          skill you possess. Think about your experience from previous jobs,
          education, projects, and even hobbies. Don't filter yourself at this
          stage.
        </p>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h3 className="font-bold text-ink mb-4">
            🧠 Skills Discovery Questions:
          </h3>
          <div className="space-y-4 text-ink/80">
            <div>
              <p className="font-medium">From Your Work Experience:</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>What software, tools, or systems have you used?</li>
                <li>What processes have you managed or improved?</li>
                <li>What projects have you led or contributed to?</li>
                <li>What problems have you solved?</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">From Your Education:</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>What technical skills did you learn in school?</li>
                <li>What research or analytical methods did you use?</li>
                <li>What group projects or leadership roles did you have?</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">From Personal Projects & Hobbies:</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>What skills have you developed through side projects?</li>
                <li>What online courses or certifications have you completed?</li>
                <li>What volunteer work or personal interests demonstrate skills?</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 3: Tailor Your Skills to the Job Description
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          This is the most critical step.{" "}
          <strong>
            Do not use the same generic skills list for every application.
          </strong>
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-red-800 mb-4">🎯 Tailoring Process:</h3>
          <ol className="list-decimal pl-6 space-y-3 text-red-700">
            <li>
              <strong>Read the job description carefully</strong> and identify
              the key skills the employer is looking for
            </li>
            <li>
              <strong>From your master list,</strong> select the 8-12 skills
              that are most relevant to that specific job
            </li>
            <li>
              <strong>Match the language</strong> - if they ask for "Project
              Management," use that exact phrase, not "Managing Projects"
            </li>
            <li>
              <strong>Prioritize required skills</strong> over nice-to-have
              skills
            </li>
            <li>
              <strong>Include skill variations</strong> - both "SEO" and "Search
              Engine Optimization"
            </li>
          </ol>
        </div>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h4 className="font-bold text-ink mb-3">💡 Pro Tip: Keyword Matching</h4>
          <p className="text-ink/80">
            Copy the job description into a word cloud generator (like
            WordArt.com) to visually identify the most frequently mentioned
            skills. These should be your priority keywords if you have the
            experience to back them up.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Step 4: Choose the Right Format
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          There are several ways to format your skills section. The best choice
          depends on your industry, experience level, and the specific role
          you're targeting.
        </p>

        <div className="space-y-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              Option 1: The Simple Bulleted List
            </h3>
            <div className="text-accent">
              <p className="mb-3">
                This is the most common and ATS-friendly format. It's clean,
                easy to read, and effective for most roles.
              </p>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-bold text-ink mb-2">Skills</h4>
                <ul className="list-disc pl-5 text-sm space-y-1 text-stone-warm">
                  <li>JavaScript, React, Node.js</li>
                  <li>Agile Methodology & Scrum</li>
                  <li>Data Analysis & Visualization</li>
                  <li>Team Leadership & Mentoring</li>
                  <li>Project Management</li>
                  <li>Problem-Solving & Critical Thinking</li>
                </ul>
              </div>
              <div className="mt-3">
                <p className="font-medium text-green-800">Best for:</p>
                <p className="text-sm">Most roles, especially when space is limited</p>
              </div>
            </div>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-4">
              Option 2: Grouped by Category
            </h3>
            <div className="text-ink/80">
              <p className="mb-3">
                This is a great option if you have a wide range of skills,
                especially in technical fields.
              </p>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-bold text-ink mb-3">Technical Skills</h4>
                <div className="text-sm space-y-2 text-stone-warm">
                  <p><strong>Languages:</strong> Python, JavaScript, SQL, Java</p>
                  <p><strong>Frameworks:</strong> React, Django, Node.js, Express.js</p>
                  <p><strong>Cloud & DevOps:</strong> AWS, Docker, Kubernetes, Jenkins</p>
                  <p><strong>Databases:</strong> PostgreSQL, MongoDB, Redis</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="font-medium text-ink">Best for:</p>
                <p className="text-sm">Technical roles, senior positions, career changers</p>
              </div>
            </div>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-4">
              Option 3: Skills with Proficiency Levels
            </h3>
            <div className="text-ink/80">
              <p className="mb-3">
                Useful when you want to indicate your experience level,
                especially for technical skills.
              </p>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-bold text-ink mb-3">Core Competencies</h4>
                <div className="text-sm space-y-1 text-stone-warm">
                  <p>• Python (Expert, 5+ years)</p>
                  <p>• React & JavaScript (Advanced, 3+ years)</p>
                  <p>• Machine Learning (Intermediate, 2 years)</p>
                  <p>• Project Management (Advanced)</p>
                  <p>• Team Leadership (Experienced)</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="font-medium text-ink">Best for:</p>
                <p className="text-sm">Technical roles, consultant positions, freelancers</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-orange-800 mb-4">
              Option 4: Combined Hard & Soft Skills
            </h3>
            <div className="text-orange-700">
              <p className="mb-3">
                Separates technical abilities from interpersonal skills for
                clarity.
              </p>
              <div className="bg-white p-4 rounded-lg border">
                <div className="grid md:grid-cols-2 gap-4 text-sm text-stone-warm">
                  <div>
                    <h4 className="font-bold text-ink mb-2">Technical Skills</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Salesforce CRM</li>
                      <li>Google Analytics</li>
                      <li>SQL & Data Analysis</li>
                      <li>Adobe Creative Suite</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-ink mb-2">Core Strengths</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Strategic Planning</li>
                      <li>Cross-functional Leadership</li>
                      <li>Client Relationship Management</li>
                      <li>Process Optimization</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <p className="font-medium text-orange-800">Best for:</p>
                <p className="text-sm">Management roles, client-facing positions</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          100+ Skills Examples by Industry
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Here are comprehensive lists of in-demand skills across various
          industries to help you brainstorm and identify relevant keywords.
        </p>

        <div className="space-y-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-4">
              💻 Technology & Software Development
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-ink/80 text-sm">
              <div>
                <h4 className="font-medium mb-2">Programming Languages:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Python</li>
                  <li>JavaScript</li>
                  <li>Java</li>
                  <li>C++</li>
                  <li>C#</li>
                  <li>PHP</li>
                  <li>Ruby</li>
                  <li>Swift</li>
                  <li>Kotlin</li>
                  <li>Go</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Frameworks & Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>React</li>
                  <li>Angular</li>
                  <li>Vue.js</li>
                  <li>Node.js</li>
                  <li>Django</li>
                  <li>Spring Boot</li>
                  <li>Docker</li>
                  <li>Kubernetes</li>
                  <li>Git</li>
                  <li>Jenkins</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Specializations:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cloud Computing (AWS, Azure)</li>
                  <li>DevOps</li>
                  <li>Machine Learning</li>
                  <li>Data Science</li>
                  <li>Cybersecurity</li>
                  <li>Mobile Development</li>
                  <li>API Development</li>
                  <li>Database Management</li>
                  <li>Agile Methodology</li>
                  <li>Test-Driven Development</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              📊 Marketing & Sales
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-accent text-sm">
              <div>
                <h4 className="font-medium mb-2">Digital Marketing:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Search Engine Optimization (SEO)</li>
                  <li>Google Ads & PPC</li>
                  <li>Social Media Marketing</li>
                  <li>Content Marketing</li>
                  <li>Email Marketing</li>
                  <li>Marketing Automation</li>
                  <li>Conversion Rate Optimization</li>
                  <li>Google Analytics</li>
                  <li>A/B Testing</li>
                  <li>Growth Hacking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Sales Skills:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>B2B Sales</li>
                  <li>B2C Sales</li>
                  <li>Lead Generation</li>
                  <li>CRM Management (Salesforce)</li>
                  <li>Sales Forecasting</li>
                  <li>Negotiation</li>
                  <li>Account Management</li>
                  <li>Cold Calling</li>
                  <li>Pipeline Management</li>
                  <li>Customer Retention</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Analytics & Strategy:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Market Research</li>
                  <li>Competitive Analysis</li>
                  <li>Brand Strategy</li>
                  <li>Campaign Management</li>
                  <li>ROI Analysis</li>
                  <li>Customer Segmentation</li>
                  <li>Marketing Mix Modeling</li>
                  <li>Attribution Analysis</li>
                  <li>Customer Journey Mapping</li>
                  <li>Performance Marketing</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-4">
              🎨 Design & Creative
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-ink/80 text-sm">
              <div>
                <h4 className="font-medium mb-2">Design Software:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Adobe Creative Suite</li>
                  <li>Photoshop</li>
                  <li>Illustrator</li>
                  <li>InDesign</li>
                  <li>After Effects</li>
                  <li>Figma</li>
                  <li>Sketch</li>
                  <li>Adobe XD</li>
                  <li>Canva</li>
                  <li>Procreate</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Design Specializations:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>UI/UX Design</li>
                  <li>Web Design</li>
                  <li>Graphic Design</li>
                  <li>Brand Identity</li>
                  <li>Logo Design</li>
                  <li>Print Design</li>
                  <li>Motion Graphics</li>
                  <li>3D Modeling</li>
                  <li>Typography</li>
                  <li>Color Theory</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Process & Strategy:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Design thinking</li>
                  <li>User Research</li>
                  <li>Wireframing</li>
                  <li>Prototyping</li>
                  <li>Usability Testing</li>
                  <li>Design Systems</li>
                  <li>Creative Direction</li>
                  <li>Brand Guidelines</li>
                  <li>Client Presentations</li>
                  <li>Project Management</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-orange-800 mb-4">
              💼 Business & Finance
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-orange-700 text-sm">
              <div>
                <h4 className="font-medium mb-2">Financial Analysis:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Financial Modeling</li>
                  <li>Budgeting & Forecasting</li>
                  <li>Variance Analysis</li>
                  <li>Excel & Advanced Formulas</li>
                  <li>PowerBI</li>
                  <li>Tableau</li>
                  <li>SQL</li>
                  <li>Risk Assessment</li>
                  <li>Cost Analysis</li>
                  <li>Investment Analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Business Operations:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Process Improvement</li>
                  <li>Project Management</li>
                  <li>Strategic Planning</li>
                  <li>Business Development</li>
                  <li>Market Analysis</li>
                  <li>Vendor Management</li>
                  <li>Contract Negotiation</li>
                  <li>Supply Chain Management</li>
                  <li>Quality Assurance</li>
                  <li>Change Management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Compliance & Governance:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Regulatory Compliance</li>
                  <li>Audit & Internal Controls</li>
                  <li>Financial Reporting</li>
                  <li>GAAP Knowledge</li>
                  <li>SOX Compliance</li>
                  <li>Risk Management</li>
                  <li>Policy Development</li>
                  <li>Due Diligence</li>
                  <li>Corporate Governance</li>
                  <li>Data Privacy (GDPR)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-teal-800 mb-4">
              🤝 Universal Soft Skills (All Industries)
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-teal-700 text-sm">
              <div>
                <h4 className="font-medium mb-2">Communication:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Public Speaking</li>
                  <li>Written Communication</li>
                  <li>Active Listening</li>
                  <li>Presentation Skills</li>
                  <li>Cross-cultural Communication</li>
                  <li>Conflict Resolution</li>
                  <li>Interpersonal Skills</li>
                  <li>Storytelling</li>
                  <li>Technical Writing</li>
                  <li>Multilingual</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Leadership & Management:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Team Leadership</li>
                  <li>People Management</li>
                  <li>Coaching & Mentoring</li>
                  <li>Delegation</li>
                  <li>Performance Management</li>
                  <li>Strategic Thinking</li>
                  <li>Decision Making</li>
                  <li>Vision Setting</li>
                  <li>Change Leadership</li>
                  <li>Emotional Intelligence</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Personal Effectiveness:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Time Management</li>
                  <li>Organization</li>
                  <li>Adaptability</li>
                  <li>Problem-Solving</li>
                  <li>Critical Thinking</li>
                  <li>Creativity</li>
                  <li>Attention to Detail</li>
                  <li>Self-Motivation</li>
                  <li>Stress Management</li>
                  <li>Continuous Learning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="my-12 bg-ink text-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Build Your Skills-Optimized Resume?
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Use these skills strategically with our ATS-friendly templates
          </p>
          <a
            href="/templates"
            className="inline-block bg-white text-accent px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Start Building Your Resume
          </a>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Common Skills Section Mistakes to Avoid
        </h2>

        <div className="space-y-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h4 className="font-bold text-ink mb-2">
              ❌ Mistake: Including outdated or irrelevant skills
            </h4>
            <p className="text-stone-warm mb-2">
              <strong>Example:</strong> Listing "Microsoft Word" as a key skill
              for a senior developer role
            </p>
            <p className="text-accent">
              <strong>Better:</strong> Focus on current, relevant skills that
              match the job requirements
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h4 className="font-bold text-ink mb-2">
              ❌ Mistake: Being too vague or generic
            </h4>
            <p className="text-stone-warm mb-2">
              <strong>Example:</strong> "Good communication skills" or "Team
              player"
            </p>
            <p className="text-accent">
              <strong>Better:</strong> "Public Speaking & Presentation" or
              "Cross-functional Team Leadership"
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h4 className="font-bold text-ink mb-2">
              ❌ Mistake: Lying about your skill level
            </h4>
            <p className="text-stone-warm mb-2">
              <strong>Example:</strong> Claiming "Expert in Python" when you've
              only completed online tutorials
            </p>
            <p className="text-accent">
              <strong>Better:</strong> Be honest about your level - "Python
              (Intermediate)" or "Python (1 year experience)"
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h4 className="font-bold text-ink mb-2">
              ❌ Mistake: Making the skills section too long
            </h4>
            <p className="text-stone-warm mb-2">
              <strong>Example:</strong> Listing 20+ skills without
              prioritization
            </p>
            <p className="text-accent">
              <strong>Better:</strong> Curate 8-12 most relevant skills for each
              application
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Advanced Skills Section Strategies
        </h2>

        <div className="space-y-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-ink mb-3">
              1. Include Skills from the Entire Job Posting
            </h3>
            <p className="text-ink/80 mb-3">
              Don't just focus on the "Requirements" section. Look at the job
              title, company description, and "Nice to Have" sections for
              additional relevant skills.
            </p>
            <div className="bg-white p-3 rounded text-sm text-ink/80">
              <strong>Tip:</strong> If the job mentions "fast-paced environment,"
              include "Ability to Work Under Pressure" or "Rapid Adaptation"
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-800 mb-3">
              2. Use Industry-Specific Terminology
            </h3>
            <p className="text-accent mb-3">
              Each industry has its own language. Use the specific terms and
              acronyms that professionals in your field would recognize.
            </p>
            <div className="bg-white p-3 rounded text-sm text-accent">
              <strong>Example:</strong> Instead of "Customer Service," use "Client
              Relations" in consulting or "Customer Success" in SaaS companies
            </div>
          </div>

          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-ink mb-3">
              3. Balance Popular and Niche Skills
            </h3>
            <p className="text-ink/80 mb-3">
              Include both widely-demanded skills (like "Project Management") and
              specialized skills that make you unique (like specific software or
              methodologies).
            </p>
            <div className="bg-white p-3 rounded text-sm text-ink/80">
              <strong>Strategy:</strong> 70% popular skills + 30% specialized
              skills = Well-rounded candidate
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Your Next Steps: Building Your Perfect Skills Section
        </h2>

        <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
          <h3 className="font-bold text-ink mb-4">🎯 Action Plan:</h3>
          <ol className="list-decimal pl-6 space-y-3 text-stone-warm">
            <li>
              <strong>Create your master skills inventory</strong> using the
              discovery questions above
            </li>
            <li>
              <strong>Analyze 3-5 job postings</strong> in your target role and
              identify common skill requirements
            </li>
            <li>
              <strong>Select 8-12 most relevant skills</strong> for each
              specific application
            </li>
            <li>
              <strong>Choose the right format</strong> based on your industry
              and experience level
            </li>
            <li>
              <strong>Include both hard and soft skills</strong> in the right
              balance
            </li>
            <li>
              <strong>Test your resume</strong> with ATS-checking tools to
              ensure your skills are being recognized
            </li>
            <li>
              <strong>Update regularly</strong> as you develop new skills and
              target different roles
            </li>
          </ol>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
          <h4 className="font-bold text-green-800 mb-3">🚀 Remember</h4>
          <p className="text-accent">
            Your skills section is prime real estate on your resume. Every word
            should be intentional and relevant to the role you're targeting. When
            done right, it can be the difference between getting filtered out by
            ATS and landing in the "yes" pile for human review.
          </p>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm mt-8">
          Ready to create a standout skills section? Use our free resume builder
          to implement these strategies and create a professional resume that
          gets results. Your perfect skills section is just a few clicks away.
        </p>
      </div>
    </BlogLayout>
  );
}