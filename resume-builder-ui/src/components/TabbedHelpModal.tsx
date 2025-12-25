import { Fragment } from 'react';
import { Tab } from '@headlessui/react';
import { MdClose } from 'react-icons/md';

interface TabbedHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAnonymous: boolean;
  onSignInClick?: () => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * TabbedHelpModal - Context-aware help modal with 3 tabs
 *
 * Tab 1: Editor Guide (formatting, sections, reordering)
 * Tab 2: Saving & Data (DYNAMIC - different content for auth vs anonymous)
 * Tab 3: FAQs (ATS compatibility, templates, etc.)
 */
export default function TabbedHelpModal({
  isOpen,
  onClose,
  isAnonymous,
  onSignInClick
}: TabbedHelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Help & Tips
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tab.Group as="div" className="flex-1 flex flex-col overflow-hidden">
          <Tab.List className="flex border-b border-gray-200 px-6 flex-shrink-0">
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={classNames(
                    'py-3 px-4 font-medium text-sm transition-all border-b-2 -mb-px',
                    selected
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                  )}
                >
                  Editor Guide
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={classNames(
                    'py-3 px-4 font-medium text-sm transition-all border-b-2 -mb-px',
                    selected
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                  )}
                >
                  Saving & Data
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={classNames(
                    'py-3 px-4 font-medium text-sm transition-all border-b-2 -mb-px',
                    selected
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                  )}
                >
                  FAQs
                </button>
              )}
            </Tab>
          </Tab.List>

          <Tab.Panels className="p-6 overflow-y-auto flex-1">
            {/* Tab 1: Editor Guide */}
            <Tab.Panel>
              <EditorGuideContent />
            </Tab.Panel>

            {/* Tab 2: Saving & Data (DYNAMIC) */}
            <Tab.Panel>
              {isAnonymous ? (
                <AnonymousSavingContent onSignInClick={onSignInClick} />
              ) : (
                <AuthenticatedSavingContent />
              )}
            </Tab.Panel>

            {/* Tab 3: FAQs */}
            <Tab.Panel>
              <FAQContent />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}

// Sub-component: Editor Guide (static content)
function EditorGuideContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Formatting Text</h3>
        <p className="text-gray-600 mb-2">
          Select any text to reveal the formatting toolbar (bubble menu). You can:
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li>Make text <strong>bold</strong>, <em>italic</em>, or <u>underlined</u></li>
          <li>Add hyperlinks to portfolios, LinkedIn, GitHub, etc.</li>
          <li>Clear formatting to start fresh</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Reordering Sections</h3>
        <p className="text-gray-600">
          Drag and drop sections in the sidebar (desktop) or bottom navigation (mobile) to reorder them.
          Customize your resume structure to highlight what matters most.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Adding Sections</h3>
        <p className="text-gray-600">
          Click the "Add Section" button to insert new sections like Skills, Projects, Certifications, or custom sections.
          You can add as many as you need.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Keyboard Shortcuts</h3>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li><kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+\</kbd> - Toggle sidebar (desktop)</li>
          <li><kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+B</kbd> - Bold text</li>
          <li><kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+I</kbd> - Italic text</li>
        </ul>
      </div>
    </div>
  );
}

// Sub-component: Anonymous user saving content
function AnonymousSavingContent({ onSignInClick }: { onSignInClick?: () => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
        <div className="flex items-start">
          <span className="text-amber-600 text-xl mr-3">⚠️</span>
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">
              Your data is stored locally
            </h3>
            <p className="text-amber-800 text-sm">
              Your resume is currently saved in your browser's local storage. If you clear your browser data or use a different device, your work will be lost.
              <strong className="block mt-2">We highly recommend creating a free account to save your resume securely in the cloud.</strong>
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Save Your Work (Manual)</h3>
        <ol className="list-decimal pl-5 text-gray-600 space-y-2">
          <li>Click <strong>"Backup to File"</strong> in the sidebar to download a .yaml file</li>
          <li>Store this file somewhere safe (email it to yourself, save to cloud drive, etc.)</li>
          <li>To restore later, click <strong>"Load My Work"</strong> and upload the .yaml file</li>
        </ol>
      </div>

      {onSignInClick && (
        <button
          onClick={onSignInClick}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md hover:shadow-lg"
        >
          Create Free Account (Recommended)
        </button>
      )}
    </div>
  );
}

// Sub-component: Authenticated user saving content
function AuthenticatedSavingContent() {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
        <div className="flex items-start">
          <span className="text-green-600 text-xl mr-3">✓</span>
          <div>
            <h3 className="font-semibold text-green-900 mb-2">
              Your data is secure
            </h3>
            <p className="text-green-800 text-sm">
              Your resume is automatically saved to the cloud with enterprise-grade encryption via Supabase.
              You can access it from any device, anytime.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Cloud Storage Features</h3>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li><strong>Auto-save every few seconds</strong> - No need to click save, your work is continuously backed up</li>
          <li><strong>Access from any device</strong> - Edit your resume from desktop, tablet, or mobile</li>
          <li><strong>Up to 5 resumes stored</strong> - Create different versions for different roles</li>
          <li><strong>Bank-level encryption (AES-256)</strong> - Your data is protected with the same security used by financial institutions</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Backup Options</h3>
        <p className="text-gray-600 mb-2">
          While your resume is safe in the cloud, you can still create local backups:
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li>Click <strong>"Backup to File"</strong> to download a .yaml file for extra peace of mind</li>
          <li>Click <strong>"Download Resume"</strong> to save a PDF copy</li>
        </ul>
      </div>
    </div>
  );
}

// Sub-component: FAQs (static content)
function FAQContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Is this ATS-compatible?</h3>
        <p className="text-gray-600">
          Yes! Our templates are designed to pass Applicant Tracking Systems (ATS) used by top companies.
          We use clean formatting, standard fonts, and avoid complex graphics that can confuse ATS scanners.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I customize the template?</h3>
        <p className="text-gray-600">
          Currently, we offer the "Modern" template with a professional, clean design.
          You can customize all content, reorder sections, and format text to match your needs.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">What format does it export to?</h3>
        <p className="text-gray-600">
          Your resume exports as a high-quality PDF file, ready to send to employers or upload to job boards.
          The PDF preserves all formatting and looks professional on any device.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">How many resumes can I save?</h3>
        <p className="text-gray-600">
          Free accounts can save up to 5 resumes in the cloud. This lets you create different versions
          tailored to specific roles or industries.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Is my data private?</h3>
        <p className="text-gray-600">
          Absolutely. Your resume data is encrypted (AES-256) and stored securely on Supabase servers.
          We never share your personal information with third parties. You can delete your data at any time.
        </p>
      </div>
    </div>
  );
}
