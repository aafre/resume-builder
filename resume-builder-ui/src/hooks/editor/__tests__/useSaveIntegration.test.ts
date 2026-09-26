import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import { useSaveIntegration } from '../useSaveIntegration';
import { toastWarning } from '../../../utils/toasts';

vi.mock('react-hot-toast', () => ({ toast: { error: vi.fn() } }));
vi.mock('../../../utils/toasts', () => ({ toastWarning: vi.fn() }));

const saveNow = vi.fn();
vi.mock('../../useCloudSave', () => ({
  useCloudSave: () => ({ saveStatus: 'idle', lastSaved: null, saveNow, resumeId: null }),
}));

const openStorageLimitModal = vi.fn();

const renderSave = () =>
  renderHook(() =>
    useSaveIntegration({
      contactInfo: { name: 'A', location: '', email: '', phone: '' },
      sections: [],
      templateId: 'modern-no-icons',
      iconRegistry: { getRegisteredFilenames: () => [], getIconFile: () => null },
      cloudResumeId: 'r1',
      setCloudResumeId: vi.fn(),
      isLoadingFromUrl: false,
      authLoading: false,
      session: null,
      isAnonymous: false,
      openStorageLimitModal,
    })
  ).result.current;

describe('saveBeforeAction', () => {
  beforeEach(() => vi.clearAllMocks());

  // P0: a failed cloud save must never hold the download hostage.
  it('lets a non-blocking action run after a failed save, with a sync warning', async () => {
    saveNow.mockRejectedValue(new Error('Failed to fetch'));
    await expect(renderSave().saveBeforeAction('downloading your PDF', { blocking: false })).resolves.toBe(true);
    expect(toastWarning).toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('stops a blocking action after a failed save, so edits are not replaced', async () => {
    saveNow.mockRejectedValue(new Error('Failed to fetch'));
    await expect(renderSave().saveBeforeAction('starting fresh')).resolves.toBe(false);
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('stopped before starting fresh'));
  });

  it('opens the storage-limit modal and still downloads when the limit is hit', async () => {
    saveNow.mockRejectedValue(new Error('RESUME_LIMIT_REACHED'));
    await expect(renderSave().saveBeforeAction('downloading your PDF', { blocking: false })).resolves.toBe(true);
    expect(openStorageLimitModal).toHaveBeenCalled();
  });
});
