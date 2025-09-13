import { Link } from "react-router-dom";
import BlogLayout from "../BlogLayout";

export default function ResumeNoExperience() {
  return (
    <BlogLayout
      title="Resume with No Experience: Real Examples + Free Template"
      description="How to write an ATS-friendly, confidence-boosting resume when you're just starting out. Includes copy-paste examples and free template."
      publishDate="2025-07-20"
      readTime="10–14 min"
      keywords={[
        "entry level resume",
        "no experience resume",
        "first job resume",
        "new graduate resume",
        "student resume",
        "ATS resume tips",
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-gray-700 font-medium">
          Starting your career without "official" experience can feel
          intimidating – but employers hire for potential as much as for
          history. If you show the right skills, projects, and results, you can
          win interviews even with a blank work history.
        </p>

        <p className="text-lg leading-relaxed text-gray-700">
          This guide gives you copy-paste examples, role-specific keywords, and
          a free ATS-friendly template you can use with{" "}
          <Link
            to="/templates"
            className="text-blue-600 hover:underline font-semibold"
          >
            EasyFreeResume
          </Link>{" "}
          to generate a polished resume in minutes.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-2">Key Insight</h3>
          <p className="text-blue-700">
            <strong>You do have experience</strong> – it's just not always paid.
            Use projects, coursework, internships, part-time work, volunteering,
            clubs, and self-initiated learning to prove you can create value.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          The Best Resume Format When You Have No Experience
        </h2>

        <p className="text-lg leading-relaxed text-gray-700 mb-6">
          Use a <strong>Hybrid (Combination) format</strong> – not purely
          functional. A hybrid resume puts skills & projects near the top while
          still showing experience chronologically (part-time, internships,
          volunteering). It's ATS-friendly and recruiter-friendly.
        </p>

        <div className="bg-gray-50 border-l-4 border-blue-500 p-6">
          <h4 className="font-bold text-gray-900 mb-3">Recommended order:</h4>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Contact info</strong>
            </li>
            <li>
              <strong>Professional Summary</strong> (tailored to the role)
            </li>
            <li>
              <strong>Skills</strong> (grouped by category)
            </li>
            <li>
              <strong>Projects</strong> (academic, personal, volunteer)
            </li>
            <li>
              <strong>Education</strong> (relevant coursework, honors)
            </li>
            <li>
              <strong>Experience</strong> (part-time, internships, volunteering)
            </li>
            <li>
              <strong>Certifications / Awards / Languages</strong>
            </li>
          </ol>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Make It ATS-Friendly (So You Get Seen)
        </h2>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 mb-3">
              ✅ ATS Best Practices
            </h4>
            <ul className="list-disc pl-6 space-y-1 text-green-700 text-sm">
              <li>
                Use standard headings: Summary, Skills, Projects, Education,
                Experience
              </li>
              <li>
                Keep formatting simple: no tables, text boxes, images, or icons
              </li>
              <li>Fonts: system fonts (Arial, Calibri, Times, Georgia)</li>
              <li>File type: PDF (unless job post requests DOCX)</li>
              <li>Keywords: mirror the job description's phrasing</li>
              <li>Dates & locations: consistent format</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-bold text-yellow-800 mb-3">💡 Pro Tips</h4>
            <ul className="list-disc pl-6 space-y-1 text-yellow-700 text-sm">
              <li>Use keywords naturally throughout sections</li>
              <li>Include both acronyms and full terms</li>
              <li>Match job posting's exact phrasing</li>
              <li>Add relevant coursework for skills</li>
              <li>Quantify results wherever possible</li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Professional Summary Examples (Copy-Paste)
        </h2>

        <p className="text-lg leading-relaxed text-gray-700 mb-6">
          Use 2–3 sentences: who you are, target role, 2–3 strengths, and the
          value you'll bring.
        </p>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">
              General Entry-Level (no degree required)
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="italic text-gray-800">
                "Motivated entry-level candidate seeking a [Target Role]. Known
                for fast learning, clear communication, and reliability.
                Completed hands-on projects in [Skill/Tool] and contributed to
                team goals through volunteering and part-time work."
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">
              Student / New Graduate (Marketing)
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="italic text-gray-800">
                "Recent Marketing graduate with coursework in SEO, social media,
                and analytics. Built a campaign project that grew engagement by
                38% for a local charity. Eager to apply data-driven creative
                skills in an entry-level marketing role."
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">
              Computer Science Student / Internship
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="italic text-gray-800">
                "CS student with projects in Python and JavaScript, including a
                full-stack app using React/Node and a data-analysis notebook in
                Pandas. Comfortable with Git, REST APIs, and agile teamwork.
                Looking for a software internship to ship real features."
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">
              Customer Service / Retail
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="italic text-gray-800">
                "People-first problem solver with 1+ year of part-time service
                experience. Maintained 95% positive feedback, resolved issues
                quickly, and handled cash and inventory accurately. Ready to
                deliver memorable customer experiences."
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">
              Finance / Business Analyst (Graduate)
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="italic text-gray-800">
                "Business graduate with strong Excel skills (VLOOKUP,
                PivotTables), coursework in financial analysis and forecasting,
                and a capstone on pricing strategy. Seeking an analyst role to
                turn data into clear business recommendations."
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Bullet Formula (So Your Points Stand Out)
        </h2>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-purple-800 mb-3">Formula:</h4>
          <p className="text-purple-700 font-medium text-lg mb-4">
            Action verb + task + tools/skills + outcome (with a number)
          </p>

          <h5 className="font-bold text-purple-800 mb-3">
            Examples (adapt to your context):
          </h5>
          <div className="space-y-3 text-purple-700">
            <div className="bg-white p-3 rounded-lg text-sm">
              • Built a React/Node web app for course project, implementing auth
              & CRUD; deployed on Render; used Git/GitHub for collaboration.
            </div>
            <div className="bg-white p-3 rounded-lg text-sm">
              • Analyzed survey data in Excel (PivotTables, charts) to identify
              3 customer pain points; presented findings to class panel.
            </div>
            <div className="bg-white p-3 rounded-lg text-sm">
              • Led a 5-person team in society event planning; negotiated £400
              in sponsorship; increased attendance by 42%.
            </div>
            <div className="bg-white p-3 rounded-lg text-sm">
              • Tutored GCSE math for 6 students; improved average scores by
              +1.5 grades in 8 weeks.
            </div>
            <div className="bg-white p-3 rounded-lg text-sm">
              • Resolved 20–30 customer queries per shift; maintained 95%
              satisfaction and processed cash/card payments accurately.
            </div>
          </div>

          <p className="text-purple-700 mt-4 font-medium">
            Avoid vague verbs ("helped", "worked on"). Use measurable outcomes
            wherever possible.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Projects: Your Fastest Path to Credibility
        </h2>

        <p className="text-lg leading-relaxed text-gray-700 mb-6">
          Show 2–4 relevant projects with results and tools.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-blue-800 mb-3">Template:</h4>
          <div className="text-blue-700 space-y-2">
            <p>
              <strong>Project Name</strong> – 1-line value statement
            </p>
            <p>Used [tools] to [do what]; outcome [metric/impact]</p>
            <p>
              Role: [lead/contributor] · Team: [solo/size] · Link
              (GitHub/portfolio) if public
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">
              Local Charity Social Campaign – Increased engagement by 38% in 4
              weeks
            </h4>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li>
                Designed content calendar, wrote posts, and tracked analytics in
                Meta Business Suite
              </li>
              <li>
                Built a simple UTM tracker in Sheets; reported weekly insights
                to the coordinator
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">
              Campus Food Finder (React/Node) – Deployed MVP used by 80+
              students
            </h4>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li>
                Implemented JWT auth, MongoDB CRUD, and mobile-responsive UI;
                GitHub link available
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">
              Retail Stock Optimization (Excel) – Reduced out-of-stock items by
              18%
            </h4>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li>
                Built a forecast with seasonality; created dashboard for the
                shift lead
              </li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Skills That Win Entry-Level Interviews
        </h2>

        <p className="text-lg leading-relaxed text-gray-700 mb-6">
          Group skills so they're easy to scan.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">Technical / Tools</h4>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li>Excel (PivotTables, LOOKUP), Google Sheets, PowerPoint</li>
              <li>Python, JavaScript, SQL (beginner–intermediate)</li>
              <li>Canva, Figma, Google Analytics, Meta Ads (basic)</li>
              <li>CRM basics (HubSpot/Salesforce), POS systems</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">Transferable</h4>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li>Communication, teamwork, customer service</li>
              <li>Problem-solving, organization, time management</li>
              <li>Attention to detail, initiative, adaptability</li>
              <li>Reliability, fast learning, collaboration</li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Role-Specific Keywords (Use Naturally)
        </h2>

        <p className="text-lg leading-relaxed text-gray-700 mb-6">
          Mirror the job post's language. Don't stuff – weave into Summary,
          Projects, Experience, and Skills.
        </p>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-2">
              Marketing Assistant Keywords
            </h4>
            <p className="text-blue-800 text-sm">
              SEO, social media, content calendar, Canva, Google Analytics,
              email campaigns, CTR, engagement, A/B testing, CMS (WordPress)
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <h4 className="font-bold text-purple-900 mb-2">
              Software / Data Intern Keywords
            </h4>
            <p className="text-purple-800 text-sm">
              Python, JavaScript, React, Node, SQL, APIs, Git, unit tests, data
              cleaning, Pandas, Jira, Agile/Scrum
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-900 mb-2">
              Customer Service / Retail Keywords
            </h4>
            <p className="text-green-800 text-sm">
              POS, cash handling, returns, merchandising, inventory, upselling,
              complaints resolution, CRM, shift lead
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
            <h4 className="font-bold text-orange-900 mb-2">
              Admin / Ops Assistant Keywords
            </h4>
            <p className="text-orange-800 text-sm">
              Google Workspace / Microsoft 365, scheduling, calendar management,
              data entry, documentation, spreadsheets, vendor coordination
            </p>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-2">
              Finance / Analyst Intern Keywords
            </h4>
            <p className="text-gray-800 text-sm">
              Excel (PivotTables, charts), financial analysis, variance,
              budgeting, SQL (basic), Power BI/Tableau (basic), forecasting
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Two Complete Examples (Ready to Adapt)
        </h2>

        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Example 1 – Marketing Graduate (No Full-Time Experience)
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg font-mono text-sm space-y-3">
              <div className="text-center">
                <p className="font-bold text-lg text-gray-900">Ava Patel</p>
                <p className="text-gray-700">
                  London, UK · ava.patel@email · 07xxx · linkedin.com/in/ava ·
                  portfolio.link
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">SUMMARY</p>
                <p className="text-gray-800">
                  Marketing graduate targeting entry-level digital roles.
                  Strengths in content, SEO basics, and analytics. Led a class
                  campaign that raised engagement by 38% for a local charity.
                  Organized, creative, and data-aware.
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">SKILLS</p>
                <p className="text-gray-800">
                  <strong>Tools:</strong> Google Analytics (GA4), Search
                  Console, Canva, Meta Business Suite, Sheets, Slides
                </p>
                <p className="text-gray-800">
                  <strong>Transferable:</strong> Copywriting, research,
                  collaboration, time management
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">PROJECTS</p>
                <div className="space-y-2">
                  <p className="text-gray-800">
                    <strong>Local Charity Social Campaign</strong> – +38%
                    engagement in 4 weeks (Feb–Mar 2025)
                  </p>
                  <p className="text-gray-700">
                    • Built a content calendar, wrote posts, and coordinated
                    with 2 volunteers; tracked KPIs in GA/Meta
                  </p>
                  <p className="text-gray-700">
                    • Created a simple UTM tracker in Sheets; weekly reporting
                    to the coordinator
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">EDUCATION</p>
                <p className="text-gray-800">
                  BA Marketing, University of Westminster (2021–2025) · GPA 3.6
                </p>
                <p className="text-gray-700">
                  Coursework: Digital Marketing, Consumer Behavior, Market
                  Research, Analytics
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">EXPERIENCE</p>
                <div className="space-y-2">
                  <p className="text-gray-800">
                    <strong>Volunteer Coordinator</strong> – Community Market,
                    London (Sep 2024–Mar 2025)
                  </p>
                  <p className="text-gray-700">
                    • Scheduled 15 volunteers; standardized brief; reduced late
                    start incidents by 25%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Example 2 – Computer Science Student (Internship-Ready)
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg font-mono text-sm space-y-3">
              <div className="text-center">
                <p className="font-bold text-lg text-gray-900">Liam Chen</p>
                <p className="text-gray-700">
                  Manchester, UK · liamc@email · 07xxx · linkedin.com/in/liamc ·
                  github.com/liamc
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">SUMMARY</p>
                <p className="text-gray-800">
                  CS student seeking software internship. Built a full-stack
                  React/Node app and a Python data project; comfortable with
                  Git, REST APIs, and unit tests. Curious, methodical, and
                  collaborative.
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">SKILLS</p>
                <p className="text-gray-800">
                  <strong>Tools:</strong> JavaScript, React, Node, Express,
                  Python, Pandas, SQL (SQLite), Git/GitHub, Jest
                </p>
                <p className="text-gray-800">
                  <strong>Transferable:</strong> Problem-solving, communication,
                  version control discipline
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">PROJECTS</p>
                <div className="space-y-2">
                  <p className="text-gray-800">
                    <strong>Campus Food Finder (React/Node)</strong> – MVP used
                    by 80+ students (Jan–Apr 2025)
                  </p>
                  <p className="text-gray-700">
                    • Implemented auth, favorites, and search; REST API with
                    Express; MongoDB persistence
                  </p>
                  <p className="text-gray-700">
                    • Wrote unit tests with Jest; deployed preview on Render;
                    repo on GitHub
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">EDUCATION</p>
                <p className="text-gray-800">
                  BSc Computer Science, University of Manchester (2023–2026)
                </p>
                <p className="text-gray-700">
                  Coursework: Data Structures, Web Dev, Databases, Algorithms
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">EXPERIENCE</p>
                <div className="space-y-2">
                  <p className="text-gray-800">
                    <strong>IT Support Volunteer</strong> – Local Community
                    Centre (Jun–Aug 2024)
                  </p>
                  <p className="text-gray-700">
                    • Resolved basic tech issues (Wi-Fi, printer drivers);
                    documented fixes in shared Google Doc
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          Common Mistakes (and the Fix)
        </h2>

        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <h4 className="font-bold text-gray-900 mb-1">
              ❌ Apologizing for no experience
            </h4>
            <p className="text-green-700 text-sm">
              → Replace with proof of potential (projects, results, learning)
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <h4 className="font-bold text-gray-900 mb-1">
              ❌ Generic objectives
            </h4>
            <p className="text-green-700 text-sm">
              → Use a Summary that states value, skills, and target role
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <h4 className="font-bold text-gray-900 mb-1">❌ Wall of text</h4>
            <p className="text-green-700 text-sm">
              → Short bullets with numbers
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <h4 className="font-bold text-gray-900 mb-1">❌ Irrelevant info</h4>
            <p className="text-green-700 text-sm">
              → Prioritize relevant projects/skills to the job post
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
          FAQ (Quick Answers)
        </h2>

        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">
              Should I use a resume objective or summary with no experience?
            </h4>
            <p className="text-gray-700 text-sm">
              Use a summary that states your target role, 2–3 strengths, and 1
              proof point. Objectives are often vague.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">
              How long should my resume be?
            </h4>
            <p className="text-gray-700 text-sm">
              One page is ideal for entry-level candidates.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">
              Should I include GPA?
            </h4>
            <p className="text-gray-700 text-sm">
              Include if ≥ 3.5/4.0 (or equivalent). Otherwise, skip it.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">
              What if I truly have zero to list?
            </h4>
            <p className="text-gray-700 text-sm">
              Create two quick projects aligned to the role (e.g., simple
              website, data analysis, community event). Show outcome and tools.
            </p>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
}
