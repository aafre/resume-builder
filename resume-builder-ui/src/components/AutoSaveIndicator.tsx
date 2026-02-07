import { useState, useEffect } from 'react';

interface AutoSaveIndicatorProps {
  lastSaved?: Date | null;
  isSaving?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

export default function AutoSaveIndicator({
  lastSaved,
  isSaving = false,
  hasError = false,
}: AutoSaveIndicatorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [, setTick] = useState(0);

  // Tick every 30s to keep relative time fresh
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    return date.toLocaleDateString();
  };

  const savedText = lastSaved ? `Saved ${formatLastSaved(lastSaved)}` : "Saved";

  // Error state - always expanded
  if (hasError) {
    return (
      <div
        className="flex items-center gap-2 text-xs text-red-600"
        title="Save failed - retrying..."
      >
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
        <span>Save Failed</span>
      </div>
    );
  }

  // Saving state - always expanded
  if (isSaving) {
    return (
      <div
        className="flex items-center gap-2 text-xs text-blue-600"
        title="Saving..."
      >
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0" />
        <span>Saving...</span>
      </div>
    );
  }

  // Saved state - hover to expand
  return (
    <div
      className="flex items-center gap-1.5 text-xs text-green-600 cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={savedText}
    >
      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
      <div
        className="overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out"
        style={{
          maxWidth: isHovered ? '150px' : '0px',
          opacity: isHovered ? 1 : 0,
        }}
      >
        <span className="hidden sm:inline">{savedText}</span>
      </div>
    </div>
  );
}
