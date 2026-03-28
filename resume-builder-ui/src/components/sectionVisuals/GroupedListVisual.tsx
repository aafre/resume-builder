const GroupedListVisual: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
      {/* Group 1: bold label bar + item lines */}
      <rect x="10" y="10" width="75" height="8" rx="2" fill="#374151" />
      <rect x="10" y="22" width="160" height="6" rx="2" fill="#D1D5DB" />

      {/* Group 2: bold label bar + item lines */}
      <rect x="10" y="42" width="85" height="8" rx="2" fill="#374151" />
      <rect x="10" y="54" width="150" height="6" rx="2" fill="#D1D5DB" />

      {/* Group 3: bold label bar + item lines */}
      <rect x="10" y="74" width="65" height="8" rx="2" fill="#374151" />
      <rect x="10" y="86" width="170" height="6" rx="2" fill="#D1D5DB" />
    </svg>
  );
};

export default GroupedListVisual;
