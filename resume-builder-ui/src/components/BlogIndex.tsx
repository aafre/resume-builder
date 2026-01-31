import React from "react";
import { Link } from "react-router-dom";
import SEOHead from "./SEOHead";
import { InFeedAd, InContentAd, AD_CONFIG } from "./ads";

const CURRENT_YEAR = new Date().getFullYear();

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
  // New AI Blog Content (Featured)
  {
    slug: "chatgpt-resume-prompts",
    title: "25+ ChatGPT Prompts for Resume Writing (Copy & Paste Ready)",
    description: "Get the best ChatGPT prompts for writing resume summaries, experience bullets, skills sections, and more. Copy-paste ready prompts that actually work in 2026.",
    publishDate: "2026-01-21",
    readTime: "12 min",
    category: "AI & Tools",
    featured: true,
  },
  {
    slug: "ai-resume-writing-guide",
    title: "AI Resume Writing: The Complete 2026 Guide (ChatGPT, Claude, Gemini & More)",
    description: "Master AI-powered resume writing with ChatGPT, Claude, Gemini, and Grok. Learn the best tools, prompts, and strategies for creating resumes that get interviews.",
    publishDate: "2026-01-21",
    readTime: "15 min",
    category: "AI & Tools",
  },
  {
    slug: "claude-resume-prompts",
    title: "15+ Claude AI Prompts for Resume Writing (2026)",
    description: "Get the best Claude prompts for writing professional resumes. Claude excels at nuanced, professional writing. Copy-paste these prompts for better results.",
    publishDate: "2026-01-21",
    readTime: "10 min",
    category: "AI & Tools",
  },
  {
    slug: "gemini-resume-prompts",
    title: "Google Gemini Prompts for Resume Writing (2026)",
    description: "Best Gemini AI prompts for resume writing. Leverage Google's AI for job description analysis, keyword extraction, and resume optimization.",
    publishDate: "2026-01-21",
    readTime: "8 min",
    category: "AI & Tools",
  },
  {
    slug: "grok-resume-prompts",
    title: "Grok AI Prompts for Resume Writing (2026)",
    description: "Use Grok AI (xAI) for fast resume writing with a conversational approach. Best prompts for quick iterations and real-time resume feedback.",
    publishDate: "2026-01-21",
    readTime: "7 min",
    category: "AI & Tools",
  },
  {
    slug: "ai-job-description-analyzer",
    title: "How to Use AI to Analyze Job Descriptions (Extract Keywords & Requirements)",
    description: "Learn to use AI tools like ChatGPT and Claude to extract keywords, identify requirements, and decode what employers really want from job descriptions.",
    publishDate: "2026-01-21",
    readTime: "9 min",
    category: "AI & Tools",
  },
  {
    slug: "ai-resume-review",
    title: "How to Use AI to Review Your Resume (Get Feedback Before Applying)",
    description: "Learn to use ChatGPT, Claude, and other AI tools to review your resume for errors, improvements, and ATS optimization before submitting applications.",
    publishDate: "2026-01-21",
    readTime: "8 min",
    category: "AI & Tools",
  },
  // Existing posts
  {
    slug: "job-interview-guide",
    title: "The Ultimate Guide to Nailing Your Next Job Interview",
    description: "A comprehensive guide covering everything from pre-interview research and common questions to post-interview follow-up etiquette.",
    publishDate: "2025-09-05",
    readTime: "7 min",
    category: "Interview Prep",
  },
  {
    slug: "behavioral-interview-questions",
    title: "15+ Behavioral Interview Questions (and How to Answer with the STAR Method)",
    description: "Prepare for tough behavioral questions by mastering the STAR method with these common examples and answer frameworks.",
    publishDate: "2025-09-02",
    readTime: "6 min",
    category: "Interview Prep",
  },
  {
    slug: "introducing-prepai-ai-interview-coach",
    title: "Don't Just Prepare, PrepAI: Introducing Your AI Interview Coach",
    description: "Move beyond standard interview advice. Discover how PrepAI, our new AI-powered tool, provides instant, personalized feedback to help you ace your next interview.",
    publishDate: "2025-08-30",
    readTime: "6 min",
    category: "AI & Tools",
  },
  {
    slug: "how-to-write-a-resume-guide",
    title: `How to Write a Resume in ${CURRENT_YEAR}: The Complete Step-by-Step Guide`,
    description: "From a blank page to a finished, professional resume, this guide covers every section, formatting rule, and writing tip you need to know.",
    publishDate: "2025-08-25",
    readTime: "8 min",
    category: "Resume Writing",
  },
  {
    slug: "resume-action-verbs",
    title: "Action Verbs for Resumes: 200+ Words to Boost Your Impact",
    description: "Replace boring words with powerful action verbs that grab recruiters' attention and showcase your accomplishments.",
    publishDate: "2025-08-20",
    readTime: "9 min",
    category: "Resume Sections",
  },
  {
    slug: "ai-resume-builder",
    title: `AI Resume Builders: Your Secret Weapon for Job Search in ${CURRENT_YEAR}?`,
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
    featured: false,
  },
  {
    slug: "resume-no-experience",
    title: "Resume with No Experience: Real Examples + Free Template",
    description:
      "How to write an ATS-friendly, confidence-boosting resume when you're just starting out. Includes copy-paste examples and free template.",
    publishDate: "2025-07-20",
    readTime: "10–14 min",
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
    title: `Resume Keywords by Industry: The Complete ${CURRENT_YEAR} Guide`,
    description:
      `The definitive guide to resume keywords recruiters and ATS systems are scanning for in ${CURRENT_YEAR}.`,
    publishDate: "2025-07-15",
    readTime: "9–11 min",
    category: "Keywords",
  },
  {
    slug: "cover-letter-guide",
    title: `How to Write a Cover Letter That Gets Read in ${CURRENT_YEAR}`,
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
    title: `Resume Length: How Long Should Your Resume Be in ${CURRENT_YEAR}?`,
    description:
      "Discover the optimal resume length for your experience level and industry, with specific guidelines.",
    publishDate: "2025-07-08",
    readTime: "6 min",
    category: "Resume Format",
  },
  {
    slug: "tech-resume-guide",
    title: `Tech Resume Guide: Land Your Dream Developer Job in ${CURRENT_YEAR}`,
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
  {
    slug: "how-to-use-resume-keywords",
    title: `How to Use Resume Keywords to Beat the ATS (The Ultimate ${CURRENT_YEAR} Guide)`,
    description: "A deep dive into finding and using the right keywords to ensure your resume gets past applicant tracking systems and into human hands. Your master guide to ATS optimization.",
    publishDate: "2025-08-15",
    readTime: "11 min",
    category: "Keywords",
    featured: false,
  },
  {
    slug: "software-engineer-resume-keywords",
    title: "50+ Essential Keywords for a Software Engineer Resume",
    description: "From programming languages to agile methodologies, these are the must-have keywords that will get your software engineering resume noticed by top tech companies.",
    publishDate: "2025-08-10",
    readTime: "9 min",
    category: "Tech Industry",
  },
  {
    slug: "customer-service-resume-keywords",
    title: "Top Keywords for Customer Service Resumes (with Examples)",
    description: "Elevate your customer service resume by including the keywords recruiters are searching for, from CRM platforms to conflict resolution skills.",
    publishDate: "2025-08-05",
    readTime: "9 min",
    category: "Keywords",
  },
  {
    slug: "how-why-easyfreeresume-completely-free",
    title: "How (and Why) is EasyFreeResume Completely Free?",
    description: "No paywalls, no hidden fees, no premium upgrades. We break down why we built a truly free resume builder and how we are committed to keeping it that way.",
    publishDate: "2025-08-01",
    readTime: "8 min",
    category: "Company",
  },
  {
    slug: "zety-vs-easy-free-resume",
    title: "Zety Pricing 2026: Why Pay? Use This 100% Free Alternative Instead",
    description: "Looking for Zety pricing? Don't get locked into a $5.95-$23.95/month subscription. EasyFreeResume offers the same ATS templates for $0. No hidden fees, no watermarks.",
    publishDate: "2025-07-28",
    readTime: "9 min",
    category: "Comparisons",
  },
  {
    slug: "resume-io-vs-easy-free-resume",
    title: "Resume.io Pricing 2026: Free Alternative That Does More",
    description: "Resume.io costs $2.95-$24.95/month for downloads. EasyFreeResume offers the same ATS templates for $0. Compare features, privacy, and see why free wins.",
    publishDate: "2026-01-21",
    readTime: "8 min",
    category: "Comparisons",
  },
  {
    slug: "resume-genius-vs-easy-free-resume",
    title: "Resume Genius Pricing 2026: Is $7.95/Month Worth It? (Free Alternative)",
    description: "Resume Genius charges $7.95-$39.95/month for PDF downloads. See how EasyFreeResume offers the same ATS templates completely free with better privacy.",
    publishDate: "2026-01-21",
    readTime: "8 min",
    category: "Comparisons",
  },
  {
    slug: "novoresume-vs-easy-free-resume",
    title: "NovoResume Pricing 2026: Premium Templates Free Alternative",
    description: "NovoResume's premium plans cost $16-$99/year. Compare features with EasyFreeResume, a 100% free alternative with ATS-friendly templates and better privacy.",
    publishDate: "2026-01-21",
    readTime: "7 min",
    category: "Comparisons",
  },
  {
    slug: "enhancv-vs-easy-free-resume",
    title: "Enhancv Pricing 2026: Is $9.99/Month Worth It? Free Alternative Compared",
    description: "Enhancv costs $9.99-$24.99/month for premium features. Compare with EasyFreeResume, a free alternative with ATS-friendly templates and complete privacy.",
    publishDate: "2026-01-21",
    readTime: "7 min",
    category: "Comparisons",
  },
  {
    slug: "canva-resume-vs-easy-free-resume",
    title: "Canva Resume Templates 2026: Why They Fail ATS (Better Alternative)",
    description: "Canva's free resume templates look great but often fail ATS scans. Learn why and discover EasyFreeResume, a free alternative designed for ATS compatibility.",
    publishDate: "2026-01-21",
    readTime: "8 min",
    category: "Comparisons",
  },
  {
    slug: "flowcv-vs-easy-free-resume",
    title: "FlowCV vs EasyFreeResume 2026: Which Free Resume Builder is Better?",
    description: "Both FlowCV and EasyFreeResume offer free resume building. Compare features, privacy, and templates to see which free option is truly better for your job search.",
    publishDate: "2026-01-21",
    readTime: "7 min",
    category: "Comparisons",
  },
  {
    slug: "how-to-list-skills",
    title: "How to List Skills on a Resume: A Step-by-Step Guide (100+ Examples)",
    description: "Master the art of creating a powerful skills section. Learn what to include, how to format it, and get inspired with over 100 examples for any industry.",
    publishDate: "2025-07-23",
    readTime: "12 min",
    category: "Resume Sections",
  },
  {
    slug: "quantify-resume-accomplishments",
    title: "How to Quantify Your Resume Accomplishments (Even If You're Not a Numbers Person)",
    description: "Learn simple formulas and strategies to turn your job duties into powerful, data-driven achievements that impress recruiters and demonstrate your true impact.",
    publishDate: "2025-07-16",
    readTime: "7 min",
    category: "Resume Writing",
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

          {/* In-content ad between featured and grid */}
          <InContentAd
            adSlot={AD_CONFIG.slots.blogIncontent}
            size="standard"
            marginY={32}
          />

          {/* All Articles Grid */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              All Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <React.Fragment key={post.slug}>
                  <article
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
                  {/* Insert in-feed ad after every 4 posts, starting from position 3 (0-indexed) */}
                  {(index + 1) % 4 === 0 && index >= 3 && (
                    <InFeedAd
                      adSlot={AD_CONFIG.slots.blogInfeed}
                      layout="card"
                      className="rounded-2xl"
                    />
                  )}
                </React.Fragment>
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
