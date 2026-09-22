import BlogLayout from '../BlogLayout';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface Program {
  company: string;
  name: string;
  region: string;
  duration: string;
  locations: string;
  eligibility: string;
  url: string;
  verifiedOn: string;
  applicationStatus: 'open' | 'closed' | 'unknown';
  statusNote: string;
  description: string;
}

// Every row below was checked against the company's own program page (not a third-party
// listicle) on the verifiedOn date. A live link does not mean applications are open — if the
// official page did not state a window, applicationStatus is "unknown", not "open".
const PROGRAMS: Program[] = [
  {
    company: 'JPMorgan Chase',
    name: 'ReEntry Program',
    region: 'USA / EMEA / APAC',
    duration: '15 weeks (April–July)',
    locations: 'Atlanta, Boston, Brooklyn, Charlotte, Chicago, Columbus, Dallas, Houston, Jersey City, New York, Newark, Palo Alto, Plano, Tampa, Tempe, Wilmington, Buenos Aires, Bournemouth, Dublin, Edinburgh, Frankfurt, Geneva, Glasgow, London, Paris, Warsaw, Bengaluru, Hyderabad, Mumbai, Pune',
    eligibility: 'Extended career break of 2+ years; was at Associate/VP level or equivalent when you left the workforce',
    url: 'https://www.jpmorganchase.com/careers/explore-opportunities/programs/reentry-program',
    verifiedOn: '2026-09-22',
    applicationStatus: 'closed',
    statusNote: 'The 2026 cohort has already run. The official page states the 2027 application window runs November 16, 2026 – February 28, 2027.',
    description: 'One of the longest-running and widest-reaching returnship programs, spanning North America, Europe, Asia Pacific, and South America in one intake.',
  },
  {
    company: 'Goldman Sachs',
    name: 'Returnship',
    region: 'USA / EMEA',
    duration: '12 weeks',
    locations: 'Albany, Chicago, Dallas, Jersey City, New York, Richardson, Salt Lake City, West Palm Beach, Wilmington, Birmingham, Frankfurt, London, Paris, Warsaw',
    eligibility: 'Open to professionals who have taken a career break; the official page does not publish a minimum break length',
    url: 'https://www.goldmansachs.com/careers/programs-for-professionals/returnship',
    verifiedOn: '2026-09-22',
    applicationStatus: 'unknown',
    statusNote: 'The page lists program start dates (Americas: January–March 2027; EMEA: Fall 2026) but does not state when applications open or close.',
    description: 'The program that coined the term "returnship." Paid, on-the-job learning across a range of divisions with dedicated mentorship.',
  },
  {
    company: 'Microsoft',
    name: 'LEAP Engineering Program',
    region: 'USA',
    duration: '16 weeks',
    locations: 'United States (multiple Microsoft engineering sites)',
    eligibility: 'Broad professional experience and foundational technical training; explicitly open to non-traditional backgrounds, not restricted to career-break returners specifically',
    url: 'https://leap.microsoft.com/',
    verifiedOn: '2026-09-22',
    applicationStatus: 'unknown',
    statusNote: 'No application window or deadline is published on the official page.',
    description: 'Classroom instruction plus hands-on engineering work on real Microsoft products. A common landing spot for career changers and returners entering software engineering.',
  },
  {
    company: 'Deloitte',
    name: 'Return to Work Programme (UK)',
    region: 'UK',
    duration: 'No fixed length — roles are typically permanent from day one',
    locations: 'United Kingdom',
    eligibility: 'Extended career break of 2+ years, for any reason',
    url: 'https://www.deloitte.com/uk/en/careers/professional-careers/experienced-careers-programmes-networks.html',
    verifiedOn: '2026-09-22',
    applicationStatus: 'open',
    statusNote: 'The official page states Deloitte UK moved away from a single annual intake and now runs roughly two start dates per month, so the program is effectively always accepting applications.',
    description: 'Structured onboarding, a returner buddy, and technical refresher training, with rolling entry rather than one cohort a year.',
  },
  {
    company: 'Daphne Jackson Trust',
    name: 'Daphne Jackson Fellowship',
    region: 'UK / Republic of Ireland',
    duration: '2–3 years, part-time research fellowship',
    locations: 'UK and Republic of Ireland universities and research institutes',
    eligibility: 'Career break of 2+ years for family, caring, or health reasons; for returning to a research career specifically',
    url: 'https://daphnejackson.org/',
    verifiedOn: '2026-09-22',
    applicationStatus: 'unknown',
    statusNote: 'No published application deadline; the site directs candidates to a fellowship-finder tool rather than a fixed window.',
    description: 'A longer, research-specific fellowship for STEM and other academic researchers rebuilding a career after a break — not a corporate returnship, but the most established UK returner scheme in this space.',
  },
  {
    company: 'Goldman Sachs',
    name: 'India Returnship',
    region: 'India',
    duration: '12 weeks',
    locations: 'Bengaluru, Hyderabad',
    eligibility: 'Open to professionals who have taken a career break; specific minimum length not published',
    url: 'https://www.goldmansachs.com/worldwide/india/careers/india-returnship',
    verifiedOn: '2026-09-22',
    applicationStatus: 'unknown',
    statusNote: 'No application window published on the official page.',
    description: 'The India edition of the Goldman Sachs Returnship, running since 2013 with the same paid, 12-week structure as the Americas/EMEA program.',
  },
  {
    company: 'Salesforce',
    name: 'India Return to Work Program',
    region: 'India',
    duration: '6 months, with potential conversion to full-time',
    locations: 'India',
    eligibility: 'Career break of 1+ years; the page says it "typically" welcomes 1+ year breaks and is open to men and women, with an emphasis on women and working mothers',
    url: 'https://www.salesforce.com/company/careers/talent-programs/india-return-work/',
    verifiedOn: '2026-09-22',
    applicationStatus: 'unknown',
    statusNote: 'The page invites candidates to "apply today" or join a talent community, with no published intake dates.',
    description: 'On-the-job training across sales, technology, product, and customer success, with a six-month runway before a full-time decision.',
  },
  {
    company: 'Wells Fargo',
    name: 'Glide — Relaunch India',
    region: 'India',
    duration: 'Not published',
    locations: 'India',
    eligibility: 'Women with 5+ years of experience and a career break of 12+ months',
    url: 'https://www.wellsfargojobs.com/en/inclusion/return-to-work-programs/glide-program-india/',
    verifiedOn: '2026-09-22',
    applicationStatus: 'unknown',
    statusNote: 'No published intake window; the page directs candidates to join a talent community for updates.',
    description: 'Mentorship, tool/technology upskilling, and structured re-entry support for women rebuilding a career in India.',
  },
  {
    company: 'Amazon',
    name: 'rekindle',
    region: 'India',
    duration: 'Not published',
    locations: 'India',
    eligibility: 'Women with a career break of 12+ months',
    url: 'https://www.amazon.jobs/content/en/career-programs/rekindle',
    verifiedOn: '2026-09-22',
    applicationStatus: 'unknown',
    statusNote: 'No published intake window on the official page.',
    description: 'A structured return-to-work track for women, with onboarding, training, and real-time work assignments before a full-time decision.',
  },
];

const USA_PROGRAMS = PROGRAMS.filter((p) => p.region.includes('USA'));
const UK_PROGRAMS = PROGRAMS.filter((p) => p.region.includes('UK'));
const INDIA_PROGRAMS = PROGRAMS.filter((p) => p.region === 'India');
const WOMEN_PROGRAMS = PROGRAMS.filter((p) => p.eligibility.toLowerCase().includes('women'));

const STATUS_STYLES: Record<Program['applicationStatus'], string> = {
  open: 'callout-do tone-do',
  closed: 'callout-dont tone-dont',
  unknown: 'callout-note tone-note',
};

function ProgramCard({ program }: { program: Program }) {
  return (
    <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="text-xl font-bold text-ink">{program.company}</h3>
          <p className="text-accent-text font-medium text-sm">{program.name}</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold callout ${STATUS_STYLES[program.applicationStatus]}`}>
            {program.applicationStatus === 'open' ? 'Applications open' : program.applicationStatus === 'closed' ? 'Applications closed' : 'Window unknown'}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {program.duration}
          </span>
        </div>
      </div>
      <p className="text-ink/60 text-sm mb-3">{program.description}</p>
      <div className="grid sm:grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="font-medium text-ink">Eligibility:</span>{' '}
          <span className="text-ink/60">{program.eligibility}</span>
        </div>
        <div>
          <span className="font-medium text-ink">Locations:</span>{' '}
          <span className="text-ink/60">{program.locations}</span>
        </div>
      </div>
      <p className="text-ink/60 text-xs italic mb-3">{program.statusNote}</p>
      <div className="flex items-center gap-4 text-xs text-ink/60">
        <a
          href={program.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-text hover:underline font-medium text-sm"
        >
          View official program page &rarr;
        </a>
        <span>Verified {program.verifiedOn}</span>
      </div>
    </div>
  );
}

export default function ReturnToWorkPrograms() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Return to Work and Returnship Programs',
    itemListElement: PROGRAMS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${p.company} — ${p.name}`,
      url: p.url,
    })),
  };

  return (
    <BlogLayout
      title="Return to Work Programs: Verified Returnships in the US, UK, and India (2026)"
      description="A maintained, verified list of return-to-work programs and returnships at JPMorgan Chase, Goldman Sachs, Microsoft, Deloitte, and more — official links, eligibility, and application status, checked directly against each company's own program page."
      publishDate="2026-03-05"
      lastUpdated="2026-09-22"
      readTime="13 min"
      keywords={[
        'return to work programs',
        'returnship programs',
        'return to work after career break',
        'career returner programs 2026',
        'returnship program 2026',
        'returnship programs uk',
        'returnship programs india',
        'women returnship program',
      ]}
      ctaType="resume"
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-ink/60 font-medium">
          A returnship is a paid, structured, time-bound program that lets an experienced
          professional re-enter the workforce after a career break, usually with mentorship and a
          path to a permanent offer at the end.
        </p>

        <p className="text-lg leading-relaxed text-ink/60">
          Most "top returnship programs" lists online are years out of date, and companies quietly
          retire or rename programs. Every row in the table below links to the company's own
          program page and was checked on the date shown. Where the official page does not state
          an application window, we say so instead of guessing.
        </p>

        {/* Table of Contents */}
        <nav className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h2 className="font-bold text-ink mb-4 text-lg">Table of Contents</h2>
          <ol className="space-y-2 text-ink/80 list-decimal list-inside">
            <li><a href="#what-is-returnship" className="text-accent-text hover:underline">What Is a Returnship?</a></li>
            <li><a href="#usa" className="text-accent-text hover:underline">USA Programs</a></li>
            <li><a href="#uk" className="text-accent-text hover:underline">UK Programs</a></li>
            <li><a href="#india" className="text-accent-text hover:underline">India Programs</a></li>
            <li><a href="#women" className="text-accent-text hover:underline">Programs for Women Returners</a></li>
            <li><a href="#resume-tips" className="text-accent-text hover:underline">How to Write a Return-to-Work Resume</a></li>
            <li><a href="#application-tips" className="text-accent-text hover:underline">Application Tips</a></li>
            <li><a href="#faq" className="text-accent-text hover:underline">FAQ</a></li>
          </ol>
        </nav>

        {/* What Is a Returnship */}
        <h2 id="what-is-returnship" className="text-3xl font-bold text-ink mt-12 mb-6">
          What Is a Returnship?
        </h2>

        <p className="text-lg leading-relaxed text-ink/60">
          A returnship is a professional internship for experienced workers returning after a career
          break. Think of it as an on-ramp back to corporate life. Unlike entry-level internships,
          returnships are designed for mid-career and senior professionals who took time off for
          caregiving, health, relocation, education, or other life events.
        </p>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 mt-6">
          <h3 className="font-bold text-ink mb-3">Key Features of Returnship Programs</h3>
          <ul className="space-y-2 text-ink/80">
            <li><strong>Usually paid:</strong> Every program verified below is paid or explicitly compensated</li>
            <li><strong>Time-bound:</strong> Most run 12&ndash;16 weeks, some (like Deloitte UK) skip a fixed cohort entirely</li>
            <li><strong>Structured:</strong> Include mentorship, onboarding, training, and regular check-ins</li>
            <li><strong>Gap-friendly:</strong> Designed specifically for people with career breaks &mdash; a gap is the entry requirement, not a disqualifier</li>
          </ul>
        </div>

        <div className="callout callout-note rounded-xl p-6 mt-4">
          <h3 className="text-xl font-bold tone-note mb-3">A Live Link Is Not an Open Application</h3>
          <p className="tone-note">
            A company's returnship page can be live and current while its application window is
            closed for the year, or simply undisclosed until the company decides to open it. Check
            the <strong>Application Status</strong> badge on each card below, and always confirm on
            the official page before you plan around a date.
          </p>
        </div>

        {/* USA */}
        <h2 id="usa" className="text-3xl font-bold text-ink mt-12 mb-6">
          USA Programs
        </h2>
        <div className="space-y-6">
          {USA_PROGRAMS.map((p) => <ProgramCard key={`${p.company}-${p.name}`} program={p} />)}
        </div>

        {/* UK */}
        <h2 id="uk" className="text-3xl font-bold text-ink mt-12 mb-6">
          UK Programs
        </h2>
        <div className="space-y-6">
          {UK_PROGRAMS.map((p) => <ProgramCard key={`${p.company}-${p.name}`} program={p} />)}
        </div>

        {/* India */}
        <h2 id="india" className="text-3xl font-bold text-ink mt-12 mb-6">
          India Programs
        </h2>
        <p className="text-lg leading-relaxed text-ink/60 mb-6">
          JPMorgan Chase's ReEntry Program (see USA section above) also hires in Bengaluru,
          Hyderabad, Mumbai, and Pune as part of the same global intake.
        </p>
        <div className="space-y-6">
          {INDIA_PROGRAMS.map((p) => <ProgramCard key={`${p.company}-${p.name}`} program={p} />)}
        </div>

        {/* Women */}
        <h2 id="women" className="text-3xl font-bold text-ink mt-12 mb-6">
          Programs for Women Returners
        </h2>
        <p className="text-lg leading-relaxed text-ink/60 mb-6">
          These programs explicitly target women rebuilding a career after a break. Several
          general programs above (JPMorgan, Goldman Sachs, Deloitte, Daphne Jackson) are open to
          any gender but are commonly used by women returners too.
        </p>
        <div className="space-y-6">
          {WOMEN_PROGRAMS.map((p) => <ProgramCard key={`${p.company}-${p.name}`} program={p} />)}
        </div>

        {/* Resume Tips */}
        <h2 id="resume-tips" className="text-3xl font-bold text-ink mt-12 mb-6">
          How to Write a Return-to-Work Resume
        </h2>

        <p className="text-lg leading-relaxed text-ink/60 mb-6">
          Returnship applications are different from standard job applications. The hiring team
          already expects a career gap &mdash; your resume should focus on demonstrating that your
          skills are current and you are ready to contribute.
        </p>

        <div className="space-y-4">
          {[
            {
              num: 1,
              title: 'Lead with a forward-looking summary',
              desc: 'Open with your professional identity and what you bring — not with the gap. "Senior software engineer with 8 years of experience in distributed systems, returning after a 3-year caregiving pause with updated skills in cloud architecture and Kubernetes." For examples, see our professional summary guide.',
            },
            {
              num: 2,
              title: 'Address the gap in one line',
              desc: 'Add a brief entry like "Career Break — Family Caregiving (2022-2025)" between your roles. List 1-2 activities that kept you connected: courses, certifications, volunteer work, freelance projects.',
            },
            {
              num: 3,
              title: 'Highlight recent upskilling',
              desc: 'If you took courses, earned certifications, or built projects during your break, feature these prominently. A "Recent Certifications" section near the top of your resume signals that your skills are current.',
            },
            {
              num: 4,
              title: 'Rewrite old experience for relevance',
              desc: 'Your pre-break experience is still valuable, but the language may need updating. Replace outdated tool names with current equivalents, and emphasize achievements that transfer to the target role.',
            },
            {
              num: 5,
              title: 'Use the hybrid format',
              desc: 'Lead with a skills or core competencies section, then list experience chronologically. This puts your qualifications first and the timeline second.',
            },
            {
              num: 6,
              title: 'Tailor to each program',
              desc: 'Each returnship has different focus areas. A JPMorgan ReEntry application should emphasize financial services experience; a Deloitte UK application should highlight client-facing and advisory skills.',
            },
          ].map((step) => (
            <div key={step.num} className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step.num}
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">{step.title}</h3>
                <p className="text-ink/60">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 mt-6">
          <h3 className="font-bold text-ink mb-3">Related Guides</h3>
          <ul className="space-y-2 text-ink/80">
            <li>
              <Link to="/blog/resume-employment-gaps" className="text-accent-text hover:underline">
                How to Explain Employment Gaps on Your Resume
              </Link>{' '}
              &mdash; detailed strategies for every type of gap
            </li>
            <li>
              <Link to="/blog/resume-after-career-break" className="text-accent-text hover:underline">
                How to Write a Resume After a Career Break
              </Link>{' '}
              &mdash; format choice, framing a multi-year gap, and returnship-specific application tips
            </li>
            <li>
              <Link to="/blog/career-change-resume-guide" className="text-accent-text hover:underline">
                Career Change Resume Guide
              </Link>{' '}
              &mdash; if you are returning to a different field
            </li>
            <li>
              <Link to="/blog/professional-summary-examples" className="text-accent-text hover:underline">
                Professional Summary Examples
              </Link>{' '}
              &mdash; templates for return-to-work summaries
            </li>
          </ul>
        </div>

        {/* Application Tips */}
        <h2 id="application-tips" className="text-3xl font-bold text-ink mt-12 mb-6">
          Application Tips for Returnships
        </h2>

        <div className="space-y-6">
          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Confirm the Window Yourself</h3>
            <p className="text-ink/60">
              Application windows change year to year and are not always published in advance.
              Bookmark the official page and set an alert on the company's careers site or
              LinkedIn rather than relying on a fixed date from any third-party list, including
              this one.
            </p>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Network Before Applying</h3>
            <p className="text-ink/60">
              Connect with alumni of the program on LinkedIn. Many companies encourage referrals, and
              speaking with someone who completed the program gives you insider knowledge for your
              application and interviews. Search &ldquo;[company] returnship&rdquo; on LinkedIn to
              find past participants.
            </p>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Prepare for the Interview Differently</h3>
            <p className="text-ink/60">
              Returnship interviews focus less on &ldquo;Why did you leave?&rdquo; and more on
              &ldquo;What have you done to stay current?&rdquo; Be ready to discuss courses you
              have taken, projects you have built, and how you plan to ramp up. The companies running
              these programs are invested in your success &mdash; the interview is more collaborative
              than adversarial.
            </p>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Apply to Multiple Programs</h3>
            <p className="text-ink/60">
              Returnships are competitive. Apply to several programs that match your background. Each
              application should be tailored to the specific company and role &mdash; a generic resume
              sent to all programs will underperform a targeted one.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <h2 id="faq" className="text-3xl font-bold text-ink mt-12 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: 'Are returnship programs paid?',
              a: 'Every program verified in this guide is paid or explicitly compensated. Always confirm compensation on the official program page, since terms can change between cohorts.',
            },
            {
              q: 'How long is a typical returnship?',
              a: 'Most verified programs here run 12-16 weeks. Some, like Deloitte UK, have moved away from a fixed cohort length entirely and place returners into ongoing roles year-round.',
            },
            {
              q: 'Does a live program page mean applications are open right now?',
              a: 'No. A company can keep its returnship page online year-round even when the application window is closed or has not been announced yet. Check the Application Status badge on each card above, and verify on the official page before applying.',
            },
            {
              q: 'How long do I need to have been out of work to qualify?',
              a: 'It varies by program. JPMorgan Chase and the Daphne Jackson Trust require 2+ years; Salesforce India and Wells Fargo Glide accept 1+ year breaks. Check each program’s eligibility above and confirm on the official page, since requirements can change.',
            },
            {
              q: 'Do I need a resume for a returnship application?',
              a: 'Yes. Most returnship applications require a resume, cover letter, and sometimes additional materials like a portfolio or writing sample. Use our free resume builder to create a professional, ATS-friendly resume tailored to the specific program.',
            },
            {
              q: 'What if there is no returnship in my industry?',
              a: 'Not all industries have formal returnship programs. In that case, look for companies with "returnship-friendly" hiring practices, apply through standard channels with a well-crafted resume that addresses your gap, and consider organizations like iRelaunch and Path Forward that maintain broader directories of return-to-work employers.',
            },
            {
              q: 'Are returnships only for women?',
              a: 'No. While some programs (like Amazon rekindle and Wells Fargo Glide) are explicitly for women, most major returnships — JPMorgan Chase, Goldman Sachs, Deloitte — are open to anyone with a qualifying career break.',
            },
          ].map((faq, i) => (
            <div key={i} className="bg-chalk-dark rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">{faq.q}</h3>
              <p className="text-ink/60">{faq.a}</p>
            </div>
          ))}
        </div>

      </div>
    </BlogLayout>
  );
}
