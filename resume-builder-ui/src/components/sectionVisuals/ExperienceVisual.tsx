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
      {/* Header row with left-right split */}
      {/* Left: Bold Job Title */}
      <rect x="12" y="12" width="85" height="12" rx="2" fill="#4B5563" />
      {/* Right: Date range */}
      <rect x="140" y="13" width="48" height="10" rx="2" fill="#9CA3AF" />

      {/* Company name - lighter weight */}
      <rect x="12" y="28" width="65" height="8" rx="2" fill="#9CA3AF" />

      {/* Divider line (subtle) */}
      <line x1="12" y1="42" x2="188" y2="42" stroke="#E5E7EB" strokeWidth="1" />

      {/* Bullet point 1 - with proper dot */}
      <circle cx="18" cy="54" r="2.5" fill="#6B7280" />
      <rect x="28" y="50" width="155" height="7" rx="2" fill="#D1D5DB" />

      {/* Bullet point 2 */}
      <circle cx="18" cy="70" r="2.5" fill="#6B7280" />
      <rect x="28" y="66" width="140" height="7" rx="2" fill="#D1D5DB" />

      {/* Bullet point 3 */}
      <circle cx="18" cy="86" r="2.5" fill="#6B7280" />
      <rect x="28" y="82" width="130" height="7" rx="2" fill="#E5E7EB" />

      {/* Bullet point 4 (partial/lighter to show continuation) */}
      <circle cx="18" cy="102" r="2.5" fill="#9CA3AF" />
      <rect x="28" y="98" width="110" height="7" rx="2" fill="#E5E7EB" />
    </svg>
  );
};

export default ExperienceVisual;
