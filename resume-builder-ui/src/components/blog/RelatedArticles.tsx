import { Link } from 'react-router-dom';
import { blogPosts } from '../../data/blogPosts';

interface RelatedArticlesProps {
  currentSlug: string;
  category: string;
  maxArticles?: number;
}

export default function RelatedArticles({ currentSlug, category, maxArticles = 3 }: RelatedArticlesProps) {
  // Same category, excluding current post and comingSoon
  const sameCategoryPosts = blogPosts.filter(
    (p) => p.category === category && p.slug !== currentSlug && !p.comingSoon
  );

  // Backfill from other categories sorted by publishDate desc
  const otherPosts = blogPosts
    .filter((p) => p.category !== category && p.slug !== currentSlug && !p.comingSoon)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  const related = [...sameCategoryPosts, ...otherPosts].slice(0, maxArticles);

  if (related.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Reading</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {related.map((post) => (
          <article
            key={post.slug}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="mb-3">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                {post.category}
              </span>
            </div>

            <h3 className="text-lg font-bold mb-2 leading-tight">
              <Link
                to={`/blog/${post.slug}`}
                className="text-gray-900 hover:text-accent transition-colors"
              >
                {post.title}
              </Link>
            </h3>

            <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
              {post.description}
            </p>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <time dateTime={post.publishDate}>
                {new Date(post.publishDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
              <span>&middot;</span>
              <span>{post.readTime} read</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
