import { Link } from "react-router-dom";
import SEOHead from "./SEOHead";

export default function AboutUs() {
  return (
    <>
      <SEOHead
        title="About EasyFreeResume | Our Mission to Democratize Career Success"
        description="Learn about EasyFreeResume's mission to provide completely free, professional-quality resume tools. Discover our values, impact, and commitment to your career success."
        keywords="about us, free resume tools, career success, democratize hiring, professional resumes, company mission"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-800 font-medium">About Us</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About EasyFreeResume
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              We're on a mission to democratize career opportunities by
              providing everyone with the tools to create professional,
              impactful resumes - completely free.
            </p>
          </header>

          {/* Main Content */}
          <div className="space-y-16">
            {/* Our Story */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="prose prose-lg prose-slate max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  EasyFreeResume was born from a simple observation: creating a
                  professional resume shouldn't be expensive, complicated, or
                  restricted by subscription barriers. Too many talented
                  individuals were being held back by inadequate resume tools or
                  costly alternatives that put professional presentation out of
                  reach.
                </p>

                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  Our founders experienced this frustration firsthand-watching
                  qualified candidates struggle with outdated templates, limited
                  customization options, and hidden fees. We knew there had to
                  be a better way.
                </p>

                <p className="text-lg leading-relaxed text-gray-700">
                  That's why we built EasyFreeResume: a completely free,
                  professional-grade resume builder that puts powerful tools in
                  everyone's hands. No subscriptions, no hidden costs, no limits
                  on downloads-just the resources you need to present your best
                  professional self.
                </p>
              </div>
            </section>

            {/* Our Mission */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl p-8 md:p-12">
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
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="text-blue-600 text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Accessibility First
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Professional tools shouldn't be luxury items. We're committed
                  to keeping our platform completely free and accessible to
                  everyone, everywhere.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="text-green-600 text-3xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Privacy Protected
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Your personal information and career data belong to you. We
                  don't store, sell, or share your information. You're always in
                  complete control.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="text-purple-600 text-3xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Simplicity & Power
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We believe powerful tools can be simple to use. Our interface
                  prioritizes ease of use without sacrificing the professional
                  quality you need.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="text-orange-600 text-3xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Continuous Growth
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We're constantly improving our platform based on user feedback
                  and evolving job market needs. Your success drives our
                  innovation.
                </p>
              </div>
            </section>

            {/* What Makes Us Different */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                What Makes Us Different
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Truly Free
                  </h3>
                  <p className="text-gray-700">
                    No hidden fees, premium tiers, or subscription traps.
                    Everything you need is completely free, forever.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ATS-Optimized
                  </h3>
                  <p className="text-gray-700">
                    Our templates are designed to pass Applicant Tracking
                    Systems, ensuring your resume reaches human recruiters.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Education-Focused
                  </h3>
                  <p className="text-gray-700">
                    Beyond tools, we provide comprehensive guides, tips, and
                    resources to help you succeed in your job search.
                  </p>
                </div>
              </div>
            </section>

            {/* Impact Stats */}
            <section className="bg-gray-50 rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Our Impact
              </h2>

              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    95%
                  </div>
                  <p className="text-gray-700">User Satisfaction</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    $0
                  </div>
                  <p className="text-gray-700">Cost to Users</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    24/7
                  </div>
                  <p className="text-gray-700">Available Access</p>
                </div>
              </div>
            </section>

            {/* Team Section */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Built by Career Advocates
              </h2>

              <div className="text-center max-w-3xl mx-auto">
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  Our team combines expertise in career development, user
                  experience design, and technology to create tools that truly
                  serve job seekers. We've worked in recruitment, career
                  counseling, and tech development-giving us unique insight into
                  what both candidates and employers need.
                </p>

                <p className="text-lg leading-relaxed text-gray-700">
                  Every feature we build is tested with real job seekers and
                  validated against current hiring practices. We're not just
                  building software-we're building bridges to career success.
                </p>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Build Your Professional Resume?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of successful job seekers who've landed their
                  dream roles
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/templates"
                    className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Start Building Now
                  </Link>
                  <Link
                    to="/blog"
                    className="inline-block border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
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
