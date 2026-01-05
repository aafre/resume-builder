// src/hooks/editor/__tests__/useModalManager.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModalManager } from '../useModalManager';
import { DeleteTarget } from '../../../types/editor';

describe('useModalManager', () => {
  describe('Initial States', () => {
    it('should initialize all modal states to false', () => {
      const { result } = renderHook(() => useModalManager());

      expect(result.current.showStorageLimitModal).toBe(false);
      expect(result.current.showPreviewModal).toBe(false);
      expect(result.current.showModal).toBe(false);
      expect(result.current.showHelpModal).toBe(false);
      expect(result.current.showAdvancedMenu).toBe(false);
      expect(result.current.showWelcomeTour).toBe(false);
      expect(result.current.showIdleTooltip).toBe(false);
      expect(result.current.showDeleteConfirm).toBe(false);
      expect(result.current.showStartFreshConfirm).toBe(false);
      expect(result.current.showImportConfirm).toBe(false);
      expect(result.current.showNavigationDrawer).toBe(false);
      expect(result.current.showAIWarning).toBe(false);
      expect(result.current.showAuthModalFromTour).toBe(false);
      expect(result.current.showAuthModal).toBe(false);
      expect(result.current.showDownloadCelebration).toBe(false);
    });

    it('should initialize deleteTarget to null', () => {
      const { result } = renderHook(() => useModalManager());
      expect(result.current.deleteTarget).toBeNull();
    });

    it('should initialize pendingImportFile to null', () => {
      const { result } = renderHook(() => useModalManager());
      expect(result.current.pendingImportFile).toBeNull();
    });
  });

  describe('Storage Limit Modal', () => {
    it('should open storage limit modal', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openStorageLimitModal();
      });

      expect(result.current.showStorageLimitModal).toBe(true);
    });

    it('should close storage limit modal', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openStorageLimitModal();
        result.current.closeStorageLimitModal();
      });

      expect(result.current.showStorageLimitModal).toBe(false);
    });
  });

  describe('Preview Modal', () => {
    it('should open preview modal', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openPreviewModal();
      });

      expect(result.current.showPreviewModal).toBe(true);
    });

    it('should close preview modal', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openPreviewModal();
        result.current.closePreviewModal();
      });

      expect(result.current.showPreviewModal).toBe(false);
    });
  });

  describe('Section Type Modal', () => {
    it('should open section type modal', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openSectionTypeModal();
      });

      expect(result.current.showModal).toBe(true);
    });

    it('should close section type modal', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openSectionTypeModal();
        result.current.closeSectionTypeModal();
      });

      expect(result.current.showModal).toBe(false);
    });
  });

  describe('Help Modal', () => {
    it('should open help modal', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openHelpModal();
      });

      expect(result.current.showHelpModal).toBe(true);
    });

    it('should close help modal', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openHelpModal();
        result.current.closeHelpModal();
      });

      expect(result.current.showHelpModal).toBe(false);
    });
  });

  describe('Advanced Menu', () => {
    it('should open advanced menu', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openAdvancedMenu();
      });

      expect(result.current.showAdvancedMenu).toBe(true);
    });

    it('should close advanced menu', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openAdvancedMenu();
        result.current.closeAdvancedMenu();
      });

      expect(result.current.showAdvancedMenu).toBe(false);
    });

    it('should toggle advanced menu from false to true', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.toggleAdvancedMenu();
      });

      expect(result.current.showAdvancedMenu).toBe(true);
    });

    it('should toggle advanced menu from true to false', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openAdvancedMenu();
        result.current.toggleAdvancedMenu();
      });

      expect(result.current.showAdvancedMenu).toBe(false);
    });
  });

  describe('Welcome Tour', () => {
    it('should open welcome tour', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openWelcomeTour();
      });

      expect(result.current.showWelcomeTour).toBe(true);
    });

    it('should close welcome tour', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openWelcomeTour();
        result.current.closeWelcomeTour();
      });

      expect(result.current.showWelcomeTour).toBe(false);
    });
  });

  describe('Idle Tooltip', () => {
    it('should open idle tooltip', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openIdleTooltip();
      });

      expect(result.current.showIdleTooltip).toBe(true);
    });

    it('should close idle tooltip', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openIdleTooltip();
        result.current.closeIdleTooltip();
      });

      expect(result.current.showIdleTooltip).toBe(false);
    });
  });

  describe('Delete Confirmation', () => {
    it('should open delete confirmation with section target', () => {
      const { result } = renderHook(() => useModalManager());
      const target: DeleteTarget = {
        type: 'section',
        sectionIndex: 0,
        sectionName: 'Experience'
      };

      act(() => {
        result.current.openDeleteConfirm(target);
      });

      expect(result.current.showDeleteConfirm).toBe(true);
      expect(result.current.deleteTarget).toEqual(target);
    });

    it('should close delete confirmation and clear target', () => {
      const { result } = renderHook(() => useModalManager());
      const target: DeleteTarget = {
        type: 'section',
        sectionIndex: 0
      };

      act(() => {
        result.current.openDeleteConfirm(target);
        result.current.closeDeleteConfirm();
      });

      expect(result.current.showDeleteConfirm).toBe(false);
      expect(result.current.deleteTarget).toBeNull();
    });

    it('should handle different delete targets', () => {
      const { result } = renderHook(() => useModalManager());

      // Test section target
      const sectionTarget: DeleteTarget = {
        type: 'section',
        sectionIndex: 2,
        sectionName: 'Education'
      };
      act(() => {
        result.current.openDeleteConfirm(sectionTarget);
      });
      expect(result.current.deleteTarget).toEqual(sectionTarget);

      // Test entry target (e.g., deleting a specific job entry)
      const entryTarget: DeleteTarget = {
        type: 'entry',
        sectionIndex: 0,
        entryIndex: 1,
        sectionName: 'Experience'
      };
      act(() => {
        result.current.closeDeleteConfirm();
        result.current.openDeleteConfirm(entryTarget);
      });
      expect(result.current.deleteTarget).toEqual(entryTarget);
    });
  });

  describe('Start Fresh Confirmation', () => {
    it('should open start fresh confirmation', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openStartFreshConfirm();
      });

      expect(result.current.showStartFreshConfirm).toBe(true);
    });

    it('should close start fresh confirmation', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openStartFreshConfirm();
        result.current.closeStartFreshConfirm();
      });

      expect(result.current.showStartFreshConfirm).toBe(false);
    });
  });

  describe('Import Confirmation', () => {
    it('should open import confirmation with file', () => {
      const { result } = renderHook(() => useModalManager());
      const file = new File(['content'], 'resume.yml', { type: 'application/x-yaml' });

      act(() => {
        result.current.openImportConfirm(file);
      });

      expect(result.current.showImportConfirm).toBe(true);
      expect(result.current.pendingImportFile).toBe(file);
    });

    it('should close import confirmation and clear file', () => {
      const { result } = renderHook(() => useModalManager());
      const file = new File(['content'], 'resume.yml', { type: 'application/x-yaml' });

      act(() => {
        result.current.openImportConfirm(file);
        result.current.closeImportConfirm();
      });

      expect(result.current.showImportConfirm).toBe(false);
      expect(result.current.pendingImportFile).toBeNull();
    });
  });

  describe('Navigation Drawer', () => {
    it('should open navigation drawer', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openNavigationDrawer();
      });

      expect(result.current.showNavigationDrawer).toBe(true);
    });

    it('should close navigation drawer', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openNavigationDrawer();
        result.current.closeNavigationDrawer();
      });

      expect(result.current.showNavigationDrawer).toBe(false);
    });

    it('should toggle navigation drawer from false to true', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.toggleNavigationDrawer();
      });

      expect(result.current.showNavigationDrawer).toBe(true);
    });

    it('should toggle navigation drawer from true to false', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openNavigationDrawer();
        result.current.toggleNavigationDrawer();
      });

      expect(result.current.showNavigationDrawer).toBe(false);
    });
  });

  describe('AI Warning', () => {
    it('should open AI warning', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openAIWarning();
      });

      expect(result.current.showAIWarning).toBe(true);
    });

    it('should close AI warning', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openAIWarning();
        result.current.closeAIWarning();
      });

      expect(result.current.showAIWarning).toBe(false);
    });
  });

  describe('Auth Modal (from tour)', () => {
    it('should open auth modal from tour', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openAuthModalFromTour();
      });

      expect(result.current.showAuthModalFromTour).toBe(true);
    });

    it('should close auth modal from tour', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openAuthModalFromTour();
        result.current.closeAuthModalFromTour();
      });

      expect(result.current.showAuthModalFromTour).toBe(false);
    });
  });

  describe('Auth Modal', () => {
    it('should open auth modal', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openAuthModal();
      });

      expect(result.current.showAuthModal).toBe(true);
    });

    it('should close auth modal', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openAuthModal();
        result.current.closeAuthModal();
      });

      expect(result.current.showAuthModal).toBe(false);
    });
  });

  describe('Download Celebration', () => {
    it('should open download celebration', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openDownloadCelebration();
      });

      expect(result.current.showDownloadCelebration).toBe(true);
    });

    it('should close download celebration', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openDownloadCelebration();
        result.current.closeDownloadCelebration();
      });

      expect(result.current.showDownloadCelebration).toBe(false);
    });
  });

  describe('Return Object Stability', () => {
    it('should return stable object reference when states do not change', () => {
      const { result, rerender } = renderHook(() => useModalManager());

      const firstRender = result.current;
      rerender();
      const secondRender = result.current;

      // Object should be the same reference due to useMemo
      expect(firstRender).toBe(secondRender);
    });

    it('should return new object reference when state changes', () => {
      const { result } = renderHook(() => useModalManager());

      const beforeOpen = result.current;

      act(() => {
        result.current.openPreviewModal();
      });

      const afterOpen = result.current;

      // Object reference should change when state changes
      expect(beforeOpen).not.toBe(afterOpen);
    });

    it('should maintain stable function references', () => {
      const { result } = renderHook(() => useModalManager());

      const firstOpenFn = result.current.openPreviewModal;
      const firstCloseFn = result.current.closePreviewModal;

      act(() => {
        result.current.openPreviewModal();
      });

      const secondOpenFn = result.current.openPreviewModal;
      const secondCloseFn = result.current.closePreviewModal;

      // Functions should maintain same reference due to useCallback
      expect(firstOpenFn).toBe(secondOpenFn);
      expect(firstCloseFn).toBe(secondCloseFn);
    });
  });

  describe('Multiple Modals', () => {
    it('should handle multiple modals open at the same time', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openPreviewModal();
        result.current.openHelpModal();
        result.current.openAdvancedMenu();
      });

      expect(result.current.showPreviewModal).toBe(true);
      expect(result.current.showHelpModal).toBe(true);
      expect(result.current.showAdvancedMenu).toBe(true);
    });

    it('should close modals independently', () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.openPreviewModal();
        result.current.openHelpModal();
        result.current.openAdvancedMenu();
        result.current.closeHelpModal();
      });

      expect(result.current.showPreviewModal).toBe(true);
      expect(result.current.showHelpModal).toBe(false);
      expect(result.current.showAdvancedMenu).toBe(true);
    });
  });
});
