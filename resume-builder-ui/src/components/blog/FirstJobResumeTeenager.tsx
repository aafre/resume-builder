import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";

const FAQS = [
  {
    question: "What counts as experience on a teenager's first resume?",
    answer:
      "Babysitting, yard work, tutoring younger kids, volunteering, school clubs, sports team leadership roles, and any recurring chore or task you did for someone outside your immediate family all count. List each one with a rough timeframe and 1-2 bullet points describing what you actually did — treat it the same way you'd list a part-time job.",
  },
  {
    question: "Do I need working papers to apply for a job as a teenager?",
    answer:
      "In many US states, minors under 18 (often under 16) need a work permit or 'working papers' before an employer can legally hire them — rules vary by state and by the employer's industry. Check your state's Department of Labor website for the exact age and hour restrictions before you apply, and mention on the resume or in the application that you can provide working papers if required.",
  },
  {
    question: "Should a 15 or 16-year-old's resume look different from a college student's?",
    answer:
      "Yes, mainly in what it leans on. A college student's resume can point to coursework, internships, and campus organizations. A 15-17 year-old's resume leans harder on babysitting, chores, volunteering, and school activities, since there's usually less to draw from — but the structure (summary, skills, experience, education) stays the same.",
  },
  {
    question: "How long should a teenager's first resume be?",
    answer:
      "One page, and it doesn't need to be full. A half-page resume with 3-4 well-described activities reads better than a padded page trying to stretch thin content. Employers hiring teens for entry-level roles expect a short resume — the goal is showing reliability, not a long history.",
  },
  {
    question: "What do first-time employers actually look for on a teen's resume?",
    answer:
      "Availability (can you work the shifts they need), reliability (did you show up consistently for whatever you've done before), and basic professionalism (a clean, readable resume with no typos). Retail and food service managers hiring teens are usually not evaluating your resume for polish — they're checking whether you can commit to a schedule and communicate clearly.",
  },
  {
    question: "Should I list my age or grade on my resume?",
    answer:
      "It's optional and not required. Your school and expected graduation year in the Education section already signals your age range. If a job posting specifically requires a minimum age, the application form will usually ask directly rather than relying on your resume.",
  },
];

export default function FirstJobResumeTeenager() {
  return (
    <BlogLayout
      title="First Job Resume for Teenagers: What to Put When You've Never Worked (2026)"
      description="A resume guide for 15-18 year olds applying for their first job. What counts as experience, working papers and age rules, what employers actually screen for, and a before/after example."
      publishDate="2026-09-23"
      lastUpdated="2026-09-23"
      readTime="8 min"
      keywords={[
        "first job resume for teenager",
        "resume for 16 year old first job",
        "teenager resume no experience",
        "how to write a resume as a teenager",
        "working papers resume",
        "first resume high school",
      ]}
      ctaType="resume"
      faqs={FAQS}
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-ink/60 font-medium">
          A first-job resume for a teenager works when it treats babysitting, chores,
          volunteering, and school activities as real experience — not filler around
          an empty work-history section. Add your state's working papers if you're
          under the legal working age without them, keep it to one page, and lead
          with what you're reliably available to do.
        </p>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
          <h2 className="font-bold text-ink mb-4 text-lg">On this page</h2>
          <ol className="space-y-2 text-ink/80 list-decimal list-inside">
            <li><a href="#counts-as-experience" className="text-accent-text hover:underline">What counts as experience at 15-18</a></li>
            <li><a href="#working-papers" className="text-accent-text hover:underline">Working papers and age constraints</a></li>
            <li><a href="#what-employers-read-for" className="text-accent-text hover:underline">What a first employer actually reads for</a></li>
            <li><a href="#before-after" className="text-accent-text hover:underline">Before / after: a worked example</a></li>
            <li><a href="#structure" className="text-accent-text hover:underline">How to structure the resume</a></li>
            <li><a href="#faq" className="text-accent-text hover:underline">Frequently asked questions</a></li>
          </ol>
        </div>

        <h2 id="counts-as-experience" className="text-3xl font-bold text-ink mt-12 mb-6">
          What Counts as Experience at 15-18
        </h2>
        <p className="text-lg leading-relaxed text-ink/60">
          At this age almost nobody has a traditional paid job history, and employers
          hiring teenagers know that. What they're actually checking is whether you
          show up, follow through, and can describe what you did in plain terms. That
          means the following all belong in your experience section, listed the same
          way you'd list a part-time job — with a title, a rough timeframe, and 1-2
          bullet points:
        </p>
        <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm my-6">
          <ul className="list-disc pl-6 space-y-3 text-ink/80">
            <li><strong>Babysitting or pet sitting</strong> — name the recurring nature of it ("weekly, for 2 families") rather than "sometimes."</li>
            <li><strong>Yard work, snow shoveling, or odd jobs</strong> — especially if you did it for multiple households or had repeat customers.</li>
            <li><strong>Tutoring or helping younger kids with schoolwork</strong> — even informal, unpaid tutoring for a neighbor or sibling's friend.</li>
            <li><strong>Volunteering</strong> — a food drive, animal shelter, place of worship, or community cleanup.</li>
            <li><strong>School clubs, teams, or student government</strong> — especially any role with a title (team captain, club treasurer, event committee).</li>
            <li><strong>Chores with real scope</strong> — managing the family garden, cooking dinner for the household several nights a week, or similar recurring responsibility.</li>
          </ul>
        </div>
        <p className="text-lg leading-relaxed text-ink/60">
          For the general version of this approach — useful past age 18 too, for
          anyone with zero paid work history regardless of age — see our{" "}
          <Link to="/examples/no-experience" className="text-accent-text hover:underline font-medium">
            no-experience resume example
          </Link>.
        </p>

        <h2 id="working-papers" className="text-3xl font-bold text-ink mt-12 mb-6">
          Working Papers and Age Constraints
        </h2>
        <p className="text-lg leading-relaxed text-ink/60">
          In many US states, minors need a work permit — often called "working papers"
          — before an employer can legally put them on the schedule. The exact age
          this kicks in, which industries are exempt, and how many hours you can work
          on a school night all vary by state. Some states require the permit only
          under 16; others require it up to 18. This is not something a resume can
          settle for you — it's determined by your state's labor department and
          sometimes your school.
        </p>
        <div className="rounded-lg callout callout-dont/70 callout-dont/80 p-6 my-6">
          <h3 className="font-bold text-ink mb-2">Check before you apply, not after you're hired</h3>
          <p className="text-ink/60">
            Search "[your state] minor work permit" on your state's official
            Department of Labor site to confirm the age threshold, hour limits, and
            how to get the permit (often through your school). Getting this sorted
            before you apply means you're ready to start immediately once an employer
            says yes — a real advantage over another applicant who has to go get
            paperwork first.
          </p>
        </div>
        <p className="text-lg leading-relaxed text-ink/60">
          You don't need to put your permit status on the resume itself. If it comes
          up in the application or interview, simply confirm you have (or can quickly
          get) any required working papers for your state.
        </p>

        <h2 id="what-employers-read-for" className="text-3xl font-bold text-ink mt-12 mb-6">
          What a First Employer Actually Reads For
        </h2>
        <p className="text-lg leading-relaxed text-ink/60 mb-6">
          Managers hiring teenagers for entry-level retail, food service, or seasonal
          roles are not scoring your resume against a college graduate's. They're
          scanning for three things, in this order:
        </p>
        <div className="space-y-6">
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-2">1. Availability</h3>
            <p className="text-ink/60">
              Can you work the shifts they're short on — weekends, after school,
              school breaks? If your target job posting mentions specific shift needs
              and you can meet them, say so directly in your summary or cover letter.
            </p>
          </div>
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-2">2. Reliability, shown through anything recurring</h3>
            <p className="text-ink/60">
              A babysitting gig you kept for a year, a volunteer shift you never
              missed, a club role you held for two semesters — recurring commitments
              are the closest thing you have to a reference for "shows up on time."
              Lead with whichever activity you did the longest.
            </p>
          </div>
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-2">3. Basic professionalism</h3>
            <p className="text-ink/60">
              A clean, one-page resume with no typos and a readable layout signals
              you took the application seriously. That's a low bar to clear, but it's
              one a surprising number of applicants miss — so clearing it puts you
              ahead.
            </p>
          </div>
        </div>

        <h2 id="before-after" className="text-3xl font-bold text-ink mt-12 mb-6">
          Before / After: A Worked Example
        </h2>
        <p className="text-lg leading-relaxed text-ink/60 mb-4">
          The fix is almost always the same: name the recurring nature of the
          activity and give it a number, instead of describing it as a one-off favor.
        </p>
        <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h3 className="font-bold text-ink mb-3">Babysitting</h3>
          <p className="text-ink/60 mb-2"><strong>Before:</strong> "I babysit sometimes for people in my neighborhood."</p>
          <p className="text-ink/60"><strong>After:</strong> "Babysitting — Provided regular after-school and weekend childcare for [number] families over [X months/years], including meal prep and homework help for children ages [X-X]."</p>
        </div>
        <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h3 className="font-bold text-ink mb-3">Yard work</h3>
          <p className="text-ink/60 mb-2"><strong>Before:</strong> "Mowed some lawns over the summer."</p>
          <p className="text-ink/60"><strong>After:</strong> "Lawn Care — Maintained weekly lawn mowing and yard cleanup for [number] repeat customers each summer, managing my own scheduling and collecting payment directly."</p>
        </div>
        <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h3 className="font-bold text-ink mb-3">School club</h3>
          <p className="text-ink/60 mb-2"><strong>Before:</strong> "Member of the yearbook club."</p>
          <p className="text-ink/60"><strong>After:</strong> "Yearbook Club, Layout Committee — Designed [number] spread layouts per issue and coordinated photo submissions with [number] classmates ahead of each deadline."</p>
        </div>
        <p className="text-lg leading-relaxed text-ink/60">
          The bracketed numbers are placeholders — fill in your real counts. Don't
          invent a figure you can't stand behind if asked about it in an interview; a
          reasonable estimate from memory ("about 3 families" or "roughly every
          weekend for a summer") is fine and expected at this stage.
        </p>

        <h2 id="structure" className="text-3xl font-bold text-ink mt-12 mb-6">
          How to Structure the Resume
        </h2>
        <div className="callout callout-do rounded-xl p-6 my-6">
          <h3 className="font-bold tone-do mb-3">One-page layout that works for a first resume</h3>
          <ul className="list-disc pl-6 space-y-3 tone-do">
            <li><strong>Contact info</strong> — name, phone, email, city/state (no full street address needed).</li>
            <li><strong>Short summary</strong> — 2 lines: your school year, your availability, and one strength (reliable, good with kids, fast learner).</li>
            <li><strong>Skills</strong> — a short list: customer service, communication, time management, whatever tools you're comfortable with (POS systems, basic Excel, social media).</li>
            <li><strong>Experience</strong> — babysitting, yard work, tutoring, volunteering, club roles — each with a title, timeframe, and 1-2 bullets.</li>
            <li><strong>Education</strong> — your school, expected graduation year, and any honors or relevant coursework.</li>
          </ul>
        </div>
        <p className="text-lg leading-relaxed text-ink/60">
          Once you've built the structure, start from a clean layout rather than a
          blank page — our{" "}
          <Link to="/free-resume-builder-for-students" className="text-accent-text hover:underline font-medium">
            free resume builder for students
          </Link>{" "}
          gives you an ATS-friendly one-page template you can fill in directly.
        </p>

        <div className="callout callout-do rounded-xl p-6 my-8">
          <h3 className="font-bold tone-do mb-2">See a full first resume, filled in</h3>
          <p className="tone-do">
            For a complete, filled-out example built the same way — real section
            structure, sample bullets, and a copy-paste bullet bank — see our{" "}
            <Link to="/examples/no-experience" className="text-accent-text hover:underline font-medium">
              no-experience resume example
            </Link>. It's written for any age, so use it alongside the teen-specific
            guidance above.
          </p>
        </div>

        <h2 id="faq" className="text-3xl font-bold text-ink mt-12 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 my-6">
          {FAQS.map((faq) => (
            <div key={faq.question} className="bg-chalk-dark border border-black/[0.06] rounded-lg p-5">
              <h3 className="font-bold text-ink mb-2">{faq.question}</h3>
              <p className="text-ink/60">{faq.answer}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">The Bottom Line</h2>
        <p className="text-lg leading-relaxed text-ink/60">
          Your first resume doesn't need a work history to be good — it needs to show
          you're available, reliable, and take the process seriously. Name the
          recurring babysitting gig, the yard work customers, the club role, the
          volunteer shift, with real timeframes and rough numbers. Check your state's
          working papers requirement before you apply. Keep it to one page. That's
          enough to get a first "yes."
        </p>
      </div>
    </BlogLayout>
  );
}
