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
      {/* Row 1: Logo icon + Certification title + Issuer */}
      <rect x="12" y="12" width="28" height="28" rx="4" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1" />
      {/* Icon placeholder detail (abstract logo) */}
      <rect x="18" y="20" width="16" height="4" rx="1" fill="#9CA3AF" />
      <rect x="18" y="27" width="10" height="4" rx="1" fill="#9CA3AF" />
      {/* Certification title - bold */}
      <rect x="48" y="14" width="110" height="10" rx="2" fill="#4B5563" />
      {/* Issuer - lighter */}
      <rect x="48" y="28" width="75" height="7" rx="2" fill="#9CA3AF" />

      {/* Row 2: Logo icon + Certification title + Issuer */}
      <rect x="12" y="50" width="28" height="28" rx="4" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1" />
      {/* Icon placeholder detail */}
      <circle cx="26" cy="64" r="8" fill="#D1D5DB" />
      {/* Certification title */}
      <rect x="48" y="52" width="95" height="10" rx="2" fill="#4B5563" />
      {/* Issuer */}
      <rect x="48" y="66" width="65" height="7" rx="2" fill="#9CA3AF" />

      {/* Row 3: Logo icon + Certification title + Issuer */}
      <rect x="12" y="88" width="28" height="28" rx="4" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1" />
      {/* Icon placeholder detail */}
      <rect x="19" y="96" width="14" height="12" rx="2" fill="#D1D5DB" />
      {/* Certification title */}
      <rect x="48" y="90" width="85" height="10" rx="2" fill="#6B7280" />
      {/* Issuer */}
      <rect x="48" y="104" width="55" height="7" rx="2" fill="#D1D5DB" />
    </svg>
  );
};

export default CertificationVisual;
