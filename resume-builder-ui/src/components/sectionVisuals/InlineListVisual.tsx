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
      {/* Row 1 - Chip/Tag style with borders */}
      <rect x="12" y="28" width="48" height="22" rx="11" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5" />
      <rect x="22" y="36" width="28" height="6" rx="3" fill="#6B7280" />

      <rect x="66" y="28" width="58" height="22" rx="11" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5" />
      <rect x="76" y="36" width="38" height="6" rx="3" fill="#6B7280" />

      <rect x="130" y="28" width="52" height="22" rx="11" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5" />
      <rect x="140" y="36" width="32" height="6" rx="3" fill="#6B7280" />

      {/* Row 2 - Continuing flow */}
      <rect x="12" y="58" width="54" height="22" rx="11" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1.5" />
      <rect x="22" y="66" width="34" height="6" rx="3" fill="#9CA3AF" />

      <rect x="72" y="58" width="42" height="22" rx="11" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1.5" />
      <rect x="82" y="66" width="22" height="6" rx="3" fill="#9CA3AF" />

      <rect x="120" y="58" width="62" height="22" rx="11" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1.5" />
      <rect x="130" y="66" width="42" height="6" rx="3" fill="#9CA3AF" />

      {/* Row 3 - Partial row to show wrap */}
      <rect x="12" y="88" width="46" height="22" rx="11" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1.5" />
      <rect x="22" y="96" width="26" height="6" rx="3" fill="#D1D5DB" />

      <rect x="64" y="88" width="50" height="22" rx="11" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1.5" />
      <rect x="74" y="96" width="30" height="6" rx="3" fill="#D1D5DB" />
    </svg>
  );
};

export default InlineListVisual;
