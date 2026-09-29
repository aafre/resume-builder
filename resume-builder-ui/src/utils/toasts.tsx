import { toast } from 'react-hot-toast';
import { categorizeError } from '../lib/analytics';
import { ToastGlyph } from '../components/AppToaster';

/**
 * The download is the conversion event, so it gets the one toast with a title,
 * the file it produced, and the accent glyph — not a grey "successfully!".
 * Fixed id: a double-click can't stack two.
 */
export function toastDownloaded(fileName: string): string {
  return toast.success(
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="font-bold">Your resume is downloaded</span>
      <span className="truncate font-mono text-xs text-white/60">{fileName}</span>
    </span>,
    { id: 'pdf-downloaded', icon: <ToastGlyph kind="download" />, duration: 6000 }
  );
}

/** Amber: something is off but nothing failed. */
export function toastWarning(message: string, duration = 7000): string {
  return toast(message, { icon: <ToastGlyph kind="warning" />, duration });
}

export const SUPPORT_EMAIL = 'support@easyfreeresume.com';

/**
 * "Couldn't <what>. <how to recover>." The raw error goes to the console, never
 * to the user: "Failed to fetch" names the problem for us, not for them.
 */
export function toastFailure(what: string, error?: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? '');
  if (raw) console.error(`Couldn't ${what}:`, error);
  const m = raw.toLowerCase();
  const recovery =
    m.includes('rate limit') || m.includes('too many')
      ? 'Too many tries in a row. Wait a minute, then try again.'
      : categorizeError(raw) === 'network'
        ? 'Check your connection and try again.'
        : categorizeError(raw) === 'timeout'
          ? 'It took too long. Try again in a moment.'
          : `Try again. If it keeps happening, email ${SUPPORT_EMAIL}.`;
  return toast.error(`Couldn't ${what}. ${recovery}`);
}
