import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import * as pdfjsLib from 'pdfjs-dist';
import App from "./App.tsx";

import "./styles.css";

// Configure PDF.js worker (global setup for mobile PDF preview)
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
