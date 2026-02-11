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

  // Error state
  if (hasError) {
    return (
      <div className="flex items-center gap-2 text-xs text-red-600">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="hidden sm:inline">Save Failed - Retrying...</span>
        <span className="sm:hidden">Error</span>
      </div>
    );
  }

  // Saving state
  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-xs text-accent">
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        <span className="hidden sm:inline">Saving...</span>
        <span className="sm:hidden">💾</span>
      </div>
    );
  }

  // Static saved state
  return (
    <div className="flex items-center gap-2 text-xs text-green-600">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="hidden sm:inline">
        Auto-Save {lastSaved ? `• ${formatLastSaved(lastSaved)}` : ""}
      </span>
      <span className="sm:hidden">✓</span>
    </div>
  );
}
