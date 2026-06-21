import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { HelmetProvider } from 'react-helmet-async';
import { onCLS } from 'web-vitals/attribution';
import App from "./App.tsx";

import "./styles.css";

// Log CLS with attribution for field debugging.
// Wire to PostHog when that integration ships.
onCLS((metric) => {
  console.log('[CLS]', {
    value: metric.value,
    rating: metric.rating,
    largestShiftTarget: metric.attribution?.largestShiftTarget,
    largestShiftTime: metric.attribution?.largestShiftTime,
    loadState: metric.attribution?.loadState,
  });
});

const rootEl = document.getElementById("root")!;
const app = (
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);

if (rootEl.dataset.prerendered === "true") {
  // Prerendered route (e.g. "/"): the served HTML is React's real output, so
  // the H1 is already painted from HTML and is the credited LCP element.
  // hydrateRoot ADOPTS that DOM in place (no innerHTML wipe), so the H1 keeps
  // LCP credit. No flushSync here: hydration preserves the existing DOM, so
  // there is no shell-header→React-header swap and thus no 64px CLS shift.
  hydrateRoot(rootEl, app, {
    onRecoverableError: (error) => {
      // Surface hydration mismatches loudly during the spike so we can prove
      // the first client render matches the prerendered snapshot.
      console.error("[hydration]", error);
    },
  });
} else {
  // Shell path (non-prerendered routes): flushSync forces a synchronous initial
  // render, eliminating the intermediate DOM state (shell-header gone, H1 still
  // visible) that causes the 64px CLS shift measured at ~181ms.
  flushSync(() => {
    createRoot(rootEl).render(app);
  });
}
