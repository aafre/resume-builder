interface EducationVisualProps {
  className?: string;
}

const EducationVisual: React.FC<EducationVisualProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Degree title */}
      <rect x="16" y="24" width="100" height="12" rx="2" fill="#9CA3AF" />
      {/* School name */}
      <rect x="16" y="44" width="80" height="10" rx="2" fill="#D1D5DB" />
      {/* Date (right aligned) */}
      <rect x="140" y="24" width="44" height="10" rx="2" fill="#D1D5DB" />
      {/* Field of study / additional info */}
      <rect x="16" y="64" width="120" height="8" rx="2" fill="#E5E7EB" />
      {/* GPA or honors (optional) */}
      <rect x="16" y="80" width="60" height="8" rx="2" fill="#E5E7EB" />
    </svg>
  );
};

export default EducationVisual;
