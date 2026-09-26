import { AlertCircle, Check, Loader2 } from "lucide-react";

interface AutoSaveIndicatorProps {
  lastSaved?: Date | null;
  isSaving?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

/**
 * Cloud save status for signed-in editors. Same chip geometry as
 * AnonymousStorageBadge so the slot reads identically either way; phones get
 * the one-word label, wider screens add the time.
 */
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

  const chip =
    "flex min-h-11 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium";

  if (hasError) {
    return (
      <div role="status" className={`${chip} text-red-700`}>
        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sm:hidden">Retrying</span>
        <span className="hidden sm:inline">Save failed · retrying</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div role="status" className={`${chip} text-ink/60`}>
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        Saving
      </div>
    );
  }

  return (
    <div role="status" className={`${chip} text-ink/60`}>
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-ink" aria-hidden="true">
        <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
      </span>
      <span className="sm:hidden">Saved</span>
      <span className="hidden sm:inline">
        Saved{lastSaved ? ` · ${formatLastSaved(lastSaved)}` : ""}
      </span>
    </div>
  );
}
