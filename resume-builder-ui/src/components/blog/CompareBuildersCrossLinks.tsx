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
    <div className={`${bgColor} rounded-xl p-6 mt-12`}>
      <h2 className="font-display text-2xl font-extrabold text-ink mb-4">{title}</h2>
      <p className="font-display font-extralight text-stone-warm mb-4">{description}</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link to={link.path} className="text-accent hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
