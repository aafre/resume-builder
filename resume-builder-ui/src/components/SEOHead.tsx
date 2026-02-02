import { Helmet } from 'react-helmet-async';

interface HreflangLink {
  hreflang: string;
  href: string;
}

interface ArticleMeta {
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
  hreflangLinks?: HreflangLink[];
  ogLocale?: string;
  articleMeta?: ArticleMeta;
}

const BASE_URL = 'https://easyfreeresume.com';

export default function SEOHead({
  title = "Free Professional Resume Builder | EasyFreeResume",
  description = "Create professional, ATS-friendly resumes in minutes with our completely free resume builder. No subscriptions, no hidden fees, unlimited downloads.",
  keywords = "free resume builder, professional resume, ATS resume, resume template, job application, career tools",
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = `${BASE_URL}/android-chrome-512x512.png`,
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData,
  hreflangLinks,
  ogLocale = "en_US",
  articleMeta,
}: SEOHeadProps) {
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  // Use origin + pathname to strip query params and hash from canonical URL
  const currentUrl = typeof window !== 'undefined'
    ? BASE_URL + window.location.pathname.replace(/\/+$/, '')
    : '';
  const finalCanonicalUrl = canonicalUrl || currentUrl;
  // Ensure ogImage is an absolute URL
  const finalOgImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="EasyFreeResume" />

      {/* Canonical URL */}
      {finalCanonicalUrl && <link rel="canonical" href={finalCanonicalUrl} />}

      {/* Hreflang Tags for International SEO */}
      {hreflangLinks && hreflangLinks.map((link) => (
        <link key={link.hreflang} rel="alternate" hrefLang={link.hreflang} href={link.href} />
      ))}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:site_name" content="EasyFreeResume" />
      <meta property="og:locale" content={ogLocale} />

      {/* Article-specific OG tags for blog posts */}
      {articleMeta?.publishedTime && (
        <meta property="article:published_time" content={articleMeta.publishedTime} />
      )}
      {articleMeta?.modifiedTime && (
        <meta property="article:modified_time" content={articleMeta.modifiedTime} />
      )}
      {articleMeta?.author && (
        <meta property="article:author" content={articleMeta.author} />
      )}
      {articleMeta?.section && (
        <meta property="article:section" content={articleMeta.section} />
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}