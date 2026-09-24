import { Link } from 'react-router-dom';

interface ComparisonLink {
  path: string;
  label: string;
}

export const ALL_COMPARISONS: ComparisonLink[] = [
  { path: '/easyfreeresume-vs-zety', label: 'Zety Pricing Breakdown' },
  { path: '/blog/resume-io-vs-easy-free-resume', label: 'Resume.io Pricing Breakdown' },
  { path: '/blog/resume-genius-vs-easy-free-resume', label: 'Resume Genius Pricing' },
  { path: '/blog/novoresume-vs-easy-free-resume', label: 'Novoresume Pricing' },
  { path: '/blog/enhancv-vs-easy-free-resume', label: 'Enhancv Pricing' },
  { path: '/blog/canva-resume-vs-easy-free-resume', label: 'Canva Resume Builder Review' },
  { path: '/blog/flowcv-vs-easy-free-resume', label: 'FlowCV Review' },
  { path: '/easyfreeresume-vs-indeed-resume-builder', label: 'Indeed Resume Builder Review' },
];

interface CompareBuildersCrossLinksProps {
  /** Path of the current page to exclude from the list */
  excludePath?: string;
  title?: string;
  description?: string;
  bgColor?: string;
}

export default function CompareBuildersCrossLinks({
  excludePath,
  title = 'Compare Other Resume Builders',
  description = 'See how other popular resume builders compare on pricing, features, and hidden costs:',
  bgColor = 'bg-chalk-dark',
}: CompareBuildersCrossLinksProps) {
  const links = excludePath
    ? ALL_COMPARISONS.filter((c) => c.path !== excludePath)
    : ALL_COMPARISONS;

  return (
    <div className={`${bgColor} rounded-2xl p-6 md:p-8 mt-12`}>
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-4">{title}</h2>
      <p className="font-display font-extralight text-ink/60 mb-4">{description}</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="flex items-baseline gap-3 min-h-11 py-2 text-accent-text font-medium underline underline-offset-4 decoration-accent-text/30 hover:decoration-accent-text transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
