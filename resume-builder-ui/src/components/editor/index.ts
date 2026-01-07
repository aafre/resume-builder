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
  EditorContentSectionManagementProps,
  EditorContentNavigationProps,
  EditorContentModalProps,
  EditorContentFileOperationsProps,
  EditorContentEditorActionsProps,
  EditorContentPreviewProps,
  EditorContentSaveStatusProps,
  EditorContentIconRegistry,
  EditorContentRefs,
} from './EditorContent';
