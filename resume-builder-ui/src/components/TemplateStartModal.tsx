import React, { useState, useEffect, useRef } from "react";
import { MdEditNote, MdPreview, MdCheckCircle, MdClose } from "react-icons/md";
import { DocumentArrowUpIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useResumeParser } from "../hooks/useResumeParser";

interface TemplateStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmpty: () => void;
  onSelectExample: () => void;
  onSelectImport: (yaml: string, confidence: number, warnings: string[]) => void;
  templateName: string;
}

export const TemplateStartModal: React.FC<TemplateStartModalProps> = ({
  isOpen,
  onClose,
  onSelectEmpty,
  onSelectExample,
  onSelectImport,
  templateName,
}) => {
  const [selectedOption, setSelectedOption] = useState<'empty' | 'example' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { parseResume, parsing, progress, error } = useResumeParser();

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedOption(null);
      setIsDragging(false);
      setParseResult(null);
    }
  }, [isOpen]);

  // Auto-focus modal on open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (selectedOption === 'empty') {
      onSelectEmpty();
    } else if (selectedOption === 'example') {
      onSelectExample();
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const result = await parseResume(file);
      setParseResult(result);

      // Auto-redirect on high confidence
      if (result.confidence >= 0.9) {
        setTimeout(() => {
          onSelectImport(result.yaml, result.confidence, result.warnings);
        }, 1500);
      }
    } catch (err) {
      console.error('Parse error:', err);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleContinueWithImport = () => {
    if (parseResult) {
      onSelectImport(parseResult.yaml, parseResult.confidence, parseResult.warnings);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter" && selectedOption) {
      handleContinue();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-start-title"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        ref={modalRef}
        className="bg-white p-6 sm:p-8 rounded-lg max-w-5xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
        tabIndex={-1}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 z-10"
          aria-label="Close modal"
        >
          <MdClose className="text-2xl" />
        </button>

        <h2 id="template-start-title" className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">
          How would you like to start?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Choose how to initialize your <span className="font-semibold">{templateName}</span> resume
        </p>

        {/* Two-Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* LEFT SECTION: Import Your Data */}
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-center gap-2 mb-3">
              <DocumentArrowUpIcon className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-xl text-gray-900">Import Your Data</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Upload your existing resume to automatically extract your information
            </p>

            {/* State A: Idle - Drag & Drop Zone */}
            {!parsing && !parseResult && !error && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-purple-500 bg-purple-100'
                    : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <DocumentArrowUpIcon className={`w-12 h-12 mx-auto mb-3 ${
                  isDragging ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Drop your PDF or DOCX here
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  We'll extract your data automatically
                </p>
                <button
                  type="button"
                  className="btn-primary px-4 py-2 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <p className="text-xs text-gray-400 mt-2">Max 10MB • PDF or DOCX</p>
              </div>
            )}

            {/* State C: Parsing - Progress Bar */}
            {parsing && (
              <div className="border-2 border-purple-200 rounded-lg p-6 bg-white">
                <div className="flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
                <p className="text-center text-sm font-semibold text-gray-700 mb-3">
                  Reading your resume...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">
                  {progress < 40 ? 'Extracting text...' : progress < 80 ? 'Analyzing content...' : 'Almost done...'}
                </p>
              </div>
            )}

            {/* State D: Result - Success/Warning */}
            {parseResult && !parsing && (
              <div className={`border-2 rounded-lg p-6 ${
                parseResult.confidence >= 0.9
                  ? 'border-green-200 bg-green-50'
                  : 'border-yellow-200 bg-yellow-50'
              }`}>
                <div className="flex items-start gap-3 mb-4">
                  {parseResult.confidence >= 0.9 ? (
                    <CheckCircleIcon className="w-8 h-8 text-green-600 flex-shrink-0" />
                  ) : (
                    <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm mb-1 ${
                      parseResult.confidence >= 0.9 ? 'text-green-900' : 'text-yellow-900'
                    }`}>
                      {parseResult.confidence >= 0.9 ? 'Success! Loading Editor...' : 'We captured most details'}
                    </h4>
                    <p className={`text-xs ${
                      parseResult.confidence >= 0.9 ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      {parseResult.confidence >= 0.9
                        ? 'Your resume was parsed successfully. Redirecting...'
                        : 'Please review your information carefully.'}
                    </p>
                  </div>
                </div>

                {parseResult.warnings.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Warnings:</p>
                    <ul className="text-xs space-y-1">
                      {parseResult.warnings.map((warning: string, idx: number) => (
                        <li key={idx} className="text-yellow-700">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                  <span>AI Confidence: {(parseResult.confidence * 100).toFixed(0)}%</span>
                  {parseResult.cached && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Cached</span>
                  )}
                </div>

                {parseResult.confidence < 0.9 && (
                  <button
                    onClick={handleContinueWithImport}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold px-4 py-2.5 rounded-lg hover:shadow-lg transition-all"
                  >
                    Continue to Editor
                  </button>
                )}
              </div>
            )}

            {/* Error State */}
            {error && !parsing && (
              <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-red-900 mb-1">Upload Failed</h4>
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setParseResult(null);
                    fileInputRef.current?.click();
                  }}
                  className="w-full mt-4 bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SECTION: Manual Options */}
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center gap-2 mb-3">
              <MdEditNote className="text-2xl text-blue-600" />
              <h3 className="font-bold text-xl text-gray-900">Manual Options</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Start with a blank slate or use example content
            </p>

            <div className="space-y-3 mb-4">
              {/* Option A: Empty Structure (Recommended) */}
              <button
                onClick={() => setSelectedOption('empty')}
                className={`group relative w-full p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                  selectedOption === 'empty'
                    ? 'border-green-400 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
                }`}
                aria-pressed={selectedOption === 'empty'}
              >
                {/* Recommended Badge */}
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <MdCheckCircle className="text-xs" />
                  Recommended
                </div>

                <div className="flex items-start gap-3 mt-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MdEditNote className="text-2xl text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base mb-1 text-gray-900">
                      Start from Scratch
                    </h4>
                    <p className="text-xs text-gray-600">
                      Clean slate • Full control
                    </p>
                  </div>
                  {selectedOption === 'empty' && (
                    <MdCheckCircle className="text-xl text-green-600" />
                  )}
                </div>
              </button>

              {/* Option B: Example Data */}
              <button
                onClick={() => setSelectedOption('example')}
                className={`group relative w-full p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                  selectedOption === 'example'
                    ? 'border-blue-400 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
                aria-pressed={selectedOption === 'example'}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MdPreview className="text-2xl text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base mb-1 text-gray-900">
                      Use Example Content
                    </h4>
                    <p className="text-xs text-gray-600">
                      Pre-written text • Layout preview
                    </p>
                  </div>
                  {selectedOption === 'example' && (
                    <MdCheckCircle className="text-xl text-blue-600" />
                  )}
                </div>
              </button>
            </div>

            {/* Continue Button */}
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-4 py-3 rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
              onClick={handleContinue}
              disabled={!selectedOption}
            >
              {selectedOption ? 'Start Building' : 'Select an option'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateStartModal;
