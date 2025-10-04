import React, { useState, useRef, useEffect } from 'react';
import { FaEye, FaTimes, FaDownload, FaSpinner, FaExclamationTriangle, FaSearchPlus, FaSearchMinus, FaExpand } from 'react-icons/fa';
import { generatePreview } from '../services/templates';
import { getSessionId } from '../utils/session';
import { extractReferencedIconFilenames } from '../utils/iconExtractor';
import yaml from 'js-yaml';

interface ResumePreviewProps {
  contactInfo: any;
  sections: any[];
  templateId: string;
  iconRegistry: any;
  isOpen: boolean;
  onClose: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  contactInfo,
  sections,
  templateId,
  iconRegistry,
  isOpen,
  onClose,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Process sections to ensure they're in the correct format
  const processSections = (sections: any[]) => {
    return sections.map((section) => {
      if (section.type === 'experience' && Array.isArray(section.content)) {
        return {
          ...section,
          content: section.content.map((exp: any) => ({
            ...exp,
            description: exp.description || '',
          })),
        };
      }
      return section;
    });
  };

  // Zoom and pan functionality
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 25));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
    // Reset scroll position
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const handleDoubleClick = () => {
    if (zoomLevel === 100) {
      setZoomLevel(200);
    } else {
      handleResetZoom();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 100 && containerRef.current) {
      setIsDragging(true);
      setDragStart({ 
        x: e.clientX - containerRef.current.scrollLeft, 
        y: e.clientY - containerRef.current.scrollTop 
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 100 && containerRef.current) {
      const newScrollLeft = e.clientX - dragStart.x;
      const newScrollTop = e.clientY - dragStart.y;
      containerRef.current.scrollTo(newScrollLeft, newScrollTop);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const generatePreviewImage = async () => {
    if (!contactInfo || sections.length === 0) {
      setError('Please add some content to your resume before generating a preview');
      return;
    }

    try {
      setIsGeneratingPreview(true);
      setError(null);

      const processedSections = processSections(sections);
      const yamlData = yaml.dump({
        contact_info: contactInfo,
        sections: processedSections,
      });

      const formData = new FormData();
      const yamlBlob = new Blob([yamlData], { type: 'application/x-yaml' });
      formData.append('yaml_file', yamlBlob, 'resume.yaml');
      formData.append('template', templateId || '');

      // Add session ID for session-based icon isolation
      const sessionId = getSessionId();
      formData.append('session_id', sessionId);

      // Add referenced icons
      const referencedIcons = extractReferencedIconFilenames(sections);
      for (const iconFilename of referencedIcons) {
        const iconFile = iconRegistry.getIconFile(iconFilename);
        if (iconFile) {
          formData.append('icons', iconFile, iconFilename);
        }
      }

      const { imageBlob } = await generatePreview(formData);
      const imageUrl = URL.createObjectURL(imageBlob);
      console.log('Setting preview image URL:', imageUrl);
      setPreviewImage(imageUrl);
      console.log('Preview image state set');
    } catch (error) {
      console.error('Error generating preview:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Preview generation failed: ${errorMessage}`);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const downloadPreview = () => {
    if (previewImage) {
      const link = document.createElement('a');
      link.href = previewImage;
      link.download = 'resume_preview.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Generate preview when modal opens
  useEffect(() => {
    if (isOpen && !previewImage && !isGeneratingPreview) {
      generatePreviewImage();
    }
    // Reset zoom when modal opens
    if (isOpen) {
      setZoomLevel(100);
      setIsDragging(false);
      // Reset scroll position
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    }
  }, [isOpen]);

  // Clean up image URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        ref={previewRef}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FaEye className="text-blue-600 text-xl" />
            <h2 className="text-2xl font-bold text-gray-900">Resume Preview</h2>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 25}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom Out"
              >
                <FaSearchMinus className="text-sm" />
              </button>
              <span className="px-3 py-1 text-sm font-medium text-gray-700 min-w-[60px] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 300}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                <FaSearchPlus className="text-sm" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                title="Reset Zoom"
              >
                <FaExpand className="text-sm" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-500 text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {isGeneratingPreview ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Generating preview...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
                <p className="text-lg text-gray-900 mb-2">Preview Error</p>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={generatePreviewImage}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : previewImage ? (
            <div 
              ref={containerRef}
              className="flex-1 overflow-auto p-6 relative"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="flex justify-center min-h-full">
                <div className="relative rounded-lg shadow-lg border border-gray-200">
                  <img
                    ref={imageRef}
                    src={previewImage}
                    alt="Resume Preview"
                    className={`transition-transform duration-200 ${isDragging ? 'cursor-grabbing' : zoomLevel > 100 ? 'cursor-grab' : 'cursor-pointer'}`}
                    style={{ 
                      transform: `scale(${zoomLevel / 100})`,
                      maxWidth: '100%',
                      height: 'auto',
                      transformOrigin: 'center center'
                    }}
                    onLoad={() => console.log('Image loaded successfully')}
                    onError={(e) => console.error('Image failed to load:', e)}
                    onDoubleClick={handleDoubleClick}
                    onMouseDown={handleMouseDown}
                    title="Double-click to zoom in/out, drag to pan when zoomed"
                  />
                </div>
              </div>
              
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FaEye className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-4">No preview available</p>
                <button
                  onClick={generatePreviewImage}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate Preview
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={generatePreviewImage}
                disabled={isGeneratingPreview}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPreview ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  'Refresh'
                )}
              </button>
            </div>
            <div className="flex gap-3">
              {previewImage && (
                <button
                  onClick={downloadPreview}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FaDownload />
                  Download Preview
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;