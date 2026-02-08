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
      <h2 className="font-display text-2xl font-extrabold text-ink mb-6">Continue Reading</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {related.map((post) => (
          <article
            key={post.slug}
            className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
          >
            <div className="mb-3">
              <span className="font-mono text-[10px] tracking-[0.1em] text-stone-warm uppercase">
                {post.category}
              </span>
            </div>

            <h3 className="font-display text-base font-extrabold mb-2 leading-tight">
              <Link
                to={`/blog/${post.slug}`}
                className="text-ink hover:text-accent transition-colors"
              >
                {post.title}
              </Link>
            </h3>

            <p className="font-display font-extralight text-stone-warm text-sm mb-4 leading-relaxed line-clamp-2">
              {post.description}
            </p>

            <div className="flex items-center gap-3 text-[11px] text-mist font-mono">
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
