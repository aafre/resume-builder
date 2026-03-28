/**
 * Free Resume Builder for IT Professionals
 * URL: /free-resume-builder-for-it-professionals
 * Target keyword: "free resume builder for IT professionals"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import ResourceCard from '../shared/ResourceCard';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

export default function ResumeBuilderForITProfessionals() {
  const config = SEO_PAGES.forITProfessionals;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
    breadcrumbs: config.breadcrumbs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {config.features && <FeatureGrid features={config.features} />}

      {/* Tech resume tips */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            TECH RESUME TIPS
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            What Tech Recruiters Actually Look For
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {[
              { title: 'Specific Technologies', desc: 'Name exact languages, frameworks, and platforms. "Python, React, AWS" beats "programming, web development, cloud computing." Match the job description exactly.' },
              { title: 'Measurable Impact', desc: '"Reduced API latency by 60%" and "99.9% uptime" tell a story. Vague claims like "improved performance" tell the recruiter nothing actionable.' },
              { title: 'System Scale', desc: 'Mention users served, requests handled, data processed. "Serving 50K daily active users" immediately communicates the complexity of your work.' },
              { title: 'Modern Stack', desc: 'Lead with current, in-demand technologies. Mention legacy systems only if relevant to the target role. Docker, Kubernetes, and CI/CD should be prominent.' },
            ].map((tip, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06]">
                <h3 className="font-display text-lg font-bold text-ink mb-2">{tip.title}</h3>
                <p className="text-stone-warm font-extralight leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Common mistakes section */}
      <RevealSection variant="fade-up">
        <div className="mb-16 max-w-4xl mx-auto">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            AVOID THESE PITFALLS
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4 text-center">
            Common IT Resume Mistakes That Get You Rejected
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm leading-relaxed text-center mb-10 max-w-3xl mx-auto">
            Tech recruiters review hundreds of resumes per week. These mistakes send yours straight to
            the rejection pile — even when you have the skills for the job.
          </p>
          <div className="space-y-4">
            {[
              {
                mistake: 'Listing every technology you have ever touched',
                fix: 'Curate a focused skills section that mirrors the job description. A laundry list of 40 technologies signals "jack of all trades." Instead, group 10-15 relevant skills by category and let your experience bullets prove depth.',
              },
              {
                mistake: 'Describing projects without context or outcomes',
                fix: 'Every bullet should follow the pattern: "Did X using Y, resulting in Z." Vague lines like "worked on backend systems" tell recruiters nothing. Specify the system, your contribution, and the measurable result.',
              },
              {
                mistake: 'Missing GitHub profile or portfolio links',
                fix: 'Recruiters expect to see your work. Include a GitHub link with pinned repos, a portfolio site, or links to open-source contributions. If your GitHub is empty, create one meaningful project that demonstrates your strongest skill.',
              },
              {
                mistake: 'Writing vague descriptions like "worked on systems"',
                fix: 'Replace every vague verb with a specific action. "Worked on" becomes "Architected," "Migrated," "Optimized," or "Deployed." Pair it with scale: number of users, requests per second, data volume, or team size.',
              },
              {
                mistake: 'Not quantifying performance improvements',
                fix: 'Numbers are the universal language of tech resumes. "Reduced page load time from 4.2s to 1.1s" is infinitely stronger than "improved performance." Track latency, uptime, cost savings, deployment frequency, and error rates.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-chalk-dark rounded-xl p-6 border border-black/[0.06]">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">✗</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink mb-1">{item.mistake}</h3>
                    <p className="text-stone-warm font-extralight leading-relaxed">{item.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-lg text-stone-warm font-extralight leading-relaxed mt-8 text-center">
            Not sure which skills to highlight? Use our{' '}
            <Link to="/resume-keyword-scanner" className="text-accent hover:underline font-medium">resume keyword scanner</Link>{' '}
            to compare your resume against the job description and identify exactly what is missing.
          </p>
        </div>
      </RevealSection>

      {/* Role-specific keyword links */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto cv-auto cv-h-300">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
            Resume Keywords by IT Role
          </h2>
          <p className="text-lg text-stone-warm font-extralight mb-6 leading-relaxed">
            Different IT roles require different keyword strategies. Browse our curated keyword
            lists for your specific role, or read our guide on{' '}
            <Link to="/blog/how-to-list-skills" className="text-accent hover:underline font-medium">how to list skills on a resume</Link>{' '}
            for general best practices:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <ResourceCard to="/resume-keywords/software-engineer" title="Software Engineer Keywords" description="Python, React, AWS, CI/CD, microservices" />
            <ResourceCard to="/resume-keywords/product-manager" title="Product Manager Keywords" description="Roadmap, OKRs, A/B testing, user research" />
            <ResourceCard to="/resume-keywords/business-analyst" title="Business Analyst Keywords" description="Requirements, SQL, JIRA, process mapping" />
            <ResourceCard to="/blog/tech-resume-guide" title="Tech Resume Guide" description="Complete guide to writing a tech resume" />
            <ResourceCard to="/examples/software-engineer" title="Software Engineer Resume Example" description="Full resume with tech stack and project highlights" />
            <ResourceCard to="/examples/data-analyst" title="Data Analyst Resume Example" description="SQL, Python, visualization tools highlighted" />
            <ResourceCard to="/examples/front-end-developer" title="Front-End Developer Resume Example" description="React, TypeScript, and portfolio projects" />
          </div>
        </div>
      </RevealSection>

      {/* Inline FAQ section */}
      <RevealSection variant="fade-up">
        <div className="mb-16 max-w-4xl mx-auto">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            QUICK ANSWERS
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-10 text-center">
            IT Resume Questions, Answered
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Should I list all programming languages I know?',
                a: 'No. List only languages you could confidently use in a technical interview or on day one of the job. A focused list of 6-8 languages you truly know beats a sprawling list of 20 you touched once. Organize by proficiency level or relevance to the target role, and let your experience bullets demonstrate depth in each.',
              },
              {
                q: 'How do I showcase side projects on my resume?',
                a: 'Add a dedicated "Projects" section between Experience and Education. For each project, include the name, tech stack, your role, and a measurable outcome: "Built a real-time chat app with React, Node.js, and WebSockets — 500+ daily active users." Link to the live project or GitHub repo. Side projects are especially valuable for career changers and junior developers.',
              },
              {
                q: 'Should I include IT certifications on my resume?',
                a: 'Yes, if they are relevant to the role. AWS Solutions Architect, Google Cloud Professional, Azure Administrator, CompTIA Security+, and Kubernetes certifications carry significant weight. Place them in a dedicated Certifications section near the top. Include the issuing body and year obtained. Skip expired certifications unless you are actively renewing.',
              },
              {
                q: 'How long should a tech resume be?',
                a: 'One page for early-career professionals (under 8-10 years). Two pages maximum for senior engineers, architects, and engineering managers with extensive project histories. If you are struggling to fit on one page, cut roles older than 10 years, remove obvious skills (e.g., "Microsoft Office"), and tighten bullet points to one line each.',
              },
              {
                q: 'Should I include a portfolio or GitHub link?',
                a: 'Absolutely. Add it right next to your contact information. For GitHub, pin your 3-5 best repositories and write clear README files. For a portfolio site, include live project demos and case studies. Recruiters at top tech companies consistently say they check links — make sure yours are worth clicking.',
              },
              {
                q: 'How do I describe agile and scrum experience?',
                a: 'Do not just write "Agile methodology" — that tells recruiters nothing. Be specific: "Led sprint planning for a 7-person team delivering bi-weekly releases" or "Reduced sprint carry-over by 40% through refined backlog grooming." Mention specific tools (Jira, Linear, Shortcut) and practices (standups, retros, CI/CD pipelines) with outcomes.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06]">
                <h3 className="font-display text-lg font-bold text-ink mb-2">{item.q}</h3>
                <p className="text-stone-warm font-extralight leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="text-lg text-stone-warm font-extralight leading-relaxed mt-8 text-center">
            For a deeper dive, read our complete{' '}
            <Link to="/blog/tech-resume-guide" className="text-accent hover:underline font-medium">tech resume writing guide</Link>.
          </p>
        </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Build Your IT Resume Today"
        description="ATS-optimized templates designed for tech professionals. 100% free, no sign-up required."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
