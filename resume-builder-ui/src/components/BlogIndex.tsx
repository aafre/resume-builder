import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEOHead from "./SEOHead";
import { InFeedAd, InContentAd, AD_CONFIG } from "./ads";
import { blogPosts } from "../data/blogPosts";
import RevealSection from "./shared/RevealSection";
import { withViewTransition } from "../lib/viewTransition";

const ALL = "All";

/** Slugs are unique, so this is a stable per-card morph identity. */
const cardTransitionName = (slug: string) =>
  `post-${slug.replace(/[^a-z0-9]/gi, "-")}`;

export default function BlogIndex() {
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = useMemo(
    () => blogPosts.filter((post) => !post.featured),
    []
  );

  const [category, setCategory] = useState<string>(ALL);
  const slabRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Categories in first-appearance order — the array is hand-ordered, and
  // alphabetising it would throw away that editorial sequencing.
  const categories = useMemo(() => {
    const seen: string[] = [];
    regularPosts.forEach((p) => {
      if (!seen.includes(p.category)) seen.push(p.category);
    });
    return seen;
  }, [regularPosts]);

  const visiblePosts =
    category === ALL
      ? regularPosts
      : regularPosts.filter((p) => p.category === category);

  // The cards morph to their new positions instead of snapping. Firefox and
  // reduced motion cut cleanly — withViewTransition() no-ops in both.
  const selectCategory = (next: string) => {
    withViewTransition(() => setCategory(next));
  };

  // Light follows the pointer across the featured slab. rAF-throttled, writes
  // two custom properties on one element: no layout, no paint elsewhere.
  const handleSlabPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = slabRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty("--glow-x", `${x}px`);
      el.style.setProperty("--glow-y", `${y}px`);
    });
  };

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
              <span className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase">
                Career Insights
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold text-ink tracking-tight mt-3 mb-4">
                Resume & Career Blog
              </h1>
              <p className="font-display text-lg font-extralight text-ink/60 max-w-3xl mx-auto leading-relaxed">
                Expert advice, tips, and strategies to help you create outstanding
                resumes, navigate your career, and land your dream job.
              </p>
            </header>
          </RevealSection>

          {/* Featured Post — dark premium card */}
          {featuredPost && (
            <RevealSection variant="scale-in" className="mb-16">
              <section>
                <div
                  ref={slabRef}
                  onPointerMove={handleSlabPointer}
                  className="bg-ink rounded-3xl p-8 md:p-12 relative overflow-hidden"
                >
                  {/* Accent glow — follows the cursor on a mouse, parked at
                      centre on touch and under reduced motion. */}
                  <div className="featured-slab-glow" />

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-3 py-1 bg-accent text-ink text-sm font-bold rounded-full">
                        Featured
                      </span>
                      <span className="font-mono text-xs tracking-[0.15em] text-white/60 uppercase">
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

                    <p className="font-display font-extralight text-white/60 text-lg mb-8 leading-relaxed max-w-3xl">
                      {featuredPost.description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-sm text-white/60 font-mono tabular-nums">
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
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink">
                All Articles
              </h2>
              <span className="font-mono text-xs tracking-[0.15em] text-ink/60 uppercase tabular-nums">
                {visiblePosts.length}
                {category === ALL ? " articles" : ` in ${category}`}
              </span>
            </div>

            {/* Category rail. Client-side only — no route, no query param, so
                nothing crawlable moves. */}
            <div
              className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 pb-2 mb-8 sm:flex-wrap sm:mx-0 sm:px-0 sm:overflow-visible"
              role="group"
              aria-label="Filter articles by category"
            >
              {[ALL, ...categories].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => selectCategory(c)}
                  aria-pressed={category === c}
                  className="category-chip"
                >
                  {c}
                </button>
              ))}
            </div>

            {/* data-reveal-stagger belongs on the element whose children are
                the cards — RevealSection's own child is this grid, so the
                delays landed on nothing when it was set via the prop. */}
            <RevealSection variant="fade-up">
              <div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                data-reveal-stagger
              >
                {visiblePosts.map((post, index) => (
                  <React.Fragment key={post.slug}>
                    <article
                      className="post-card flex flex-col bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
                      style={
                        {
                          viewTransitionName: cardTransitionName(post.slug),
                          viewTransitionClass: "post-card-vt",
                        } as React.CSSProperties
                      }
                    >
                      <div className="mb-4 flex items-center gap-2">
                        <span className="font-mono text-[10px] tracking-[0.1em] text-ink/60 uppercase">
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
                          <span className="text-ink/60 cursor-not-allowed">
                            {post.title}
                          </span>
                        ) : (
                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-ink hover:text-accent-text transition-colors"
                          >
                            {post.title}
                          </Link>
                        )}
                      </h3>

                      <p className="font-display font-extralight text-ink/60 text-sm mb-4 leading-relaxed">
                        {post.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-ink/60 font-mono tabular-nums">
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
                          <span className="text-ink/60 text-sm font-medium cursor-not-allowed">
                            Coming Soon
                          </span>
                        ) : (
                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-accent-text hover:text-ink text-sm font-medium transition-colors"
                          >
                            Read more &rarr;
                          </Link>
                        )}
                      </div>
                    </article>
                    {/* Insert in-feed ad after every 4 posts, starting from position 3 (0-indexed) */}
                    {(index + 1) % 4 === 0 && index >= 3 && (
                      <InFeedAd
                        key={`ad-${post.slug}`}
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
                  <p className="font-display text-lg font-extralight text-white/60 mb-8 max-w-2xl mx-auto">
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
