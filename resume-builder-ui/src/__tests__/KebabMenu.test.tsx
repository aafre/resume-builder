import { render, screen, fireEvent } from '@testing-library/react';
import { KebabMenu } from '../components/KebabMenu';
import { vi } from 'vitest';

describe('KebabMenu', () => {
  const defaultProps = {
    resumeId: '123',
    resumeTitle: 'Test Resume',
    onRename: vi.fn(),
    onDuplicate: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders with correct accessibility attributes', () => {
    render(<KebabMenu {...defaultProps} />);

    const trigger = screen.getByLabelText('More options for Test Resume');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens menu on click and sets aria-expanded', () => {
    render(<KebabMenu {...defaultProps} />);

    const trigger = screen.getByLabelText('More options for Test Resume');
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders menu items with correct roles', () => {
    render(<KebabMenu {...defaultProps} />);

    const trigger = screen.getByLabelText('More options for Test Resume');
    fireEvent.click(trigger);

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(3);
    expect(menuItems[0]).toHaveTextContent('Rename');
    expect(menuItems[1]).toHaveTextContent('Duplicate');
    expect(menuItems[2]).toHaveTextContent('Delete');
  });

  it('manages focus when opening', async () => {
    render(<KebabMenu {...defaultProps} />);

    const trigger = screen.getByLabelText('More options for Test Resume');
    fireEvent.click(trigger);

    // Wait for focus to move (using requestAnimationFrame in component)
    const firstItem = screen.getByRole('menuitem', { name: /rename/i });
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(firstItem);
    });
  });

  it('supports keyboard navigation', async () => {
    render(<KebabMenu {...defaultProps} />);

    const trigger = screen.getByLabelText('More options for Test Resume');
    fireEvent.click(trigger);

    const renameItem = screen.getByRole('menuitem', { name: /rename/i });
    const duplicateItem = screen.getByRole('menuitem', { name: /duplicate/i });
    const deleteItem = screen.getByRole('menuitem', { name: /delete/i });

    // Wait for initial focus
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(renameItem);
    });

    // Arrow Down
    fireEvent.keyDown(renameItem, { key: 'ArrowDown', bubbles: true });
    expect(document.activeElement).toBe(duplicateItem);

    // Arrow Down
    fireEvent.keyDown(duplicateItem, { key: 'ArrowDown', bubbles: true });
    expect(document.activeElement).toBe(deleteItem);

    // Arrow Up
    fireEvent.keyDown(deleteItem, { key: 'ArrowUp', bubbles: true });
    expect(document.activeElement).toBe(duplicateItem);

    // Home
    fireEvent.keyDown(duplicateItem, { key: 'Home', bubbles: true });
    expect(document.activeElement).toBe(renameItem);

    // End
    fireEvent.keyDown(renameItem, { key: 'End', bubbles: true });
    expect(document.activeElement).toBe(deleteItem);

    // Escape closes menu and returns focus to trigger
    fireEvent.keyDown(deleteItem, { key: 'Escape', bubbles: true });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });
});
