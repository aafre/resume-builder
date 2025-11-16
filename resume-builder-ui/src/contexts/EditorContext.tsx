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
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  lastSaved: externalLastSaved,
  isSaving: externalIsSaving,
  saveError: externalSaveError,
}) => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Use external values if provided, otherwise use internal state (for backwards compatibility)
  const [internalLastSaved, setInternalLastSaved] = useState<Date | null>(null);
  const [internalIsSaving, setInternalIsSaving] = useState(false);
  const [internalSaveError, setInternalSaveError] = useState(false);

  const lastSaved = externalLastSaved !== undefined ? externalLastSaved : internalLastSaved;
  const isSaving = externalIsSaving !== undefined ? externalIsSaving : internalIsSaving;
  const saveError = externalSaveError !== undefined ? externalSaveError : internalSaveError;

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
    }}>
      {children}
    </EditorContext.Provider>
  );
};