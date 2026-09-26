import { Toaster } from 'react-hot-toast';
import { Check, FileCheck, Info, TriangleAlert, X } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';

export type ToastKind = 'success' | 'error' | 'warning' | 'info' | 'download';

// Tinted tile + solid glyph: the kind reads before the words do. Fills are the
// semantic status colours DESIGN.md allows inside status affordances only.
const SMALL = 'h-7 w-7 rounded-lg [&>svg]:h-4 [&>svg]:w-4';
const GLYPH: Record<ToastKind, { Icon: typeof Check; tile: string }> = {
  success: { Icon: Check, tile: `${SMALL} bg-accent text-ink` },
  error: { Icon: X, tile: `${SMALL} bg-red-500 text-white` },
  warning: { Icon: TriangleAlert, tile: `${SMALL} bg-amber-400 text-ink` },
  info: { Icon: Info, tile: `${SMALL} bg-white/15 text-white` },
  // The product's peak: the PDF is in hand. The one larger tile.
  download: { Icon: FileCheck, tile: 'h-10 w-10 rounded-xl bg-accent text-ink [&>svg]:h-5 [&>svg]:w-5' },
};

export function ToastGlyph({ kind }: { kind: ToastKind }) {
  const { Icon, tile } = GLYPH[kind];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex flex-shrink-0 items-center justify-center ${tile}`}
    >
      <Icon strokeWidth={2.75} />
    </span>
  );
}

// `!` beats the inline styles ToastBar ships with. Ink, not glass: a white/80
// card over a chalk page has no separation; ink reads over editor, preview, and
// modals alike. Weight is set, not inherited, because body is extralight (200).
const BASE =
  'app-toast relative overflow-clip !bg-ink !text-white !rounded-xl !shadow-xl !px-3 !py-2.5 ' +
  '!max-w-[min(26rem,calc(100vw-2rem))] !font-normal !text-[0.9375rem] !leading-snug ring-1';

/**
 * The one toast surface. Desktop: top-right, clear of the sticky header.
 * Below lg: bottom-centre in the thumb zone, lifted over the editor's
 * MobileActionBar (~116px mid-save) and the safe area.
 */
export default function AppToaster() {
  const { isDesktop } = useResponsive();
  return (
    <Toaster
      position={isDesktop ? 'top-right' : 'bottom-center'}
      containerClassName="app-toaster"
      containerStyle={
        isDesktop
          ? { zIndex: 10001, top: '5rem' }
          : { zIndex: 10001, bottom: 'calc(8rem + env(safe-area-inset-bottom))' }
      }
      toastOptions={{
        duration: 5000,
        className: `${BASE} ring-white/10`,
        icon: <ToastGlyph kind="info" />,
        success: { duration: 4000, icon: <ToastGlyph kind="success" /> },
        error: {
          duration: 7000,
          className: `${BASE} ring-red-400/60`,
          icon: <ToastGlyph kind="error" />,
          ariaProps: { role: 'alert', 'aria-live': 'assertive' },
        },
      }}
    />
  );
}
