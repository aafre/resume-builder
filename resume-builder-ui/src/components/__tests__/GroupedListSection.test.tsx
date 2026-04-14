import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupedListSection from '../GroupedListSection';

// Mock SectionHeader to simplify tests — it's tested separately
vi.mock('../SectionHeader', () => ({
  SectionHeader: ({ title, isCollapsed, onToggleCollapse, onDelete }: any) => (
    <div data-testid="section-header">
      <span>{title}</span>
      <button onClick={onToggleCollapse} data-testid="toggle-collapse">
        {isCollapsed ? 'Expand' : 'Collapse'}
      </button>
      <button onClick={onDelete} data-testid="delete-section">Delete</button>
    </div>
  ),
}));

// Mock GhostButton
vi.mock('../shared/GhostButton', () => ({
  GhostButton: ({ onClick, children }: any) => (
    <button onClick={onClick} data-testid="add-category-btn">{children}</button>
  ),
}));

function createDefaultProps(overrides = {}) {
  return {
    sectionName: 'Technical Skills',
    groups: [
      { label: 'Languages', items: ['Python', 'JavaScript'] },
      { label: 'Frameworks', items: ['React', 'Django'] },
    ],
    onUpdate: vi.fn(),
    onTitleEdit: vi.fn(),
    onTitleSave: vi.fn(),
    onTitleCancel: vi.fn(),
    onDelete: vi.fn(),
    isEditing: false,
    temporaryTitle: '',
    setTemporaryTitle: vi.fn(),
    ...overrides,
  };
}

describe('GroupedListSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to desktop viewport
    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
  });

  describe('rendering', () => {
    it('renders section header with title', () => {
      render(<GroupedListSection {...createDefaultProps()} />);
      expect(screen.getByText('Technical Skills')).toBeInTheDocument();
    });

    it('renders all groups with labels and items', () => {
      render(<GroupedListSection {...createDefaultProps()} />);
      const inputs = screen.getAllByRole('textbox');
      // 2 groups × 2 inputs each (label + items)
      expect(inputs).toHaveLength(4);
      expect(inputs[0]).toHaveValue('Languages');
      expect(inputs[1]).toHaveValue('Python, JavaScript');
      expect(inputs[2]).toHaveValue('Frameworks');
      expect(inputs[3]).toHaveValue('React, Django');
    });

    it('renders add category button', () => {
      render(<GroupedListSection {...createDefaultProps()} />);
      expect(screen.getByTestId('add-category-btn')).toBeInTheDocument();
    });
  });

  describe('group editing', () => {
    it('calls onUpdate when label is changed', () => {
      const onUpdate = vi.fn();
      render(<GroupedListSection {...createDefaultProps({ onUpdate })} />);

      const labelInput = screen.getAllByRole('textbox')[0];
      fireEvent.change(labelInput, { target: { value: 'Programming' } });

      expect(onUpdate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ label: 'Programming' }),
        ])
      );
    });

    it('calls onUpdate when items are changed', () => {
      const onUpdate = vi.fn();
      render(<GroupedListSection {...createDefaultProps({ onUpdate })} />);

      const itemsInput = screen.getAllByRole('textbox')[1];
      fireEvent.change(itemsInput, { target: { value: 'Go, Rust' } });

      expect(onUpdate).toHaveBeenCalled();
      const updatedGroups = onUpdate.mock.calls[0][0];
      expect(updatedGroups[0].items).toEqual(['Go', 'Rust']);
    });
  });

  describe('add group', () => {
    it('adds a new empty group when add button is clicked', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(<GroupedListSection {...createDefaultProps({ onUpdate })} />);

      await user.click(screen.getByTestId('add-category-btn'));

      expect(onUpdate).toHaveBeenCalledWith([
        { label: 'Languages', items: ['Python', 'JavaScript'] },
        { label: 'Frameworks', items: ['React', 'Django'] },
        { label: '', items: [] },
      ]);
    });
  });

  describe('delete group', () => {
    it('removes group when delete button is clicked', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(<GroupedListSection {...createDefaultProps({ onUpdate })} />);

      // Find delete buttons (titled "Remove group")
      const deleteButtons = screen.getAllByTitle('Remove group');
      await user.click(deleteButtons[0]);

      expect(onUpdate).toHaveBeenCalledWith([
        { label: 'Frameworks', items: ['React', 'Django'] },
      ]);
    });
  });

  describe('collapse behavior', () => {
    it('starts expanded on desktop (>= 1024px)', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
      render(<GroupedListSection {...createDefaultProps()} />);

      // Content should be visible
      expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
    });

    it('starts collapsed on mobile (< 1024px)', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
      render(<GroupedListSection {...createDefaultProps()} />);

      // Content should be hidden — no textboxes visible
      expect(screen.queryAllByRole('textbox')).toHaveLength(0);
    });

    it('toggles collapse when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<GroupedListSection {...createDefaultProps()} />);

      // Initially expanded
      expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);

      // Click collapse
      await user.click(screen.getByTestId('toggle-collapse'));
      expect(screen.queryAllByRole('textbox')).toHaveLength(0);

      // Click expand
      await user.click(screen.getByTestId('toggle-collapse'));
      expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
    });
  });

  describe('delete button accessibility', () => {
    it('delete buttons have focus:opacity-100 class for keyboard accessibility', () => {
      render(<GroupedListSection {...createDefaultProps()} />);
      const deleteButtons = screen.getAllByTitle('Remove group');
      deleteButtons.forEach((btn) => {
        expect(btn.className).toContain('focus:opacity-100');
      });
    });

    it('delete buttons use md:opacity-0 (visible on mobile, hidden on desktop)', () => {
      render(<GroupedListSection {...createDefaultProps()} />);
      const deleteButtons = screen.getAllByTitle('Remove group');
      deleteButtons.forEach((btn) => {
        expect(btn.className).toContain('md:opacity-0');
        expect(btn.className).toContain('md:group-hover:opacity-100');
      });
    });
  });

  describe('empty state', () => {
    it('renders with no groups', () => {
      render(<GroupedListSection {...createDefaultProps({ groups: [] })} />);
      expect(screen.queryAllByRole('textbox')).toHaveLength(0);
      expect(screen.getByTestId('add-category-btn')).toBeInTheDocument();
    });
  });
});
