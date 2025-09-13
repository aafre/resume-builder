import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';
import BlogCTA from './BlogCTA';

interface BlogLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  publishDate: string;
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
  readTime, 
  keywords,
  showBreadcrumbs = true,
  ctaType = 'general'
}: BlogLayoutProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  return (
    <>
      <SEOHead
        title={`${title} | EasyFreeResume Blog`}
        description={description}
        keywords={keywords.join(', ')}
        canonicalUrl={currentUrl}
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": title,
          "description": description,
          "datePublished": publishDate,
          "author": {
            "@type": "Organization",
            "name": "EasyFreeResume"
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
      <article className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {showBreadcrumbs && (
          <nav className="mb-6" aria-label="breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-800 font-medium">{title}</li>
            </ol>
          </nav>
        )}

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
            {description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <time dateTime={publishDate} className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {new Date(publishDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
            
            <span className="flex items-center gap-1">
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
                className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-lg prose-slate max-w-none">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200">
            {children}
          </div>
        </div>

        <BlogCTA type={ctaType} />

        <nav className="mt-8 flex justify-between items-center">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
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