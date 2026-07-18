import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResponsiveConfirmDialog from '../ResponsiveConfirmDialog';

describe('ResponsiveConfirmDialog Accessibility', () => {
  it('closes when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <ResponsiveConfirmDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={vi.fn()}
        title="Test"
        message="Test message"
      />
    );

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
