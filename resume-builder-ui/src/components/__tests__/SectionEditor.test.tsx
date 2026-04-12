import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SectionEditor from '../SectionEditor';

// Mock SectionControls since we only test SectionEditor's own a11y attributes
vi.mock('../SectionControls', () => ({
  default: () => <div data-testid="section-controls" />,
}));

describe('SectionEditor', () => {
  const makeSection = (name: string, type: string, content: any) => ({
    name,
    type,
    content,
  });

  const defaultProps = {
    sectionIndex: 0,
    sections: [makeSection('Custom Skills', 'text', 'Some content')],
    setSections: vi.fn(),
  };

  it('Edit button has aria-label="Edit Section Name" for non-fixed sections', () => {
    render(
      <SectionEditor
        section={defaultProps.sections[0]}
        {...defaultProps}
      />
    );
    const editBtn = screen.getByRole('button', { name: 'Edit Section Name' });
    expect(editBtn).toBeInTheDocument();
    expect(editBtn).toHaveAttribute('aria-label', 'Edit Section Name');
  });

  it('Edit button has focus-visible:ring classes', () => {
    render(
      <SectionEditor
        section={defaultProps.sections[0]}
        {...defaultProps}
      />
    );
    const editBtn = screen.getByRole('button', { name: 'Edit Section Name' });
    expect(editBtn.className).toMatch(/focus-visible:ring/);
  });

  it('does not render Edit button for fixed sections', () => {
    const fixedSection = makeSection('Contact Information', 'text', 'content');
    render(
      <SectionEditor
        section={fixedSection}
        sectionIndex={0}
        sections={[fixedSection]}
        setSections={vi.fn()}
      />
    );
    expect(screen.queryByRole('button', { name: 'Edit Section Name' })).not.toBeInTheDocument();
  });

  describe('when editing name', () => {
    function renderInEditMode() {
      const setSections = vi.fn();
      const section = makeSection('Custom Skills', 'text', 'Some content');
      render(
        <SectionEditor
          section={section}
          sectionIndex={0}
          sections={[section]}
          setSections={setSections}
        />
      );
      // Click edit to enter editing mode
      fireEvent.click(screen.getByRole('button', { name: 'Edit Section Name' }));
      return { setSections };
    }

    it('Save button has aria-label="Save Section Name"', () => {
      renderInEditMode();
      const saveBtn = screen.getByRole('button', { name: 'Save Section Name' });
      expect(saveBtn).toBeInTheDocument();
      expect(saveBtn).toHaveAttribute('aria-label', 'Save Section Name');
    });

    it('Save button has focus-visible:ring classes', () => {
      renderInEditMode();
      const saveBtn = screen.getByRole('button', { name: 'Save Section Name' });
      expect(saveBtn.className).toMatch(/focus-visible:ring/);
    });

    it('Cancel button has aria-label="Cancel Edit"', () => {
      renderInEditMode();
      const cancelBtn = screen.getByRole('button', { name: 'Cancel Edit' });
      expect(cancelBtn).toBeInTheDocument();
      expect(cancelBtn).toHaveAttribute('aria-label', 'Cancel Edit');
    });

    it('Cancel button has focus-visible:ring classes', () => {
      renderInEditMode();
      const cancelBtn = screen.getByRole('button', { name: 'Cancel Edit' });
      expect(cancelBtn.className).toMatch(/focus-visible:ring/);
    });
  });

  describe('list content actions', () => {
    it('Remove button has focus-visible:ring classes', () => {
      const listSection = makeSection('Skills', 'icon-list', [
        { icon: '', text: 'Item 1' },
      ]);
      render(
        <SectionEditor
          section={listSection}
          sectionIndex={0}
          sections={[listSection]}
          setSections={vi.fn()}
        />
      );
      const removeBtn = screen.getByRole('button', { name: 'Remove' });
      expect(removeBtn.className).toMatch(/focus-visible:ring/);
    });

    it('Add Item button has focus-visible:ring classes', () => {
      const listSection = makeSection('Skills', 'icon-list', [
        { icon: '', text: 'Item 1' },
      ]);
      render(
        <SectionEditor
          section={listSection}
          sectionIndex={0}
          sections={[listSection]}
          setSections={vi.fn()}
        />
      );
      const addBtn = screen.getByRole('button', { name: 'Add Item' });
      expect(addBtn.className).toMatch(/focus-visible:ring/);
    });
  });
});
