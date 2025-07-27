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
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  return (
    <EditorContext.Provider value={{
      isAtBottom,
      setIsAtBottom,
      lastSaved,
      setLastSaved,
      isSaving,
      setIsSaving,
      saveError,
      setSaveError,
    }}>
      {children}
    </EditorContext.Provider>
  );
};