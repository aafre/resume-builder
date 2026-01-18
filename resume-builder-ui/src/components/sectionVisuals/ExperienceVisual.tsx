interface ExperienceVisualProps {
  className?: string;
}

const ExperienceVisual: React.FC<ExperienceVisualProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Title bar (left) */}
      <rect x="16" y="16" width="90" height="10" rx="2" fill="#9CA3AF" />
      {/* Date (right) */}
      <rect x="140" y="16" width="44" height="10" rx="2" fill="#D1D5DB" />
      {/* Subtitle */}
      <rect x="16" y="32" width="70" height="8" rx="2" fill="#D1D5DB" />
      {/* Bullet point 1 */}
      <circle cx="22" cy="54" r="3" fill="#9CA3AF" />
      <rect x="32" y="50" width="140" height="8" rx="2" fill="#E5E7EB" />
      {/* Bullet point 2 */}
      <circle cx="22" cy="72" r="3" fill="#9CA3AF" />
      <rect x="32" y="68" width="120" height="8" rx="2" fill="#E5E7EB" />
      {/* Bullet point 3 */}
      <circle cx="22" cy="90" r="3" fill="#9CA3AF" />
      <rect x="32" y="86" width="130" height="8" rx="2" fill="#E5E7EB" />
    </svg>
  );
};

export default ExperienceVisual;
