import React from "react";
import { Link } from "react-router-dom";
import SEOHead from "./SEOHead";
import { InFeedAd, InContentAd, AD_CONFIG } from "./ads";
import { blogPosts } from "../data/blogPosts";
import RevealSection from "./shared/RevealSection";

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
      <div className="min-h-screen bg-chalk">
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
          {/* Header */}
          <RevealSection variant="fade-up">
            <header className="text-center mb-12 md:mb-16">
              <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase">
                Career Insights
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold text-ink tracking-tight mt-3 mb-4">
                Resume & Career Blog
              </h1>
              <p className="font-display text-lg font-extralight text-stone-warm max-w-3xl mx-auto leading-relaxed">
                Expert advice, tips, and strategies to help you create outstanding
                resumes, navigate your career, and land your dream job.
              </p>
            </header>
          </RevealSection>

          {/* Featured Post — dark premium card */}
          {featuredPost && (
            <RevealSection variant="scale-in" className="mb-16">
              <section>
                <div className="bg-ink rounded-3xl p-8 md:p-12 relative overflow-hidden">
                  {/* Radial accent glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent/[0.07] blur-3xl pointer-events-none" />

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-3 py-1 bg-accent text-ink text-sm font-bold rounded-full">
                        Featured
                      </span>
                      <span className="font-mono text-xs tracking-[0.15em] text-mist uppercase">
                        {featuredPost.category}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="hover:text-accent transition-colors"
                      >
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="font-display font-extralight text-mist text-lg mb-8 leading-relaxed max-w-3xl">
                      {featuredPost.description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-sm text-mist font-mono">
                        <time dateTime={featuredPost.publishDate}>
                          {new Date(
                            featuredPost.publishDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                        <span>&middot;</span>
                        <span>{featuredPost.readTime} read</span>
                      </div>

                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="btn-primary py-3.5 px-8"
                      >
                        Read Article
                        <svg
                          className="w-4 h-4 ml-2"
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
              </section>
            </RevealSection>
          )}

          {/* In-content ad between featured and grid */}
          <InContentAd
            adSlot={AD_CONFIG.slots.blogIncontent}
            size="standard"
            marginY={32}
          />

          {/* All Articles Grid */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-8">
              All Articles
            </h2>
            <RevealSection variant="fade-up" stagger>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => (
                  <React.Fragment key={post.slug}>
                    <article
                      className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
                    >
                      <div className="mb-4 flex items-center gap-2">
                        <span className="font-mono text-[10px] tracking-[0.1em] text-stone-warm uppercase">
                          {post.category}
                        </span>
                        {post.comingSoon && (
                          <span className="px-2.5 py-0.5 bg-accent/20 text-ink text-xs font-medium rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-lg font-extrabold mb-3 leading-tight">
                        {post.comingSoon ? (
                          <span className="text-mist cursor-not-allowed">
                            {post.title}
                          </span>
                        ) : (
                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-ink hover:text-accent transition-colors"
                          >
                            {post.title}
                          </Link>
                        )}
                      </h3>

                      <p className="font-display font-extralight text-stone-warm text-sm mb-4 leading-relaxed">
                        {post.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-mist font-mono">
                          <time dateTime={post.publishDate}>
                            {new Date(post.publishDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </time>
                          <span>&middot;</span>
                          <span>{post.readTime}</span>
                        </div>

                        {post.comingSoon ? (
                          <span className="text-mist text-sm font-medium cursor-not-allowed">
                            Coming Soon
                          </span>
                        ) : (
                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-accent hover:text-ink text-sm font-medium transition-colors"
                          >
                            Read more &rarr;
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
            </RevealSection>
          </section>

          {/* Bottom CTA — dark card */}
          <RevealSection variant="scale-in" className="mt-16">
            <section className="text-center">
              <div className="bg-ink rounded-3xl py-16 md:py-20 px-6 relative overflow-hidden">
                {/* Radial accent glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent/[0.07] blur-3xl pointer-events-none" />

                <div className="relative">
                  <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase">
                    Ready?
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white mt-3 mb-4">
                    Ready to Put These Tips into Action?
                  </h2>
                  <p className="font-display text-lg font-extralight text-mist mb-8 max-w-2xl mx-auto">
                    Create a professional resume in minutes with our free resume
                    builder
                  </p>
                  <Link
                    to="/templates"
                    className="btn-primary py-4 px-10 text-lg"
                  >
                    Start Building Your Resume
                  </Link>
                </div>
              </div>
            </section>
          </RevealSection>
        </div>
      </div>
    </>
  );
}
