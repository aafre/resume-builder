// src/components/editor/__tests__/SectionRenderer.test.tsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionRenderer from '../SectionRenderer';
import { Section, IconListItem } from '../../../types';
import { EditorContentIconRegistry } from '../EditorContent';

// Mock child components to isolate SectionRenderer behavior
vi.mock('../../ExperienceSection', () => ({
  default: ({ sectionName, onTitleEdit, onDelete }: { sectionName: string; onTitleEdit: () => void; onDelete: () => void }) => (
    <div data-testid="experience-section" data-section-name={sectionName}>
      <button data-testid="exp-title-edit" onClick={onTitleEdit}>Edit Title</button>
      <button data-testid="exp-delete" onClick={onDelete}>Delete</button>
    </div>
  ),
}));

vi.mock('../../EducationSection', () => ({
  default: ({ sectionName, onTitleEdit, onDelete }: { sectionName: string; onTitleEdit: () => void; onDelete: () => void }) => (
    <div data-testid="education-section" data-section-name={sectionName}>
      <button data-testid="edu-title-edit" onClick={onTitleEdit}>Edit Title</button>
      <button data-testid="edu-delete" onClick={onDelete}>Delete</button>
    </div>
  ),
}));

vi.mock('../../GenericSection', () => ({
  default: ({ section, onEditTitle, onDelete }: { section: Section; onEditTitle: () => void; onDelete: () => void }) => (
    <div data-testid="generic-section" data-section-name={section.name} data-section-type={section.type}>
      <button data-testid="gen-title-edit" onClick={onEditTitle}>Edit Title</button>
      <button data-testid="gen-delete" onClick={onDelete}>Delete</button>
    </div>
  ),
}));

vi.mock('../../IconListSection', () => ({
  default: ({ sectionName, onEditTitle, onDelete }: { sectionName: string; onEditTitle: () => void; onDelete: () => void }) => (
    <div data-testid="icon-list-section" data-section-name={sectionName}>
      <button data-testid="icon-title-edit" onClick={onEditTitle}>Edit Title</button>
      <button data-testid="icon-delete" onClick={onDelete}>Delete</button>
    </div>
  ),
}));

describe('SectionRenderer', () => {
  // Mock icon registry
  const mockIconRegistry: EditorContentIconRegistry = {
    registerIcon: vi.fn(),
    registerIconWithFilename: vi.fn(),
    getIconFile: vi.fn(),
    removeIcon: vi.fn(),
    clearRegistry: vi.fn(),
    getRegisteredFilenames: vi.fn().mockReturnValue([]),
    getRegistrySize: vi.fn().mockReturnValue(0),
  };

  // Mock handlers
  let mockHandleUpdateSection: ReturnType<typeof vi.fn>;
  let mockHandleDeleteSection: ReturnType<typeof vi.fn>;
  let mockHandleDeleteEntry: ReturnType<typeof vi.fn>;
  let mockHandleReorderEntry: ReturnType<typeof vi.fn>;
  let mockHandleTitleEdit: ReturnType<typeof vi.fn>;
  let mockHandleTitleSave: ReturnType<typeof vi.fn>;
  let mockHandleTitleCancel: ReturnType<typeof vi.fn>;
  let mockSetTemporaryTitle: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHandleUpdateSection = vi.fn();
    mockHandleDeleteSection = vi.fn();
    mockHandleDeleteEntry = vi.fn();
    mockHandleReorderEntry = vi.fn();
    mockHandleTitleEdit = vi.fn();
    mockHandleTitleSave = vi.fn();
    mockHandleTitleCancel = vi.fn();
    mockSetTemporaryTitle = vi.fn();
  });

  // Test sections
  const experienceSection: Section = {
    name: 'Work Experience',
    type: 'experience',
    content: [
      {
        company: 'Tech Corp',
        title: 'Engineer',
        dates: '2020-Present',
        description: ['Built features'],
      },
    ],
  };

  const educationSection: Section = {
    name: 'Education',
    type: 'education',
    content: [
      {
        degree: 'BS Computer Science',
        school: 'MIT',
        year: '2020',
      },
    ],
  };

  const iconListSection: Section = {
    name: 'Certifications',
    type: 'icon-list',
    content: [
      {
        certification: 'AWS',
        issuer: 'Amazon',
        date: '2023',
        icon: 'aws.png',
      },
    ] as IconListItem[],
  };

  const genericSection: Section = {
    name: 'Skills',
    type: 'bulleted-list',
    content: ['JavaScript', 'TypeScript'],
  };

  const textSection: Section = {
    name: 'Summary',
    type: 'text',
    content: 'Professional summary here',
  };

  const createDefaultProps = (section: Section, index: number = 0) => ({
    section,
    index,
    handleUpdateSection: mockHandleUpdateSection,
    handleDeleteSection: mockHandleDeleteSection,
    handleDeleteEntry: mockHandleDeleteEntry,
    handleReorderEntry: mockHandleReorderEntry,
    handleTitleEdit: mockHandleTitleEdit,
    handleTitleSave: mockHandleTitleSave,
    handleTitleCancel: mockHandleTitleCancel,
    isEditingTitle: false,
    temporaryTitle: '',
    setTemporaryTitle: mockSetTemporaryTitle,
    supportsIcons: true,
    iconRegistry: mockIconRegistry,
  });

  describe('Section Type Routing', () => {
    it('should render ExperienceSection for experience type', () => {
      render(<SectionRenderer {...createDefaultProps(experienceSection)} />);

      expect(screen.getByTestId('experience-section')).toBeInTheDocument();
      expect(screen.getByTestId('experience-section')).toHaveAttribute(
        'data-section-name',
        'Work Experience'
      );
    });

    it('should render EducationSection for education type', () => {
      render(<SectionRenderer {...createDefaultProps(educationSection)} />);

      expect(screen.getByTestId('education-section')).toBeInTheDocument();
      expect(screen.getByTestId('education-section')).toHaveAttribute(
        'data-section-name',
        'Education'
      );
    });

    it('should render IconListSection for icon-list type', () => {
      render(<SectionRenderer {...createDefaultProps(iconListSection)} />);

      expect(screen.getByTestId('icon-list-section')).toBeInTheDocument();
      expect(screen.getByTestId('icon-list-section')).toHaveAttribute(
        'data-section-name',
        'Certifications'
      );
    });

    it('should render GenericSection for bulleted-list type', () => {
      render(<SectionRenderer {...createDefaultProps(genericSection)} />);

      expect(screen.getByTestId('generic-section')).toBeInTheDocument();
      expect(screen.getByTestId('generic-section')).toHaveAttribute(
        'data-section-name',
        'Skills'
      );
      expect(screen.getByTestId('generic-section')).toHaveAttribute(
        'data-section-type',
        'bulleted-list'
      );
    });

    it('should render GenericSection for text type', () => {
      render(<SectionRenderer {...createDefaultProps(textSection)} />);

      expect(screen.getByTestId('generic-section')).toBeInTheDocument();
      expect(screen.getByTestId('generic-section')).toHaveAttribute(
        'data-section-name',
        'Summary'
      );
      expect(screen.getByTestId('generic-section')).toHaveAttribute(
        'data-section-type',
        'text'
      );
    });

    it('should render GenericSection for inline-list type', () => {
      const inlineListSection: Section = {
        name: 'Languages',
        type: 'inline-list',
        content: ['English', 'Spanish'],
      };
      render(<SectionRenderer {...createDefaultProps(inlineListSection)} />);

      expect(screen.getByTestId('generic-section')).toBeInTheDocument();
      expect(screen.getByTestId('generic-section')).toHaveAttribute(
        'data-section-type',
        'inline-list'
      );
    });

    it('should render GenericSection for dynamic-column-list type', () => {
      const dynamicColumnSection: Section = {
        name: 'Technologies',
        type: 'dynamic-column-list',
        content: ['React', 'Node.js', 'PostgreSQL'],
      };
      render(<SectionRenderer {...createDefaultProps(dynamicColumnSection)} />);

      expect(screen.getByTestId('generic-section')).toBeInTheDocument();
      expect(screen.getByTestId('generic-section')).toHaveAttribute(
        'data-section-type',
        'dynamic-column-list'
      );
    });

    it('should render ExperienceSection for legacy experience (name-based)', () => {
      const legacyExperience: Section = {
        name: 'Experience',
        content: [
          {
            company: 'Old Corp',
            title: 'Developer',
            dates: '2015-2020',
            description: ['Worked on projects'],
          },
        ],
      };
      render(<SectionRenderer {...createDefaultProps(legacyExperience)} />);

      expect(screen.getByTestId('experience-section')).toBeInTheDocument();
    });

    it('should render EducationSection for legacy education (name-based)', () => {
      const legacyEducation: Section = {
        name: 'Education',
        content: [
          {
            degree: 'BA',
            school: 'University',
            year: '2010',
          },
        ],
      };
      render(<SectionRenderer {...createDefaultProps(legacyEducation)} />);

      expect(screen.getByTestId('education-section')).toBeInTheDocument();
    });
  });

  describe('Callback Index Binding', () => {
    it('should call handleTitleEdit with correct index for experience section', () => {
      const index = 2;
      render(<SectionRenderer {...createDefaultProps(experienceSection, index)} />);

      screen.getByTestId('exp-title-edit').click();

      expect(mockHandleTitleEdit).toHaveBeenCalledTimes(1);
      expect(mockHandleTitleEdit).toHaveBeenCalledWith(index);
    });

    it('should call handleDeleteSection with correct index for experience section', () => {
      const index = 3;
      render(<SectionRenderer {...createDefaultProps(experienceSection, index)} />);

      screen.getByTestId('exp-delete').click();

      expect(mockHandleDeleteSection).toHaveBeenCalledTimes(1);
      expect(mockHandleDeleteSection).toHaveBeenCalledWith(index);
    });

    it('should call handleTitleEdit with correct index for education section', () => {
      const index = 1;
      render(<SectionRenderer {...createDefaultProps(educationSection, index)} />);

      screen.getByTestId('edu-title-edit').click();

      expect(mockHandleTitleEdit).toHaveBeenCalledTimes(1);
      expect(mockHandleTitleEdit).toHaveBeenCalledWith(index);
    });

    it('should call handleDeleteSection with correct index for education section', () => {
      const index = 4;
      render(<SectionRenderer {...createDefaultProps(educationSection, index)} />);

      screen.getByTestId('edu-delete').click();

      expect(mockHandleDeleteSection).toHaveBeenCalledTimes(1);
      expect(mockHandleDeleteSection).toHaveBeenCalledWith(index);
    });

    it('should call handleTitleEdit with correct index for icon-list section', () => {
      const index = 5;
      render(<SectionRenderer {...createDefaultProps(iconListSection, index)} />);

      screen.getByTestId('icon-title-edit').click();

      expect(mockHandleTitleEdit).toHaveBeenCalledTimes(1);
      expect(mockHandleTitleEdit).toHaveBeenCalledWith(index);
    });

    it('should call handleDeleteSection with correct index for icon-list section', () => {
      const index = 0;
      render(<SectionRenderer {...createDefaultProps(iconListSection, index)} />);

      screen.getByTestId('icon-delete').click();

      expect(mockHandleDeleteSection).toHaveBeenCalledTimes(1);
      expect(mockHandleDeleteSection).toHaveBeenCalledWith(index);
    });

    it('should call handleTitleEdit with correct index for generic section', () => {
      const index = 6;
      render(<SectionRenderer {...createDefaultProps(genericSection, index)} />);

      screen.getByTestId('gen-title-edit').click();

      expect(mockHandleTitleEdit).toHaveBeenCalledTimes(1);
      expect(mockHandleTitleEdit).toHaveBeenCalledWith(index);
    });

    it('should call handleDeleteSection with correct index for generic section', () => {
      const index = 7;
      render(<SectionRenderer {...createDefaultProps(genericSection, index)} />);

      screen.getByTestId('gen-delete').click();

      expect(mockHandleDeleteSection).toHaveBeenCalledTimes(1);
      expect(mockHandleDeleteSection).toHaveBeenCalledWith(index);
    });
  });

  describe('Props Forwarding', () => {
    it('should forward isEditingTitle to child component', () => {
      const { rerender } = render(
        <SectionRenderer {...createDefaultProps(experienceSection)} isEditingTitle={false} />
      );

      // First render with isEditingTitle = false
      expect(screen.getByTestId('experience-section')).toBeInTheDocument();

      // Rerender with isEditingTitle = true
      rerender(
        <SectionRenderer {...createDefaultProps(experienceSection)} isEditingTitle={true} />
      );

      expect(screen.getByTestId('experience-section')).toBeInTheDocument();
    });

    it('should forward temporaryTitle to child component', () => {
      render(
        <SectionRenderer
          {...createDefaultProps(genericSection)}
          temporaryTitle="New Title"
        />
      );

      expect(screen.getByTestId('generic-section')).toBeInTheDocument();
    });

    it('should forward supportsIcons to child component', () => {
      render(
        <SectionRenderer
          {...createDefaultProps(experienceSection)}
          supportsIcons={false}
        />
      );

      expect(screen.getByTestId('experience-section')).toBeInTheDocument();
    });

    it('should forward iconRegistry to child component', () => {
      const customRegistry: EditorContentIconRegistry = {
        ...mockIconRegistry,
        getRegistrySize: vi.fn().mockReturnValue(5),
      };

      render(
        <SectionRenderer
          {...createDefaultProps(experienceSection)}
          iconRegistry={customRegistry}
        />
      );

      expect(screen.getByTestId('experience-section')).toBeInTheDocument();
    });
  });

  describe('Multiple Sections at Different Indices', () => {
    it('should correctly bind index 0', () => {
      render(<SectionRenderer {...createDefaultProps(experienceSection, 0)} />);
      screen.getByTestId('exp-delete').click();
      expect(mockHandleDeleteSection).toHaveBeenCalledWith(0);
    });

    it('should correctly bind large index', () => {
      render(<SectionRenderer {...createDefaultProps(educationSection, 99)} />);
      screen.getByTestId('edu-delete').click();
      expect(mockHandleDeleteSection).toHaveBeenCalledWith(99);
    });
  });

  describe('Edge Cases', () => {
    it('should handle section with empty content', () => {
      const emptySection: Section = {
        name: 'Empty Section',
        type: 'bulleted-list',
        content: [],
      };
      render(<SectionRenderer {...createDefaultProps(emptySection)} />);

      expect(screen.getByTestId('generic-section')).toBeInTheDocument();
    });

    it('should handle section with undefined type', () => {
      const noTypeSection: Section = {
        name: 'No Type Section',
        content: 'Some content',
      };
      render(<SectionRenderer {...createDefaultProps(noTypeSection)} />);

      // Should fall through to GenericSection
      expect(screen.getByTestId('generic-section')).toBeInTheDocument();
    });

    it('should handle section with special characters in name', () => {
      const specialNameSection: Section = {
        name: 'Skills & Technologies <v2>',
        type: 'bulleted-list',
        content: ['Test'],
      };
      render(<SectionRenderer {...createDefaultProps(specialNameSection)} />);

      expect(screen.getByTestId('generic-section')).toHaveAttribute(
        'data-section-name',
        'Skills & Technologies <v2>'
      );
    });
  });
});
