import { SaveStatus } from '../types';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  lastSaved: Date | null;
}

function formatTimeAgo(date: Date | null): string {
  if (!date) return '';

  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function SaveStatusIndicator({ status, lastSaved }: SaveStatusIndicatorProps) {
  const icons = {
    saved: (
      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    saving: (
      <svg className="w-4 h-4 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    ),
    error: (
      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  };

  const text = {
    saved: lastSaved ? `Saved ${formatTimeAgo(lastSaved)}` : 'Saved',
    saving: 'Saving...',
    error: 'Save failed'
  };

  const colorClasses = {
    saved: 'text-gray-600',
    saving: 'text-accent',
    error: 'text-red-600'
  };

  return (
    <div className={`flex items-center gap-1.5 text-sm ${colorClasses[status]}`}>
      {icons[status]}
      <span>{text[status]}</span>
    </div>
  );
}
