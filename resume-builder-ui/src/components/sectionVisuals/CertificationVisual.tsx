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
      <rect x="12" y="12" width="28" height="28" rx="4" fill="#e7e7e7" stroke="#d1d1d1" strokeWidth="1" />
      {/* Icon placeholder detail (abstract logo) */}
      <rect x="18" y="20" width="16" height="4" rx="1" fill="#a0a0a0" />
      <rect x="18" y="27" width="10" height="4" rx="1" fill="#a0a0a0" />
      {/* Certification title - bold */}
      <rect x="48" y="14" width="110" height="10" rx="2" fill="#555555" />
      {/* Issuer - lighter */}
      <rect x="48" y="28" width="75" height="7" rx="2" fill="#a0a0a0" />

      {/* Row 2: Logo icon + Certification title + Issuer */}
      <rect x="12" y="50" width="28" height="28" rx="4" fill="#e7e7e7" stroke="#d1d1d1" strokeWidth="1" />
      {/* Icon placeholder detail */}
      <circle cx="26" cy="64" r="8" fill="#d1d1d1" />
      {/* Certification title */}
      <rect x="48" y="52" width="95" height="10" rx="2" fill="#555555" />
      {/* Issuer */}
      <rect x="48" y="66" width="65" height="7" rx="2" fill="#a0a0a0" />

      {/* Row 3: Logo icon + Certification title + Issuer */}
      <rect x="12" y="88" width="28" height="28" rx="4" fill="#f6f6f5" stroke="#e7e7e7" strokeWidth="1" />
      {/* Icon placeholder detail */}
      <rect x="19" y="96" width="14" height="12" rx="2" fill="#d1d1d1" />
      {/* Certification title */}
      <rect x="48" y="90" width="85" height="10" rx="2" fill="#6d6d6d" />
      {/* Issuer */}
      <rect x="48" y="104" width="55" height="7" rx="2" fill="#d1d1d1" />
    </svg>
  );
};

export default CertificationVisual;
