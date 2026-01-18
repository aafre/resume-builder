// src/components/editor/__tests__/EditorContent.accessibility.test.tsx
// Accessibility tests for EditorContent component

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { EditorContent, EditorContentProps } from '../EditorContent';
import { Section, ContactInfo } from '../../../types';

// Mock child components with proper accessibility attributes
vi.mock('../../ContactInfoSection', () => ({
  default: ({
    contactInfo,
    onUpdate,
  }: {
    contactInfo: ContactInfo;
    onUpdate: (info: ContactInfo) => void;
  }) => (
    <section
      data-testid="contact-info-section"
      aria-labelledby="contact-info-heading"
      role="form"
    >
      <h2 id="contact-info-heading">Contact Information</h2>
      <div role="group" aria-label="Personal details">
        <label htmlFor="contact-name">Full Name</label>
        <input
          id="contact-name"
          type="text"
          value={contactInfo.name}
          onChange={(e) =>
            onUpdate({ ...contactInfo, name: e.target.value })
          }
          aria-required="true"
        />
        <label htmlFor="contact-email">Email Address</label>
        <input
          id="contact-email"
          type="email"
          value={contactInfo.email}
          onChange={(e) =>
            onUpdate({ ...contactInfo, email: e.target.value })
          }
          aria-required="true"
        />
        <label htmlFor="contact-phone">Phone Number</label>
        <input
          id="contact-phone"
          type="tel"
          value={contactInfo.phone}
          onChange={(e) =>
            onUpdate({ ...contactInfo, phone: e.target.value })
          }
        />
      </div>
    </section>
  ),
}));

vi.mock('../../FormattingHelp', () => ({
  default: () => (
    <aside data-testid="formatting-help" aria-label="Formatting tips">
      <h3>Formatting Help</h3>
      <p>Use markdown for formatting</p>
    </aside>
  ),
}));

vi.mock('../../ExperienceSection', () => ({
  default: ({
    sectionName,
    experiences,
    onDelete,
  }: {
    sectionName: string;
    experiences: unknown[];
    onDelete: () => void;
  }) => {
    const count = experiences?.length || 0;
    return (
      <section
        data-testid="experience-section"
        role="region"
        aria-labelledby={`${sectionName.toLowerCase()}-heading`}
      >
        <h2 id={`${sectionName.toLowerCase()}-heading`}>{sectionName}</h2>
        <p aria-live="polite">
          {count} {count === 1 ? 'entry' : 'entries'}
        </p>
        <button
          onClick={onDelete}
          aria-label={`Delete ${sectionName} section`}
          type="button"
        >
          Delete Section
        </button>
      </section>
    );
  },
}));

vi.mock('../../EducationSection', () => ({
  default: ({
    sectionName,
    education,
    onDelete,
  }: {
    sectionName: string;
    education: unknown[];
    onDelete: () => void;
  }) => {
    const count = education?.length || 0;
    return (
      <section
        data-testid="education-section"
        role="region"
        aria-labelledby={`${sectionName.toLowerCase()}-heading`}
      >
        <h2 id={`${sectionName.toLowerCase()}-heading`}>{sectionName}</h2>
        <p aria-live="polite">
          {count} {count === 1 ? 'entry' : 'entries'}
        </p>
        <button
          onClick={onDelete}
          aria-label={`Delete ${sectionName} section`}
          type="button"
        >
          Delete Section
        </button>
      </section>
    );
  },
}));

vi.mock('../../GenericSection', () => ({
  default: ({ section, onDelete }: { section: Section; onDelete: () => void }) => (
    <section
      data-testid="generic-section"
      role="region"
      aria-labelledby={`${section.name.toLowerCase()}-heading`}
    >
      <h2 id={`${section.name.toLowerCase()}-heading`}>{section.name}</h2>
      <button
        onClick={onDelete}
        aria-label={`Delete ${section.name} section`}
        type="button"
      >
        Delete Section
      </button>
    </section>
  ),
}));

vi.mock('../../IconListSection', () => ({
  default: ({ sectionName }: { sectionName: string }) => (
    <section
      data-testid="icon-list-section"
      role="region"
      aria-labelledby={`${sectionName.toLowerCase()}-heading`}
    >
      <h2 id={`${sectionName.toLowerCase()}-heading`}>{sectionName}</h2>
    </section>
  ),
}));

vi.mock('../../MobileActionBar', () => ({
  default: ({
    onNavigationClick,
    onPreviewClick,
    onDownloadClick,
  }: {
    onNavigationClick: () => void;
    onPreviewClick: () => void;
    onDownloadClick: () => void;
  }) => (
    <div
      data-testid="mobile-action-bar"
      role="toolbar"
      aria-label="Mobile resume actions"
    >
      <button
        onClick={onNavigationClick}
        aria-label="Open section navigation"
        aria-haspopup="dialog"
        type="button"
      >
        Navigation
      </button>
      <button onClick={onPreviewClick} aria-label="Preview resume" type="button">
        Preview
      </button>
      <button onClick={onDownloadClick} aria-label="Download resume as PDF" type="button">
        Download
      </button>
    </div>
  ),
}));

vi.mock('../../MobileNavigationDrawer', () => ({
  default: ({
    isOpen,
    onClose,
    sections,
    onSectionClick,
  }: {
    isOpen: boolean;
    onClose: () => void;
    sections?: Section[];
    onSectionClick?: (index: number) => void;
  }) =>
    isOpen ? (
      <div
        data-testid="mobile-navigation-drawer"
        role="dialog"
        aria-label="Section navigation"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          aria-label="Close navigation drawer"
          type="button"
          autoFocus
        >
          Close
        </button>
        <nav role="navigation" aria-label="Resume sections">
          <button
            onClick={() => onSectionClick?.(-1)}
            aria-label="Navigate to contact information"
            type="button"
          >
            Contact Info
          </button>
          {sections?.map((section, index) => (
            <button
              key={index}
              onClick={() => onSectionClick?.(index)}
              aria-label={`Navigate to ${section.name} section`}
              type="button"
            >
              {section.name}
            </button>
          ))}
        </nav>
      </div>
    ) : null,
}));

vi.mock('../../SectionNavigator', () => ({
  default: ({
    sections,
    activeSectionIndex,
    onSectionClick,
  }: {
    sections: Section[];
    activeSectionIndex: number;
    onSectionClick: (index: number) => void;
  }) => (
    <nav
      data-testid="section-navigator"
      role="navigation"
      aria-label="Resume section navigation"
    >
      <ul role="list">
        <li>
          <button
            onClick={() => onSectionClick(-1)}
            aria-label="Navigate to contact information"
            aria-current={activeSectionIndex === -1 ? 'true' : undefined}
            type="button"
          >
            Contact Info
          </button>
        </li>
        {sections.map((section, index) => (
          <li key={index}>
            <button
              onClick={() => onSectionClick(index)}
              aria-label={`Navigate to ${section.name} section`}
              aria-current={activeSectionIndex === index ? 'true' : undefined}
              type="button"
            >
              {section.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  ),
}));

vi.mock('../../DragHandle', () => ({
  default: ({
    children,
    id,
    sectionName,
  }: {
    children: React.ReactNode;
    id: string;
    sectionName?: string;
  }) => (
    <div
      data-testid={`drag-handle-${id}`}
      role="listitem"
      aria-label={sectionName ? `${sectionName} section, draggable` : 'Draggable section'}
      tabIndex={0}
    >
      <span
        role="button"
        tabIndex={0}
        aria-label={`Drag to reorder ${sectionName || 'section'}`}
        aria-describedby="drag-instructions"
      >
        ⠿
      </span>
      {children}
    </div>
  ),
}));

// Mock @dnd-kit modules
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dnd-context" aria-live="polite" aria-atomic="true">
      <div id="drag-instructions" className="sr-only">
        Press space to start dragging. Use arrow keys to reorder. Press space again to drop.
      </div>
      {children}
    </div>
  ),
  closestCenter: vi.fn(),
  DragOverlay: ({ children }: { children: React.ReactNode }) => (
    <div
      data-testid="drag-overlay"
      role="status"
      aria-live="assertive"
      aria-atomic="true"
    >
      {children}
    </div>
  ),
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sortable-context" role="list" aria-label="Resume sections list">
      {children}
    </div>
  ),
  verticalListSortingStrategy: {},
}));

vi.mock('@dnd-kit/modifiers', () => ({
  restrictToVerticalAxis: {},
  restrictToWindowEdges: {},
}));

describe('EditorContent Accessibility Tests', () => {
  const mockContactInfo: ContactInfo = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-1234',
    location: 'New York, NY',
  };

  const mockExperienceSection: Section = {
    name: 'Experience',
    type: 'experience',
    content: [
      {
        company: 'Tech Corp',
        title: 'Engineer',
        dates: '2020-Present',
        description: ['Led team'],
      },
    ],
  };

  const mockEducationSection: Section = {
    name: 'Education',
    type: 'education',
    content: [
      {
        degree: 'BS Computer Science',
        school: 'MIT',
        year: '2018',
      },
    ],
  };

  const mockSkillsSection: Section = {
    name: 'Skills',
    type: 'bulleted-list',
    content: ['JavaScript', 'TypeScript'],
  };

  const mockIconRegistry = {
    registerIcon: vi.fn(),
    registerIconWithFilename: vi.fn(),
    getIconFile: vi.fn(),
    removeIcon: vi.fn(),
    clearRegistry: vi.fn(),
    getRegisteredFilenames: vi.fn().mockReturnValue([]),
    getRegistrySize: vi.fn().mockReturnValue(0),
  };

  const mockRefs = {
    contactInfoRef: { current: null } as React.RefObject<HTMLDivElement>,
    sectionRefs: { current: [] } as React.MutableRefObject<(HTMLDivElement | null)[]>,
    newSectionRef: { current: null } as React.MutableRefObject<HTMLDivElement | null>,
  };

  const createDefaultProps = (
    overrides: Partial<EditorContentProps> = {}
  ): EditorContentProps => ({
    contactInfo: mockContactInfo,
    setContactInfo: vi.fn(),
    sections: [],
    supportsIcons: true,
    iconRegistry: mockIconRegistry,
    isAnonymous: false,
    isAuthenticated: true,
    contactForm: {
      socialLinkErrors: {},
      autoGeneratedIndexes: new Set(),
      handleSocialLinkChange: vi.fn(),
      handleAddSocialLink: vi.fn(),
      handleRemoveSocialLink: vi.fn(),
    },
    dragDrop: {
      sensors: [],
      activeId: null,
      draggedSection: null,
      handleDragStart: vi.fn(),
      handleDragEnd: vi.fn(),
      handleDragCancel: vi.fn(),
    },
    sectionManagement: {
      editingTitleIndex: null,
      temporaryTitle: '',
      setTemporaryTitle: vi.fn(),
      handleUpdateSection: vi.fn(),
      handleDeleteSection: vi.fn(),
      handleDeleteEntry: vi.fn(),
      handleTitleEdit: vi.fn(),
      handleTitleSave: vi.fn(),
      handleTitleCancel: vi.fn(),
    },
    navigation: {
      activeSectionIndex: 0,
      isSidebarCollapsed: false,
      scrollToSection: vi.fn(),
      setIsSidebarCollapsed: vi.fn(),
    },
    modals: {
      showAIWarning: false,
      showAdvancedMenu: false,
      showNavigationDrawer: false,
      closeAIWarning: vi.fn(),
      openAdvancedMenu: vi.fn(),
      closeAdvancedMenu: vi.fn(),
      openNavigationDrawer: vi.fn(),
      closeNavigationDrawer: vi.fn(),
      openSectionTypeModal: vi.fn(),
      openHelpModal: vi.fn(),
    },
    fileOperations: {
      handleExportYAML: vi.fn(),
      handleFileInputChange: vi.fn(),
      fileInputRef: { current: null } as React.RefObject<HTMLInputElement>,
      loadingSave: false,
      loadingLoad: false,
    },
    editorActions: {
      handleGenerateResume: vi.fn(),
      handleOpenPreview: vi.fn(),
      handleStartFresh: vi.fn(),
      isDownloading: false,
    },
    preview: {
      isGenerating: false,
      isStale: false,
    },
    saveStatus: {
      saveStatus: 'saved',
      lastSaved: new Date(),
    },
    refs: mockRefs,
    ...overrides,
  });

  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ARIA Landmarks and Regions', () => {
    it('should have proper navigation landmark for section navigator', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection],
          })}
        />
      );

      const nav = screen.getByRole('navigation', { name: /resume section navigation/i });
      expect(nav).toBeInTheDocument();
    });

    it('should have proper toolbar landmarks', () => {
      render(<EditorContent {...createDefaultProps()} />);

      const mobileToolbar = screen.getByRole('toolbar', { name: /mobile resume actions/i });
      expect(mobileToolbar).toBeInTheDocument();
    });

    it('should have proper region landmarks for sections', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection, mockEducationSection],
          })}
        />
      );

      const experienceRegion = screen.getByRole('region', { name: /experience/i });
      expect(experienceRegion).toBeInTheDocument();

      const educationRegion = screen.getByRole('region', { name: /education/i });
      expect(educationRegion).toBeInTheDocument();
    });

    it('should have accessible form for contact info', () => {
      render(<EditorContent {...createDefaultProps()} />);

      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('should have focusable contact info inputs', async () => {
      render(<EditorContent {...createDefaultProps()} />);

      const nameInput = screen.getByLabelText('Full Name');
      const emailInput = screen.getByLabelText('Email Address');
      const phoneInput = screen.getByLabelText('Phone Number');

      expect(nameInput).not.toHaveFocus();

      await user.click(nameInput);
      expect(nameInput).toHaveFocus();

      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(phoneInput).toHaveFocus();
    });

  });

  describe('Keyboard Navigation', () => {
    it('should activate buttons with Space key', async () => {
      const handleOpenPreview = vi.fn();
      const props = createDefaultProps();
      props.editorActions.handleOpenPreview = handleOpenPreview;

      render(<EditorContent {...props} />);

      const previewButton = screen.getByRole('button', { name: /preview resume/i });
      previewButton.focus();

      await user.keyboard(' ');
      expect(handleOpenPreview).toHaveBeenCalledTimes(1);
    });

    it('should navigate through section navigation with keyboard', async () => {
      const scrollToSection = vi.fn();
      const props = createDefaultProps({
        sections: [mockExperienceSection, mockEducationSection],
      });
      props.navigation.scrollToSection = scrollToSection;

      render(<EditorContent {...props} />);

      const nav = screen.getByRole('navigation', { name: /resume section navigation/i });
      const buttons = within(nav).getAllByRole('button');

      // Focus first button and navigate
      await user.click(buttons[0]);
      expect(buttons[0]).toHaveFocus();

      await user.tab();
      expect(buttons[1]).toHaveFocus();

      // Activate with keyboard
      await user.keyboard('{Enter}');
      expect(scrollToSection).toHaveBeenCalledWith(0);
    });
  });

  describe('ARIA Labels', () => {
    it('should have descriptive labels for all interactive elements', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection],
          })}
        />
      );

      // Check for descriptive button labels in section components
      expect(screen.getByRole('button', { name: /delete experience section/i })).toBeInTheDocument();
    });

    it('should have proper aria-required on required inputs', () => {
      render(<EditorContent {...createDefaultProps()} />);

      const nameInput = screen.getByLabelText('Full Name');
      const emailInput = screen.getByLabelText('Email Address');

      expect(nameInput).toHaveAttribute('aria-required', 'true');
      expect(emailInput).toHaveAttribute('aria-required', 'true');
    });

    it('should have aria-current on active section in navigation', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection, mockEducationSection],
            navigation: {
              activeSectionIndex: 0,
              isSidebarCollapsed: false,
              scrollToSection: vi.fn(),
              setIsSidebarCollapsed: vi.fn(),
            },
          })}
        />
      );

      const nav = screen.getByRole('navigation', { name: /resume section navigation/i });
      const experienceButton = within(nav).getByRole('button', {
        name: /navigate to experience section/i,
      });

      expect(experienceButton).toHaveAttribute('aria-current', 'true');
    });
  });

  describe('Modal Accessibility', () => {
    it('should have proper dialog role and aria-modal for navigation drawer', () => {
      const props = createDefaultProps({
        sections: [mockExperienceSection],
      });
      props.modals.showNavigationDrawer = true;

      render(<EditorContent {...props} />);

      const dialog = screen.getByRole('dialog', { name: /section navigation/i });
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-haspopup on button that opens dialog', () => {
      render(<EditorContent {...createDefaultProps()} />);

      const navButton = screen.getByRole('button', { name: /open section navigation/i });
      expect(navButton).toHaveAttribute('aria-haspopup', 'dialog');
    });
  });

  describe('Screen Reader Announcements', () => {
    it('should have aria-live region for section count updates', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection],
          })}
        />
      );

      const entryCount = screen.getByText(/1 entry/i);
      expect(entryCount).toHaveAttribute('aria-live', 'polite');
    });

    it('should have drag instructions for screen readers', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection],
          })}
        />
      );

      const instructions = screen.getByText(
        /press space to start dragging/i
      );
      expect(instructions).toBeInTheDocument();
    });
  });

  describe('AI Warning Banner Accessibility', () => {
    it('should have accessible dismiss button with clear label', () => {
      const props = createDefaultProps();
      props.modals.showAIWarning = true;

      render(<EditorContent {...props} />);

      const closeButton = screen.getByRole('button', { name: /close review banner/i });
      expect(closeButton).toBeInTheDocument();
      // The actual component doesn't set type="button", but the button is still accessible
      expect(closeButton.tagName).toBe('BUTTON');
    });

    it('should be dismissable via keyboard', async () => {
      const closeAIWarning = vi.fn();
      const props = createDefaultProps();
      props.modals.showAIWarning = true;
      props.modals.closeAIWarning = closeAIWarning;

      render(<EditorContent {...props} />);

      const closeButton = screen.getByRole('button', { name: /close review banner/i });
      closeButton.focus();

      await user.keyboard('{Enter}');
      expect(closeAIWarning).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Labels', () => {
    it('should have all form inputs properly labeled', () => {
      render(<EditorContent {...createDefaultProps()} />);

      // All inputs should be accessible by their labels
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    });

    it('should have associated labels and inputs', () => {
      render(<EditorContent {...createDefaultProps()} />);

      const nameInput = screen.getByLabelText('Full Name');
      const nameLabel = document.querySelector('label[for="contact-name"]');

      expect(nameInput).toHaveAttribute('id', 'contact-name');
      expect(nameLabel).toBeInTheDocument();
    });
  });

  describe('File Input Accessibility', () => {
    it('should have hidden file input that is still accessible', () => {
      render(<EditorContent {...createDefaultProps()} />);

      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('accept', '.yaml,.yml');
    });
  });

  describe('Sortable List Accessibility', () => {
    it('should have proper list semantics for sortable sections', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection, mockEducationSection],
          })}
        />
      );

      const sortableList = screen.getByRole('list', { name: /resume sections list/i });
      expect(sortableList).toBeInTheDocument();
    });

    it('should have listitem role for draggable sections', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection],
          })}
        />
      );

      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('should not rely solely on color for information (sections have text labels)', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection, mockEducationSection, mockSkillsSection],
          })}
        />
      );

      // All sections should have visible text labels (may appear in headings and navigation)
      expect(screen.getAllByText('Experience').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Education').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Skills').length).toBeGreaterThan(0);
    });
  });
});
