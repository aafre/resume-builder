declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GOOGLE_ADS_ID = 'AW-18218265200';

// Set once the conversion action is created in Google Ads UI (Tools > Conversions).
// No-ops until configured, so this stays inert with zero performance impact.
const PDF_DOWNLOAD_CONVERSION_LABEL = import.meta.env.VITE_GOOGLE_ADS_PDF_DOWNLOAD_LABEL || '';

/** Fires the Google Ads "PDF download" conversion event. Safe to call unconditionally. */
export const trackPdfDownloadConversion = (): void => {
  if (!PDF_DOWNLOAD_CONVERSION_LABEL) return;
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${PDF_DOWNLOAD_CONVERSION_LABEL}`,
  });
};
