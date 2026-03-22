import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";

const FAQS = [
  {
    question: "How long should a resume be in 2026?",
    answer: "For most job seekers, a resume should be 1-2 pages. Entry-level candidates (0-3 years experience) should aim for 1 page, mid-level professionals (3-10 years) can use 1-2 pages, and senior-level professionals (10+ years) may use 2-3 pages.",
  },
  {
    question: "Is a 3-page resume too long?",
    answer: "For most industries, yes. A 3-page resume is generally only appropriate for senior executives with 15+ years of experience, academic CVs, or healthcare professionals with extensive certifications. Over 77% of recruiters prefer resumes that are 1-2 pages.",
  },
  {
    question: "Can a resume be 2 pages for an entry-level candidate?",
    answer: "It is generally not recommended. Entry-level candidates with 0-3 years of experience should keep their resume to 1 page, focusing on education, internships, projects, and relevant skills. Quality content is more important than filling space.",
  },
  {
    question: "Do ATS systems have resume length limits?",
    answer: "While most modern ATS systems can process multi-page resumes, some older systems may truncate content beyond 2 pages. For best results, keep critical information on the first two pages, maintain consistent formatting, and keep your file size under 1MB.",
  },
  {
    question: "Should I use a smaller font to fit my resume on one page?",
    answer: "No. Using a font smaller than 10pt makes your resume difficult to read and signals that you could not effectively prioritize your content. Instead, focus on your most impactful achievements and remove outdated or irrelevant information.",
  },
];

export default function ResumeLengthGuide() {
  return (
    <BlogLayout
      title="Resume Length: How Long Should Your Resume Be in 2026?"
      description="Discover the optimal resume length for your experience level and industry, with specific guidelines. Updated for 2026."
      publishDate="2026-01-08"
      lastUpdated="2026-03-22"
      readTime="10 min"
      keywords={[
        "resume length",
        "how long resume",
        "resume pages",
        "one page resume",
        "two page resume",
        "resume length by experience",
        "resume length ATS",
      ]}
      faqs={FAQS}
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          One of the most common questions job seekers ask is: "How long should my resume be?" The answer isn't one-size-fits-all, but there are clear guidelines based on your experience level, industry, and career goals. In 2026, getting resume length right is more crucial than ever for capturing attention without overwhelming recruiters. This guide breaks down exactly how many pages your resume should be — with a decision tree, industry-specific advice, and before-and-after examples.
        </p>

        {/* Table of Contents */}
        <nav className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h2 className="font-bold text-ink mb-4 text-lg">
            Table of Contents
          </h2>
          <ol className="space-y-2 text-ink/80 list-decimal list-inside">
            <li><a href="#golden-rules" className="text-accent hover:underline">The Golden Rules of Resume Length</a></li>
            <li><a href="#decision-tree" className="text-accent hover:underline">Resume Length Decision Tree</a></li>
            <li><a href="#industry-guidelines" className="text-accent hover:underline">Industry-Specific Guidelines</a></li>
            <li><a href="#when-multiple-pages" className="text-accent hover:underline">When to Use Multiple Pages</a></li>
            <li><a href="#before-after" className="text-accent hover:underline">Before &amp; After: Condensed vs. Bloated</a></li>
            <li><a href="#common-mistakes" className="text-accent hover:underline">Common Resume Length Mistakes</a></li>
            <li><a href="#ats-length" className="text-accent hover:underline">Optimizing Resume Length for ATS</a></li>
            <li><a href="#how-to-cut" className="text-accent hover:underline">How to Cut Your Resume to One Page</a></li>
            <li><a href="#career-stage" className="text-accent hover:underline">Length Guidelines by Career Stage</a></li>
            <li><a href="#faq" className="text-accent hover:underline">FAQ</a></li>
            <li><a href="#related-guides" className="text-accent hover:underline">Related Guides</a></li>
          </ol>
        </nav>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
          <h3 className="text-lg font-bold text-ink mb-2">Quick Facts</h3>
          <p className="text-ink/80">
            Recruiters spend an average of 6-8 seconds on initial resume review. Studies show that over 77% of recruiters prefer resumes that are 1-2 pages long, regardless of experience level. If you are writing your resume for the first time, start with our{' '}
            <Link to="/blog/how-to-write-a-resume-guide" className="text-accent hover:underline">
              complete resume writing guide
            </Link>{' '}
            before worrying about length.
          </p>
        </div>

        <h2 id="golden-rules" className="text-3xl font-bold text-ink mt-12 mb-6">The Golden Rules of Resume Length</h2>

        <div className="grid md:grid-cols-3 gap-6 my-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 mb-3">Entry Level (0-3 Years)</h4>
            <div className="text-accent">
              <p className="font-bold text-2xl mb-2">1 Page</p>
              <p className="text-sm">Focus on education, internships, projects, and relevant skills. Quality over quantity.</p>
            </div>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-3">Mid-Level (3-10 Years)</h4>
            <div className="text-ink/80">
              <p className="font-bold text-2xl mb-2">1-2 Pages</p>
              <p className="text-sm">Highlight career progression, achievements, and specialized skills. Add second page if needed.</p>
            </div>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-3">Senior Level (10+ Years)</h4>
            <div className="text-ink/80">
              <p className="font-bold text-2xl mb-2">2-3 Pages</p>
              <p className="text-sm">Showcase leadership, strategic impact, and comprehensive expertise across roles.</p>
            </div>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm">
          These are starting points, not hard rules. The real question is whether every line on your resume earns its space. Use{' '}
          <Link to="/blog/resume-action-verbs" className="text-accent hover:underline">
            strong action verbs
          </Link>{' '}
          and{' '}
          <Link to="/blog/quantify-resume-accomplishments" className="text-accent hover:underline">
            quantified accomplishments
          </Link>{' '}
          to say more in fewer words — that is the single best way to control resume length without sacrificing impact.
        </p>

        {/* Decision Tree */}
        <h2 id="decision-tree" className="text-3xl font-bold text-ink mt-12 mb-6">Resume Length Decision Tree</h2>
        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Not sure where you fall? Walk through this decision tree based on your years of experience and role type.
        </p>

        <div className="bg-ink text-white rounded-xl p-8 my-8">
          <h3 className="text-2xl font-bold mb-6">Start Here: How Many Years of Relevant Experience?</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</div>
              <div>
                <p className="font-bold text-lg">0-3 years of experience</p>
                <p className="text-white/80">Stick to <strong>1 page</strong>. Lead with education, projects, and internships. If you struggle to fill one page, add relevant coursework, volunteer work, or a{' '}
                  <Link to="/blog/professional-summary-examples" className="text-accent hover:underline">
                    professional summary
                  </Link>.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</div>
              <div>
                <p className="font-bold text-lg">3-7 years of experience</p>
                <p className="text-white/80">Start with <strong>1 page</strong>. Only expand to 2 if you have distinct roles with measurable achievements that don't fit. Avoid duplicating responsibilities across jobs.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">3</div>
              <div>
                <p className="font-bold text-lg">7-15 years of experience</p>
                <p className="text-white/80"><strong>1-2 pages</strong> is ideal. You likely have enough material for two pages, but trim early-career roles to 1-2 bullets each. Front-load your most recent and relevant achievements.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">4</div>
              <div>
                <p className="font-bold text-lg">15+ years or executive level</p>
                <p className="text-white/80"><strong>2-3 pages</strong>. Include board positions, speaking engagements, patents, and strategic initiatives. Still trim anything older than 15 years to a single line.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">5</div>
              <div>
                <p className="font-bold text-lg">Academic or research positions</p>
                <p className="text-white/80"><strong>No page limit</strong> — use a CV format. Length is determined by publications, grants, and academic contributions. A 5-10 page CV is normal for tenured faculty.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm">
          The key principle: every line should either demonstrate a relevant skill or quantify an achievement. If a bullet point just describes a routine duty that the job title already implies, cut it. For help identifying the right{' '}
          <Link to="/resume-keywords" className="text-accent hover:underline">
            resume keywords
          </Link>{' '}
          for your target role, use our keyword hub.
        </p>

        <h2 id="industry-guidelines" className="text-3xl font-bold text-ink mt-12 mb-6">Industry-Specific Guidelines</h2>
        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Different industries have varying expectations for resume length. Understanding these nuances can give you a competitive edge.
        </p>

        <div className="space-y-6">
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-ink mb-3">Technology &amp; Startups</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-accent font-medium mb-2">Preferred: 1-2 pages</p>
                <ul className="list-disc pl-6 space-y-1 text-stone-warm text-sm">
                  <li>Fast-paced industry values concise information</li>
                  <li>Focus on technical skills and project impact</li>
                  <li>GitHub links often more valuable than lengthy descriptions</li>
                  <li>Quantify impact: latency reduced, users served, revenue generated</li>
                </ul>
              </div>
              <div>
                <p className="text-stone-warm text-sm italic">
                  Tech recruiters prefer brief, scannable resumes that highlight coding skills and measurable project outcomes. See our{' '}
                  <Link to="/examples/software-engineer" className="text-accent hover:underline">
                    software engineer resume example
                  </Link>{' '}
                  for the ideal format.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-ink mb-3">Finance &amp; Banking</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-ink/80 font-medium mb-2">Preferred: 1-2 pages</p>
                <ul className="list-disc pl-6 space-y-1 text-stone-warm text-sm">
                  <li>Conservative industry appreciates structured format</li>
                  <li>Emphasize quantifiable achievements and certifications</li>
                  <li>Senior roles may justify 2+ pages</li>
                  <li>CFA, CPA, and Series licenses belong in a dedicated section</li>
                </ul>
              </div>
              <div>
                <p className="text-stone-warm text-sm italic">
                  Financial institutions value precision and attention to detail, reflected in well-organized, concise resumes. Use dollar amounts and percentages to show deal sizes and portfolio returns.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-ink mb-3">Healthcare &amp; Nursing</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-ink/80 font-medium mb-2">Preferred: 1-3 pages</p>
                <ul className="list-disc pl-6 space-y-1 text-stone-warm text-sm">
                  <li>Include licenses, certifications, and continuing education</li>
                  <li>Clinical experience and specializations need detailed coverage</li>
                  <li>Patient care metrics and safety records important</li>
                  <li>State-specific licensure requirements may add length</li>
                </ul>
              </div>
              <div>
                <p className="text-stone-warm text-sm italic">
                  Healthcare resumes often require additional space for credentials and specialized experience. A nurse with 5+ years and multiple certifications may legitimately need two pages.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-ink mb-3">Academia &amp; Research</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-ink/80 font-medium mb-2">Preferred: CV format (2+ pages)</p>
                <ul className="list-disc pl-6 space-y-1 text-stone-warm text-sm">
                  <li>Comprehensive publication and research lists expected</li>
                  <li>Include conferences, grants, and academic achievements</li>
                  <li>Length determined by academic contributions</li>
                  <li>Teaching experience, committee work, and peer reviews add up</li>
                </ul>
              </div>
              <div>
                <p className="text-stone-warm text-sm italic">
                  Academic positions often require CVs rather than resumes, with different length expectations. Learn the key differences in our{' '}
                  <Link to="/blog/resume-vs-cv-difference" className="text-accent hover:underline">
                    resume vs. CV guide
                  </Link>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-ink mb-3">Government &amp; Federal</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-ink/80 font-medium mb-2">Preferred: 3-5 pages (federal resume)</p>
                <ul className="list-disc pl-6 space-y-1 text-stone-warm text-sm">
                  <li>Federal resumes are intentionally longer than private-sector ones</li>
                  <li>Include GS grade, hours per week, supervisor contact info</li>
                  <li>Detailed descriptions of duties and accomplishments required</li>
                  <li>USAJOBS applications expect comprehensive documentation</li>
                </ul>
              </div>
              <div>
                <p className="text-stone-warm text-sm italic">
                  Government positions are the one context where a 4-5 page resume is not only acceptable but expected. Standard resume length advice does not apply here.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 id="when-multiple-pages" className="text-3xl font-bold text-ink mt-12 mb-6">When to Use Multiple Pages</h2>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-yellow-800 mb-3">Quality vs. Quantity Decision Matrix</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-medium text-accent mb-2">Go to Page 2 When You Have:</p>
              <ul className="list-disc pl-6 space-y-1 text-accent text-sm">
                <li>10+ years of relevant experience</li>
                <li>Multiple leadership roles with significant achievements</li>
                <li>Industry-required certifications or licenses</li>
                <li>Published work, patents, or awards</li>
                <li>Diverse skill sets across multiple specializations</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-red-700 mb-2">Stay on 1 Page When You Have:</p>
              <ul className="list-disc pl-6 space-y-1 text-red-700 text-sm">
                <li>Less than 5 years of experience</li>
                <li>Limited relevant achievements to showcase</li>
                <li>Applying to junior or entry-level positions</li>
                <li>Repetitive job duties across similar roles</li>
                <li>Industry preference for concise resumes</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm">
          A half-filled second page looks worse than a tight single page. If your second page has less than a third of content, move the strongest points to page one and cut the rest. Recruiters notice when a resume is padded — it signals that you cannot prioritize.
        </p>

        {/* Before & After */}
        <h2 id="before-after" className="text-3xl font-bold text-ink mt-12 mb-6">Before &amp; After: Condensed vs. Bloated</h2>
        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          The difference between a one-page and two-page resume often comes down to writing quality, not career length. Here is the same experience presented two ways.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-bold text-red-800 mb-3">Bloated (Pushes to Page 2)</h4>
            <div className="text-sm text-stone-warm space-y-3 font-mono">
              <p className="font-bold text-ink">Marketing Manager | Acme Corp</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Responsible for managing and overseeing the day-to-day operations of the marketing department</li>
                <li>Was in charge of creating and implementing various marketing strategies and campaigns</li>
                <li>Worked with the design team to create marketing materials including brochures, flyers, and digital content</li>
                <li>Managed social media accounts including Facebook, Instagram, Twitter, and LinkedIn</li>
                <li>Participated in weekly team meetings and provided status updates to management</li>
                <li>Helped to organize and coordinate company events and trade shows</li>
              </ul>
            </div>
            <p className="text-red-700 text-xs mt-3 font-bold">6 bullets, 80+ words. Vague duties, no results.</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 mb-3">Condensed (Fits on Page 1)</h4>
            <div className="text-sm text-stone-warm space-y-3 font-mono">
              <p className="font-bold text-ink">Marketing Manager | Acme Corp</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Led 5-person team to launch 12 campaigns that generated $2.4M in pipeline revenue</li>
                <li>Grew social media following 340% in 18 months, reducing CAC by 22%</li>
                <li>Designed lead-nurture sequence that increased MQL-to-SQL conversion from 8% to 19%</li>
              </ul>
            </div>
            <p className="text-green-700 text-xs mt-3 font-bold">3 bullets, 45 words. Specific, quantified, impactful.</p>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm">
          Notice how the condensed version actually communicates more value in half the space. The secret is replacing task descriptions with{' '}
          <Link to="/blog/quantify-resume-accomplishments" className="text-accent hover:underline">
            quantified accomplishments
          </Link>. Every bullet should answer: "What did I do, and what was the measurable result?"
        </p>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-6">
          <h4 className="font-bold text-ink mb-2">The "So What?" Test</h4>
          <p className="text-ink/80">
            Read each bullet point and ask "So what?" If the bullet does not answer that question with a number, a percentage, or a concrete outcome, rewrite it or remove it. This single habit can cut most resumes by 30-40% without losing any real information.
          </p>
        </div>

        <h2 id="common-mistakes" className="text-3xl font-bold text-ink mt-12 mb-6">Common Resume Length Mistakes</h2>

        <div className="space-y-6">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">Mistake: Padding with irrelevant information</h4>
            <p className="text-stone-warm mb-2">
              <strong>Example:</strong> Including every job duty from 15 years ago or high school achievements for senior professionals.
            </p>
            <p className="text-accent">
              <strong>Fix:</strong> Focus on the last 10-15 years and only include achievements relevant to your target role. For older positions, list company name, title, and dates — nothing more.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">Mistake: Cramming everything onto one page</h4>
            <p className="text-stone-warm mb-2">
              <strong>Example:</strong> Using 8pt font and 0.3-inch margins to fit 15 years of experience on one page.
            </p>
            <p className="text-accent">
              <strong>Fix:</strong> Use 10-12pt body font and at least 0.5-inch margins. If you need tiny text to fit, your content needs editing — not smaller type. A readable two-page resume beats an unreadable one-pager every time.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">Mistake: Ignoring ATS limitations</h4>
            <p className="text-stone-warm mb-2">
              <strong>Example:</strong> Creating a 4-page resume that gets truncated by applicant tracking systems.
            </p>
            <p className="text-accent">
              <strong>Fix:</strong> Keep critical information — your{' '}
              <Link to="/blog/professional-summary-examples" className="text-accent hover:underline">
                professional summary
              </Link>,{' '}
              <Link to="/blog/how-to-list-skills" className="text-accent hover:underline">
                skills section
              </Link>, and most recent role — on the first page. Many ATS systems give less weight to content beyond page two.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6">
            <h4 className="font-bold text-ink mb-2">Mistake: Repeating the same responsibilities across jobs</h4>
            <p className="text-stone-warm mb-2">
              <strong>Example:</strong> Listing "Managed team of X people" and "Created reports for leadership" under every role.
            </p>
            <p className="text-accent">
              <strong>Fix:</strong> For each role, highlight what was unique — the specific challenge, the distinct achievement, the new skill applied. If two jobs had identical duties, keep the details on the more recent one and summarize the earlier one.
            </p>
          </div>
        </div>

        <h2 id="ats-length" className="text-3xl font-bold text-ink mt-12 mb-6">Optimizing Resume Length for ATS</h2>
        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Applicant Tracking Systems (ATS) parse your resume before a human ever sees it. Length affects how well that parsing works. Use an{' '}
          <Link to="/templates/ats-friendly" className="text-accent hover:underline">
            ATS-friendly template
          </Link>{' '}
          to ensure your formatting does not interfere with parsing regardless of page count.
        </p>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-6">
          <h4 className="font-bold text-ink mb-3">ATS-Friendly Length Guidelines</h4>
          <ul className="list-disc pl-6 space-y-2 text-ink/80">
            <li><strong>Optimal range:</strong> 1-2 pages for best parsing results. Most modern ATS systems handle 3+ pages, but recruiter attention does not.</li>
            <li><strong>File size:</strong> Keep under 1MB to prevent upload issues</li>
            <li><strong>Front-load keywords:</strong> Put the most important{' '}
              <Link to="/resume-keywords" className="text-accent hover:underline">
                resume keywords
              </Link>{' '}
              on page 1 — many ATS dashboards show only the first page in preview mode.
            </li>
            <li><strong>Consistent formatting:</strong> Maintain the same style across all pages so the parser does not lose track of section headings</li>
            <li><strong>Page breaks:</strong> End pages at natural section breaks, not mid-bullet. An awkward break can cause parsing errors.</li>
            <li><strong>Simple structure:</strong> Headers, bullets, and standard sections. Avoid tables, text boxes, and multi-column layouts that confuse parsers.</li>
          </ul>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm">
          Bottom line: ATS does not penalize you for having two pages instead of one. What it does penalize is missing keywords. If cutting your resume to one page means removing relevant skills and accomplishments, keep the second page.
        </p>

        {/* How to Cut */}
        <h2 id="how-to-cut" className="text-3xl font-bold text-ink mt-12 mb-6">How to Cut Your Resume to One Page</h2>
        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          If you have decided one page is right for you, here is a step-by-step process to trim without losing impact.
        </p>

        <div className="space-y-4">
          {[
            {
              step: '1',
              title: 'Remove the objective statement',
              detail: 'Replace it with a 2-line professional summary — or remove it entirely if your target role is obvious from your experience.',
            },
            {
              step: '2',
              title: 'Cut roles older than 10 years',
              detail: 'If a role is from 2015 or earlier, list only company, title, and dates. No bullet points. Exception: if it is your most impressive achievement, keep one bullet.',
            },
            {
              step: '3',
              title: 'Limit bullets to 3-4 per role',
              detail: 'Pick the 3 strongest accomplishments per job. If you have 6+ bullets under one role, you are listing tasks, not achievements.',
            },
            {
              step: '4',
              title: 'Merge similar roles',
              detail: 'If you held the same title at two companies, consider combining them into a single "Selected Experience" entry with the best bullets from each.',
            },
            {
              step: '5',
              title: 'Delete "References available upon request"',
              detail: 'This is assumed. It wastes a line that could hold an actual achievement.',
            },
            {
              step: '6',
              title: 'Tighten your skills section',
              detail: 'List only skills mentioned in the job description. Remove soft skills like "team player" — they belong in your bullet points, not a skills list.',
            },
            {
              step: '7',
              title: 'Adjust formatting last',
              detail: 'Reduce margins to 0.5 inches, use 10pt body text, and switch to a single-column layout. Only after you have edited the content.',
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h4 className="font-bold text-ink">{item.title}</h4>
                <p className="text-stone-warm text-sm">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 id="career-stage" className="text-3xl font-bold text-ink mt-12 mb-6">Length Guidelines by Career Stage</h2>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-6 py-4 text-left font-bold text-ink">Career Stage</th>
                <th className="px-6 py-4 text-left font-bold text-ink">Pages</th>
                <th className="px-6 py-4 text-left font-bold text-ink">Key Focus</th>
                <th className="px-6 py-4 text-left font-bold text-ink">What to Cut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Recent Graduate (0-2 yrs)</td>
                <td className="px-6 py-4 text-ink">1</td>
                <td className="px-6 py-4 text-ink">Education, internships, projects, relevant coursework</td>
                <td className="px-6 py-4 text-stone-warm">High school info, unrelated part-time jobs</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Early Career (2-5 yrs)</td>
                <td className="px-6 py-4 text-ink">1</td>
                <td className="px-6 py-4 text-ink">First 1-2 professional roles, key achievements, skills</td>
                <td className="px-6 py-4 text-stone-warm">College GPA (unless 3.5+), freshman-year clubs</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Mid-Career (5-10 yrs)</td>
                <td className="px-6 py-4 text-ink">1-2</td>
                <td className="px-6 py-4 text-ink">Career progression, leadership, specialized skills</td>
                <td className="px-6 py-4 text-stone-warm">Entry-level duties, basic skills (MS Office)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Senior (10-15 yrs)</td>
                <td className="px-6 py-4 text-ink">2</td>
                <td className="px-6 py-4 text-ink">Strategic impact, team/budget size, cross-functional work</td>
                <td className="px-6 py-4 text-stone-warm">Roles 3+ levels below current, routine tasks</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Executive (15+ yrs)</td>
                <td className="px-6 py-4 text-ink">2-3</td>
                <td className="px-6 py-4 text-ink">P&L ownership, board work, transformation initiatives</td>
                <td className="px-6 py-4 text-stone-warm">Individual contributor details, early career</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Career Changer</td>
                <td className="px-6 py-4 text-ink">1-2</td>
                <td className="px-6 py-4 text-ink">Transferable skills, certifications, relevant projects</td>
                <td className="px-6 py-4 text-stone-warm">Irrelevant prior-industry jargon, outdated tools</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-8">
          <h4 className="font-bold text-yellow-800 mb-3">Pro Tip</h4>
          <p className="text-yellow-700">
            Create multiple versions of your resume: a concise one-page version for quick applications and a comprehensive two-page version for strategic opportunities. Tailor length to the specific role and company culture. Our{' '}
            <Link to="/free-resume-builder-no-sign-up" className="text-accent hover:underline">
              free resume builder
            </Link>{' '}
            lets you create both versions in minutes with no sign-up required.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">The Future of Resume Length</h2>
        <p className="text-lg leading-relaxed text-stone-warm">
          As recruitment becomes increasingly digital, resume length preferences continue evolving. Video introductions, portfolio links, and LinkedIn profiles are becoming complementary tools that reduce pressure on resume length while providing richer candidate information. AI-powered screening is also changing the equation — systems can process longer documents faster, but human reviewers still prefer concise resumes.
        </p>

        <p className="text-lg leading-relaxed text-stone-warm mt-6">
          The key is matching your resume length to your story's complexity while respecting industry norms and recruiter preferences. Quality content that demonstrates value will always trump arbitrary length requirements.
        </p>

        {/* FAQ */}
        <h2 id="faq" className="text-3xl font-bold text-ink mt-12 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: 'How long should a resume be for an entry-level job?',
              a: 'One page. With 0-3 years of experience, you should have no trouble fitting everything on a single page. Focus on education, internships, academic projects, and relevant skills. If you are struggling to fill the page, add a professional summary, relevant coursework, or volunteer experience — but do not pad with irrelevant content.',
            },
            {
              q: 'Is a 3-page resume ever acceptable?',
              a: 'Yes, in specific situations: executives with 15+ years of progressive leadership, healthcare professionals with extensive certifications, academics using a CV format, and federal government applicants where 3-5 pages is standard. For most private-sector jobs, 2 pages is the practical maximum.',
            },
            {
              q: 'Does resume length affect ATS screening?',
              a: 'Not directly. Modern ATS systems can parse resumes of any length. However, resume length indirectly affects ATS success because a longer resume may dilute your keyword density. A focused one-page resume with the right keywords can score higher than a scattered three-page one. The most important factor is having relevant keywords on page one.',
            },
            {
              q: 'Should I include all of my work history on my resume?',
              a: 'No. Include relevant roles from the last 10-15 years. For older positions, list only the company name, your title, and dates. Recruiters care most about your recent experience and career trajectory. The exception is if an early role is directly relevant to the job you are applying for — in that case, keep the highlights.',
            },
            {
              q: 'How do I cut my resume from two pages to one page?',
              a: 'Start by removing objective statements, references lines, and roles older than 10 years. Limit each remaining position to 3-4 achievement-focused bullets. Replace paragraph descriptions with concise bullet points. Merge overlapping skills. Only after editing content should you reduce margins and font size — formatting changes are a last resort.',
            },
            {
              q: 'Is it better to have a resume that is too short or too long?',
              a: 'Too short is generally less risky than too long. A concise resume signals that you can prioritize and communicate efficiently. A bloated resume signals the opposite. That said, a resume that is too short for your experience level (like a senior engineer with one page listing only job titles) raises red flags about missing information.',
            },
            {
              q: 'Do hiring managers actually read page two?',
              a: 'Most do — if page one is strong enough to justify continuing. Studies show that recruiters spend an average of 7.4 seconds on initial screening. If your first page is compelling, about 60% of recruiters will look at the second page. The takeaway: front-load your strongest content and make page one self-sufficient.',
            },
            {
              q: 'How long should a resume be for a career change?',
              a: 'One to two pages. A career change resume should emphasize transferable skills, relevant certifications, and achievements that apply to the new field. De-emphasize industry-specific experience from your previous career. A well-structured hybrid format lets you lead with skills rather than chronological history.',
            },
          ].map((faq, i) => (
            <div key={i} className="bg-chalk-dark rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">{faq.q}</h3>
              <p className="text-stone-warm">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Related Guides */}
        <div id="related-guides" className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 mt-12">
          <h3 className="font-bold text-ink mb-3">Related Guides</h3>
          <ul className="space-y-2 text-ink/80">
            <li>
              <Link to="/blog/how-to-write-a-resume-guide" className="text-accent hover:underline">
                How to Write a Resume: The Complete Step-by-Step Guide
              </Link>{' '}
              &mdash; our pillar guide covering every section from start to finish
            </li>
            <li>
              <Link to="/blog/resume-action-verbs" className="text-accent hover:underline">
                200+ Resume Action Verbs That Get Results
              </Link>{' '}
              &mdash; replace weak verbs to say more in fewer words
            </li>
            <li>
              <Link to="/blog/how-to-list-skills" className="text-accent hover:underline">
                How to List Skills on a Resume
              </Link>{' '}
              &mdash; choose and format the right skills for your target role
            </li>
            <li>
              <Link to="/blog/quantify-resume-accomplishments" className="text-accent hover:underline">
                How to Quantify Resume Accomplishments
              </Link>{' '}
              &mdash; turn vague duties into compelling, numbers-driven bullets
            </li>
            <li>
              <Link to="/blog/professional-summary-examples" className="text-accent hover:underline">
                Professional Summary Examples for Every Career Level
              </Link>{' '}
              &mdash; write a strong summary that fits in 2-3 lines
            </li>
          </ul>
        </div>

      </div>
    </BlogLayout>
  );
}
