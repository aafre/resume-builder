import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useResumeParser } from '../hooks/useResumeParser';
import {
  CloudArrowUpIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { DocumentArrowUpIcon } from '@heroicons/react/24/solid';

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (yaml: string, confidence: number, warnings: string[]) => void;
}

export function UploadResumeModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadResumeModalProps) {
  const { parseResume, parsing, progress, error } = useResumeParser();
  const [dragActive, setDragActive] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        await handleFileUpload(file);
      }
    },
    []
  );

  const handleFileInput = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
    // Reset input
    e.target.value = '';
  };

  const handleFileUpload = async (file: File) => {
    try {
      const result = await parseResume(file);
      setParseResult(result);
    } catch (err) {
      console.error('Parse error:', err);
    }
  };

  const handleContinue = () => {
    if (parseResult) {
      onSuccess(
        parseResult.yaml,
        parseResult.confidence,
        parseResult.warnings
      );
      setParseResult(null);
    }
  };

  const handleCloseModal = () => {
    setParseResult(null);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <DocumentArrowUpIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Upload Resume</h2>
          </div>
          <button
            onClick={handleCloseModal}
            className="text-white/80 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Success Banner */}
          {parseResult && !error && (
            <div
              className={`mb-4 p-4 rounded-lg border-2 ${
                parseResult.ui_message.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {parseResult.ui_message.type === 'success' ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      parseResult.ui_message.type === 'success'
                        ? 'text-green-900'
                        : 'text-yellow-900'
                    }`}
                  >
                    {parseResult.ui_message.title}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      parseResult.ui_message.type === 'success'
                        ? 'text-green-700'
                        : 'text-yellow-700'
                    }`}
                  >
                    {parseResult.ui_message.description}
                  </p>

                  {/* Warnings */}
                  {parseResult.warnings.length > 0 && (
                    <ul className="mt-3 text-sm space-y-1">
                      {parseResult.warnings.map((warning: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-yellow-600">•</span>
                          <span className="text-yellow-700">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Confidence & Cache Info */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
                    <span>
                      Confidence: {(parseResult.confidence * 100).toFixed(0)}%
                    </span>
                    {parseResult.cached && (
                      <span className="text-blue-600">✓ Cached</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900">Upload Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Area */}
          {!parseResult && (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />

              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop your resume here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse (PDF or DOCX, max 10MB)
              </p>

              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileInput}
                disabled={parsing}
                className="hidden"
                id="resume-file-input"
              />
              <label
                htmlFor="resume-file-input"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 cursor-pointer disabled:opacity-50"
              >
                <DocumentArrowUpIcon className="w-5 h-5" />
                {parsing ? 'Parsing...' : 'Choose File'}
              </label>
            </div>
          )}

          {/* Progress Bar */}
          {parsing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Parsing your resume...
                </span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {parseResult && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button onClick={handleContinue} className="btn-primary px-6 py-2">
              Continue to Editor
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
