# Resume Parser - UI Integration Guide

## Overview

This guide shows how to integrate the AI resume parser into the React frontend with proper hallucination checks and user warnings.

---

## Backend Response Format

The Edge Function returns a `ui_message` object with recommended display text:

```typescript
{
  "success": true,
  "yaml": "template: modern\nfont: Arial\n...",
  "confidence": 0.85,
  "warnings": [
    "AI-generated content: Please carefully review all details for accuracy."
  ],
  "cached": false,
  "ui_message": {
    "title": "Resume Imported Successfully",
    "description": "Please review your details carefully. AI-generated content may contain inaccuracies.",
    "type": "warning" // or "success" if confidence >= 0.9
  }
}
```

---

## Hallucination Check Logic

**Backend adds hallucination warning if:**
- Confidence score < 0.9 → Adds warning to `warnings` array
- Confidence >= 0.9 → No hallucination warning (high confidence)

**UI Message Type:**
- Confidence >= 0.9 → `type: "success"` (green banner)
- Confidence < 0.9 → `type: "warning"` (yellow/orange banner)

---

## Frontend Implementation

### 1. Create `useResumeParser` Hook

**File:** `resume-builder-ui/src/hooks/useResumeParser.ts`

```typescript
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ParseResponse {
  success: boolean;
  yaml: string;
  confidence: number;
  warnings: string[];
  cached: boolean;
  ui_message: {
    title: string;
    description: string;
    type: 'success' | 'warning';
  };
}

export function useResumeParser() {
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const parseResume = async (file: File): Promise<ParseResponse> => {
    setParsing(true);
    setProgress(10);
    setError(null);

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated. Please log in first.');
      }

      setProgress(20);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      setProgress(40);

      // Call Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-resume`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      setProgress(80);

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      setProgress(100);
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setParsing(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return {
    parseResume,
    parsing,
    progress,
    error,
  };
}
```

### 2. Upload Resume Modal Component

**File:** `resume-builder-ui/src/components/UploadResumeModal.tsx`

```typescript
import { useState } from 'react';
import { useResumeParser } from '../hooks/useResumeParser';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (yaml: string, warnings: string[]) => void;
}

export function UploadResumeModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadResumeModalProps) {
  const { parseResume, parsing, progress, error } = useResumeParser();
  const [showWarning, setShowWarning] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('wordprocessing')) {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    try {
      const result = await parseResume(file);
      setParseResult(result);

      // Show warning banner
      setShowWarning(true);

      // Auto-close warning after 10 seconds if confidence is high
      if (result.confidence >= 0.9) {
        setTimeout(() => setShowWarning(false), 10000);
      }

      // Pass YAML to parent component
      onSuccess(result.yaml, result.warnings);

    } catch (err) {
      console.error('Parse error:', err);
      // Error is already set in useResumeParser hook
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>

        {/* Hallucination Warning Banner */}
        {showWarning && parseResult && (
          <div
            className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
              parseResult.ui_message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            {parseResult.ui_message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
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

              {/* Show specific warnings */}
              {parseResult.warnings.length > 0 && (
                <ul className="mt-2 text-sm space-y-1">
                  {parseResult.warnings.map((warning: string, idx: number) => (
                    <li key={idx} className="text-yellow-700">
                      • {warning}
                    </li>
                  ))}
                </ul>
              )}

              {/* Confidence Score */}
              <div className="mt-2 text-xs text-gray-600">
                Confidence: {(parseResult.confidence * 100).toFixed(0)}%
                {parseResult.cached && ' (Cached)'}
              </div>
            </div>
          </div>
        )}

        {/* File Upload Input */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Upload your resume (PDF or DOCX)
          </p>
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileUpload}
            disabled={parsing}
            className="hidden"
            id="resume-upload"
          />
          <label
            htmlFor="resume-upload"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
          >
            {parsing ? 'Parsing...' : 'Choose File'}
          </label>
        </div>

        {/* Progress Bar */}
        {parsing && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">
              {progress}% - Parsing your resume...
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
```

### 3. Integration in TemplateCarousel

**File:** `resume-builder-ui/src/components/TemplateCarousel.tsx`

Add "Upload Resume" button:

```typescript
import { useState } from 'react';
import { UploadResumeModal } from './UploadResumeModal';
import yaml from 'js-yaml';

export function TemplateCarousel() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleResumeImported = (yamlString: string, warnings: string[]) => {
    // Parse YAML and load into editor
    const resumeData = yaml.load(yamlString);

    // Navigate to editor with imported data
    // (Reuse existing import logic from Editor.tsx)

    setShowUploadModal(false);
  };

  return (
    <div>
      {/* Upload Resume Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="mb-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        📄 Upload Existing Resume
      </button>

      {/* Template Grid */}
      {/* ... existing template selection ... */}

      {/* Upload Modal */}
      <UploadResumeModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleResumeImported}
      />
    </div>
  );
}
```

---

## Hallucination Warning Behavior

### Always Show Warning (Recommended)

**Show for ALL parses** regardless of confidence:

```typescript
// In UploadResumeModal.tsx
const handleFileUpload = async (file: File) => {
  const result = await parseResume(file);

  // ALWAYS show warning banner
  setShowWarning(true);

  // Auto-dismiss after 15 seconds (user must review first)
  setTimeout(() => setShowWarning(false), 15000);
};
```

### Conditional Warning (Based on Confidence)

**Show only if confidence < 0.9:**

```typescript
const handleFileUpload = async (file: File) => {
  const result = await parseResume(file);

  // Only show warning if confidence is low
  if (result.confidence < 0.9 || result.warnings.length > 0) {
    setShowWarning(true);
  }
};
```

---

## User Flow

1. **User clicks "Upload Existing Resume"**
   - Opens UploadResumeModal

2. **User selects PDF/DOCX file**
   - File sent to Edge Function
   - Progress bar shows 0% → 100%

3. **Parsing complete**
   - **Success banner** (green) if confidence >= 0.9
   - **Warning banner** (yellow) if confidence < 0.9
   - Banner shows:
     - Title: "Resume Imported Successfully"
     - Description: "Please review your details carefully..."
     - Specific warnings (if any)
     - Confidence score

4. **User clicks "Continue" or modal auto-closes**
   - YAML data imported into editor
   - User lands in Editor.tsx to review/edit

5. **Editor shows persistent reminder**
   - Small banner at top: "AI-imported content - Please verify all details"
   - Dismiss button available

---

## Testing Checklist

### Backend Testing

- [ ] Upload valid resume PDF → Success, confidence > 0.8
- [ ] Upload valid resume DOCX → Success, confidence > 0.8
- [ ] Upload same file twice → Second time returns `cached: true`
- [ ] Upload non-resume PDF (invoice) → Error: "File does not appear to be a resume"
- [ ] Upload invalid file type → Error: "Invalid file type"
- [ ] Upload file > 10MB → Error: "File too large"

### Frontend Testing

- [ ] Success banner shows (green) when confidence >= 0.9
- [ ] Warning banner shows (yellow) when confidence < 0.9
- [ ] Warnings list displays correctly
- [ ] Confidence score displays as percentage
- [ ] "Cached" label shows when `cached: true`
- [ ] Progress bar animates smoothly
- [ ] Error messages display correctly
- [ ] Modal closes after successful import
- [ ] YAML data loads into editor

---

## Recommended UX Enhancements

### 1. Persistent Editor Warning

Add to `Editor.tsx`:

```typescript
{aiImported && (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <AlertCircle className="h-5 w-5 text-yellow-400" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-yellow-700">
          This resume was AI-imported. Please verify all details for accuracy.
        </p>
      </div>
      <div className="ml-auto pl-3">
        <button onClick={() => setAiImported(false)}>
          <X className="h-5 w-5 text-yellow-400" />
        </button>
      </div>
    </div>
  </div>
)}
```

### 2. Field-Level Confidence Indicators

Show confidence per section:

```typescript
{confidence < 0.8 && (
  <span className="text-xs text-yellow-600 ml-2">
    ⚠️ Low confidence - Please review
  </span>
)}
```

### 3. Highlight Placeholder Values

Highlight fields with placeholder values (e.g., `email@example.com`):

```typescript
{contactInfo.email === 'email@example.com' && (
  <span className="text-red-600 text-xs">← Placeholder - Update required</span>
)}
```

---

## API Response Reference

### Success Response

```json
{
  "success": true,
  "yaml": "template: modern\nfont: Arial\ncontact_info:\n  name: John Doe\n  location: San Francisco, CA\n  email: john@example.com\n  phone: (555) 123-4567\n  social_links:\n    - platform: linkedin\n      url: linkedin.com/in/johndoe\nsections:\n  - name: Summary\n    type: text\n    content: Experienced software engineer...\n",
  "confidence": 0.95,
  "warnings": [],
  "cached": false,
  "ui_message": {
    "title": "Resume Imported Successfully",
    "description": "Please review your details carefully. AI-generated content may contain inaccuracies.",
    "type": "success"
  },
  "file_info": {
    "name": "john_doe_resume.pdf",
    "size": 256789,
    "type": "pdf"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "File does not appear to be a resume. Please upload a valid resume (PDF/DOCX)."
}
```

---

## Summary

✅ **Backend:** Hallucination check added - always warns if confidence < 0.9
✅ **Frontend:** Display `ui_message` with appropriate styling (success/warning)
✅ **UX:** Users always see "Please review your details" after import
✅ **Safety:** Prevents users from blindly trusting AI-generated content

**Next Step:** Implement `UploadResumeModal.tsx` and integrate into `TemplateCarousel.tsx`
