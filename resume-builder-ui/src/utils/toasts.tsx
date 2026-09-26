import { toast } from 'react-hot-toast';
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
