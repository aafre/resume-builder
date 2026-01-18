interface BulletedListVisualProps {
  className?: string;
}

const BulletedListVisual: React.FC<BulletedListVisualProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Bullet point 1 */}
      <circle cx="22" cy="24" r="4" fill="#9CA3AF" />
      <rect x="34" y="20" width="140" height="8" rx="2" fill="#9CA3AF" />
      {/* Bullet point 2 */}
      <circle cx="22" cy="46" r="4" fill="#9CA3AF" />
      <rect x="34" y="42" width="120" height="8" rx="2" fill="#D1D5DB" />
      {/* Bullet point 3 */}
      <circle cx="22" cy="68" r="4" fill="#9CA3AF" />
      <rect x="34" y="64" width="130" height="8" rx="2" fill="#D1D5DB" />
      {/* Bullet point 4 */}
      <circle cx="22" cy="90" r="4" fill="#9CA3AF" />
      <rect x="34" y="86" width="100" height="8" rx="2" fill="#E5E7EB" />
    </svg>
  );
};

export default BulletedListVisual;
