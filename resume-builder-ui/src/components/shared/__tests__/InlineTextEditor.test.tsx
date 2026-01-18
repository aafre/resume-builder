import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { InlineTextEditor } from '../InlineTextEditor';

describe('InlineTextEditor', () => {
  describe('display mode', () => {
    it('renders value as text', () => {
      render(<InlineTextEditor value="Section Title" onSave={vi.fn()} />);

      expect(screen.getByText('Section Title')).toBeInTheDocument();
    });

    it('renders placeholder when value is empty', () => {
      render(<InlineTextEditor value="" onSave={vi.fn()} placeholder="Click to add title" />);

      expect(screen.getByText('Click to add title')).toBeInTheDocument();
    });

    it('is focusable with keyboard', () => {
      render(<InlineTextEditor value="Title" onSave={vi.fn()} />);

      const element = screen.getByRole('button', { name: /edit: title/i });
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    it('has hover hint styling', () => {
      render(<InlineTextEditor value="Title" onSave={vi.fn()} />);

      const element = screen.getByRole('button');
      expect(element).toHaveClass('hover:border-gray-300');
      expect(element).toHaveClass('hover:bg-gray-50');
    });
  });

  describe('edit mode', () => {
    it('enters edit mode on click', async () => {
      render(<InlineTextEditor value="Title" onSave={vi.fn()} />);

      fireEvent.click(screen.getByText('Title'));

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('Title');
    });

    it('enters edit mode on Enter key', async () => {
      render(<InlineTextEditor value="Title" onSave={vi.fn()} />);

      const element = screen.getByRole('button');
      fireEvent.keyDown(element, { key: 'Enter' });

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('enters edit mode on Space key', async () => {
      render(<InlineTextEditor value="Title" onSave={vi.fn()} />);

      const element = screen.getByRole('button');
      fireEvent.keyDown(element, { key: ' ' });

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('auto-focuses input when entering edit mode', async () => {
      render(<InlineTextEditor value="Title" onSave={vi.fn()} />);

      fireEvent.click(screen.getByText('Title'));

      const input = screen.getByRole('textbox');
      expect(document.activeElement).toBe(input);
    });
  });

  describe('saving', () => {
    it('saves on Enter key', async () => {
      const handleSave = vi.fn();
      render(<InlineTextEditor value="Title" onSave={handleSave} />);

      fireEvent.click(screen.getByText('Title'));
      const input = screen.getByRole('textbox');

      await userEvent.clear(input);
      await userEvent.type(input, 'New Title{Enter}');

      expect(handleSave).toHaveBeenCalledWith('New Title');
    });

    it('saves on blur', async () => {
      const handleSave = vi.fn();
      render(<InlineTextEditor value="Title" onSave={handleSave} />);

      fireEvent.click(screen.getByText('Title'));
      const input = screen.getByRole('textbox');

      await userEvent.clear(input);
      await userEvent.type(input, 'New Title');
      fireEvent.blur(input);

      expect(handleSave).toHaveBeenCalledWith('New Title');
    });

    it('does not call onSave if value unchanged', async () => {
      const handleSave = vi.fn();
      render(<InlineTextEditor value="Title" onSave={handleSave} />);

      fireEvent.click(screen.getByText('Title'));
      const input = screen.getByRole('textbox');

      fireEvent.keyDown(input, { key: 'Enter' });

      expect(handleSave).not.toHaveBeenCalled();
    });

    it('trims whitespace from saved value', async () => {
      const handleSave = vi.fn();
      render(<InlineTextEditor value="Title" onSave={handleSave} />);

      fireEvent.click(screen.getByText('Title'));
      const input = screen.getByRole('textbox');

      await userEvent.clear(input);
      await userEvent.type(input, '  New Title  {Enter}');

      expect(handleSave).toHaveBeenCalledWith('New Title');
    });
  });

  describe('canceling', () => {
    it('cancels on Escape key and reverts to original value', async () => {
      const handleSave = vi.fn();
      render(<InlineTextEditor value="Original" onSave={handleSave} />);

      fireEvent.click(screen.getByText('Original'));
      const input = screen.getByRole('textbox');

      await userEvent.clear(input);
      await userEvent.type(input, 'Changed');
      fireEvent.keyDown(input, { key: 'Escape' });

      // Should exit edit mode
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      // Should show original value
      expect(screen.getByText('Original')).toBeInTheDocument();
      // Should not save
      expect(handleSave).not.toHaveBeenCalled();
    });
  });

  describe('empty value handling', () => {
    it('does not save empty string', async () => {
      const handleSave = vi.fn();
      render(<InlineTextEditor value="Title" onSave={handleSave} />);

      fireEvent.click(screen.getByText('Title'));
      const input = screen.getByRole('textbox');

      await userEvent.clear(input);
      fireEvent.keyDown(input, { key: 'Enter' });

      // Should not call save with empty value
      expect(handleSave).not.toHaveBeenCalled();
      // Should revert to original
      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument();
      });
    });

    it('does not save whitespace-only string', async () => {
      const handleSave = vi.fn();
      render(<InlineTextEditor value="Title" onSave={handleSave} />);

      fireEvent.click(screen.getByText('Title'));
      const input = screen.getByRole('textbox');

      await userEvent.clear(input);
      await userEvent.type(input, '   {Enter}');

      expect(handleSave).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('does not enter edit mode when disabled', () => {
      render(<InlineTextEditor value="Title" onSave={vi.fn()} disabled />);

      fireEvent.click(screen.getByText('Title'));

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('is not focusable when disabled', () => {
      render(<InlineTextEditor value="Title" onSave={vi.fn()} disabled />);

      const element = screen.getByRole('button');
      expect(element).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('custom rendering', () => {
    it('renders as specified element type', () => {
      const { container } = render(
        <InlineTextEditor value="Heading" onSave={vi.fn()} as="h2" />
      );

      expect(container.querySelector('h2')).toBeInTheDocument();
    });

    it('applies custom text className', () => {
      render(
        <InlineTextEditor value="Title" onSave={vi.fn()} textClassName="text-xl font-bold" />
      );

      const element = screen.getByRole('button');
      expect(element).toHaveClass('text-xl');
      expect(element).toHaveClass('font-bold');
    });
  });
});
