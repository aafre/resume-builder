import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditorContextType {
  // Scroll state
  isAtBottom: boolean;
  setIsAtBottom: (value: boolean) => void;

  // Auto-save state
  lastSaved: Date | null;
  setLastSaved: (value: Date | null) => void;
  isSaving: boolean;
  setIsSaving: (value: boolean) => void;
  saveError: boolean;
  setSaveError: (value: boolean) => void;

  // Sidebar state
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean) => void;

  // Preview state
  previewIsStale: boolean;
  setPreviewIsStale: (value: boolean) => void;
  previewLastGenerated: Date | null;
  setPreviewLastGenerated: (value: Date | null) => void;
  previewIsGenerating: boolean;
  setPreviewIsGenerating: (value: boolean) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
};

interface EditorProviderProps {
  children: ReactNode;
  // Auto-save state can be injected from useAutoSave hook
  lastSaved?: Date | null;
  isSaving?: boolean;
  saveError?: boolean;
  // Preview state can be injected from usePreview hook
  previewIsStale?: boolean;
  previewLastGenerated?: Date | null;
  previewIsGenerating?: boolean;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  lastSaved: externalLastSaved,
  isSaving: externalIsSaving,
  saveError: externalSaveError,
  previewIsStale: externalPreviewIsStale,
  previewLastGenerated: externalPreviewLastGenerated,
  previewIsGenerating: externalPreviewIsGenerating,
}) => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Use external values if provided, otherwise use internal state (for backwards compatibility)
  const [internalLastSaved, setInternalLastSaved] = useState<Date | null>(null);
  const [internalIsSaving, setInternalIsSaving] = useState(false);
  const [internalSaveError, setInternalSaveError] = useState(false);

  const lastSaved = externalLastSaved !== undefined ? externalLastSaved : internalLastSaved;
  const isSaving = externalIsSaving !== undefined ? externalIsSaving : internalIsSaving;
  const saveError = externalSaveError !== undefined ? externalSaveError : internalSaveError;

  // Preview state (external or internal)
  const [internalPreviewIsStale, setInternalPreviewIsStale] = useState(false);
  const [internalPreviewLastGenerated, setInternalPreviewLastGenerated] = useState<Date | null>(null);
  const [internalPreviewIsGenerating, setInternalPreviewIsGenerating] = useState(false);

  const previewIsStale = externalPreviewIsStale !== undefined ? externalPreviewIsStale : internalPreviewIsStale;
  const previewLastGenerated = externalPreviewLastGenerated !== undefined ? externalPreviewLastGenerated : internalPreviewLastGenerated;
  const previewIsGenerating = externalPreviewIsGenerating !== undefined ? externalPreviewIsGenerating : internalPreviewIsGenerating;

  return (
    <EditorContext.Provider value={{
      isAtBottom,
      setIsAtBottom,
      lastSaved,
      setLastSaved: setInternalLastSaved,
      isSaving,
      setIsSaving: setInternalIsSaving,
      saveError,
      setSaveError: setInternalSaveError,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      previewIsStale,
      setPreviewIsStale: setInternalPreviewIsStale,
      previewLastGenerated,
      setPreviewLastGenerated: setInternalPreviewLastGenerated,
      previewIsGenerating,
      setPreviewIsGenerating: setInternalPreviewIsGenerating,
    }}>
      {children}
    </EditorContext.Provider>
  );
};