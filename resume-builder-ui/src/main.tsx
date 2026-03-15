import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import { applyTestMode } from "./utils/testMode";

import "./styles.css";

// E2E test mode: disable animations and skip tour when ?__test=1
applyTestMode();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
