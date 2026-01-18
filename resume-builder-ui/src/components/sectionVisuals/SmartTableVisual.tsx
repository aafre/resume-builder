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
      {/* Header row background strip */}
      <rect x="8" y="12" width="184" height="24" rx="4" fill="#F3F4F6" />

      {/* 3-column grid layout */}
      {/* Header row - bold */}
      <rect x="16" y="18" width="48" height="12" rx="2" fill="#4B5563" />
      <rect x="76" y="18" width="48" height="12" rx="2" fill="#4B5563" />
      <rect x="136" y="18" width="48" height="12" rx="2" fill="#4B5563" />

      {/* Data row 1 */}
      <rect x="16" y="46" width="48" height="8" rx="2" fill="#9CA3AF" />
      <rect x="76" y="46" width="48" height="8" rx="2" fill="#9CA3AF" />
      <rect x="136" y="46" width="48" height="8" rx="2" fill="#9CA3AF" />

      {/* Data row 2 */}
      <rect x="16" y="64" width="48" height="8" rx="2" fill="#D1D5DB" />
      <rect x="76" y="64" width="48" height="8" rx="2" fill="#D1D5DB" />
      <rect x="136" y="64" width="48" height="8" rx="2" fill="#D1D5DB" />

      {/* Data row 3 */}
      <rect x="16" y="82" width="48" height="8" rx="2" fill="#D1D5DB" />
      <rect x="76" y="82" width="48" height="8" rx="2" fill="#D1D5DB" />
      <rect x="136" y="82" width="48" height="8" rx="2" fill="#D1D5DB" />

      {/* Data row 4 (lighter to show continuation) */}
      <rect x="16" y="100" width="48" height="8" rx="2" fill="#E5E7EB" />
      <rect x="76" y="100" width="48" height="8" rx="2" fill="#E5E7EB" />
      <rect x="136" y="100" width="48" height="8" rx="2" fill="#E5E7EB" />
    </svg>
  );
};

export default SmartTableVisual;
