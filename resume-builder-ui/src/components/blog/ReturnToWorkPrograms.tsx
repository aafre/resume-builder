import BlogLayout from '../BlogLayout';
import { Link } from 'react-router-dom';

interface Program {
  company: string;
  name: string;
  fields: string;
  duration: string;
  paid: boolean;
  minGap: string;
  url: string;
  description: string;
}

const PROGRAMS: Program[] = [
  {
    company: 'JP Morgan Chase',
    name: 'ReEntry Program',
    fields: 'Finance, Technology, Operations, Risk, Compliance',
    duration: '15 weeks',
    paid: true,
    minGap: '2+ years',
    url: 'https://www.jpmorganchase.com/careers',
    description: 'One of the largest and longest-running returnship programs. Operates across multiple business lines with a strong conversion rate to full-time roles. Available in the US, UK, and India.',
  },
  {
    company: 'Goldman Sachs',
    name: 'Returnship',
    fields: 'Engineering, Finance, Operations, Compliance',
    duration: '12 weeks',
    paid: true,
    minGap: '2+ years',
    url: 'https://www.goldmansachs.com/careers',
    description: 'The program that coined the term "returnship." Highly competitive with mentorship, training, and networking. Strong track record of converting participants to permanent employees.',
  },
  {
    company: 'Amazon',
    name: 'Returnship Program',
    fields: 'Software Engineering, Program Management, Operations',
    duration: '16 weeks',
    paid: true,
    minGap: '1+ years',
    url: 'https://www.amazon.jobs/en/landing_pages/returnships',
    description: 'Paid internship-style program with mentorship and a dedicated cohort. Focuses on tech and operations roles. Available in multiple US locations and some international offices.',
  },
  {
    company: 'Microsoft',
    name: 'LEAP Program',
    fields: 'Software Engineering',
    duration: '16 weeks',
    paid: true,
    minGap: 'Non-traditional background',
    url: 'https://leap.microsoft.com/',
    description: 'Designed for career changers and returners entering software engineering. Includes intensive training and placement on a product team. Not limited to those with CS degrees.',
  },
  {
    company: 'PayPal',
    name: 'Recharge Program',
    fields: 'Technology, Product, Data Science, Finance',
    duration: '16 weeks',
    paid: true,
    minGap: '2+ years',
    url: 'https://careers.pypl.com/home/',
    description: 'Structured return-to-work program with mentorship, professional development, and a clear path to full-time employment. Strong focus on inclusion and supporting diverse returners.',
  },
  {
    company: 'IBM',
    name: 'Tech Re-Entry Program',
    fields: 'Software Engineering, Data Science, Cloud, AI',
    duration: '12 weeks',
    paid: true,
    minGap: '1+ years',
    url: 'https://www.ibm.com/careers',
    description: 'Focused on technical roles with training in IBM cloud and AI platforms. Good option for engineers who want to update their skills while re-entering the workforce.',
  },
  {
    company: 'Meta',
    name: 'Return to Work Program',
    fields: 'Engineering, Product Design, Data',
    duration: '16 weeks',
    paid: true,
    minGap: '2+ years',
    url: 'https://www.metacareers.com/careerprograms/pathways',
    description: 'Offers full compensation and benefits during the program. Participants are embedded in real teams working on production products. Strong conversion rate.',
  },
  {
    company: 'Deloitte',
    name: 'Encore Program',
    fields: 'Consulting, Audit, Tax, Advisory',
    duration: 'Varies',
    paid: true,
    minGap: '2+ years',
    url: 'https://www.deloitte.com/us/en/careers/join-deloitte/encore-program.html',
    description: 'Professional services returnship across all major practice areas. Provides training, mentorship, and exposure to client-facing work. Available in the US and UK.',
  },
  {
    company: 'Accenture',
    name: 'Return to Work Program',
    fields: 'Consulting, Technology, Operations',
    duration: '16 weeks',
    paid: true,
    minGap: '18+ months',
    url: 'https://www.accenture.com/us-en/careers',
    description: 'Global program available across multiple practices. Includes dedicated onboarding, coaching, and a buddy system. Open to professionals who have been on a career break.',
  },
  {
    company: 'Walmart',
    name: 'Return to Tech',
    fields: 'Software Engineering, Data, Product',
    duration: '16 weeks',
    paid: true,
    minGap: '2+ years',
    url: 'https://tech.walmart.com/',
    description: 'Focused on Walmart Global Tech, this program places returners on engineering and data teams. Provides competitive compensation and mentorship throughout.',
  },
  {
    company: 'SAP',
    name: 'Back to Work Program',
    fields: 'Software Engineering, UX, Product, Support',
    duration: '6 months',
    paid: true,
    minGap: '2+ years',
    url: 'https://www.sap.com/careers.html',
    description: 'Longer-duration program that gives returners more time to ramp up. Includes training on SAP products, mentorship, and networking. Available globally.',
  },
  {
    company: 'NBCUniversal',
    name: 'Act Two Program',
    fields: 'Media, Technology, Marketing, Finance',
    duration: '12 weeks',
    paid: true,
    minGap: '2+ years',
    url: 'https://www.nbcunicareers.com/programs',
    description: 'Returnship in the media and entertainment industry. Good option for returners interested in creative, tech, or business roles at a major media company.',
  },
  {
    company: 'Credit Suisse / UBS',
    name: 'Real Returns',
    fields: 'Banking, Technology, Risk, Compliance',
    duration: '12-24 weeks',
    paid: true,
    minGap: '2+ years',
    url: 'https://www.ubs.com/careers',
    description: 'Originally a Credit Suisse program, now continued under UBS. Places returners across banking divisions with structured mentorship and career development.',
  },
];

export default function ReturnToWorkPrograms() {
  return (
    <BlogLayout
      title="Return to Work Programs: 13 Top Companies Hiring Career Returners (2026)"
      description="Return to work programs and returnships at JP Morgan, Goldman Sachs, Amazon, Microsoft, Meta, and more. Paid programs, eligibility, how to apply, and resume tips for career returners."
      publishDate="2026-03-05"
      readTime="14 min"
      keywords={[
        'return to work programs',
        'returnship programs',
        'return to work after career break',
        'career returner programs 2026',
        'returnship programs 2026',
        'jp morgan reentry program',
        'goldman sachs returnship',
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Returnship programs are structured, paid programs designed for professionals re-entering the
          workforce after a career break. Major companies like JP Morgan, Goldman Sachs, Amazon, and
          Microsoft run them specifically to tap into experienced talent that traditional hiring often
          overlooks. This guide covers the top programs, how they work, and how to prepare your
          application.
        </p>

        {/* Table of Contents */}
        <nav className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h2 className="font-bold text-ink mb-4 text-lg">Table of Contents</h2>
          <ol className="space-y-2 text-ink/80 list-decimal list-inside">
            <li><a href="#what-is-returnship" className="text-accent hover:underline">What Is a Returnship?</a></li>
            <li><a href="#programs" className="text-accent hover:underline">Top Return-to-Work Programs (2026)</a></li>
            <li><a href="#comparison" className="text-accent hover:underline">Program Comparison Table</a></li>
            <li><a href="#resume-tips" className="text-accent hover:underline">How to Write a Return-to-Work Resume</a></li>
            <li><a href="#application-tips" className="text-accent hover:underline">Application Tips</a></li>
            <li><a href="#faq" className="text-accent hover:underline">FAQ</a></li>
          </ol>
        </nav>

        {/* What Is a Returnship */}
        <h2 id="what-is-returnship" className="text-3xl font-bold text-ink mt-12 mb-6">
          What Is a Returnship?
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          A returnship is a professional internship for experienced workers returning after a career
          break. Think of it as an on-ramp back to corporate life. Unlike entry-level internships,
          returnships are designed for mid-career and senior professionals who took time off for
          caregiving, health, relocation, education, or other life events.
        </p>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 mt-6">
          <h3 className="font-bold text-ink mb-3">Key Features of Returnship Programs</h3>
          <ul className="space-y-2 text-ink/80">
            <li><strong>Paid:</strong> Nearly all major returnships offer competitive compensation (often 80-100% of the equivalent full-time salary)</li>
            <li><strong>Time-bound:</strong> Typically 12-16 weeks, giving both you and the company a trial period</li>
            <li><strong>Structured:</strong> Include mentorship, onboarding, training, and regular check-ins</li>
            <li><strong>Conversion-focused:</strong> Most programs have a 50-80% conversion rate to permanent roles</li>
            <li><strong>Gap-friendly:</strong> Designed specifically for people with career breaks &mdash; a gap is the entry requirement, not a disqualifier</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-4">
          <h3 className="text-xl font-bold text-yellow-800 mb-3">Who Qualifies?</h3>
          <p className="text-yellow-700">
            Most programs require a <strong>minimum career break of 1-2 years</strong> and prior
            professional experience (typically 5+ years). Some are open to career changers from
            non-traditional backgrounds (like Microsoft LEAP). Each program has specific eligibility
            criteria &mdash; check the individual program pages below.
          </p>
        </div>

        {/* Programs */}
        <h2 id="programs" className="text-3xl font-bold text-ink mt-12 mb-6">
          Top Return-to-Work Programs (2026)
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          These are the most established returnship programs at major companies. All are paid and most
          have strong conversion rates to full-time employment.
        </p>

        <div className="space-y-6">
          {PROGRAMS.map((program, i) => (
            <div key={i} className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-ink">{program.company}</h3>
                  <p className="text-accent font-medium text-sm">{program.name}</p>
                </div>
                <div className="flex gap-2">
                  {program.paid && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">
                      PAID
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {program.duration}
                  </span>
                </div>
              </div>
              <p className="text-stone-warm text-sm mb-3">{program.description}</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-ink">Fields:</span>{' '}
                  <span className="text-stone-warm">{program.fields}</span>
                </div>
                <div>
                  <span className="font-medium text-ink">Min. career break:</span>{' '}
                  <span className="text-stone-warm">{program.minGap}</span>
                </div>
              </div>
              <a
                href={program.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-accent hover:underline text-sm font-medium"
              >
                View program details &rarr;
              </a>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <h2 id="comparison" className="text-3xl font-bold text-ink mt-12 mb-6">
          Program Comparison Table
        </h2>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm text-sm">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-4 py-3 text-left font-bold text-ink">Company</th>
                <th className="px-4 py-3 text-left font-bold text-ink">Program</th>
                <th className="px-4 py-3 text-center font-bold text-ink">Duration</th>
                <th className="px-4 py-3 text-center font-bold text-ink">Min. Gap</th>
                <th className="px-4 py-3 text-center font-bold text-ink">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {PROGRAMS.map((p, i) => (
                <tr key={i} className={i % 2 === 1 ? 'bg-chalk-dark' : ''}>
                  <td className="px-4 py-3 font-medium text-ink">{p.company}</td>
                  <td className="px-4 py-3 text-stone-warm">{p.name}</td>
                  <td className="px-4 py-3 text-center text-stone-warm">{p.duration}</td>
                  <td className="px-4 py-3 text-center text-stone-warm">{p.minGap}</td>
                  <td className="px-4 py-3 text-center text-green-600 font-medium">{p.paid ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resume Tips */}
        <h2 id="resume-tips" className="text-3xl font-bold text-ink mt-12 mb-6">
          How to Write a Return-to-Work Resume
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
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
              desc: 'Each returnship has different focus areas. A JP Morgan ReEntry application should emphasize financial services experience; an Amazon Returnship should highlight technical delivery and customer obsession.',
            },
          ].map((step) => (
            <div key={step.num} className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step.num}
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">{step.title}</h3>
                <p className="text-stone-warm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 mt-6">
          <h3 className="font-bold text-ink mb-3">Related Guides</h3>
          <ul className="space-y-2 text-ink/80">
            <li>
              <Link to="/blog/resume-employment-gaps" className="text-accent hover:underline">
                How to Explain Employment Gaps on Your Resume
              </Link>{' '}
              &mdash; detailed strategies for every type of gap
            </li>
            <li>
              <Link to="/blog/career-change-resume-guide" className="text-accent hover:underline">
                Career Change Resume Guide
              </Link>{' '}
              &mdash; if you are returning to a different field
            </li>
            <li>
              <Link to="/blog/professional-summary-examples" className="text-accent hover:underline">
                Professional Summary Examples
              </Link>{' '}
              &mdash; templates for return-to-work summaries
            </li>
            <li>
              <Link to="/blog/how-to-write-a-resume-guide" className="text-accent hover:underline">
                How to Write a Resume (Complete Guide)
              </Link>{' '}
              &mdash; full step-by-step resume writing walkthrough
            </li>
          </ul>
        </div>

        {/* Application Tips */}
        <h2 id="application-tips" className="text-3xl font-bold text-ink mt-12 mb-6">
          Application Tips for Returnships
        </h2>

        <div className="space-y-6">
          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Timing Matters</h3>
            <p className="text-stone-warm">
              Most returnship programs have specific application windows, often in spring (February-April)
              for summer/fall cohorts. Set alerts on company career pages and LinkedIn. Applications
              typically open 3-4 months before the program starts.
            </p>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Network Before Applying</h3>
            <p className="text-stone-warm">
              Connect with alumni of the program on LinkedIn. Many companies encourage referrals, and
              speaking with someone who completed the program gives you insider knowledge for your
              application and interviews. Search &ldquo;[company] returnship&rdquo; on LinkedIn to
              find past participants.
            </p>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Prepare for the Interview Differently</h3>
            <p className="text-stone-warm">
              Returnship interviews focus less on &ldquo;Why did you leave?&rdquo; and more on
              &ldquo;What have you done to stay current?&rdquo; Be ready to discuss courses you
              have taken, projects you have built, and how you plan to ramp up. The companies running
              these programs are invested in your success &mdash; the interview is more collaborative
              than adversarial.
            </p>
          </div>

          <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Apply to Multiple Programs</h3>
            <p className="text-stone-warm">
              Returnships are competitive. Apply to 3-5 programs that match your background. Each
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
              a: 'Yes. Nearly all major returnship programs (JP Morgan, Goldman Sachs, Amazon, Meta, etc.) offer competitive compensation, often at 80-100% of the equivalent full-time salary. Some also include benefits like health insurance during the program.',
            },
            {
              q: 'How long is a typical returnship?',
              a: 'Most programs run 12-16 weeks, though some (like SAP) extend to 6 months. This gives both the company and the returner time to evaluate fit before making a full-time commitment.',
            },
            {
              q: 'What is the conversion rate to full-time?',
              a: 'Conversion rates vary by company and year, but most major programs report 50-80% of participants receiving full-time offers. Goldman Sachs and JP Morgan have historically been at the higher end of this range.',
            },
            {
              q: 'How long do I need to have been out of work to qualify?',
              a: 'Most programs require a minimum career break of 1-2 years. Some are flexible on the reason for the break (caregiving, health, education, relocation, personal reasons). Check each program for specific eligibility.',
            },
            {
              q: 'Can I apply to a returnship if I am currently working part-time?',
              a: 'It depends on the program. Some require that you are not currently employed full-time, while others consider anyone returning from a significant career break regardless of current part-time work. Check the specific program guidelines.',
            },
            {
              q: 'Do I need a resume for a returnship application?',
              a: 'Yes. Most returnship applications require a resume, cover letter, and sometimes additional materials like a portfolio or writing sample. Use our free resume builder to create a professional, ATS-friendly resume tailored to the specific program.',
            },
            {
              q: 'What if there is no returnship in my industry?',
              a: 'Not all industries have formal returnship programs. In that case, look for companies with "returnship-friendly" hiring practices, apply through standard channels with a well-crafted resume that addresses your gap, and consider organizations like iRelaunch and Path Forward that connect returners with employers.',
            },
            {
              q: 'Are returnships only for women?',
              a: 'No. While many returnships were initially designed to address the gender gap in industries like finance and tech, most programs are open to all genders. Anyone with a qualifying career break is eligible to apply.',
            },
          ].map((faq, i) => (
            <div key={i} className="bg-chalk-dark rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">{faq.q}</h3>
              <p className="text-stone-warm">{faq.a}</p>
            </div>
          ))}
        </div>

      </div>
    </BlogLayout>
  );
}
