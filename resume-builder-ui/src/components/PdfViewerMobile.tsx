import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Fallback canvas width when container width cannot be determined
const FALLBACK_CANVAS_WIDTH = 350;

interface PdfViewerMobileProps {
  pdfUrl: string;
  onLoad: () => void;
  onError: () => void;
}

interface RenderedPage {
  src: string;
  width: number;
  height: number;
}

/**
 * PDF viewer component for mobile devices using PDF.js canvas rendering
 *
 * This component solves iOS/Android PDF preview issues by rendering pages
 * to HTML5 canvas elements, converting them to JPEG images for memory efficiency,
 * and using React's declarative rendering instead of direct DOM manipulation.
 */
export const PdfViewerMobile: React.FC<PdfViewerMobileProps> = ({
  pdfUrl,
  onLoad,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [loadingPage, setLoadingPage] = useState(0);

  useEffect(() => {
    let pdfDoc: pdfjsLib.PDFDocumentProxy | null = null;
    let cancelled = false;

    const loadPdf = async () => {
      try {
        // Fetch blob URL and convert to ArrayBuffer for PDF.js
        // PDF.js cannot directly load blob URLs via its fetch mechanism
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        // Load PDF from ArrayBuffer
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        pdfDoc = await loadingTask.promise;

        if (cancelled) return;

        const renderedPages: RenderedPage[] = [];

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

          // Create temporary canvas for rendering
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (!context) continue;

          canvas.height = scaledViewport.height;
          canvas.width = scaledViewport.width;

          // Render page to canvas
          await page.render({
            canvasContext: context,
            viewport: scaledViewport,
          }).promise;

          if (!cancelled) {
            // Convert canvas to JPEG data URL for memory efficiency
            renderedPages.push({
              src: canvas.toDataURL('image/jpeg', 0.9),
              width: scaledViewport.width,
              height: scaledViewport.height,
            });
          }
        }

        if (!cancelled) {
          // Single state update with all rendered pages
          setPages(renderedPages);
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
      // Clear pages state on unmount
      setPages([]);
      pdfDoc?.destroy();
    };
  }, [pdfUrl, onLoad, onError]);

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-100 p-4">
      <div ref={containerRef} className="flex flex-col items-center">
        {pages.map((page, index) => (
          <img
            key={index}
            src={page.src}
            width={page.width}
            height={page.height}
            className="mb-4 shadow-lg w-full"
            alt={`Page ${index + 1}`}
            loading="lazy"
          />
        ))}
        {loadingPage > 0 && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">
              Loading page {loadingPage} of {pages.length > 0 ? pages.length : '...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
