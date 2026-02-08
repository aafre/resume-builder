import { Link } from "react-router-dom";
import SEOHead from "./SEOHead";

export default function AboutUs() {
  return (
    <>
      <SEOHead
        title="About EasyFreeResume | Our Mission to Democratize Career Success"
        description="Learn about EasyFreeResume's mission to provide completely free, professional-quality resume tools. Discover our values, impact, and commitment to your career success."
        structuredData={{
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
        }}
      />
      <div className="min-h-screen bg-chalk">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <nav className="mb-8" aria-label="breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-stone-warm">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-mist">/</li>
              <li className="text-ink font-medium">About Us</li>
            </ol>
          </nav>

          <header className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-ink mb-6">
              About EasyFreeResume
            </h1>
            <p className="text-lg md:text-xl font-extralight text-stone-warm leading-relaxed max-w-3xl mx-auto">
              We believe building a professional resume should be simple,
              stress-free, and accessible to everyone - no matter where you’re
              from or what stage you’re at in your career.
            </p>
          </header>

          <div className="space-y-16">
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-premium p-8 md:p-12 border border-black/[0.06]">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink mb-6">
                Why We Built This
              </h2>
              <div className="prose prose-lg prose-slate max-w-none">
                <p className="text-lg leading-relaxed text-stone-warm mb-6">
                  EasyFreeResume started with a simple goal - take the headache
                  out of making resumes. Every time we had to update ours, we'd
                  waste hours adjusting layouts, fixing formatting, or
                  re-downloading templates that looked outdated or broke things
                  when exported.
                </p>
                <p className="text-lg leading-relaxed text-stone-warm mb-6">
                  Too many resume tools put essential features behind
                  subscriptions, had confusing editors, or made it difficult to
                  recreate past work. It felt wrong that something as
                  fundamental as presenting yourself professionally had become
                  expensive or overly complicated.
                </p>
                <p className="text-lg leading-relaxed text-stone-warm mb-6">
                  So we built something better - a clean, fast, fully free
                  resume builder that works out of the box and stays out of your
                  way. Just pick a template, fill in your details, and download.
                  That's it.
                </p>
                <p className="text-lg leading-relaxed text-stone-warm">
                  It’s open-source too. If there’s a feature or new template you
                  want, you can raise a request directly on our{" "}
                  <a
                    href="https://github.com/aafre/resume-builder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:text-ink"
                  >
                    GitHub repository
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Our Mission */}
            <section className="bg-ink text-white rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  <strong>Democratize Career Opportunities:</strong> We believe
                  that everyone deserves access to professional-quality resume
                  tools, regardless of their financial situation or technical
                  expertise.
                </p>

                <p>
                  <strong>Eliminate Barriers:</strong> By providing free,
                  unlimited access to our tools, we're removing one more
                  obstacle between talented individuals and their dream careers.
                </p>

                <p>
                  <strong>Empower Success:</strong> Our platform doesn't just
                  create resumes-it provides the education, tips, and guidance
                  needed to succeed in today's competitive job market.
                </p>
              </div>
            </section>

            {/* Our Values */}
            <section className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-premium p-8 border border-black/[0.06]">
                <div className="text-accent text-3xl mb-4">🎯</div>
                <h3 className="font-display text-xl font-bold text-ink mb-4">
                  Accessibility First
                </h3>
                <p className="text-stone-warm leading-relaxed">
                  Professional tools shouldn't be luxury items. We're committed
                  to keeping our platform completely free and accessible to
                  everyone, everywhere.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-premium p-8 border border-black/[0.06]">
                <div className="text-accent text-3xl mb-4">🔒</div>
                <h3 className="font-display text-xl font-bold text-ink mb-4">
                  Privacy Protected
                </h3>
                <p className="text-stone-warm leading-relaxed">
                  Your career data belongs to you. Use guest mode for complete privacy
                  (no data stored), or create a free account to securely save up to 5 resumes.
                  We never sell or share your information. You're always in complete control.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-premium p-8 border border-black/[0.06]">
                <div className="text-accent text-3xl mb-4">⚡</div>
                <h3 className="font-display text-xl font-bold text-ink mb-4">
                  Simplicity & Power
                </h3>
                <p className="text-stone-warm leading-relaxed">
                  We believe powerful tools can be simple to use. Our interface
                  prioritizes ease of use without sacrificing the professional
                  quality you need.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-premium p-8 border border-black/[0.06]">
                <div className="text-orange-600 text-3xl mb-4">🌱</div>
                <h3 className="font-display text-xl font-bold text-ink mb-4">
                  Continuous Growth
                </h3>
                <p className="text-stone-warm leading-relaxed">
                  We're constantly improving our platform based on user feedback
                  and evolving job market needs. Your success drives our
                  innovation.
                </p>
              </div>
            </section>

            {/* What Makes Us Different */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-premium p-8 md:p-12 border border-black/[0.06]">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink mb-8 text-center">
                What Makes Us Different
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink mb-3">
                    Truly Free
                  </h3>
                  <p className="text-stone-warm">
                    No hidden fees, premium tiers, or subscription traps.
                    Everything you need is completely free, forever.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink mb-3">
                    ATS-Optimized
                  </h3>
                  <p className="text-stone-warm">
                    Our templates are designed to pass Applicant Tracking
                    Systems, ensuring your resume reaches human recruiters.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink mb-3">
                    Education-Focused
                  </h3>
                  <p className="text-stone-warm">
                    Beyond tools, we provide comprehensive guides, tips, and
                    resources to help you succeed in your job search.
                  </p>
                </div>
              </div>
            </section>

            {/* Impact Stats */}
            <section className="bg-chalk-dark rounded-2xl shadow-premium p-8 md:p-12 border border-black/[0.06]">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink mb-8 text-center">
                Our Impact
              </h2>

              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    95%
                  </div>
                  <p className="text-stone-warm">User Satisfaction</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    $0
                  </div>
                  <p className="text-stone-warm">Cost to Users</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    24/7
                  </div>
                  <p className="text-stone-warm">Available Access</p>
                </div>
              </div>
            </section>

            {/* Team Section */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-premium p-8 md:p-12 border border-black/[0.06]">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink mb-8 text-center">
                Built by Career Advocates
              </h2>

              <div className="text-center max-w-3xl mx-auto">
                <p className="text-lg leading-relaxed text-stone-warm mb-6">
                  Our team combines expertise in career development, user
                  experience design, and technology to create tools that truly
                  serve job seekers. We've worked in recruitment, career
                  counseling, and tech development-giving us unique insight into
                  what both candidates and employers need.
                </p>

                <p className="text-lg leading-relaxed text-stone-warm">
                  Every feature we build is tested with real job seekers and
                  validated against current hiring practices. We're not just
                  building software-we're building bridges to career success.
                </p>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="text-center">
              <div className="bg-ink text-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent/[0.07] blur-3xl pointer-events-none" />
                <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-4 relative">
                  Ready to Build Your Professional Resume?
                </h2>
                <p className="text-lg md:text-xl font-extralight text-white/70 mb-8 relative">
                  Join thousands of successful job seekers who've landed their
                  dream roles with our <Link
                    to="/"
                    className="text-white underline hover:text-white/80 font-medium"
                  >
                    easy-to-use resume builder
                  </Link>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
                  <Link
                    to="/templates"
                    className="btn-primary py-4 px-10 text-lg"
                  >
                    Start Building Now
                  </Link>
                  <Link
                    to="/blog"
                    className="inline-block border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-accent transition-all duration-300"
                  >
                    Read Career Tips
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
