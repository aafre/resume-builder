interface CertificationVisualProps {
  className?: string;
}

const CertificationVisual: React.FC<CertificationVisualProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Row 1: icon square + text lines */}
      <rect x="16" y="16" width="24" height="24" rx="4" fill="#9CA3AF" />
      <rect x="48" y="18" width="100" height="10" rx="2" fill="#9CA3AF" />
      <rect x="48" y="32" width="70" height="6" rx="2" fill="#D1D5DB" />
      {/* Row 2: icon square + text lines */}
      <rect x="16" y="50" width="24" height="24" rx="4" fill="#D1D5DB" />
      <rect x="48" y="52" width="90" height="10" rx="2" fill="#D1D5DB" />
      <rect x="48" y="66" width="60" height="6" rx="2" fill="#E5E7EB" />
      {/* Row 3: icon square + text lines */}
      <rect x="16" y="84" width="24" height="24" rx="4" fill="#E5E7EB" />
      <rect x="48" y="86" width="80" height="10" rx="2" fill="#E5E7EB" />
      <rect x="48" y="100" width="50" height="6" rx="2" fill="#E5E7EB" />
    </svg>
  );
};

export default CertificationVisual;
