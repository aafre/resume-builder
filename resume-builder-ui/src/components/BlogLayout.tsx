import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';
import BlogCTA from './BlogCTA';
import { blogPosts } from '../data/blogPosts';
import AuthorBio from './blog/AuthorBio';
import RelatedArticles from './blog/RelatedArticles';
import RevealSection from './shared/RevealSection';

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

interface BlogLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  publishDate: string;
  lastUpdated?: string;
  readTime: string;
  keywords: string[];
  showBreadcrumbs?: boolean;
  ctaType?: 'resume' | 'interview' | 'general';
}

export default function BlogLayout({
  children,
  title,
  description,
  publishDate,
  lastUpdated,
  readTime,
  keywords,
  showBreadcrumbs = true,
  ctaType = 'general'
}: BlogLayoutProps) {
  // Use origin + pathname to strip query params and hash from canonical URL
  const currentUrl = typeof window !== 'undefined'
    ? window.location.origin + window.location.pathname
    : '';

  return (
    <>
      <SEOHead
        title={`${title} | EasyFreeResume`}
        description={description}
        keywords={keywords.join(', ')}
        canonicalUrl={currentUrl}
        ogType="article"
        articleMeta={{
          publishedTime: publishDate,
          modifiedTime: lastUpdated,
          author: 'EasyFreeResume',
          section: 'Career Advice',
        }}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": title,
          "description": description,
          "datePublished": publishDate,
          ...(lastUpdated && { "dateModified": lastUpdated }),
          "author": {
            "@type": "Organization",
            "name": "EasyFreeResume",
            "url": "https://easyfreeresume.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://easyfreeresume.com/android-chrome-512x512.png"
            }
          },
          "publisher": {
            "@type": "Organization",
            "name": "EasyFreeResume",
            "logo": {
              "@type": "ImageObject",
              "url": "https://easyfreeresume.com/android-chrome-512x512.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentUrl
          },
          "keywords": keywords
        }}
      />
      <article className="min-h-screen bg-chalk">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {showBreadcrumbs && (
          <nav className="mb-6" aria-label="breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-stone-warm">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              </li>
              <li className="text-mist">/</li>
              <li>
                <Link to="/blog" className="hover:text-accent transition-colors">Blog</Link>
              </li>
              <li className="text-mist">/</li>
              <li className="text-ink font-semibold truncate max-w-[200px] sm:max-w-none" title={title}>{title}</li>
            </ol>
          </nav>
        )}

        {/* Header renders immediately — no RevealSection (h1 is LCP candidate) */}
        <header className="mb-8">
          <h1 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold text-ink leading-[1.08] tracking-tight mb-4">
            {title}
          </h1>

          <p className="font-display text-lg md:text-xl font-extralight text-stone-warm leading-relaxed mb-6">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-warm mb-6">
            <time dateTime={publishDate} className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {new Date(publishDate).toLocaleDateString('en-US', dateFormatOptions)}
            </time>

            {lastUpdated && (
              <time dateTime={lastUpdated} className="flex items-center gap-1 text-accent">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Updated {new Date(lastUpdated).toLocaleDateString('en-US', dateFormatOptions)}
              </time>
            )}

            <span className="inline-flex items-center gap-1 bg-accent/[0.06] text-ink/80 px-3 py-1 rounded-full font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {readTime} read
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className={`px-3 py-1 bg-chalk-dark text-stone-warm font-mono text-[10px] tracking-[0.1em] uppercase rounded-full border border-transparent${index >= 5 ? ' hidden sm:inline-flex' : ''}`}
              >
                {keyword}
              </span>
            ))}
            {keywords.length > 5 && (
              <span className="px-3 py-1 text-mist font-mono text-[10px] tracking-[0.1em] sm:hidden">
                +{keywords.length - 5} more
              </span>
            )}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div className="bg-chalk-dark rounded-2xl p-4 sm:p-6 md:p-12 border border-black/[0.04]">
            {children}
          </div>
        </div>

        <RevealSection variant="fade-up">
          <BlogCTA type={ctaType} />
        </RevealSection>

        <RevealSection variant="fade-up">
          <AuthorBio />
        </RevealSection>

        {(() => {
          const slug = typeof window !== 'undefined'
            ? window.location.pathname.replace(/^\/blog\//, '').replace(/\/$/, '')
            : '';
          const currentPost = blogPosts.find((p) => p.slug === slug);
          if (!currentPost) return null;
          return (
            <RevealSection variant="fade-up">
              <RelatedArticles currentSlug={slug} category={currentPost.category} />
            </RevealSection>
          );
        })()}

        <nav className="mt-8 pt-6 border-t border-black/[0.06] flex justify-between items-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-stone-warm hover:text-ink font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Blog
          </Link>
        </nav>
      </div>
      </article>
    </>
  );
}
