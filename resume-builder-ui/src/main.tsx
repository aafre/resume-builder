import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import * as pdfjsLib from 'pdfjs-dist';
import App from "./App.tsx";

import "./styles.css";

// Configure PDF.js worker (global setup for mobile PDF preview)
// Use Vite's URL resolution for robust worker path handling across builds
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
