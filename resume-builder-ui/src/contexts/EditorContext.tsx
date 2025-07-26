import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditorContextType {
  // Scroll state
  isAtBottom: boolean;
  setIsAtBottom: (value: boolean) => void;
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

  return (
    <EditorContext.Provider value={{
      isAtBottom,
      setIsAtBottom,
    }}>
      {children}
    </EditorContext.Provider>
  );
};