interface TextVisualProps {
  className?: string;
}

const TextVisual: React.FC<TextVisualProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Paragraph line 1 (full width) */}
      <rect x="16" y="28" width="168" height="10" rx="2" fill="#9CA3AF" />
      {/* Paragraph line 2 (full width) */}
      <rect x="16" y="46" width="168" height="10" rx="2" fill="#D1D5DB" />
      {/* Paragraph line 3 (shorter) */}
      <rect x="16" y="64" width="150" height="10" rx="2" fill="#D1D5DB" />
      {/* Paragraph line 4 (shortest) */}
      <rect x="16" y="82" width="100" height="10" rx="2" fill="#E5E7EB" />
    </svg>
  );
};

export default TextVisual;
