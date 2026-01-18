interface InlineListVisualProps {
  className?: string;
}

const InlineListVisual: React.FC<InlineListVisualProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Row 1 - horizontal pill/tag shapes */}
      <rect x="16" y="32" width="45" height="20" rx="10" fill="#9CA3AF" />
      <rect x="67" y="32" width="55" height="20" rx="10" fill="#D1D5DB" />
      <rect x="128" y="32" width="40" height="20" rx="10" fill="#9CA3AF" />
      {/* Row 2 - flowing layout continuation */}
      <rect x="16" y="60" width="60" height="20" rx="10" fill="#D1D5DB" />
      <rect x="82" y="60" width="35" height="20" rx="10" fill="#E5E7EB" />
      <rect x="123" y="60" width="50" height="20" rx="10" fill="#D1D5DB" />
    </svg>
  );
};

export default InlineListVisual;
