import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IconManager from '../IconManager';

// Mock the icons utility
vi.mock('../../utils/icons', () => ({
  getIconSource: vi.fn(() => ({ iconSrc: 'http://example.com/icon.png' })),
}));

// Mock react-icons/fa
vi.mock('react-icons/fa', () => ({
  FaImage: () => <span data-testid="fa-image" />,
  FaPencilAlt: () => <span data-testid="fa-pencil" />,
  FaTimes: () => <span data-testid="fa-times" />,
}));

describe('IconManager', () => {
  const defaultProps = {
    value: null,
    onChange: vi.fn(),
    registerIcon: vi.fn(),
    getIconFile: vi.fn(() => null),
    removeIcon: vi.fn(),
  };

  it('file input has className containing "sr-only" (not "hidden")', () => {
    render(<IconManager {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();
    expect(fileInput.className).toContain('sr-only');
    expect(fileInput.className).not.toContain('hidden');
  });

  it('file input has className containing "peer"', () => {
    render(<IconManager {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();
    expect(fileInput.className).toContain('peer');
  });

  it('clear button has aria-label="Remove icon" when icon is present', () => {
    const propsWithIcon = {
      ...defaultProps,
      value: 'test-icon.png',
      getIconFile: vi.fn(() => null), // triggers server path
    };
    render(<IconManager {...propsWithIcon} />);
    const clearBtn = screen.getByRole('button', { name: 'Remove icon' });
    expect(clearBtn).toBeInTheDocument();
    expect(clearBtn).toHaveAttribute('aria-label', 'Remove icon');
  });

  it('clear button has focus-visible:ring classes when icon is present', () => {
    const propsWithIcon = {
      ...defaultProps,
      value: 'test-icon.png',
      getIconFile: vi.fn(() => null),
    };
    render(<IconManager {...propsWithIcon} />);
    const clearBtn = screen.getByRole('button', { name: 'Remove icon' });
    expect(clearBtn.className).toMatch(/focus-visible:ring/);
  });
});
