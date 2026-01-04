import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Fallback canvas width when container width cannot be determined
const FALLBACK_CANVAS_WIDTH = 350;

interface PdfViewerMobileProps {
  pdfUrl: string;
  onLoad: () => void;
  onError: () => void;
}

/**
 * PDF viewer component for mobile devices using PDF.js canvas rendering
 *
 * This component solves iOS/Android PDF preview issues by rendering pages
 * to HTML5 canvas elements instead of relying on browser's native PDF viewer.
 */
export const PdfViewerMobile: React.FC<PdfViewerMobileProps> = ({
  pdfUrl,
  onLoad,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [loadingPage, setLoadingPage] = useState(0);

  useEffect(() => {
    let pdfDoc: pdfjsLib.PDFDocumentProxy | null = null;
    let cancelled = false;

    const loadPdf = async () => {
      try {
        // Load PDF from blob URL
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        pdfDoc = await loadingTask.promise;

        if (cancelled) return;

        setNumPages(pdfDoc.numPages);

        // Render all pages sequentially
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          if (cancelled) break;

          setLoadingPage(pageNum);
          const page = await pdfDoc.getPage(pageNum);

          // Calculate scale for mobile viewport
          const containerWidth = containerRef.current?.clientWidth || FALLBACK_CANVAS_WIDTH;
          const viewport = page.getViewport({ scale: 1 });
          const scale = containerWidth / viewport.width;
          const scaledViewport = page.getViewport({ scale });

          // Create canvas for this page
          const canvas = document.createElement('canvas');
          canvas.className = 'mb-4 shadow-lg w-full';
          const context = canvas.getContext('2d');

          if (!context) continue;

          canvas.height = scaledViewport.height;
          canvas.width = scaledViewport.width;

          // Render page to canvas
          await page.render({
            canvasContext: context,
            viewport: scaledViewport,
          }).promise;

          if (!cancelled && containerRef.current) {
            containerRef.current.appendChild(canvas);
          }
        }

        if (!cancelled) {
          setLoadingPage(0);
          onLoad();
        }
      } catch (error) {
        console.error('PDF.js rendering error:', error);
        if (!cancelled) {
          onError();
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      pdfDoc?.destroy();
    };
  }, [pdfUrl, onLoad, onError]);

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-100 p-4">
      <div ref={containerRef} className="flex flex-col items-center">
        {loadingPage > 0 && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">
              Loading page {loadingPage} of {numPages}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
