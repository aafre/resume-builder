interface SmartTableVisualProps {
  className?: string;
}

const SmartTableVisual: React.FC<SmartTableVisualProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 3-column grid layout */}
      {/* Header row */}
      <rect x="16" y="20" width="50" height="10" rx="2" fill="#9CA3AF" />
      <rect x="76" y="20" width="50" height="10" rx="2" fill="#9CA3AF" />
      <rect x="136" y="20" width="50" height="10" rx="2" fill="#9CA3AF" />
      {/* Data row 1 */}
      <rect x="16" y="44" width="50" height="8" rx="2" fill="#D1D5DB" />
      <rect x="76" y="44" width="50" height="8" rx="2" fill="#D1D5DB" />
      <rect x="136" y="44" width="50" height="8" rx="2" fill="#D1D5DB" />
      {/* Data row 2 */}
      <rect x="16" y="64" width="50" height="8" rx="2" fill="#D1D5DB" />
      <rect x="76" y="64" width="50" height="8" rx="2" fill="#D1D5DB" />
      <rect x="136" y="64" width="50" height="8" rx="2" fill="#D1D5DB" />
      {/* Data row 3 */}
      <rect x="16" y="84" width="50" height="8" rx="2" fill="#E5E7EB" />
      <rect x="76" y="84" width="50" height="8" rx="2" fill="#E5E7EB" />
      <rect x="136" y="84" width="50" height="8" rx="2" fill="#E5E7EB" />
    </svg>
  );
};

export default SmartTableVisual;
