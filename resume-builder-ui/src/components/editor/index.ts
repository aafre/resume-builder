// src/components/editor/index.ts
// Barrel export for editor components

export { EditorHeader } from './EditorHeader';
export type { EditorHeaderProps } from './EditorHeader';

export { EditorModals } from './EditorModals';
export type {
  EditorModalsProps,
  EditorModalsPreviewProps,
  EditorModalsActions,
  EditorModalsLoadingStates,
} from './EditorModals';

export { EditorContent } from './EditorContent';
export type {
  EditorContentProps,
  EditorContentContactFormProps,
  EditorContentDragDropProps,
  EditorContentNavigationProps,
  EditorContentModalProps,
  EditorContentFileOperationsProps,
  EditorContentEditorActionsProps,
  EditorContentPreviewProps,
  EditorContentSaveStatusProps,
  EditorContentRefs,
} from './EditorContent';

// Re-export types that were moved to types/editor.ts but used to be in EditorContent
export type {
  EditorContentSectionManagementProps,
  EditorContentIconRegistry,
} from '../../types/editor';
