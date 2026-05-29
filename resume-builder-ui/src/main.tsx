import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
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

// flushSync forces the initial React render to be synchronous, eliminating
// the intermediate DOM state (shell-header gone, H1 still visible) that
// causes the 64px CLS shift measured by Codex at ~181ms.
flushSync(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>
  );
});
