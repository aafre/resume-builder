/**
 * ErrorPage — the 5XX surface
 *
 * Was a glass card floating on chalk with the status code set in a red-to-orange
 * gradient: gradient text, a colour pair from no part of this system, and
 * `text-gray-600` body copy on a page that had otherwise been migrated. It also
 * whispered — a soft card in the middle of an empty page reads as though the
 * site is half-loaded, which is exactly the wrong impression when something has
 * actually failed.
 *
 * It states the fact instead. Ink ground, the status set as a machine label in
 * mono because that is what a status code is, and the recovery paths sized as
 * real targets. Polarity flips here, so copy is white/60 and the accent can
 * carry text at 9.98:1.
 *
 * It deliberately makes no promise about unsaved work: drafts persist to the
 * server under an anonymous session, not to this browser, so "your work is
 * safe" would be a claim this page cannot keep.
 */

import { useNavigate } from 'react-router-dom';
import SEOHead from './SEOHead';

const ErrorPage: React.FC<{ message?: string }> = ({ message }) => {
  const navigate = useNavigate();

  return (
    /* Not `min-h-screen`: this renders as a route *and* as an error-boundary
       fallback inside a page, where forcing a viewport height put a full-height
       black slab in the middle of a chalk document. 60vh fills the frame as a
       route and stays proportionate when it is one failed section. */
    <div className="min-h-[60vh] bg-ink flex items-center justify-center px-4 py-16 relative overflow-clip">
      <SEOHead title="Error | EasyFreeResume" robots="noindex, follow" />

      {/* The same bloom the ink bands carry, so the page belongs to the system
          rather than being a one-off black screen. Decorative, 5% over ink. */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] max-w-full rounded-full bg-accent/[0.07] blur-3xl pointer-events-none"
      />

      <div className="relative max-w-lg w-full text-center">
        <p className="font-mono text-sm tracking-[0.3em] text-accent uppercase mb-8 tabular-nums">
          Error 5XX
        </p>

        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-tight text-white mb-5 [text-wrap:balance]">
          Service Temporarily Unavailable
        </h1>

        <p className="text-lg font-extralight text-white/60 leading-relaxed mb-10 [text-wrap:pretty]">
          {message ||
            "We're experiencing technical difficulties. Please try again in a few moments."}
        </p>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full py-4 px-6"
          >
            Try Again
          </button>

          <div className="flex gap-3">
            {/* Secondary on ink: the white-filled .btn-secondary would read as
                two primaries stacked, so these are outlined in the inverse
                polarity instead. */}
            <button
              onClick={() => navigate('/templates')}
              className="flex-1 min-h-11 py-3 px-4 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-white/40 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Browse Templates
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 min-h-11 py-3 px-4 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-white/40 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Go Home
            </button>
          </div>
        </div>

        <p className="text-sm text-white/60 mt-10">
          If this keeps happening, try refreshing the page or check your
          internet connection.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
