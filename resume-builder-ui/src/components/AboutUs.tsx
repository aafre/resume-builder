/**
 * AboutUs — /about
 *
 * Was eight stacked cards: `bg-white/80 backdrop-blur-sm shadow-premium` on
 * every section including the ones that are just prose, seven emoji standing in
 * for an icon set, and one `text-orange-600` badge. Glass on a static in-flow
 * card is decoration and costs paint; a page where every section is lifted has
 * no hierarchy at all, because lift stops being a signal once everything has it.
 *
 * Sections now sit on the ground and separate tonally — chalk, then one ink
 * block for the mission, then chalk-dark for the impact figures. Only the value
 * cards, which are genuinely a grid of peers, stay cards.
 */

import { Link } from "react-router-dom";
import { Globe, Lock, Zap, Sprout, BadgeDollarSign, ScanSearch, BookOpen } from "lucide-react";
import SEOHead from "./SEOHead";
import { generateVideoObjectSchema, wrapInGraph } from "../utils/schemaGenerators";
import { TUTORIAL_VIDEO } from "../config/videoContent";

const VALUES = [
  {
    Icon: Globe,
    title: "Accessibility First",
    body: "Professional tools shouldn't be luxury items. We're committed to keeping our platform completely free and accessible to everyone, everywhere.",
  },
  {
    Icon: Lock,
    title: "Privacy Protected",
    body: "Your career data belongs to you. Use guest mode for complete privacy (no data stored), or create a free account to securely save up to 5 resumes. We never sell or share your information. You're always in complete control.",
  },
  {
    Icon: Zap,
    title: "Simplicity & Power",
    body: "We believe powerful tools can be simple to use. Our interface prioritizes ease of use without sacrificing the professional quality you need.",
  },
  {
    Icon: Sprout,
    title: "Continuous Growth",
    body: "We're constantly improving our platform based on user feedback and evolving job market needs. Your success drives our innovation.",
  },
];

const DIFFERENTIATORS = [
  {
    Icon: BadgeDollarSign,
    title: "Truly Free",
    body: "No hidden fees, premium tiers, or subscription traps. Everything you need is completely free, forever.",
  },
  {
    Icon: ScanSearch,
    title: "ATS-Optimized",
    body: "Our templates are designed to pass Applicant Tracking Systems, ensuring your resume reaches human recruiters.",
  },
  {
    Icon: BookOpen,
    title: "Education-Focused",
    body: "Beyond tools, we provide comprehensive guides, tips, and resources to help you succeed in your job search.",
  },
];

const IMPACT: [string, string][] = [
  ["95%", "User Satisfaction"],
  ["$0", "Cost to Users"],
  ["24/7", "Available Access"],
];

export default function AboutUs() {
  return (
    <>
      <SEOHead
        title="About EasyFreeResume | Our Mission to Democratize Career Success"
        description="Learn about EasyFreeResume's mission to provide completely free, professional-quality resume tools. Discover our values, impact, and commitment to your career success."
        structuredData={wrapInGraph([
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About EasyFreeResume",
            description:
              "Learn about our mission to democratize career opportunities",
            mainEntity: {
              "@type": "Organization",
              name: "EasyFreeResume",
              description: "Free professional resume builder platform",
              foundingDate: "2019",
              mission:
                "Democratize career opportunities by providing free professional resume tools",
            },
          },
          generateVideoObjectSchema(
            TUTORIAL_VIDEO.name,
            TUTORIAL_VIDEO.description,
            TUTORIAL_VIDEO.thumbnailUrl,
            TUTORIAL_VIDEO.uploadDate,
            TUTORIAL_VIDEO.embedUrl
          ),
        ])}
      />
      <div className="min-h-screen bg-chalk">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <nav className="mb-8" aria-label="breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-ink/60">
              <li>
                <Link to="/" className="hover:text-accent-text transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-ink/60">/</li>
              <li className="text-ink font-medium">About Us</li>
            </ol>
          </nav>

          <header className="text-center mb-16 md:mb-24">
            <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">
              About us
            </p>
            <h1 className="font-display text-[clamp(2.5rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight text-ink mb-6 [text-wrap:balance]">
              About EasyFreeResume
            </h1>
            <p className="text-lg md:text-xl font-extralight text-ink/60 leading-relaxed max-w-3xl mx-auto [text-wrap:pretty]">
              We believe building a professional resume should be simple,
              stress-free, and accessible to everyone - no matter where you’re
              from or what stage you’re at in your career.
            </p>
          </header>

          <div className="space-y-20 md:space-y-28">
            {/* Prose sits on the ground. It was in a lifted glass card, which
                is a container claiming importance for four paragraphs. */}
            <section className="max-w-[68ch] mx-auto">
              <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">
                The origin
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink mb-8">
                Why We Built This
              </h2>
              <div className="space-y-6 text-lg font-extralight leading-relaxed text-ink/60 [text-wrap:pretty]">
                <p>
                  EasyFreeResume started with a simple goal - take the headache
                  out of making resumes. Every time we had to update ours, we'd
                  waste hours adjusting layouts, fixing formatting, or
                  re-downloading templates that looked outdated or broke things
                  when exported.
                </p>
                <p>
                  Too many resume tools put essential features behind
                  subscriptions, had confusing editors, or made it difficult to
                  recreate past work. It felt wrong that something as
                  fundamental as presenting yourself professionally had become
                  expensive or overly complicated.
                </p>
                <p>
                  So we built something better - a clean, fast, fully free
                  resume builder that works out of the box and stays out of your
                  way. Just pick a template, fill in your details, and download.
                  That's it.
                </p>
                <p>
                  It’s open-source too. If there’s a feature or new template you
                  want, you can raise a request directly on our{" "}
                  <a
                    href="https://github.com/aafre/resume-builder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-text font-medium underline underline-offset-4 decoration-accent-text/30 hover:decoration-accent-text"
                  >
                    GitHub repository
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Our Mission — the page's one tonal change, on the section that
                is actually the argument. */}
            <section className="bg-ink text-white rounded-3xl p-8 md:p-12 relative overflow-clip">
              <div
                aria-hidden="true"
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[400px] max-w-full rounded-full bg-accent/[0.07] blur-3xl pointer-events-none"
              />
              <div className="relative">
                <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">
                  Our mission
                </p>
                <h2 className="font-display text-3xl font-extrabold tracking-tight mb-10">
                  Our Mission
                </h2>
                <div className="space-y-6 text-lg font-extralight leading-relaxed text-white/60 max-w-[62ch]">
                  <p>
                    <strong className="font-bold text-white">Democratize Career Opportunities:</strong> We believe
                    that everyone deserves access to professional-quality resume
                    tools, regardless of their financial situation or technical
                    expertise.
                  </p>
                  <p>
                    <strong className="font-bold text-white">Eliminate Barriers:</strong> By providing free,
                    unlimited access to our tools, we're removing one more
                    obstacle between talented individuals and their dream careers.
                  </p>
                  <p>
                    <strong className="font-bold text-white">Empower Success:</strong> Our platform doesn't just
                    create resumes-it provides the education, tips, and guidance
                    needed to succeed in today's competitive job market.
                  </p>
                </div>
              </div>
            </section>

            {/* Our Values — a genuine grid of peers, so these stay cards. */}
            <section>
              <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
                What we hold to
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
                Our Values
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {VALUES.map(({ Icon, title, body }) => (
                  <div
                    key={title}
                    className="bg-white rounded-2xl p-8 card-gradient-border spot-card shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300"
                  >
                    <Icon
                      className="w-6 h-6 text-accent-text mb-5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <h3 className="font-display text-xl font-extrabold tracking-tight text-ink mb-3">
                      {title}
                    </h3>
                    <p className="font-extralight text-ink/60 leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* What Makes Us Different */}
            <section>
              <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
                The difference
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
                What Makes Us Different
              </h2>
              <div className="grid md:grid-cols-3 gap-10 md:gap-8 md:divide-x md:divide-ink/10">
                {DIFFERENTIATORS.map(({ Icon, title, body }, i) => (
                  <div key={title} className={i > 0 ? "md:pl-8" : ""}>
                    <Icon
                      className="w-6 h-6 text-accent-text mb-5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <h3 className="font-display text-lg font-extrabold tracking-tight text-ink mb-3">
                      {title}
                    </h3>
                    <p className="font-extralight text-ink/60 leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Impact figures. Set as figures — display numerals with mono unit
                labels — rather than as three bolded lines inside a lifted card. */}
            <section className="bg-chalk-dark rounded-3xl p-8 md:p-12">
              <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
                By the numbers
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
                Our Impact
              </h2>
              <dl className="grid sm:grid-cols-3 gap-10 sm:gap-8 text-center sm:divide-x sm:divide-ink/10">
                {IMPACT.map(([value, label]) => (
                  <div key={label}>
                    <dd className="font-display text-5xl font-extrabold tracking-tight text-ink tabular-nums">
                      {value}
                    </dd>
                    <dt className="font-mono text-xs tracking-[0.15em] uppercase text-ink/60 mt-3">
                      {label}
                    </dt>
                  </div>
                ))}
              </dl>
            </section>

            {/* Team Section */}
            <section>
              <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
                Who builds it
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
                Built by Career Advocates
              </h2>

              <div className="max-w-[68ch] mx-auto">
                <div className="space-y-6 text-lg font-extralight leading-relaxed text-ink/60 mb-10 [text-wrap:pretty]">
                  <p>
                    Our team combines expertise in career development, user
                    experience design, and technology to create tools that truly
                    serve job seekers. We've worked in recruitment, career
                    counseling, and tech development-giving us unique insight into
                    what both candidates and employers need.
                  </p>
                  <p>
                    Every feature we build is tested with real job seekers and
                    validated against current hiring practices. We're not just
                    building software-we're building bridges to career success.
                  </p>
                </div>

                {/* YouTube tutorial embed */}
                <div className="rounded-2xl overflow-clip border border-black/[0.06] shadow-premium">
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={TUTORIAL_VIDEO.embedUrl}
                      title={TUTORIAL_VIDEO.iframeTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="text-center">
              <div className="bg-ink text-white rounded-3xl py-16 px-6 md:px-12 relative overflow-clip">
                <div
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] max-w-full rounded-full bg-accent/[0.07] blur-3xl pointer-events-none"
                />
                <div className="relative">
                  <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">
                    Get started
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-4 [text-wrap:balance]">
                    Ready to Build Your Professional Resume?
                  </h2>
                  <p className="text-lg md:text-xl font-extralight text-white/60 mb-10 max-w-2xl mx-auto">
                    Join thousands of successful job seekers who've landed their
                    dream roles with our{" "}
                    <Link
                      to="/"
                      className="text-white font-medium underline underline-offset-4 decoration-white/40 hover:decoration-white"
                    >
                      easy-to-use resume builder
                    </Link>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/templates" className="btn-primary py-4 px-10 text-lg">
                      Start Building Now
                    </Link>
                    {/* Outlined in the inverse polarity: a white-filled
                        .btn-secondary beside the accent fill would read as two
                        primaries. */}
                    <Link
                      to="/blog"
                      className="inline-flex items-center justify-center min-h-11 border border-white/20 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 hover:border-white/40 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                    >
                      Read Career Tips
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
