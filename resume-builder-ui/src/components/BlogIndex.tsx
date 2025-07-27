import { Link } from "react-router-dom";
import SEOHead from "./SEOHead";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  readTime: string;
  category: string;
  featured?: boolean;
  comingSoon?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    slug: "ai-resume-builder",
    title: "AI Resume Builders: Your Secret Weapon for Job Search in 2025?",
    description:
      "Explore how AI can revolutionize your resume writing, from drafting content to optimizing for ATS, and learn best practices for smart usage in today's job market.",
    publishDate: "2025-07-27",
    readTime: "11 min",
    category: "AI & Tools",
  },
  {
    slug: "resume-mistakes-to-avoid",
    title: "10 Critical Resume Mistakes That Kill Your Job Prospects",
    description:
      "Discover the most common resume errors that send your application straight to the rejection pile and learn how to avoid them.",
    publishDate: "2025-07-25",
    readTime: "7 min",
    category: "Resume Tips",
  },
  {
    slug: "ats-resume-optimization",
    title: "ATS Resume Optimization: Beat the Bots and Land Interviews",
    description:
      "Master the art of creating ATS-friendly resumes that pass automated screening systems and reach human recruiters.",
    publishDate: "2025-07-22",
    readTime: "8 min",
    category: "ATS Optimization",
    featured: true,
  },
  {
    slug: "resume-no-experience",
    title: "How to Write a Resume with No Experience (Entry-Level Guide)",
    description:
      "Land your first job with a compelling resume that showcases your potential, even without professional experience.",
    publishDate: "2025-07-20",
    readTime: "8 min",
    category: "Entry Level",
  },
  {
    slug: "professional-summary-examples",
    title: "Professional Summary Examples: 20+ Winning Templates",
    description:
      "Craft a compelling professional summary that grabs attention with these proven examples and templates.",
    publishDate: "2025-07-18",
    readTime: "12 min",
    category: "Resume Sections",
    featured: false,
  },
  {
    slug: "resume-keywords-guide",
    title: "Resume Keywords by Industry: The Complete 2025 Guide",
    description:
      "Boost your resume visibility with industry-specific keywords that recruiters and ATS systems are looking for.",
    publishDate: "2025-07-15",
    readTime: "6 min",
    category: "Keywords",
  },
  {
    slug: "cover-letter-guide",
    title: "How to Write a Cover Letter That Gets Read in 2025",
    description:
      "Master the art of writing cover letters that stand out, get noticed, and support your resume in the modern job market.",
    publishDate: "2025-07-12",
    readTime: "7 min",
    category: "Job Applications",
    featured: false,
  },
  {
    slug: "remote-work-resume",
    title: "Remote Work Resume: Stand Out in the Digital Job Market",
    description:
      "Optimize your resume for remote positions and showcase the skills that remote employers value most.",
    publishDate: "2025-07-10",
    readTime: "7 min",
    category: "Remote Work",
  },
  {
    slug: "resume-length-guide",
    title: "Resume Length: How Long Should Your Resume Be in 2025?",
    description:
      "Discover the optimal resume length for your experience level and industry, with specific guidelines.",
    publishDate: "2025-07-08",
    readTime: "6 min",
    category: "Resume Format",
  },
  {
    slug: "tech-resume-guide",
    title: "Tech Resume Guide: Land Your Dream Developer Job in 2025",
    description:
      "Create a standout tech resume with industry-specific tips, project showcases, and skill presentations.",
    publishDate: "2025-07-05",
    readTime: "9 min",
    category: "Tech Industry",
  },
  {
    slug: "resume-vs-cv-difference",
    title: "Resume vs CV: Understanding the Key Differences",
    description:
      "Learn when to use a resume versus a CV, and how to format each document for maximum impact.",
    publishDate: "2025-07-02",
    readTime: "5 min",
    category: "Resume Basics",
  },
];

export default function BlogIndex() {
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <>
      <SEOHead
        title="Resume & Career Blog | Expert Tips and Guides | EasyFreeResume"
        description="Get expert career advice, resume writing tips, and job search strategies. Learn how to create ATS-friendly resumes and land your dream job with our comprehensive guides."
        keywords="resume tips, career advice, job search, ATS optimization, professional development, interview tips, career guidance"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "EasyFreeResume Career Blog",
          description: "Expert career advice and resume writing tips",
          url: "https://easyfreeresume.com/blog",
          publisher: {
            "@type": "Organization",
            name: "EasyFreeResume",
          },
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Resume & Career Blog
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Expert advice, tips, and strategies to help you create outstanding
              resumes, navigate your career, and land your dream job.
            </p>
          </header>

          {/* Featured Post */}
          {featuredPost && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Featured Article
              </h2>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                        Featured
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                        {featuredPost.category}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {featuredPost.title}
                      </Link>
                    </h3>

                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                      {featuredPost.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <time dateTime={featuredPost.publishDate}>
                          {new Date(
                            featuredPost.publishDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                        <span>•</span>
                        <span>{featuredPost.readTime} read</span>
                      </div>

                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Read Article
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* All Articles Grid */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              All Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                    {post.comingSoon && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-3 leading-tight">
                    {post.comingSoon ? (
                      <span className="text-gray-500 cursor-not-allowed">
                        {post.title}
                      </span>
                    ) : (
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    )}
                  </h3>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {post.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <time dateTime={post.publishDate}>
                        {new Date(post.publishDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </time>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    {post.comingSoon ? (
                      <span className="text-gray-400 font-medium cursor-not-allowed">
                        Coming Soon
                      </span>
                    ) : (
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Read more →
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Put These Tips into Action?
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Create a professional resume in minutes with our free resume
                builder
              </p>
              <Link
                to="/templates"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Start Building Your Resume
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
