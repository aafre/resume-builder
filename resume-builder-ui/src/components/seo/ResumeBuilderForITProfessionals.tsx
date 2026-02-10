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

      {/* Role-specific keyword links */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
            Resume Keywords by IT Role
          </h2>
          <p className="text-lg text-stone-warm font-extralight mb-6 leading-relaxed">
            Different IT roles require different keyword strategies. Browse our curated keyword
            lists for your specific role:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/resume-keywords/software-engineer" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Software Engineer Keywords</h3>
              <p className="text-stone-warm text-sm">Python, React, AWS, CI/CD, microservices</p>
            </Link>
            <Link to="/resume-keywords/product-manager" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Product Manager Keywords</h3>
              <p className="text-stone-warm text-sm">Roadmap, OKRs, A/B testing, user research</p>
            </Link>
            <Link to="/resume-keywords/business-analyst" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Business Analyst Keywords</h3>
              <p className="text-stone-warm text-sm">Requirements, SQL, JIRA, process mapping</p>
            </Link>
            <Link to="/blog/tech-resume-guide" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Tech Resume Guide</h3>
              <p className="text-stone-warm text-sm">Complete guide to writing a tech resume</p>
            </Link>
          </div>
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
